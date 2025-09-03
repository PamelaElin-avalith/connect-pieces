import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/lib/supabase-config";

export type UserType = "developer" | "company" | null;
export type ActiveTab =
  | "home"
  | "developers"
  | "companies"
  | "projects"
  | "profile"
  | "connections";

interface NavigationContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  logout: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error verificando sesión:", error);
          return;
        }

        if (session) {
          // Sesión válida, verificar si hay datos en localStorage
          const storedUserType = localStorage.getItem("userType");
          const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

          if (storedUserType && storedIsAuthenticated === "true") {
            setUserType(storedUserType as UserType);
            setIsAuthenticated(true);
            setCurrentUser(session.user);
          } else {
            // Hay sesión pero no hay datos en localStorage, restaurar estado básico
            setCurrentUser(session.user);
            setIsAuthenticated(true);
            // No establecer userType hasta que el usuario lo seleccione
          }
        } else {
          // No hay sesión activa, limpiar estado
          setUserType(null);
          setIsAuthenticated(false);
          setCurrentUser(null);
          // Limpiar localStorage
          localStorage.removeItem("userType");
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Error durante verificación de sesión:", error);
        // En caso de error, limpiar estado
        setUserType(null);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        // Usuario cerró sesión, limpiar estado
        setUserType(null);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } else if (event === "SIGNED_IN" && session) {
        // Usuario inició sesión
        setCurrentUser(session.user);
        // El tipo de usuario se establecerá cuando se complete el perfil
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error al cerrar sesión:", error);
      }

      // Limpiar estado local
      setUserType(null);
      setIsAuthenticated(false);
      setActiveTab("home");
      setCurrentUser(null);

      // Limpiar localStorage
      localStorage.removeItem("connectpieces-theme");
      localStorage.removeItem("userType");
      localStorage.removeItem("isAuthenticated");

      console.log("Sesión cerrada exitosamente desde NavigationContext");
    } catch (error) {
      console.error("Error durante el logout:", error);
      // Aún así limpiar el estado local
      setUserType(null);
      setIsAuthenticated(false);
      setActiveTab("home");
      setCurrentUser(null);
    }
  };

  const value: NavigationContextType = {
    userType,
    setUserType,
    isAuthenticated,
    setIsAuthenticated,
    activeTab,
    setActiveTab,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    currentUser,
    setCurrentUser,
    logout,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
