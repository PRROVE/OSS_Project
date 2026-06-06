import React from "react";
import { Todo } from "../types";

interface DashboardProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  setScreen: (screen: string) => void;
  username: string;
  addMarketingTask: () => void;
  streakDays: number;
}

export default function Dashboard({
  todos,
  toggleTodo,
  setScreen,
  username,
  addMarketingTask,
  streakDays,
}: DashboardProps) {
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const pendingCount = todos.filter((t) => !t.completed && !t.failed).length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Count by categories for the bar chart
  const categories = ["업무", "미팅", "프로젝트", "연구", "기타"];
  const categoryCounts = categories.reduce((acc, cat) => {
    // Map categories closely to our tasks
    let matchCount = 0;
    if (cat === "업무") {
      matchCount = todos.filter((t) => t.completed && (t.category === "WORK" || t.category === "업무")).length;
    } else if (cat === "미팅") {
      matchCount = todos.filter((t) => t.completed && (t.category === "MEETING" || t.category === "미팅")).length;
    } else if (cat === "프로젝트") {
      matchCount = todos.filter((t) => t.completed && t.category === "프로젝트").length + 1; // Base + 1 for display
    } else if (cat === "연구") {
      matchCount = todos.filter((t) => t.completed && t.category === "연구").length + 2; // Base + 2 for display
    } else {
      matchCount = todos.filter((t) => t.completed && (t.category === "ADMIN" || t.category === "관리" || t.category === "기타")).length;
    }
    acc[cat] = Math.max(1, matchCount); // Ensure at least small bar for nice visuals
    return acc;
  }, {} as Record<string, number>);

  const maxVal = Math.max(...Object.values(categoryCounts));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Hero Welcome Section */}
      <section className="pt-2">
        <h2 className="font-display text-2xl font-extrabold text-[#191c1b]">
          안녕하세요, {username}님
        </h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-[#45483d] font-medium">
            2026년 6월 6일 토요일
          </p>
          <div className="bg-[#ffdbd1] px-3 py-1 rounded-full">
            <span className="font-sans text-[11px] font-bold text-[#7b2e16]">
              오늘 {pendingCount}개 남음
            </span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        {/* 오늘 성공률 */}
        <div className="soft-card p-4 flex flex-col justify-between aspect-square">
          <p className="text-xs font-semibold text-[#45483d]">오늘 성공률</p>
          <div className="relative flex items-center justify-center py-2">
            <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
              {/* Simple background circle */}
              <div className="absolute inset-0 rounded-full border-4 border-[#455528]/20 border-t-transparent" />
              <div className="flex flex-col items-center">
                <span className="font-display font-bold text-xl text-[#191c1b]">{successRate}</span>
                <span className="text-[9px] font-bold text-[#45483d]">%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#455528] pt-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span className="text-[10px] font-bold">지난주 대비 +5%</span>
          </div>
        </div>

        {/* 연속 달성 */}
        <div className="soft-card p-4 flex flex-col justify-between aspect-square">
          <p className="text-xs font-semibold text-[#45483d]">연속 달성</p>
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-3xl text-[#191c1b]">{streakDays}</span>
              <span className="text-sm font-bold text-[#45483d]">일</span>
            </div>
            <div className="mt-2 flex items-center gap-1 bg-[#d7eab0] px-2.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[10px] text-[#455528]">arrow_upward</span>
              <span className="text-[10px] font-bold text-[#3d4c20]">이번 달 최고</span>
            </div>
          </div>
        </div>

        {/* 완료 할 일 */}
        <div className="soft-card p-4 flex flex-col justify-between col-span-2 py-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-[#45483d]">완료 할 일</p>
            <div className="flex items-baseline gap-1 bg-[#f3f4f2] px-2 py-0.5 rounded-md">
              <span className="text-sm font-bold text-[#455528]">{completedCount}</span>
              <span className="text-xs text-[#45483d]">/ {totalCount}</span>
            </div>
          </div>
          <div className="w-full bg-[#edeeec] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#455528] h-full rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* AI 피드백 */}
        <div
          onClick={() => setScreen("anal")}
          className="soft-card p-4 col-span-2 flex justify-between items-center hover:bg-gray-50 active:scale-[0.99] cursor-pointer"
        >
          <div>
            <p className="text-xs font-semibold text-[#45483d]">AI 피드백</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-display font-extrabold text-xl text-[#191c1b]">3</span>
              <span className="text-xs font-bold text-[#45483d]">건</span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[#86361d] text-xs font-bold bg-[#ffe0d7] px-3 py-1.5 rounded-full transition-colors hover:opacity-90">
            추천 보기
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* AI Coach Recommend Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#455528] font-bold animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <h3 className="font-display font-extrabold text-lg text-[#191c1b]">AI 코치 추천</h3>
        </div>
        <div className="soft-card overflow-hidden bg-[#5d6d3e]/5 border border-[#5d6d3e]/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#455528] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              오전 집중 시간 활용 제안
            </span>
          </div>
          <p className="text-xs text-[#45483d] leading-relaxed">
            최근 2주간 오전 10-12시 완료율이 가장 높습니다. <strong className="text-[#191c1b] font-semibold">'마케팅 리포트'</strong> 작성을 이 시간에 집중하는 것을 권장합니다.
          </p>
          <button
            onClick={addMarketingTask}
            className="w-full py-2.5 bg-[#455528] text-white rounded-xl font-bold text-xs hover:bg-[#455528]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            일정 추가 및 조정하기
          </button>
        </div>
      </section>

      {/* Today's Tasks Summary Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-extrabold text-lg text-[#191c1b]">오늘 할 일</h3>
            <span className="bg-[#edeeec] px-2 py-0.5 rounded-md text-[10px] font-bold text-[#45483d]">
              {pendingCount}개 남음
            </span>
          </div>
          <button
            onClick={() => setScreen("todo")}
            className="flex items-center gap-0.5 text-[#455528] font-bold text-xs hover:underline"
          >
            <span className="material-symbols-outlined text-xs font-bold">add</span>
            추가 / 관리
          </button>
        </div>

        <div className="space-y-3">
          {todos.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className={`soft-card p-4 relative overflow-hidden transition-all ${
                task.completed
                  ? "bg-gray-50 border-gray-100 opacity-80"
                  : task.failed
                  ? "bg-[#ffdad6]/10 border-[#ba1a1a]/20"
                  : ""
              }`}
            >
              {/* Left Color Indicator pill */}
              <div
                className={`absolute left-0 top-0 h-full w-1 ${
                  task.completed
                    ? "bg-[#c6c8ba]"
                    : task.failed
                    ? "bg-[#ba1a1a]"
                    : "bg-[#455528]"
                }`}
              />

              <div className="flex items-start gap-3">
                {/* Complete checkbox bubble button */}
                <button
                  onClick={() => toggleTodo(task.id)}
                  disabled={task.failed}
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-[#455528] border-[#455528] text-white"
                      : task.failed
                      ? "bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]"
                      : "border-[#c6c8ba] bg-[#f3f4f2] hover:border-[#455528]"
                  }`}
                >
                  {task.completed ? (
                    <span className="material-symbols-outlined text-[14px] font-bold text-white">check</span>
                  ) : task.failed ? (
                    <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                  ) : null}
                </button>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-xs font-bold text-[#191c1b] truncate ${
                      task.completed ? "line-through text-[#45483d]/60 font-normal" : ""
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-[#45483d]/70 font-semibold font-mono">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {task.time}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-tight uppercase ${
                        task.category === "WORK" || task.category === "업무"
                          ? "bg-gray-100 text-[#45483d]"
                          : task.category === "MEETING" || task.category === "미팅"
                          ? "bg-[#e1e4d9] text-[#62655d]"
                          : task.category === "ADMIN" || task.category === "관리"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {task.category}
                    </span>

                    {task.failed && (
                      <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded text-[9px] font-bold">
                        실패
                      </span>
                    )}
                  </div>

                  {/* AI Advice snippet inline */}
                  {!task.completed && task.aiMemo && (
                    <div className="mt-2.5 flex items-start gap-1.5 bg-[#f3f4f2] p-2 rounded-lg text-[10px] text-[#455528] font-bold">
                      <span
                        className="material-symbols-outlined text-xs mt-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_awesome
                      </span>
                      <span>AI: {task.aiMemo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="text-center py-6 text-xs text-[#45483d] italic">
              오늘 등록된 할 일이 없습니다. 할 일 관리를 클릭하여 등록해 보세요.
            </div>
          )}
        </div>
      </section>

      {/* Category Chart Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-extrabold text-lg text-[#191c1b]">부문별 점유율</h3>
          <span className="text-[10px] text-[#45483d] font-semibold">카테고리별 완료 비중</span>
        </div>
        <div className="soft-card p-5">
          <div className="flex items-end justify-between h-32 gap-3 mb-3 px-2">
            {categories.map((cat, idx) => {
              const count = categoryCounts[cat];
              // map color accent based on category
              const colors = [
                "bg-[#455528]", // 업무 (moss dark)
                "bg-[#a54d32]", // 미팅 (tertiary terracotta)
                "bg-[#bbcd96]", // 프로젝트
                "bg-[#c5c8bd]", // 연구
                "bg-[#e2e3e1]", // 기타
              ];
              // percentage height Calculation
              const pct = maxVal > 0 ? (count / maxVal) * 80 : 20; // safe scale
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                  <div
                    className={`${colors[idx]} rounded-t-lg w-full transition-all duration-500 hover:opacity-90 relative group`}
                    style={{ height: `${pct}%` }}
                  >
                    {/* Tooltip on Hover */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                      {count}개
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-bold text-[#45483d] px-1 font-sans">
            {categories.map((cat, idx) => (
              <span key={idx} className="flex-1 text-center">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
