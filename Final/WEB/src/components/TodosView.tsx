/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, Priority, Category, TaskStatus } from '../types.ts';
import { TODAY_STR, TOMORROW_STR, getDeadlineInfo } from '../data.ts';
import { CustomSelect } from './CustomSelect.tsx';
import { 
  Plus, 
  Search, 
  ListTodo, 
  Calendar,
  AlertCircle,
  X, 
  Clock, 
  User, 
  BookOpen, 
  FileText, 
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Brain,
  Sparkles,
  Target,
  ArrowRight,
  Trash2,
  Lock,
  Heart
} from 'lucide-react';

// 우선순위 / 카테고리 공통 옵션
const PRIORITY_OPTIONS = [
  { value: 'high',   label: '높음', dotColor: '#c4674a' },
  { value: 'medium', label: '중간', dotColor: '#d4895a' },
  { value: 'low',    label: '낮음', dotColor: '#9a9a86' },
];
const CATEGORY_OPTIONS = [
  { value: 'Work',     label: '업무' },
  { value: 'Study',    label: '학업' },
  { value: 'Personal', label: '개인' },
  { value: 'Team',     label: '팀플' },
  { value: 'Meeting',  label: '미팅' },
  { value: 'Research', label: '연구' },
  { value: 'Admin',    label: '지원' },
  { value: 'Project',  label: '프로젝트' },
  { value: 'Other',    label: '기타' },
];

// timeStart에서 n시간 앞당긴 시각 문자열 ("16:30" → 1시간 → "15:30")
function shiftTimeEarlier(t?: string, hoursEarlier = 1): string | null {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  let nh = h - hoursEarlier;
  if (nh < 0) nh += 24;
  return `${String(nh).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * 적응형 AI 코치 — 비서가 아니라 실행 파트너.
 * 할 일의 상태·예정일·마감·소요시간·패턴을 읽어 항상 3단으로 답한다.
 *  risk(현재 위험): 완료를 막을 가장 큰 문제 한 문장
 *  strategy(성공 전략): 범위/우선순위/시간배분 중 가장 필요한 전략
 *  action(다음 행동): 지금 10~30분 안에 할 수 있는 행동 하나
 * 일반 격려·추상적 조언 금지. 데이터 기반 실행 설계만.
 */
function getCoachAdvice(task: Task, allTasks: Task[]): { tag: string; risk: string; strategy: string; action: string } {
  const dl = getDeadlineInfo(task.deadline);
  const hourMatch = task.duration?.match(/(\d+)\s*시간/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;

  // 사용자 패턴 분석
  const catLabel = CATEGORY_OPTIONS.find(o => o.value === task.category)?.label ?? task.category;
  const catTasks = allTasks.filter(t => t.category === task.category);
  const catFailed = catTasks.filter(t => t.failed).length;
  const failedTotal = allTasks.filter(t => t.failed).length;
  const failedWithTime = allTasks.filter(t => t.failed && t.timeStart).length;
  const earlier = shiftTimeEarlier(task.timeStart);

  // 1) 완료
  if (task.status === 'done') {
    return {
      tag: '완료',
      risk: '여기서 멈추면 이번에 통한 방식이 그냥 휘발됩니다.',
      strategy: '성공한 순서를 기록해 다음 같은 일에 그대로 재사용하세요.',
      action: '지금 5분, 어떤 순서로 끝냈는지 설명란에 한 줄 적으세요.',
    };
  }

  // 2) 예정 시간 못 지키고 실패
  if (task.failed && earlier) {
    return {
      tag: '시간 관리',
      risk: `${task.timeStart} 시작 예정을 못 지켜, 시작이 또 늦으면 통째로 밀립니다.`,
      strategy: `시작 시각을 1시간 앞당겨 ${earlier}로 고정하세요.`,
      action: `${earlier}에 알람을 맞추고, 그 시각에 5분만 파일을 여세요.`,
    };
  }

  // 3) 시간 정보 없이 실패 → 범위 과다
  if (task.failed) {
    return {
      tag: '범위 과다',
      risk: failedTotal > 1 ? `비슷하게 ${failedTotal}번 놓친 패턴 — 범위가 커서 또 손도 못 댈 위험.` : '덩어리가 커서 시작이 부담돼 또 미뤄질 위험.',
      strategy: '목표를 30%로 줄이고, 나머지는 다른 날 할 일로 분리하세요.',
      action: '지금 10분, 오늘 낼 최소 버전이 무엇인지 한 줄로 정하세요.',
    };
  }

  // 4) 아직 안 함 + 예정 시간 못 지키는 패턴
  if (earlier && failedWithTime >= 2) {
    return {
      tag: '시간 관리',
      risk: `예정 시간을 ${failedWithTime}번 놓친 패턴 — 이번에도 제때 시작 못 할 위험.`,
      strategy: `시작 시각을 계획(${task.timeStart})보다 1시간 이른 ${earlier}로 잡으세요.`,
      action: `${earlier}로 시작을 옮기고, 10분 전 자료만 미리 열어두세요.`,
    };
  }

  // 5) 이 분야 반복해서 놓침
  if (catFailed >= 2) {
    return {
      tag: '반복 미룸',
      risk: `'${catLabel}'를 ${catFailed}번 놓친 흐름 — 마감까지 미루다 또 넘길 위험.`,
      strategy: '마감을 기다리지 말고 받은 날(오늘) 첫 부분에 바로 손대세요.',
      action: '지금 10분, 이 일에서 가장 작은 한 조각만 끝내세요.',
    };
  }

  // 6) 마감 지남
  if (dl?.overdue) {
    return {
      tag: '마감 지남',
      risk: `마감이 ${dl.text} 지남 — 완벽하게 하려다 더 늦어질 위험.`,
      strategy: '완성도를 낮춰 "제출 가능한 최소 버전"부터 마무리하세요.',
      action: '지금 20분, 빠진 곳은 비우고 핵심만 채워 1차로 제출하세요.',
    };
  }

  // 7) 마감 임박
  if (dl && (dl.text === 'D-DAY' || dl.urgent)) {
    return {
      tag: '마감 임박',
      risk: `마감 ${dl.text} — 다른 일과 섞이면 시간 안에 못 끝낼 위험.`,
      strategy: earlier ? `시작을 1시간 당겨 ${earlier}로 버퍼를 확보하세요.` : '다른 일과 알림을 닫고 이 일에만 집중하세요.',
      action: earlier ? `${earlier}에 시작해, 끝낼 때까지 이 일만 붙잡으세요.` : '지금 25분, 다른 탭·알림 닫고 이 일만 처리하세요.',
    };
  }

  // 8) 진행 중
  if (task.status === 'inprogress') {
    return {
      tag: '진행 중',
      risk: '멈춘 지점이 흐릿해, 다시 켤 때 헤매며 시간 버릴 위험.',
      strategy: '멈추기 전 "다음에 할 정확한 행동"을 명확히 남겨두세요.',
      action: '지금 2분, 이어서 할 행동 한 문장을 설명란에 적으세요.',
    };
  }

  // 9) 큰 작업
  if (hours >= 2) {
    return {
      tag: '큰 작업',
      risk: `${task.duration}를 한 번에 하려다 부담에 눌려 미뤄질 위험.`,
      strategy: '25분 작업 + 5분 휴식으로 토막 내 진행하세요.',
      action: '지금, 첫 25분에 끝낼 한 부분만 정하고 타이머를 켜세요.',
    };
  }

  // 10) 중요
  if (task.priority === 'high') {
    return {
      tag: '중요',
      risk: '중요한 일이 밀리면 뒤의 다른 일정까지 흔들릴 위험.',
      strategy: earlier ? `예정보다 1시간 이른 ${earlier}에 시작해 여유를 만드세요.` : '할 일을 바로 실행 가능한 행동으로 다시 적으세요.',
      action: earlier ? `${earlier}에 착수 — 완성 말고 "10분 시작"이 목표예요.` : '지금 10분, 첫 행동 하나만 정해 바로 시작하세요.',
    };
  }

  // 기본 → 끝 정의
  return {
    tag: '시작 전',
    risk: '끝이 안 보여서 시작을 미룰 위험.',
    strategy: '"무엇이 되면 끝"인지 완료 기준을 먼저 한 줄로 정하세요.',
    action: '지금 5분, 완료 기준 한 문장과 첫 행동 하나를 적으세요.',
  };
}

// CustomSelect는 ./CustomSelect 공용 컴포넌트로 분리됨

interface TodosViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onSetStatus: (id: string, status: TaskStatus) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'status'>) => void;
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  highlightedTaskId?: string | null;
  externalSearch?: string;
}

type ViewMode = 'list' | 'calendar';
type CategoryFilter = 'all' | 'work' | 'personal';

export default function TodosView({
  tasks,
  onToggleTask,
  onSetStatus,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  highlightedTaskId,
  externalSearch
}: TodosViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('default_view') as ViewMode) || 'list');
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // 상단바 전역 검색과 동기화
  React.useEffect(() => {
    if (externalSearch !== undefined) setSearchQuery(externalSearch);
  }, [externalSearch]);
  
  // Selected task state for inspector
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    highlightedTaskId || null
  );

  React.useEffect(() => {
    if (highlightedTaskId) {
      setSelectedTaskId(highlightedTaskId);
    }
  }, [highlightedTaskId]);

  // 삭제 확인 단계 — 다른 할 일로 전환하면 초기화
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  React.useEffect(() => { setConfirmingDelete(false); }, [selectedTaskId]);

  // 달력형에서 선택된 날짜 + 일정 모달 표시 여부
  const [selectedCalDate, setSelectedCalDate] = useState<string>(TODAY_STR);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  // 달력에서 보고 있는 연/월
  const [calView, setCalView] = useState<{ year: number; month: number }>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const goMonth = (delta: number) => setCalView(v => {
    const m = v.month + delta;
    if (m < 0) return { year: v.year - 1, month: 11 };
    if (m > 11) return { year: v.year + 1, month: 0 };
    return { year: v.year, month: m };
  });

  // New task builder modal
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(() => (localStorage.getItem('default_priority') as Priority) || 'medium');
  const [newCategory, setNewCategory] = useState<Category>(() => (localStorage.getItem('default_category') as Category) || 'Work');
  const [newDate, setNewDate] = useState(TODAY_STR);
  const [newDeadline, setNewDeadline] = useState(TODAY_STR);
  const [newTimeStart, setNewTimeStart] = useState('11:00');
  const [newDescription, setNewDescription] = useState('');

  // Selected task details
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Filter & Search tasks
  const filteredTasks = tasks.filter(task => {
    // 1. Category chip filtering
    const workCategories = ['Work', 'Meeting', 'Project', 'Research'];
    if (filter === 'work' && !workCategories.includes(task.category)) return false;
    if (filter === 'personal' && workCategories.includes(task.category)) return false;
    
    // 2. Search typing filter
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           task.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 적응형 자동 정렬 — 마감 지남·미룬 일·마감 임박·높은 우선순위를 위로 올린다
  const urgencyScore = (t: Task): number => {
    if (t.completed) return 100;        // 완료는 맨 아래
    if (t.failed) return 1;             // 미룬(실패) 일은 직면하도록 위로
    const dl = getDeadlineInfo(t.deadline);
    if (dl?.overdue) return 0;          // 마감 지남 최상단
    if (dl && (dl.text === 'D-DAY' || dl.urgent)) return 2;
    return t.priority === 'high' ? 3 : t.priority === 'medium' ? 4 : 5;
  };
  const adaptiveSort = (arr: Task[]) => [...arr].sort((a, b) => {
    const s = urgencyScore(a) - urgencyScore(b);
    if (s !== 0) return s;
    const ad = a.deadline || '9999-99-99', bd = b.deadline || '9999-99-99';
    if (ad !== bd) return ad < bd ? -1 : 1;
    return (a.timeStart || '99:99').localeCompare(b.timeStart || '99:99');
  });

  // Groupings inside lists (적응형 정렬 적용)
  const todayTasks = adaptiveSort(filteredTasks.filter(t => t.date === TODAY_STR));
  const tomorrowTasks = adaptiveSort(filteredTasks.filter(t => t.date === TOMORROW_STR));
  const weekTasks = adaptiveSort(filteredTasks.filter(t => t.date !== TODAY_STR && t.date !== TOMORROW_STR));

  const handleOpenAddModal = () => {
    setNewTitle('');
    setNewDescription('');
    // 설정의 '할 일 기본 설정' 값으로 채워서 열기
    setNewPriority((localStorage.getItem('default_priority') as Priority) || 'medium');
    setNewCategory((localStorage.getItem('default_category') as Category) || 'Work');
    setIsAddingTask(true);
  };

  const notify = (msg: string) =>
    window.dispatchEvent(new CustomEvent('notify', { detail: msg }));

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      notify('할 일 제목을 입력해 주세요.');
      return;
    }

    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      date: newDate,
      deadline: newDeadline || undefined,
      timeStart: newTimeStart || undefined,
      description: newDescription.trim() || '세부 사항이 기입되지 않았습니다.',
      duration: '1시간 30분'
    });

    setIsAddingTask(false);
    // Success alarm
  };


  const handleDeleteCurrent = () => {
    if (!selectedTask) return;
    onDeleteTask(selectedTask.id);
    setSelectedTaskId(null);
    notify('할 일이 삭제되었습니다.');
  };

  // 목록 행에 표시할 작업 상태 배지 (실패는 별도 '실패' 태그로 표시되므로 제외)
  const renderStatusBadge = (task: Task) => {
    if (task.failed) return null;
    const map = {
      todo:       { label: '진행 전', cls: 'bg-[#f7f6f2] text-[#9a9a86] border-[#e0ddd8]' },
      inprogress: { label: '진행 중', cls: 'bg-[#eef2e2] text-[#4a5c2e] border-[#c8d4a8]' },
      done:       { label: '완료',    cls: 'bg-[#ecf0e4] text-[#2d7a3a] border-[#c8d4a8]' },
    } as const;
    const s = map[task.status];
    return (
      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border shrink-0 ${s.cls}`}>
        {s.label}
      </span>
    );
  };

  // 목록 행에 표시할 마감일 D-day 배지
  const renderDeadlineBadge = (task: Task) => {
    const info = getDeadlineInfo(task.deadline);
    if (!info) return null;
    return (
      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border shrink-0 ${
        info.overdue
          ? 'bg-[#c4674a] text-white border-[#c4674a]'
          : info.urgent
          ? 'bg-[#f8ede8] text-[#c4674a] border-[#e8c0b0]'
          : 'bg-[#f7f6f2] text-[#6b6b58] border-[#e0ddd8]'
      }`}>
        {info.text}
      </span>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full max-w-[1920px] mx-auto text-[#1c1c14] animate-fadeIn">
      
      {/* LEFT: Central Workspace (To-do controls & groups) */}
      <main className={`flex-grow flex flex-col overflow-y-auto w-full transition-all duration-300 ${
        selectedTask && viewMode !== 'calendar' ? 'md:w-3/5' : 'md:w-full'
      }`}>
       <div className="flex flex-col px-6 py-6 w-full max-w-[1280px] mx-auto">

        {/* Page Title & "New Task" toolbar */}
        <div className="flex flex-col gap-5 pb-5 border-b border-[#e0ddd8] mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="text-left">
              <h2 className="text-2xl font-bold font-display text-[#1c1c14] tracking-tight">할 일 관리</h2>
              <p className="text-[13px] text-[#9a9a86] mt-1">할 일을 추가하고 상태·마감을 관리하세요.</p>
            </div>

            <button
              id="add-new-task-btn"
              onClick={handleOpenAddModal}
              className="bg-[#5a6e38] text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#4a5c2e] transition-all cursor-pointer shadow-sm active:scale-97 shrink-0"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>새 할 일</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode selection chips */}
            <div className="flex bg-[#f7f6f2] p-1 rounded-xl border border-[#e0ddd8]/50">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-white text-[#1c1c14] shadow-sm' 
                    : 'text-[#6b6b58] hover:text-[#1c1c14]'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>목록형</span>
              </button>
              
              <button 
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-[#1c1c14] shadow-sm' 
                    : 'text-[#6b6b58] hover:text-[#1c1c14]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>달력형</span>
              </button>
            </div>

            {/* Filter Category Chips + Secondary Search bar */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                    filter === 'all' 
                      ? 'border-[#5a6e38] text-[#1c1c14] bg-[#5a6e38]/5' 
                      : 'border-[#e0ddd8] text-[#6b6b58] bg-transparent hover:border-[#e0ddd8] hover:text-[#1c1c14]'
                  }`}
                >
                  모두 보기
                </button>
                <button 
                  onClick={() => setFilter('work')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                    filter === 'work' 
                      ? 'border-[#5a6e38] text-[#1c1c14] bg-[#5a6e38]/5' 
                      : 'border-[#e0ddd8] text-[#6b6b58] bg-transparent hover:border-[#e0ddd8] hover:text-[#1c1c14]'
                  }`}
                >
                  업무
                </button>
                <button 
                  onClick={() => setFilter('personal')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                    filter === 'personal' 
                      ? 'border-[#5a6e38] text-[#1c1c14] bg-[#5a6e38]/5' 
                      : 'border-[#e0ddd8] text-[#6b6b58] bg-transparent hover:border-[#e0ddd8] hover:text-[#1c1c14]'
                  }`}
                >
                  개인
                </button>
              </div>

              {/* Input for filtering */}
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9a9a86] w-3.5 h-3.5" />
                <input 
                  type="text"
                  placeholder="제목 키워드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-[#e0ddd8] focus:outline-none focus:ring-1 focus:ring-[#5a6e38] rounded-lg text-[11px] w-40 hover:border-[#e0ddd8] focus:w-48 transition-all text-[#1c1c14] placeholder-[#9a9a86]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: Standard List Workspace */}
        {viewMode === 'list' && (
          <div className="flex flex-col gap-6 pb-12">

            {/* 적응형 정렬 안내 */}
            <div className="flex items-center gap-1.5 -mb-2 text-[11px] text-[#5a6e38] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>마감 지남·미룬 일·마감 임박 순으로 자동 정렬돼요</span>
            </div>

            {/* GROUP: Today */}
            <section className="text-left">
              <h3 className="text-[13px] font-bold text-[#1c1c14] mb-2.5 flex items-center gap-2">
                오늘 <span className="text-[#9a9a86] font-normal">{todayTasks.length}</span>
              </h3>
              
              <div className="flex flex-col gap-2">
                {todayTasks.length === 0 ? (
                  <div className="py-6 text-center text-[#9a9a86] text-xs border border-dashed border-[#e0ddd8] rounded-xl">
                    오늘 한 일 목록이 없습니다.
                  </div>
                ) : (
                  todayTasks.map((task) => {
                    const isSelected = selectedTask?.id === task.id;
                    return (
                      <div 
                        key={task.id}
                        onClick={() => setSelectedTaskId(prev => prev === task.id ? null : task.id)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected 
                            ? 'border-[#5a6e38] bg-[#5a6e38]/5 shadow-sm' 
                            : task.failed
                            ? 'border-[#e8c0b0] bg-[#f8ede8]/25 hover:bg-[#f8ede8]/35 shadow-sm'
                            : 'border-[#e0ddd8] bg-white hover:bg-[#edecea] shadow-sm hover:shadow'
                        }`}
                      >
                        {/* Checkbox */}
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                          className={`w-[22px] h-[22px] rounded border flex items-center justify-center shrink-0 transition-colors ${
                            task.completed 
                              ? 'bg-[#2d7a3a] border-[#2d7a3a] text-white' 
                              : task.failed
                              ? 'bg-[#f8ede8] border-[#c4674a] text-[#c4674a]'
                              : 'border-[#e0ddd8] hover:border-[#5a6e38] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          {task.failed && <span className="text-[11px] font-bold">✕</span>}
                        </button>

                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-[#c4674a]' : task.priority === 'medium' ? 'bg-[#c4674a]' : 'bg-[#f7f6f2]'
                        }`} />

                        {/* Title & badge info */}
                        <div className="flex-grow flex flex-col min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className={`text-sm font-semibold text-[#1c1c14] truncate ${
                              task.completed ? 'line-through text-[#9a9a86] font-normal' : task.failed ? 'text-[#6b6b58] line-through decoration-rose-300' : ''
                            }`}>
                              {task.title}
                            </span>
                            <span className="px-1.5 py-0.5 bg-[#f7f6f2] text-[#6b6b58] rounded text-[11px] font-bold uppercase shrink-0">
                              {task.category}
                            </span>
                            {renderStatusBadge(task)}
                            {renderDeadlineBadge(task)}
                          </div>
                          
                          {task.aiRecommendation && (
                            <span className="font-sans text-[11px] text-[#1c1c14] font-semibold flex items-center gap-0.5 mt-1 select-none ">
                              <Brain className="w-3.5 h-3.5 text-[#1c1c14] fill-[#1c1c14]/20" />
                              <span>{task.aiRecommendation}</span>
                            </span>
                          )}
                        </div>

                        {/* Time or fail tags */}
                        <div className="flex items-center gap-3 shrink-0">
                          {task.failed ? (
                            <span className="px-1.5 py-0.5 bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] text-[11px] font-black rounded-lg">
                              실패
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#9a9a86] font-semibold font-mono tracking-wide">
                              {task.timeStart || '12:00'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* GROUP: Tomorrow */}
            <section className="text-left mt-3">
              <h3 className="text-[13px] font-bold text-[#1c1c14] mb-2.5 flex items-center gap-2">
                내일 <span className="text-[#9a9a86] font-normal">{tomorrowTasks.length}</span>
              </h3>
              
              <div className="flex flex-col gap-2">
                {tomorrowTasks.length === 0 ? (
                  <div className="py-6 text-center text-[#9a9a86] text-xs border border-dashed border-[#e0ddd8] rounded-xl">
                    내일 예정된 일이 없습니다.
                  </div>
                ) : (
                  tomorrowTasks.map((task) => {
                    const isSelected = selectedTask?.id === task.id;
                    return (
                      <div 
                        key={task.id}
                        onClick={() => setSelectedTaskId(prev => prev === task.id ? null : task.id)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected 
                            ? 'border-[#5a6e38] bg-[#5a6e38]/5 shadow-sm' 
                            : task.failed
                            ? 'border-[#e8c0b0] bg-[#f8ede8]/25 hover:bg-[#f8ede8]/35 shadow-sm'
                            : 'border-[#e0ddd8] bg-white hover:bg-[#edecea] shadow-sm'
                        }`}
                      >
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                          className={`w-[22px] h-[22px] rounded border flex items-center justify-center shrink-0 transition-colors ${
                            task.completed 
                              ? 'bg-[#2d7a3a] border-[#2d7a3a] text-white' 
                              : task.failed
                              ? 'bg-[#f8ede8] border-[#c4674a] text-[#c4674a]'
                              : 'border-[#e0ddd8] hover:border-[#5a6e38] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          {task.failed && <span className="text-[11px] font-bold">✕</span>}
                        </button>

                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-[#c4674a]' : task.priority === 'medium' ? 'bg-[#c4674a]' : 'bg-[#f7f6f2]'
                        }`} />

                        <div className="flex-grow flex items-center justify-between min-w-0 mr-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-sm font-semibold text-[#1c1c14] truncate ${
                              task.completed ? 'line-through text-[#9a9a86] font-normal' : task.failed ? 'text-[#6b6b58] line-through decoration-rose-300' : ''
                            }`}>
                              {task.title}
                            </span>
                            <span className="px-1.5 py-0.5 bg-[#f7f6f2] text-[#6b6b58] rounded text-[11px] font-bold uppercase shrink-0">
                              {task.category}
                            </span>
                            {renderStatusBadge(task)}
                            {renderDeadlineBadge(task)}
                          </div>
                          
                          {task.failed && (
                            <span className="px-1.5 py-0.5 bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] text-[11px] font-black rounded-lg">
                              실패
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-[#9a9a86] font-semibold font-mono shrink-0">
                          {task.timeStart || '10:30'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* GROUP: This Week */}
            <section className="text-left mt-3">
              <h3 className="text-[13px] font-bold text-[#1c1c14] mb-2.5 flex items-center gap-2">
                이번 주 <span className="text-[#9a9a86] font-normal">{weekTasks.length}</span>
              </h3>
              
              <div className="flex flex-col gap-2">
                {weekTasks.length === 0 ? (
                  <div className="py-6 text-center text-[#9a9a86] text-xs border border-dashed border-[#e0ddd8] rounded-xl">
                    이번 주 목록이 없습니다.
                  </div>
                ) : (
                  weekTasks.map((task) => {
                    const isSelected = selectedTask?.id === task.id;
                    return (
                      <div 
                        key={task.id}
                        onClick={() => setSelectedTaskId(prev => prev === task.id ? null : task.id)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected 
                            ? 'border-[#5a6e38] bg-[#5a6e38]/5 shadow-sm' 
                            : task.failed
                            ? 'border-[#e8c0b0] bg-[#f8ede8]/25 hover:bg-[#f8ede8]/35 shadow-sm'
                            : 'border-[#e0ddd8] bg-white hover:bg-[#edecea] shadow-sm'
                        }`}
                      >
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                          className={`w-[22px] h-[22px] rounded border flex items-center justify-center shrink-0 transition-colors ${
                            task.completed 
                              ? 'bg-[#2d7a3a] border-[#2d7a3a] text-white' 
                              : task.failed
                              ? 'bg-[#f8ede8] border-[#c4674a] text-[#c4674a]'
                              : 'border-[#e0ddd8] hover:border-[#5a6e38] bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          {task.failed && <span className="text-[11px] font-bold">✕</span>}
                        </button>

                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-[#c4674a]' : task.priority === 'medium' ? 'bg-[#c4674a]' : 'bg-[#f7f6f2]'
                        }`} />

                        <div className="flex-grow flex items-center justify-between min-w-0 mr-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-sm font-semibold text-[#1c1c14] truncate ${
                              task.completed ? 'line-through text-[#9a9a86] font-normal' : task.failed ? 'text-[#6b6b58] line-through decoration-rose-300' : ''
                            }`}>
                              {task.title}
                            </span>
                            <span className="px-1.5 py-0.5 bg-[#f7f6f2] text-[#6b6b58] rounded text-[11px] font-bold uppercase shrink-0">
                              {task.category}
                            </span>
                            {renderStatusBadge(task)}
                            {renderDeadlineBadge(task)}
                          </div>
                          
                          {task.failed && (
                            <span className="px-1.5 py-0.5 bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] text-[11px] font-black rounded-lg">
                              실패
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-[#9a9a86] font-bold shrink-0">
                          목요일
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: 실제 날짜 기반 월간 달력 */}
        {viewMode === 'calendar' && (() => {
          const calYear = calView.year;
          const calMonth = calView.month; // 0-based
          const firstWeekday = new Date(calYear, calMonth, 1).getDay(); // 0=일
          const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
          const pad = (n: number) => String(n).padStart(2, '0');
          const toDateStr = (d: number) => `${calYear}-${pad(calMonth + 1)}-${pad(d)}`;

          // 날짜별 할 일 묶기
          const tasksByDate: Record<string, Task[]> = {};
          filteredTasks.forEach(t => {
            (tasksByDate[t.date] ||= []).push(t);
          });

          const dotColor = (t: Task) =>
            t.status === 'done' ? '#2d7a3a' : t.failed ? '#c4674a' : '#5a6e38';

          const selectedDayTasks = tasksByDate[selectedCalDate] || [];
          const cells: (number | null)[] = [
            ...Array.from({ length: firstWeekday }, () => null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
          ];

          const weekdayKor = ['일', '월', '화', '수', '목', '금', '토'];
          const selDate = new Date(selectedCalDate + 'T00:00:00');

          return (
            <div className="mt-2 animate-fadeIn">
              {/* 달력 — 제목과 균형 맞도록 넓게 + 정사각형 칸 */}
              <div className="w-full bg-white border border-[#e0ddd8] rounded-xl shadow-sm p-5 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0ddd8]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goMonth(-1)}
                      className="p-1 rounded-md text-[#9a9a86] hover:text-[#1c1c14] hover:bg-[#edecea] transition-colors cursor-pointer"
                      title="이전 달"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-[#1c1c14] min-w-[88px] text-center">{calYear}년 {calMonth + 1}월</span>
                    <button
                      type="button"
                      onClick={() => goMonth(1)}
                      className="p-1 rounded-md text-[#9a9a86] hover:text-[#1c1c14] hover:bg-[#edecea] transition-colors cursor-pointer"
                      title="다음 달"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-[#9a9a86] font-medium">총 {filteredTasks.length}개의 일정</span>
                </div>

                <div className="grid grid-cols-7 gap-2 text-[11px] font-bold uppercase tracking-wider text-[#9a9a86] mt-3 text-center">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-2 mt-2">
                  {cells.map((dayNum, i) => {
                    if (dayNum === null) return <div key={`e${i}`} />;
                    const ds = toDateStr(dayNum);
                    const dayTasks = tasksByDate[ds] || [];
                    const isToday = ds === TODAY_STR;
                    return (
                      <button
                        key={ds}
                        type="button"
                        onClick={() => { setSelectedCalDate(ds); setIsDayModalOpen(true); }}
                        className={`aspect-[5/4] p-2 border rounded-lg flex flex-col justify-between transition-all text-left cursor-pointer ${
                          isToday
                            ? 'border-[#5a6e38] bg-[#5a6e38]/5 hover:bg-[#5a6e38]/10'
                            : 'border-[#e0ddd8] hover:bg-[#edecea] hover:border-[#5a6e38]'
                        }`}
                      >
                        <span className={`font-mono text-[13px] font-semibold leading-none ${isToday ? 'text-[#5a6e38]' : 'text-[#6b6b58]'}`}>
                          {dayNum}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-start">
                          {dayTasks.slice(0, 5).map(t => (
                            <span key={t.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor(t) }} />
                          ))}
                          {dayTasks.length > 5 && (
                            <span className="text-[10px] font-bold text-[#9a9a86] leading-none">+{dayTasks.length - 5}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-[#9a9a86] font-medium text-center mt-3">날짜를 클릭하면 해당 날의 일정이 표시됩니다.</p>
              </div>

              {/* 날짜 클릭 시 — 새할일처럼 가운데 모달로 일정 표시 */}
              {isDayModalOpen && (
                <div className="fixed inset-0 bg-[#f7f6f2]/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl w-full max-w-[440px] border border-[#e0ddd8] shadow-level-2 overflow-hidden animate-pop text-left">
                    <div className="p-5 border-b border-[#e0ddd8] flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#1c1c14]">
                          {calMonth + 1}월 {selDate.getDate()}일
                          <span className="text-[13px] font-normal text-[#9a9a86]"> ({weekdayKor[selDate.getDay()]})</span>
                        </h3>
                        <p className="text-[11px] text-[#9a9a86] font-semibold mt-0.5">등록된 일정 {selectedDayTasks.length}개</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDayModalOpen(false)}
                        className="p-1 hover:bg-[#edecea] rounded-lg text-[#9a9a86] hover:text-[#6b6b58] cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-5 max-h-[60vh] overflow-y-auto flex flex-col gap-2">
                      {selectedDayTasks.length === 0 ? (
                        <div className="py-10 text-center text-[12px] text-[#9a9a86] border border-dashed border-[#e0ddd8] rounded-xl">
                          이 날짜에 등록된 할 일이 없습니다.
                        </div>
                      ) : (
                        selectedDayTasks.map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => { setSelectedTaskId(t.id); setIsDayModalOpen(false); }}
                            className="flex flex-col gap-1.5 p-3 rounded-lg border border-[#e0ddd8] bg-white hover:bg-[#edecea] hover:border-[#5a6e38] transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor(t) }} />
                              <span className={`text-xs font-semibold flex-grow truncate ${t.status === 'done' || t.failed ? 'line-through text-[#9a9a86]' : 'text-[#1c1c14]'}`}>
                                {t.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 pl-4">
                              <span className="px-1.5 py-0.5 bg-[#f7f6f2] text-[#6b6b58] rounded text-[11px] font-bold uppercase">{t.category}</span>
                              {renderStatusBadge(t)}
                              {t.timeStart && <span className="text-[11px] text-[#9a9a86] font-mono ml-auto">{t.timeStart}</span>}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    <div className="p-4 border-t border-[#e0ddd8] flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsDayModalOpen(false)}
                        className="px-4 py-2 bg-[#1c1c14] text-white hover:bg-[#2a2a1e] rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-97"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

       </div>
      </main>

      {/* 액션 패널 — 목록형에서는 우측 사이드, 달력형에서는 가운데 모달 */}
      {selectedTask && (
        <>
        {/* 항상 가운데 모달로 표시 (목록/달력 공통) */}
        <div className="fixed inset-0 bg-[#f7f6f2]/50 z-40" onClick={() => setSelectedTaskId(null)} />
        <aside className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[460px] max-h-[85vh] bg-white border border-[#e0ddd8] rounded-xl shadow-level-2 flex flex-col overflow-hidden animate-pop">

          {/* Panel Header */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0 bg-white text-left">
            <h3 className="text-base font-bold text-[#1c1c14] font-display">수정</h3>
            <div className="flex gap-2 items-center">
              {confirmingDelete ? (
                <>
                  <span className="text-[11px] font-bold text-[#c4674a]">삭제할까요?</span>
                  <button
                    onClick={() => { handleDeleteCurrent(); setConfirmingDelete(false); }}
                    className="px-2.5 py-1 bg-[#c4674a] hover:bg-[#b05a3e] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="px-2.5 py-1 bg-[#f7f6f2] hover:bg-[#edecea] text-[#6b6b58] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="p-1.5 text-[#9a9a86] hover:text-[#c4674a] hover:bg-[#f8ede8] rounded-lg transition-colors cursor-pointer"
                  title="할 일 삭제"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
              <button
                onClick={() => setSelectedTaskId(null)}
                className="p-1.5 text-[#9a9a86] hover:bg-[#edecea] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Panel Content Body (스크롤) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            
            {/* Title text-field & tags */}
            <div className="flex flex-col gap-3 text-left">
              <textarea 
                className="w-full bg-transparent border-none p-0 text-lg font-bold text-[#1c1c14] resize-none focus:ring-0 focus:outline-none focus:bg-[#f7f6f2]/50 rounded-md p-1 font-display leading-snug"
                placeholder="일정 제목 기입..."
                rows={2}
                value={selectedTask.title}
                onChange={(e) => onUpdateTask(selectedTask.id, { title: e.target.value })}
              />
              
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="w-[110px]">
                  <CustomSelect
                    value={selectedTask.priority}
                    options={PRIORITY_OPTIONS}
                    withDot
                    onChange={(v) => onUpdateTask(selectedTask.id, { priority: v as Priority })}
                  />
                </div>
                <div className="w-[120px]">
                  <CustomSelect
                    value={selectedTask.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(v) => onUpdateTask(selectedTask.id, { category: v as Category })}
                  />
                </div>
              </div>
            </div>

            {/* 작업 상태 (진행 전 / 진행 중 / 완료) */}
            <div className="flex flex-col gap-1.5 text-left">
              <p className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">작업 상태</p>
              <div className="flex bg-[#f7f6f2] p-1 rounded-lg border border-[#e0ddd8]/60 w-fit">
                {([
                  { key: 'todo', label: '진행 전' },
                  { key: 'inprogress', label: '진행 중' },
                  { key: 'done', label: '완료' },
                ] as const).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => onSetStatus(selectedTask.id, s.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedTask.status === s.key
                        ? s.key === 'done'
                          ? 'bg-[#2d7a3a] text-white shadow-sm'
                          : s.key === 'inprogress'
                          ? 'bg-[#5a6e38] text-white shadow-sm'
                          : 'bg-white text-[#1c1c14] shadow-sm'
                        : 'text-[#6b6b58] hover:text-[#1c1c14]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-[#e0ddd8]" />

            {/* Properties fields */}
            <div className="flex flex-col gap-3 text-left">
              {/* Date Input */}
              <div className="flex items-center gap-4">
                <Calendar className="text-[#9a9a86] w-4.5 h-4.5 shrink-0" />
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider mb-0.5">예정일</p>
                  <input
                    type="date"
                    value={selectedTask.date}
                    onChange={(e) => onUpdateTask(selectedTask.id, { date: e.target.value })}
                    className="text-xs font-semibold text-[#1c1c14] bg-transparent border-none p-0 focus:ring-0 focus:outline-none cursor-pointer focus:bg-[#f7f6f2] rounded px-1"
                  />
                </div>
              </div>

              {/* Deadline input + D-day */}
              <div className="flex items-center gap-4">
                <AlertCircle className="text-[#c4674a] w-4.5 h-4.5 shrink-0" />
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-[#c4674a] uppercase tracking-wider mb-0.5">마감일</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedTask.deadline || ''}
                      onChange={(e) => onUpdateTask(selectedTask.id, { deadline: e.target.value || undefined })}
                      className="text-xs font-semibold text-[#1c1c14] bg-transparent border-none p-0 focus:ring-0 focus:outline-none cursor-pointer focus:bg-[#f7f6f2] rounded px-1"
                    />
                    {(() => {
                      const info = getDeadlineInfo(selectedTask.deadline);
                      if (!info) return null;
                      return (
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${
                          info.overdue
                            ? 'bg-[#c4674a] text-white border-[#c4674a]'
                            : info.urgent
                            ? 'bg-[#f8ede8] text-[#c4674a] border-[#e8c0b0]'
                            : 'bg-[#f7f6f2] text-[#6b6b58] border-[#e0ddd8]'
                        }`}>
                          {info.text}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Estimated Time input */}
              <div className="flex items-center gap-4">
                <Clock className="text-[#9a9a86] w-4.5 h-4.5 shrink-0" />
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider mb-0.5 font-sans">예상 소요 시간</p>
                  <input 
                    type="text"
                    value={selectedTask.duration || '1시간 30분'}
                    onChange={(e) => onUpdateTask(selectedTask.id, { duration: e.target.value })}
                    className="text-xs font-semibold text-[#1c1c14] bg-transparent border-none p-0 focus:ring-0 focus:outline-none focus:bg-[#f7f6f2] rounded px-1 w-full"
                    placeholder="2시간 30분"
                  />
                </div>
              </div>

              {/* Assignee display */}
              <div className="flex items-center gap-4">
                <User className="text-[#9a9a86] w-4.5 h-4.5 shrink-0" />
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider mb-0.5">담당자</p>
                  <div className="flex items-center gap-2 mt-1.5 select-none">
                    <div className="w-5.5 h-5.5 rounded-full bg-[#e0ddd8] text-[#1c1c14] flex items-center justify-center font-bold text-[11px]">나</div>
                    <span className="text-xs font-semibold text-[#1c1c14]">{selectedTask.assignee || '나 (소유자)'}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#e0ddd8]" />

            {/* Description textarea */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-4 h-4" /> <span>설명</span>
              </label>
              <textarea
                rows={3}
                className="w-full min-h-[72px] [field-sizing:content] p-3 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl text-xs text-[#1c1c14] align-top focus:bg-white focus:border-[#5a6e38] focus:ring-1 focus:ring-[#5a6e38] focus:outline-none transition-all resize-y leading-relaxed font-sans"
                placeholder="세부 요구사항 및 업무 계획을 입력하세요..."
                value={selectedTask.description}
                onChange={(e) => onUpdateTask(selectedTask.id, { description: e.target.value })}
              />
            </div>

            {/* 적응형 AI 코치 — 할 일 신호에 따라 조언이 바뀜 (대신 해주지 않고 방법만 제시) */}
            {(() => {
              const advice = getCoachAdvice(selectedTask, tasks);
              return (
                <div className="bg-[#f7f6f2] rounded-xl border border-[#e0ddd8] p-3.5 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#c4674a]" />
                      <span className="text-xs font-bold text-[#1c1c14]">AI 코치</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#5a6e38] bg-[#ecf0e4] border border-[#c8d4a8] px-1.5 py-0.5 rounded">
                      {advice.tag}
                    </span>
                  </div>

                  {/* 현재 위험 */}
                  <div className="flex items-start gap-1.5 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#c4674a] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-[#c4674a] leading-none mb-0.5">현재 위험</p>
                      <p className="text-[11px] text-[#6b6b58] leading-relaxed">{advice.risk}</p>
                    </div>
                  </div>

                  {/* 성공 전략 */}
                  <div className="flex items-start gap-1.5 mb-2">
                    <Target className="w-3.5 h-3.5 text-[#5a6e38] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-[#5a6e38] leading-none mb-0.5">성공 전략</p>
                      <p className="text-[11px] text-[#6b6b58] leading-relaxed">{advice.strategy}</p>
                    </div>
                  </div>

                  {/* 다음 행동 (지금 바로 실행) */}
                  <div className="flex items-start gap-2 bg-white border border-[#c8d4a8] rounded-lg px-2.5 py-2">
                    <ArrowRight className="w-3.5 h-3.5 text-[#5a6e38] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-[#5a6e38] mb-0.5">다음 행동</p>
                      <p className="text-[12px] font-semibold text-[#1c1c14] leading-snug">{advice.action}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Panel footer — 항상 하단 고정 (스크롤되지 않음) */}
          <div className="shrink-0 border-t border-[#e0ddd8] bg-white px-4 py-3 space-y-2.5">
            <p className="text-[11px] text-[#9a9a86] font-semibold flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#2d7a3a]" />
              변경 사항은 자동으로 저장됩니다
            </p>

            {/* 실패 선언 토글 — 완료 상태가 아닐 때만 노출 */}
            {selectedTask.status !== 'done' && (
              <button
                onClick={() => {
                  if (selectedTask.failed) {
                    onUpdateTask(selectedTask.id, { failed: false });
                    notify('다시 도전으로 변경되었습니다.');
                  } else {
                    onUpdateTask(selectedTask.id, { failed: true });
                    notify('실패로 표시했습니다.');
                  }
                }}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                  selectedTask.failed
                    ? 'bg-[#f7f6f2] border-[#e0ddd8] text-[#6b6b58] hover:bg-[#edecea]'
                    : 'bg-[#f8ede8] border-[#e8c0b0] text-[#c4674a] hover:bg-[#f8ede8]/40'
                }`}
              >
                {selectedTask.failed ? '실패 취소 및 재도전' : '실패로 표시'}
              </button>
            )}
          </div>
        </aside>
        </>
      )}


      {/* FLOAT MODAL: Add task dialog form */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-[#f7f6f2]/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-[440px] border border-[#e0ddd8] shadow-level-2 overflow-hidden animate-pop text-left">
            <div className="p-5 border-b border-[#e0ddd8] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1c1c14]">새 할 일 추가</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingTask(false)}
                className="p-1 hover:bg-[#edecea] rounded-lg text-[#9a9a86] hover:text-[#6b6b58] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveNewTask} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider" htmlFor="new-title">할 일 제목</label>
                <input 
                  id="new-title"
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 클라이언트 검토 자료 준비"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e0ddd8] focus:outline-[#1c1c14] text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">우선순위</label>
                  <CustomSelect
                    value={newPriority}
                    options={PRIORITY_OPTIONS}
                    withDot
                    onChange={(v) => setNewPriority(v as Priority)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">카테고리</label>
                  <CustomSelect
                    value={newCategory}
                    options={CATEGORY_OPTIONS}
                    onChange={(v) => setNewCategory(v as Category)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">예정일</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e0ddd8] text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#c4674a] uppercase tracking-wider">마감일</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e8c0b0] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#c4674a]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">시작 시간</label>
                <input
                  type="time"
                  value={newTimeStart}
                  onChange={(e) => setNewTimeStart(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#e0ddd8] text-xs font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider" htmlFor="new-desc">세부 내용</label>
                <textarea 
                  id="new-desc"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="추가 설명 및 가이드를 기입하세요..."
                  className="w-full p-3 rounded-xl border border-[#e0ddd8] text-xs font-medium bg-[#f7f6f2] focus:bg-white resize-none"
                  rows={3}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#5a6e38] text-white font-bold rounded-xl text-xs hover:bg-[#4a5c2e] transition-all shadow-sm active:scale-97 cursor-pointer text-center block mt-4"
              >
                저장 스마트 생성
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
