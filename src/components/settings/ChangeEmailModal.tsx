import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar que el nuevo email sea diferente
      if (formData.newEmail === currentEmail) {
        toast({
          title: "Error",
          description: "El nuevo email debe ser diferente al actual",
          variant: "destructive",
        });
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.newEmail)) {
        toast({
          title: "Error",
          description: "Por favor, ingresa un email válido",
          variant: "destructive",
        });
        return;
      }

      // Cambiar email en Supabase
      const { error } = await supabase.auth.updateUser({
        email: formData.newEmail,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email actualizado",
        description:
          "Se ha enviado un email de confirmación a tu nueva dirección",
      });

      // Limpiar formulario y cerrar modal
      setFormData({ newEmail: "", password: "" });
      onClose();
    } catch (error: any) {
      console.error("Error cambiando email:", error);

      let errorMessage = "Error al cambiar el email";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Contraseña incorrecta";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Este email ya está registrado por otro usuario";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Demasiados intentos. Intenta más tarde";
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

  const handleClose = () => {
    setFormData({ newEmail: "", password: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-background rounded-lg border shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Cambiar Email</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Current Email Display */}
          <div className="space-y-2">
            <Label>Email Actual</Label>
            <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{currentEmail}</span>
            </div>
          </div>

          {/* New Email */}
          <div className="space-y-2">
            <Label htmlFor="newEmail">Nuevo Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newEmail"
                type="email"
                placeholder="nuevo@email.com"
                value={formData.newEmail}
                onChange={(e) => handleInputChange("newEmail", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña Actual</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10"
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
            <p className="text-xs text-muted-foreground">
              Necesitamos tu contraseña para confirmar el cambio
            </p>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Importante:</strong> Se enviará un email de confirmación a
              tu nueva dirección. Debes confirmarlo para que el cambio sea
              efectivo.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Cambiando..." : "Cambiar Email"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
