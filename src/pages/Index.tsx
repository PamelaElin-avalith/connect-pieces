import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PuzzleIcon,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  Search,
  Star,
  TrendingUp,
  Globe,
  Zap,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const { setShowAuthModal, setAuthMode } = useNavigation();

  const features = [
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Explorar Developers",
      description:
        "Encuentra talento especializado con skills específicos para tus proyectos",
      action: () => navigate("/developers"),
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: <Building2 className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Para Empresas",
      description:
        "Descubre empresas innovadoras que buscan talento tecnológico",
      action: () => navigate("/companies"),
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Proyectos",
      description:
        "Encuentra oportunidades de trabajo y colaboración profesional",
      action: () => navigate("/projects"),
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  const stats = [
    { label: "Developers", value: "50+", icon: Users, color: "text-blue-600" },
    {
      label: "Empresas",
      value: "25+",
      icon: Building2,
      color: "text-green-600",
    },
    {
      label: "Proyectos",
      value: "100+",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      label: "Conexiones",
      value: "500+",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo & Title */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div
                  className={cn(
                    "p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 to-purple-600/10",
                    "border border-primary/20 backdrop-blur-sm"
                  )}
                >
                  <PuzzleIcon className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto" />
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight px-2">
              PuzzleConnect
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Conecta con el mejor talento tecnológico. Encuentra developers,
              empresas y proyectos que se ajusten perfectamente a tus
              necesidades de desarrollo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Button
                size="lg"
                onClick={() => navigate("/developers")}
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explorar Developers
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/companies")}
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-2 hover:bg-muted transition-all duration-300"
              >
                Ver Empresas
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={cn(
                      "text-xl sm:text-2xl font-bold mb-1",
                      stat.color
                    )}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 h-40 w-40 sm:h-80 sm:w-80 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 h-40 w-40 sm:h-80 sm:w-80 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              ¿Por qué elegir PuzzleConnect?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Nuestra plataforma te ofrece las herramientas necesarias para
              conectar talento con oportunidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0",
                  "bg-background/80 backdrop-blur-sm"
                )}
                onClick={feature.action}
              >
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div
                    className={cn(
                      "mx-auto mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300",
                      feature.bgColor,
                      "group-hover:scale-110"
                    )}
                  >
                    <div className={cn("mx-auto", feature.color)}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6 pb-6">
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 h-10 sm:h-11"
                  >
                    Explorar
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Tres pasos simples para conectar talento con oportunidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Crea tu Perfil",
                description:
                  "Regístrate como developer o empresa y completa tu perfil con información relevante",
                icon: <User className="h-5 w-5 sm:h-6 sm:w-6" />,
              },
              {
                step: "02",
                title: "Explora y Conecta",
                description:
                  "Busca developers, empresas o proyectos que se ajusten a tus necesidades",
                icon: <Search className="h-5 w-5 sm:h-6 sm:w-6" />,
              },
              {
                step: "03",
                title: "Colabora y Crece",
                description:
                  "Inicia conversaciones, aplica a proyectos y construye relaciones profesionales",
                icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-12 sm:w-16 h-0.5 bg-gradient-to-r from-primary to-purple-600 transform -translate-y-1/2"></div>
                )}
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg mx-auto mb-3 sm:mb-4">
                    {item.step}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/10 to-purple-600/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            ¿Listo para conectar?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Únete a nuestra plataforma y descubre nuevas oportunidades de
            colaboración
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              onClick={() => handleAuthClick("login")}
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Iniciar Sesión
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleAuthClick("register")}
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-2"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
