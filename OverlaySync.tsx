import React from 'react';

interface OverlaySyncProps {
  isSyncing: boolean;
  themeColor: string;
}

const OVERLAY_THEMES: { [key: string]: { gradient: string; text: string; label: string } } = {
  dashboard: {
    gradient: 'from-[#0F1E4A] via-[#0A1435] to-[#050B1E]',
    text: 'text-sky-455 text-sky-400',
    label: 'Home Campus Portal Hub'
  },
  curriculum: {
    gradient: 'from-[#092B20] via-[#061D15] to-[#030E0B]',
    text: 'text-emerald-400',
    label: 'Subjects Offered (NERDC Guidelines)'
  },
  departments: {
    gradient: 'from-[#0A1A3A] via-[#071228] to-[#030914]',
    text: 'text-indigo-400',
    label: 'Faculty Academicians'
  },
  'ai-tutor': {
    gradient: 'from-[#1B1437] via-[#120D25] to-[#090612]',
    text: 'text-violet-400',
    label: 'Crest AI West African Virtual Tutor'
  },
  'exam-center': {
    gradient: 'from-[#331D0F] via-[#211209] to-[#0E0704]',
    text: 'text-[#722F37] font-black',
    label: 'Quiz Portal / Resource Central'
  },
  admissions: {
    gradient: 'from-[#0A2540] via-[#06182C] to-[#030C16]',
    text: 'text-sky-450 text-sky-400',
    label: 'Online Application Desk'
  },
  results: {
    gradient: 'from-[#220B30] via-[#14061D] to-[#0A020E]',
    text: 'text-purple-400',
    label: 'Student Scores Ledger Check'
  },
  gallery: {
    gradient: 'from-[#300B25] via-[#1D0616] to-[#0E020B]',
    text: 'text-[#ec4899]',
    label: 'Photo Gallery Services'
  },
  admin: {
    gradient: 'from-[#360914] via-[#22050C] to-[#110206]',
    text: 'text-rose-400 text-rose-500',
    label: 'Administrative Security Core'
  }
};

export default function OverlaySync({ isSyncing, themeColor }: OverlaySyncProps) {
  const activePattern = OVERLAY_THEMES[themeColor] || OVERLAY_THEMES.dashboard;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none ${
        isSyncing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background tinted color sweeps */}
      <div 
        className={`absolute inset-0 bg-gradient-to-tr ${activePattern.gradient} transition-all duration-300`} 
      />
      
      {/* Ticking graphic and message */}
      <div className="relative z-10 flex flex-col items-center space-y-4 text-center p-6 select-none bg-slate-900/40 p-10 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="w-12 h-12 rounded-full border-4 border-[#722F37] border-t-transparent animate-spin" />
        <h3 className={`text-xl font-display font-medium tracking-tight ${activePattern.text}`}>
          Connecting {activePattern.label}...
        </h3>
        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          Wolcrest Security Token Active
        </p>
      </div>
    </div>
  );
}
