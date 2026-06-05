/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Eye, 
  Menu,
  Activity,
  UserCheck,
  Check
} from 'lucide-react';
import { TaskItem, TaskPriority, TaskStatus } from '../types';

interface TasksViewProps {
  tasks: TaskItem[];
  onUpdateTask: (task: TaskItem) => void;
  onAddTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  theme: 'light' | 'dark';
}

export default function TasksView({ 
  tasks, 
  onUpdateTask, 
  onAddTask, 
  onDeleteTask, 
  theme 
}: TasksViewProps) {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const efficiencyRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 64;

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task-manual-${Date.now()}`,
      title: title.trim(),
      description: desc.trim() || 'Aura 워크 스펙 분석에 따른 마일스톤',
      status: 'upcoming',
      progress: 0,
      durationMinutes: duration,
      priority,
      category: '생산성'
    };

    onAddTask(newTask);
    setTitle('');
    setDesc('');
    setDuration(30);
    setPriority('medium');
    setIsAddingMode(false);
  };

  const handleToggleStatus = (task: TaskItem) => {
    let nextStatus: TaskStatus = 'completed';
    let nextProgress = 100;

    if (task.status === 'completed') {
      nextStatus = 'upcoming';
      nextProgress = 0;
    }

    onUpdateTask({
      ...task,
      status: nextStatus,
      progress: nextProgress
    });
  };

  const handleStartTask = (task: TaskItem) => {
    // Pause other active tasks first
    tasks.forEach(t => {
      if (t.status === 'active' && t.id !== task.id) {
        onUpdateTask({ ...t, status: 'upcoming' });
      }
    });

    onUpdateTask({
      ...task,
      status: 'active',
      progress: task.progress || 10
    });
  };

  const handlePauseTask = (task: TaskItem) => {
    onUpdateTask({
      ...task,
      status: 'upcoming'
    });
  };

  const handleIncrementProgress = (task: TaskItem) => {
    const currentProgress = task.progress || 0;
    const nextProgress = Math.min(currentProgress + 10, 100);
    const nextStatus: TaskStatus = nextProgress === 100 ? 'completed' : 'active';
    
    onUpdateTask({
      ...task,
      progress: nextProgress,
      status: nextStatus
    });
  };

  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'glass-card-dark' : 'bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] border border-slate-100';

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Overview Stats */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest leading-none">
              오늘의 개요
            </p>
            <h2 className={`text-2xl font-bold tracking-tight mt-1 ${textPrimary}`}>
              집중 프로토콜
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#8B5CF6]">{efficiencyRate}%</span>
            <p className="text-xs text-slate-400">진행 완료율</p>
          </div>
        </div>

        {/* Progress bar tracking metrics */}
        <div className="w-full h-2.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-full overflow-hidden transition-all">
          <div 
            style={{ width: `${efficiencyRate}%` }}
            className="h-full bg-gradient-to-r from-[#6b38d4] to-emerald-500 rounded-full transition-all duration-500"
          />
        </div>
      </section>

      {/* Task Creation Modal Block */}
      {isAddingMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddNewTask}
            id="add-task-modal"
            className={`${theme === 'dark' ? 'bg-[#131b2e] border-slate-800' : 'bg-white border-slate-100'} border rounded-[28px] p-6 w-full max-w-md space-y-4 shadow-xl z-50`}
          >
            <h4 className={`text-lg font-bold ${textPrimary}`}>새 몰입 작업 생성</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">제목</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 프로젝트 아키텍처 상세 설계"
                  className={`w-full h-11 px-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'} border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] text-sm`}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">설명</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="예: 뉴럴 데이터 및 전송 파이프 점검"
                  className={`w-full h-11 px-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'} border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] text-sm`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">소요 시간(분)</label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                    className={`w-full h-11 px-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'} border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] text-sm`}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">중요도</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className={`w-full h-11 px-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'} border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] text-sm`}
                  >
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingMode(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#8B5CF6] hover:bg-[#7c4ee0] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                생성하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List Grid/Rhythm */}
      <section className="flex flex-col gap-4">
        {tasks.map((task) => {
          const isActive = task.status === 'active';
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`${cardBg} rounded-3xl p-5 relative overflow-hidden transition-all duration-300 ${
                isActive ? 'border-l-4 border-l-[#8B5CF6]' : ''
              } ${isCompleted ? 'opacity-70' : ''}`}
            >
              {/* Header inside the card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isActive 
                      ? 'bg-violet-100 dark:bg-violet-950/40 text-[#8B5CF6]' 
                      : (isCompleted ? 'bg-slate-100 dark:bg-slate-900 text-slate-400' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600')
                  }`}>
                    <small className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#8B5CF6] animate-ping' : (isCompleted ? 'bg-slate-400' : 'bg-emerald-500')}`} />
                    <span>{isActive ? '진행 중' : (isCompleted ? '완료됨' : '다음 작업')}</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleStatus(task)}
                    title={isCompleted ? "활성 작업으로 변경" : "완료선 표시"}
                    className="p-1 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-emerald-500 fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    title="기록 소거"
                    className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title & info description */}
              <h3 className={`text-base font-bold ${textPrimary} ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h3>
              <p className={`text-sm mt-1 mb-6 ${textMuted} line-clamp-2`}>
                {task.description}
              </p>

              {/* Action Operations & Progress */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/70 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>{task.durationMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{task.priority === 'high' ? '높음' : (task.priority === 'low' ? '낮음' : '중간')}</span>
                  </div>
                </div>

                {/* Micro circular feedback / Play status triggers */}
                <div className="flex items-center gap-3">
                  {!isCompleted && (
                    <>
                      {isActive ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePauseTask(task)}
                            className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="일시 정지"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleIncrementProgress(task)}
                            className="bg-[#8B5CF6] hover:bg-[#7649da] text-white px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                            title="진행률 10% 증가"
                          >
                            +10%
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartTask(task)}
                          className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/40 text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white flex items-center justify-center shadow-sm transition-all active:scale-90 cursor-pointer"
                          title="집중 타이머 시작"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Circular progress small matching mockup */}
                  <div className="relative w-10 h-10 flex items-center justify-center font-geist select-none shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-slate-100 dark:text-slate-800" cx="20" cy="20" fill="transparent" r="15" stroke="currentColor" strokeWidth="2.5"></circle>
                      <circle className="text-[#8B5CF6]" cx="20" cy="20" fill="transparent" r="15" stroke="currentColor" strokeDasharray="94.2" strokeDashoffset={94.2 - (94.2 * (task.progress || 0)) / 100} strokeWidth="2.5"></circle>
                    </svg>
                    <span className="absolute text-[9px] font-bold text-[#8B5CF6]">{task.progress || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Visual Breathing Space Card at the Bottom */}
      <section className={`${cardBg} rounded-[24px] overflow-hidden min-h-[160px] relative group hover:shadow-lg transition-transform duration-500 border-none`}>
        <img
          alt="Abstract Aura digital brain art visualization"
          className="w-full h-full object-cover absolute inset-0 opacity-40 group-hover:scale-102 transition-transform duration-1000 select-none pointer-events-none"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuANkjLcNJB41D0TnaLHld5kymsuY4Wz_wYRYFjxvhosTL_tiysKmpkGDeomu3YyO2fw48PxIpM2hr8Z7ExiD6-MhEedDvuRL2yidhdeyc77wspmirOQCigYFlbcIDUVhAj-DSLJUrlnIDJNrVNuCvZ0vHVJunldRCijBiB-fkYNQpJE4QtA3IVjcVsJJEkACctSn9dMK1sYysFSW9PcJSZk7P6oUOWn5aByT9GRbLWxtPukuRgSsZwr_njWqSGBgC5bQA5seMkasqg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-[#0b1326]/20" />
        <div className="relative z-10 p-6 flex flex-col justify-end min-h-[180px] h-full space-y-1">
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest leading-none">
            Aura 인사이트
          </p>
          <p className="text-sm font-semibold text-white leading-relaxed pt-1">
            "지금 5분간 휴식을 취하면 다음 작업의 효율성이 22% 향상됩니다."
          </p>
        </div>
      </section>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={() => setIsAddingMode(true)}
        className="fixed right-6 bottom-24 md:bottom-12 w-14 h-14 bg-gradient-to-br from-[#6b38d4] to-[#3B82F6] hover:scale-105 rounded-full shadow-[0_8px_30px_rgba(109,59,215,0.3)] flex items-center justify-center text-white z-40 active:scale-95 transition-transform duration-150 cursor-pointer"
        title="할 일 직접 추가"
      >
        <Plus className="w-7 h-7 stroke-[2]" />
      </button>
    </div>
  );
}
