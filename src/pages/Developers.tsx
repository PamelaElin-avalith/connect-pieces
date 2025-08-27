import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase-config";
import { Developer } from "@/lib/supabaseClient";
import {
  Github,
  Linkedin,
  Mail,
  Search,
  Plus,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Developers() {
  return (
    <ProtectedRoute>
      <DevelopersContent />
    </ProtectedRoute>
  );
}

function DevelopersContent() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );
  const { userType, isAuthenticated } = useNavigation();
  const navigate = useNavigate();

  // Memoizar la función de búsqueda para evitar recreaciones
  const fetchDevelopers = useCallback(async () => {
    try {
      setLoading(true);
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
  }, []);

  // Solo ejecutar fetchDevelopers una vez al montar el componente
  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  // Memoizar developers filtrados para evitar recálculos innecesarios
  const filteredDevelopers = useMemo(() => {
    if (!searchTerm.trim()) {
      return developers;
    }

    return developers.filter(
      (developer) =>
        developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (developer.skills &&
          developer.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  }, [developers, searchTerm]);

  // Debouncing para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // La búsqueda se hace automáticamente con useMemo
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleConnect = (developer: Developer) => {
    if (!isAuthenticated) {
      // Mostrar modal de login
      return;
    }

    // Abrir versión web de Gmail con destinatario precargado
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      developer.email
    )}`;
    window.open(gmailUrl, "_blank");
  };

  const handleViewProfile = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setShowProfileView(true);
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Developers</h1>
              <p className="text-muted-foreground">
                Encuentra talento especializado para tus proyectos
              </p>
            </div>
          </div>

          {isAuthenticated && userType === "company" && (
            <Button
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Mi Perfil
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredDevelopers.length} developer
          {filteredDevelopers.length !== 1 ? "s" : ""} encontrado
          {filteredDevelopers.length !== 1 ? "s" : ""}
        </div>

        {/* Developers Grid */}
        {filteredDevelopers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron developers con esos criterios"
                : "No hay developers disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevelopers.map((developer) => (
              <Card
                key={developer.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={developer.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                          {developer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
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
                  {developer.skills && developer.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {developer.skills.slice(0, 4).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {developer.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{developer.skills.length - 4} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links & CV */}
                  <div className="space-y-3">
                    {/* CV */}
                    {developer.cv_url && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={developer.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm cursor-pointer"
                        >
                          Ver CV
                        </a>
                      </div>
                    )}

                    {/* Social Links */}
                    {(developer.github || developer.linkedin) && (
                      <div className="flex gap-2">
                        {developer.github && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(developer.github, "_blank")
                            }
                          >
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        )}
                        {developer.linkedin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(developer.linkedin, "_blank")
                            }
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewProfile(developer)}
                    >
                      Ver Perfil
                    </Button>
                    {isAuthenticated && userType === "company" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        onClick={() => handleConnect(developer)}
                      >
                        Conectar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Public Profile View */}
      {showProfileView && selectedDeveloper && (
        <PublicProfileView
          profile={selectedDeveloper}
          userType="developer"
          onClose={() => setShowProfileView(false)}
        />
      )}
    </div>
  );
}
