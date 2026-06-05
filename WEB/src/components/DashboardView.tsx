/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task, UserProfile } from '../types';
import { TODAY_STR, getRelativeDate } from '../data';
import {
  Plus, Clock, TrendingUp, Sparkles,
  Check, ChevronRight, ChevronLeft, MoreHorizontal,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  setTab: (tab: 'dashboard' | 'todos' | 'analytics' | 'coach') => void;
  onAddTaskClick: () => void;
  onQuickSummaryClick: () => void;
}

export default function DashboardView({ user, tasks, onToggleTask, setTab, onAddTaskClick }: DashboardViewProps) {
  const todayTasks        = tasks.filter(t => t.date === TODAY_STR);
  const activeTodayTasks  = todayTasks.filter(t => !t.completed && !t.failed);
  const completedTodayTasks = todayTasks.filter(t => t.completed);
  const totalRelevant     = todayTasks.filter(t => !t.failed).length;
  const successRate       = totalRelevant > 0 ? Math.round((completedTodayTasks.length / totalRelevant) * 100) : 75;

  const [hoveredTrendDay,   setHoveredTrendDay]   = React.useState<number | null>(null);
  const [hoveredCategory,   setHoveredCategory]   = React.useState<string | null>(null);
  const [coachIdx,          setCoachIdx]          = React.useState(0);

  /* ── Weekly trend ── */
  const getWeekDays = () => {
    const d = new Date().getDay();
    const off = d === 0 ? -6 : 1 - d;
    return ['월','화','수','목','금','토','일'].map((label, i) => ({
      label,
      date: getRelativeDate(off + i),
      fallback: i === (d === 0 ? 6 : d - 1) ? successRate : [58,successRate,65,54,60,50,61][i],
    }));
  };
  const trendData = getWeekDays().map(day => {
    const dt = tasks.filter(t => t.date === day.date);
    const c  = dt.filter(t => t.completed).length;
    return { ...day, rate: dt.length > 0 ? Math.round((c / dt.length) * 100) : day.fallback, completed: c, total: dt.length };
  });
  const pts = trendData.map((d, i) => ({ x: 40 + i * (720 / 6), y: 100 - (d.rate / 100) * 82 }));
  const linePath = pts.reduce((a, p, i) => i === 0 ? `M${p.x},${p.y}` : `${a} L${p.x},${p.y}`, '');
  const areaPath = pts.length ? `${linePath} L${pts[pts.length-1].x},100 L${pts[0].x},100 Z` : '';

  /* ── Categories ── */
  const cats = [
    { key:'Work',     label:'업무',    shade:'#5a6e38' },
    { key:'Meeting',  label:'미팅',    shade:'#c4674a' },
    { key:'Project',  label:'프로젝트', shade:'#7a8e52' },
    { key:'Research', label:'연구',    shade:'#d4895a' },
    { key:'Admin',    label:'운영',    shade:'#a4b878' },
    { key:'Other',    label:'기타',    shade:'#ecf0e4' },
  ].map(cat => {
    const ct = tasks.filter(t => t.category === cat.key);
    const cc = ct.filter(t => t.completed).length;
    return { ...cat, total: ct.length, completed: cc, pct: ct.length > 0 ? Math.round((cc/ct.length)*100) : 0 };
  });
  const maxCat = Math.max(...cats.map(c => c.total), 1);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f7f6f2]">
      <div className="p-5 space-y-4 max-w-[1600px] mx-auto animate-fadeIn">

        {/* ── Header ── */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <h2 className="text-[22px] font-bold text-[#1c1c14] tracking-tight leading-none">
              안녕하세요, {user.name}님
            </h2>
            <p className="text-[12px] text-[#9a9a86] mt-1">
              {new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long' })}
            </p>
          </div>
          {activeTodayTasks.length > 0 && (
            <span className="text-[12px] text-[#c4674a] bg-[#f8ede8] border border-[#e8c0b0] px-3 py-1 rounded-full font-medium">
              오늘 {activeTodayTasks.length}개 남음
            </span>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 성공률 */}
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#9a9a86] uppercase tracking-wide">오늘 성공률</p>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-[28px] font-bold text-[#1c1c14] leading-none">{successRate}</span>
                <span className="text-[13px] text-[#9a9a86]">%</span>
              </div>
            </div>
            <div className="relative w-11 h-11 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#e0ddd8" strokeWidth="9" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#5a6e38" strokeWidth="9" fill="none"
                  strokeDasharray="238.8"
                  strokeDashoffset={238.8 - (238.8 * successRate) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <TrendingUp className="absolute inset-0 m-auto w-3.5 h-3.5 text-[#1c1c14]" />
            </div>
          </div>

          {/* 연속 달성 */}
          <div className="card p-4">
            <p className="text-[11px] font-medium text-[#9a9a86] uppercase tracking-wide">연속 달성</p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[28px] font-bold text-[#1c1c14] leading-none">{user.streak}</span>
              <span className="text-[13px] text-[#9a9a86]">일</span>
            </div>
            <p className="text-[11px] text-[#2d7a3a] font-medium mt-1.5">↑ 이번 달 최고</p>
          </div>

          {/* 완료 */}
          <div className="card p-4">
            <p className="text-[11px] font-medium text-[#9a9a86] uppercase tracking-wide">완료 할 일</p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[28px] font-bold text-[#1c1c14] leading-none">{user.completedCount}</span>
              <span className="text-[13px] text-[#9a9a86]">/ {user.totalCount}</span>
            </div>
            <div className="w-full bg-[#edecea] rounded-full h-1 mt-2.5">
              <div className="bg-[#5a6e38] h-full rounded-full transition-all duration-1000"
                style={{ width: `${(user.completedCount / Math.max(user.totalCount,1)) * 100}%` }} />
            </div>
          </div>

          {/* AI 피드백 */}
          <button
            onClick={() => setTab('coach')}
            className="card p-4 text-left cursor-pointer hover:shadow-[0_3px_10px_rgba(26,26,20,0.10)] transition-shadow group"
          >
            <p className="text-[11px] font-medium text-[#9a9a86] uppercase tracking-wide">AI 피드백</p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[28px] font-bold text-[#1c1c14] leading-none">3</span>
              <span className="text-[13px] text-[#9a9a86]">건</span>
            </div>
            <p className="text-[11px] text-[#c4674a] font-medium mt-1.5 flex items-center gap-0.5 group-hover:underline">
              추천 보기 <ChevronRight className="w-3 h-3" />
            </p>
          </button>
        </div>

        {/* ── Middle ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">

          {/* 할 일 목록 */}
          <div className="xl:col-span-7 card flex flex-col xl:h-[460px] h-auto min-h-[300px]" style={{ minHeight: 0 }}>
            <div className="px-4 py-3 border-b border-[#ece9e3] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#1c1c14]">오늘 할 일</span>
                <span className="text-[11px] text-[#9a9a86] bg-[#ece9e3] px-2 py-0.5 rounded-full">
                  {activeTodayTasks.length}개 남음
                </span>
              </div>
              <button
                onClick={onAddTaskClick}
                className="flex items-center gap-1 text-[12px] text-[#1c1c14] font-medium hover:bg-[#edecea] px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 추가
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {todayTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 py-10">
                  <div className="w-10 h-10 rounded-full bg-[#edecea] flex items-center justify-center">
                    <Check className="w-5 h-5 text-[#9a9a86]" />
                  </div>
                  <p className="text-[13px] text-[#9a9a86]">오늘 할 일이 없습니다</p>
                  <button onClick={onAddTaskClick}
                    className="text-[12px] text-[#5a6e38] font-medium hover:underline cursor-pointer">
                    + 할 일 추가하기
                  </button>
                </div>
              ) : (
                <ul>
                  {todayTasks.slice(0, 7).map(task => (
                    <li
                      key={task.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                        task.completed ? 'opacity-40' :
                        task.failed   ? 'bg-[#fdf2f0]' :
                        'hover:bg-[#ece9e3]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        title={task.completed ? '클릭 시 실패로 변경' : task.failed ? '클릭 시 초기화' : '클릭 시 완료'}
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          task.completed ? 'bg-[#5a6e38] border-[#5a6e38]' :
                          task.failed    ? 'bg-[#f8ede8] border-[#c4674a]' :
                          'border-[#e0ddd8] hover:border-[#5a6e38] bg-white'
                        }`}
                      >
                        {task.completed && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        {task.failed    && <span className="text-[11px] font-semibold text-[#c4674a] leading-none">✕</span>}
                      </button>

                      <div className="flex-1 min-w-0" onClick={() => onToggleTask(task.id)}>
                        <p className={`text-[13px] truncate ${
                          task.completed || task.failed ? 'line-through text-[#9a9a86]' : 'text-[#1c1c14]'
                        }`}>
                          {task.title}
                        </p>
                        {(task.timeStart || task.aiRecommendation) && (
                          <p className="text-[11px] text-[#9a9a86] flex items-center gap-2 mt-0.5">
                            {task.timeStart && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {task.timeStart}{task.timeEnd ? `–${task.timeEnd}` : ''}
                              </span>
                            )}
                            {task.aiRecommendation && (
                              <span className="flex items-center gap-0.5 text-[#c4674a] font-medium">
                                <Sparkles className="w-3 h-3" />{task.aiRecommendation}
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[#9a9a86] bg-[#ece9e3] px-1.5 py-0.5 rounded font-medium uppercase">
                          {task.category}
                        </span>
                        {task.failed ? (
                          <span className="text-[11px] text-[#c4674a] bg-[#fde8e4] px-1.5 py-0.5 rounded font-medium">실패</span>
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === 'high'   ? 'bg-[#c4674a]' :
                            task.priority === 'medium' ? 'bg-[#c4674a]' : 'bg-[#e0ddd8]'
                          }`} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {todayTasks.length > 7 && (
              <div className="shrink-0 px-4 py-2.5 border-t border-[#ece9e3] flex items-center justify-between">
                <span className="text-[11px] text-[#9a9a86]">총 {todayTasks.length}개 중 7개 표시</span>
                <button
                  onClick={() => setTab('todos')}
                  className="text-[11px] text-[#1c1c14] font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  전체 보기 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* 오른쪽 */}
          <div className="xl:col-span-5 flex flex-col gap-3 xl:h-[460px] h-auto">

            {/* AI 코치 */}
            <div className="card p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c4674a]" />
                  <span className="text-[13px] font-semibold text-[#1c1c14]">AI 코치 추천</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    {[0,1].map(i => (
                      <button key={i} onClick={() => setCoachIdx(i)}
                        className={`h-1 rounded-full transition-all cursor-pointer ${
                          coachIdx === i ? 'w-4 bg-[#5a6e38]' : 'w-1.5 bg-[#e0ddd8] hover:bg-[#9a9a86]'
                        }`} />
                    ))}
                  </div>
                  <div className="flex border border-[#e0ddd8] rounded overflow-hidden">
                    <button onClick={() => setCoachIdx(p => p===0?1:0)}
                      className="px-1.5 py-1 text-[#9a9a86] hover:text-[#1c1c14] hover:bg-[#ece9e3] transition-colors cursor-pointer">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setCoachIdx(p => p===1?0:1)}
                      className="px-1.5 py-1 text-[#9a9a86] hover:text-[#1c1c14] hover:bg-[#ece9e3] transition-colors cursor-pointer">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                {coachIdx === 0 ? (
                  <div className="h-full flex flex-col justify-between bg-[#f7f6f2] rounded-md p-4 animate-fadeIn">
                    <div>
                      <p className="text-[13px] font-semibold text-[#1c1c14] mb-1.5">오전 집중 시간 활용 제안</p>
                      <p className="text-[12px] text-[#6b6b58] leading-relaxed">
                        최근 2주간 오전 10–12시 완료율이 가장 높습니다.
                        <strong className="text-[#1c1c14]"> '마케팅 리포트'</strong> 작성을 이 시간에 집중하는 것을 권장합니다.
                      </p>
                    </div>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('notify', { detail: '일정이 최적 시간대로 조정되었습니다.' }))}
                      className="self-end text-[11px] font-medium text-[#5a6e38] bg-[#ecf0e4] hover:bg-[#dce8c8] px-3 py-1.5 rounded-md transition-colors cursor-pointer mt-3"
                    >
                      일정 조정하기
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between bg-[#f7f6f2] rounded-md p-4 animate-fadeIn">
                    <div>
                      <p className="text-[13px] font-semibold text-[#1c1c14] mb-1.5">휴식 리마인더</p>
                      <p className="text-[12px] text-[#6b6b58] leading-relaxed">
                        연속 90분 이상 작업이 예정되어 있습니다. 미팅 전 15분 산책이 오후 집중도 향상에 도움이 됩니다.
                      </p>
                    </div>
                    <span className="self-end text-[11px] font-medium text-[#2d7a3a] bg-[#e4f0e4] px-3 py-1.5 rounded-md mt-3">
                      분석 완료
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 카테고리 차트 */}
            <div className="card p-4 flex flex-col h-[200px]">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                  <p className="text-[13px] font-semibold text-[#1c1c14]">부문별 점유율</p>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">카테고리별 완료 비중</p>
                </div>
                <button className="text-[#9a9a86] hover:text-[#6b6b58] p-1 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 flex items-end gap-2 justify-between px-1">
                {cats.map(cat => {
                  const hasData = cat.total > 0;
                  const hPct   = hasData ? Math.max(18, (cat.total / maxCat) * 100) : 0;
                  const fPct   = hasData ? cat.pct : 0;
                  return (
                    <div
                      key={cat.key}
                      className="flex-1 h-full flex flex-col items-center justify-end gap-1 group cursor-pointer relative"
                      onMouseEnter={() => setHoveredCategory(cat.key)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="w-full bg-[#ece9e3] rounded-t" style={{ height: '75%', position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end' }}>
                        {hasData ? (
                          <div style={{ height:`${hPct}%`, width:'100%', display:'flex', alignItems:'flex-end', overflow:'hidden' }}
                            className="bg-[#e0ddd8] rounded-t transition-all duration-500">
                            <div style={{ height:`${fPct}%`, width:'100%', backgroundColor: cat.shade }}
                              className="rounded-t transition-all duration-500 group-hover:opacity-80" />
                          </div>
                        ) : (
                          <div className="w-full h-0.5 bg-[#e0ddd8] absolute bottom-0" />
                        )}
                      </div>
                      {hoveredCategory === cat.key && hasData && (
                        <div className="absolute bottom-[88%] left-1/2 -translate-x-1/2 bg-[#5a6e38] text-white text-[11px] px-2 py-1.5 rounded-md shadow-level-2 pointer-events-none z-20 whitespace-nowrap text-center">
                          <p className="font-semibold">{cat.label}</p>
                          <p className="text-[#9a9a86] text-[11px] mt-0.5">{cat.completed}/{cat.total}개 ({fPct}%)</p>
                        </div>
                      )}
                      <span className="text-[11px] font-medium text-[#9a9a86] group-hover:text-[#6b6b58] transition-colors truncate max-w-full">
                        {cat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── 주간 추이 ── */}
        <div className="card p-4 pb-6 h-[220px]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[13px] font-semibold text-[#1c1c14]">주간 완수 추이</p>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">지난 7일 완료 흐름</p>
            </div>
            <button className="text-[#9a9a86] hover:text-[#6b6b58] p-1 rounded transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full" style={{ height: 140 }}>
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 120">
              <line x1="30" y1="15" x2="770" y2="15" stroke="#edecea" strokeWidth="1" strokeDasharray="3,4" />
              <line x1="30" y1="58" x2="770" y2="58" stroke="#edecea" strokeWidth="1" strokeDasharray="3,4" />
              <line x1="30" y1="100" x2="770" y2="100" stroke="#e0ddd8" strokeWidth="1" />

              <defs>
                <linearGradient id="oliveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#5a6e38" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#5a6e38" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#oliveGrad)" />
              <path d={linePath} fill="none" stroke="#5a6e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={hoveredTrendDay===i ? 5 : 3}
                    fill="white" stroke="#5a6e38" strokeWidth="2"
                    className="transition-all duration-150" />
                  {hoveredTrendDay===i && <circle cx={p.x} cy={p.y} r="9" fill="#5a6e38" fillOpacity="0.08" />}
                </g>
              ))}

              {hoveredTrendDay !== null && pts[hoveredTrendDay] && (
                <g>
                  <rect
                    x={Math.max(10, Math.min(670, pts[hoveredTrendDay].x - 48))}
                    y={Math.max(2, pts[hoveredTrendDay].y - 38)}
                    width="96" height="28" rx="5" fill="#5a6e38" opacity="0.92"
                  />
                  <text
                    x={Math.max(58, Math.min(718, pts[hoveredTrendDay].x))}
                    y={Math.max(2, pts[hoveredTrendDay].y - 38) + 12}
                    textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
                    {trendData[hoveredTrendDay].label}: {trendData[hoveredTrendDay].rate}%
                  </text>
                  <text
                    x={Math.max(58, Math.min(718, pts[hoveredTrendDay].x))}
                    y={Math.max(2, pts[hoveredTrendDay].y - 38) + 24}
                    textAnchor="middle" fill="#9a9a86" fontSize="8">
                    {trendData[hoveredTrendDay].total > 0
                      ? `${trendData[hoveredTrendDay].completed}/${trendData[hoveredTrendDay].total}개`
                      : '데이터 없음'}
                  </text>
                </g>
              )}

              {pts.map((p, i) => (
                <rect key={`h${i}`} x={p.x-40} y="5" width="80" height="105"
                  fill="transparent" className="cursor-pointer"
                  onMouseEnter={() => setHoveredTrendDay(i)}
                  onMouseLeave={() => setHoveredTrendDay(null)} />
              ))}
            </svg>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-5 text-[11px] text-[#9a9a86] font-mono">
              {trendData.map((d, i) => (
                <span key={i} className={hoveredTrendDay===i ? 'text-[#1c1c14] font-semibold' : ''}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
