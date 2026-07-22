'use client';

import { type ReactNode } from 'react';

interface FolderCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function FolderCard({ title, children, className = '' }: FolderCardProps) {
  return (
    <div
      className={`relative w-full h-full flex flex-col ${className}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.06))' }}
    >
      {/* Pestaña (Tab) Superior Blanca */}
      <div
        className="absolute left-0 top-0 bg-white"
        style={{
          height: '14px',
          width: '75px',
          borderRadius: '10px 10px 0 0',
        }}
      />

      {/* Cuerpo Principal Blanco */}
      <div
        className="relative z-10 w-full flex-1 bg-white flex flex-col pt-[16px] pl-[10px] pr-5 pb-5"
        style={{
          marginTop: '13px', /* Justo debajo de la pestaña, superponiendo un píxel para que no haya línea */
          borderRadius: '0 16px 16px 16px'
        }}
      >
        {/* Título: Texto en Mayúsculas */}
        <div className="flex items-center mb-3">
          <span className="text-[11px] font-extrabold text-[#000000] tracking-tight uppercase leading-none">
            {title}
          </span>
        </div>

        {/* Contenido Interno */}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
