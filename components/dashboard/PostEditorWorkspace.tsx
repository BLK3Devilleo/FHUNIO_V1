'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectedMedia {
  file: File;
  url: string;
  isVideo: boolean;
}

interface PostEditorWorkspaceProps {
  initialMedia: SelectedMedia[];
}

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', color: '#1877F2', icon: 'FB' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F', icon: 'IG' },
  { id: 'x', label: 'X', color: '#000000', icon: 'X' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: 'IN' },
  { id: 'tiktok', label: 'TikTok', color: '#000000', icon: 'TT' },
];

export default function PostEditorWorkspace({ initialMedia }: PostEditorWorkspaceProps) {
  const [caption, setCaption] = useState(
    '🚀 ¡Gran lanzamiento! Optimiza la comunicación de tus proyectos en tiempo real con Build For Venezuela.'
  );
  const [mediaList, setMediaList] = useState<SelectedMedia[]>(initialMedia);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [activePlatformPreview, setActivePlatformPreview] = useState<string>('instagram');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Mover elemento en el carrusel para cambiar el orden
  const moveMedia = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= mediaList.length) return;
    const updated = [...mediaList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setMediaList(updated);
    if (activeMediaIndex === fromIndex) setActiveMediaIndex(toIndex);
  };

  // Toggle de selección simple de red social
  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[65vw]">
      {/* =========================================================
          BLOQUE SUPERIOR: PREVISUALIZACIÓN DERECHA E IZQUIERDA
          ========================================================= */}
      <div className="grid grid-cols-12 gap-5 w-full items-stretch">
        {/* 1. SECCIÓN MULTIMEDIA Y CARRUSEL INTERACTIVO (4 cols) */}
        <div className="col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-black/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-black">
              Carrusel / Multimedia ({mediaList.length})
            </span>
            <span className="text-[10px] font-bold text-[#666666] bg-black/5 px-2 py-0.5 rounded-full">
              {activePlatformPreview.toUpperCase()} FORMAT
            </span>
          </div>

          {/* Display Principal de Multimedia */}
          <div className="relative w-full h-[28vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group">
            {activeMedia ? (
              activeMedia.isVideo ? (
                <video src={activeMedia.url} controls className="w-full h-full object-contain" />
              ) : (
                <img src={activeMedia.url} alt="media-preview" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="text-white/40 text-xs font-semibold">Sin multimedia</div>
            )}

            {/* Badge de Posición de Carrusel */}
            {mediaList.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {activeMediaIndex + 1} / {mediaList.length}
              </div>
            )}
          </div>

          {/* Tiras de Miniaturas con Controles de Reordenamiento */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none">
            {mediaList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  idx === activeMediaIndex ? 'border-black scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {item.isVideo ? (
                  <video src={item.url} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <img src={item.url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                )}

                {/* Badge de Orden 1, 2, 3 */}
                <div className="absolute top-0.5 left-0.5 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {idx + 1}
                </div>

                {/* Controles de Mover Orden (Izquierda / Derecha) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-between px-1 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMedia(idx, idx - 1);
                    }}
                    disabled={idx === 0}
                    className="text-white text-xs font-black disabled:opacity-30 hover:scale-125"
                  >
                    ◄
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMedia(idx, idx + 1);
                    }}
                    disabled={idx === mediaList.length - 1}
                    className="text-white text-xs font-black disabled:opacity-30 hover:scale-125"
                  >
                    ►
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. RECUADRO DE PREVISUALIZACIÓN DE TEXTO / POST (5 cols) */}
        <div className="col-span-5 bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-black/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-black">
              Vista Previa de Publicación
            </span>
            <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full uppercase">
              En Vivo
            </span>
          </div>

          {/* Card Mockup de Red Social */}
          <div className="flex-1 bg-[#FAFAFA] border border-black/10 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
            {/* Header del Post */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-black/5">
              <div className="w-8 h-8 rounded-full bg-[#C4C4C4] font-bold text-xs flex items-center justify-center text-black">
                BV
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-black leading-tight">
                  Build For Venezuela
                </span>
                <span className="text-[9px] font-medium text-[#888888]">
                  Previsualización en {activePlatformPreview}
                </span>
              </div>
            </div>

            {/* Cuerpo del Texto Introducido */}
            <div className="my-3 flex-1 overflow-y-auto max-h-[18vh] text-xs font-normal text-[#222222] whitespace-pre-wrap leading-relaxed pr-1">
              {caption || <span className="text-[#A0A0A0] italic">El texto introducido abajo aparecerá aquí...</span>}
            </div>

            {/* Footer de Interacción */}
            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[#777777] text-[11px] font-semibold">
              <span>❤️ 2.4k Me gusta</span>
              <span>💬 148 Comentarios</span>
            </div>
          </div>
        </div>

        {/* 3. SELECTOR DE REDES SOCIALES (2 cols) */}
        <div className="col-span-2 bg-white/80 backdrop-blur-md rounded-3xl p-3 border border-black/10 shadow-xl flex flex-col items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-black text-center mb-1">
            Redes
          </span>

          <div className="flex flex-col gap-2.5 w-full items-center">
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatforms.includes(p.id);
              const isActivePreview = activePlatformPreview === p.id;

              return (
                <div key={p.id} className="relative group w-full flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePlatform(p.id)}
                    onMouseDown={() => setActivePlatformPreview(p.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-extrabold text-white transition-all shadow-md ${
                      isSelected ? 'ring-2 ring-black ring-offset-2' : 'opacity-40 hover:opacity-80'
                    }`}
                    style={{ background: p.color }}
                    title={`Clic: ${isSelected ? 'Desmarcar' : 'Seleccionar'} | Mantener: Ver previsualización`}
                  >
                    {p.icon}
                  </motion.button>

                  {/* Indicador de Red activa para previsualizar */}
                  {isActivePreview && (
                    <div className="absolute -right-1 top-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white" />
                  )}
                </div>
              );
            })}
          </div>

          <span className="text-[9px] font-bold text-[#888888] text-center mt-1">
            {selectedPlatforms.length} elegida(s)
          </span>
        </div>
      </div>

      {/* =========================================================
          BLOQUE INFERIOR: CAJA DE TEXTO EN FORMA DE PÍLDORA
          ========================================================= */}
      <div className="w-full relative flex items-center justify-center">
        <div className="w-full max-w-[55vw] bg-white rounded-full p-2.5 px-6 border border-black/15 shadow-2xl flex items-center gap-4">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escribe aquí la descripción de tu publicación..."
            className="flex-1 bg-transparent text-sm font-medium text-black placeholder:text-[#999999] outline-none border-none"
          />

          <button className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all active:scale-95 flex-shrink-0 shadow-md">
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
