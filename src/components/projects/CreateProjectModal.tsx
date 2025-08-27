import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"create" | "apply">("create");

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser?.id) {
        throw new Error("Usuario no autenticado");
      }

      const { error } = await supabase.from("projects").insert({
        title: projectData.title,
        description: projectData.description,
        skills: projectData.skills
          ? projectData.skills.split(",").map((s) => s.trim())
          : [],
        budget: projectData.budget || null,
        duration: projectData.duration || null,
        location: projectData.location || null,
        team_size: projectData.team_size || null,
        type: projectData.type,
        status: projectData.status,
        created_by: currentUser.id,
        company_id: userType === "company" ? currentUser.id : null,
        developer_id: userType === "developer" ? currentUser.id : null,
      });

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
                <TabsTrigger value="apply" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Aplicar a Proyectos
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
              <TabsContent value="apply" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Proyectos Disponibles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Aquí verás los proyectos disponibles para aplicar.
                      <br />
                      <span className="text-sm">
                        (Funcionalidad en desarrollo)
                      </span>
                    </p>
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
