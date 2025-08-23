import React, { useState, useEffect } from "react";
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

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const { userType, isAuthenticated } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    try {
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
  };

  const filterCompanies = () => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.description &&
          company.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCompanies(filtered);
  };

  const handleConnect = (companyId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Aquí implementarías la lógica de conexión
    alert(`Conectando con empresa ${companyId}`);
  };

  const handleCreateProfile = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userType !== "developer") {
      alert("Solo los developers pueden crear perfiles");
      return;
    }

    // Aquí podrías navegar a una página de creación de perfiles
    alert("Funcionalidad de crear perfil en desarrollo");
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Empresas</h1>
              <p className="text-muted-foreground">
                Descubre empresas que buscan talento
              </p>
            </div>
          </div>

          {isAuthenticated && userType === "developer" && (
            <Button
              className="flex items-center gap-2"
              onClick={handleCreateProfile}
            >
              <Plus className="h-4 w-4" />
              Crear Perfil
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, sector o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredCompanies.length} empresa
          {filteredCompanies.length !== 1 ? "s" : ""} encontrada
          {filteredCompanies.length !== 1 ? "s" : ""}
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={company.logo_url} alt={company.name} />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {company.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sector */}
                <div>
                  <Badge variant="outline">{company.sector}</Badge>
                </div>

                {/* Description */}
                {company.description && (
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {company.description}
                    </p>
                  </div>
                )}

                {/* Contact */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`mailto:${company.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  onClick={() => handleConnect(company.id)}
                >
                  {isAuthenticated ? "Conectar" : "Ver Perfil"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron empresas con esos criterios"
                : "No hay empresas disponibles"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
