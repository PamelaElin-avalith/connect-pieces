import React, { createContext, useContext, useState, ReactNode } from "react";

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
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
