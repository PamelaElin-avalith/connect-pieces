import { Button } from "@/components/ui/button";
import { PuzzleIcon, Moon, Sun, User, Building, LogOut } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useNavigation } from "@/contexts/NavigationContext";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { userType, setUserType, isAuthenticated, setIsAuthenticated } =
    useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    navigate("/");
  };

  const handleUserTypeSelect = (type: "developer" | "company") => {
    setUserType(type);
    // Navegar a la página correspondiente según el tipo de usuario
    if (type === "developer") {
      navigate("/developers");
    } else {
      navigate("/companies");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleDevelopersClick = () => {
    navigate("/developers");
  };

  const handleCompaniesClick = () => {
    navigate("/companies");
  };

  const handleProjectsClick = () => {
    navigate("/projects");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleLogoClick}
        >
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
          <Button
            variant={location.pathname === "/developers" ? "default" : "ghost"}
            className="text-muted-foreground hover:text-foreground"
            onClick={handleDevelopersClick}
          >
            Explorar Developers
          </Button>
          <Button
            variant={location.pathname === "/companies" ? "default" : "ghost"}
            className="text-muted-foreground hover:text-foreground"
            onClick={handleCompaniesClick}
          >
            Para Empresas
          </Button>
          <Button
            variant={location.pathname === "/projects" ? "default" : "ghost"}
            className="text-muted-foreground hover:text-foreground"
            onClick={handleProjectsClick}
          >
            Proyectos
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
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant={userType === "developer" ? "default" : "outline"}
                className="hidden sm:flex items-center gap-2"
                onClick={() => handleUserTypeSelect("developer")}
              >
                <User className="h-4 w-4" />
                Developer
              </Button>
              <Button
                variant={userType === "company" ? "default" : "outline"}
                className="hidden sm:flex items-center gap-2"
                onClick={() => handleUserTypeSelect("company")}
              >
                <Building className="h-4 w-4" />
                Empresa
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden sm:flex items-center gap-2"
                onClick={() => handleUserTypeSelect("developer")}
              >
                <User className="h-4 w-4" />
                Developer
              </Button>
              <Button
                variant="outline"
                className="hidden sm:flex items-center gap-2"
                onClick={() => handleUserTypeSelect("company")}
              >
                <Building className="h-4 w-4" />
                Empresa
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={handleLoginClick}
              >
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
