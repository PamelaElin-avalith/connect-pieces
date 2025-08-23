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

interface Project {
  id: number;
  title: string;
  description: string;
  company_id: number;
  skills_required: string[];
  budget_range: string;
  project_type: string;
  status: string;
  created_at: string;
  company?: {
    name: string;
    sector: string;
  };
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const { userType, isAuthenticated } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

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
          company:companies(name, sector)
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

  const handleApply = (projectId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userType !== "developer") {
      alert("Solo los developers pueden aplicar a proyectos");
      return;
    }

    // Aquí implementarías la lógica de aplicación
    alert(`Aplicando al proyecto ${projectId}`);
  };

  const handleCreateProject = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userType !== "company") {
      alert("Solo las empresas pueden crear proyectos");
      return;
    }

    // Aquí podrías navegar a una página de creación de proyectos
    alert("Funcionalidad de crear proyecto en desarrollo");
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

          {isAuthenticated && userType === "company" && (
            <Button
              className="flex items-center gap-2"
              onClick={handleCreateProject}
            >
              <Plus className="h-4 w-4" />
              Publicar Proyecto
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
                  {project.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {project.company.name}
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

                  <Button
                    onClick={() => handleApply(project.id)}
                    disabled={
                      project.status !== "open" || userType !== "developer"
                    }
                    className="ml-auto"
                  >
                    {project.status === "open" ? "Aplicar" : "Cerrado"}
                  </Button>
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
    </div>
  );
}
