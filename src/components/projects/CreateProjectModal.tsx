import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigation } from "@/contexts/NavigationContext";
import { supabase } from "@/lib/supabase-config";
import { toast } from "@/hooks/use-toast";
import {
  X,
  Plus,
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Users,
  Loader2,
  Tag,
  CheckCircle,
  Building,
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userType, currentUser } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "applied">("create");
  const [appliedProjects, setAppliedProjects] = useState<any[]>([]);
  const [loadingApplied, setLoadingApplied] = useState(false);

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    duration: "",
    location: "",
    team_size: "",
    type: "freelance", // freelance, full-time, part-time
    status: "open", // open, in-progress, completed
  });

  const handleInputChange = (field: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  // Cargar proyectos aplicados cuando se abre la modal
  useEffect(() => {
    if (isOpen && userType === "developer" && currentUser?.id) {
      fetchAppliedProjects();
    }
  }, [isOpen, userType, currentUser]);

  const fetchAppliedProjects = async () => {
    setLoadingApplied(true);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          id,
          status,
          created_at,
          project:projects(
            id,
            title,
            description,
            budget_range,
            project_type,
            status,
            company:companies(name, sector),
            developer:developers(name, developer_type)
          )
        `
        )
        .eq("developer_id", currentUser?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAppliedProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching applied projects:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos aplicados",
        variant: "destructive",
      });
    } finally {
      setLoadingApplied(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser?.id) {
        throw new Error("Usuario no autenticado");
      }

      const projectInsert = {
        title: projectData.title,
        description: projectData.description,
        skills_required: projectData.skills
          ? projectData.skills.split(",").map((s) => s.trim())
          : [],
        budget_range: projectData.budget || null,
        project_type: projectData.type,
        status: projectData.status,
      };

      // Agregar el ID del creador según el tipo de usuario
      if (userType === "company") {
        projectInsert.company_id = currentUser.id;
      } else {
        projectInsert.developer_id = currentUser.id;
      }

      const { error } = await supabase.from("projects").insert(projectInsert);

      if (error) throw error;

      toast({
        title: "¡Proyecto creado exitosamente!",
        description:
          "Tu proyecto ha sido publicado y está visible para otros usuarios.",
      });

      // Reset form and close modal
      setProjectData({
        title: "",
        description: "",
        skills: "",
        budget: "",
        duration: "",
        location: "",
        team_size: "",
        type: "freelance",
        status: "open",
      });
      onClose();
    } catch (error: any) {
      console.error("Error creando proyecto:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el proyecto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-background rounded-lg border shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-xl font-bold">Gestionar Proyectos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {userType === "developer"
                ? "Crea proyectos o aplica a oportunidades existentes"
                : "Crea proyectos para encontrar el talento que necesitas"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Proyecto
              </TabsTrigger>
              {userType === "developer" && (
                <TabsTrigger
                  value="applied"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Proyectos Aplicados
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <form onSubmit={handleCreateProject} className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Información del Proyecto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título del Proyecto *</Label>
                      <Input
                        id="title"
                        placeholder="Ej: Desarrollo de App Móvil React Native"
                        value={projectData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe detalladamente el proyecto, objetivos, requisitos..."
                        value={projectData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Habilidades Requeridas</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="skills"
                          placeholder="React, TypeScript, Node.js, MongoDB..."
                          value={projectData.skills}
                          onChange={(e) =>
                            handleInputChange("skills", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Separa las habilidades con comas
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Detalles del Proyecto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Proyecto</Label>
                        <select
                          id="type"
                          value={projectData.type}
                          onChange={(e) =>
                            handleInputChange("type", e.target.value)
                          }
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          <option value="freelance">Freelance</option>
                          <option value="full-time">Tiempo Completo</option>
                          <option value="part-time">Tiempo Parcial</option>
                          <option value="contract">Contrato</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <select
                          id="status"
                          value={projectData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          <option value="open">Abierto</option>
                          <option value="in-progress">En Progreso</option>
                          <option value="completed">Completado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Presupuesto (opcional)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="budget"
                            placeholder="5000 - 10000 USD"
                            value={projectData.budget}
                            onChange={(e) =>
                              handleInputChange("budget", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duración (opcional)</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="duration"
                            placeholder="2-3 meses"
                            value={projectData.duration}
                            onChange={(e) =>
                              handleInputChange("duration", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Ubicación (opcional)</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="Remoto, Madrid, Barcelona..."
                            value={projectData.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="team_size">
                          Tamaño del Equipo (opcional)
                        </Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="team_size"
                            placeholder="1-3 personas"
                            value={projectData.team_size}
                            onChange={(e) =>
                              handleInputChange("team_size", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Creando proyecto..." : "Crear Proyecto"}
                </Button>
              </form>
            </TabsContent>

            {userType === "developer" && (
              <TabsContent value="applied" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Proyectos Aplicados
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Lista de proyectos a los que has aplicado
                    </p>
                  </CardHeader>
                  <CardContent>
                    {loadingApplied ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span className="text-muted-foreground">
                          Cargando proyectos...
                        </span>
                      </div>
                    ) : appliedProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No has aplicado a ningún proyecto aún
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Ve a la sección de Proyectos para encontrar
                          oportunidades
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {appliedProjects.map((application) => {
                          const project = application.project;
                          if (!project) return null;

                          const getStatusColor = (status: string) => {
                            switch (status) {
                              case "pending":
                                return "bg-yellow-100 text-yellow-800";
                              case "reviewed":
                                return "bg-blue-100 text-blue-800";
                              case "accepted":
                                return "bg-green-100 text-green-800";
                              case "rejected":
                                return "bg-red-100 text-red-800";
                              default:
                                return "bg-gray-100 text-gray-800";
                            }
                          };

                          const getProjectStatusColor = (status: string) => {
                            switch (status) {
                              case "open":
                                return "bg-green-100 text-green-800";
                              case "in-progress":
                                return "bg-blue-100 text-blue-800";
                              case "completed":
                                return "bg-gray-100 text-gray-800";
                              case "cancelled":
                                return "bg-red-100 text-red-800";
                              default:
                                return "bg-gray-100 text-gray-800";
                            }
                          };

                          return (
                            <Card
                              key={application.id}
                              className="border-l-4 border-l-primary"
                            >
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">
                                        {project.title}
                                      </h3>
                                      {(project.company ||
                                        project.developer) && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                          <Building className="h-4 w-4" />
                                          {project.company?.name ||
                                            project.developer?.name}
                                          {project.developer && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {project.developer.developer_type}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                      <Badge
                                        className={getStatusColor(
                                          application.status
                                        )}
                                      >
                                        {application.status === "pending" &&
                                          "Pendiente"}
                                        {application.status === "reviewed" &&
                                          "Revisado"}
                                        {application.status === "accepted" &&
                                          "Aceptado"}
                                        {application.status === "rejected" &&
                                          "Rechazado"}
                                      </Badge>
                                      <Badge
                                        className={getProjectStatusColor(
                                          project.status
                                        )}
                                      >
                                        {project.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  {project.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {project.description}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                      {project.budget_range && (
                                        <div className="flex items-center gap-1">
                                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                            Presupuesto:
                                          </span>
                                          <span className="font-medium">
                                            {project.budget_range}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          Tipo:
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {project.project_type}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Aplicado:{" "}
                                      {new Date(
                                        application.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};
