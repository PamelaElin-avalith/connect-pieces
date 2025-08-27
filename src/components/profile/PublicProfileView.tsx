import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  User,
  Building,
  Mail,
  Github,
  Linkedin,
  Globe,
  MessageSquare,
  FileText,
  MapPin,
  Calendar,
  Star,
  Users,
  Briefcase,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicProfileViewProps {
  profile: any;
  userType: "developer" | "company";
  onClose: () => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  profile,
  userType,
  onClose,
}) => {
  if (!profile) {
    return null;
  }

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl bg-background rounded-xl border shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-purple-600/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Perfil Público</h2>
                <p className="text-sm text-muted-foreground">
                  {userType === "developer" ? "Developer" : "Empresa"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  // Abrir versión web de Gmail con destinatario precargado
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    profile.email
                  )}`;
                  window.open(gmailUrl, "_blank");
                }}
                size="sm"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Conectar
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Profile Overview */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage
                        src={profile.avatar_url || profile.logo_url}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                        {profile.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold mb-2">
                        {profile.name}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-4">
                        {profile.email}
                      </p>
                      {userType === "company" && (
                        <Badge
                          variant="secondary"
                          className="text-lg px-4 py-2"
                        >
                          {profile.sector}
                        </Badge>
                      )}
                      {userType === "developer" && profile.skills && (
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {profile.skills
                            .slice(0, 5)
                            .map((skill: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          {profile.skills.length > 5 && (
                            <Badge variant="outline">
                              +{profile.skills.length - 5} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Profile Details */}
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="about">Acerca de</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {userType === "developer" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Building className="h-5 w-5" />
                        )}
                        Información General
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Email
                          </Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{profile.email}</span>
                          </div>
                        </div>

                        {userType === "company" && profile.sector && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              Sector
                            </Label>
                            <Badge variant="secondary">{profile.sector}</Badge>
                          </div>
                        )}

                        {userType === "developer" && profile.experience && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              Experiencia
                            </Label>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {profile.experience} años
                              </span>
                            </div>
                          </div>
                        )}

                        {userType === "developer" && profile.developer_type && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              Especialidad
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-200"
                            >
                              {profile.developer_type}
                            </Badge>
                          </div>
                        )}

                        {profile.location && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              Ubicación
                            </Label>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {profile.location}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Redes Sociales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.github && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              GitHub
                            </Label>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() =>
                                window.open(profile.github, "_blank")
                              }
                            >
                              <Github className="h-4 w-4 mr-2" />
                              Ver perfil
                            </Button>
                          </div>
                        )}

                        {profile.linkedin && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              LinkedIn
                            </Label>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() =>
                                window.open(profile.linkedin, "_blank")
                              }
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              Ver perfil
                            </Button>
                          </div>
                        )}

                        {profile.website && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              Sitio Web
                            </Label>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() =>
                                window.open(profile.website, "_blank")
                              }
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Visitar sitio
                            </Button>
                          </div>
                        )}

                        {userType === "developer" && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              CV
                            </Label>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {profile.cv_url ? (
                                <a
                                  href={profile.cv_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline cursor-pointer"
                                >
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 hover:bg-green-50"
                                  >
                                    Ver CV
                                  </Badge>
                                </a>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground"
                                >
                                  No disponible
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Acerca de
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Tipo de Usuario
                          </Label>
                          <Badge variant="secondary" className="w-fit">
                            {userType === "developer" ? "Developer" : "Empresa"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Verificación
                          </Label>
                          <Badge
                            variant="outline"
                            className="w-fit text-green-600"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        </div>
                      </div>

                      {/* Campo "Acerca de" del usuario */}
                      {profile.about && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Información Adicional
                          </Label>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {profile.about}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Este perfil es público y puede ser visto por otros
                          usuarios de la plataforma. Para contactar
                          directamente, utiliza el botón "Conectar" en la parte
                          superior.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente Label simple para evitar importar todo el UI
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <label className={cn("text-sm font-medium", className)}>{children}</label>
);

// Componente Check simple
const Check: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("h-4 w-4", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
