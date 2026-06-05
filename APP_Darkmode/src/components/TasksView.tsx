import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Clock, Zap, MoreVertical, Play, Undo2, 
  Plus, History, Database, CheckSquare, Sparkles, X, Trash2, ArrowUp 
} from 'lucide-react';
import { AppState, Task, TaskPriority, TaskStatus } from '../types';

interface TasksViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export default function TasksView({ state, updateState }: TasksViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // States for new task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30m');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('upcoming');

  const isLight = state.settings.theme === 'light';

  // Toggle task completeness/progress or status
  const handleToggleTaskStatus = (id: string) => {
    const updatedTasks = state.tasks.map(task => {
      if (task.id === id) {
        if (task.status === 'completed') {
          return {
            ...task,
            status: 'in_progress' as TaskStatus,
            progress: 50,
            completedTime: undefined
          };
        } else {
          return {
            ...task,
            status: 'completed' as TaskStatus,
            progress: 100,
            completedTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          };
        }
      }
      return task;
    });
    updateState({ tasks: updatedTasks });
  };

  const handleUpdateProgress = (id: string, amount: number) => {
    const updatedTasks = state.tasks.map(task => {
      if (task.id === id) {
        let newProgress = Math.min(100, Math.max(0, task.progress + amount));
        let newStatus = task.status;
        if (newProgress === 100) {
          newStatus = 'completed';
        } else if (newProgress > 0 && task.status === 'upcoming') {
          newStatus = 'in_progress';
        }
        return {
          ...task,
          progress: newProgress,
          status: newStatus,
          completedTime: newProgress === 100 ? '방금 완료' : undefined
        };
      }
      return task;
    });
    updateState({ tasks: updatedTasks });
  };

  // Delete a task
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTasks = state.tasks.filter(t => t.id !== id);
    updateState({ tasks: updatedTasks });
  };

  // Add custom task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || '추가된 아우라 포커스 목표 문서 및 노드에 대한 상세 검토.',
      duration: duration || '30m',
      priority,
      status,
      progress: status === 'completed' ? 100 : status === 'in_progress' ? 30 : 0,
      completedTime: status === 'completed' ? '방금전 완료됨' : undefined,
    };

    updateState({ tasks: [newTask, ...state.tasks] });
    
    // Reset form
    setTitle('');
    setDescription('');
    setDuration('30m');
    setPriority('medium');
    setStatus('upcoming');
    setShowAddModal(false);
  };

  // Dynamic calculations for Focus Efficiency
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = state.tasks.filter(t => t.status === 'in_progress');
  
  // Calculate average progress
  let efficiency = 0;
  if (totalTasks > 0) {
    const sumProgress = state.tasks.reduce((sum, t) => sum + t.progress, 0);
    efficiency = Math.round(sumProgress / totalTasks);
  } else {
    efficiency = 64; // Fallback default
  }

  return (
    <div className="space-y-10 relative">

      {/* Hero Stats / Progress */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-xs uppercase font-semibold text-neutral-500 tracking-widest`}>
              오늘의 개요
            </p>
            <h2 className={`text-3.5xl font-semibold tracking-tight mt-1 ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>
              집중 프로토콜
            </h2>
          </div>
          <div className="text-right">
            <span className="text-3.5xl font-semibold text-[#8b5cf6] font-mono leading-none">
              {efficiency}%
            </span>
            <p className={`text-xs uppercase font-semibold text-neutral-500`}>효율성</p>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className={`h-2.5 w-full rounded-full overflow-hidden shrink-0 ${isLight ? 'bg-neutral-200' : 'bg-neutral-800'}`}>
          <div 
            className="h-full bg-gradient-to-r from-[#8b5cf6] to-emerald-400 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${efficiency}%` }}
          />
        </div>
      </section>

      {/* Task List Grid */}
      <section className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {state.tasks.map((task) => {
            const isActive = task.status === 'in_progress';
            const isUpcoming = task.status === 'upcoming';
            const isCompleted = task.status === 'completed';

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`rounded-[24px] p-5 relative overflow-hidden group border ${
                  isCompleted
                    ? isLight 
                      ? 'bg-neutral-50/50 border-neutral-200/50 opacity-60' 
                      : 'bg-[#131b2e]/30 border-[#494454]/10 opacity-65 grayscale-[0.2]'
                    : isActive
                    ? isLight
                      ? 'bg-[#8b5cf6]/5 border-[#8b5cf6]/35 shadow-sm'
                      : 'bg-[#131b2e]/60 border-[#8b5cf6]/30 shadow-md shadow-[#8b5cf6]/5'
                    : isLight
                    ? 'bg-white border-[#dae2fd]/60 shadow-sm'
                    : 'bg-[#131b2e]/50 border-white/5 hover:bg-[#131b2e]/75 transition-colors shadow-sm'
                }`}
              >
                {/* Visual Accent for Active Card */}
                {isActive && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8b5cf6]" />
                )}

                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {/* Ring state indicators */}
                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 text-[#8b5cf6] text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle2 size={16} className="fill-[#8b5cf6]/10" />
                        <span>완료됨</span>
                      </span>
                    ) : isActive ? (
                      <span className="flex items-center gap-2 text-[#8b5cf6] text-xs font-semibold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-ping" />
                        <span>진행 중</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>다음 작업</span>
                      </span>
                    )}
                  </div>
                  
                  {/* Option controls */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className={`p-1.5 rounded-lg opacity-40 hover:opacity-100 transition-opacity ${isLight ? 'text-neutral-800' : 'text-[#cbc3d7]'}`}
                      title="할 일 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className={`p-1.5 rounded-lg opacity-40 hover:opacity-100 transition-opacity ${isLight ? 'text-[#8b5cf6]' : 'text-white'}`}
                      title={isCompleted ? '진행중으로 재변경' : '완료로 표시'}
                    >
                      {isCompleted ? <Undo2 size={16} /> : <CheckSquare size={16} />}
                    </button>
                  </div>
                </div>

                {/* Task Details */}
                <h3 className={`text-lg font-bold ${isCompleted ? 'line-through text-neutral-500' : isLight ? 'text-[#131b2e]' : 'text-white'}`}>
                  {task.title}
                </h3>
                <p className={`text-xs mt-1 leading-snug font-medium line-clamp-2 ${isCompleted ? 'text-neutral-500' : isLight ? 'text-neutral-500' : 'text-[#cbc3d7]'}`}>
                  {task.description}
                </p>

                {/* Progress Controls & Metadata */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-dashed border-neutral-500/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-neutral-500 text-xs font-semibold">
                      <Clock size={14} />
                      <span>{task.duration}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${task.priority === 'high' ? 'text-red-400' : 'text-neutral-500'}`}>
                      <Zap size={14} className={task.priority === 'high' ? 'fill-red-400/20' : ''} />
                      <span>{task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}</span>
                    </div>
                  </div>

                  {/* Circular & Linear Mini progress indicators */}
                  {isCompleted ? (
                    <span className="text-xs text-neutral-500 font-bold">{task.completedTime || '완료'}</span>
                  ) : isActive ? (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleUpdateProgress(task.id, -10)} 
                          className={`w-6 h-6 rounded bg-neutral-500/10 flex items-center justify-center text-xs font-bold shrink-0 ${isLight ? 'text-neutral-600' : 'text-[#dae2fd]'}`}
                        >
                          -
                        </button>
                        <button 
                          onClick={() => handleUpdateProgress(task.id, 10)} 
                          className={`w-6 h-6 rounded bg-neutral-500/10 flex items-center justify-center text-xs font-bold shrink-0 ${isLight ? 'text-neutral-600' : 'text-[#dae2fd]'}`}
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Circle gauge representation */}
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle className="text-neutral-500/10" cx="18" cy="18" fill="transparent" r="14" stroke="currentColor" strokeWidth="2.5" />
                          <circle 
                            className="text-[#8b5cf6] transition-all" 
                            cx="18" 
                            cy="18" 
                            fill="transparent" 
                            r="14" 
                            stroke="currentColor" 
                            strokeDasharray="88" 
                            strokeDashoffset={88 - (88 * task.progress) / 100} 
                            strokeWidth="2.5" 
                          />
                        </svg>
                        <span className="absolute text-[9px] font-bold text-[#8b5cf6]">{task.progress}%</span>
                      </div>
                    </div>
                  ) : (
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="w-9 h-9 rounded-full border border-neutral-500/10 hover:border-[#8b5cf6]/40 flex items-center justify-center text-[#cbc3d7] hover:text-[#8b5cf6] transition-all"
                    >
                      <Play size={14} className="fill-current ml-0.5" />
                    </motion.button>
                  )}
                </div>

                {/* Multi bar implementation for nested task models */}
                {task.progress > 0 && task.progress < 100 && !isCompleted && (
                  <div className="w-full mt-3 h-1 rounded-full overflow-hidden bg-neutral-500/10 shrink-0">
                    <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: `${task.progress}%` }} />
                  </div>
                )}

              </motion.div>
            );
          })}
        </AnimatePresence>

        {state.tasks.length === 0 && (
          <div className="text-center py-10 px-4 rounded-3xl border border-dashed border-neutral-500/20">
            <p className="text-sm text-neutral-500 font-medium">등록된 오늘 집중 프로토콜 일정이 없습니다.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-4 py-2 text-xs bg-[#8b5cf6]/10 text-[#8b5cf6] font-bold rounded-lg"
            >
              새 일정 추가하기
            </button>
          </div>
        )}
      </section>

      {/* Visual Breathing Space Banner with precise hotlink */}
      <section className={`rounded-[24px] overflow-hidden aspect-[16/9] bg-[#0b1326] relative group cursor-pointer shadow-xl border ${
        isLight ? 'border-[#dae2fd]/50 shadow-neutral-100' : 'border-white/5 shadow-black/20'
      }`}>
        <img 
          alt="Abstract AI Visualization" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuANkjLcNJB41D0TnaLHld5kymsuY4Wz_wYRYFjxvhosTL_tiysKmpkGDeomu3YyO2fw48PxIpM2hr8Z7ExiD6-MhEedDvuRL2yidhdeyc77wspmirOQCigYFlbcIDUVhAj-DSLJUrlnIDJNrVNuCvZ0vHVJunldRCijBiB-fkYNQpJE4QtA3IVjcVsJJEkACctSn9dMK1sYysFSW9PcJSZk7P6oUOWn5aByT9GRbLWxtPukuRgSsZwr_njWqSGBgC5bQA5seMkasqg"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326]/90 via-[#0b1326]/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 space-y-1">
          <p className="text-[10px] text-[#8b5cf6] font-extrabold uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={11} className="fill-current" />
            <span>AURA 인사이트</span>
          </p>
          <p className="text-sm font-semibold tracking-tight text-white leading-snug">
            "지금 5분간 휴식을 취하면 다음 대시보드 모션 검토 작업의 효율성이 22% 향상됩니다."
          </p>
        </div>
      </section>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.90 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-26 right-6 md:right-10 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#6d3bd7] rounded-full shadow-lg shadow-[#8b5cf6]/35 flex items-center justify-center text-white z-40 cursor-pointer"
        title="새 일정 추가"
      >
        <Plus size={28} />
      </motion.button>

      {/* TASK ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-md w-full rounded-[24px] p-6 relative z-10 shadow-2xl border ${
                isLight ? 'bg-white border-neutral-200 text-[#131b2e]' : 'bg-[#131b2e] border-white/10 text-[#dae2fd]'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-[#8b5cf6]"><Plus size={20} /></span>
                  새 집중 일정 추가
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-neutral-500/10 text-neutral-500"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500">할 일 제목</label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: UI 모션 경로 검토"
                    className={`w-full h-11 px-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] text-sm ${
                      isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-[#1e263a] border-[#494454]/40 text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500">목표 상세 설명</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="할 일의 세부 사항을 적어주세요."
                    className={`w-full h-20 p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] text-sm resize-none ${
                      isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-[#1e263a] border-[#494454]/40 text-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500">예상 소요 시간</label>
                    <input 
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="예: 30m, 1h 20m"
                      className={`w-full h-11 px-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] text-sm ${
                        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1e263a] border-[#494454]/40'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500">작업 중요도</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className={`w-full h-11 px-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] text-sm ${
                        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1e263a] border-[#494454]/40'
                      }`}
                    >
                      <option value="low">낮음 (Low)</option>
                      <option value="medium">중간 (Medium)</option>
                      <option value="high">높음 (High)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500">현재 상태</label>
                  <div className="flex bg-neutral-500/5 p-1 rounded-lg gap-1">
                    {(['upcoming', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`flex-1 py-2 text-xs font-semibold rounded ${
                          status === st 
                            ? 'bg-[#8b5cf6] text-white shadow-sm' 
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {st === 'upcoming' ? '다음 작업' : st === 'in_progress' ? '진행 중' : '완료됨'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-12 bg-neutral-500/10 text-neutral-500 text-sm font-semibold rounded-xl"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-12 bg-[#8b5cf6] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#8b5cf6]/25"
                  >
                    일정 만들기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
