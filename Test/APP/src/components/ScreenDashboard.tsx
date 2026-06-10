import React, { useState, useEffect } from "react";
import { Bell, ArrowRight, Flame, Plus, CheckCircle, Circle, XCircle, Brain, Calendar, ChevronRight } from "lucide-react";
import { Task, UserProfile } from "../types.ts";

interface ScreenDashboardProps {
  tasks: Task[];
  profile: UserProfile;
  onNavigateToTab: (tabName: string) => void;
  onCompleteTask: (id: string) => void;
  onAddTask: (title: string, category: string) => void;
}

export default function ScreenDashboard({
  tasks,
  profile,
  onNavigateToTab,
  onCompleteTask,
  onAddTask
}: ScreenDashboardProps) {
  
  // Real AI Advice state
  const [aiAdvice, setAiAdvice] = useState<string>("오늘 미션을 영리하게 클리어할 수 있도록 할 일 목록을 분석하고 있어요...");
  const [targetTask, setTargetTask] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Quick Task Prompt state
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTitle, setQuickAddTitle] = useState("");
  const [quickCategory, setQuickAddCategory] = useState("WORK");

  // Timer simulation state
  const [timerTask, setTimerTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes default
  const [timerRunning, setTimerRunning] = useState(false);

  // Completed & Stats summary
  const todayTasks = tasks.filter(t => {
    // Basic filter match (pretend standard today / all are active)
    return !t.createdAt || t.createdAt.split("T")[0] === new Date().toISOString().split("T")[0];
  });
  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Active (uncompleted, not failed) first task or meeting
  const firstActiveTask = tasks.find(t => !t.completed && !t.failed);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      if (timerTask) {
        onCompleteTask(timerTask.id);
        alert(`🎉 축하합니다! 15분 동안 '${timerTask.title}' 초집중 세션을 완수하셨습니다!`);
        setTimerTask(null);
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Fetch AI Advice dynamically based on current task list
  useEffect(() => {
    async function fetchAdvice() {
      if (tasks.length === 0) {
        setAiAdvice("할 일이 비어 있어요! 가벼운 목표를 추가해 주시면 AI 코치가 흐름을 잡아 드릴게요.");
        return;
      }
      setLoadingAdvice(true);
      try {
        const response = await fetch("/api/coach-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentTasks: tasks })
        });
        const resData = await response.json();
        if (resData.success) {
          setAiAdvice(resData.suggestion);
          setTargetTask(resData.targetTaskTitle);
        } else {
          setAiAdvice("가장 먼저 시작할 수 있는 쉬운 태스크부터 5분만 눈 딱 감고 전진해 봅시다! 화이팅!");
        }
      } catch (err) {
        console.error("Failed to fetch suggestion", err);
        setAiAdvice("현재 클라이언트 미팅 준비 가이드를 먼저 정독하고 시작해 보시는걸 권해 드립니다.");
      } finally {
        setLoadingAdvice(false);
      }
    }
    fetchAdvice();
  }, [tasks]);

  const startTimer = (task: Task) => {
    setTimerTask(task);
    setTimeLeft(15 * 60); // 15 mins
    setTimerRunning(true);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      onAddTask(quickTitle.trim(), quickCategory);
      setQuickAddTitle("");
      setShowQuickAdd(false);
    }
  };

  // Human date string helper
  const getTodayDateStr = () => {
    const today = new Date();
    const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${months[today.getMonth()]}월 ${today.getDate()}일 ${days[today.getDay()]}요일`;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen pb-24 relative border border-gray-100 shadow-xl rounded-2xl">
      
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d0ecaf] rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#374d20]" />
          </div>
          <h1 className="font-bold text-lg tracking-tighter text-[#374d20]">Adaptive AI</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-1 rounded-full hover:bg-slate-100 active:scale-95 transition-all">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#d0ecaf]/40 active:scale-95 transition-transform cursor-pointer" onClick={() => onNavigateToTab("settings")}>
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSUlbBcR372pkJy9t7tLIopvEiBdXgDGY3OunufTJYzIGYyYD_ZyIBYGItzeU1lRbf6yIgL0oT74mYIk0Ri5Wt9z_E37ipREr4JSzeYK-rNgKuxCvzFkB2OjaOKguyRR821R6zC86taq7OWm9URDhXunyw6pRNFI-gVd1K8Tfzx63uXBSmz34igjIm2627v819GkFRNvOqKbPsnNYW7yOx1AoXN7sPuwhNAnyF56kmLPol_8LIPh2TBPDjIrgoeFlXP5EEUpkA2wWp"
            />
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Progress Display Card */}
        <section className="bg-[#d0ecaf]/20 rounded-2xl p-6 relative overflow-hidden border border-[#d0ecaf]/30 shadow-sm">
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-5">
              
              {/* Radial Progress Ring */}
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="rgba(78, 101, 53, 0.1)" strokeWidth="6" fill="transparent"></circle>
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#4e6535" 
                    strokeWidth="6" 
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - successRate / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#4e6535] font-bold text-lg">{successRate}%</span>
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-xs font-semibold">{getTodayDateStr()}</p>
                <h2 className="text-[#3D4A2E] font-bold text-lg mt-1 leading-tight">
                  {profile.name}님,<br />오늘 {totalCount - completedCount}개 남았어요
                </h2>
                <div className="flex gap-3 mt-2">
                  <span className="text-sm font-semibold text-slate-700">완료 {completedCount}/{totalCount}</span>
                  <span className="text-[#4e6535] text-xs font-semibold flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-current" /> 3일 연속
                  </span>
                </div>
              </div>
            </div>

            {/* Current focus item */}
            {firstActiveTask && (
              <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-[#d0ecaf]/40 shadow-sm">
                <p className="text-[10px] text-[#4e6535] uppercase tracking-wider mb-1 font-bold">지금 집중할 일</p>
                <h3 className="text-sm font-bold text-gray-800">{firstActiveTask.title}</h3>
                <div className="flex items-center gap-1.5 mt-1.5 mb-3 text-slate-500 text-xs">
                  <span>⏱ {firstActiveTask.duration} 세션</span>
                </div>
                
                <button 
                  type="button"
                  onClick={() => startTimer(firstActiveTask)}
                  className="w-full bg-[#4e6535] py-2.5 rounded-lg text-white font-bold flex items-center justify-center gap-1.5 text-xs hover:bg-[#3d5029] active:scale-98 transition-all"
                >
                  바로 시작하기
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-[#d0ecaf]/15 blur-2xl rounded-full"></div>
        </section>

        {/* 15-Minute focus timer simulation overlay/modal */}
        {timerTask && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] text-center shadow-2xl border border-[#d0ecaf]/30 animate-scale-up">
              <span className="px-3 py-1 rounded-full bg-[#d0ecaf] text-[#374d20] text-[10px] font-bold inline-block mb-3 uppercase">
                {timerTask.category} 집중 세션
              </span>
              <h3 className="font-bold text-gray-900 mb-2 truncate px-2">{timerTask.title}</h3>
              <p className="text-[11px] text-slate-400 mb-6">포모도로 15분 초집중 질주 엔진</p>
              
              <div className="text-4xl font-black text-[#4e6535] tracking-tight mb-8 font-mono">
                {formatTime(timeLeft)}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs text-white transition-all ${
                    timerRunning ? "bg-amber-600" : "bg-[#4e6535]"
                  }`}
                >
                  {timerRunning ? "일시정지" : "다시시작"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerTask(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  집중 그만두기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Today's Task Rows */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">오늘 할 일</h2>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold rounded">
                {completedCount}/{totalCount}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="bg-[#4e6535]/10 text-[#4e6535] border border-[#4e6535]/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#4e6535]/15 transition-all text-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 할 일</span>
            </button>
          </div>

          {/* Quick Add Form Collapse */}
          {showQuickAdd && (
            <form onSubmit={handleQuickAddSubmit} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 animate-fade-in">
              <input
                type="text"
                required
                value={quickTitle}
                onChange={(e) => setQuickAddTitle(e.target.value)}
                placeholder="어떤 일을 하실 건가요?"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-[#4e6535]"
              />
              <div className="flex justify-between items-center gap-2">
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickAddCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-[10px] text-gray-600 font-bold"
                >
                  <option value="WORK">WORK</option>
                  <option value="STUDY">STUDY</option>
                  <option value="MEETING">MEETING</option>
                  <option value="HOBBY">HOBBY</option>
                  <option value="HEALTH">HEALTH</option>
                  <option value="PROJECT">PROJECT</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="RESEARCH">RESEARCH</option>
                </select>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#4e6535] text-white rounded-lg text-[10px] font-bold"
                  >
                    추가
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task list rows */}
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                오늘 등록된 할 일이 없습니다.<br />새 할 일을 추가해 보세요!
              </div>
            ) : (
              todayTasks.slice(0, 3).map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    task.completed 
                      ? "bg-slate-50 border-slate-200 opacity-60" 
                      : task.failed 
                      ? "bg-red-50/40 border-red-100" 
                      : "bg-white border-[#4e6535]/10 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => onCompleteTask(task.id)}
                      className="text-slate-400 hover:text-[#4e6535] transition-colors focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-[#4e6535]" />
                      ) : task.failed ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    <span className={`text-xs font-semibold text-gray-800 truncate max-w-[200px] ${
                      task.completed ? "line-through text-slate-400" : ""
                    }`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {task.category}
                    </span>
                    {task.failed && (
                      <span className="text-[9px] font-extrabold text-red-500 bg-red-100 px-1.5 py-0.5 rounded">
                        실패
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* AI Coach Suggestion Widget */}
        <section className="bg-[#4e6535]/5 p-5 rounded-2xl border border-[#4e6535]/15 active:bg-[#4e6535]/10 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-[#4e6535]" />
            <h2 className="text-xs font-bold text-[#3D4A2E]">AI 코치 추천</h2>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl border border-[#4e6535]/10 mb-4 shadow-sm relative">
            <p className="text-slate-700 text-xs leading-relaxed font-semibold">
              {loadingAdvice ? "목록 분석 중..." : aiAdvice}
            </p>
          </div>

          <button 
            type="button"
            onClick={() => onNavigateToTab("ai-coach")}
            className="flex items-center gap-1 text-[#4e6535] text-xs font-bold hover:translate-x-1 transition-transform"
          >
            코치와 상담하기 
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Upcoming Goals */}
        <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#4e6535]" />
            <h2 className="text-xs font-bold text-[#3D4A2E]">다가오는 마감</h2>
          </div>
          
          <div className="flex justify-between items-center">
            {tasks.find(t => t.dueDateStr) ? (
              <>
                <span className="text-xs text-slate-600 font-semibold truncate max-w-[200px]">
                  {tasks.find(t => t.dueDateStr)?.title}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {tasks.find(t => t.dueDateStr)?.dueDateStr}
                </span>
              </>
            ) : (
              <span className="text-slate-400 text-xs">일주일 내에 긴급 마감이 없습니다.</span>
            )}
          </div>
        </section>

        {/* Weekly At A Glance */}
        <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[#3D4A2E] text-xs">≡</span>
              <h2 className="text-xs font-bold text-[#3D4A2E]">이번 주 한눈에</h2>
            </div>
            <button 
              type="button"
              onClick={() => onNavigateToTab("analytics")}
              className="text-slate-500 text-xs font-semibold flex items-center gap-0.5 hover:text-slate-700"
            >
              달력 보기
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex justify-between gap-1 overflow-x-auto pb-1">
            {/* Mon */}
            <div className="flex-1 flex flex-col items-center gap-1.5 min-w-[40px] rounded-lg py-1 cursor-pointer">
              <span className="text-[10px] text-slate-400 font-semibold">월</span>
              <div className="w-9 h-11 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                <span className="text-slate-800 font-bold text-xs">1</span>
              </div>
            </div>
            {/* Tue */}
            <div className="flex-1 flex flex-col items-center gap-1.5 min-w-[40px] rounded-lg py-1 cursor-pointer">
              <span className="text-[10px] text-slate-400 font-semibold">화</span>
              <div className="w-9 h-11 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                <span className="text-slate-800 font-bold text-xs">2</span>
              </div>
            </div>
            {/* Sat with progress */}
            <div className="flex-1 flex flex-col items-center gap-1.5 min-w-[40px] rounded-lg py-1 cursor-pointer">
              <span className="text-[10px] text-slate-400 font-semibold">토</span>
              <div className="w-9 h-11 bg-white rounded-lg flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                <span className="text-slate-800 font-bold text-xs">6</span>
                <div className="w-6 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="w-[60%] h-full bg-[#4e6535]"></div>
                </div>
              </div>
            </div>
            {/* Sun Current */}
            <div className="flex-1 flex flex-col items-center gap-1.5 min-w-[40px] rounded-lg py-1 cursor-pointer">
              <span className="text-[10px] text-[#4e6535] font-black">일</span>
              <div className="w-9 h-11 bg-[#d0ecaf] rounded-lg flex flex-col items-center justify-center border border-[#4e6535]/20 shadow-sm">
                <span className="text-[#4e6535] font-black text-xs">7</span>
                <div className="w-6 h-1 bg-[#4e6535]/20 rounded-full mt-1.5 overflow-hidden">
                  <div className="w-[100%] h-full bg-[#4e6535]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
