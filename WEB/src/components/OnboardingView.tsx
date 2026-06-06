/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewTab } from '../types';
import {
  ArrowRight, Check, Sparkles,
  Dumbbell, BookOpen, Briefcase, Palette, Heart, MoreHorizontal,
  Lightbulb, Zap, Target,
} from 'lucide-react';

interface OnboardingViewProps {
  setTab: (tab: ViewTab) => void;
  onAddFirstTodo: (title: string) => void;
}

const CATEGORIES = [
  { id: 'fitness', label: '운동',   Icon: Dumbbell },
  { id: 'study',   label: '공부',   Icon: BookOpen },
  { id: 'work',    label: '업무',   Icon: Briefcase },
  { id: 'hobby',   label: '취미',   Icon: Palette },
  { id: 'health',  label: '건강',   Icon: Heart },
  { id: 'other',   label: '기타',   Icon: MoreHorizontal },
];

export default function OnboardingView({ setTab, onAddFirstTodo }: OnboardingViewProps) {
  const [step,      setStep]      = useState(1);
  const [selected,  setSelected]  = useState<string[]>([]);
  const [firstTodo, setFirstTodo] = useState('');
  const [loading,   setLoading]   = useState(false);
  const TOTAL = 3;

  const toggle = (label: string) =>
    setSelected(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label]);

  const handleStart = () => {
    setLoading(true);
    if (firstTodo.trim()) onAddFirstTodo(firstTodo.trim());
    setTimeout(() => { setLoading(false); setTab('dashboard'); }, 900);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-level-2 flex flex-col md:flex-row overflow-hidden"
        style={{ minHeight: 580, maxHeight: 680 }}>

        {/* ── LEFT: dark olive panel ── */}
        <section className="hidden md:flex md:w-[36%] flex-col justify-between p-8 relative overflow-hidden shrink-0"
          style={{ background: 'linear-gradient(160deg, #2c3420 0%, #323a24 60%, #282e1c 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 70% 75%, rgba(255,255,255,0.04) 0%, transparent 55%)' }} />

          {/* brand */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#5a6e38] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-white">Adaptive AI</span>
          </div>

          {/* headline + stepper */}
          <div className="relative z-10 space-y-6">
            <div>
              <h3 className="text-[17px] font-bold text-white leading-snug">
                목표 달성을 위한<br />초기 설정
              </h3>
              <p className="text-[12px] text-[#6b6b58] mt-1.5 leading-relaxed">
                AI가 당신의 루틴을 맞춤 준비합니다.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { n: 1, title: '시작하기',       sub: '서비스 소개' },
                { n: 2, title: '관심 분야 선택', sub: '카테고리 설정' },
                { n: 3, title: '첫 번째 목표',   sub: '바로 시작' },
              ].map(({ n, title, sub }, i) => (
                <div key={n} className="flex items-start gap-3 relative">
                  {i < 2 && <div className="absolute left-[10px] top-5 w-px h-8 bg-white/10" />}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                    step > n  ? 'bg-[#5a6e38] border-[#5a6e38] text-white' :
                    step === n ? 'bg-[#5a6e38] border-[#6a8048] text-white' :
                    'bg-transparent border-white/20 text-white/25'
                  }`}>
                    {step > n ? <Check className="w-2.5 h-2.5" /> : n}
                  </div>
                  <div>
                    <p className={`text-[12px] font-semibold leading-none ${step >= n ? 'text-white' : 'text-white/25'}`}>{title}</p>
                    <p className={`text-[11px] mt-0.5 ${step >= n ? 'text-[#6b6b58]' : 'text-white/15'}`}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* tip */}
          <div className="relative z-10 bg-white/5 border border-white/8 p-3.5 rounded-xl flex items-start gap-2 text-left">
            <Lightbulb className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
            <p className="text-[11px] text-white leading-relaxed">
              AI를 러닝메이트로 삼아 목표를 작게 쪼개 시작해 보세요.
            </p>
          </div>
        </section>

        {/* ── RIGHT: step content ── */}
        <section className="flex-1 flex flex-col p-7 sm:p-9">

          {/* progress bar */}
          <header className="flex items-center justify-between mb-6 shrink-0">
            <span className="text-[12px] text-[#9a9a86]">{step} / {TOTAL}</span>
            <div className="flex gap-1.5 items-center">
              {[1,2,3].map(n => (
                <div key={n} onClick={() => n < step && setStep(n)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    n === step ? 'bg-[#5a6e38] w-8' :
                    n < step   ? 'bg-[#a0b878] w-3 cursor-pointer hover:bg-[#5a6e38]' :
                    'bg-[#e0ddd8] w-3'
                  }`} />
              ))}
            </div>
          </header>

          {/* content area */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                <div className="w-full rounded-xl overflow-hidden bg-[#f0eeea]" style={{ height: 200 }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIVPbW2MGUoMCmQdABib2cVLYEfhbeD7hY9zMYJVqxud3umE0stVP91EsrQSgZbrQirSZWjxGtDp8GYUFWmMo8bsuH-t0m4MWybl-0kh_0TC1JUgRJHwdDWm5aSv1ifbgBDoWxOhr6ikYXtrh7CM75bDvvzi5F1nhjW4g3rszARnVFVwu3UcgJ902hCKJ9Dp_rXauLICW7Qde_wQDpn_bSO7cLOlFze4cId0uD5GvS32bat6iFjK-SFbXYkqmonxvIqh4Bo2SwD4U"
                    alt="Welcome"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-[#1c1c14] leading-tight tracking-tight">
                    AI가 당신의 실행 체력을<br />설계합니다
                  </h2>
                  <p className="text-[13px] text-[#6b6b58] leading-relaxed mt-2">
                    어려운 과제를 거창하게 세우고 실패하던 패턴은 끝납니다.<br />
                    개인화된 AI가 완수 허들을 지능적으로 낮춰드립니다.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {[
                    { Icon: Target,  text: '목표 단계 분해' },
                    { Icon: Zap,     text: '집중 시간 설계' },
                    { Icon: Sparkles,text: 'AI 코칭' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-[12px] text-[#6b6b58]">
                      <Icon className="w-3.5 h-3.5 text-[#5a6e38] shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-4">
                  <h2 className="text-[20px] font-bold text-[#1c1c14] tracking-tight">어떤 분야에 집중하나요?</h2>
                  <p className="text-[13px] text-[#9a9a86] mt-1">여러 개 선택할 수 있습니다.</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(({ id, label, Icon }) => {
                    const active = selected.includes(label);
                    return (
                      <button key={id} type="button" onClick={() => toggle(label)}
                        className={`flex flex-col items-start p-3 border rounded-xl transition-all cursor-pointer group relative text-left ${
                          active
                            ? 'border-[#5a6e38] bg-[#ecf0e4]'
                            : 'border-[#e0ddd8] bg-[#f7f6f2] hover:border-[#c8d4a8] hover:bg-[#f0f0e8]'
                        }`}>
                        <div className={`mb-2 p-1.5 rounded-lg transition-colors ${
                          active ? 'bg-[#5a6e38] text-white' : 'bg-white text-[#9a9a86] group-hover:text-[#5a6e38]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[12px] font-medium text-[#1c1c14]">{label}</span>
                        {active && (
                          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[#5a6e38] text-white flex items-center justify-center">
                            <Check className="w-2 h-2" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div className="animate-fadeIn flex flex-col gap-4">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1c1c14] tracking-tight">가벼운 첫 걸음을 적어보세요</h2>
                  <p className="text-[13px] text-[#9a9a86] mt-1">
                    아주 작은 목표(예: 책 1쪽 읽기)를 입력하면 대시보드에 바로 추가됩니다.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={firstTodo}
                    onChange={e => setFirstTodo(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !loading && handleStart()}
                    placeholder="예: 마케팅 기사 1편 읽기"
                    className="w-full px-4 py-3.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl text-[14px] text-[#1c1c14] placeholder-[#9a9a86] focus:outline-none focus:bg-white focus:border-[#5a6e38] focus:ring-1 focus:ring-[#5a6e38] transition-all"
                    autoFocus
                  />
                </div>

                {firstTodo.trim() ? (
                  <div className="flex items-start gap-2.5 bg-[#ecf0e4] border border-[#c8d4a8] rounded-xl p-3.5 animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-[#5a6e38] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#4a5c2e] leading-relaxed">
                      <strong>'{firstTodo}'</strong> — 대시보드 진입 시 실행 가능한 단계로 분해해 드립니다.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-3.5">
                    <Lightbulb className="w-4 h-4 text-[#9a9a86] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#9a9a86] leading-relaxed">
                      입력하지 않아도 괜찮습니다. 나중에 할 일 탭에서 추가할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* footer */}
          <footer className="pt-5 border-t border-[#ece9e3] flex justify-between items-center shrink-0 mt-4">
            <button type="button" onClick={() => setTab('dashboard')}
              className="text-[12px] text-[#9a9a86] hover:text-[#6b6b58] transition-colors cursor-pointer">
              건너뛰기
            </button>
            <div className="flex gap-2">
              {step > 1 && (
                <button type="button" onClick={() => setStep(p => p - 1)}
                  className="px-4 py-2 text-[12px] font-medium text-[#6b6b58] border border-[#e0ddd8] hover:bg-[#edecea] rounded-lg transition-colors cursor-pointer">
                  이전
                </button>
              )}
              {step < TOTAL ? (
                <button type="button" onClick={() => setStep(p => p + 1)}
                  className="px-5 py-2 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                  다음 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button type="button" onClick={handleStart} disabled={loading}
                  className="px-5 py-2 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><span>시작하기</span><Check className="w-3.5 h-3.5" /></>
                  }
                </button>
              )}
            </div>
          </footer>

        </section>
      </main>
    </div>
  );
}
