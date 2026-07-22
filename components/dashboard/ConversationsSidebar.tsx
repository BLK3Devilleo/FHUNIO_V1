'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConversationItem {
  id: string;
  title: string;
  date: string;
  active?: boolean;
}

interface ConversationsSidebarProps {
  onBackToDashboard: () => void;
  selectedOrg?: string;
  onSelectOrg?: (org: string) => void;
  onSelectConversation?: (item: ConversationItem) => void;
}

const PROJECTS = [
  { id: 'org-1', name: 'Organización número 1', conversations: [
    { id: '1', title: 'Campaña Build For Venezuela', date: 'Hoy, 14:20', active: true },
    { id: '2', title: 'Lanzamiento versión PRO', date: 'Ayer', active: false },
    { id: '3', title: 'Promoción de Primavera', date: '18 Jul', active: false },
  ]},
  { id: 'org-2', name: 'Organización número 2', conversations: [
    { id: '4', title: 'Anuncio de Producto B', date: '12 Jul', active: true },
    { id: '5', title: 'Campaña de Verano', date: '05 Jul', active: false },
  ]},
  { id: 'org-3', name: 'Organización número 3', conversations: [
    { id: '6', title: 'Boletín Mensual', date: '01 Jul', active: true },
  ]},
];

export default function ConversationsSidebar({
  onBackToDashboard,
  selectedOrg = 'org-1',
  onSelectOrg,
  onSelectConversation,
}: ConversationsSidebarProps) {
  const [currentOrgId, setCurrentOrgId] = useState(selectedOrg);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string>('1');

  const activeProject = PROJECTS.find((p) => p.id === currentOrgId) || PROJECTS[0];

  const handleOrgChange = (id: string) => {
    setCurrentOrgId(id);
    setIsDropdownOpen(false);
    if (onSelectOrg) onSelectOrg(id);
  };

  return (
    <div className="w-[18vw] h-[82vh] bg-white/80 backdrop-blur-md rounded-3xl border border-black/10 p-4 flex flex-col justify-between shadow-xl relative">
      {/* Parte Superior: Botón Volver al Dashboard */}
      <div>
        <button
          onClick={onBackToDashboard}
          className="w-full py-2.5 px-4 rounded-full bg-[#E5E5E5] hover:bg-[#D9D9D9] text-black text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al Dashboard</span>
        </button>

        {/* Separador */}
        <div className="my-3 border-b border-black/5" />

        {/* Título de Sección */}
        <div className="px-2 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#666666]">
            Publicaciones Pendientes
          </span>
          <span className="text-[10px] bg-black/10 text-black px-2 py-0.5 rounded-full font-bold">
            {activeProject.conversations.length}
          </span>
        </div>

        {/* Lista de Conversaciones estilo ChatGPT */}
        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[42vh] pr-1 scrollbar-none">
          {activeProject.conversations.map((item) => {
            const isSelected = item.id === selectedConvId;
            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 3 }}
                onClick={() => {
                  setSelectedConvId(item.id);
                  if (onSelectConversation) onSelectConversation(item);
                }}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col gap-0.5 border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate max-w-[11vw]">{item.title}</span>
                  <svg className={`w-3 h-3 ${isSelected ? 'opacity-90' : 'opacity-30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#888888]'}`}>
                  {item.date}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          PÍLDORA DE SELECCIÓN DE PROYECTO / ORGANIZACIÓN (Debajo de conversaciones)
          ========================================================= */}
      <div className="mt-2 relative">
        <label className="text-[10px] font-bold text-[#888888] uppercase px-1 mb-1 block">
          Proyecto / Organización
        </label>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-bold border border-black/10 transition-all active:scale-95 bg-[#D9D9D9] hover:bg-[#CFCFCF] text-black w-full shadow-sm"
        >
          <span className="truncate pr-2">{activeProject.name}</span>
          <svg
            className={`w-3.5 h-3.5 opacity-60 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown de Proyectos */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute bottom-12 left-0 w-full bg-white rounded-2xl border border-black/10 shadow-2xl p-1.5 z-50 flex flex-col gap-1"
            >
              {PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => handleOrgChange(proj.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    proj.id === currentOrgId ? 'bg-black text-white' : 'hover:bg-neutral-100 text-black'
                  }`}
                >
                  <span className="truncate">{proj.name}</span>
                  <span className="text-[10px] opacity-60">({proj.conversations.length})</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer del Panel */}
      <div className="pt-2 border-t border-black/5 text-center">
        <span className="text-[10px] font-semibold text-[#999999]">
          Sesión Guardada Automáticamente
        </span>
      </div>
    </div>
  );
}
