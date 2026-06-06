import React, { useState } from "react";
import { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  addCustomTodo: (title: string, category: string, time: string, aiMemo?: string) => void;
  deleteTodo: (id: string) => void;
  userAvatar: string;
}

export default function TodoList({
  todos,
  toggleTodo,
  addCustomTodo,
  deleteTodo,
  userAvatar,
}: TodoListProps) {
  const [viewType, setViewType] = useState<"list" | "calendar" | "kanban">("list");
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("업무");
  const [newTime, setNewTime] = useState("12:00-13:00");
  const [newAiMemo, setNewAiMemo] = useState("");

  // Filtering todos
  const filteredTodos = todos.filter((todo) => {
    // Search query match
    if (searchQuery.trim().length > 0) {
      if (!todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    // Category match
    if (activeCategory === "전체") return true;
    if (activeCategory === "업무") return todo.category === "WORK" || todo.category === "업무" || todo.category === "관리";
    if (activeCategory === "개인") return todo.category === "개인" || todo.category === "ADMIN";
    if (activeCategory === "미팅") return todo.category === "MEETING" || todo.category === "미팅";
    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    // Convert human readable category to standard system keys
    let finalCat = newCategory;
    if (newCategory === "업무") finalCat = "WORK";
    else if (newCategory === "미팅") finalCat = "MEETING";
    else if (newCategory === "개인") finalCat = "개인";
    
    addCustomTodo(newTitle, finalCat, newTime, newAiMemo ? newAiMemo : undefined);
    
    // Reset fields
    setNewTitle("");
    setNewAiMemo("");
    setNewTime("12:00-13:00");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* Header matching mockup */}
      <header className="flex justify-between items-center py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-gray-200">
            <img referrerPolicy="no-referrer" alt="User Profile Photo" className="w-full h-full object-cover" src={userAvatar} />
          </div>
          <h1 className="font-display font-extrabold text-xl text-[#191c1b]">오늘 할 일</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text"
              placeholder="일정 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#f3f4f2] text-xs border-none rounded-full focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none w-32 md:w-44 transition-all"
            />
            <span className="material-symbols-outlined text-[#455528]/70 absolute left-2 top-1.5 text-xs font-bold">search</span>
          </div>
        </div>
      </header>

      {/* Filter Options */}
      <section className="space-y-3">
        {/* View Selection Row */}
        <div className="flex gap-2 overflow-x-auto scroll-hide py-1">
          <button
            onClick={() => setViewType("list")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs transition-all active:scale-95 whitespace-nowrap ${
              viewType === "list"
                ? "bg-[#455528] text-white shadow-sm"
                : "bg-white border border-[#c6c8ba] text-[#45483d] hover:bg-[#f3f4f2]"
            }`}
          >
            <span className="material-symbols-outlined text-sm font-bold">format_list_bulleted</span>
            <span className="font-bold">목록형</span>
          </button>
          <button
            onClick={() => setViewType("calendar")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs transition-all active:scale-95 whitespace-nowrap ${
              viewType === "calendar"
                ? "bg-[#455528] text-white shadow-sm"
                : "bg-white border border-[#c6c8ba] text-[#45483d] hover:bg-[#f3f4f2]"
            }`}
          >
            <span className="material-symbols-outlined text-sm font-bold">calendar_month</span>
            <span className="font-bold">달력형</span>
          </button>
          <button
            onClick={() => setViewType("kanban")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs transition-all active:scale-95 whitespace-nowrap ${
              viewType === "kanban"
                ? "bg-[#455528] text-white shadow-sm"
                : "bg-white border border-[#c6c8ba] text-[#45483d] hover:bg-[#f3f4f2]"
            }`}
          >
            <span className="material-symbols-outlined text-sm font-bold">view_kanban</span>
            <span className="font-bold">칸반형</span>
          </button>
        </div>

        {/* Category Filters Row */}
        <div className="flex gap-2 overflow-x-auto scroll-hide py-0.5">
          {["전체", "업무", "개인", "미팅"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold font-sans transition-all active:scale-[0.96] ${
                activeCategory === cat
                  ? "bg-[#e1e4d9] text-[#62655d]"
                  : "bg-white border border-[#c6c8ba]/70 text-[#45483d]/80 hover:bg-[#f3f4f2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAB Custom Toggle Inline Form */}
      <div className="relative">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-3 bg-white hover:bg-slate-50 border border-dashed border-[#c6c8ba] text-charcoal/80 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-xs font-bold text-[#455528]">
            {showAddForm ? "remove" : "add"}
          </span>
          {showAddForm ? "일정 추가 접기" : "새로운 할 일 직접 추가하기"}
        </button>

        {showAddForm && (
          <form
            onSubmit={handleFormSubmit}
            className="mt-3 bg-white p-4 rounded-xl soft-card border border-[#c6c8ba] space-y-3 animate-slide-in"
          >
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#45483d] pl-0.5">할 일 설명</label>
              <input
                type="text"
                placeholder="인증 라이브러리 검토 등..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#45483d] pl-0.5">카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 px-2 bg-gray-50 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none"
                >
                  <option value="업무">업무</option>
                  <option value="미팅">미팅</option>
                  <option value="개인">개인</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#45483d] pl-0.5">시간 설정</label>
                <input
                  type="text"
                  placeholder="14:00-15:30"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#45483d] pl-0.5">AI 비서 메모 (선택 의무제안)</label>
              <input
                type="text"
                placeholder="AI 팁을 미리 설정하려면 적으세요"
                value={newAiMemo}
                onChange={(e) => setNewAiMemo(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-[#455528] text-white font-bold text-xs rounded-lg hover:opacity-90 active:scale-[0.98] transition-transform shadow-sm"
            >
              할 일 생성 완료
            </button>
          </form>
        )}
      </div>

      {/* Main Mode View Container */}
      {viewType === "list" && (
        <section className="space-y-5">
          <div className="flex justify-between items-baseline pt-1">
            <h2 className="font-display font-extrabold text-base text-[#191c1b]">
              오늘 <span className="text-[#5d6d3e] text-lg font-extrabold ml-1 font-sans">{filteredTodos.length}</span>
            </h2>
          </div>

          <div className="space-y-3">
            {filteredTodos.map((task) => (
              <div
                key={task.id}
                className="relative bg-white p-4 rounded-xl soft-card flex items-start gap-3 transition-transform duration-100 hover:scale-[1.005]"
              >
                {task.completed && <div className="active-pill-bar" />}
                
                <div className="mt-0.5 flex-shrink-0">
                  <button
                    onClick={() => toggleTodo(task.id)}
                    disabled={task.failed}
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                      task.completed
                        ? "bg-[#455528] border-[#455528] text-white"
                        : task.failed
                        ? "bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]"
                        : "border-[#c6c8ba] hover:border-[#455528]"
                    }`}
                  >
                    {task.completed ? (
                      <span className="material-symbols-outlined text-[16px] font-bold text-white">check</span>
                    ) : task.failed ? (
                      <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                    ) : null}
                  </button>
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className={`text-sm font-semibold text-[#191c1b] leading-tight ${
                        task.completed ? "line-through opacity-50 font-normal" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span className="font-sans text-[11px] text-[#45483d] font-mono whitespace-nowrap bg-gray-50 px-1.5 py-0.5 rounded">
                      {task.time.split("-")[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                          task.category === "WORK" || task.category === "업무"
                            ? "bg-[#e1e4d9] text-[#62655d]"
                            : task.category === "MEETING" || task.category === "미팅"
                            ? "bg-[#ffdbd1] text-[#7b2e16]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {task.category === "WORK" ? "업무" : task.category === "MEETING" ? "미팅" : task.category}
                      </span>
                      {task.failed && (
                        <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded text-[9px] font-bold">
                          실패
                        </span>
                      )}
                    </div>
                    
                    {/* Delete button option */}
                    <button
                      onClick={() => deleteTodo(task.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="삭제하기"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  {/* AI Memo Container */}
                  {!task.completed && task.aiMemo && (
                    <div className="bg-[#f3f4f2] p-3 rounded-lg flex gap-2 items-start border-l-2 border-[#bbcd96]">
                      <span className="material-symbols-outlined text-[#455528] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                      </span>
                      <p className="text-[11px] font-sans text-[#45483d] leading-relaxed">
                        AI: {task.aiMemo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTodos.length === 0 && (
              <div className="text-center py-12 soft-card p-4 space-y-1.5">
                <span className="material-symbols-outlined text-4xl text-[#c6c8ba]">format_list_bulleted</span>
                <p className="text-xs text-[#45483d] font-bold">표시할 일정이 없습니다.</p>
                <p className="text-[11px] text-[#45483d]/60">위에서 직접 할 일을 추가해 보세요!</p>
              </div>
            )}
          </div>

          {/* Tomorrow Preview Frame */}
          <section className="mt-8 space-y-3">
            <h2 className="font-display font-extrabold text-base text-[#191c1b] opacity-40">
              내일 <span className="text-xs font-normal font-sans bg-gray-200/50 px-2 py-0.5 rounded-md ml-1">2</span>
            </h2>
            <div className="bg-white/40 p-5 rounded-xl border border-dashed border-[#c6c8ba] flex flex-col items-center justify-center text-center gap-1">
              <span className="material-symbols-outlined text-xl text-[#455528]/80 mb-1">rocket_launch</span>
              <p className="text-[11px] font-bold text-[#45483d]">내일 완수할 일들을 메이트들과 공유해보세요.</p>
              <p className="text-[10px] text-[#45483d]/60">오늘의 루틴을 완료하고 내일을 완벽히 스캔해줄 AI 코치 조언이 준비 중입니다.</p>
            </div>
          </section>
        </section>
      )}

      {viewType === "calendar" && (
        <div className="bg-white p-5 rounded-2xl soft-card border border-[#c6c8ba] space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-sm text-charcoal">2026년 6월</h3>
            <div className="flex gap-2">
              <button className="p-1 rounded-full hover:bg-[#f3f4f2]">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-1 rounded-full hover:bg-[#f3f4f2]">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
          {/* Simple Mockup Calendar */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500">
            <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-sans">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 6;
              const hasTasks = day % 3 === 0;
              return (
                <div
                  key={i}
                  className={`py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 relative ${
                    isToday ? "bg-[#455528] text-white font-bold" : "text-charcoal hover:bg-gray-100"
                  }`}
                >
                  <span>{day}</span>
                  {hasTasks && !isToday && (
                    <span className="w-1 h-1 bg-[#455528] rounded-full absolute bottom-1" />
                  )}
                  {isToday && filteredTodos.length > 0 && (
                    <span className="text-[8px] bg-[#d7eab0] text-[#455528] font-bold scale-90 px-1 rounded-sm line-clamp-1">
                      {filteredTodos.length}개
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 italic text-center pt-2">위 달력은 프로토타입 시범 화면으로 일정을 가독성 있게 도식화하고 있습니다.</p>
        </div>
      )}

      {viewType === "kanban" && (
        <div className="grid grid-cols-3 gap-3 overflow-x-auto scroll-hide pb-2 animate-fade-in font-sans">
          {/* TO-DO column */}
          <div className="bg-[#f3f4f2] p-3 rounded-xl min-w-[200px] space-y-3">
            <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-[#455528]">진행 전</span>
              <span className="bg-gray-200/60 text-[#45483d] text-[10px] font-bold px-1.5 py-0.2 rounded">
                {filteredTodos.filter((t) => !t.completed && !t.failed).length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredTodos
                .filter((t) => !t.completed && !t.failed)
                .map((task) => (
                  <div key={task.id} className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 text-xs">
                    <h4 className="font-bold text-[#1a1c18] line-clamp-2">{task.title}</h4>
                    <p className="text-[9px] text-[#45483d] mt-1.5 font-mono">{task.time}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* COMPLETED column */}
          <div className="bg-[#e1e4d9] p-3 rounded-xl min-w-[200px] space-y-3">
            <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded-lg border border-[#bbcd96]/50">
              <span className="text-[11px] font-bold text-[#5c5f57]">완료됨</span>
              <span className="bg-[#455528] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                {filteredTodos.filter((t) => t.completed).length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredTodos
                .filter((t) => t.completed)
                .map((task) => (
                  <div key={task.id} className="bg-white/80 p-2.5 rounded-lg shadow-sm border border-gray-100 text-xs opacity-80">
                    <h4 className="font-normal text-[#45483d] line-through line-clamp-2">{task.title}</h4>
                    <span className="mt-1.5 inline-block text-[8px] bg-gray-100 text-[#45483d] font-bold px-1 rounded">
                      완료
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* MISSED column */}
          <div className="bg-[#ffe0d7] p-3 rounded-xl min-w-[200px] space-y-3">
            <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded-lg border border-[#ffe0d7]">
              <span className="text-[11px] font-bold text-red-700">미완수/지연</span>
              <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                {filteredTodos.filter((t) => t.failed).length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredTodos
                .filter((t) => t.failed)
                .map((task) => (
                  <div key={task.id} className="bg-red-50/50 p-2.5 rounded-lg shadow-sm border border-red-100 text-xs">
                    <h4 className="font-semibold text-gray-500 line-clamp-2">{task.title}</h4>
                    <span className="mt-1.5 inline-block text-[8px] bg-red-100 text-red-700 font-bold px-1 rounded">
                      실패
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
