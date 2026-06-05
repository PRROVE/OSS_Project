/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, Priority, Category } from '../types';
import { TODAY_STR, TOMORROW_STR } from '../data';
import { 
  Plus, 
  Search, 
  ListTodo, 
  Calendar, 
  Kanban, 
  AlertCircle, 
  X, 
  Clock, 
  User, 
  BookOpen, 
  FileText, 
  Check, 
  ChevronDown, 
  Brain,
  Trash2,
  Lock,
  Heart
} from 'lucide-react';

interface TodosViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  highlightedTaskId?: string | null;
}

type ViewMode = 'list' | 'calendar' | 'kanban';
type CategoryFilter = 'all' | 'work' | 'personal';

export default function TodosView({ 
  tasks, 
  onToggleTask, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  highlightedTaskId
}: TodosViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected task state for inspector
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    highlightedTaskId || null
  );

  React.useEffect(() => {
    if (highlightedTaskId) {
      setSelectedTaskId(highlightedTaskId);
    }
  }, [highlightedTaskId]);

  // New task builder modal
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState<Category>('Work');
  const [newDate, setNewDate] = useState(TODAY_STR);
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

  // Groupings inside lists
  const todayTasks = filteredTasks.filter(t => t.date === TODAY_STR);
  const tomorrowTasks = filteredTasks.filter(t => t.date === TOMORROW_STR);
  const weekTasks = filteredTasks.filter(t => t.date !== TODAY_STR && t.date !== TOMORROW_STR);

  const handleOpenAddModal = () => {
    setNewTitle('');
    setNewDescription('');
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
      timeStart: newTimeStart || undefined,
      description: newDescription.trim() || '세부 사항이 기입되지 않았습니다.',
      duration: '1시간 30분'
    });

    setIsAddingTask(false);
    // Success alarm
  };

  const handleApplyExtendedTime = () => {
    if (!selectedTask) return;
    onUpdateTask(selectedTask.id, { duration: '3시간' });
    notify('AI 코치 제안 수락 — 소요 시간이 3시간으로 조정되었습니다.');
  };

  const handleDeleteCurrent = () => {
    if (!selectedTask) return;
    if (selectedTask.failed) {
      notify('이미 실패로 기록된 할 일입니다.');
      return;
    }
    if (selectedTask.completed) {
      notify('완료된 할 일은 삭제할 수 없습니다.');
      return;
    }
    onDeleteTask(selectedTask.id);
    notify('할 일이 실패로 기록되었습니다.');
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full max-w-[1920px] mx-auto text-[#1c1c14] animate-fadeIn">
      
      {/* LEFT: Central Workspace (To-do controls & groups) */}
      <main className={`flex-grow flex flex-col px-6 py-6 overflow-y-auto w-full transition-all duration-300 ${
        selectedTask ? 'md:w-3/5' : 'md:w-full max-w-[1400px] mx-auto'
      }`}>
        
        {/* Page Title & "New Task" toolbar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-[#1c1c14] tracking-tight text-left">할 일 관리</h2>
            
            <button 
              id="add-new-task-btn"
              onClick={handleOpenAddModal}
              className="bg-[#5a6e38] text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#4a5c2e] transition-all cursor-pointer shadow-sm active:scale-97"
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

              <button 
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'kanban' 
                    ? 'bg-white text-[#1c1c14] shadow-sm' 
                    : 'text-[#6b6b58] hover:text-[#1c1c14]'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span>칸반형</span>
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

        {/* VIEW 2: Mock monthly calendar grid view */}
        {viewMode === 'calendar' && (
          <div className="bg-white border border-[#e0ddd8] rounded-xl shadow-sm p-4 text-center mt-2 animate-fadeIn flex flex-col h-[400px] justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0ddd8]">
              <span className="text-sm font-bold text-[#1c1c14]">{new Date().getFullYear()}년 {new Date().getMonth() + 1}월</span>
              <span className="text-xs text-[#9a9a86] font-medium">총 {filteredTasks.length}개의 가동 스케줄</span>
            </div>
            
            {/* Minimal Calendar mock grids */}
            <div className="grid grid-cols-7 gap-2 text-[11px] font-bold uppercase tracking-wider text-[#9a9a86] mt-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2 flex-grow items-center mt-2 border-b border-[#e0ddd8]/50 pb-4">
              {Array.from({ length: 28 }).map((_, i) => {
                const dayNum = i + 1;
                const todayDay = new Date().getDate();
                const tomorrowDay = new Date(Date.now() + 86400000).getDate();
                const thursdayDay = new Date(Date.now() + 86400000 * 2).getDate();

                const hasTaskToday = dayNum === todayDay;
                const hasTaskTomorrow = dayNum === tomorrowDay;
                const hasTaskThursday = dayNum === thursdayDay;

                return (
                  <div 
                    key={i} 
                    className={`aspect-square sm:p-1 border border-[#e0ddd8] rounded-xl flex flex-col justify-between cursor-pointer transition-all hover:bg-[#edecea] ${
                      dayNum === todayDay ? 'bg-[#5a6e38]/5 border-[#5a6e38]' : ''
                    }`}
                  >
                    <span className={`font-mono text-left font-semibold ${
                      dayNum === todayDay ? 'text-[#1c1c14]' : 'text-[#6b6b58]'
                    }`}>{dayNum}</span>
                    
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {hasTaskToday && <div className="w-1.5 h-1.5 bg-[#c4674a] rounded-full animate-pulse" />}
                      {hasTaskToday && <div className="w-1.5 h-1.5 bg-[#5a6e38] rounded-full" />}
                      {hasTaskTomorrow && <div className="w-1.5 h-1.5 bg-[#c4674a] rounded-full" />}
                      {hasTaskThursday && <div className="w-1.5 h-1.5 bg-[#f7f6f2] rounded-full" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#9a9a86] font-medium leading-none py-1 text-left">
              * {new Date().getMonth() + 1}월 {new Date().getDate()}일 {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][new Date().getDay()]}에 가장 우선순위가 높은 <strong>{todayTasks.length}건</strong>의 마케팅/기획 업무 일정이 잡혀있습니다.
            </p>
          </div>
        )}

        {/* VIEW 3: Mock KanBan columns */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-3 gap-4 mt-2 animate-fadeIn text-left">
            {/* Column 1: TODO */}
            <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4 flex flex-col min-h-[380px]">
              <h4 className="text-xs font-bold text-[#9a9a86] uppercase tracking-wider mb-3">할 일 목록</h4>
              <div className="space-y-2.5">
                {filteredTasks.filter(t => !t.completed && !t.failed).slice(0, 3).map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => setSelectedTaskId(prev => prev === task.id ? null : task.id)}
                    className="bg-white border border-[#e0ddd8]/60 p-3.5 rounded-xl shadow-sm hover:border-[#5a6e38] cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-[#1c1c14] line-clamp-2 leading-tight">{task.title}</span>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px] font-bold bg-[#f7f6f2] text-[#6b6b58] px-1.5 py-0.5 rounded uppercase">{task.category}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-[#c4674a]' : 'bg-[#c4674a]'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4 flex flex-col min-h-[380px]">
              <h4 className="text-xs font-bold text-[#9a9a86] uppercase tracking-wider mb-3">진행 중</h4>
              <div className="flex-grow flex items-center justify-center border border-dashed border-[#e0ddd8] rounded-xl py-12 text-center text-[11px] text-[#9a9a86] font-semibold uppercase px-4 leading-normal">
                카드 조율 이동을 전개해 보세요
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4 flex flex-col min-h-[380px]">
              <h4 className="text-xs font-bold text-[#2d7a3a] uppercase tracking-wider mb-3">완료됨</h4>
              <div className="space-y-2.5">
                {filteredTasks.filter(t => t.completed).map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => setSelectedTaskId(prev => prev === task.id ? null : task.id)}
                    className="bg-white/60 border border-[#e0ddd8]/30 p-3.5 rounded-xl cursor-default opacity-80"
                  >
                    <span className="text-xs font-semibold text-[#9a9a86] line-through line-clamp-2 leading-tight">{task.title}</span>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px] font-bold bg-[#f7f6f2] text-[#9a9a86] px-1.5 py-0.5 rounded">{task.category}</span>
                      <Check className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* RIGHT: Detail Inspector Side Panel ("액션") */}
      {selectedTask && (
        <aside className="w-full md:w-2/5 border-l border-[#e0ddd8] bg-white flex flex-col h-full overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] animate-fadeIn">
          
          {/* Panel Header */}
          <div className="p-5 border-b border-[#e0ddd8] flex items-center justify-between sticky top-0 bg-white z-10 text-left">
            <h3 className="text-base font-bold text-[#1c1c14] font-display">액션</h3>
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteCurrent}
                className="p-1.5 text-[#9a9a86] hover:text-[#c4674a] hover:bg-[#f8ede8] rounded-lg transition-colors cursor-pointer"
                title="할 일 삭제"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => setSelectedTaskId(null)}
                className="p-1.5 text-[#9a9a86] hover:bg-[#edecea] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Panel Content Body */}
          <div className="p-6 flex flex-col gap-6 flex-grow">
            
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
                {/* Priority Selection Badge dropdown */}
                <div className="relative">
                  <select 
                    value={selectedTask.priority}
                    onChange={(e) => onUpdateTask(selectedTask.id, { priority: e.target.value as Priority })}
                    className="appearance-none bg-[#f7f6f2] hover:bg-[#edecea] font-semibold text-xs border border-[#e0ddd8] text-[#1c1c14] py-1.5 pl-6 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5a6e38]"
                  >
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                  <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                    selectedTask.priority === 'high' ? 'bg-[#c4674a]' : selectedTask.priority === 'medium' ? 'bg-[#c4674a]' : 'bg-[#f7f6f2]'
                  }`} />
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86] pointer-events-none" />
                </div>

                {/* Category Selection Badge dropdown */}
                <div className="relative">
                  <select 
                    value={selectedTask.category}
                    onChange={(e) => onUpdateTask(selectedTask.id, { category: e.target.value as Category })}
                    className="appearance-none bg-[#f7f6f2] hover:bg-[#edecea] font-semibold text-xs border border-[#e0ddd8] text-[#1c1c14] py-1.5 pl-3.5 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5a6e38]"
                  >
                    <option value="Work">업무</option>
                    <option value="Meeting">미팅</option>
                    <option value="Research">연구</option>
                    <option value="Admin">지원</option>
                    <option value="Project">프로젝트</option>
                    <option value="Other">기타</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86] pointer-events-none" />
                </div>
              </div>
            </div>

            <hr className="border-[#e0ddd8]" />

            {/* Properties fields */}
            <div className="flex flex-col gap-4 text-left">
              {/* Date Input */}
              <div className="flex items-center gap-4">
                <Calendar className="text-[#9a9a86] w-4.5 h-4.5 shrink-0" />
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider mb-0.5">기한</p>
                  <input 
                    type="date"
                    value={selectedTask.date}
                    onChange={(e) => onUpdateTask(selectedTask.id, { date: e.target.value })}
                    className="text-xs font-semibold text-[#1c1c14] bg-transparent border-none p-0 focus:ring-0 focus:outline-none cursor-pointer focus:bg-[#f7f6f2] rounded px-1"
                  />
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
                className="w-full min-h-[110px] p-3 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl text-xs text-[#1c1c14] focus:bg-white focus:border-[#5a6e38] focus:ring-1 focus:ring-[#5a6e38] focus:outline-none transition-all resize-y leading-relaxed font-sans"
                placeholder="세부 요구사항 및 업무 계획을 입력하세요..."
                value={selectedTask.description}
                onChange={(e) => onUpdateTask(selectedTask.id, { description: e.target.value })}
              />
            </div>

            {/* AI Coach Suggestion box / conditional Insight Card */}
            {selectedTask.title.includes('성과 보고서') && (
              <div className="mt-2 bg-gradient-to-r from-[#edecea]/50 to-white rounded-xl border border-[#e0ddd8]/60 p-4 relative overflow-hidden text-left shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1c1c14]"></div>
                <h4 className="text-xs font-bold text-[#1c1c14] flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-custom text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  <span>AI 코치 피드백</span>
                </h4>
                <p className="text-[11px] text-[#6b6b58] leading-normal mb-3 font-sans">
                  과거 유사한 보고서 작성 시 완성도 도달하기까지 평균 3시간이 소요된 데이터 패턴이 있습니다. 일정을 조금 더 여유롭게 잡는 것을 권장합니다.
                </p>
                <button 
                  onClick={handleApplyExtendedTime}
                  className="px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#5a6e38] text-[#1c1c14] hover:bg-[#edecea]/20 text-[11px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  일정 30분 연장하기
                </button>
              </div>
            )}

            {/* Save panel footer links */}
            <div className="p-4 border-t border-[#e0ddd8] bg-[#f7f6f2]/50 rounded-xl mt-auto space-y-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => notify('저장되었습니다.')}
                  className="flex-grow py-2 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm text-center"
                >
                  상세 저장
                </button>
                <button 
                  onClick={() => {
                    onUpdateTask(selectedTask.id, { completed: !selectedTask.completed, failed: false });
                  }}
                  className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                    selectedTask.completed 
                      ? 'bg-[#ecf0e4] border-[#c8d4a8] text-[#2d7a3a]' 
                      : 'bg-[#5a6e38]/10 border-[#5a6e38]/20 text-[#1c1c14]'
                  }`}
                >
                  {selectedTask.completed ? '완수 성공 상태' : '완수 성공 체크'}
                </button>
              </div>
              
              {!selectedTask.completed && (
                <button
                  onClick={() => {
                    if (selectedTask.failed) {
                      onUpdateTask(selectedTask.id, { failed: false });
                      notify('다시 도전으로 상태가 변경되었습니다.');
                    } else {
                      onUpdateTask(selectedTask.id, { failed: true });
                      notify('실패로 기록되었습니다.');
                    }
                  }}
                  className={`w-full py-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                    selectedTask.failed
                      ? 'bg-[#f7f6f2] border-[#e0ddd8] text-[#6b6b58] hover:bg-[#edecea]'
                      : 'bg-[#f8ede8] border-[#e8c0b0] text-[#c4674a] hover:bg-[#f8ede8]/40'
                  }`}
                >
                  {selectedTask.failed ? '실패 취소 및 재도전' : '스스로 실패 선언 (Aborted/Fail)'}
                </button>
              )}
            </div>

          </div>
        </aside>
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
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full p-2.5 rounded-xl border border-[#e0ddd8] text-xs font-semibold"
                  >
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">카테고리</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full p-2.5 rounded-xl border border-[#e0ddd8] text-xs font-semibold"
                  >
                    <option value="Work">업무</option>
                    <option value="Meeting">미팅</option>
                    <option value="Research">연구</option>
                    <option value="Admin">지원</option>
                    <option value="Project">프로젝트</option>
                    <option value="Other">기타</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider">가동 기한</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#e0ddd8] text-xs font-semibold"
                  />
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
