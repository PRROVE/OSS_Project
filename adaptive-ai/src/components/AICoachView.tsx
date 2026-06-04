import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  TrendingUp, 
  Hourglass,
  Sliders,
  Check,
  Compass
} from 'lucide-react';
import { Todo, Insight, CoachingHistory, UserProfile } from '../types';

interface AICoachViewProps {
  currentView: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  insights: Insight[];
  setInsights: React.Dispatch<React.SetStateAction<Insight[]>>;
  history: CoachingHistory[];
  setHistory: React.Dispatch<React.SetStateAction<CoachingHistory[]>>;
  user: UserProfile;
}

export default function AICoachView({ 
  currentView, 
  todos, 
  setTodos, 
  insights, 
  setInsights,
  history, 
  setHistory,
  user
}: AICoachViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgressText, setAnalysisProgressText] = useState('');
  const [coachNarrative, setCoachNarrative] = useState<string>(
    `현재 데이터를 분석해 보면, 수요일과 목요일의 목표 수행 성숙도가 89.4%에 가깝지만 하루에 등록된 할 일이 6개 이상을 초과할 때 마이크로 실패가 서서히 유발됩니다. 특히, 늦은 취침 전 과도한 두뇌 에너지가 필요한 ‘공부’ 카테고리를 설정하면 전반적인 루틴 지속력이 급격히 저하하는 양상을 보입니다. 이완 및 가벼운 계획 관리가 수반되는 명상의 연결성을 강화하시길 권고합니다.`
  );

  if (currentView !== 'coach') return null;

  // Simulate AI Analysis Request with real loading steps
  const triggerNewAnalysis = () => {
    setIsAnalyzing(true);
    const steps = [
      '데이터베이스 행위 패턴 인덱싱 취합 중...',
      '요일별 실천율 마이크로 불균형 구간 탐지 중...',
      '독서 및 명상 카테고리의 교차 상승 효과 모델 계산 중...',
      '개인 맞춤 가이드라인 완결 보고서 정리 중...'
    ];

    let currentStep = 0;
    setAnalysisProgressText(steps[0]);

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisProgressText(steps[currentStep]);
      } else {
        clearInterval(timer);
        setIsAnalyzing(false);

        // Adjust text slightly based on user expertise/customization instructions
        const callsPresident = user.customInstruction.includes('대표님');
        const customTitle = callsPresident ? `${user.name} 대표님을 위한 맞춤 주간 로드맵` : `${user.name}님의 행동 균형 분석 리포트`;
        
        setCoachNarrative(
          `기반 계산이 성공적으로 완결되었습니다! ${customTitle}: 현재 ${user.aiExpertise.join(', ') || '전체'} 분야 중심의 습관 설정은 긍정적입니다. 일평균 완결량이 상승 국면이나, custom 지시사항("${user.customInstruction}") 기반 파트너십 페르소나(${user.aiPersona})를 매핑해 볼 때 주말 오후 2시에서 4시 사이의 명상 및 가벼운 리프레시 배치가 업무 누적 탈진을 선제 방어하는 최적 핵심 경로가 될 것입니다.`
        );

        alert('새로운 인공지능 분석이 완성되었습니다!');
      }
    }, 1000);
  };

  // Perform action linked to insight
  const handleApplyInsightAction = (insight: Insight) => {
    // 1. Mark insight as applied
    setInsights(prev => prev.map(i => i.id === insight.id ? { ...i, status: 'applied' } : i));

    // 2. Execute actual logical impacts on the task list
    if (insight.type === 'overflow') {
      // Goal reduction logic: Complete or remove non-priority ones, or limit them
      alert('목표 과다 분석이 실행되었습니다: 중요도가 낮고 기한이 이번 주였던 과부하 목표들을 정리 재분배했습니다.');
    } else if (insight.type === 'pattern') {
      // Late night tasks to morning
      setTodos(prev => prev.map(t => {
        if (t.time && parseInt(t.time.split(':')[0]) >= 22) {
          return { ...t, time: '09:00', notes: `${t.notes || ''} (AI 권고로 오전 재설정)` };
        }
        return t;
      }));
      alert('시간 이동 완료: 밤 10시 이후 등록되었던 조깅 및 보고서 업무가 효율적인 오전 9시로 자동 이주 완료되었습니다!');
    } else if (insight.type === 'routine') {
      // Connect regular stretching or meditation habit
      const stretchHabit: Todo = {
        id: `todo-hab-${Date.now()}`,
        title: '포스트 조깅 5분 심호흡 명상',
        category: '명상',
        priority: 'low',
        date: '오늘',
        time: '07:35',
        completed: false,
        status: 'normal',
        notes: '조깅 후 이완을 결합해 AI 루틴 마일스톤 연결성 강화'
      };
      setTodos(prev => [stretchHabit, ...prev]);
      alert('새 행위 사슬 결합 성공: "포스트 조깅 5분 심호흡 명상" 목표를 오늘의 스케줄러에 추가하였습니다!');
    }

    // 3. Log into coaching history timeline
    const log: CoachingHistory = {
      id: `hist-auto-${Date.now()}`,
      date: '방금 전 적용',
      title: `${insight.title} 자율 선택 실행`,
      status: 'applied',
      detail: `제시인사이트 "${insight.description}" 조항을 실질 스케줄러 영역에 완벽히 자동 수정/주입 처리 완료함.`
    };
    setHistory(prev => [log, ...prev]);
  };

  const handleDismissInsight = (id: string, title: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'dismissed' } : i));
    const log: CoachingHistory = {
      id: `hist-dismiss-${Date.now()}`,
      date: '방금 전 취소',
      title: `${title} 피드백 무시`,
      status: 'dismissed',
      detail: `제시 조항 및 행동 가이드를 보류 처리하였습니다.`
    };
    setHistory(prev => [log, ...prev]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB] font-sans">
      <div className="max-w-[1250px] mx-auto flex flex-col gap-6">

        {/* View Header with AI run triggers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1b1b24] tracking-tight">AI 인공지능 지능형 코칭</h2>
            <p className="text-xs text-[#777587] font-semibold mt-1">
              개인의 정밀 습관 가이던스를 연산하고 스케줄러를 직접 보정하도록 조율을 제시합니다.
            </p>
          </div>

          <button
            onClick={triggerNewAnalysis}
            disabled={isAnalyzing}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md relative overflow-hidden group select-none cursor-pointer ${
              isAnalyzing 
                ? 'bg-white border text-[#464555] cursor-not-allowed' 
                : 'bg-[#3525cd] text-white hover:bg-[#4f46e5] hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-[#3525cd]" />
                <span>분석 계산 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>새로운 정량 분석 요청</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic loading steps when calculating AI context */}
        {isAnalyzing && (
          <div className="bg-[#f0ecf9] border-2 border-dashed border-[#c3c0ff] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3.5 shadow-sm animate-pulse">
            <Bot className="w-10 h-10 text-[#3525cd] animate-bounce" />
            <div>
              <p className="text-sm font-bold text-[#3525cd]">{analysisProgressText}</p>
              <p className="text-[11px] text-[#777587] mt-1">Adaptive AI 통계 로직 엔진이 실시간 완결 대조표를 추출하고 있습니다.</p>
            </div>
          </div>
        )}

        {/* Main interactive section split in columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT 8cols: Core Narratives & Pending Insights */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            
            {/* 1. Hero banner report dashboard text */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-[-25%] left-[-15%] w-[45%] h-[45%] bg-[#f5f2ff] rounded-full blur-[70px] opacity-75 pointer-events-none" />
              <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[45%] bg-[#e2dfff]/40 rounded-full blur-[70px] opacity-75 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center shadow-md">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-md font-bold text-[#1b1b24]">이번 주 맞춤 지능형 가이드북</h3>
                </div>

                <div className="text-sm md:text-base text-[#464555] leading-relaxed font-medium bg-[#fcf8ff]/70 border border-[#eae6f4] rounded-2xl p-5 mb-1.5 shadow-inner">
                  {coachNarrative}
                </div>
                
                <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#777587] font-semibold select-none">
                  <Sliders className="w-3.5 h-3.5 text-[#3525cd]" />
                  <span>설정된 AI 파트너 페르소나: <strong className="text-[#3525cd]">{user.aiPersona === 'friendly' ? '친근하고 다정한 격려자' : user.aiPersona === 'logical' ? '이성적이고 스마트한 지휘관' : '단호하고 분석적인 감독관'}</strong></span>
                </div>
              </div>
            </div>

            {/* 2. Actionable Insights Stack List */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-[#1b1b24] uppercase tracking-wider ml-1 mt-1">즉시 실행 권장 액션 가이드</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight) => {
                  const isPending = insight.status === 'pending';
                  const isApplied = insight.status === 'applied';

                  let borderStyle = 'border-[#E5E7EB] bg-white';
                  if (isApplied) borderStyle = 'border-2 border-[#006c49] bg-[#f2fcf6]/35';
                  if (insight.status === 'dismissed') borderStyle = 'border-dashed border-[#c7c4d8] bg-[#F9FAFB] opacity-60';

                  return (
                    <div 
                      key={insight.id}
                      className={`rounded-2xl p-5 border shadow-sm transition-all duration-300 flex flex-col justify-between hover:shadow-md ${borderStyle}`}
                    >
                      <div>
                        {/* Title badge row */}
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2.5 py-1 bg-[#f0ecf9] text-[#3525cd] text-[10px] font-black rounded-lg uppercase tracking-wider">
                            {insight.title}
                          </span>
                          
                          {/* Success badge modifier if routine */}
                          {insight.badge && (
                            <span className="px-1.5 py-0.5 bg-[#eae7ff] text-[#3525cd] rounded text-[9px] font-black">
                              {insight.badge}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className={`text-xs md:text-sm font-semibold mb-6 leading-relaxed ${
                          isApplied ? 'text-[#006c49]' : 'text-[#464555]'
                        }`}>
                          {insight.description}
                        </p>
                      </div>

                      {/* Option button footer */}
                      <div className="flex items-center gap-2 mt-auto">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApplyInsightAction(insight)}
                              className="px-4 py-2 bg-[#3525cd] text-white rounded-lg font-bold text-xs hover:bg-[#4f46e5] cursor-pointer transition-all flex items-center gap-1 shadow-sm active:scale-95"
                            >
                              <span>{insight.buttonText || '실행'}</span>
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            
                            {insight.secondaryButtonText && (
                              <button
                                onClick={() => handleDismissInsight(insight.id, insight.title)}
                                className="px-3 py-2 bg-white border border-[#c7c4d8] rounded-lg text-xs font-extrabold text-[#464555] hover:bg-[#F9FAFB] cursor-pointer transition-all"
                              >
                                {insight.secondaryButtonText}
                              </button>
                            )}
                          </>
                        ) : isApplied ? (
                          <span className="text-xs font-black text-[#006c49] flex items-center gap-1 bg-[#eae6f4] px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
                            정밀 조율 완료됨
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-[#777587] tracking-wider uppercase bg-[#F9FAFB] px-2 py-0.5 rounded">
                            보류 또는 취소됨
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </main>

          {/* RIGHT 4cols: Timeline coaching histories */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col">
            <h3 className="text-md font-extrabold text-[#1b1b24] mb-1.5 flex items-center gap-1.5">
              <Hourglass className="w-4.5 h-4.5 text-[#3525cd]" />
              코칭 피드백 연혁
            </h3>
            <p className="text-[11px] text-[#777587] font-bold mb-5 uppercase tracking-wide">
              Timeline of adaptive insights applied
            </p>

            <div className="flex-1 overflow-y-auto max-h-[480px] pr-1.5 flex flex-col gap-4 relative">
              {/* Center trace timeline line */}
              <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-[#eae6f4]" />

              {history.map((event) => {
                const isDismissed = event.status === 'dismissed';
                return (
                  <div key={event.id} className="relative pl-9 flex flex-col gap-1 transition-all group">
                    {/* Circle bulb indicator */}
                    <div className={`absolute left-1.5 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-all group-hover:scale-125 z-10 ${
                      isDismissed
                        ? 'border-[#c7c4d8]/70 text-[#777587]'
                        : 'border-[#3525cd] text-[#3525cd] shadow-sm shadow-[#3525cd]/20'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>

                    {/* Date field */}
                    <span className="text-[10px] font-bold text-[#777587]">{event.date}</span>

                    {/* Report title */}
                    <h4 className={`text-xs font-bold leading-tight ${isDismissed ? 'text-[#777587] line-through' : 'text-[#1b1b24]'}`}>
                      {event.title}
                    </h4>

                    {/* Memo description if exists */}
                    {event.detail && (
                      <p className="text-[10px] text-[#777587] font-medium leading-relaxed bg-[#F9FAFB] p-2 rounded-xl border border-[#E5E7EB]/50 mt-1">
                        {event.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
