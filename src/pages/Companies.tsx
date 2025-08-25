import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabaseClient";
import { Company } from "@/lib/supabaseClient";
import { Building, Mail, Search, Plus, ArrowLeft, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

import { PublicProfileView } from "@/components/profile/PublicProfileView";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { userType, isAuthenticated } = useNavigation();
  const navigate = useNavigate();

  // Memoizar la función de búsqueda para evitar recreaciones
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching companies:", error);
      } else {
        setCompanies(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Solo ejecutar fetchCompanies una vez al montar el componente
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Memoizar companies filtrados para evitar recálculos innecesarios
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) {
      return companies;
    }

    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.sector &&
          company.sector.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.description &&
          company.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [companies, searchTerm]);

  // Debouncing para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // La búsqueda se hace automáticamente con useMemo
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleConnect = (company: Company) => {
    if (!isAuthenticated) {
      // Mostrar modal de login
      return;
    }

    // Abrir versión web de Gmail con destinatario precargado
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      company.email
    )}`;
    window.open(gmailUrl, "_blank");
  };

  const handleViewProfile = (company: Company) => {
    setSelectedCompany(company);
    setShowProfileView(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando empresas...</p>
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
              <h1 className="text-3xl font-bold">Empresas</h1>
              <p className="text-muted-foreground">
                Descubre empresas innovadoras que buscan talento tecnológico
              </p>
            </div>
          </div>

          {isAuthenticated && userType === "developer" && (
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
            placeholder="Buscar por nombre, sector o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredCompanies.length} empresa
          {filteredCompanies.length !== 1 ? "s" : ""} encontrada
          {filteredCompanies.length !== 1 ? "s" : ""}
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron empresas con esos criterios"
                : "No hay empresas disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={company.logo_url} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold">
                          {company.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {company.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {company.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Sector */}
                  {company.sector && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sector</h4>
                      <Badge variant="secondary" className="text-sm">
                        {company.sector}
                      </Badge>
                    </div>
                  )}

                  {/* Description */}
                  {company.description && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Descripción</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {company.description}
                      </p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleConnect(company)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Conectar
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewProfile(company)}
                    >
                      Ver Perfil
                    </Button>
                    {isAuthenticated && userType === "developer" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        onClick={() => handleConnect(company)}
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
      {showProfileView && selectedCompany && (
        <PublicProfileView
          profile={selectedCompany}
          userType="company"
          onClose={() => setShowProfileView(false)}
        />
      )}
    </div>
  );
}
