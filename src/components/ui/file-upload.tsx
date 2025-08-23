import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSize?: number; // en MB
  className?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = [".pdf"],
  maxSize = 5, // 5MB por defecto
  className,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validar tipo de archivo
      const isValidType = acceptedTypes.some(
        (type) =>
          file.name.toLowerCase().endsWith(type.toLowerCase()) ||
          file.type === type
      );

      if (!isValidType) {
        alert(`Solo se permiten archivos: ${acceptedTypes.join(", ")}`);
        return;
      }

      // Validar tamaño
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        alert(`El archivo es demasiado grande. Máximo ${maxSize}MB`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [acceptedTypes, maxSize, onFileSelect]
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

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileSelect]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <Label>CV (Archivo PDF)</Label>

      {/* Área de Drag & Drop */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          // Archivo seleccionado
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <FileText className="h-8 w-8" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
              disabled={disabled}
              className="mx-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Remover archivo
            </Button>
          </div>
        ) : (
          // Área vacía
          <div className="space-y-3">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Arrastra tu CV aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Solo archivos PDF, máximo {maxSize}MB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBrowseClick}
              disabled={disabled}
              className="mx-auto"
            >
              Seleccionar archivo
            </Button>
          </div>
        )}
      </div>

      {/* Input de archivo oculto */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Información adicional */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Formatos aceptados: {acceptedTypes.join(", ")}</p>
        <p>• Tamaño máximo: {maxSize}MB</p>
        <p>• El archivo se subirá automáticamente al servidor</p>
      </div>
    </div>
  );
};
