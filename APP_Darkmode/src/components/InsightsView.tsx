import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Flame, Zap, Compass, Moon, ChevronRight, 
  HelpCircle, Sparkles, Sliders, Info, Timer, Brain 
} from 'lucide-react';
import { AppState } from '../types';

interface InsightsViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  setActiveTab: (tab: string) => void;
}

export default function InsightsView({ state, updateState, setActiveTab }: InsightsViewProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const isLight = state.settings.theme === 'light';

  const currentThemeText = isLight ? 'text-[#131b2e]' : 'text-white';

  const weeklyData = [
    { day: '월', height: 'h-24', pct: 60, current: false },
    { day: '화', height: 'h-32', pct: 80, current: false },
    { day: '수', height: 'h-20', pct: 50, current: false },
    { day: '목', height: 'h-40', pct: 100, current: true }, // Peak day
    { day: '금', height: 'h-28', pct: 70, current: false },
    { day: '토', height: 'h-36', pct: 90, current: false },
    { day: '일', height: 'h-16', pct: 30, current: false },
  ];

  return (
    <div className="space-y-10 relative">
      {/* Visual Ambient Decorative Glows */}
      <div className="fixed top-24 left-0 w-64 h-64 bg-violet-600/5 filter blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-36 right-0 w-80 h-80 bg-emerald-500/5 filter blur-[120px] pointer-events-none -z-10" />

      {/* Header text */}
      <section className="space-y-1">
        <h2 className={`text-3xl font-semibold tracking-tight ${currentThemeText}`}>
          주간 인사이트
        </h2>
        <p className={`text-sm font-medium ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]'}`}>
          이번 주 인지 성과율이 지난주 대비 <span className="text-[#8b5cf6] font-bold">12%</span> 향상되었습니다.
        </p>
      </section>

      {/* Weekly Progress Chart */}
      <section className={`rounded-[24px] p-6 border ${
        isLight 
          ? 'bg-white border-[#dae2fd]/60 shadow-sm' 
          : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
      }`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#cbc3d7]">집중 수준</span>
            <h3 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-neutral-800' : 'text-[#8b5cf6]'}`}>고성능</h3>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 text-xl font-mono font-bold">+12%</span>
          </div>
        </div>

        {/* Minimal Chart capsules from screenshot */}
        <div className="h-44 flex items-end justify-between gap-3 px-1 md:px-4 relative">
          {weeklyData.map((data, idx) => {
            return (
              <div key={idx} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                {/* Active and background tracks */}
                <div className={`w-full ${isLight ? 'bg-neutral-100' : 'bg-[#222a3d]/50'} rounded-full relative ${data.height}`}>
                  
                  {data.current ? (
                    <>
                      {/* Friday peak highlight styled with emerald-400 */}
                      <div className="absolute bottom-0 w-full bg-emerald-400/20 rounded-full h-full filter blur-[4px]" />
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="absolute bottom-0 w-full bg-emerald-400 rounded-full shadow-[0_4px_14px_rgba(78,222,163,0.4)]"
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute bottom-0 w-full bg-[#8b5cf6]/20 rounded-full h-full filter blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${data.pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                        className="absolute bottom-0 w-full bg-[#8b5cf6]/60 rounded-full group-hover:bg-[#8b5cf6] transition-colors"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Days label matching peak highlighted thursday */}
        <div className="flex justify-between mt-4 px-1 text-xs font-semibold text-[#cbc3d7]">
          {weeklyData.map((data, idx) => (
            <span key={idx} className={`w-[14%] text-center ${data.current ? 'text-emerald-400 font-extrabold' : ''}`}>
              {data.day}
            </span>
          ))}
        </div>
      </section>

      {/* Bento Layout: Streak & Productivity trend widgets */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Streak Tracking Widget */}
        <section className={`rounded-[24px] p-5 flex flex-col justify-between aspect-square border ${
          isLight ? 'bg-white border-[#dae2fd]/50 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-sm'
        }`}>
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 mb-3">
              <Flame size={20} className="fill-current" />
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-500' : 'text-[#dae2fd]'}`}>일일 연속 기록</h4>
          </div>
          <div className="flex items-baseline gap-1 py-1">
            <span className="text-4xl font-semibold text-[#8b5cf6] font-mono leading-none">14</span>
            <span className="text-xs font-bold text-neutral-500">일</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-500/10 rounded-full overflow-hidden shrink-0">
            <div className="w-4/5 h-full bg-gradient-to-r from-[#8b5cf6] to-emerald-400 rounded-full" />
          </div>
        </section>

        {/* Productivity Trends Widget */}
        <section className={`rounded-[24px] p-5 flex flex-col justify-between aspect-square border ${
          isLight ? 'bg-white border-[#dae2fd]/50 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-sm'
        }`}>
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mb-3">
              <TrendingUp size={20} />
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-500' : 'text-[#dae2fd]'}`}>효율성</h4>
          </div>
          <div>
            <p className={`text-2xl font-semibold font-mono leading-none ${currentThemeText}`}>88%</p>
            <p className="text-xs font-bold text-[#8b5cf6] mt-0.5">정점: 오전 10:00</p>
          </div>
          <div className="flex gap-1.5 items-end">
            <div className="w-1.5 h-3 bg-emerald-400 rounded-full shrink-0" />
            <div className="w-1.5 h-5 bg-emerald-400 rounded-full shrink-0 animate-pulse" />
            <div className="w-1.5 h-4 bg-emerald-400 rounded-full shrink-0" />
            <div className="w-1.5 h-2 bg-neutral-500/20 rounded-full shrink-0" />
          </div>
        </section>

      </div>

      {/* Energy Pattern Visualization Card */}
      <section className={`rounded-[24px] overflow-hidden relative p-6 min-h-[220px] flex flex-col justify-between border ${
        isLight ? 'bg-white border-[#dae2fd]/50 shadow-sm' : 'bg-[#131b2e]/60 border-[#8b5cf6]/20 shadow-md shadow-[#8b5cf6]/5'
      }`}>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#8b5cf6]/5 via-[#d0bcff]/2 to-transparent filter" />
        
        <div className="relative z-10 space-y-3">
          <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-[#8b5cf6]/20 inline-block">
            실시간 패턴
          </span>
          <h3 className={`text-xl font-bold ${currentThemeText}`}>신경 에너지</h3>
          <p className={`text-sm leading-relaxed font-medium max-w-[240px] ${isLight ? 'text-neutral-600' : 'text-[#cbc3d7]'}`}>
            정신적 집중도 및 생리 대사가 최고 몰입 존에 돌입했습니다. 난도 높은 아키텍처 구상을 가동하기에 완벽한 사이클입니다.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center mt-6">
          <button 
            onClick={() => setShowDetailDialog(true)}
            className={`text-xs px-4 py-2 rounded-xl font-semibold shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] border cursor-pointer ${
              isLight 
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300/40' 
                : 'bg-[#1e263a] hover:bg-[#2d3449] text-[#dae2fd] border-white/5'
            }`}
          >
            상세 보기
          </button>
          
          <div className="flex -space-x-1.5">
            <div className="w-8 h-8 rounded-full border-2 border-[#131b2e] bg-[#222a3d] flex items-center justify-center text-[10px] font-extrabold text-[#cbc3d7]">
              AI
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#131b2e] bg-[#8b5cf6] flex items-center justify-center text-white shadow-md shadow-[#8b5cf6]/20">
              <Zap size={12} className="fill-current" />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Actions */}
      <section className="space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#cbc3d7] px-1">추천 항목</h4>
        
        <div className="space-y-3">
          
          <div 
            onClick={() => setActiveTab('coach')}
            className={`rounded-xl p-4 flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer border ${
              isLight ? 'bg-white border-[#dae2fd]/50 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-purple-400 shrink-0">
              <Compass size={22} />
            </div>
            <div className="flex-1">
              <h5 className={`text-sm font-semibold ${isLight ? 'text-neutral-800' : 'text-white'}`}>한낮의 휴식</h5>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]/60'}`}>5분 호흡 가이드 및 안구 이완 세션</p>
            </div>
            <ChevronRight size={18} className="text-[#cbc3d7]" />
          </div>

          <div 
            onClick={() => setActiveTab('coach')}
            className={`rounded-xl p-4 flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer border ${
              isLight ? 'bg-white border-[#dae2fd]/50 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400 shrink-0">
              <Moon size={22} className="fill-orange-400/10" />
            </div>
            <div className="flex-1">
              <h5 className={`text-sm font-semibold ${isLight ? 'text-neutral-800' : 'text-white'}`}>수면 최적화</h5>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]/60'}`}>금일 권장 수면 진입 시간: 오후 10:45</p>
            </div>
            <ChevronRight size={18} className="text-[#cbc3d7]" />
          </div>

        </div>
      </section>

      {/* DETAIL OVERLAY DIALOG */}
      <AnimatePresence>
        {showDetailDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-md w-full rounded-[24px] p-6 relative z-10 border ${
                isLight ? 'bg-white border-[#dae2fd] text-[#131b2e]' : 'bg-[#131b2e] border-white/10 text-[#dae2fd]'
              }`}
            >
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Brain size={20} className="text-[#8b5cf6]" />
                실시간 인지 흐름 연산 보고서
              </h3>
              <p className="text-sm leading-relaxed font-semibold opacity-85">
                Aura AI 뉴럴 분석기가 장착된 생체 지표 정밀 판독 결과에 따르면, 수면 질점 지표가 92점을 마크하며 피질 에너지 가용 자원이 최상의 컨디션을 점유 중입니다.
              </p>
              <div className="my-5 p-4 rounded-xl bg-neutral-500/5 space-y-2 border border-neutral-500/10">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-500">집중력 최대 가용 시간</span>
                  <span>95분 연속</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-500">주의 분산 저항 지표</span>
                  <span className="text-emerald-400">최상 (Very Steady)</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-500">아우라 몰입 연속 성과 일수</span>
                  <span>14일 연속 가동</span>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailDialog(false)}
                className="w-full h-11 bg-[#8b5cf6] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#8b5cf6]/20 cursor-pointer"
              >
                리포트 수락
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
