/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task, UserProfile } from '../types.ts';
import { TODAY_STR, getDeadlineInfo, getRelativeDate } from '../data.ts';
import { Plus, Clock, Check, ChevronRight, Sparkles, Flame, ArrowRight, CalendarClock } from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  setTab: (tab: 'dashboard' | 'todos' | 'analytics' | 'coach') => void;
  onAddTaskClick: () => void;
  onQuickSummaryClick: () => void;
}

export default function DashboardView({ user, tasks, onToggleTask, setTab, onAddTaskClick }: DashboardViewProps) {
  const todayTasks          = tasks.filter(t => t.date === TODAY_STR);
  const activeTodayTasks    = todayTasks.filter(t => !t.completed && !t.failed);
  const completedTodayTasks = todayTasks.filter(t => t.completed);
  const totalRelevant       = todayTasks.filter(t => !t.failed).length;
  const successRate         = totalRelevant > 0 ? Math.round((completedTodayTasks.length / totalRelevant) * 100) : 0;

  // 가장 먼저 할 일 (시작 시간 기준)
  const nextTask = [...activeTodayTasks].sort(
    (a, b) => (a.timeStart || '99:99').localeCompare(b.timeStart || '99:99')
  )[0];

  // 다가오는 마감 (마감일 있는 미완료 할 일, 마감 가까운 순)
  const upcoming = tasks
    .filter(t => t.status !== 'done' && !t.failed && t.deadline)
    .sort((a, b) => (a.deadline as string).localeCompare(b.deadline as string))
    .slice(0, 4);

  // 이번 주(월~일) 요일별 분포
  const dow = new Date().getDay(); // 0=일
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const ds = getRelativeDate(mondayOffset + i);
    const dayTasks = tasks.filter(t => t.date === ds);
    return {
      ds,
      label: ['월', '화', '수', '목', '금', '토', '일'][i],
      dayNum: Number(ds.slice(-2)),
      total: dayTasks.length,
      done: dayTasks.filter(t => t.completed).length,
    };
  });

  const C = 238.8; // 2πr (r=38)

  return (
    <div className="flex-1 overflow-hidden bg-[#f7f6f2] flex flex-col">
      <div className="px-6 py-5 max-w-[1280px] mx-auto w-full flex-1 min-h-0 flex flex-col animate-fadeIn">

        {/* ── HERO: 임팩트 있는 오늘 요약 배너 ── */}
        <div
          data-keep-color
          className="relative overflow-hidden rounded-2xl p-5 mb-4 text-white shadow-level-2 shrink-0"
          style={{ background: 'linear-gradient(135deg, #2c3420 0%, #3a4628 55%, #282e1c 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 88% 15%, rgba(164,184,120,0.18) 0%, transparent 55%)' }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* 좌: 진행 링 + 인사 */}
            <div className="flex items-center gap-5">
              <div className="relative w-[88px] h-[88px] shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.15)" strokeWidth="9" fill="none" />
                  <circle cx="50" cy="50" r="38" stroke="#a4b878" strokeWidth="9" fill="none"
                    strokeDasharray={C}
                    strokeDashoffset={C - (C * successRate) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-bold leading-none">{successRate}%</span>
                </div>
              </div>

              <div>
                <p className="text-[12px] text-white/55 font-medium">
                  {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                </p>
                <h2 className="text-[21px] font-bold tracking-tight leading-snug mt-0.5 font-display">
                  {user.name}님, {activeTodayTasks.length > 0 ? `오늘 ${activeTodayTasks.length}개 남았어요` : '오늘 다 끝냈어요 🎉'}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-[12px] text-white/70 font-medium">
                  <span>완료 {completedTodayTasks.length}/{totalRelevant}</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-[#e0a06a]" />{user.streak}일 연속</span>
                </div>
              </div>
            </div>

            {/* 우: 지금 집중할 일 + CTA */}
            {nextTask ? (
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 md:w-[280px] backdrop-blur-sm shrink-0">
                <p className="text-[11px] text-white/55 mb-1 font-semibold uppercase tracking-wide">지금 집중할 일</p>
                <p className="text-[14px] font-bold leading-snug line-clamp-2">{nextTask.title}</p>
                {nextTask.timeStart && (
                  <p className="text-[11px] text-white/60 flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3" />{nextTask.timeStart} 시작 예정
                  </p>
                )}
                <button
                  onClick={() => setTab('todos')}
                  className="mt-3 w-full py-2 bg-[#a4b878] hover:bg-[#b6c98a] text-[#1c1c14] rounded-lg text-[12px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 active:scale-97"
                >
                  바로 시작하기 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 md:w-[280px] shrink-0 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#a4b878]" />
                </div>
                <p className="text-[12px] text-white/80 font-medium leading-snug">오늘 할 일을 모두 끝냈어요. 잠시 쉬어가세요!</p>
              </div>
            )}
          </div>
        </div>

        {/* ── 오늘 할 일 + 코치 추천 ── */}
        <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

          {/* 메인: 오늘 할 일 */}
          <div className="lg:w-2/3 card flex flex-col min-h-0">
            <div className="px-5 py-4 border-b border-[#ece9e3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-[#1c1c14] font-display">오늘 할 일</span>
                <span className="text-[11px] text-[#9a9a86] bg-[#ece9e3] px-2 py-0.5 rounded-full font-medium">
                  {completedTodayTasks.length}/{totalRelevant}
                </span>
              </div>
              <button
                onClick={onAddTaskClick}
                className="flex items-center gap-1 text-[12px] text-white bg-[#5a6e38] hover:bg-[#4a5c2e] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 새 할 일
              </button>
            </div>

            <div className="p-2.5 flex-1 overflow-y-auto min-h-0">
              {todayTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="w-12 h-12 rounded-full bg-[#edecea] flex items-center justify-center">
                    <Check className="w-6 h-6 text-[#9a9a86]" />
                  </div>
                  <p className="text-[13px] text-[#9a9a86]">오늘 할 일이 없습니다</p>
                  <button onClick={onAddTaskClick} className="text-[12px] text-[#5a6e38] font-semibold hover:underline cursor-pointer">
                    + 할 일 추가하기
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {todayTasks.slice(0, 8).map(task => (
                    <li
                      key={task.id}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        task.completed ? 'opacity-40' :
                        task.failed   ? 'opacity-60 hover:opacity-90' :
                        'hover:bg-[#ece9e3]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        title={task.completed ? '클릭 시 진행 전으로' : task.failed ? '클릭 시 초기화' : '클릭 시 완료'}
                        className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          task.completed ? 'bg-[#5a6e38] border-[#5a6e38]' :
                          task.failed    ? 'bg-[#f8ede8] border-[#c4674a]' :
                          'border-[#e0ddd8] hover:border-[#5a6e38] bg-white'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        {task.failed    && <span className="text-[11px] font-semibold text-[#c4674a] leading-none">✕</span>}
                      </button>

                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onToggleTask(task.id)}>
                        <p className={`text-[13.5px] truncate ${
                          task.completed || task.failed ? 'line-through text-[#9a9a86]' : 'text-[#1c1c14] font-medium'
                        }`}>
                          {task.title}
                        </p>
                        {task.timeStart && !task.completed && !task.failed && (
                          <p className="text-[11px] text-[#9a9a86] flex items-center gap-0.5 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {task.timeStart}{task.timeEnd ? `–${task.timeEnd}` : ''}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[#9a9a86] bg-[#ece9e3] px-1.5 py-0.5 rounded font-medium uppercase">
                          {task.category}
                        </span>
                        {task.failed ? (
                          <span className="text-[11px] text-[#c4674a] font-semibold">실패</span>
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === 'high' ? 'bg-[#c4674a]' :
                            task.priority === 'medium' ? 'bg-[#d4895a]' : 'bg-[#e0ddd8]'
                          }`} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {todayTasks.length > 8 && (
              <div className="px-5 py-3 border-t border-[#ece9e3] flex items-center justify-between">
                <span className="text-[11px] text-[#9a9a86]">총 {todayTasks.length}개 중 8개 표시</span>
                <button
                  onClick={() => setTab('todos')}
                  className="text-[11px] text-[#1c1c14] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  전체 보기 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* 사이드: AI 코치 추천 */}
          <div className="lg:w-1/3 flex flex-col gap-4 min-h-0 overflow-y-auto">
            <button
              onClick={() => setTab('coach')}
              className="card p-5 text-left cursor-pointer hover:shadow-[0_3px_12px_rgba(26,26,20,0.10)] transition-shadow group flex flex-col gap-3"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c4674a]" />
                <span className="text-[13px] font-bold text-[#1c1c14] font-display">AI 코치 추천</span>
              </div>
              <div className="bg-[#f7f6f2] rounded-lg p-3.5">
                <p className="text-[12px] text-[#6b6b58] leading-relaxed">
                  {nextTask
                    ? <>가장 급한 <strong className="text-[#1c1c14]">'{nextTask.title}'</strong>부터 시작하면 오늘 흐름을 잡기 좋아요.</>
                    : <>모든 일정을 마쳤어요. 내일 계획을 미리 세워두면 시작이 가벼워집니다.</>}
                </p>
              </div>
              <span className="text-[12px] font-semibold text-[#5a6e38] flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                코치와 상담하기 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* 다가오는 마감 */}
            <div className="card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <CalendarClock className="w-4 h-4 text-[#5a6e38]" />
                <span className="text-[13px] font-bold text-[#1c1c14] font-display">다가오는 마감</span>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-[12px] text-[#9a9a86] py-2">마감 예정인 할 일이 없습니다.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {upcoming.map(t => {
                    const info = getDeadlineInfo(t.deadline);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab('todos')}
                        className="flex items-center gap-2 text-left hover:bg-[#f7f6f2] -mx-1.5 px-1.5 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        <span className="text-[12.5px] text-[#1c1c14] font-medium flex-grow truncate">{t.title}</span>
                        {info && (
                          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            info.overdue ? 'bg-[#c4674a] text-white'
                            : info.urgent ? 'bg-[#f8ede8] text-[#c4674a]'
                            : 'bg-[#f7f6f2] text-[#6b6b58]'
                          }`}>
                            {info.text}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 빠른 이동 */}
            <button
              onClick={() => setTab('analytics')}
              className="card p-5 text-left cursor-pointer hover:shadow-[0_3px_12px_rgba(26,26,20,0.10)] transition-shadow group flex items-center justify-between"
            >
              <div>
                <p className="text-[13px] font-bold text-[#1c1c14] font-display">분석 보기</p>
                <p className="text-[11px] text-[#9a9a86] mt-0.5">카테고리·완수 추이 등 통계</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9a9a86] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── 이번 주 한눈에 ── */}
        <div className="card p-4 mt-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-[#5a6e38]" />
              <span className="text-[13px] font-bold text-[#1c1c14] font-display">이번 주 한눈에</span>
            </div>
            <button
              onClick={() => setTab('todos')}
              className="text-[11px] text-[#9a9a86] hover:text-[#1c1c14] font-medium flex items-center gap-0.5 cursor-pointer"
            >
              달력 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(d => {
              const isToday = d.ds === TODAY_STR;
              const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
              return (
                <div
                  key={d.ds}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-colors ${
                    isToday ? 'border-[#5a6e38] bg-[#5a6e38]/5' : 'border-[#e0ddd8]'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${isToday ? 'text-[#5a6e38]' : 'text-[#9a9a86]'}`}>{d.label}</span>
                  <span className={`text-[16px] font-bold leading-none ${isToday ? 'text-[#5a6e38]' : 'text-[#1c1c14]'}`}>{d.dayNum}</span>
                  {d.total > 0 ? (
                    <div className="w-full flex flex-col items-center gap-1 mt-1">
                      <div className="w-full h-1.5 bg-[#edecea] rounded-full overflow-hidden">
                        <div className="h-full bg-[#5a6e38] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-[#9a9a86] font-medium tabular-nums">{d.done}/{d.total}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-[#cfccc4] mt-1.5 leading-none">·</span>
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
