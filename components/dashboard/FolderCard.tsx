'use client';

import { type ReactNode } from 'react';

interface FolderCardProps {
  title: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FolderCard({ title, children, className = '' }: FolderCardProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Tab (Lengüeta) */}
      <div
        className="absolute"
        style={{
          top: '-12px',
          left: '0',
          width: '70px',
          height: '12px',
          background: '#D9D9D9',
          borderRadius: '8px 8px 0 0',
        }}
      />

      {/* Cuerpo del Folder */}
      <div
        className="relative w-full h-full pt-5 pb-4 px-5 flex flex-col justify-between"
        style={{
          background: '#D9D9D9',
          borderRadius: '0 20px 20px 20px',
        }}
      >
        {/* Título interno del Folder */}
        <span className="text-[12px] font-extrabold text-[#000000] tracking-tight uppercase mb-3 block">
          {title}
        </span>

        {/* Contenido */}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
