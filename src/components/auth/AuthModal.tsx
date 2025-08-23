import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import { useNavigation } from "@/contexts/NavigationContext";
import { supabase } from "@/lib/supabaseClient";
import { StorageService } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Linkedin,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    setUserType,
    setIsAuthenticated,
    setCurrentUser,
  } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<
    "developer" | "company"
  >("developer");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    sector: "",
    description: "",
    skills: "",
    github: "",
    linkedin: "",
    web_url: "",
    cv_url: "",
  });

  const [selectedCVFile, setSelectedCVFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === "register") {
        // Validaciones de registro
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Las contraseñas no coinciden",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "Error",
            description: "La contraseña debe tener al menos 6 caracteres",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // 1. Primero crear la cuenta de autenticación
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                user_type: selectedUserType,
                name: formData.name,
              },
            },
          }
        );

        if (authError) {
          console.error("Error en registro de auth:", authError);
          throw authError;
        }

        if (!authData.user) {
          throw new Error("No se pudo crear el usuario");
        }

        // 2. Esperar un momento para que se complete la creación del usuario
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 3. Crear perfil en la base de datos usando el ID del usuario autenticado
        if (selectedUserType === "developer") {
          // Subir CV si se seleccionó un archivo
          let cvUrl = null;
          if (selectedCVFile) {
            // Asegurar que el bucket existe
            await StorageService.ensureBucketExists();

            // Subir archivo
            const uploadResult = await StorageService.uploadCV(
              selectedCVFile,
              authData.user.id
            );

            if (uploadResult.success && uploadResult.url) {
              cvUrl = uploadResult.url;
            } else {
              console.warn("No se pudo subir el CV:", uploadResult.error);
              // Continuar sin CV si falla la subida
            }
          }

          const { error: profileError } = await supabase
            .from("developers")
            .insert({
              id: authData.user.id, // Usar el ID del usuario autenticado
              name: formData.name,
              email: formData.email,
              skills: formData.skills
                ? formData.skills.split(",").map((s) => s.trim())
                : [],
              github: formData.github || null,
              linkedin: formData.linkedin || null,
              web_url: formData.web_url || null,
              cv_url: cvUrl,
            });

          if (profileError) {
            console.error("Error creando perfil developer:", profileError);
            throw profileError;
          }
        } else {
          const { error: profileError } = await supabase
            .from("companies")
            .insert({
              id: authData.user.id, // Usar el ID del usuario autenticado
              name: formData.name,
              email: formData.email,
              sector: formData.sector,
              description: formData.description || null,
            });

          if (profileError) {
            console.error("Error creando perfil company:", profileError);
            throw profileError;
          }
        }

        // 4. Obtener el perfil creado
        let profile;
        if (selectedUserType === "developer") {
          const { data: devProfile, error: fetchError } = await supabase
            .from("developers")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (fetchError) {
            console.error("Error obteniendo perfil developer:", fetchError);
          } else {
            profile = devProfile;
          }
        } else {
          const { data: compProfile, error: fetchError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (fetchError) {
            console.error("Error obteniendo perfil company:", fetchError);
          } else {
            profile = compProfile;
          }
        }

        // 5. Actualizar el estado de la aplicación
        setUserType(selectedUserType);
        setIsAuthenticated(true);
        setCurrentUser({ ...authData.user, profile });

        toast({
          title: "¡Registro exitoso!",
          description: `Bienvenido a PuzzleConnect como ${
            selectedUserType === "developer" ? "Developer" : "Empresa"
          }`,
        });

        setShowAuthModal(false);
        resetForm();
      } else {
        // Login
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (authError) {
          console.error("Error en login:", authError);
          throw authError;
        }

        if (!authData.user) {
          throw new Error("No se pudo autenticar el usuario");
        }

        // Obtener perfil del usuario
        let profile = null;
        try {
          if (selectedUserType === "developer") {
            const { data: devProfile, error: fetchError } = await supabase
              .from("developers")
              .select("*")
              .eq("id", authData.user.id)
              .single();

            if (fetchError) {
              console.error("Error obteniendo perfil developer:", fetchError);
            } else {
              profile = devProfile;
            }
          } else {
            const { data: compProfile, error: fetchError } = await supabase
              .from("companies")
              .select("*")
              .eq("id", authData.user.id)
              .single();

            if (fetchError) {
              console.error("Error obteniendo perfil company:", fetchError);
            } else {
              profile = compProfile;
            }
          }
        } catch (profileError) {
          console.error("Error obteniendo perfil:", profileError);
        }

        setUserType(selectedUserType);
        setIsAuthenticated(true);
        setCurrentUser({ ...authData.user, profile });

        toast({
          title: "¡Bienvenido de vuelta!",
          description: `Has iniciado sesión como ${
            selectedUserType === "developer" ? "Developer" : "Empresa"
          }`,
        });

        setShowAuthModal(false);
        resetForm();
      }
    } catch (error: unknown) {
      console.error("Error completo:", error);

      let errorMessage = "Ocurrió un error inesperado";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      // Manejar errores específicos de Supabase
      if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos";
      } else if (errorMessage.includes("User already registered")) {
        errorMessage =
          "Este email ya está registrado. Intenta iniciar sesión en su lugar.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage =
          "Por favor, confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada y spam.";
      } else if (errorMessage.includes("401")) {
        errorMessage = "Error de autenticación. Verifica tus credenciales.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      sector: "",
      description: "",
      skills: "",
      github: "",
      linkedin: "",
      web_url: "",
      cv_url: "",
    });
    setSelectedCVFile(null);
    setSelectedUserType("developer");
  };

  const handleClose = () => {
    setShowAuthModal(false);
    resetForm();
  };

  const handleResendConfirmation = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Email reenviado",
        description:
          "Se ha reenviado el email de confirmación. Revisa tu bandeja de entrada y spam.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al reenviar el email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-background rounded-lg border shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex-1 text-center">
            <h2 className="text-lg sm:text-xl font-bold">
              {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {authMode === "login"
                ? "Accede a tu cuenta para conectar con talento"
                : "Únete a PuzzleConnect y encuentra tu próxima oportunidad"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-2 top-2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs
            value={authMode}
            onValueChange={(value) =>
              setAuthMode(value as "login" | "register")
            }
          >
            <TabsList className="grid w-full grid-cols-2 h-10 sm:h-11 mb-6">
              <TabsTrigger value="login" className="text-sm sm:text-base">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm sm:text-base">
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo de Usuario</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={
                        selectedUserType === "developer" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedUserType("developer")}
                      className="h-10 sm:h-11 text-sm"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Developer
                    </Button>
                    <Button
                      type="button"
                      variant={
                        selectedUserType === "company" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedUserType("company")}
                      className="h-10 sm:h-11 text-sm"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Empresa
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 h-10 sm:h-11"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>

                {/* Botón para reenviar confirmación */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => handleResendConfirmation(formData.email)}
                    disabled={loading || !formData.email}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    ¿No recibiste el email de confirmación? Reenviar
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo de Usuario</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={
                        selectedUserType === "developer" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedUserType("developer")}
                      className="h-10 sm:h-11 text-sm"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Developer
                    </Button>
                    <Button
                      type="button"
                      variant={
                        selectedUserType === "company" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedUserType("company")}
                      className="h-10 sm:h-11 text-sm"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Empresa
                    </Button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {selectedUserType === "developer"
                      ? "Nombre Completo"
                      : "Nombre de la Empresa"}
                  </Label>
                  <Input
                    id="name"
                    placeholder={
                      selectedUserType === "developer"
                        ? "Juan Pérez"
                        : "TechCorp"
                    }
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-10 sm:h-11"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>

                {/* Conditional Fields */}
                {selectedUserType === "developer" ? (
                  <>
                    {/* Skills */}
                    <div className="space-y-2">
                      <Label htmlFor="skills">
                        Skills (separados por comas)
                      </Label>
                      <Input
                        id="skills"
                        placeholder="React, TypeScript, Node.js"
                        value={formData.skills}
                        onChange={(e) =>
                          handleInputChange("skills", e.target.value)
                        }
                        className="h-10 sm:h-11"
                      />
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub (opcional)</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            placeholder="username"
                            value={formData.github}
                            onChange={(e) =>
                              handleInputChange("github", e.target.value)
                            }
                            className="pl-10 h-10 sm:h-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn (opcional)</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            placeholder="username"
                            value={formData.linkedin}
                            onChange={(e) =>
                              handleInputChange("linkedin", e.target.value)
                            }
                            className="pl-10 h-10 sm:h-11"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Web URL */}
                    <div className="space-y-2">
                      <Label htmlFor="web_url">Sitio Web (URL)</Label>
                      <Input
                        id="web_url"
                        type="url"
                        placeholder="https://tu-sitio.com"
                        value={formData.web_url}
                        onChange={(e) =>
                          handleInputChange("web_url", e.target.value)
                        }
                        className="h-10 sm:h-11"
                      />
                      <p className="text-xs text-muted-foreground">
                        Pega la URL de tu sitio web personal o de tu portafolio
                      </p>
                    </div>

                    {/* CV Upload */}
                    <div className="space-y-2">
                      <FileUpload
                        onFileSelect={(file) => {
                          setSelectedCVFile(file);
                        }}
                        acceptedTypes={[".pdf"]}
                        maxSize={5}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Sector */}
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        id="sector"
                        placeholder="Technology, Finance, Healthcare..."
                        value={formData.sector}
                        onChange={(e) =>
                          handleInputChange("sector", e.target.value)
                        }
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Descripción (opcional)
                      </Label>
                      <Input
                        id="description"
                        placeholder="Breve descripción de tu empresa..."
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="h-10 sm:h-11"
                      />
                    </div>
                  </>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 h-10 sm:h-11"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="pl-10 h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
