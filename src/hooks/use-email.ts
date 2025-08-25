import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail?: string;
  recipientName?: string;
}

export const useEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendEmail = async (emailData: EmailData) => {
    setLoading(true);

    try {
      // Validar que tenemos la API key de Resend
      if (!import.meta.env.VITE_RESEND_API_KEY) {
        throw new Error("API key de Resend no configurada");
      }

      // Crear el contenido del email
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #666; margin-top: 0;">Información del remitente:</h3>
            <p><strong>Nombre:</strong> ${emailData.name}</p>
            <p><strong>Email:</strong> ${emailData.email}</p>
            ${emailData.subject ? `<p><strong>Asunto:</strong> ${emailData.subject}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #555;">${emailData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Este mensaje fue enviado desde la plataforma ConnectPieces.
              <br>
              Para responder, contacta directamente a: <strong>${emailData.email}</strong>
            </p>
          </div>
        </div>
      `;

      // Enviar email usando Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: emailData.name,
          email: emailData.email,
          subject: emailData.subject,
          message: emailData.message,
          recipientEmail: emailData.recipientEmail,
          recipientName: emailData.recipientName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de Resend: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Email enviado exitosamente:', data);

      toast({
        title: "¡Mensaje enviado!",
        description: "Tu mensaje ha sido enviado correctamente. Te responderemos pronto.",
      });

      return { success: true };

    } catch (error) {
      console.error("Error enviando email:", error);

      // Mostrar mensaje de error más específico
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      toast({
        title: "Error al enviar mensaje",
        description: `No se pudo enviar el mensaje: ${errorMessage}`,
        variant: "destructive",
      });

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmail,
    loading,
  };
};
