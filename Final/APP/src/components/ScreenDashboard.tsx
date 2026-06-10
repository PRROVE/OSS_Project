import React, { useState, useEffect } from "react";
import {
  Plus, Clock, Check, ChevronRight, Sparkles, Flame,
  ArrowRight, CalendarClock, Brain,
} from "lucide-react";
import { Task, UserProfile } from "../types";

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
  onAddTask,
}: ScreenDashboardProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const todayTasks         = tasks.filter(t => t.createdAt?.startsWith(todayStr));
  const activeTodayTasks   = todayTasks.filter(t => !t.completed && !t.failed);
  const completedTodayTasks = todayTasks.filter(t => t.completed);
  const totalRelevant      = todayTasks.filter(t => !t.failed).length;
  const successRate        = totalRelevant > 0 ? Math.round((completedTodayTasks.length / totalRelevant) * 100) : 0;

  const nextTask = activeTodayTasks[0] ?? tasks.find(t => !t.completed && !t.failed);

  const upcomingDeadlines = tasks.filter(t => !t.completed && !t.failed && t.dueDateStr).slice(0, 4);

  const dow          = new Date().getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + mondayOffset + i);
    const ds = d.toISOString().split("T")[0];
    const dayTasks = tasks.filter(t => t.createdAt?.startsWith(ds));
    return {
      ds,
      label: ["월", "화", "수", "목", "금", "토", "일"][i],
      dayNum: d.getDate(),
      total: dayTasks.length,
      done: dayTasks.filter(t => t.completed).length,
    };
  });

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTitle, setQuickTitle]     = useState("");
  const [quickCategory, setQuickCategory] = useState("WORK");

  const [timerTask, setTimerTask]       = useState<Task | null>(null);
  const [timeLeft, setTimeLeft]         = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [aiAdvice, setAiAdvice]         = useState("오늘 할 일을 분석하고 있어요...");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (timerRunning && timeLeft > 0) {
      id = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      if (timerTask) {
        onCompleteTask(timerTask.id);
        alert(`🎉 '${timerTask.title}' 15분 세션 완수!`);
        setTimerTask(null);
      }
    }
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    async function fetchAdvice() {
      if (tasks.length === 0) {
        setAiAdvice("할 일이 비어 있어요! 가벼운 목표를 추가해 주시면 AI 코치가 흐름을 잡아 드릴게요.");
        return;
      }
      setLoadingAdvice(true);
      try {
        const res  = await fetch("/api/coach-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentTasks: tasks }),
        });
        const data = await res.json();
        setAiAdvice(data.success ? data.suggestion : "가장 먼저 시작할 수 있는 쉬운 태스크부터 전진해 봅시다!");
      } catch {
        setAiAdvice(
          nextTask
            ? `가장 급한 '${nextTask.title}'부터 시작하면 오늘 흐름을 잡기 좋아요.`
            : "모든 일정을 마쳤어요. 내일 계획을 미리 세워두면 시작이 가벼워집니다."
        );
      } finally {
        setLoadingAdvice(false);
      }
    }
    fetchAdvice();
  }, [tasks]);

  const C = 2 * Math.PI * 32;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      onAddTask(quickTitle.trim(), quickCategory);
      setQuickTitle("");
      setShowQuickAdd(false);
    }
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="w-full bg-white flex flex-col min-h-screen pb-24 relative">

      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#e0ddd8] px-5 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#ecf0e4] rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#5a6e38]" />
          </div>
          <h1 className="font-bold text-base text-[#1c1c14] tracking-tight">To Do IT</h1>
        </div>
        <button
          onClick={() => onNavigateToTab("settings")}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#c8d4a8]/40 active:scale-95 transition-transform"
        >
          <img
            alt="프로필"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSUlbBcR372pkJy9t7tLIopvEiBdXgDGY3OunufTJYzIGYyYD_ZyIBYGItzeU1lRbf6yIgL0oT74mYIk0Ri5Wt9z_E37ipREr4JSzeYK-rNgKuxCvzFkB2OjaOKguyRR821R6zC86taq7OWm9URDhXunyw6pRNFI-gVd1K8Tfzx63uXBSmz34igjIm2627v819GkFRNvOqKbPsnNYW7yOx1AoXN7sPuwhNAnyF56kmLPol_8LIPh2TBPDjIrgoeFlXP5EEUpkA2wWp"
          />
        </button>
      </header>

      <div className="p-5 space-y-5">

        {/* ── 히어로 ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 text-white shadow-level-2"
          style={{ background: "linear-gradient(135deg, #2c3420 0%, #3a4628 55%, #282e1c 100%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 88% 15%, rgba(164,184,120,0.18) 0%, transparent 55%)" }}
          />
          <div className="relative flex flex-col gap-5">

            {/* 진행 링 + 인사 */}
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="32" stroke="#a4b878" strokeWidth="6" fill="none"
                    strokeDasharray={C}
                    strokeDashoffset={C - (C * successRate) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[20px] font-bold leading-none">{successRate}%</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-white/55 font-medium">
                  {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
                </p>
                <h2 className="text-[18px] font-bold tracking-tight leading-snug mt-0.5">
                  {profile.name}님,{" "}
                  {activeTodayTasks.length > 0 ? `오늘 ${activeTodayTasks.length}개 남았어요` : "오늘 다 끝냈어요 🎉"}
                </h2>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/70 font-medium">
                  <span>완료 {completedTodayTasks.length}/{totalRelevant}</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#e0a06a]" />3일 연속
                  </span>
                </div>
              </div>
            </div>

            {/* 집중할 일 카드 */}
            {nextTask ? (
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-[10px] text-white/55 mb-1 font-semibold uppercase tracking-wide">지금 집중할 일</p>
                <p className="text-[13px] font-bold leading-snug line-clamp-2">{nextTask.title}</p>
                {nextTask.timeStr && (
                  <p className="text-[10px] text-white/60 flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3" />{nextTask.timeStr} 예정 · {nextTask.duration}
                  </p>
                )}
                <button
                  onClick={() => { setTimerTask(nextTask); setTimeLeft(15 * 60); setTimerRunning(true); }}
                  className="mt-3 w-full py-2 bg-[#a4b878] hover:bg-[#b6c98a] text-[#1c1c14] rounded-lg text-[12px] font-bold transition-colors flex items-center justify-center gap-1 active:scale-97"
                >
                  바로 시작하기 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#a4b878]" />
                </div>
                <p className="text-[12px] text-white/80 font-medium leading-snug">오늘 할 일을 모두 끝냈어요. 잠시 쉬어가세요!</p>
              </div>
            )}
          </div>
        </div>

        {/* ── 타이머 오버레이 ── */}
        {timerTask && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] text-center shadow-2xl border border-[#c8d4a8]">
              <span className="px-3 py-1 rounded-full bg-[#ecf0e4] text-[#5a6e38] text-[10px] font-bold inline-block mb-3 uppercase">
                {timerTask.category} 집중 세션
              </span>
              <h3 className="font-bold text-[#1c1c14] mb-1 truncate px-2">{timerTask.title}</h3>
              <p className="text-[11px] text-[#9a9a86] mb-5">포모도로 15분 초집중 세션</p>
              <div className="text-4xl font-black text-[#5a6e38] tracking-tight mb-7 font-mono">{fmt(timeLeft)}</div>
              <div className="flex gap-2">
                <button onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs text-white transition-all ${timerRunning ? "bg-amber-600" : "bg-[#5a6e38]"}`}>
                  {timerRunning ? "일시정지" : "다시시작"}
                </button>
                <button onClick={() => { setTimerRunning(false); setTimerTask(null); }}
                  className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#edecea] text-[#6b6b58]">
                  그만두기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 오늘 할 일 ── */}
        <div className="bg-white border border-[#e0ddd8] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#e0ddd8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1c1c14]">오늘 할 일</span>
              <span className="text-[11px] text-[#9a9a86] bg-[#edecea] px-2 py-0.5 rounded-full font-medium">
                {completedTodayTasks.length}/{totalRelevant}
              </span>
            </div>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex items-center gap-1 text-[12px] text-white bg-[#5a6e38] hover:bg-[#4a5c2e] font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> 새 할 일
            </button>
          </div>

          {showQuickAdd && (
            <form onSubmit={handleQuickAdd} className="px-5 py-4 bg-[#f7f6f2] border-b border-[#e0ddd8] space-y-3">
              <input
                type="text" required autoFocus value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
                placeholder="어떤 일을 하실 건가요?"
                className="w-full bg-white border border-[#e0ddd8] rounded-lg px-3 py-2 text-xs text-[#1c1c14] focus:outline-none focus:ring-1 focus:ring-[#5a6e38]"
              />
              <div className="flex items-center gap-2 justify-between">
                <select value={quickCategory} onChange={e => setQuickCategory(e.target.value)}
                  className="bg-white border border-[#e0ddd8] rounded-lg px-2 py-1.5 text-[10px] text-[#6b6b58] font-bold focus:outline-none">
                  {["WORK", "STUDY", "MEETING", "HOBBY", "HEALTH", "PROJECT", "ADMIN", "RESEARCH"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => setShowQuickAdd(false)}
                    className="px-3 py-1.5 bg-[#edecea] text-[#6b6b58] rounded-lg text-[10px] font-bold">취소</button>
                  <button type="submit"
                    className="px-3 py-1.5 bg-[#5a6e38] text-white rounded-lg text-[10px] font-bold">추가</button>
                </div>
              </div>
            </form>
          )}

          <div className="divide-y divide-[#f7f6f2]">
            {todayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <div className="w-10 h-10 rounded-full bg-[#edecea] flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#9a9a86]" />
                </div>
                <p className="text-xs text-[#9a9a86]">오늘 할 일이 없습니다</p>
                <button onClick={() => setShowQuickAdd(true)} className="text-xs text-[#5a6e38] font-semibold hover:underline">
                  + 할 일 추가하기
                </button>
              </div>
            ) : (
              todayTasks.slice(0, 8).map(task => (
                <div key={task.id}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                    task.completed ? "opacity-40" : task.failed ? "opacity-60" : "hover:bg-[#f7f6f2]"
                  }`}>
                  <button type="button" onClick={() => onCompleteTask(task.id)}
                    className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      task.completed ? "bg-[#5a6e38] border-[#5a6e38]" :
                      task.failed    ? "bg-[#f8ede8] border-[#c4674a]" :
                      "border-[#e0ddd8] hover:border-[#5a6e38] bg-white"
                    }`}>
                    {task.completed && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    {task.failed    && <span className="text-[10px] font-bold text-[#c4674a] leading-none">✕</span>}
                  </button>

                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onCompleteTask(task.id)}>
                    <p className={`text-xs truncate ${
                      task.completed || task.failed ? "line-through text-[#9a9a86]" : "text-[#1c1c14] font-medium"
                    }`}>{task.title}</p>
                    {task.timeStr && !task.completed && !task.failed && (
                      <p className="text-[10px] text-[#9a9a86] flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-3 h-3" />{task.timeStr}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-[#9a9a86] bg-[#edecea] px-1.5 py-0.5 rounded font-medium">{task.category}</span>
                    {task.failed && <span className="text-[10px] text-[#c4674a] font-semibold">실패</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {todayTasks.length > 8 && (
            <div className="px-5 py-3 border-t border-[#e0ddd8] flex items-center justify-between">
              <span className="text-[11px] text-[#9a9a86]">총 {todayTasks.length}개 중 8개 표시</span>
              <button onClick={() => onNavigateToTab("tasks")}
                className="text-[11px] text-[#1c1c14] font-semibold hover:underline flex items-center gap-0.5">
                전체 보기 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* ── AI 코치 추천 ── */}
        <button
          onClick={() => onNavigateToTab("ai-coach")}
          className="w-full bg-white border border-[#e0ddd8] rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-3"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#c4674a]" />
            <span className="text-sm font-bold text-[#1c1c14]">AI 코치 추천</span>
          </div>
          <div className="bg-[#f7f6f2] rounded-lg p-3.5">
            <p className="text-xs text-[#6b6b58] leading-relaxed">
              {loadingAdvice ? "분석 중..." : aiAdvice}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5a6e38] flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            코치와 상담하기 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* ── 다가오는 마감 ── */}
        <div className="bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <CalendarClock className="w-4 h-4 text-[#5a6e38]" />
            <span className="text-sm font-bold text-[#1c1c14]">다가오는 마감</span>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-xs text-[#9a9a86] py-1">마감 예정인 할 일이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingDeadlines.map(t => (
                <button key={t.id} onClick={() => onNavigateToTab("tasks")}
                  className="flex items-center gap-2 text-left hover:bg-[#f7f6f2] -mx-1.5 px-1.5 py-1 rounded-md transition-colors">
                  <span className="text-xs text-[#1c1c14] font-medium flex-grow truncate">{t.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-[#f8ede8] text-[#c4674a]">
                    {t.dueDateStr}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── 분석 바로가기 ── */}
        <button
          onClick={() => onNavigateToTab("analytics")}
          className="w-full bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-[#1c1c14]">분석 보기</p>
            <p className="text-[11px] text-[#9a9a86] mt-0.5">카테고리·완수 추이 등 통계</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9a9a86] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* ── 이번 주 한눈에 ── */}
        <div className="bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-[#5a6e38]" />
              <span className="text-sm font-bold text-[#1c1c14]">이번 주 한눈에</span>
            </div>
            <button onClick={() => onNavigateToTab("tasks")}
              className="text-[11px] text-[#9a9a86] hover:text-[#1c1c14] font-medium flex items-center gap-0.5">
              달력 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map(d => {
              const isToday = d.ds === todayStr;
              const pct     = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
              return (
                <div key={d.ds}
                  className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border transition-colors ${
                    isToday ? "border-[#5a6e38] bg-[#5a6e38]/5" : "border-[#e0ddd8]"
                  }`}>
                  <span className={`text-[10px] font-bold ${isToday ? "text-[#5a6e38]" : "text-[#9a9a86]"}`}>{d.label}</span>
                  <span className={`text-sm font-bold leading-none ${isToday ? "text-[#5a6e38]" : "text-[#1c1c14]"}`}>{d.dayNum}</span>
                  {d.total > 0 ? (
                    <div className="w-full flex flex-col items-center gap-1 mt-1">
                      <div className="w-full h-1.5 bg-[#edecea] rounded-full overflow-hidden">
                        <div className="h-full bg-[#5a6e38] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[9px] text-[#9a9a86] font-medium tabular-nums">{d.done}/{d.total}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#cfccc4] mt-1 leading-none">·</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
