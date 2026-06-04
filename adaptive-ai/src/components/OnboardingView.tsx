import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Dumbbell, 
  GraduationCap, 
  Briefcase, 
  HeartPulse, 
  BookOpen, 
  Palette, 
  Users2, 
  FlameKindling,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserProfile, ViewType } from '../types';

interface OnboardingViewProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

interface OnboardingCategory {
  id: string;
  name: string;
  icon: React.ElementType;
}

export default function OnboardingView({ currentView, setView, user, setUser }: OnboardingViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [onboardingStep, setOnboardingStep] = useState<number>(2); // Shown as Step 2 of 3 in design

  if (currentView !== 'onboarding') return null;

  const categories: OnboardingCategory[] = [
    { id: '운동', name: '운동', icon: Dumbbell },
    { id: '공부', name: '공부', icon: GraduationCap },
    { id: '업무', name: '업무', icon: Briefcase },
    { id: '건강', name: '건강', icon: HeartPulse },
    { id: '독서', name: '독서', icon: BookOpen },
    { id: '취미', name: '취미', icon: Palette },
    { id: '인간관계', name: '인간관계', icon: Users2 },
    { id: '명상', name: '명상', icon: FlameKindling }, // Self improvement
  ];

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleActionNext = () => {
    if (selectedIds.length === 0) return;
    
    // Inject the selected categories as the user's initial priorities / expertise setup!
    setUser(prev => ({
      ...prev,
      aiExpertise: selectedIds,
    }));

    // Alert successful customized companion setup and load standard app canvas
    setView('dashboard');
  };

  const handleActionBack = () => {
    setView('login');
  };

  return (
    <div className="ambient-bg-gradient min-h-screen flex items-center justify-center p-4 md:p-8 select-none text-[#1b1b24] w-full font-sans">
      
      {/* Background Gradient Decorative styling */}
      <style>{`
        .ambient-bg-gradient {
          background-color: #f5f2ff;
          background-image: radial-gradient(at 0% 0%, hsla(253,100%,94%,1) 0px, transparent 50%),
                            radial-gradient(at 100% 100%, hsla(160,94%,85%,1) 0px, transparent 50%);
          background-size: cover;
          background-position: center;
        }
        .glass-modal {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 40px -10px rgba(53, 37, 205, 0.04), 0 0 0 1px rgba(228, 225, 238, 0.5);
        }
      `}</style>

      {/* Modal Card Layout */}
      <main className="glass-modal w-full max-w-3xl rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Subtle interior background light flare */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#e2dfff] rounded-full blur-[80px] opacity-40 pointer-events-none" />

        {/* Modal Header */}
        <header className="flex flex-col items-center text-center gap-4 relative z-10">
          
          {/* Onboarding Progress step indicator matching design */}
          <div aria-label="Step 2 of 3" className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#dcd8e5]" />
            <div className="w-8 h-2.5 rounded-full bg-[#3525cd] shadow-md shadow-[#3525cd]/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#dcd8e5]" />
          </div>

          <div className="space-y-2 mt-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] tracking-tight">
              어떤 영역의 자기관리에 관심 있으세요?
            </h1>
            <p className="text-sm md:text-base text-[#464555] font-medium max-w-lg">
              관심 있는 분야를 모두 선택해 주세요. 맞춤형 목표를 제안해 드립니다.
            </p>
          </div>
        </header>

        {/* Categories Selection Grid */}
        <section className="relative z-10 w-full max-w-xl mx-auto mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="group">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleToggleSelect(cat.id)}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col items-center justify-center p-6 bg-white border border-[#c7c4d8] rounded-2xl cursor-pointer select-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none ${
                    isSelected
                      ? 'border-2 border-[#3525cd] bg-[#f5f2ff] shadow-inner-indigo shadow-md scale-[1.02]'
                      : 'hover:border-[#c3c0ff] hover:shadow-lg hover:shadow-black/5'
                  }`}
                >
                  {/* Miniature Circle Checkbox inside upper-right of card */}
                  <div className={`absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#3525cd] border-[#3525cd] scale-110'
                      : 'bg-white border-[#c7c4d8]'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>

                  {/* Icon circle Container */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#e2dfff] text-[#3525cd] scale-110'
                      : 'bg-[#f0ecf9] text-[#777587]'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  {/* Text labels */}
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-[#3525cd]' : 'text-[#1b1b24]'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Action button layout footer */}
        <footer className="flex items-center justify-between w-full max-w-xl mx-auto mt-10 pt-6 border-t border-[#eae6f4] relative z-10">
          <button 
            onClick={handleActionBack}
            className="px-5 py-3 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f0ecf9] transition-all focus:ring-2 focus:ring-[#3525cd]/20"
          >
            이전으로
          </button>
          
          <button 
            onClick={handleActionNext}
            disabled={selectedIds.length === 0}
            className={`px-8 py-3 rounded-xl text-xs font-semibold select-none transition-all duration-300 flex items-center gap-2 ${
              selectedIds.length > 0
                ? 'bg-[#3525cd] text-white hover:bg-[#4f46e5] cursor-pointer shadow-md shadow-[#3525cd]/25'
                : 'bg-[#dcd8e5] text-[#777587] cursor-not-allowed'
            }`}
          >
            <span>다음으로</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </footer>

      </main>
    </div>
  );
}
