import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PuzzleIcon,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  TestTube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TestConnection } from "@/components/TestConnection";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const [showTests, setShowTests] = useState(false);

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Explorar Developers",
      description:
        "Encuentra talento para tus proyectos con skills específicos",
      action: () => navigate("/developers"),
      color: "text-blue-600",
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Para Empresas",
      description: "Descubre empresas que buscan talento tecnológico",
      action: () => navigate("/companies"),
      color: "text-green-600",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Proyectos",
      description: "Encuentra oportunidades de trabajo y colaboración",
      action: () => navigate("/projects"),
      color: "text-purple-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <PuzzleIcon className="h-20 w-20 text-primary mx-auto" />
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent"></div>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          PuzzleConnect
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Conecta con el mejor talento tecnológico. Encuentra developers,
          empresas y proyectos que se ajusten perfectamente a tus necesidades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/developers")}>
            Explorar Developers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/companies")}
          >
            Ver Empresas
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={feature.action}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <Button variant="outline" className="w-full">
                Explorar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Connection Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🧪 Pruebas de Conexión</h2>
          <p className="text-muted-foreground mb-6">
            Verifica que la conexión a Supabase esté funcionando correctamente
          </p>
          <Button
            variant="outline"
            onClick={() => setShowTests(!showTests)}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {showTests ? "Ocultar Pruebas" : "Mostrar Pruebas"}
          </Button>
        </div>

        {showTests && <TestConnection />}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Developers</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
            <div className="text-muted-foreground">Empresas</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
            <div className="text-muted-foreground">Proyectos</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-muted-foreground">Conexiones</div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para conectar?</h2>
        <p className="text-muted-foreground mb-6">
          Únete a nuestra plataforma y descubre nuevas oportunidades
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/register")}
          >
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
}
