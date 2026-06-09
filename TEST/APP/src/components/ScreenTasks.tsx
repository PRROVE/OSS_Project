import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Bell, Calendar as CalendarIcon, Brain, X, Sparkles,
  AlertCircle, Clock, FileText, Trash2,
  ChevronLeft, ChevronRight, Check, ArrowRight
} from "lucide-react";
import { Task, CategoryType } from "../types";

interface ScreenTasksProps {
  tasks: Task[];
  onAddTask: (title: string, category: string) => void;
  onAddFullTask?: (data: {
    title: string; category: CategoryType; duration?: string;
    dueDateStr?: string; timeStr?: string; aiTip?: string; createdAt?: string;
  }) => void;
  onAddSubTasks: (tasks: Array<{ title: string; duration: string; category: CategoryType }>) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask?: (id: string, fields: Partial<Task>) => void;
}

const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: "WORK", label: "업무" },
  { value: "STUDY", label: "학습" },
  { value: "MEETING", label: "미팅" },
  { value: "HOBBY", label: "취미" },
  { value: "HEALTH", label: "건강" },
  { value: "PROJECT", label: "프로젝트" },
  { value: "ADMIN", label: "운영" },
  { value: "RESEARCH", label: "연구" },
];

const TODAY_STR = new Date().toISOString().split("T")[0];
const TOMORROW_STR = (() => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
})();

function getDeadlineInfo(dueDateStr?: string): { text: string; overdue: boolean; urgent: boolean } | null {
  if (!dueDateStr) return null;
  // YYYY-MM-DD 형식인지 확인
  const parts = dueDateStr.split("-");
  if (parts.length < 3 || parts.some(p => isNaN(Number(p)))) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr + "T00:00:00");
  if (isNaN(due.getTime())) return null;
  const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { text: `D+${Math.abs(diff)}`, overdue: true, urgent: false };
  if (diff === 0) return { text: "D-DAY", overdue: false, urgent: true };
  if (diff <= 3) return { text: `D-${diff}`, overdue: false, urgent: true };
  return { text: `D-${diff}`, overdue: false, urgent: false };
}

function getTaskDate(task: Task): string {
  return task.createdAt ? task.createdAt.split("T")[0] : TODAY_STR;
}

function getSimpleAdvice(task: Task): { tag: string; risk: string; action: string } {
  const dl = getDeadlineInfo(task.dueDateStr);
  if (task.completed) return { tag: "완료", risk: "이번에 통한 방식이 휘발될 위험.", action: "5분, 어떻게 끝냈는지 메모해 다음에 재사용하세요." };
  if (task.failed) return { tag: "미룸", risk: "덩어리가 커서 또 손도 못 댈 위험.", action: "지금 10분, 오늘 낼 최소 버전만 정하고 시작하세요." };
  if (dl?.overdue) return { tag: "마감 지남", risk: `마감이 ${dl.text} 지남 — 완벽 추구가 더 지연시킬 위험.`, action: "지금 20분, 핵심만 채워 최소 버전으로 제출하세요." };
  if (dl?.urgent) return { tag: "마감 임박", risk: `마감 ${dl.text} — 다른 일과 섞이면 못 끝낼 위험.`, action: "다른 탭·알림 닫고, 이 일만 25분 집중하세요." };
  return { tag: "시작 전", risk: "끝이 안 보여서 시작을 미룰 위험.", action: "지금 5분, 완료 기준 한 문장과 첫 행동 하나를 적으세요." };
}

/* ── 날짜 선택 (year / month / day three selects) ── */
function DatePicker({
  value, onChange, clearable = false, accentColor = "olive"
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
  clearable?: boolean;
  accentColor?: "olive" | "terra";
}) {
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  const parse = (s?: string) => {
    if (!s) return { y: todayY, m: todayM, d: todayD };
    const parts = s.split("-").map(Number);
    const y = parts[0] && !isNaN(parts[0]) ? parts[0] : todayY;
    const m = parts[1] && !isNaN(parts[1]) ? parts[1] : todayM;
    const d = parts[2] && !isNaN(parts[2]) ? parts[2] : todayD;
    return { y, m, d };
  };

  const { y, m, d } = parse(value);
  const years = Array.from({ length: 6 }, (_, i) => todayY - 1 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const emit = (ny: number, nm: number, nd: number) => {
    const maxD = new Date(ny, nm, 0).getDate();
    const sd = Math.min(nd, maxD);
    onChange(`${ny}-${String(nm).padStart(2, "0")}-${String(sd).padStart(2, "0")}`);
  };

  const focusBorder = accentColor === "terra" ? "focus:border-[#c4674a]" : "focus:border-[#5a6e38]";
  const sel = `bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg py-2 px-2.5 text-xs font-semibold text-[#1c1c14] outline-none ${focusBorder}`;

  if (!value) {
    return (
      <button
        type="button"
        onClick={() => emit(todayY, todayM, todayD)}
        className="text-xs text-[#9a9a86] font-semibold underline hover:text-[#5a6e38] py-0.5"
      >
        날짜 추가
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <select value={y} onChange={e => emit(+e.target.value, m, d)} className={sel}>
        {years.map(yr => <option key={yr} value={yr}>{yr}년</option>)}
      </select>
      <select value={m} onChange={e => emit(y, +e.target.value, d)} className={sel}>
        {months.map(mo => <option key={mo} value={mo}>{mo}월</option>)}
      </select>
      <select value={d} onChange={e => emit(y, m, +e.target.value)} className={sel}>
        {days.map(dy => <option key={dy} value={dy}>{dy}일</option>)}
      </select>
      {clearable && (
        <button type="button" onClick={() => onChange(undefined)} className="text-[#9a9a86] hover:text-[#c4674a] p-1">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── 시간 선택 (hour / minute two selects) ── */
function TimePicker({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const parse = (s?: string) => {
    if (!s) return { h: 9, min: 0 };
    const [h, min] = s.split(":").map(Number);
    return { h, min };
  };
  const { h, min } = parse(value);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const emit = (nh: number, nm: number) =>
    onChange(`${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`);

  const sel = "bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg py-2 px-2.5 text-xs font-semibold text-[#1c1c14] outline-none focus:border-[#5a6e38]";

  if (!value) {
    return (
      <button type="button" onClick={() => emit(9, 0)}
        className="text-xs text-[#9a9a86] font-semibold underline hover:text-[#5a6e38] py-0.5">
        시간 추가
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <select value={h} onChange={e => emit(+e.target.value, min)} className={sel}>
        {hours.map(hr => <option key={hr} value={hr}>{String(hr).padStart(2, "0")}시</option>)}
      </select>
      <select value={min} onChange={e => emit(h, +e.target.value)} className={sel}>
        {minutes.map(mn => <option key={mn} value={mn}>{String(mn).padStart(2, "0")}분</option>)}
      </select>
      <button type="button" onClick={() => onChange(undefined)} className="text-[#9a9a86] hover:text-[#c4674a] p-1">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ScreenTasks({
  tasks, onAddTask, onAddFullTask, onAddSubTasks,
  onCompleteTask, onDeleteTask, onUpdateTask
}: ScreenTasksProps) {

  const [activeView, setActiveView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<"all" | "work" | "personal">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [calView, setCalView] = useState<{ year: number; month: number }>(() => {
    const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedCalDate, setSelectedCalDate] = useState<string>(TODAY_STR);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<CategoryType>("WORK");
  const [newDate, setNewDate] = useState(TODAY_STR);
  const [newDeadline, setNewDeadline] = useState<string | undefined>(undefined);
  const [newTimeStr, setNewTimeStr] = useState<string | undefined>("09:00");
  const [newDuration] = useState("15분");
  const [newDescription, setNewDescription] = useState("");
  const [useAiBreakdown, setUseAiBreakdown] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  /* ── 수정 패널 드래그 dismiss ── */
  const panelRef = useRef<HTMLElement>(null);
  const dragStartY = useRef(0);
  const dragDeltaY = useRef(0);
  const dragging = useRef(false);

  const onSheetPointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    dragDeltaY.current = 0;
    dragging.current = true;
    if (panelRef.current) panelRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onSheetPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = Math.max(0, e.clientY - dragStartY.current);
    dragDeltaY.current = delta;
    if (delta > 4 && panelRef.current) {
      panelRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const onSheetPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const panel = panelRef.current;
    if (!panel) return;
    if (dragDeltaY.current > 120) {
      panel.style.transition = "transform 0.25s ease";
      panel.style.transform = "translateY(110%)";
      setTimeout(() => {
        setSelectedTaskId(null);
        setConfirmingDelete(false);
        dragDeltaY.current = 0;
      }, 250);
    } else {
      panel.style.transition = "transform 0.25s ease";
      panel.style.transform = "";
      dragDeltaY.current = 0;
    }
  };

  /* ── 모달 열릴 때 배경 스크롤 잠금 ── */
  const anyModalOpen = !!selectedTaskId || showAddModal || isDayModalOpen;
  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [anyModalOpen]);

  const WORK_CATS: CategoryType[] = ["WORK", "MEETING", "PROJECT", "RESEARCH"];

  const filteredTasks = tasks.filter(t => {
    if (filter === "work" && !WORK_CATS.includes(t.category)) return false;
    if (filter === "personal" && WORK_CATS.includes(t.category)) return false;
    return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const urgencyScore = (t: Task): number => {
    if (t.completed) return 100;
    if (t.failed) return 1;
    const dl = getDeadlineInfo(t.dueDateStr);
    if (dl?.overdue) return 0;
    if (dl?.urgent) return 2;
    return 5;
  };
  const adaptive = (arr: Task[]) => [...arr].sort((a, b) => urgencyScore(a) - urgencyScore(b));

  const todayTasks = adaptive(filteredTasks.filter(t => getTaskDate(t) === TODAY_STR));
  const tomorrowTasks = adaptive(filteredTasks.filter(t => getTaskDate(t) === TOMORROW_STR));
  const otherTasks = adaptive(filteredTasks.filter(t => getTaskDate(t) !== TODAY_STR && getTaskDate(t) !== TOMORROW_STR));

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (useAiBreakdown) {
      setIsAiProcessing(true);
      try {
        const res = await fetch("/api/breakdown", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal: newTitle, category: newCategory })
        });
        const data = await res.json();
        if (data.tasks?.length > 0) onAddSubTasks(data.tasks);
        else onAddTask(newTitle, newCategory);
      } catch {
        onAddTask(newTitle, newCategory);
      } finally {
        setIsAiProcessing(false);
      }
    } else if (onAddFullTask) {
      onAddFullTask({
        title: newTitle.trim(),
        category: newCategory,
        duration: newDuration,
        dueDateStr: newDeadline,
        timeStr: newTimeStr,
        aiTip: newDescription.trim() || undefined,
        createdAt: new Date(newDate + "T00:00:00").toISOString()
      });
    } else {
      onAddTask(newTitle, newCategory);
    }

    setShowAddModal(false);
    setNewTitle(""); setNewDescription("");
    setNewDeadline(undefined); setNewTimeStr("09:00");
  };

  const handleDeleteCurrent = () => {
    if (!selectedTask) return;
    onDeleteTask(selectedTask.id);
    setSelectedTaskId(null);
    setConfirmingDelete(false);
  };

  const renderStatusBadge = (task: Task) => {
    if (task.failed) return <span className="px-1.5 py-0.5 bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] text-[10px] font-bold rounded shrink-0">미룸</span>;
    if (task.completed) return <span className="px-1.5 py-0.5 bg-[#ecf0e4] border border-[#c8d4a8] text-[#2d7a3a] text-[10px] font-bold rounded shrink-0">완료</span>;
    return null;
  };

  const renderDeadlineBadge = (task: Task) => {
    const info = getDeadlineInfo(task.dueDateStr);
    if (!info) return null;
    return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
        info.overdue ? "bg-[#c4674a] text-white border-[#c4674a]"
        : info.urgent ? "bg-[#f8ede8] text-[#c4674a] border-[#e8c0b0]"
        : "bg-[#f7f6f2] text-[#6b6b58] border-[#e0ddd8]"
      }`}>{info.text}</span>
    );
  };

  const goMonth = (delta: number) => setCalView(v => {
    const m = v.month + delta;
    if (m < 0) return { year: v.year - 1, month: 11 };
    if (m > 11) return { year: v.year + 1, month: 0 };
    return { year: v.year, month: m };
  });

  const TaskRow: React.FC<{ task: Task }> = ({ task }) => {
    const isSelected = selectedTaskId === task.id;
    return (
      <div
        onClick={() => { setSelectedTaskId(prev => prev === task.id ? null : task.id); setConfirmingDelete(false); }}
        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all border ${
          isSelected ? "border-[#5a6e38] bg-[#5a6e38]/5 shadow-sm"
          : task.failed ? "border-[#e8c0b0] bg-[#f8ede8]/20"
          : "border-[#e0ddd8] bg-white hover:bg-[#edecea] shadow-sm"
        }`}
      >
        {/* 완료 체크버튼 */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onCompleteTask(task.id); }}
          className={`w-[22px] h-[22px] rounded border flex items-center justify-center shrink-0 transition-colors ${
            task.completed ? "bg-[#2d7a3a] border-[#2d7a3a] text-white"
            : task.failed ? "bg-[#f8ede8] border-[#c4674a]"
            : "border-[#e0ddd8] hover:border-[#5a6e38] bg-white"
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          {task.failed && !task.completed && <span className="text-[10px] font-bold text-[#c4674a]">✕</span>}
        </button>

        {/* 제목 + 배지 */}
        <div className="flex-grow min-w-0 overflow-hidden">
          <p className={`text-xs font-semibold truncate ${task.completed ? "line-through text-[#9a9a86]" : task.failed ? "line-through text-[#6b6b58]" : "text-[#1c1c14]"}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="px-1.5 py-0.5 bg-[#f7f6f2] text-[#6b6b58] rounded text-[10px] font-bold uppercase shrink-0">{task.category}</span>
            {renderStatusBadge(task)}
            {renderDeadlineBadge(task)}
          </div>
        </div>

        {/* 시간 */}
        {task.timeStr && (
          <span className="text-[10px] text-[#9a9a86] font-semibold font-mono shrink-0">{task.timeStr}</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#f7f6f2] flex flex-col min-h-screen pb-24 relative">

      {/* ── 헤더 (Analytics/AICoach/Community 통일 스타일) ── */}
      <header className="sticky top-0 z-50 bg-[#f7f6f2] border-b border-[#e0ddd8] px-5 pt-5 pb-0">
        {/* 제목 행 */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-[#1c1c14] tracking-tight">할 일</h1>
            <p className="text-[12px] text-[#9a9a86] mt-0.5">할 일을 추가하고 상태·마감을 관리하세요.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-9 h-9 bg-[#5a6e38] text-white rounded-xl flex items-center justify-center hover:bg-[#4a5c2e] transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#edecea] transition-colors">
              <Bell className="w-5 h-5 text-[#6b6b58]" />
            </button>
          </div>
        </div>

        {/* 탭 바 (Analytics 스타일 언더라인) */}
        <div className="flex items-center gap-5 overflow-x-auto hide-scrollbar border-b border-[#e0ddd8]">
          {[
            { v: "list" as const, label: "목록형" },
            { v: "calendar" as const, label: "달력형" },
          ].map(item => (
            <button
              key={item.v}
              type="button"
              onClick={() => setActiveView(item.v)}
              className={`pb-2.5 border-b-2 text-[12px] font-bold tracking-wide transition-all whitespace-nowrap -mb-px ${
                activeView === item.v
                  ? "border-[#5a6e38] text-[#1c1c14]"
                  : "border-transparent text-[#9a9a86] hover:text-[#1c1c14]"
              }`}
            >{item.label}</button>
          ))}
          <div className="ml-auto flex gap-1.5 pb-2 shrink-0">
            {(["all", "work", "personal"] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                  filter === f ? "border-[#5a6e38] text-[#5a6e38] bg-[#ecf0e4]" : "border-[#e0ddd8] text-[#9a9a86] bg-white"
                }`}
              >
                {f === "all" ? "모두" : f === "work" ? "업무" : "개인"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-5">

        <div className="flex items-center gap-1.5 text-[11px] text-[#5a6e38] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          마감 지남·미룬 일·마감 임박 순으로 자동 정렬돼요
        </div>

        {/* 목록형 */}
        {activeView === "list" && (
          <div className="space-y-5">
            {[
              { label: "오늘", items: todayTasks, empty: "오늘 할 일이 없습니다." },
              { label: "내일", items: tomorrowTasks, empty: "내일 예정된 일이 없습니다." },
            ].map(group => (
              <section key={group.label}>
                <h3 className="text-sm font-bold text-[#1c1c14] mb-2.5 flex items-center gap-2">
                  {group.label} <span className="text-[#9a9a86] font-normal text-xs">{group.items.length}</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {group.items.length === 0
                    ? <div className="py-5 text-center text-xs text-[#9a9a86] border border-dashed border-[#e0ddd8] rounded-xl">{group.empty}</div>
                    : group.items.map(t => <TaskRow key={t.id} task={t} />)
                  }
                </div>
              </section>
            ))}

            {otherTasks.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-[#1c1c14] mb-2.5 flex items-center gap-2">
                  이번 주 <span className="text-[#9a9a86] font-normal text-xs">{otherTasks.length}</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {otherTasks.map(t => <TaskRow key={t.id} task={t} />)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 달력형 */}
        {activeView === "calendar" && (() => {
          const { year, month } = calView;
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const pad = (n: number) => String(n).padStart(2, "0");
          const toDs = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;

          const tasksByDate: Record<string, Task[]> = {};
          filteredTasks.forEach(t => {
            const ds = getTaskDate(t);
            (tasksByDate[ds] ||= []).push(t);
          });

          const cells: (number | null)[] = [
            ...Array.from({ length: firstDay }, () => null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
          ];

          const dotColor = (t: Task) => t.completed ? "#2d7a3a" : t.failed ? "#c4674a" : "#5a6e38";
          const selDayTasks = tasksByDate[selectedCalDate] || [];
          const selDate = new Date(selectedCalDate + "T00:00:00");
          const weekdayKor = ["일", "월", "화", "수", "목", "금", "토"];

          return (
            <div className="space-y-4">
              <div className="bg-white border border-[#e0ddd8] rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0ddd8]">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => goMonth(-1)} className="p-1 rounded-md text-[#9a9a86] hover:bg-[#edecea]">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-[#1c1c14] min-w-[80px] text-center">{year}년 {month + 1}월</span>
                    <button type="button" onClick={() => goMonth(1)} className="p-1 rounded-md text-[#9a9a86] hover:bg-[#edecea]">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[11px] text-[#9a9a86]">총 {filteredTasks.length}개</span>
                </div>

                <div className="grid grid-cols-7 text-[10px] font-bold text-[#9a9a86] mt-3 text-center uppercase">
                  {["S","M","T","W","T","F","S"].map((d, i) => <span key={i}>{d}</span>)}
                </div>

                <div className="grid grid-cols-7 gap-1 mt-2">
                  {cells.map((dayNum, i) => {
                    if (dayNum === null) return <div key={`e${i}`} />;
                    const ds = toDs(dayNum);
                    const dayTasks = tasksByDate[ds] || [];
                    const isToday = ds === TODAY_STR;
                    return (
                      <button
                        key={ds}
                        type="button"
                        onClick={() => { setSelectedCalDate(ds); setIsDayModalOpen(true); }}
                        className={`aspect-square p-1.5 border rounded-lg flex flex-col justify-between transition-all ${
                          isToday ? "border-[#5a6e38] bg-[#5a6e38]/5" : "border-[#e0ddd8] hover:bg-[#edecea]"
                        }`}
                      >
                        <span className={`text-[11px] font-semibold leading-none ${isToday ? "text-[#5a6e38]" : "text-[#6b6b58]"}`}>{dayNum}</span>
                        <div className="flex flex-wrap gap-0.5">
                          {dayTasks.slice(0, 3).map(t => (
                            <span key={t.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor(t) }} />
                          ))}
                          {dayTasks.length > 3 && <span className="text-[9px] text-[#9a9a86]">+{dayTasks.length - 3}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#9a9a86] text-center mt-3">날짜를 클릭하면 해당 날의 일정이 표시됩니다.</p>
              </div>

              {/* 날짜 일정 모달 */}
              {isDayModalOpen && (
                <div className="fixed sm:absolute inset-0 bg-black/30 flex items-end justify-center z-50">
                  <div className="bg-white rounded-t-2xl w-full border-t border-[#e0ddd8] shadow-xl flex flex-col" style={{ maxHeight: "65dvh" }}>
                    <div className="px-5 pt-4 pb-3 border-b border-[#e0ddd8] flex items-center justify-between shrink-0">
                      <div>
                        <h3 className="text-sm font-bold text-[#1c1c14]">
                          {month + 1}월 {selDate.getDate()}일
                          <span className="text-xs font-normal text-[#9a9a86] ml-1">({weekdayKor[selDate.getDay()]}요일)</span>
                        </h3>
                        <p className="text-[11px] text-[#9a9a86] mt-0.5">등록된 일정 {selDayTasks.length}개</p>
                      </div>
                      <button type="button" onClick={() => setIsDayModalOpen(false)} className="p-2 hover:bg-[#edecea] rounded-lg">
                        <X className="w-4 h-4 text-[#9a9a86]" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                      {selDayTasks.length === 0
                        ? <div className="py-10 text-center text-xs text-[#9a9a86] border border-dashed border-[#e0ddd8] rounded-xl">이 날에 등록된 할 일이 없습니다.</div>
                        : selDayTasks.map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => { setSelectedTaskId(t.id); setIsDayModalOpen(false); }}
                            className="flex flex-col gap-1 p-3 rounded-xl border border-[#e0ddd8] bg-white hover:bg-[#edecea] text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor(t) }} />
                              <span className={`text-xs font-semibold flex-grow truncate ${t.completed || t.failed ? "line-through text-[#9a9a86]" : "text-[#1c1c14]"}`}>{t.title}</span>
                              {t.timeStr && <span className="text-[10px] text-[#9a9a86] font-mono">{t.timeStr}</span>}
                            </div>
                            <div className="flex items-center gap-1.5 pl-4">
                              <span className="px-1.5 py-0.5 bg-[#f7f6f2] text-[#6b6b58] rounded text-[10px] font-bold uppercase">{t.category}</span>
                            </div>
                          </button>
                        ))
                      }
                    </div>

                    <div className="shrink-0 px-4 py-3 border-t border-[#e0ddd8]">
                      <button type="button" onClick={() => setIsDayModalOpen(false)} className="w-full py-2.5 bg-[#1c1c14] text-white rounded-xl text-xs font-bold">닫기</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </main>

      {/* ── 수정 패널 ── */}
      {selectedTask && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed sm:absolute inset-0 bg-black/30 z-40"
            onClick={() => { setSelectedTaskId(null); setConfirmingDelete(false); }}
          />

          {/* 패널 본체 — 하단 시트 */}
          <aside
            ref={panelRef}
            className="fixed sm:absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0ddd8] rounded-t-2xl shadow-xl flex flex-col"
            style={{ maxHeight: "88dvh" }}
          >
            {/* 드래그 핸들 + 헤더 — 이 영역에서 드래그 시작 */}
            <div
              className="shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={onSheetPointerDown}
              onPointerMove={onSheetPointerMove}
              onPointerUp={onSheetPointerUp}
              onPointerCancel={onSheetPointerUp}
            >
              {/* 핸들 바 */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-[#d0cdc8] rounded-full" />
              </div>

              {/* 헤더 */}
              <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#e0ddd8]">
                <h3 className="text-sm font-bold text-[#1c1c14]">수정</h3>
                <div className="flex items-center gap-1.5" onPointerDown={e => e.stopPropagation()}>
                  {confirmingDelete ? (
                    <>
                      <span className="text-[11px] font-bold text-[#c4674a]">삭제할까요?</span>
                      <button onClick={handleDeleteCurrent} className="px-2.5 py-1.5 bg-[#c4674a] text-white rounded-lg text-[11px] font-bold">삭제</button>
                      <button onClick={() => setConfirmingDelete(false)} className="px-2.5 py-1.5 bg-[#f7f6f2] text-[#6b6b58] rounded-lg text-[11px] font-bold">취소</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmingDelete(true)} className="p-1.5 text-[#9a9a86] hover:text-[#c4674a] hover:bg-[#f8ede8] rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { setSelectedTaskId(null); setConfirmingDelete(false); }} className="p-1.5 text-[#9a9a86] hover:bg-[#edecea] rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

              {/* 스크롤 가능한 본문 */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

                {/* 제목 */}
                <textarea
                  rows={2}
                  value={selectedTask.title}
                  onChange={(e) => onUpdateTask?.(selectedTask.id, { title: e.target.value })}
                  className="w-full bg-transparent border-none p-0 text-base font-bold text-[#1c1c14] resize-none focus:ring-0 focus:outline-none leading-snug"
                  placeholder="일정 제목..."
                />

                {/* 카테고리 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">카테고리</p>
                  <select
                    value={selectedTask.category}
                    onChange={(e) => onUpdateTask?.(selectedTask.id, { category: e.target.value as CategoryType })}
                    className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg px-3 py-2 text-xs font-semibold text-[#1c1c14] outline-none focus:border-[#5a6e38]"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label} ({c.value})</option>)}
                  </select>
                </div>

                {/* 작업 상태 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">작업 상태</p>
                  <div className="flex bg-[#f7f6f2] p-1 rounded-lg border border-[#e0ddd8]">
                    {[
                      { key: "pending", label: "진행 전" },
                      { key: "inprogress", label: "진행 중" },
                      { key: "done", label: "완료" },
                    ].map(s => {
                      const isActive = s.key === "done"
                        ? selectedTask.completed
                        : s.key === "pending" && !selectedTask.completed && !selectedTask.failed;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => {
                            if (s.key === "done") onCompleteTask(selectedTask.id);
                            else if (s.key === "pending") onUpdateTask?.(selectedTask.id, { completed: false, failed: false });
                          }}
                          className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                            isActive
                              ? s.key === "done" ? "bg-[#2d7a3a] text-white shadow-sm" : "bg-white text-[#1c1c14] shadow-sm"
                              : "text-[#6b6b58]"
                          }`}
                        >{s.label}</button>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-[#e0ddd8]" />

                {/* 날짜·시간 필드 */}
                <div className="flex flex-col gap-4">
                  {/* 예정일 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ecf0e4] border border-[#c8d4a8] flex items-center justify-center shrink-0 mt-0.5">
                      <CalendarIcon className="w-4 h-4 text-[#5a6e38]" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider mb-1.5">예정일</p>
                      <DatePicker
                        value={getTaskDate(selectedTask)}
                        onChange={(v) => onUpdateTask?.(selectedTask.id, {
                          createdAt: v ? new Date(v + "T00:00:00").toISOString() : selectedTask.createdAt
                        })}
                        accentColor="olive"
                      />
                    </div>
                  </div>

                  {/* 마감일 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f8ede8] border border-[#e8c0b0] flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 text-[#c4674a]" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-[10px] font-bold text-[#c4674a] uppercase tracking-wider">마감일</p>
                        {renderDeadlineBadge(selectedTask)}
                      </div>
                      <DatePicker
                        value={selectedTask.dueDateStr}
                        onChange={(v) => onUpdateTask?.(selectedTask.id, { dueDateStr: v })}
                        clearable
                        accentColor="terra"
                      />
                    </div>
                  </div>

                  {/* 시작 시간 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f7f6f2] border border-[#e0ddd8] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-[#9a9a86]" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider mb-1.5">시작 시간</p>
                      <TimePicker
                        value={selectedTask.timeStr}
                        onChange={(v) => onUpdateTask?.(selectedTask.id, { timeStr: v })}
                      />
                    </div>
                  </div>

                </div>

                <hr className="border-[#e0ddd8]" />

                {/* 설명 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />설명
                  </label>
                  <textarea
                    rows={3}
                    value={selectedTask.aiTip || ""}
                    onChange={(e) => onUpdateTask?.(selectedTask.id, { aiTip: e.target.value })}
                    placeholder="세부 요구사항 및 업무 계획을 입력하세요..."
                    className="w-full p-3 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl text-xs text-[#1c1c14] focus:bg-white focus:outline-none resize-none leading-relaxed focus:border-[#5a6e38]"
                  />
                </div>

                {/* AI 조언 */}
                {(() => {
                  const advice = getSimpleAdvice(selectedTask);
                  return (
                    <div className="bg-[#f7f6f2] rounded-xl border border-[#e0ddd8] p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#c4674a]" />
                          <span className="text-xs font-bold text-[#1c1c14]">AI 코치</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#5a6e38] bg-[#ecf0e4] border border-[#c8d4a8] px-1.5 py-0.5 rounded">{advice.tag}</span>
                      </div>
                      <div className="flex items-start gap-1.5 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-[#c4674a] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#6b6b58] leading-relaxed">{advice.risk}</p>
                      </div>
                      <div className="flex items-start gap-2 bg-white border border-[#c8d4a8] rounded-lg px-2.5 py-2">
                        <ArrowRight className="w-3.5 h-3.5 text-[#5a6e38] shrink-0 mt-0.5" />
                        <p className="text-[11px] font-semibold text-[#1c1c14] leading-snug">{advice.action}</p>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* 하단 고정 버튼 영역 */}
              <div className="shrink-0 border-t border-[#e0ddd8] bg-white px-5 py-4 space-y-2.5">
                <p className="text-[10px] text-[#9a9a86] text-center flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-[#2d7a3a]" />변경 사항은 자동으로 저장됩니다
                </p>
                {!selectedTask.completed && (
                  <button
                    type="button"
                    onClick={() => onUpdateTask?.(selectedTask.id, { failed: !selectedTask.failed })}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-colors ${
                      selectedTask.failed
                        ? "bg-[#f7f6f2] border-[#e0ddd8] text-[#6b6b58]"
                        : "bg-[#f8ede8] border-[#e8c0b0] text-[#c4674a]"
                    }`}
                  >
                    {selectedTask.failed ? "실패 취소 및 재도전" : "실패로 표시"}
                  </button>
                )}
              </div>

          </aside>
        </>
      )}

      {/* ── 새 할 일 모달 ── */}
      {showAddModal && (
        <>
          <div className="fixed sm:absolute inset-0 bg-black/30 z-40" onClick={() => setShowAddModal(false)} />
          <div
            className="fixed sm:absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl border-t border-[#e0ddd8] shadow-xl flex flex-col"
            style={{ maxHeight: "90dvh" }}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-[#e0ddd8] rounded-full" />
            </div>

            <div className="px-5 pt-2 pb-3 border-b border-[#e0ddd8] flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-[#1c1c14]">새 할 일 추가</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[#edecea] rounded-lg">
                <X className="w-4 h-4 text-[#9a9a86]" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {/* 제목 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">할 일 제목 *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 클라이언트 검토 자료 준비"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e0ddd8] text-sm font-semibold focus:outline-none focus:border-[#5a6e38]"
                />
              </div>

              {/* 카테고리 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                  className="w-full bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#5a6e38]"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* 예정일 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" />예정일
                </label>
                <DatePicker value={newDate} onChange={(v) => setNewDate(v || TODAY_STR)} accentColor="olive" />
              </div>

              {/* 마감일 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#c4674a] uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />마감일 (선택)
                </label>
                <DatePicker value={newDeadline} onChange={(v) => setNewDeadline(v)} clearable accentColor="terra" />
              </div>

              {/* 시작 시간 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />시작 시간 (선택)
                </label>
                <TimePicker value={newTimeStr} onChange={(v) => setNewTimeStr(v)} />
              </div>

              {/* 세부 내용 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />세부 내용 (선택)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="추가 설명 및 가이드를 기입하세요..."
                  rows={3}
                  className="w-full bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none resize-none focus:border-[#5a6e38]"
                />
              </div>

              {/* AI 쪼개기 토글 */}
              <div className="bg-[#ecf0e4] p-3.5 rounded-xl border border-[#c8d4a8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-[#5a6e38] shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-[#1c1c14]">To Do IT 쪼개기</p>
                    <p className="text-[9px] text-[#5a6e38]">목표를 15분 단위 루틴으로 분해</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseAiBreakdown(!useAiBreakdown)}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${useAiBreakdown ? "bg-[#5a6e38]" : "bg-[#e0ddd8]"}`}
                >
                  <span className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform ${useAiBreakdown ? "translate-x-4" : ""}`} />
                </button>
              </div>

              <button
                type="submit"
                disabled={isAiProcessing || !newTitle.trim()}
                className="w-full bg-[#5a6e38] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#4a5c2e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAiProcessing ? (
                  <><Brain className="w-4 h-4 animate-spin" />AI가 목표 분석 중...</>
                ) : "저장"}
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
