import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabaseClient";
import { Developer } from "@/lib/supabaseClient";
import { Github, Linkedin, Mail, Search, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

export default function Developers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([]);
  const { userType, isAuthenticated } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    filterDevelopers();
  }, [searchTerm, developers]);

  const fetchDevelopers = async () => {
    try {
      const { data, error } = await supabase
        .from("developers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching developers:", error);
      } else {
        setDevelopers(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDevelopers = () => {
    if (!searchTerm.trim()) {
      setFilteredDevelopers(developers);
      return;
    }

    const filtered = developers.filter(
      (dev) =>
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredDevelopers(filtered);
  };

  const handleConnect = (developerId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Aquí implementarías la lógica de conexión
    alert(`Conectando con developer ${developerId}`);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando developers...</p>
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
              <h1 className="text-3xl font-bold">Developers</h1>
              <p className="text-muted-foreground">
                Encuentra talento para tus proyectos
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
            placeholder="Buscar por nombre, email o skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredDevelopers.length} developer
          {filteredDevelopers.length !== 1 ? "s" : ""} encontrado
          {filteredDevelopers.length !== 1 ? "s" : ""}
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((developer) => (
            <Card
              key={developer.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={developer.avatar_url}
                        alt={developer.name}
                      />
                      <AvatarFallback>
                        {developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {developer.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {developer.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {developer.skills.map((skill, index) => (
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

                {/* Social Links */}
                <div className="flex items-center gap-2">
                  {developer.github && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={developer.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {developer.linkedin && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={developer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`mailto:${developer.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  onClick={() => handleConnect(developer.id)}
                >
                  {isAuthenticated ? "Conectar" : "Ver Perfil"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDevelopers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron developers con esos criterios"
                : "No hay developers disponibles"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
