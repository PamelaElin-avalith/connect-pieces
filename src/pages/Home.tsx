import { Button } from "@/components/ui/button";
import {
  PuzzleCard,
  PuzzleCardContent,
  PuzzleCardHeader,
} from "@/components/ui/puzzle-card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import {
  PuzzleIcon,
  Users,
  Building,
  Code,
  Briefcase,
  Star,
  ArrowRight,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Home = () => {
  const featuredDevelopers = [
    {
      id: 1,
      name: "Ana García",
      title: "Frontend Developer",
      skills: ["React", "TypeScript", "Tailwind"],
      experience: "3 años",
      location: "Madrid, España",
      rating: 4.9,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      title: "Full Stack Developer",
      skills: ["Node.js", "Python", "React"],
      experience: "5 años",
      location: "Barcelona, España",
      rating: 4.8,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Sofia López",
      title: "Mobile Developer",
      skills: ["React Native", "Swift", "Kotlin"],
      experience: "4 años",
      location: "Valencia, España",
      rating: 4.9,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="relative inline-block">
            <PuzzleIcon className="h-20 w-20 text-primary mx-auto mb-6" />
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent animate-pulse"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Conecta. Encuentra. Crece.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            La plataforma donde developers y empresas se conectan como piezas de
            rompecabezas perfectas. Encuentra tu match ideal en el mundo tech.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
              asChild
            >
              <Link to="/register">
                <User className="mr-2 h-5 w-5" />
                Soy Developer
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2"
              asChild
            >
              <Link to="/register">
                <Building className="mr-2 h-5 w-5" />
                Soy Empresa
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué ConnectPieces?</h2>
          <p className="text-muted-foreground text-lg">
            Conectamos talento con oportunidades de manera inteligente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PuzzleCard variant="developer" className="text-center">
            <PuzzleCardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Perfiles Verificados</h3>
            </PuzzleCardHeader>
            <PuzzleCardContent>
              <p className="text-muted-foreground">
                Todos los developers son verificados con sus proyectos reales en
                GitHub y experiencia comprobada.
              </p>
            </PuzzleCardContent>
          </PuzzleCard>

          <PuzzleCard variant="connection" className="text-center">
            <PuzzleCardHeader>
              <Code className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Match Inteligente</h3>
            </PuzzleCardHeader>
            <PuzzleCardContent>
              <p className="text-muted-foreground">
                Nuestro algoritmo conecta developers con empresas basado en
                skills, experiencia y cultura.
              </p>
            </PuzzleCardContent>
          </PuzzleCard>

          <PuzzleCard variant="company" className="text-center">
            <PuzzleCardHeader>
              <Briefcase className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Proceso Ágil</h3>
            </PuzzleCardHeader>
            <PuzzleCardContent>
              <p className="text-muted-foreground">
                Conecta directamente sin intermediarios. Proceso rápido y
                transparente para ambas partes.
              </p>
            </PuzzleCardContent>
          </PuzzleCard>
        </div>
      </section>

      {/* Featured Developers */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Developers Destacados</h2>
          <p className="text-muted-foreground text-lg">
            Descubre el talento que está transformando la industria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDevelopers.map((dev) => (
            <PuzzleCard
              key={dev.id}
              variant="developer"
              className="hover:scale-105 transition-all duration-300"
            >
              <PuzzleCardHeader className="text-center">
                <img
                  src={dev.avatar}
                  alt={dev.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20"
                />
                <h3 className="text-xl font-semibold">{dev.name}</h3>
                <p className="text-muted-foreground">{dev.title}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{dev.rating}</span>
                </div>
              </PuzzleCardHeader>
              <PuzzleCardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {dev.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{dev.experience}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{dev.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline" className="p-2">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </PuzzleCardContent>
            </PuzzleCard>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="group">
            Ver Todos los Developers
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <PuzzleCard
          variant="connection"
          size="lg"
          className="text-center max-w-4xl mx-auto"
        >
          <PuzzleCardContent className="space-y-6">
            <h2 className="text-3xl font-bold">
              ¿Listo para encontrar tu pieza perfecta?
            </h2>
            <p className="text-muted-foreground text-lg">
              Únete a miles de developers y empresas que ya están conectando en
              ConnectPieces
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                asChild
              >
                <Link to="/register">Comenzar Ahora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </PuzzleCardContent>
        </PuzzleCard>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <PuzzleIcon className="h-6 w-6 text-primary" />
              <span className="font-semibold">ConnectPieces</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ConnectPieces. Conectando talento con oportunidades.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
