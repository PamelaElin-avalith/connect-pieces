import { supabase } from "./supabaseClient";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class StorageService {
  private static readonly BUCKET_NAME = "cv-files";
  private static readonly AVATAR_BUCKET_NAME = "avatars";
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

  /**
   * Sube un archivo PDF al bucket de CVs
   */
  static async uploadCV(file: File, userId: string): Promise<UploadResult> {
    try {
      // Validar archivo
      if (!file.type.includes('pdf')) {
        return {
          success: false,
          error: "Solo se permiten archivos PDF"
        };
      }

      if (file.size > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: "El archivo es demasiado grande. Máximo 5MB"
        };
      }

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Error subiendo archivo:", error);
        return {
          success: false,
          error: error.message
        };
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return {
        success: true,
        url: urlData.publicUrl
      };

    } catch (error) {
      console.error("Error en uploadCV:", error);
      return {
        success: false,
        error: "Error inesperado al subir el archivo"
      };
    }
  }

  /**
   * Sube un avatar al bucket de avatares
   */
  static async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    try {
      // Validar archivo
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: "Solo se permiten archivos de imagen"
        };
      }

      if (file.size > this.MAX_AVATAR_SIZE) {
        return {
          success: false,
          error: "La imagen es demasiado grande. Máximo 2MB"
        };
      }

      // Asegurar que el bucket existe
      await this.ensureAvatarBucketExists();

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Subir archivo (upsert para reemplazar si existe)
      const { data, error } = await supabase.storage
        .from(this.AVATAR_BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Error subiendo avatar:", error);
        return {
          success: false,
          error: error.message
        };
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(this.AVATAR_BUCKET_NAME)
        .getPublicUrl(fileName);

      return {
        success: true,
        url: urlData.publicUrl
      };

    } catch (error) {
      console.error("Error en uploadAvatar:", error);
      return {
        success: false,
        error: "Error inesperado al subir el avatar"
      };
    }
  }

  /**
   * Elimina un archivo CV del storage
   */
  static async deleteCV(fileUrl: string): Promise<UploadResult> {
    try {
      // Extraer el path del archivo de la URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const userId = pathParts[pathParts.length - 2];
      const filePath = `${userId}/${fileName}`;

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error("Error eliminando archivo:", error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };

    } catch (error) {
      console.error("Error en deleteCV:", error);
      return {
        success: false,
        error: "Error inesperado al eliminar el archivo"
      };
    }
  }

  /**
   * Elimina un avatar del storage
   */
  static async deleteAvatar(userId: string): Promise<UploadResult> {
    try {
      // Listar archivos del usuario en el bucket de avatares
      const { data: files, error: listError } = await supabase.storage
        .from(this.AVATAR_BUCKET_NAME)
        .list(userId);

      if (listError) {
        console.error("Error listando avatares:", listError);
        return {
          success: false,
          error: listError.message
        };
      }

      if (files && files.length > 0) {
        // Eliminar todos los archivos del usuario
        const filePaths = files.map(file => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from(this.AVATAR_BUCKET_NAME)
          .remove(filePaths);

        if (deleteError) {
          console.error("Error eliminando avatar:", deleteError);
          return {
            success: false,
            error: deleteError.message
          };
        }
      }

      return {
        success: true
      };

    } catch (error) {
      console.error("Error en deleteAvatar:", error);
      return {
        success: false,
        error: "Error inesperado al eliminar el avatar"
      };
    }
  }

  /**
   * Verifica si el bucket existe, si no, lo crea
   */
  static async ensureBucketExists(): Promise<boolean> {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error listando buckets:", error);
        return false;
      }

      const bucketExists = buckets.some(bucket => bucket.name === this.BUCKET_NAME);
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['application/pdf'],
          fileSizeLimit: this.MAX_FILE_SIZE
        });

        if (createError) {
          console.error("Error creando bucket:", createError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error en ensureBucketExists:", error);
      return false;
    }
  }

  /**
   * Verifica si el bucket de avatares existe, si no, lo crea
   */
  static async ensureAvatarBucketExists(): Promise<boolean> {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error listando buckets:", error);
        return false;
      }

      const bucketExists = buckets.some(bucket => bucket.name === this.AVATAR_BUCKET_NAME);
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(this.AVATAR_BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: this.MAX_AVATAR_SIZE
        });

        if (createError) {
          console.error("Error creando bucket de avatares:", createError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error en ensureAvatarBucketExists:", error);
      return false;
    }
  }
}
