'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Check,
  ChevronDown
} from 'lucide-react';
import { publishPostAction } from '@/app/actions/post';

interface SelectedMedia {
  file?: File;
  url: string;
  isVideo?: boolean;
}

interface PostEditorWorkspaceProps {
  initialMedia: SelectedMedia[];
  activeOrgId?: string;
  activeConversation?: { id: string; title: string; date: string } | null;
}

const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400&auto=format&fit=crop',
];

const renderSocialIcon = (id: string) => {
  switch (id) {
    case 'facebook':
      return <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
    case 'instagram':
      return <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
    case 'x':
      return <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
    case 'linkedin':
      return <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
    case 'tiktok':
      return <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>;
    default:
      return null;
  }
};

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'x', label: 'Twitter / X', color: '#000000' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', hasReg: true },
  { id: 'tiktok', label: 'TikTok', color: '#000000' },
];

export default function PostEditorWorkspace({
  initialMedia,
  activeOrgId = 'org-1',
  activeConversation,
}: PostEditorWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unir archivos seleccionados por el usuario con las fotos por defecto de Unsplash
  const [mediaList, setMediaList] = useState<SelectedMedia[]>(
    initialMedia.length > 0
      ? initialMedia
      : DEFAULT_THUMBNAILS.map((url) => ({ url, isVideo: false }))
  );

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [caption, setCaption] = useState(
    activeConversation
      ? `📝 ${activeConversation.title}: Acción urgente de preservación ambiental.`
      : 'Salvemos los árboles. Suma tu apoyo a las causas de preservación en Venezuela.'
  );

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram', 'linkedin']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [socialBarExpanded, setSocialBarExpanded] = useState(true);

  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];

  // Disparar input de archivo
  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newMedia = Array.from(e.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith('video/'),
      }));
      setMediaList((prev) => [...prev, ...newMedia]);
      setActiveMediaIndex(mediaList.length);
    }
  };

  // Toggle Redes Sociales
  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Enviar a Backend (Supabase + n8n Webhook)
  const handlePublish = async (isScheduled = false) => {
    if (!caption.trim() && mediaList.length === 0) {
      setStatusType('error');
      setStatusMessage('Ingresa una descripción o multimedia.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setStatusType('error');
      setStatusMessage('Selecciona al menos una red social.');
      return;
    }

    setIsPublishing(true);
    setStatusMessage(null);

    const mediaUrls = mediaList.map((m) => m.url);
    const result = await publishPostAction({
      title: activeConversation?.title || 'Salvemos los árboles',
      caption,
      mediaUrls,
      platforms: selectedPlatforms,
      orgId: activeOrgId,
    });

    setIsPublishing(false);

    if (result.success) {
      setStatusType('success');
      setStatusMessage(
        isScheduled
          ? '🗓️ ¡Publicación programada exitosamente!'
          : '✔️ ¡Publicación enviada a n8n y redes!'
      );
    } else {
      setStatusType('error');
      setStatusMessage(result.error || 'Error al publicar.');
    }
  };

  // Construir 7 slots de miniaturas para la tira de película (Filmstrip)
  const filmstripSlots = Array.from({ length: 7 }).map((_, idx) => ({
    id: idx,
    media: mediaList[idx] || null,
  }));

  return (
    <div className="relative flex flex-col items-center gap-5 w-full max-w-[62vw] text-black">
      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Título del Post Activo */}
      <h2 className="text-lg font-medium tracking-tight text-center">
        {activeConversation ? activeConversation.title : 'Salvemos los árboles'}
      </h2>

      {/* =========================================================
          CONTENEDOR PRINCIPAL DE EDICIÓN (PANEL DUAL)
          ========================================================= */}
      <div className="w-full bg-white border border-[#E0E0E0] rounded-[32px] p-4 flex flex-col md:flex-row gap-4 shadow-sm">
        {/* Panel Izquierdo (Media Principal) */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden relative border border-black/5 bg-[#111111] flex items-center justify-center">
            {activeMedia ? (
              activeMedia.isVideo ? (
                <video src={activeMedia.url} controls className="w-full h-full object-contain" />
              ) : (
                <img
                  src={activeMedia.url}
                  alt="preview-main"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-white/40 text-xs font-semibold">Sin multimedia</div>
            )}
          </div>

          {/* 8 Puntos Indicadores del Carrusel */}
          <div className="flex justify-center gap-1.5 py-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === (activeMediaIndex % 8) ? 'bg-[#666666] scale-125' : 'bg-[#D9D9D9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Panel Derecho (Caja de Texto) */}
        <div className="w-full md:w-1/2 flex flex-col border border-[#E0E0E0] rounded-2xl p-4 bg-[#FAFAFA]">
          <textarea
            placeholder="Descripción de contenido"
            className="w-full h-full min-h-[220px] resize-none outline-none italic text-black placeholder:text-gray-400 bg-transparent text-sm leading-relaxed"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      </div>

      {/* =========================================================
          TIRA DE MINIATURAS (FILMSTRIP) + BOTONES RÁPIDOS
          ========================================================= */}
      <div className="w-full flex items-center justify-between gap-4">
        {/* Filmstrip (7 Slots) */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex gap-2 w-full justify-between overflow-x-auto py-1">
            {filmstripSlots.map((slot) => (
              <motion.div
                key={slot.id}
                whileHover={{ y: -2 }}
                onClick={() => slot.media && setActiveMediaIndex(slot.id)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border border-[#E0E0E0] overflow-hidden flex-shrink-0 cursor-pointer flex items-center justify-center ${
                  slot.media
                    ? slot.id === activeMediaIndex
                      ? 'ring-2 ring-black bg-white shadow-md'
                      : 'bg-white opacity-80 hover:opacity-100'
                    : 'bg-transparent border-dashed border-[#CCCCCC]'
                }`}
              >
                {slot.media ? (
                  slot.media.isVideo ? (
                    <video src={slot.media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={slot.media.url} alt={`thumb-${slot.id}`} className="w-full h-full object-cover" />
                  )
                ) : (
                  <span className="text-[10px] text-gray-300 font-bold">{slot.id + 1}</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Flechas de Navegación del Carrusel */}
          <div className="flex gap-6 text-[#999999]">
            <ChevronLeft
              onClick={() => setActiveMediaIndex((prev) => Math.max(0, prev - 1))}
              className="w-6 h-6 cursor-pointer hover:text-black transition-colors"
            />
            <ChevronRight
              onClick={() => setActiveMediaIndex((prev) => Math.min(mediaList.length - 1, prev + 1))}
              className="w-6 h-6 cursor-pointer hover:text-black transition-colors"
            />
          </div>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex flex-col gap-2 w-48 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddMediaClick}
            className="w-full py-2.5 border border-[#666666] rounded-full flex items-center justify-center gap-2 text-xs font-bold text-black hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Añadir
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddMediaClick}
            className="w-full py-2.5 border border-[#666666] rounded-full text-xs font-bold text-black hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Imagen/Carrusel
          </motion.button>
        </div>
      </div>

      {/* =========================================================
          BARRA DE COMANDOS INFERIOR CON ACCIONES
          ========================================================= */}
      <div className="w-full flex items-center gap-3 mt-1">
        {/* Input de texto de cápsula elongada */}
        <div className="flex-1 h-14 bg-white border border-[#E0E0E0] rounded-full px-6 flex items-center shadow-inner">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escribe comandos o notas sobre la publicación..."
            className="w-full bg-transparent text-xs font-medium text-black outline-none border-none placeholder:text-gray-400"
          />
        </div>

        {/* Botones Circulares de Acción */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Botón Calendario (Programar - Azul #5BB0E5) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePublish(true)}
            disabled={isPublishing}
            className="w-14 h-14 rounded-full bg-[#5BB0E5] shadow-lg flex items-center justify-center text-white cursor-pointer hover:bg-[#4A9FD4] transition-colors"
            title="Programar Publicación"
          >
            <Calendar className="w-6 h-6" />
          </motion.button>

          {/* Botón Confirmar / Aprobar (Gris Oscuro #333333 / Check) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePublish(false)}
            disabled={isPublishing}
            className="w-14 h-14 rounded-full bg-[#333333] shadow-lg flex items-center justify-center text-white cursor-pointer hover:bg-black transition-colors"
            title="Aprobar y Publicar Causa"
          >
            {isPublishing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-7 h-7" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Banner de Estado Notificación */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setStatusMessage(null)}
            className={`px-5 py-2 rounded-full text-xs font-bold text-white shadow-lg cursor-pointer ${
              statusType === 'success' ? 'bg-[#10B981]' : 'bg-[#FF4D4D]'
            }`}
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          SELECTOR FLOTANTE DERECHO DE REDES SOCIALES
          ========================================================= */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 bg-[#333333] p-3 rounded-full shadow-2xl"
      >
        <div
          onClick={() => setSocialBarExpanded(!socialBarExpanded)}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors mb-1"
          title="Alternar visibilidad"
        >
          <ChevronDown
            className={`w-4 h-4 text-white transition-transform ${
              socialBarExpanded ? '' : 'rotate-180'
            }`}
          />
        </div>

        {socialBarExpanded && (
          <div className="flex flex-col gap-4 items-center pb-1">
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatforms.includes(p.id);
              return (
                <div key={p.id} className="relative">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePlatform(p.id)}
                    className={`cursor-pointer p-1.5 rounded-full transition-all ${
                      isSelected ? 'text-white scale-110 opacity-100' : 'text-white/40 opacity-40 hover:opacity-80'
                    }`}
                    title={`${p.label}: ${isSelected ? 'Seleccionada' : 'Desactivada'}`}
                  >
                    {renderSocialIcon(p.id)}
                  </motion.div>

                  {p.hasReg && (
                    <span className="absolute -top-1 -right-1 text-[8px] font-bold text-white pointer-events-none">
                      ®
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute -bottom-0.5 right-0 w-2 h-2 rounded-full bg-[#10B981] border border-black" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
