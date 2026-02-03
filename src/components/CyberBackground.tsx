import { useEffect, useRef } from 'react';

export function CyberBackground() {
  return (
    <>
      {/* Subtle gradient background - no distracting animations */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Subtle radial accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
    </>
  );
}