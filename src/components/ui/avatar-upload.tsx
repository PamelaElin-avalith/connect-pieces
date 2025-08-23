import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarChange: (file: File | null) => void;
  onAvatarRemove: () => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  onAvatarRemove,
  className,
  disabled = false,
  size = "md",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen");
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Máximo 2MB");
        return;
      }

      setSelectedFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onAvatarChange(file);
    },
    [onAvatarChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveAvatar = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onAvatarRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onAvatarRemove]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium">Foto de Perfil</Label>

      {/* Avatar Display */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className={cn(
            "relative group cursor-pointer transition-all duration-200",
            sizeClasses[size],
            isDragOver && "scale-105"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Avatar className={cn("w-full h-full", sizeClasses[size])}>
            <AvatarImage src={displayUrl || undefined} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
              {currentAvatarUrl ? "..." : "?"}
            </AvatarFallback>
          </Avatar>

          {/* Overlay para indicar que se puede hacer click */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBrowseClick}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar Foto
          </Button>

          {(selectedFile || currentAvatarUrl) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Información adicional */}
      <div className="text-xs text-muted-foreground space-y-1 text-center">
        <p>• Formatos: JPG, PNG, GIF</p>
        <p>• Tamaño máximo: 2MB</p>
        <p>• Arrastra una imagen o haz clic en "Cambiar Foto"</p>
      </div>
    </div>
  );
};
