import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import {
  Search,
  Plus,
  DollarSign,
  Clock,
  Building,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";

interface Project {
  id: string;
  title: string;
  description: string;
  company_id?: string;
  developer_id?: string;
  skills_required: string[];
  budget_range: string;
  project_type: string;
  status: string;
  created_at: string;
  company?: {
    name: string;
    sector: string;
  };
  developer?: {
    name: string;
    developer_type: string;
  };
}

export default function Projects() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  );
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const { userType, isAuthenticated, currentUser } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    if (userType === "developer" && currentUser?.id) {
      fetchApplications();
    }
  }, [userType, currentUser]);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          company:companies(name, sector),
          developer:developers(name, developer_type)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("project_id, status")
        .eq("developer_id", currentUser?.id);

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterProjects = () => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description &&
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        project.skills_required.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (project.company &&
          project.company.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(filtered);
  };

  const handleApply = async (projectId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userType !== "developer") {
      alert("Solo los developers pueden aplicar a proyectos");
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert({
        project_id: projectId,
        developer_id: currentUser?.id,
        status: "pending",
      });

      if (error) throw error;

      // Actualizar la lista de aplicaciones
      await fetchApplications();

      alert("¡Aplicación enviada exitosamente!");
    } catch (error: any) {
      console.error("Error applying to project:", error);
      alert("Error al aplicar al proyecto: " + error.message);
    }
  };

  const hasApplied = (projectId: string) => {
    return applications.some((app) => app.project_id === projectId);
  };

  const handleCreateProject = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Tanto developers como empresas pueden crear proyectos
    setShowCreateModal(true);
  };

  const getStatusColor = (status: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-purple-100 text-purple-800";
      case "part-time":
        return "bg-orange-100 text-orange-800";
      case "freelance":
        return "bg-indigo-100 text-indigo-800";
      case "contract":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando proyectos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Proyectos</h1>
              <p className="text-muted-foreground">
                Encuentra oportunidades de trabajo
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <Button
              className="flex items-center gap-2"
              onClick={handleCreateProject}
            >
              <Plus className="h-4 w-4" />
              {userType === "company" ? "Publicar Proyecto" : "Gestionar Proyectos"}
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por título, descripción o skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredProjects.length} proyecto
          {filteredProjects.length !== 1 ? "s" : ""} encontrado
          {filteredProjects.length !== 1 ? "s" : ""}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {project.title}
                  </CardTitle>
                  {(project.company || project.developer) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {project.company?.name || project.developer?.name}
                      {project.developer && (
                        <Badge variant="outline" className="text-xs">
                          {project.developer.developer_type}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                {project.description && (
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Skills Requeridos
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.skills_required.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Presupuesto:</span>
                    <span className="font-medium">{project.budget_range}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge className={getTypeColor(project.project_type)}>
                      {project.project_type}
                    </Badge>
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>

                  {userType === "developer" && project.status === "open" ? (
                    hasApplied(project.id) ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Aplicaste
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleApply(project.id)}
                        className="ml-auto"
                      >
                        Aplicar
                      </Button>
                    )
                  ) : (
                    <Button disabled className="ml-auto">
                      {project.status === "open"
                        ? "Solo Developers"
                        : "Cerrado"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron proyectos con esos criterios"
                : "No hay proyectos disponibles"}
            </p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
