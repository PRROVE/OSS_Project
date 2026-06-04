/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  GraduationCap, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  RefreshCw, 
  Zap, 
  Users, 
  Flower2, 
  ArrowRight,
  Brain
} from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (selectedCategories: string[]) => void;
  theme: 'light' | 'dark';
}

interface CategoryCard {
  id: string;
  ko: string;
  en: string;
  icon: any;
  colorClass: string;
}

const CATEGORIES: CategoryCard[] = [
  { id: 'academics', ko: '학습', en: 'Academics', icon: GraduationCap, colorClass: 'text-violet-500' },
  { id: 'vitality', ko: '건강', en: 'Vitality', icon: Heart, colorClass: 'text-rose-500' },
  { id: 'career', ko: '업무', en: 'Career', icon: Briefcase, colorClass: 'text-amber-500' },
  { id: 'selfdev', ko: '성장', en: 'Self-Dev', icon: TrendingUp, colorClass: 'text-emerald-500' },
  { id: 'routine', ko: '습관', en: 'Routine', icon: RefreshCw, colorClass: 'text-indigo-500' },
  { id: 'efficiency', ko: '생산성', en: 'Efficiency', icon: Zap, colorClass: 'text-yellow-500' },
  { id: 'social', ko: '관계', en: 'Social', icon: Users, colorClass: 'text-blue-500' },
  { id: 'mindfulness', ko: '웰니스', en: 'Mindfulness', icon: Flower2, colorClass: 'text-teal-500' },
];

export default function OnboardingView({ onComplete, theme }: OnboardingViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pulseId, setPulseId] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setPulseId(id);
    setTimeout(() => setPulseId(null), 150);

    setSelectedIds(current => 
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  };

  const handleContinue = () => {
    // If none selected, default to a few
    const finalSelection = selectedIds.length > 0 
      ? selectedIds.map(id => CATEGORIES.find(c => c.id === id)?.ko || '')
      : ['생산성', '성장', '웰니스'];
    onComplete(finalSelection);
  };

  const bgStyle = theme === 'dark' ? 'bg-[#0b1326]' : 'bg-slate-50';
  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const subtext = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bgStyle} flex flex-col items-center justify-between pb-12 pt-16 px-6 relative overflow-hidden transition-colors duration-400`}>
      {/* Ambient glowing fields */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000" />

      {/* Header section */}
      <header className="flex flex-col items-center gap-6 text-center max-w-md w-full relative z-10">
        {/* Floating gradient halo */}
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-full h-full bg-gradient-to-tr from-[#6b38d4] to-[#8455ef] rounded-full shadow-[0_8px_30px_rgba(109,59,215,0.2)] flex items-center justify-center relative z-10">
            <Brain className="text-white w-8 h-8 animate-pulse duration-4000" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className={`font-display text-2xl font-bold tracking-tight ${textPrimary}`}>
            경험 디자인
          </h1>
          <p className={`text-base max-w-[280px] mx-auto ${subtext}`}>
            어떤 분야의 자기관리에 관심이 있으신가요?
          </p>
        </div>
      </header>

      {/* Grid of categories */}
      <main className="w-full max-w-md my-8 relative z-10">
        <div id="category-grid" className="grid grid-cols-2 gap-4">
          {CATEGORIES.map(category => {
            const isSelected = selectedIds.includes(category.id);
            const isPulses = pulseId === category.id;
            const Icon = category.icon;

            const cardBg = theme === 'dark'
              ? (isSelected ? 'bg-violet-950/40 border-[#6d3bd7] shadow-[0_8px_20px_rgba(109,59,215,0.15)]' : 'bg-[#131b2e] border-slate-800/80 hover:border-violet-500/30')
              : (isSelected ? 'bg-violet-50/70 border-[#6d3bd7] shadow-[0_4px_16px_rgba(109,59,215,0.06)]' : 'bg-white border-slate-200/50 hover:border-violet-500/25');

            return (
              <div
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`border rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300 ${cardBg} ${
                  isPulses ? 'scale-95' : 'hover:scale-[1.01]'
                }`}
              >
                <div className={`p-2 w-10 h-10 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100/70'} rounded-xl flex items-center justify-center transition-transform duration-300 ${
                  isSelected ? 'scale-110 text-violet-500' : category.colorClass
                }`}>
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${textPrimary}`}>
                    {category.ko}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                    {category.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky footer operations */}
      <footer className="w-full max-w-md flex flex-col gap-4 relative z-10 mt-auto">
        <button
          onClick={handleContinue}
          className="w-full h-14 bg-[#6b38d4] hover:bg-[#5a2ab3] text-white rounded-full font-semibold text-sm shadow-[0_8px_24px_rgba(109,59,215,0.25)] active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>계속하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Custom dot indicator matching exact mockup */}
        <div id="onboarding-index-dots" className="flex justify-center items-center gap-1.5 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#6b38d4]" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </footer>
    </div>
  );
}
