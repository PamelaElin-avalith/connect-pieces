import { Button } from "@/components/ui/button";
import { PuzzleIcon, Moon, Sun, User, Building } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <PuzzleIcon className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PuzzleConnect</h1>
            <p className="text-xs text-muted-foreground">Conectando talento</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Explorar Developers
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Para Empresas
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:flex items-center gap-2">
              <User className="h-4 w-4" />
              Developer
            </Button>
            <Button variant="outline" className="hidden sm:flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </Button>
          </div>

          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};