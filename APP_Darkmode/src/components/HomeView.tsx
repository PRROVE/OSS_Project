import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Mic, Paperclip, Sparkles, Lightbulb, ChevronRight, ArrowRight, CheckCircle2, Flame, Bot, Play } from 'lucide-react';
import { AppState } from '../types';

interface HomeViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  setActiveTab: (tab: string) => void;
  onSendPromptToCoach: (prompt: string) => void;
}

export default function HomeView({ state, updateState, setActiveTab, onSendPromptToCoach }: HomeViewProps) {
  const [inputText, setInputText] = useState('');
  const isLight = state.settings.theme === 'light';

  const handleCreatePlan = () => {
    if (!inputText.trim()) return;
    onSendPromptToCoach(inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-10 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-radial-gradient from-[#8b5cf6]/5 to-transparent filter blur-3xl animate-pulse" />

      {/* Greeting Header */}
      <section className="space-y-1">
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase font-semibold text-[#8b5cf6] tracking-widest block"
        >
          {state.settings.theme === 'light' ? 'Aura Optimal Space' : 'Guided Luminescence'}
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-3xl font-semibold tracking-tight leading-tight ${isLight ? 'text-[#131b2e]' : 'text-white'}`}
        >
          안녕하세요, {state.user.name}님.<br />
          오늘도 잠재력을 실현해보세요.
        </motion.h2>
      </section>

      {/* Main AI Input Field Card */}
      <section className="relative">
        <div className={`rounded-3xl p-6 flex flex-col gap-5 transition-all duration-300 border ${
          isLight 
            ? 'bg-white shadow-lg shadow-neutral-100/50 border-[#dae2fd]/60 focus-within:ring-4 focus-within:ring-[#8b5cf6]/5 focus-within:border-[#8b5cf6]/40' 
            : 'bg-[#131b2e]/80 backdrop-filter backdrop-blur-xl border-white/10 focus-within:ring-4 focus-within:ring-[#8b5cf6]/5 focus-within:border-[#8b5cf6]/40'
        }`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#d0bcff] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 shrink-0">
              <Brain className="text-white w-6 h-6" />
            </div>
            <textarea 
              className={`w-full bg-transparent border-none focus:ring-0 text-base resize-none h-24 placeholder-neutral-500 font-medium ${
                isLight ? 'text-[#131b2e]' : 'text-[#dae2fd]'
              }`}
              placeholder="오늘의 집중을 위해 무엇을 도와드릴까요?"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreatePlan();
                }
              }}
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={() => setInputText('오후 3시에 예정된 업무 회의에서 더 몰입할 수 있도록 요약 보고서 준비를 도와줘.')}
                className={`p-2.5 rounded-full hover:bg-neutral-500/10 transition-colors ${
                  isLight ? 'text-neutral-500' : 'text-[#cbc3d7]'
                }`}
              >
                <Mic size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setInputText('오늘 밤 숙면 최적화를 위한 5분 스트레칭 플랜 제공 소감을 작성 중인 문서.txt')}
                className={`p-2.5 rounded-full hover:bg-neutral-500/10 transition-colors ${
                  isLight ? 'text-neutral-500' : 'text-[#cbc3d7]'
                }`}
              >
                <Paperclip size={18} />
              </motion.button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreatePlan}
              disabled={!inputText.trim()}
              className={`text-sm px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                isLight 
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] text-white shadow-[#8b5cf6]/20' 
                  : 'bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] text-white shadow-black/20'
              }`}
            >
              <span>플랜 생성하기</span>
              <Sparkles size={14} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* AI Daily Recommendations Bento */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-xl tracking-tight ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>
            일일 인사이트
          </h3>
          <span className="text-xs text-[#8b5cf6] uppercase tracking-widest font-extrabold flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
            실시간
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Detailed Recommendation Card */}
          <div className={`rounded-3xl p-6 md:col-span-2 relative overflow-hidden group border ${
            isLight 
              ? 'bg-white border-[#dae2fd]/50 shadow-sm' 
              : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
          }`}>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-bold leading-none">
                  AI 코치
                </span>
                <span className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]/60'}`}>
                  • 2분 읽기
                </span>
              </div>
              
              <p className={`text-base font-medium leading-relaxed ${
                isLight ? 'text-[#131b2e]' : 'text-[#dae2fd]'
              }`}>
                수면 주기와 일정을 분석한 결과, 오늘 가장 집중력이 높은 황금 시간대는 <span className="text-[#8b5cf6] font-bold">오전 10:00에서 11:30 사이</span>입니다. 이 최고의 생산성 윈도우를 위해 방해금지 알림 차단 프로토콜을 가동해 두었습니다.
              </p>

              <button 
                onClick={() => setActiveTab('insights')}
                className="flex items-center gap-1 text-xs text-[#8b5cf6] font-semibold hover:text-[#7c3aed] transition-colors cursor-pointer group"
              >
                <span>상세 인사이트 보기</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Ambient watermarked icon background */}
            <div className={`absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none translate-x-4 -translate-y-4 ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>
              <Lightbulb size={120} />
            </div>
          </div>

          {/* Action Task 1 */}
          <div 
            onClick={() => setActiveTab('tasks')}
            className={`rounded-3xl p-5 flex items-center justify-between gap-4 border-l-4 hover:translate-x-1 transition-transform cursor-pointer border ${
              isLight 
                ? 'bg-white border-[#dae2fd]/50 border-l-[#d0bcff]/80 shadow-sm' 
                : 'bg-[#131b2e]/70 border-white/5 border-l-[#8b5cf6] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
                <Flame size={20} className="fill-current" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${isLight ? 'text-[#131b2e]' : 'text-[#dae2fd]'}`}>
                  마음챙김 휴식
                </h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]/60'}`}>
                  오후 11:30에 5분간 호흡 세션 예정됨
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#cbc3d7]" />
          </div>

          {/* Action Task 2 */}
          <div 
            onClick={() => setActiveTab('tasks')}
            className={`rounded-3xl p-5 flex items-center justify-between gap-4 border-l-4 hover:translate-x-1 transition-transform cursor-pointer border ${
              isLight 
                ? 'bg-white border-[#dae2fd]/50 border-l-[#a76500]/60 shadow-sm' 
                : 'bg-[#131b2e]/70 border-white/5 border-l-emerald-400 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Play size={20} className="fill-current" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${isLight ? 'text-[#131b2e]' : 'text-[#dae2fd]'}`}>
                  딥 워크: 프로젝트 아우라
                </h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]/60'}`}>
                  아키텍처 초안 완료 및 데이터 사양 기술서
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#cbc3d7]" />
          </div>

        </div>
      </section>
    </div>
  );
}
