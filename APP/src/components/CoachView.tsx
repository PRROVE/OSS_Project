/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowUp, 
  Bot, 
  User, 
  TrendingUp, 
  Clock, 
  Activity,
  Smile,
  Zap,
  Info
} from 'lucide-react';
import { CoachMessage, AIPartnerConfig } from '../types';

interface CoachViewProps {
  profileName: string;
  chatHistory: CoachMessage[];
  onSendMessage: (text: string) => void;
  isAiTyping: boolean;
  aiConfig: AIPartnerConfig;
  onNavigateToTab: (tabId: string) => void;
  theme: 'light' | 'dark';
}

export default function CoachView({
  profileName,
  chatHistory,
  onSendMessage,
  isAiTyping,
  aiConfig,
  onNavigateToTab,
  theme
}: CoachViewProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    onSendMessage(text);
  };

  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'glass-card-dark' : 'bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] border border-slate-100';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro & Status */}
      <section className="flex items-center gap-4">
        <div className="relative">
          <img
            alt="Beautiful abstract futuristic professional avatar"
            className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-violet-150 relative z-10"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzfof5GoIFkP1GaASN6a9HzdQ2w10F3PEhTA9BrBXlQ69E9gt-T-B3_D_vq5psIPREASwBDH0LB5raskB6gkB7qf9IB5MYJY7yioYFeq4SyJtnfAcDx8jg7CqJDSRHRyKFVPNFTjMOxs8teSsYv6MJcfqIfa1a3HAKyQ3ggUWb5fCKLR0XJsQ2Y-Z6KwJKTdLmVTcgxoZzaXzHnQswr4VB-oqQHfCV7-Bo7jy1ZM_wo8qSBDtMM0YoJyBtJFsBRGXy4Fa8IiNy5cc"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white z-20 animate-pulse" />
        </div>
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${textPrimary}`}>
            안녕하세요, {profileName || 'Jordan'}님
          </h2>
          <p className="text-xs text-[#8B5CF6] font-bold">
            현재 아우라 상태가 최적입니다.
          </p>
        </div>
      </section>

      {/* Daily Feedback Bento Box */}
      <section className={`${cardBg} rounded-[28px] p-5 relative overflow-hidden transition-all duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5CF6]">
              오늘의 집중
            </span>
            <h3 className={`text-lg font-extrabold mt-1 ${textPrimary}`}>
              지속적인 몰입
            </h3>
          </div>
          
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-100 dark:text-slate-800" cx="24" cy="24" fill="transparent" r="18" stroke="currentColor" strokeWidth="3.5" />
              <circle className="text-emerald-500" cx="24" cy="24" fill="transparent" r="18" stroke="currentColor" strokeDasharray="113.1" stroke-dashoffset="28" strokeWidth="3.5" />
            </svg>
            <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">75%</span>
          </div>
        </div>

        <p className={`text-sm leading-relaxed ${textMuted} mb-4`}>
          오늘 3.2시간 동안 최고 수준의 집중력을 유지하셨습니다. 다음 작업을 시작하기 전에 10분간의 가벼운 명상을 추천합니다.
        </p>

        <div className="flex gap-2.5">
          <span className="bg-violet-50 dark:bg-violet-950/30 text-[#8B5CF6] text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border border-violet-100 dark:border-violet-950/40">
            높은 생산성
          </span>
          <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-950/40">
            명확한 정신
          </span>
        </div>
      </section>

      {/* Conversational AI log chat feed */}
      <section className="space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 px-1">
          Aura 코치와 대화
        </h4>

        <div id="chat-thread" className="max-h-[400px] overflow-y-auto no-scrollbar space-y-4 pr-1 pb-4">
          {chatHistory.length === 0 ? (
            /* Intro Starter message if empty */
            <div className="flex gap-3 max-w-[85%] relative animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-[#8B5CF6] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className={`${cardBg} rounded-3xl rounded-tl-none p-4 shadow-sm`}>
                <p className={`text-sm leading-relaxed ${textSecondary = 'text-slate-600'}`}>
                  반갑습니다. {profileName || 'Jordan'}님, 오늘의 몰입도 향상을 위해 설계된 {aiConfig.persona} 성격의 Aura AI 파트너입니다. 집중력 분산을 유도하는 패턴이나 일일 관리에 대해 궁금한 점을 편하게 물어보세요.
                </p>
                <span className="text-[9px] text-slate-400 mt-2 block font-geist">오전 10:42</span>
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isAi ? '' : 'ml-auto flex-row-reverse'} animate-fade-in`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAi ? 'bg-violet-100 dark:bg-violet-950/40 text-[#8B5CF6]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`${cardBg} p-4 rounded-3xl shadow-sm ${
                    isAi ? 'rounded-tl-none' : 'rounded-tr-none bg-slate-50/50'
                  }`}>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <span className="text-[9px] text-slate-400 mt-2 block font-geist text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {isAiTyping && (
            <div className="flex gap-3 max-w-[85%] animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-[#8B5CF6] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className={`${cardBg} rounded-3xl rounded-tl-none p-4 shadow-sm text-xs font-semibold text-slate-400`}>
                Aura가 연산을 처리하며 분석 중입니다...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* User Quick recommendations matching mockups */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleQuickReply("오후 2시 딥 워크 예약을 추천하는 이유가 무엇인가요?")}
            className="bg-[#8B5CF6] hover:bg-[#7b4be2] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            예약 상세 분석
          </button>
          <button
            onClick={() => handleQuickReply("나의 집중 분석에 관한 인사이트를 보여줘")}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold hover:bg-slate-55 transition-all cursor-pointer`}
          >
            인사이트 보기
          </button>
        </div>
      </section>

      {/* Behavioral Insight Card showing analytic mini graph matching original mockup */}
      <section className={`${cardBg} rounded-[28px] overflow-hidden`}>
        <div className="p-5 flex items-start gap-4">
          <div className="bg-violet-50 dark:bg-violet-950/30 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp className="text-[#8B5CF6] w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h4 className={`font-bold text-sm leading-tight mb-1 ${textPrimary}`}>패턴 감지</h4>
            <p className="text-xs text-slate-400">
              멀티태스킹 30분 후에는 집중력이 완만하게 떨어지는 기류가 감지되었습니다. 단일 딥워크 태스크로 전환하면 인지 에너지 효율성을 18% 추가 증폭시킬 수 있습니다.
            </p>
          </div>
        </div>

        {/* Graphical Representation matching the mockup bars */}
        <div className="h-20 w-full bg-slate-50/50 dark:bg-slate-900/10 relative mt-2 border-t border-slate-100/50 dark:border-slate-800/20">
          <div className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-around px-8 pb-1">
            <div className="w-2.5 bg-violet-500/10 h-8 rounded-t" />
            <div className="w-2.5 bg-violet-500/30 h-12 rounded-t animate-pulse" />
            <div className="w-2.5 bg-violet-500/20 h-10 rounded-t" />
            <div className="w-2.5 bg-[#8B5CF6] h-14 rounded-t shadow-[0_2px_8px_rgba(139,92,246,0.3)]" />
            <div className="w-2.5 bg-violet-500/20 h-9 rounded-t" />
            <div className="w-2.5 bg-violet-500/40 h-13 rounded-t" />
          </div>
        </div>
      </section>

      {/* Inputs floating area spacer */}
      <div className="h-16" />

      {/* Floating AI Chat Input bar matching mockup exactly */}
      <div className="fixed bottom-24 inset-x-6 max-w-lg mx-auto z-40">
        <div className={`rounded-xl p-2.5 pl-6 flex items-center gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] ${theme === 'dark' ? 'bg-[#131b2e]/95 border border-slate-800/80' : 'bg-white/95 border border-slate-200/40'} backdrop-blur-xl`}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Aura에게 무엇이든 물어보세요..."
            className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-slate-450 text-slate-800 dark:text-slate-100 py-1"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6b38d4] to-[#3B82F6] flex items-center justify-center active:scale-90 transition-transform shadow-md shrink-0 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
