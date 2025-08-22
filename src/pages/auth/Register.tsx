import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PuzzleCard, PuzzleCardContent, PuzzleCardHeader } from "@/components/ui/puzzle-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleIcon, User, Building, Mail, Lock, Github, Linkedin, Upload, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 py-8">
      <div className="container mx-auto max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <PuzzleIcon className="h-10 w-10 text-primary" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent"></div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">PuzzleConnect</h1>
            <p className="text-sm text-muted-foreground">Crea tu perfil y conecta</p>
          </div>
        </div>

        <PuzzleCard variant="connection" className="connection-pulse">
          <PuzzleCardHeader className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Crear Cuenta</h2>
            <p className="text-muted-foreground">Únete a la comunidad de conexiones profesionales</p>
          </PuzzleCardHeader>

          <PuzzleCardContent>
            <Tabs defaultValue="developer" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="developer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Developer
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Empresa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="developer" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dev-name">Nombre Completo</Label>
                    <Input
                      id="dev-name"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dev-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dev-email"
                        type="email"
                        placeholder="juan@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dev-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dev-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dev-avatar">Avatar</Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dev-avatar"
                        type="file"
                        accept="image/*"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-skills">Habilidades Técnicas</Label>
                  <Input
                    id="dev-skills"
                    placeholder="React, TypeScript, Node.js, Python..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dev-github">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dev-github"
                        placeholder="github.com/usuario"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dev-linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dev-linkedin"
                        placeholder="linkedin.com/in/usuario"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-cv">CV (PDF)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dev-cv"
                      type="file"
                      accept=".pdf"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  Crear Perfil de Developer
                </Button>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nombre de la Empresa</Label>
                    <Input
                      id="company-name"
                      placeholder="TechCorp S.A."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email Corporativo</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="contacto@empresa.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-sector">Sector</Label>
                    <Input
                      id="company-sector"
                      placeholder="Tecnología, Finanzas, Salud..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-logo">Logo de la Empresa</Label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Descripción</Label>
                  <Textarea
                    id="company-description"
                    placeholder="Describe tu empresa, cultura, valores y lo que buscas en los desarrolladores..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90">
                  Crear Perfil de Empresa
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </div>
          </PuzzleCardContent>
        </PuzzleCard>
      </div>
    </div>
  );
};