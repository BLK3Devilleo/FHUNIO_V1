import { useState } from 'react';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function useR2Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    try {
      // 1. Solicitar firma de subida al backend
      const presignRes = await fetch('/api/r2/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        }),
      });

      if (!presignRes.ok) {
        const errData = await presignRes.json();
        throw new Error(errData.error || 'Error al solicitar URL de firma');
      }

      const { url: uploadUrl, publicUrl } = await presignRes.json();

      // 2. Subir directamente a Cloudflare R2
      // Simulamos un leve progreso
      setProgress(30);

      const r2Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!r2Res.ok) {
        throw new Error('Falló la subida física a Cloudflare R2');
      }

      setProgress(100);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Error uploading to R2:', error);
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress };
}
