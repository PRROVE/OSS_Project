import React, { useState } from "react";
import { Plus, List, Calendar as CalendarIcon, ChevronDown, Search, Brain, X, Info, Sparkles, CheckCircle2, AlertCircle, Circle, Timer } from "lucide-react";
import { Task, CategoryType } from "../types";

interface ScreenTasksProps {
  tasks: Task[];
  onAddTask: (title: string, category: string) => void;
  onAddSubTasks: (tasks: Array<{ title: string; duration: string; category: CategoryType }>) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function ScreenTasks({
  tasks,
  onAddTask,
  onAddSubTasks,
  onCompleteTask,
  onDeleteTask
}: ScreenTasksProps) {
  
  const [activeView, setActiveView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Create task state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<CategoryType>("WORK");
  const [useAiBreakdown, setUseAiBreakdown] = useState(true);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Filter tasks with search query
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate tasks
  const todayTasks = filteredTasks.filter(t => !t.createdAt || t.createdAt.split("T")[0] === new Date().toISOString().split("T")[0]);
  const tomorrowTasks = filteredTasks.filter(t => t.createdAt && t.createdAt.split("T")[0] !== new Date().toISOString().split("T")[0]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (useAiBreakdown) {
      setIsAiProcessing(true);
      try {
        const response = await fetch("/api/breakdown", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal: newTaskTitle, category: newTaskCategory })
        });
        const resData = await response.json();
        
        if (resData.success && resData.tasks && resData.tasks.length > 0) {
          onAddSubTasks(resData.tasks);
        } else if (resData.tasks) {
          onAddSubTasks(resData.tasks);
        } else {
          onAddTask(newTaskTitle, newTaskCategory);
        }
      } catch (err) {
        console.error("AI breakdown failed", err);
        // Fallback standard
        onAddTask(newTaskTitle, newTaskCategory);
      } finally {
        setIsAiProcessing(false);
        setShowAddModal(false);
        setNewTaskTitle("");
      }
    } else {
      onAddTask(newTaskTitle, newTaskCategory);
      setShowAddModal(false);
      setNewTaskTitle("");
    }
  };

  return (
    <div id="tasks-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen pb-24 border border-gray-100 shadow-xl rounded-2xl relative">
      
      {/* Top Bar Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex justify-between items-center px-5 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d0ecaf] rounded-lg flex items-center justify-center">
            <span className="text-[#374d20] font-black text-sm">💡</span>
          </div>
          <h1 className="font-bold text-lg tracking-tighter text-[#374d20]">Adaptive AI</h1>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#d0ecaf]/40 active:scale-95 transition-transform cursor-pointer">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBff6rtCZxNealOBm5ETN9ms-t5XkOV5SjUNylfxwly8niz02NKOc-eaSR9Oj8lHmdsY1x0CzSacNcDUFPWftO37-GeKIgX48zXSemzk-9oqajiQolDT0Mkg9BcDHTDQM7W__OE2rXjpwWZ_3dtAyHiyVRRLBFXzuhDJYJJNGv7wEIu0Fdfih2b5SA2_KYcC81HBbePyeG75BKrHd5xEsrroAXozt8_atHB1yn-ekI9lBUzOZ0IRDt7uJgeRJbB4y4dIZ69_-imUwnb"
            alt="User"
          />
        </div>
      </nav>

      {/* Main Container */}
      <main className="px-5 pt-6 flex-1 overflow-y-auto space-y-6">
        
        {/* Title action */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">할 일 관리</h2>
            <p className="text-slate-400 text-xs mt-1">할 일을 추가하고 상태·마감을 관리하세요.</p>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#4e6535] text-white px-4 py-2 rounded-lg flex items-center gap-1.5 active:scale-95 duration-150 transition-all font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>새 할 일</span>
          </button>
        </div>

        {/* View & Filter Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                type="button"
                onClick={() => setActiveView("list")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === "list" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>목록형</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveView("calendar")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === "calendar" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>달력형</span>
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>모두 보기</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="제목 키워드 검색..."
              className="w-full bg-slate-100 border border-transparent rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-[#4e6535]/20 focus:bg-white focus:border-slate-200 text-gray-800 transition-all outline-none"
            />
          </div>
        </div>

        {/* Sorting notice */}
        <div className="flex items-center gap-2 text-slate-500 bg-[#4e6535]/5 p-3 rounded-xl border border-[#4e6535]/10">
          <Sparkles className="w-4 h-4 text-[#4e6535] shrink-0" />
          <span className="text-[10px] font-semibold leading-normal">
            마감 지남·미룬 일·마감 임박 순으로 자동 정렬돼요
          </span>
        </div>

        {/* Calendar View fallback */}
        {activeView === "calendar" ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center animate-fade-in relative min-h-[250px] flex flex-col justify-center items-center">
            <CalendarIcon className="w-12 h-12 text-[#4e6535]/40 mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">인텔리전트 캘린더 뷰</h3>
            <p className="text-xs text-slate-400 leading-normal max-w-[220px] mx-auto">
              현재는 모바일 목록 위주로 최적화되어 있습니다. 목록형에서 15분 마이크로 할 일들을 정주행해 보세요!
            </p>
          </div>
        ) : (
          <div className="task-scroll-area space-y-6">
            
            {/* Group: 오늘 */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <h3 className="font-bold text-gray-900 text-sm">오늘</h3>
                <span className="text-[#4e6535] font-black text-sm">{todayTasks.length}</span>
              </div>

              <div className="space-y-3">
                {todayTasks.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">오늘 처리할 검색 결과가 없습니다.</p>
                ) : (
                  todayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`p-4 rounded-xl flex items-start gap-4 border transition-all ${
                        task.completed 
                          ? "bg-slate-50 border-slate-200 opacity-60" 
                          : task.failed 
                          ? "bg-red-50/40 border-red-150 border-l-4 border-l-red-400" 
                          : "bg-white border-[#4e6535]/10 shadow-sm border-l-4 border-l-[#4e6535]"
                      }`}
                    >
                      <button 
                        type="button" 
                        onClick={() => onCompleteTask(task.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 transition-all ${
                          task.completed 
                            ? "bg-[#4e6535] border-transparent" 
                            : task.failed 
                            ? "bg-red-50 border-red-300"
                            : "border-slate-300 hover:bg-[#4e6535]/5"
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {task.failed && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${task.completed ? "bg-slate-400" : task.failed ? "bg-red-500" : "bg-[#4e6535]"}`}></span>
                          <h4 className={`text-xs font-semibold text-gray-800 truncate ${task.completed ? "line-through text-slate-400" : ""}`}>
                            {task.title}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase">
                            {task.category}
                          </span>
                          {!task.completed && !task.failed && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#d0ecaf] text-[#4e6535]">
                              진행 중
                            </span>
                          )}
                          {!task.completed && task.dueDateStr && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-500">
                              {task.dueDateStr}
                            </span>
                          )}
                        </div>

                        {/* AI Tip widget if present */}
                        {task.aiTip && (
                          <div className="flex items-start gap-1.5 bg-[#4e6535]/5 p-2 rounded-lg border border-[#4e6535]/10 mt-1">
                            <Brain className="w-3.5 h-3.5 text-[#4e6535]" />
                            <p className="text-[10px] text-[#4e6535] leading-tight font-semibold">{task.aiTip}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end justify-between self-stretch">
                        <span className="text-slate-400 text-[10px] font-semibold">
                          {task.timeStr || "시간 미정"}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="text-slate-300 hover:text-red-500 text-[10px] font-semibold mt-2"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Group: 내일 */}
            {tomorrowTasks.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <h3 className="font-bold text-gray-900 text-sm">내일</h3>
                  <span className="text-[#4e6535] font-black text-sm">{tomorrowTasks.length}</span>
                </div>

                <div className="space-y-3">
                  {tomorrowTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="p-4 rounded-xl flex items-start gap-4 border border-[#4e6535]/10 bg-white shadow-sm border-l-4 border-l-[#bdcca7]"
                    >
                      <button 
                        type="button" 
                        onClick={() => onCompleteTask(task.id)}
                        className="w-6 h-6 rounded-md border border-slate-300 flex items-center justify-center mt-0.5 hover:bg-[#4e6535]/5"
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-[#4e6535]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#bdcca7]"></span>
                          <h4 className="text-xs font-semibold text-gray-800 truncate">
                            {task.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase">
                            {task.category}
                          </span>
                        </div>
                      </div>

                      <span className="text-slate-400 text-[10px] font-semibold">
                        {task.timeStr || "시간 미정"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>

      {/* ADDMISSION CREATE MODAL WITH GEMINI SUPPORT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-2xl animate-scale-up space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">새 할 일 만들기</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  태스크 이름 또는 목표
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="예: 마케팅 성과 보고서 쓰기"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-gray-800 placeholder:text-slate-400 focus:outline-[#4e6535]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  카테고리
                </label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as CategoryType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-gray-700 font-semibold"
                >
                  <option value="WORK">WORK (업무)</option>
                  <option value="STUDY">STUDY (학습)</option>
                  <option value="MEETING">MEETING (미팅)</option>
                  <option value="HOBBY">HOBBY (취미)</option>
                  <option value="HEALTH">HEALTH (건강)</option>
                  <option value="PROJECT">PROJECT (프로젝트)</option>
                  <option value="ADMIN">ADMIN (운영)</option>
                  <option value="RESEARCH">RESEARCH (연구 조사)</option>
                </select>
              </div>

              {/* AI BREAKDOWN CHECHBOX */}
              <div className="bg-[#4e6535]/5 p-3 rounded-xl border border-[#4e6535]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#4e6535] shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-[#3D4A2E]">Adaptive AI 쪼개기 활성화</p>
                    <p className="text-[9px] text-[#4e6535]/80 leading-normal">목표를 15분 단위 루틴 3단계로 분해</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={useAiBreakdown}
                    onChange={(e) => setUseAiBreakdown(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4e6535]"></div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isAiProcessing}
                className="w-full bg-[#4e6535] text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-[#3d5029] disabled:opacity-50"
              >
                {isAiProcessing ? (
                  <>
                    <Brain className="w-3.5 h-3.5 animate-spin" />
                    <span>AI가 목표 원자 분석 중...</span>
                  </>
                ) : (
                  <>
                    <span>등록하기</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* Floating navigation bar mock-offset */}
      <div className="h-6"></div>
    </div>
  );
}
