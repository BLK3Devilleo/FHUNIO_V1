'use client';

import { useState } from 'react';
import { publishPostAction } from '@/app/actions/post';
import { Calendar as CalendarIcon, Check, Plus, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface SelectedMedia {
  file?: File;
  url: string;
  isVideo?: boolean;
}

interface PostEditorWorkspaceProps {
  initialMedia: SelectedMedia[];
  currentPostTitle?: string;
  activeOrgId?: string;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
];

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: 'f', color: '#1877F2', activeStyle: 'bg-[#1877F2] text-white shadow-[0_0_15px_rgba(24,119,242,0.8)] ring-2 ring-[#1877F2] scale-105' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', activeStyle: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white shadow-[0_0_15px_rgba(228,64,95,0.8)] ring-2 ring-[#E4405F] scale-105' },
  { id: 'x', name: 'X', icon: '𝕏', color: '#000000', activeStyle: 'bg-black text-white shadow-[0_0_15px_rgba(255,255,255,0.6)] ring-2 ring-white/50 scale-105' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: '#0A66C2', activeStyle: 'bg-[#0A66C2] text-white shadow-[0_0_15px_rgba(10,102,194,0.8)] ring-2 ring-[#0A66C2] scale-105' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', activeStyle: 'bg-black text-white shadow-[0_0_15px_rgba(37,244,238,0.8)] ring-2 ring-[#25F4EE] scale-105' },
];

export default function PostEditorWorkspace({
  initialMedia,
  currentPostTitle = 'Salvemos los árboles',
  activeOrgId = 'org-1',
}: PostEditorWorkspaceProps) {
  const [caption, setCaption] = useState('');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  // Modal de Calendario de Programación
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [scheduledTime, setScheduledTime] = useState('14:00');

  const [thumbnails, setThumbnails] = useState<string[]>(
    initialMedia.length > 0
      ? initialMedia.map((m) => m.url)
      : DEFAULT_IMAGES
  );

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((p) => p !== id)
          : prev
        : [...prev, id]
    );
  };

  const handlePublish = async (isScheduled = false) => {
    if (!caption.trim() && thumbnails.length === 0) {
      setStatusType('error');
      setStatusMessage('Ingresa una descripción o selecciona multimedia.');
      return;
    }

    setIsPublishing(true);
    setStatusMessage(null);

    const result = await publishPostAction({
      title: currentPostTitle,
      caption: caption || 'Publicación desde NUH Workspace',
      mediaUrls: thumbnails,
      platforms: selectedPlatforms,
      orgId: activeOrgId,
    });

    setIsPublishing(false);

    if (result.success) {
      setStatusType('success');
      setStatusMessage(
        isScheduled
          ? `🗓️ ¡Programado para el ${scheduledDate} a las ${scheduledTime}!`
          : '✔️ ¡Publicación enviada a n8n y redes!'
      );
      if (isScheduled) setIsCalendarOpen(false);
    } else {
      setStatusType('error');
      setStatusMessage(result.error || 'Error al publicar.');
    }
  };

  const activeMediaUrl = thumbnails[activeMediaIndex] || DEFAULT_IMAGES[0];
  const isVideo = initialMedia[activeMediaIndex]?.isVideo || false;

  const handleAddImage = () => {
    const nextImage = DEFAULT_IMAGES[thumbnails.length % DEFAULT_IMAGES.length];
    if (thumbnails.length < 7) {
      setThumbnails((prev) => [...prev, nextImage]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#D9D9D9] border border-black/10 rounded-[32px] p-5 sm:p-8 shadow-md flex flex-col items-center gap-6 select-none relative">
      
      {/* TÍTULO DE LA PUBLICACIÓN */}
      <div className="w-full flex items-center justify-between border-b border-black/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#666666] uppercase tracking-widest">
            Editor de Publicación
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-black text-black tracking-tight bg-white px-4 py-1.5 rounded-full shadow-sm">
          {currentPostTitle}
        </h2>
      </div>

      {/* ALERT MESSAGES */}
      {statusMessage && (
        <div
          className={`w-full p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-sm ${
            statusType === 'success'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
              : 'bg-rose-100 border-rose-300 text-rose-900'
          }`}
        >
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-white/60 hover:bg-white text-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN CONTAINER: RESPONSIVE GRID (MEDIA PREVIEW + TEXT AREA + SOCIAL LEDS) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PREVIEW CONTAINER (COL 8 DE 12 EN DESKTOP) */}
        <div className="lg:col-span-10 bg-white/80 backdrop-blur-md border border-black/10 rounded-[28px] p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* IMAGEN/VIDEO PREVIEW */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-full aspect-square max-w-[280px] rounded-[22px] overflow-hidden border border-black/10 bg-black/5 shadow-sm">
                {isVideo ? (
                  <video src={activeMediaUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={activeMediaUrl} alt="preview-active" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Paginación de puntos */}
              <div className="flex items-center justify-center gap-1.5">
                {thumbnails.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      idx === activeMediaIndex ? 'w-3 h-3 bg-black shadow-sm' : 'w-2 h-2 bg-[#BBBBBB]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* PREVISUALIZACIÓN DE TEXTO / COPY */}
            <div className="w-full h-full min-h-[180px] bg-white border border-black/10 rounded-[20px] p-4 flex flex-col justify-between shadow-inner">
              <p className="text-xs font-semibold text-black leading-relaxed whitespace-pre-wrap">
                {caption.trim() || 'Escribe una descripción a continuación para previsualizar como aparecerá en tus redes sociales...'}
              </p>
              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[10px] text-[#777777] font-bold">
                <span>{caption.length} caracteres</span>
                <span>{selectedPlatforms.length} redes activas</span>
              </div>
            </div>

          </div>
        </div>

        {/* BARRA DE REDES SOCIALES (COL 2 DE 12 EN DESKTOP / HORIZONTAL EN MOBILE) */}
        <div className="lg:col-span-2 w-full flex flex-col items-center gap-3 bg-white/80 p-4 rounded-[28px] border border-black/10 shadow-sm">
          <span className="text-[10px] font-black text-[#666666] uppercase tracking-wider text-center">
            Redes
          </span>

          <div className="flex flex-wrap lg:flex-col gap-2.5 justify-center">
            {SOCIAL_PLATFORMS.map((plat) => {
              const isSelected = selectedPlatforms.includes(plat.id);
              return (
                <button
                  key={plat.id}
                  onClick={() => togglePlatform(plat.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? plat.activeStyle
                      : 'bg-black/70 text-white hover:bg-black hover:scale-105'
                  }`}
                  title={`${plat.name} ${isSelected ? '(Seleccionada)' : ''}`}
                >
                  {plat.id === 'facebook' && 'f'}
                  {plat.id === 'instagram' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                  {plat.id === 'x' && '𝕏'}
                  {plat.id === 'linkedin' && 'in'}
                  {plat.id === 'tiktok' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* CARROUSEL DE MINIATURAS Y BOTÓN AÑADIR */}
      <div className="w-full bg-white/80 p-4 rounded-[28px] border border-black/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 overflow-x-auto w-full py-1 scrollbar-none">
          {thumbnails.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setActiveMediaIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-[16px] overflow-hidden cursor-pointer border-2 transition-all ${
                idx === activeMediaIndex
                  ? 'border-black scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}

          {thumbnails.length < 7 && (
            <button
              onClick={handleAddImage}
              className="flex-shrink-0 w-16 h-16 rounded-[16px] border-2 border-dashed border-black/20 hover:border-black bg-white flex flex-col items-center justify-center gap-1 text-black font-black transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span className="text-[9px] uppercase tracking-wider font-extrabold">Añadir</span>
            </button>
          )}
        </div>

        <Link
          href="/dashboard/gallery"
          className="flex-shrink-0 px-4 py-2.5 rounded-full bg-white hover:bg-black hover:text-white text-black border border-black/10 text-xs font-black transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Mi Galería</span>
        </Link>
      </div>

      {/* CAJA DE TEXTO PARA ESCRIBIR DESCRIPCIÓN Y BOTONES DE ACCIÓN */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* TEXTAREA REDACCIÓN */}
        <div className="sm:col-span-9">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escribe la descripción de la publicación aquí..."
            className="w-full min-h-[100px] p-4 rounded-[24px] bg-white border border-black/15 text-xs sm:text-sm font-medium text-black placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-black shadow-inner resize-none"
          />
        </div>

        {/* BOTONES ACCIÓN: CALENDARIO Y PUBLICAR */}
        <div className="sm:col-span-3 flex sm:flex-col items-center justify-center gap-3">
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="w-full py-3.5 px-4 rounded-full bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Programar Fecha/Hora"
          >
            <CalendarIcon className="w-4 h-4 stroke-[2.5]" />
            <span>Programar</span>
          </button>

          <button
            onClick={() => handlePublish(false)}
            disabled={isPublishing}
            className="w-full py-3.5 px-4 rounded-full bg-black text-white hover:bg-neutral-800 disabled:opacity-50 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isPublishing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Publicar</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* MODAL INTERACTIVO DE CALENDARIO */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-black/10 space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="text-sm font-black text-black">Programar Publicación</h3>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center text-black font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[#666666] tracking-wider block mb-1">
                  Fecha de Envío
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-neutral-50 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-[#666666] tracking-wider block mb-1">
                  Hora Exacta
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-neutral-50 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="w-1/2 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-black uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={() => handlePublish(true)}
                disabled={isPublishing}
                className="w-1/2 py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-black uppercase tracking-wider shadow-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
