/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  ChevronRight, 
  Award, 
  ShieldCheck,
  Moon,
  Wind,
  X,
  Play,
  RotateCcw
} from 'lucide-react';

interface InsightsViewProps {
  profileName: string;
  theme: 'light' | 'dark';
}

interface WeeklyFocusData {
  day: string;
  value: number; // percentage
  isPeak: boolean;
}

const WEEKLY_DATA: WeeklyFocusData[] = [
  { day: '월', value: 65, isPeak: false },
  { day: '화', value: 78, isPeak: false },
  { day: '수', value: 50, isPeak: false },
  { day: '목', value: 95, isPeak: true }, // Thursday is active peak in mockup!
  { day: '금', value: 70, isPeak: false },
  { day: '토', value: 85, isPeak: false },
  { day: '일', value: 40, isPeak: false },
];

export default function InsightsView({ profileName, theme }: InsightsViewProps) {
  const [activeBar, setActiveBar] = useState<string | null>('목');
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationSeconds, setMeditationSeconds] = useState(300); // 5 minutes
  const [meditationRunning, setMeditationRunning] = useState(false);

  // Meditation Timer loop
  useEffect(() => {
    let timer: any;
    if (meditationActive && meditationRunning && meditationSeconds > 0) {
      timer = setInterval(() => {
        setMeditationSeconds(prev => prev - 1);
      }, 1000);
    } else if (meditationSeconds === 0) {
      setMeditationRunning(false);
    }
    return () => clearInterval(timer);
  }, [meditationActive, meditationRunning, meditationSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const leftSecs = secs % 60;
    return `${mins}:${leftSecs < 10 ? '0' : ''}${leftSecs}`;
  };

  const handleStartMeditation = () => {
    setMeditationActive(true);
    setMeditationSeconds(300);
    setMeditationRunning(true);
  };

  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'glass-card-dark' : 'bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] border border-slate-100';

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header text */}
      <section className="space-y-1">
        <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
          주간 인사이트
        </h2>
        <p className={`text-sm ${textMuted}`}>
          이번 주 인지 성과가 12% 향상되었습니다.
        </p>
      </section>

      {/* Weekly Progress Column Chart */}
      <section className={`${cardBg} rounded-[28px] p-6 transition-all duration-300`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5CF6]">
              집중 수준
            </span>
            <h3 className="text-xl font-extrabold text-[#8B5CF6]">
              고성능
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[#10B981] font-bold text-lg">+12%</span>
          </div>
        </div>

        {/* Column bars mockup exactly mirroring original visual */}
        <div className="h-40 flex items-end justify-between gap-3 px-1">
          {WEEKLY_DATA.map((item) => {
            const isActive = activeBar === item.day;
            const barHeightClass = `h-[${item.value}%]`;
            
            // Generate exact styling corresponding to mockup peak Thursday
            const barBg = item.isPeak
              ? 'bg-gradient-to-t from-emerald-600 to-[#10B981] shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
              : 'bg-[#8B5CF6]/60 dark:bg-[#8B5CF6]/40 hover:bg-[#8B5CF6]';

            return (
              <div 
                key={item.day}
                onClick={() => setActiveBar(item.day)}
                className="flex-grow flex flex-col justify-end items-center h-full group cursor-pointer"
              >
                {/* Tooltip trigger */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mb-36 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded shadow pointer-events-none">
                  {item.value}% 효율
                </div>

                <div 
                  style={{ height: `${item.value}%` }}
                  className={`w-full rounded-2xl transition-all duration-500 relative ${barBg} ${
                    isActive ? 'scale-[1.03] ring-2 ring-emerald-400/50' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Days label matching peak highlight */}
        <div className="flex justify-between mt-4 px-1 text-xs text-slate-400 font-semibold">
          {WEEKLY_DATA.map((item) => (
            <span 
              key={item.day} 
              className={`w-full text-center ${
                item.isPeak ? 'text-[#10B981] font-bold' : ''
              }`}
            >
              {item.day}
            </span>
          ))}
        </div>
      </section>

      {/* Bento Layout Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Tracking widget */}
        <section className={`${cardBg} rounded-[24px] p-5 flex flex-col justify-between aspect-square transition-transform hover:scale-[1.01]`}>
          <div>
            <Flame className="text-[#8B5CF6] w-6 h-6 fill-current mb-3" />
            <h4 className={`text-xs font-bold ${textPrimary}`}>일일 연속 기록</h4>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-4xl font-extrabold text-[#8B5CF6] font-geist">14</span>
            <span className="text-xs text-slate-400 font-semibold uppercase">일</span>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="w-4/5 h-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-full" />
          </div>
        </section>

        {/* Efficiency Trend tracking widget */}
        <section className={`${cardBg} rounded-[24px] p-5 flex flex-col justify-between aspect-square transition-transform hover:scale-[1.01]`}>
          <div>
            <TrendingUp className="text-emerald-500 w-6 h-6 mb-3" />
            <h4 className={`text-xs font-bold ${textPrimary}`}>정밀 효율 지표</h4>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-geist">88%</p>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">정점: 오전 10:00</p>
          </div>
          {/* Wavelet bar gauges matching original trend mockups */}
          <div className="flex gap-1.5 mt-3">
            <div className="w-1.5 h-3 bg-emerald-500 rounded-full" />
            <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            <div className="w-1.5 h-2 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </section>
      </div>

      {/* Neural Energy Shader style panel element */}
      <section className={`${cardBg} rounded-[24px] overflow-hidden relative p-6 min-h-[200px] flex flex-col justify-between`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#3B82F6]/5 pointer-events-none" />
        <div>
          <span className="bg-violet-100 dark:bg-violet-950/40 text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-950/40">
            실시간 패턴
          </span>
          <h3 className={`text-lg font-extrabold mt-3 ${textPrimary}`}>신경 에너지</h3>
          <p className={`text-sm mt-2 max-w-[240px] leading-relaxed ${textMuted}`}>
            정신적 명료함이 최고조에 달하고 있습니다. 딥 워크 세션을 가동하기에 완벽한 임계 가치 도달 구간입니다.
          </p>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button 
            type="button"
            onClick={() => setActiveBar(activeBar === '목' ? '일' : '목')}
            className={`px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm`}
          >
            상세 동향 보기
          </button>
          
          <div className="flex -space-x-1.5">
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-850 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-500 dark:text-slate-400">AI</div>
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-850 bg-[#8B5CF6] flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended actions list exactly matches mockups */}
      <section className="space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 px-1">
          기능 추천
        </h4>

        <div className="space-y-3">
          {/* Midtown Meditation rest trigger */}
          <div 
            onClick={handleStartMeditation}
            className={`${cardBg} p-4 rounded-2xl flex items-center gap-4 transition-all hover:translate-x-1 hover:bg-slate-50/50 cursor-pointer active:scale-98`}
          >
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-[#8B5CF6] shrink-0">
              <Wind className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="flex-grow">
              <h5 className={`text-sm font-bold ${textPrimary}`}>한낮의 휴식</h5>
              <p className="text-xs text-slate-400 mt-0.5">5분 명상/호흡 세션 가동하기</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>

          {/* Bedtime optimization feedback trigger */}
          <div 
            onClick={() => alert(`아우라 수면 분석 결과 요약:\n- 권장 취침 시간: 오후 10:45\n- 인지 피크 예상: 다음날 오전 10:00`)}
            className={`${cardBg} p-4 rounded-2xl flex items-center gap-4 transition-all hover:translate-x-1 hover:bg-slate-50/50 cursor-pointer active:scale-98`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500 shrink-0">
              <Moon className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="flex-grow">
              <h5 className={`text-sm font-bold ${textPrimary}`}>수면 최적화</h5>
              <p className="text-xs text-slate-400 mt-0.5">최적의 수면 루틴 분석 및 취침 제고</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </section>

      {/* Meditation Modal popup */}
      {meditationActive && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div id="mindfulness-modal" className={`${theme === 'dark' ? 'bg-[#131b2e] border-slate-800' : 'bg-white border-slate-100'} border rounded-[32px] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative z-50`}>
            {/* Close button modal */}
            <button
              onClick={() => setMeditationActive(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing mindfulness icon */}
            <div className="w-20 h-20 bg-violet-100 dark:bg-violet-950/40 rounded-full flex items-center justify-center mx-auto relative">
              <div className="absolute inset-0 bg-violet-500/20 rounded-full blur animate-ping duration-3000" />
              <Wind className="text-[#8B5CF6] w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className={`text-lg font-extrabold ${textPrimary}`}>한낮의 마음챙김 호흡</h3>
              <p className="text-xs text-slate-400">천천히 들이마시고 내쉬며 안정을 되찾아보세요.</p>
            </div>

            {/* Dynamic Clock readout */}
            <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-geist">
              {formatTime(meditationSeconds)}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setMeditationRunning(!meditationRunning)}
                className="bg-[#8B5CF6] hover:bg-[#7c4ee0] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                {meditationRunning ? "일시정지" : "시작"}
              </button>
              <button
                onClick={() => {
                  setMeditationSeconds(300);
                  setMeditationRunning(false);
                }}
                className={`border text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                리셋
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
