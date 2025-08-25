import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PuzzleIcon,
  Moon,
  Sun,
  User,
  Building,
  LogOut,
  Menu,
  X,
  Home,
  Users,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useNavigation } from "@/contexts/NavigationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const {
    userType,
    setUserType,
    isAuthenticated,
    setIsAuthenticated,
    activeTab,
    setActiveTab,
    showAuthModal,
    setShowAuthModal,
    setAuthMode,
  } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setActiveTab("home");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleUserTypeSelect = (type: "developer" | "company") => {
    setUserType(type);
    setActiveTab(type === "developer" ? "developers" : "companies");
    navigate(type === "developer" ? "/developers" : "/companies");
    setMobileMenuOpen(false);
  };

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: "home", label: "Inicio", icon: Home, path: "/" },
    { id: "developers", label: "Developers", icon: Users, path: "/developers" },
    { id: "companies", label: "Empresas", icon: Building, path: "/companies" },
    { id: "projects", label: "Proyectos", icon: Briefcase, path: "/projects" },
  ];

  const isActiveTab = (tabId: string) => {
    if (tabId === "home") return location.pathname === "/";
    return location.pathname === `/${tabId}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => {
                navigate("/");
                setActiveTab("home");
                setMobileMenuOpen(false);
              }}
            >
              <div className="relative">
                <PuzzleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  PuzzleConnect
                </h1>
                <p className="text-xs text-muted-foreground">
                  Conectando talento
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActiveTab(item.id) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "transition-all duration-200",
                    isActiveTab(item.id)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setActiveTab(item.id as any);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-muted"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {/* Profile & Logout */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate("/profile");
                      setActiveTab("profile");
                    }}
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAuthClick("login")}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthClick("register")}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur">
            <div className="container mx-auto px-3 sm:px-4 py-4 space-y-3">
              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActiveTab(item.id) ? "default" : "ghost"}
                  className="w-full justify-start h-12"
                  onClick={() => {
                    navigate(item.path);
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 border-t space-y-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-11"
                      onClick={() => {
                        navigate("/profile");
                        setActiveTab("profile");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Mi Perfil
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-11 text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleAuthClick("login")}
                      className="h-11"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      onClick={() => handleAuthClick("register")}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-11"
                    >
                      Registrarse
                    </Button>
                  </div>
                )}

                {/* Mobile Theme Toggle */}
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full h-11 justify-start"
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 mr-3" />
                    ) : (
                      <Moon className="h-4 w-4 mr-3" />
                    )}
                    {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
