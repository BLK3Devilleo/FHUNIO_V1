'use client';

import { useRef, useState } from 'react';
import { useR2Upload } from '@/hooks/useR2Upload';
import { saveMediaRecord } from '@/app/actions/media';

export default function UploadQueueWidget() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useR2Upload();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBoxClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Subir a Cloudflare R2
    const result = await uploadFile(file);

    if (result.success && result.url) {
      // 2. Guardar en Base de Datos y disparar Webhook n8n
      const dbResult = await saveMediaRecord(result.url, file.name);
      
      if (dbResult.success) {
        setSuccessMsg('¡Foto subida y guardada exitosamente!');
      } else {
        setErrorMsg(dbResult.error || 'Error al guardar en base de datos');
      }
    } else {
      setErrorMsg(result.error || 'Error al subir el archivo');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className="w-full h-full flex flex-col cursor-pointer transition-transform hover:scale-[1.02]"
      style={{
        background: '#D9D9D9',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
      onClick={handleBoxClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Header: Red dot + Title */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D4D]" />
        <span className="text-sm font-bold text-[#000000]">
          {isUploading ? 'Subiendo...' : 'Haz clic para subir foto'}
        </span>
      </div>

      {/* Content preview area */}
      <div className="flex-1 px-4 flex flex-col">
        {/* Image preview */}
        <div className="w-full flex-1 rounded-xl overflow-hidden relative bg-[#B0C4A8]">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 30%, #228B22 30%, #2E7D32 60%, #1B5E20 100%)',
            }}
          />
          
          {/* Indicador de progreso (overlay) */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{progress}%</span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/70" />
            <div className="w-2 h-2 rounded-full bg-white/70" />
            <div className="w-2 h-2 rounded-full bg-white/70" />
          </div>
        </div>

        <p className="text-sm font-bold text-[#000000] mt-3">
          {successMsg ? '¡Carga completa!' : 'Contenido sob...'}
        </p>
        <p className="text-xs text-[#666666] mt-1 mb-3">
          {isUploading ? 'Procesando archivo...' : 'Cargando 12 más...'}
        </p>
      </div>

      {/* Status banner */}
      {(errorMsg || successMsg) && (
        <button
          className="w-full text-center text-sm font-bold text-white flex items-center justify-center rounded-b-[16px]"
          style={{
            height: '44px',
            background: errorMsg ? '#FF4D4D' : '#2E7D32',
          }}
          onClick={(e) => { e.stopPropagation(); setErrorMsg(null); setSuccessMsg(null); }}
        >
          {errorMsg || '¡Éxito! Webhook disparado'}
        </button>
      )}

      {/* "Ver todo" dark button */}
      {!errorMsg && !successMsg && (
        <button
          className="w-full text-center text-sm font-semibold text-white flex items-center justify-center rounded-b-[16px]"
          style={{
            height: '44px',
            background: '#333333',
          }}
          onClick={(e) => e.stopPropagation()} // Evita activar el input de archivo al hacer click en "Ver todo"
        >
          Ver todo
        </button>
      )}
    </div>
  );
}
