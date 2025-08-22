import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PuzzleCard, PuzzleCardContent, PuzzleCardHeader } from "@/components/ui/puzzle-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleIcon, User, Building, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <PuzzleIcon className="h-10 w-10 text-primary" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent"></div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">PuzzleConnect</h1>
            <p className="text-sm text-muted-foreground">Encuentra tu pieza perfecta</p>
          </div>
        </div>

        <PuzzleCard variant="connection" className="connection-pulse">
          <PuzzleCardHeader className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
            <p className="text-muted-foreground">Conecta con oportunidades únicas</p>
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
                <div className="space-y-2">
                  <Label htmlFor="dev-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dev-email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
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
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  Conectar como Developer
                </Button>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
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
                <Button className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90">
                  Conectar como Empresa
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes cuenta?{" "}
                  <Link 
                    to="/register" 
                    className="text-primary hover:underline font-medium"
                  >
                    Regístrate aquí
                  </Link>
                </p>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </PuzzleCardContent>
        </PuzzleCard>
      </div>
    </div>
  );
};