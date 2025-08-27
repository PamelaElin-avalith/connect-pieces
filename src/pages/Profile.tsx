import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { ChangeEmailModal } from "@/components/settings/ChangeEmailModal";
import { useNavigation } from "@/contexts/NavigationContext";
import { supabase } from "@/lib/supabaseClient";
import { StorageService } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Building,
  Mail,
  Github,
  Linkedin,
  Globe,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DEVELOPER_TYPES, DEVELOPER_TYPE_LABELS } from "@/types/developer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const navigate = useNavigate();
  const { userType, currentUser, setCurrentUser } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedCVFile, setSelectedCVFile] = useState<File | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    if (currentUser?.profile) {
      setProfile(currentUser.profile);
      setFormData(currentUser.profile);
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const table = userType === "developer" ? "developers" : "companies";

      // Si hay un archivo CV seleccionado, subirlo primero
      if (userType === "developer" && selectedCVFile) {
        // Asegurar que el bucket existe
        await StorageService.ensureBucketExists();

        // Subir archivo
        const uploadResult = await StorageService.uploadCV(
          selectedCVFile,
          profile.id
        );

        if (uploadResult.success && uploadResult.url) {
          formData.cv_url = uploadResult.url;
        } else {
          toast({
            title: "Advertencia",
            description:
              "No se pudo subir el CV. El perfil se guardará sin CV.",
            variant: "destructive",
          });
        }
      }

      // Si hay un archivo de avatar seleccionado, subirlo
      if (selectedAvatarFile) {
        // Asegurar que el bucket existe
        await StorageService.ensureAvatarBucketExists();

        // Subir avatar
        const uploadResult = await StorageService.uploadAvatar(
          selectedAvatarFile,
          profile.id
        );

        if (uploadResult.success && uploadResult.url) {
          formData.avatar_url = uploadResult.url;
        } else {
          toast({
            title: "Advertencia",
            description:
              "No se pudo subir el avatar. El perfil se guardará sin avatar.",
            variant: "destructive",
          });
        }
      }

      const { error } = await supabase
        .from(table)
        .update(formData)
        .eq("id", profile.id);

      if (error) throw error;

      setProfile(formData);
      setCurrentUser({ ...currentUser, profile: formData });
      setEditing(false);
      setSelectedCVFile(null);
      setSelectedAvatarFile(null);

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
    setSelectedCVFile(null);
    setSelectedAvatarFile(null);
  };

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <p className="text-muted-foreground">
              {userType === "developer" ? "Developer" : "Empresa"}
            </p>
          </div>
          <div className="ml-auto">
            {editing ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {editing ? (
                <AvatarUpload
                  currentAvatarUrl={profile.avatar_url || profile.logo_url}
                  onAvatarChange={(file) => {
                    setSelectedAvatarFile(file);
                  }}
                  onAvatarRemove={() => {
                    setSelectedAvatarFile(null);
                    formData.avatar_url = null;
                  }}
                  size="lg"
                />
              ) : (
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar_url || profile.logo_url} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                    {profile.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  {profile.email}
                </p>
                {userType === "company" && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {profile.sector}
                  </Badge>
                )}
                {userType === "developer" && profile.skills && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {profile.skills
                      .slice(0, 3)
                      .map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    {profile.skills.length > 3 && (
                      <Badge variant="outline">
                        +{profile.skills.length - 3} más
                      </Badge>
                    )}
                  </div>
                )}

                {userType === "developer" && profile.developer_type && (
                  <div className="flex justify-center md:justify-start">
                    <Badge
                      variant="secondary"
                      className="text-blue-600 bg-blue-50 border-blue-200"
                    >
                      {profile.developer_type}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {userType === "developer" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Building className="h-5 w-5" />
                  )}
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {userType === "developer"
                        ? "Nombre Completo"
                        : "Nombre de la Empresa"}
                    </Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {userType === "developer" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      {editing ? (
                        <Input
                          id="skills"
                          placeholder="React, TypeScript, Node.js"
                          value={formData.skills?.join(", ") || ""}
                          onChange={(e) => handleSkillsChange(e.target.value)}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2 py-2">
                          {profile.skills?.map(
                            (skill: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            )
                          ) || "No skills definidos"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="developer_type">
                        Tipo de Desarrollador
                      </Label>
                      {editing ? (
                        <Select
                          value={formData.developer_type || ""}
                          onValueChange={(value) =>
                            handleInputChange("developer_type", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar especialidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEVELOPER_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {DEVELOPER_TYPE_LABELS[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                          {profile.developer_type ? (
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-200"
                            >
                              {profile.developer_type}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              No especificado
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector</Label>
                      {editing ? (
                        <Input
                          id="sector"
                          value={formData.sector || ""}
                          onChange={(e) =>
                            handleInputChange("sector", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md">
                          {profile.sector}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      {editing ? (
                        <Textarea
                          id="description"
                          placeholder="Breve descripción de tu empresa..."
                          value={formData.description || ""}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md">
                          {profile.description || "Sin descripción"}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Campo "Acerca de" para ambos tipos de usuario */}
                <div className="space-y-2">
                  <Label htmlFor="about">Acerca de</Label>
                  {editing ? (
                    <Textarea
                      id="about"
                      placeholder={
                        userType === "developer"
                          ? "Cuéntanos más sobre ti, tu experiencia, objetivos profesionales..."
                          : "Cuéntanos más sobre tu empresa, misión, visión, valores..."
                      }
                      value={formData.about || ""}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value)
                      }
                      rows={4}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground py-2 px-3 bg-muted rounded-md">
                      {profile.about || "Sin información adicional"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Enlaces Sociales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* LinkedIn - Disponible para ambos tipos de usuario */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  {editing ? (
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedin || ""}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      {profile.linkedin ? (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profile.linkedin}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          No configurado
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Sitio Web - Disponible para ambos tipos de usuario */}
                <div className="space-y-2">
                  <Label htmlFor="web_url">Sitio Web</Label>
                  {editing ? (
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="web_url"
                        type="url"
                        placeholder="https://tu-sitio.com"
                        value={formData.web_url || ""}
                        onChange={(e) =>
                          handleInputChange("web_url", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {profile.web_url ? (
                        <a
                          href={profile.web_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profile.web_url}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          No configurado
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* GitHub - Solo para developers */}
                {userType === "developer" && (
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    {editing ? (
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github"
                          placeholder="https://github.com/username"
                          value={formData.github || ""}
                          onChange={(e) =>
                            handleInputChange("github", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        {profile.github ? (
                          <a
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profile.github}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">
                            No configurado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CV Upload - Solo para developers */}
                {userType === "developer" && (
                  <div className="space-y-2">
                    <Label>CV</Label>
                    {editing ? (
                      <FileUpload
                        onFileSelect={(file) => {
                          setSelectedCVFile(file);
                        }}
                        acceptedTypes={[".pdf"]}
                        maxSize={5}
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {profile.cv_url ? (
                          <a
                            href={profile.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Ver CV
                          </a>
                        ) : (
                          <span className="text-muted-foreground">
                            No configurado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Información de la Cuenta</h4>
                  <p className="text-sm text-muted-foreground">
                    ID de Usuario: {currentUser?.user?.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tipo: {userType === "developer" ? "Developer" : "Empresa"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Miembro desde:{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditing(true)}
                    disabled={editing}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar Avatar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowChangeEmailModal(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Cambiar Email
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteAccountModal(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Cuenta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales de Configuración */}
      <ChangeEmailModal
        isOpen={showChangeEmailModal}
        onClose={() => setShowChangeEmailModal(false)}
        currentEmail={profile.email}
      />

      {/* Modal de Eliminar Cuenta (placeholder por ahora) */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-background rounded-lg border shadow-lg">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <h3 className="text-lg font-semibold">Eliminar Cuenta</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Esta acción no se puede deshacer. Se eliminará permanentemente
                tu cuenta y todos los datos asociados.
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button variant="destructive" className="flex-1" disabled>
                  Eliminar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Funcionalidad en desarrollo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
