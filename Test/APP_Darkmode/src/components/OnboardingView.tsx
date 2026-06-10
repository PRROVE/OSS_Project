import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { School, Heart, Briefcase, TrendingUp, RotateCw, Zap, Users, Leaf, ArrowRight } from 'lucide-react';
import { AppState } from '../types.ts';
import { CATEGORIES } from '../initialData.ts';

interface OnboardingViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  school: School,
  heart: Heart,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  'rotate-cw': RotateCw,
  zap: Zap,
  users: Users,
  leaf: Leaf,
};

export default function OnboardingView({ state, updateState }: OnboardingViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isLight = state.settings.theme === 'light';

  const toggleCategory = (id: string, label: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleContinue = () => {
    // Collect label strings of selected categories to match state fields
    const selectedLabels = CATEGORIES.filter(c => selectedIds.includes(c.id)).map(c => c.label);
    
    updateState({
      completedOnboarding: true,
      aiPartner: {
        ...state.aiPartner,
        expertise: selectedLabels.length > 0 ? selectedLabels : ['프로젝트 기획', '시간 관리']
      }
    });
  };

  return (
    <div className={`w-full min-h-screen py-12 px-6 flex flex-col items-center select-none transition-colors duration-500 ${isLight ? 'bg-[#faf8ff]' : 'bg-[#0b1326]'}`}>
      
      {/* Decorative Glow Elements */}
      <div className="fixed top-[10%] -left-20 w-72 h-72 rounded-full bg-[#8b5cf6]/5 filter blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[20%] -right-20 w-72 h-72 rounded-full bg-emerald-500/5 filter blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-md pt-8 pb-10 flex flex-col items-center gap-6 text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-full overflow-hidden shadow-lg shadow-[#8b5cf6]/30 flex items-center justify-center bg-gradient-to-tr from-[#8b5cf6] to-[#d0bcff]"
        >
          {/* Glowing Aura Spherical Representation */}
          <div className="absolute w-12 h-12 rounded-full border border-white/20 animate-pulse bg-white/5 flex items-center justify-center">
            <span className="w-6 h-6 rounded-full bg-white/20 filter blur-sm" />
          </div>
          <Leaf className="text-white w-7 h-7 relative z-10" />
        </motion.div>

        <div className="space-y-2">
          <motion.h1 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-3xl font-semibold transition-colors duration-300 ${isLight ? 'text-[#131b2e]' : 'text-white'}`}
          >
            경험 디자인
          </motion.h1>
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm tracking-tight transition-colors duration-300 max-w-[280px] mx-auto ${isLight ? 'text-[#494454]' : 'text-[#cbc3d7]'}`}
          >
            어떤 분야의 자기관리에 관심이 있으신가요?
          </motion.p>
        </div>
      </header>

      {/* Grid of Interests */}
      <main className="w-full max-w-md flex-grow pb-48 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = iconMap[cat.icon] || School;
            const isSelected = selectedIds.includes(cat.id);
            return (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleCategory(cat.id, cat.label)}
                className={`rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] shadow-md shadow-[#8b5cf6]/15'
                    : isLight 
                    ? 'bg-white/80 border-[#dae2fd]/50 hover:border-[#8b5cf6]/40 shadow-sm shadow-neutral-100' 
                    : 'bg-[#131b2e]/60 border-white/5 hover:border-[#8b5cf6]/30 shadow-sm shadow-black/10'
                }`}
              >
                <div className={`p-2.5 rounded-xl w-fit ${
                  isSelected 
                    ? 'bg-[#8b5cf6] text-white' 
                    : isLight 
                    ? 'bg-neutral-100 text-[#494454]' 
                    : 'bg-[#1e263a] text-[#cbc3d7]'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-semibold text-base transition-colors duration-200 ${
                    isSelected ? 'text-[#8b5cf6]' : isLight ? 'text-[#131b2e]' : 'text-[#dae2fd]'
                  }`}>
                    {cat.label}
                  </h3>
                  <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${
                    isSelected ? 'text-[#8b5cf6]/80' : isLight ? 'text-neutral-400' : 'text-[#cbc3d7]/50'
                  }`}>
                    {cat.eng}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Sticky footer action bar */}
      <footer className={`fixed bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t z-20 ${
        isLight ? 'from-[#faf8ff] via-[#faf8ff]/95' : 'from-[#0b1326] via-[#0b1326]/95'
      } to-transparent`}>
        <div className="max-w-md mx-auto flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] text-white font-semibold text-base shadow-lg shadow-[#8b5cf6]/30 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>계속하기</span>
            <ArrowRight size={18} />
          </motion.button>
          
          {/* Pagers indicator dots */}
          <div className="flex justify-center items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]/30" />
            <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]/30" />
          </div>
        </div>
      </footer>
    </div>
  );
}
