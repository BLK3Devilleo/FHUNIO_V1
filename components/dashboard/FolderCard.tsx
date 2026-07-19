'use client';

import { type ReactNode } from 'react';

interface FolderCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function FolderCard({ title, children, className = '' }: FolderCardProps) {
  return (
    <div className={`relative w-full h-full flex flex-col group ${className} pt-4`}>
      {/* Folder Tab Container */}
      <div 
        className="absolute left-2 z-10 transition-all duration-300 group-hover:-translate-y-1" 
        style={{ top: '2px', width: '110px', height: '24px' }}
      >
        {/* Back layered tab (gives 3D depth) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#d1d1d1] to-[#e5e5e5] rounded-t-xl transform translate-x-2 -translate-y-1 shadow-inner" />
        
        {/* Main tab */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md border border-white/60 border-b-0 rounded-t-xl shadow-[0_-2px_15px_rgba(0,0,0,0.03)] flex items-center px-4" />
      </div>

      {/* Folder Body */}
      <div
        className="relative z-20 w-full h-full pt-6 pb-5 px-6 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(242, 242, 242, 0.85) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 1)',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,0.8)',
        }}
      >
        {/* Ambient glow inside folder */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-100/40 to-orange-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
          <span className="text-[13px] font-bold text-gray-800 tracking-tight uppercase letter-spacing-wider opacity-90">
            {title}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
