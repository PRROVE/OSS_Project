/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Mic, 
  Paperclip, 
  ChevronRight, 
  Lightbulb, 
  CheckCircle, 
  Clock, 
  Brain,
  Zap,
  Activity
} from 'lucide-react';
import { TaskItem, TaskPriority } from '../types';

interface HomeViewProps {
  profileName: string;
  categories: string[];
  tasks: TaskItem[];
  onGenerateTasks: (newTasks: TaskItem[], insight: string) => void;
  onNavigateToTab: (tabId: string) => void;
  theme: 'light' | 'dark';
}

export default function HomeView({ 
  profileName, 
  categories, 
  tasks, 
  onGenerateTasks, 
  onNavigateToTab, 
  theme 
}: HomeViewProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const handleGeneratePlan = async () => {
    if (!prompt.trim()) {
      setErrorMessage("집중할 세부 마일스톤이나 학습 주제를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessInfo('');

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          profileName,
          onboardedCategories: categories
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact dynamic intelligence module.");
      }

      const data = await response.json();
      
      // Parse generated tasks into structure
      const parsedTasks: TaskItem[] = (data.tasks || []).map((t: any, index: number) => ({
        id: `ai-gen-${Date.now()}-${index}`,
        title: t.title,
        description: t.description,
        status: index === 0 ? 'active' : 'upcoming', // first active, others upcoming
        progress: index === 0 ? 10 : 0,
        durationMinutes: t.durationMinutes || 45,
        priority: (t.priority?.toLowerCase() as TaskPriority) || 'medium',
        category: categories[0] || '생산성'
      }));

      onGenerateTasks(parsedTasks, data.insight);
      setSuccessInfo(`새 몰입 계획에 따른 ${parsedTasks.length}개 작업이 할 일 목록에 자동 동기화되었습니다!`);
      setPrompt('');
    } catch (error) {
      console.error(error);
      setErrorMessage("서버와 통신하는 도중 오류가 발생해 시뮬레이션 데이터를 주입했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'glass-card-dark' : 'bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] border border-slate-100';

  const upcomingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Personalized Greeting */}
      <section className="space-y-1">
        <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-widest block">
          Morning, {profileName || 'Jordan'}
        </span>
        <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
          잠재력을 발휘할 준비가 되셨나요?
        </h2>
      </section>

      {/* Central AI Plan Generator Box */}
      <section className="relative">
        <div id="ai-prompter" className={`rounded-3xl p-6 flex flex-col gap-4 group transition-all duration-300 focus-within:ring-2 focus-within:ring-[#8B5CF6]/20 ${cardBg}`}>
          <div className="flex items-start gap-4">
            <Brain className="text-[#8B5CF6] w-8 h-8 mt-1 shrink-0" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="오늘의 집중을 위해 무엇을 도와드릴까요? (예: 아키텍처 상세 사양 설계, 리액트 애니메이션 검토)"
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-base font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 resize-none h-24 pt-1"
            />
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <div className="flex gap-2">
              <button 
                title="음성 인식 입력을 시뮬레이션합니다"
                onClick={() => setPrompt("수면 데이터 및 시간 관리 마일스톤 생성")}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                title="파일 피드백 분석을 시뮬레이션합니다"
                onClick={() => setPrompt("UI 모션 경로 피드백 검토 및 세크먼트 수립")}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#6D3BD7] to-[#3B82F6] hover:opacity-90 active:scale-95 text-white px-6 py-2.5 rounded-full font-semibold text-xs shadow-lg shadow-[#6D3BD7]/10 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "생성 중..." : "내 계획 생성하기"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic status/logs */}
        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium px-2 mt-2">
            ⚠️ {errorMessage}
          </p>
        )}
        {successInfo && (
          <p className="text-xs text-emerald-500 font-semibold px-2 mt-2">
            ✓ {successInfo}
          </p>
        )}
      </section>

      {/* AI Daily Recommendations Bento */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${textPrimary}`}>
            일일 인사이트
          </h3>
          <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-violet-100 dark:bg-violet-950/40 px-2 py-1 rounded-full">
            실시간
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Giant Insight Card */}
          <div className={`${cardBg} rounded-3xl p-6 md:col-span-2 relative overflow-hidden group hover:shadow-md transition-shadow`}>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  AI 코치
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  • 2분 읽기
                </span>
              </div>
              <p className={`text-base md:text-lg leading-relaxed font-normal ${textSecondary}`}>
                수면 주기와 일정을 분석한 결과, 가장 집중력이 높은 시간은 <span className="text-[#8B5CF6] font-bold">오전 10:00에서 11:30 사이</span>입니다. 이 시간 동안 집중 프로토콜을 가동하기 위해 알림을 차단해 두었습니다.
              </p>
              <button 
                onClick={() => onNavigateToTab('insights')}
                className="flex items-center gap-1.5 text-xs text-[#8B5CF6] font-bold bg-transparent border-none cursor-pointer group hover:opacity-85"
              >
                <span>상세 인사이트 보기</span>
                <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="absolute right-[-10px] top-[-10px] opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-500">
              <Lightbulb className="w-40 h-40 text-slate-400" />
            </div>
          </div>

          {/* Render Upcomings dynamically to maintain state sync */}
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task, idx) => {
              const accentColor = idx === 0 ? 'border-l-indigo-500' : 'border-l-emerald-500';
              const iconBg = idx === 0 ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500';
              return (
                <div
                  key={task.id}
                  onClick={() => onNavigateToTab('tasks')}
                  className={`${cardBg} rounded-3xl p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 ${accentColor} transition-all cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
                    {idx === 0 ? <Activity className="w-6 h-6 stroke-[1.8]" /> : <Zap className="w-6 h-6 stroke-[1.8]" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${textPrimary}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {task.description || `${task.durationMinutes}분 간 예정됨`}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-350" />
                </div>
              );
            })
          ) : (
            <>
              {/* Fallback Static Items if list undergoes deletion */}
              <div
                onClick={() => onNavigateToTab('tasks')}
                className={`${cardBg} rounded-3xl p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-indigo-500 transition-all cursor-pointer`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${textPrimary}`}>
                    마음챙김 휴식
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    11:30에 5분간 예정됨
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-350" />
              </div>

              <div
                onClick={() => onNavigateToTab('tasks')}
                className={`${cardBg} rounded-3xl p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-emerald-500 transition-all cursor-pointer`}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${textPrimary}`}>
                    딥 워크: 프로젝트 아우라
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    아키텍처 초안 완료하기
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-350" />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
