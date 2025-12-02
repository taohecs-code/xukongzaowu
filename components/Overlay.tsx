import React from 'react';
import { ThoughtNode, LayoutMode } from '../types';
import { AlignJustify, BrainCircuit, Calendar, X, Star, Globe, Atom, Tornado, LayoutGrid } from 'lucide-react';

interface OverlayProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  selectedNode: ThoughtNode | null;
  onCloseNode: () => void;
  minYear: number;
  maxYear: number;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ 
  currentYear, 
  onYearChange, 
  selectedNode, 
  onCloseNode,
  minYear,
  maxYear,
  layoutMode,
  onLayoutChange
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 p-6">
      
      {/* Header / Title */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#8c5a5a] font-serif mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
            虚空造物
          </h1>
          <p className="text-[#8a7a6a] tracking-[0.3em] text-sm md:text-base border-t border-[#8a7a6a]/30 pt-2 inline-block">
            PROJECT ZHOU: STAR MAP
          </p>
        </div>
        
        <div className="hidden md:flex flex-col gap-2 items-end">
           {/* Connection Status */}
           <div className="border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md p-4 rounded-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center animate-pulse">
                 <BrainCircuit className="text-[#D4AF37]" />
              </div>
              <div className="text-right">
                 <div className="text-[#D4AF37] text-xs uppercase tracking-widest">Neural Link</div>
                 <div className="text-white/80 font-mono text-lg">CONNECTED</div>
              </div>
           </div>
           
           {/* Layout Controls */}
           <div className="border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md p-2 rounded-sm flex items-center gap-2">
              <button 
                onClick={() => onLayoutChange('SPIRAL')}
                className={`p-2 rounded-sm transition-all duration-300 ${layoutMode === 'SPIRAL' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}
                title="Galaxy Spiral"
              >
                <Tornado size={20} />
              </button>
              <button 
                onClick={() => onLayoutChange('SPHERE')}
                className={`p-2 rounded-sm transition-all duration-300 ${layoutMode === 'SPHERE' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}
                title="Celestial Sphere"
              >
                <Globe size={20} />
              </button>
              <button 
                onClick={() => onLayoutChange('FORCE')}
                className={`p-2 rounded-sm transition-all duration-300 ${layoutMode === 'FORCE' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}
                title="Quantum Network"
              >
                <Atom size={20} />
              </button>
              <button 
                onClick={() => onLayoutChange('GROUPED')}
                className={`p-2 rounded-sm transition-all duration-300 ${layoutMode === 'GROUPED' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}
                title="Sector Clusters"
              >
                <LayoutGrid size={20} />
              </button>
           </div>
        </div>
      </header>

      {/* Main Content Area (Right Panel for Details) */}
      <div className="flex-1 flex items-center justify-end pointer-events-none">
        {selectedNode && (
          <div className="pointer-events-auto w-full max-w-md bg-black/80 backdrop-blur-xl border-l-2 border-[#D4AF37] p-8 transform transition-all duration-500 ease-out animate-in slide-in-from-right-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            <button 
                onClick={onCloseNode}
                className="absolute top-4 right-4 text-[#8a7a6a] hover:text-[#D4AF37] transition-colors"
            >
                <X size={24} />
            </button>
            
            <div className="flex items-center gap-2 mb-2 text-[#D4AF37]/70 text-xs tracking-widest uppercase">
                <Star size={12} />
                <span>{selectedNode.category} SECTOR</span>
                <span>•</span>
                <span>MAGNITUDE {selectedNode.importance.toFixed(1)}</span>
            </div>
            
            <h2 className="text-3xl text-[#D4AF37] font-serif font-bold mb-4 leading-tight">
              {selectedNode.title}
            </h2>
            
            <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] to-transparent mb-6 opacity-50" />
            
            <div className="text-gray-300 font-serif leading-relaxed text-lg max-h-[40vh] overflow-y-auto pr-4 whitespace-pre-line">
              {selectedNode.content}
            </div>
            
            <div className="mt-8 flex items-center justify-between text-[#8a7a6a] font-mono text-sm border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {selectedNode.date}
                </div>
                <div>ID: {selectedNode.id.split('-')[1].padStart(4, '0')}</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls / Timeline */}
      <footer className="pointer-events-auto w-full max-w-4xl mx-auto mb-8">
        <div className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/20 p-6 rounded-lg relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
            {/* Decoration Lines */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37]" />

            <div className="flex items-center justify-between mb-4">
                <span className="text-[#D4AF37] font-serif text-lg flex items-center gap-2">
                    <AlignJustify size={18} /> 星系演化 (Timeline)
                </span>
                <span className="font-mono text-2xl text-[#ff3300] tracking-widest drop-shadow-[0_0_5px_rgba(255,51,0,0.8)]">
                    {currentYear} / {maxYear}
                </span>
            </div>
            
            <div className="relative h-2 bg-[#1a0f0f] rounded-full overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-300 ease-out shadow-[0_0_10px_#D4AF37]"
                    style={{ width: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%` }}
                />
            </div>
            
            <input 
                type="range" 
                min={minYear} 
                max={maxYear} 
                value={currentYear} 
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex justify-between mt-2 text-xs text-[#8a7a6a] font-mono">
                <span>START: {minYear}</span>
                <span>PRESENT DAY</span>
            </div>
        </div>
        
        <div className="text-center mt-4 text-[#D4AF37]/40 text-xs font-serif tracking-[0.5em]">
            万物不可聊 • 重构宇宙
        </div>
      </footer>
    </div>
  );
};