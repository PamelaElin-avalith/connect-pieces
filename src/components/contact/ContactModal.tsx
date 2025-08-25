import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, User, MessageSquare, Loader2, X, Send } from "lucide-react";
import { useEmail } from "@/hooks/use-email";
import { toast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientEmail?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientEmail,
}) => {
  const { sendEmail, loading } = useEmail();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validaciones básicas
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()
      ) {
        toast({
          title: "Error",
          description: "Por favor, completa todos los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Error",
          description: "Por favor, ingresa un email válido",
          variant: "destructive",
        });
        return;
      }

      // Enviar email usando el hook
      const result = await sendEmail({
        ...formData,
        recipientEmail,
        recipientName,
      });

      if (result.success) {
        // Limpiar formulario y cerrar modal
        setFormData({ name: "", email: "", subject: "", message: "" });
        onClose();
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-background rounded-xl border shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-purple-600/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Conectar</h2>
              <p className="text-sm text-muted-foreground">
                Envía un mensaje directo
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Recipient Info */}
          {recipientName && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Conectando con:{" "}
                    <span className="font-semibold">{recipientName}</span>
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    Tu mensaje será enviado directamente
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Tu Nombre *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Tu Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-3">
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-foreground"
            >
              Asunto
            </Label>
            <Input
              id="subject"
              placeholder="Asunto del mensaje (opcional)"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="h-11 border-2 focus:border-primary transition-colors"
            />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <Label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              Mensaje *
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={6}
              className="resize-none border-2 focus:border-primary transition-colors min-h-[120px]"
              required
            />
          </div>

          {/* Info */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mt-0.5">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                  Consejo para una mejor conexión
                </p>
                <p className="text-xs text-green-700 dark:text-green-200">
                  Sé específico sobre tu consulta o propuesta. Incluye detalles
                  relevantes como:
                  <br />• Tu experiencia o necesidades
                  <br />• Timeline o presupuesto (si aplica)
                  <br />• Forma de contacto preferida
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 text-base font-medium border-2 hover:bg-muted"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Enviar Mensaje
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
