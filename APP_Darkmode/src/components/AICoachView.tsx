import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Brain, Bot, ArrowUp, AlertCircle, TrendingUp, Lightbulb, User } from 'lucide-react';
import { AppState, ChatMessage } from '../types';

interface AICoachViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  setActiveTab: (tab: string) => void;
}

export default function AICoachView({ state, updateState, setActiveTab }: AICoachViewProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const isLight = state.settings.theme === 'light';
  const { persona, expertise } = state.aiPartner;

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...state.chatMessages, userMessage];
    updateState({ chatMessages: newMessages });
    setInputText('');
    setIsTyping(true);

    // Simulate smart reply customized by Aura persona settings
    setTimeout(() => {
      let replyText = '';
      const selectedPersona = state.aiPartner.persona;

      if (text.includes('예약')) {
        replyText = `알겠습니다, ${state.user.name} 대표님. 수면 패턴 및 생산성 데이터를 기준으로 오늘 오후 2:00 ~ 오후 3:30까지를 딥 워크 윈도우로 공식 캘린더에 등재해 두었습니다. 해당 시간 동안에는 모든 기기의 소리 및 집중 저해 알림 프로토콜이 완벽하게 필터링됩니다.`;
      } else if (text.includes('인사이트')) {
        replyText = `현재 탐지된 최적 패턴은 주간 12% 향상된 상태입니다. 특히 오전 10시 근방의 주의 집중 지속 시간이 가장 길며, 오후 3시 이후 소폭 감쇠합니다. 최상의 효율을 내기 위해 데이터 노드 세그먼트를 오전에 다루시길 적극 권장합니다.`;
      } else if (selectedPersona === 'friendly') {
        replyText = `우와, 좋은 질문이네요, ${state.user.name}님! 😊 현재 몰입도가 최고 레벨이라 너무 든든해요. 혹시 오늘 도전해보고 싶으신 핵심 목표나 특별히 저의 피드백이 필요한 부분이 있으실까요? 편히 말씀해 주세요!`;
      } else if (selectedPersona === 'logical') {
        replyText = `${state.user.name}님, 요청 주신 데이터에 대해 3단계 다차원 정밀 연산 결과를 보고합니다: 1단계 - 현 집중 지표 평균 64% 유지, 2단계 - 멀티태스킹 위험 감지 (효율성 18% 저하 요인), 3단계 - 최적 명리화 루틴 제공. 현 사이클에서는 즉시 단일 노드의 서브 태스크에만 전적으로 집중할 것을 강력히 권장합니다.`;
      } else {
        // Assertive
        replyText = `${state.user.name}, 행동 지침을 명확히 전달하겠습니다. 현재 인지 자원이 최고치인 88% 수준에 가깝습니다. 사소한 메신저 확인은 즉시 중단하십시오. 단 45분간만 타협 없이 몰입 프로토콜을 관철하시고, 이후 명상을 통해 자원을 냉각시키세요.`;
      }

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      updateState({ chatMessages: [...newMessages, aiMessage] });
    }, 1200);
  };

  const currentThemeText = isLight ? 'text-[#131b2e]' : 'text-white';

  return (
    <div className="space-y-10 relative">

      {/* AI Coach Intro & Status Box */}
      <section className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative shrink-0">
            <img 
              alt="AI Persona avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzfof5GoIFkP1GaASN6a9HzdQ2w10F3PEhTA9BrBXlQ69E9gt-T-B3_D_vq5psIPREASwBDH0LB5raskB6gkB7qf9IB5MYJY7yioYFeq4SyJtnfAcDx8jg7CqJDSRHRyKFVPNFTjMOxs8teSsYv6MJcfqIfa1a3HAKyQ3ggUWb5fCKLR0XJsQ2Y-Z6KwJKTdLmVTcgxoZzaXzHnQswr4VB-oqQHfCV7-Bo7jy1ZM_wo8qSBDtMM0YoJyBtJFsBRGXy4Fa8IiNy5cc"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/10 shrink-0" 
            />
            {/* Active optimal badge indicator */}
            <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-400 rounded-full border-2 border-[#0b1326] flex items-center justify-center animate-pulse" />
          </div>
          <div>
            <h2 className={`text-2xl font-semibold tracking-tight ${currentThemeText}`}>
              안녕하세요, {state.user.name}님
            </h2>
            <p className={`text-xs font-semibold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
              현재 아우라 AI 코칭 엔진이 최적 상태입니다.
            </p>
          </div>
        </div>

        {/* Daily Feedback Bento Card */}
        <div className={`rounded-3xl p-5 border ${
          isLight 
            ? 'bg-white border-[#dae2fd]/50 shadow-sm shadow-[#dae2fd]/5'
            : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
        }`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs uppercase font-extrabold text-[#8b5cf6] tracking-widest">
                오늘의 집중 보고
              </span>
              <h3 className={`text-xl font-bold mt-1 ${currentThemeText}`}>지속적인 몰입</h3>
            </div>
            {/* Dynamic visual graph circular display */}
            <div className="w-11 h-11 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-neutral-500/10" cx="22" cy="22" fill="transparent" r="18" stroke="currentColor" strokeWidth="3" />
                <circle 
                  className="text-emerald-400" 
                  cx="22" 
                  cy="22" 
                  fill="transparent" 
                  r="18" 
                  stroke="currentColor" 
                  strokeDasharray="113" 
                  strokeDashoffset="28" 
                  strokeWidth="3" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#8b5cf6]">75%</div>
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed font-medium ${isLight ? 'text-neutral-600' : 'text-[#cbc3d7]'}`}>
            오늘 무려 <span className="text-[#8b5cf6] font-bold">3.2시간</span> 동안 흔들림 없이 최고 집중 영역을 수호하셨습니다. 과몰입으로 인한 뇌 피로 발생을 차단하기 위해 다음 스퍼트를 가동하기 전에 10분 건강 명상 세션을 권장합니다.
          </p>

          <div className="flex gap-2 mt-4">
            <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] px-3.5 py-1 rounded-full text-xs font-bold leading-none">
              높은 생산성
            </span>
            <span className="bg-emerald-400/10 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold leading-none">
              명확한 정신
            </span>
          </div>
        </div>
      </section>

      {/* Conversational interface dialogue */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {state.chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[88%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center shrink-0 shadow-sm shadow-[#8b5cf6]/10">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`rounded-3xl p-4 border transition-all ${
                    isAi
                      ? isLight 
                        ? 'bg-white text-[#131b2e] border-[#dae2fd]/60 rounded-tl-none shadow-sm' 
                        : 'bg-[#131b2e]/60 text-[#dae2fd] border-[#8b5cf6]/20 rounded-tl-none shadow-md shadow-black/5'
                      : 'bg-gradient-to-tr from-[#8b5cf6] to-[#6d3bd7] text-white border-none rounded-tr-none shadow-md shadow-[#8b5cf6]/10'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 block text-right font-medium opacity-50 ${isAi ? 'text-neutral-500' : 'text-neutral-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 self-start"
              >
                <div className="w-8 h-8 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 bg-[#131b2e]/40 border border-white/5 rounded-3xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-bounce shrink-0" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-bounce shrink-0" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-bounce shrink-0" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Quick chip responses inside chat logger for adaptive selection */}
        <div className="flex flex-wrap gap-2 pt-2 justify-end">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage('네, 오후 2시 예약 진행해 주세요.')}
            className="bg-[#8b5cf6] text-white px-4 py-2 rounded-full text-xs font-bold hover:brightness-110 shadow-md shadow-[#8b5cf6]/10 cursor-pointer"
          >
            네, 예약할게요
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage('현재 집중력 데이터 인사이트 보여줘')}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              isLight 
                ? 'bg-white border-[#dae2fd]/60 text-neutral-800 hover:bg-[#f2f3ff]' 
                : 'bg-[#131b2e]/40 border-white/10 text-[#dae2fd] hover:bg-neutral-800'
            }`}
          >
            인사이트 보기
          </motion.button>
        </div>
      </section>

      {/* Behavioral Insight Card mimicking 6-bar histogram */}
      <section className={`rounded-[24px] overflow-hidden border ${
        isLight ? 'bg-white border-[#dae2fd]/50 shadow-sm' : 'bg-[#131b2e]/60 border-[#8b5cf6]/20 shadow-md shadow-[#8b5cf6]/5'
      }`}>
        <div className="p-5 flex items-start gap-4">
          <div className="bg-[#8b5cf6]/15 text-[#8b5cf6] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className={`text-base font-bold ${currentThemeText}`}>패턴 감지</h4>
            <p className={`text-xs font-medium leading-relaxed mt-1 ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]'}`}>
              멀티태스킹 돌입 30분 후에는 집중 효율 곡선이 급격하게 저하되는 경향이 데이터베이스에 축적되었습니다. 수면 및 호흡 노드로 전환하면 인지적 회복 탄력성이 18% 추가 충전됩니다.
            </p>
          </div>
        </div>

        {/* Custom React Histrograph Rendering from screenshot */}
        <div className={`h-24 w-full relative mt-2 flex items-end justify-between px-8 pb-1 ${
          isLight ? 'bg-neutral-50 border-t border-neutral-100' : 'bg-[#060e20] border-t border-white/5'
        }`}>
          {[
            { height: 'h-8', color: 'bg-[#8b5cf6]/15' },
            { height: 'h-12', color: 'bg-[#8b5cf6]/30' },
            { height: 'h-10', color: 'bg-[#8b5cf6]/20' },
            { height: 'h-20', color: 'bg-emerald-400 shadow-[0_-4px_12px_rgba(78,222,163,0.3)]' },
            { height: 'h-9', color: 'bg-[#8b5cf6]/25' },
            { height: 'h-14', color: 'bg-[#8b5cf6]/40' },
          ].map((bar, idx) => (
            <div key={idx} className="w-5 flex flex-col items-center gap-1.5">
              <div className={`w-2.5 ${bar.height} ${bar.color} rounded-t-sm transition-all duration-500`} />
            </div>
          ))}
        </div>
      </section>

      {/* Floating conversational input footer */}
      <div className="pt-20">
        {/* Floating input row bar */}
        <div className={`fixed bottom-24 left-0 right-0 px-6 z-30 pointer-events-none`}>
          <div className="max-w-md mx-auto w-full pointer-events-auto">
            <div className={`rounded-full p-2 pl-6 flex items-center gap-3 border shadow-xl ${
              isLight 
                ? 'bg-white/95 backdrop-blur-xl border-[#dae2fd] shadow-neutral-200' 
                : 'bg-[#131b2e]/95 backdrop-blur-xl border-[#8b5cf6]/35 shadow-black/40'
            }`}>
              <input 
                className={`bg-transparent border-none focus:ring-0 text-sm font-medium w-full placeholder-neutral-500/60 focus:outline-none ${
                  isLight ? 'text-[#131b2e]' : 'text-white'
                }`}
                placeholder="Aura에게 무엇이든 물어보세요..."
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.90 }}
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] flex items-center justify-center text-white shadow-lg active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0"
              >
                <ArrowUp size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
