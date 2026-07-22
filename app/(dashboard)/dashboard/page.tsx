'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import Link from 'next/link';
import SocialSidebar from '@/components/dashboard/SocialSidebar';
import UploadQueueWidget from '@/components/dashboard/UploadQueueWidget';
import FolderCard from '@/components/dashboard/FolderCard';
import ContentStack from '@/components/dashboard/ContentStack';
import StorageBar from '@/components/dashboard/StorageBar';
import ConversationsSidebar from '@/components/dashboard/ConversationsSidebar';
import PostEditorWorkspace from '@/components/dashboard/PostEditorWorkspace';
import { createBrowserClient } from '@/lib/supabase';
import { Sparkles, Plus, ChevronDown, User, LogOut } from 'lucide-react';

interface SelectedMedia {
  file?: File;
  url: string;
  isVideo?: boolean;
}

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedMedia[]>([]);
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('org-1');
  const [activePostTitle, setActivePostTitle] = useState('Salvemos los árboles');
  const [activeModal, setActiveModal] = useState<'org' | 'profile' | 'storage' | 'reach' | 'planner' | 'comments' | null>(null);

  const supabase = createBrowserClient();

  const orgNames: Record<string, string> = {
    'org-1': 'Organización número 1',
    'org-2': 'Organización número 2',
    'org-3': 'Organización número 3',
  };

  // Selector de multimedia
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith('video/'),
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleCrearClick = () => {
    setActivePostTitle('Nueva Publicación');
    setIsEditorActive(true);
  };

  const handleBackToDashboard = () => {
    setIsEditorActive(false);
  };

  const handleSelectPostFromSidebar = (postTitle: string) => {
    setActivePostTitle(postTitle);
    setIsEditorActive(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const transitionProps: Transition = {
    duration: 0.3,
    ease: [0.25, 0.8, 0.25, 1],
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F2F2] text-black font-sans overflow-x-hidden relative flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Input de multimedia oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,video/*"
        className="hidden"
      />

      {/* TOP HEADER BAR (RESPONSIVE FLEX) */}
      <header className="w-full flex items-center justify-between gap-4 z-40 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToDashboard}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#C4C4C4] hover:bg-[#B8B8B8] text-black text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            Build 4 Venezuela
          </button>
          <button
            onClick={() => setActiveModal('profile')}
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#C4C4C4] hover:bg-[#B8B8B8] text-black text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            PRO
          </button>
        </div>

        {/* Logo NUH superior pequeño cuando el Editor está activo */}
        {isEditorActive && (
          <h1
            onClick={handleBackToDashboard}
            className="nuh-title text-3xl sm:text-4xl font-black text-black tracking-tighter cursor-pointer"
          >
            NUH
          </h1>
        )}
      </header>

      {/* MAIN DASHBOARD CONTENT (CUANDO NO ESTÁ EN MODO EDITOR) */}
      <AnimatePresence mode="wait">
        {!isEditorActive && (
          <motion.main
            key="dashboard-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transitionProps}
            className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between gap-8 z-20"
          >
            {/* HEROPAGE CENTER: TITULO NUH + ACCIONES */}
            <div className="flex flex-col items-center justify-center space-y-6 my-auto py-4">
              <p className="text-xs sm:text-sm font-semibold text-[#666666] tracking-wide select-none text-center">
                Agiliza tu comunicación con...
              </p>

              <h1
                onClick={handleBackToDashboard}
                className="nuh-title text-7xl sm:text-9xl lg:text-[180px] font-black text-black tracking-tighter leading-none text-center select-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                NUH
              </h1>

              {/* ACTION BAR: SELECTOR ORG + BOTÓN CREAR */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto relative">
                {/* Desplegable de Organización */}
                <div className="relative w-full sm:w-auto flex-1">
                  <button
                    onClick={() => setActiveModal(activeModal === 'org' ? null : 'org')}
                    className="w-full flex items-center justify-between px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#D9D9D9] hover:bg-[#CFCFCF] text-black border border-black/5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="truncate pr-2">{orgNames[selectedOrg] || 'Seleccionar Organización'}</span>
                    <ChevronDown className={`w-4 h-4 opacity-70 flex-shrink-0 transition-transform ${activeModal === 'org' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeModal === 'org' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 10, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute top-full left-0 w-full bg-white rounded-2xl border border-black/10 shadow-2xl p-2 z-50 flex flex-col gap-1 mt-1"
                      >
                        {Object.entries(orgNames).map(([id, name]) => (
                          <button
                            key={id}
                            onClick={() => {
                              setSelectedOrg(id);
                              setActiveModal(null);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              selectedOrg === id
                                ? 'bg-black text-white'
                                : 'hover:bg-neutral-100 text-black'
                            }`}
                          >
                            <span>{name}</span>
                            {selectedOrg === id && <span>✓</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Botón Crear -> Inicia el Editor Workspace */}
                <button
                  onClick={handleCrearClick}
                  className="btn-crear w-full sm:w-36 py-3.5 px-6 text-xs sm:text-sm font-black uppercase tracking-wider rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Crear</span>
                </button>
              </div>
            </div>

            {/* SECCIÓN INFERIOR BENTO CARDS (GRID RESPONSIVE 1 A 5 COLUMNAS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 w-full items-end mt-auto pt-4">
              
              {/* Stack de Contenido */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ContentStack />
              </div>

              {/* Card 1: Almacenamiento */}
              <div className="col-span-1">
                <FolderCard title="Almacenamiento" onClick={() => setActiveModal('storage')}>
                  <StorageBar usedGB={3500} totalGB={3688} />
                </FolderCard>
              </div>

              {/* Card 2: Alcance Total */}
              <div className="col-span-1">
                <FolderCard title="Alcance total (mes)" onClick={() => setActiveModal('reach')}>
                  <div className="flex flex-col justify-center h-full">
                    <p className="text-3xl font-black text-black tracking-tight leading-none">
                      252K
                    </p>
                  </div>
                </FolderCard>
              </div>

              {/* Card 3: Planificador */}
              <div className="col-span-1">
                <FolderCard title="Planificador" onClick={() => setActiveModal('planner')}>
                  <div className="flex flex-col justify-center h-full">
                    <p className="text-3xl font-black text-black tracking-tight leading-none">
                      8 hoy
                    </p>
                  </div>
                </FolderCard>
              </div>

              {/* Card 4: Comentarios */}
              <div className="col-span-1">
                <FolderCard title="Comentarios" onClick={() => setActiveModal('comments')}>
                  <div className="flex flex-col justify-center h-full">
                    <p className="text-3xl font-black text-black tracking-tight leading-none">
                      100
                    </p>
                    <p className="text-xs font-bold text-[#666666] mt-1">
                      Nuevos
                    </p>
                  </div>
                </FolderCard>
              </div>

            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* VISTA DEL EDITOR WORKSPACE (CUANDO IS EDITOR ACTIVE ES TRUE) */}
      <AnimatePresence mode="wait">
        {isEditorActive && (
          <motion.main
            key="editor-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={transitionProps}
            className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start z-20 py-4"
          >
            {/* SIDEBAR DE CARPETAS (COL 3 DE 12 EN DESKTOP) */}
            <div className="lg:col-span-3 w-full h-full min-h-[350px]">
              <ConversationsSidebar
                onBackToDashboard={handleCrearClick}
                selectedOrg={selectedOrg}
                onSelectOrg={setSelectedOrg}
                onSelectPost={handleSelectPostFromSidebar}
              />
            </div>

            {/* AREA DEL EDITOR CENTRAL (COL 9 DE 12 EN DESKTOP) */}
            <div className="lg:col-span-9 w-full">
              <PostEditorWorkspace
                initialMedia={selectedFiles}
                currentPostTitle={activePostTitle}
                activeOrgId={selectedOrg}
              />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* BARRA FLOTANTE DE REDES Y NAVEGACIÓN (DESKTOP) */}
      <div className="fixed bottom-6 left-6 z-40 hidden xl:block">
        <SocialSidebar
          isTransitioning={false}
          onOpenProfile={() => setActiveModal('profile')}
        />
      </div>

      {/* MODAL INTERACTIVO DE PERFIL DE USUARIO */}
      <AnimatePresence>
        {activeModal === 'profile' && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-black/10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-xl shadow-sm">
                    👤
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black">Mi Perfil de Usuario</h3>
                    <p className="text-xs font-semibold text-[#666666]">Sesión Activa NUH</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-black font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">
                  Navegación Rápida
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/dashboard/feed"
                    onClick={() => setActiveModal(null)}
                    className="p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs font-black transition-all shadow-sm"
                  >
                    <span>🌐 Feed Global</span>
                  </Link>
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setActiveModal(null)}
                    className="p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-2xl border border-purple-200 flex items-center gap-2 text-xs font-black transition-all shadow-sm"
                  >
                    <span>🛡️ Panel Admin</span>
                  </Link>
                  <Link
                    href="/dashboard/gallery"
                    onClick={() => setActiveModal(null)}
                    className="p-3.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-2xl border border-blue-200 flex items-center gap-2 text-xs font-black transition-all shadow-sm"
                  >
                    <span>🖼️ Mi Galería</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setActiveModal(null)}
                    className="p-3.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded-2xl border border-black/10 flex items-center gap-2 text-xs font-black transition-all shadow-sm"
                  >
                    <span>⚙️ Ajustes</span>
                  </Link>
                </div>
              </div>

              <div className="pt-2 border-t border-black/10">
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
