import React from 'react';
import { 
  Bell, 
  Search, 
  Flame, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  CheckSquare, 
  Clock, 
  Plus, 
  Activity,
  Heart,
  CalendarDays
} from 'lucide-react';
import { Todo, Insight, UserProfile, ViewType } from '../types';

interface DashboardViewProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  insights: Insight[];
  user: UserProfile;
  toggleTodoComplete: (id: string) => void;
  onAddNewTodo: () => void;
}

export default function DashboardView({ 
  currentView, 
  setView, 
  todos, 
  setTodos,
  insights, 
  user,
  toggleTodoComplete,
  onAddNewTodo
}: DashboardViewProps) {
  if (currentView !== 'dashboard') return null;

  // Filter today's items
  const todayTodos = todos.filter(t => t.date === '오늘');
  const totalToday = todayTodos.length;
  const completedToday = todayTodos.filter(t => t.completed).length;
  
  // Calculate today success rate
  const successRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Filter pending insights
  const pendingInsightsCount = insights.filter(i => i.status === 'pending').length;

  // Adaptive message based on custom instructions
  const isPresident = user.customInstruction.includes('대표님');
  const greetingName = isPresident ? `${user.name} 대표님` : `${user.name}님`;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        
        {/* Top Header Row with Welcome text and action items */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <p className="text-[11px] font-bold text-[#777587] uppercase tracking-wider mb-1">
              {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
            <h2 className="text-3xl font-extrabold text-[#1b1b24] tracking-tight">
              안녕하세요, {greetingName}
            </h2>
            <div className="flex items-center gap-2 bg-[#f0ecf9] border border-[#dad7ff] px-4 py-1.5 rounded-full w-fit mt-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#3525cd] shrink-0" />
              <p className="text-xs font-bold text-[#3525cd]">
                오늘은 {totalToday - completedToday}개의 할 일이 더 지연 중입니다. 오전 집중도가 탄탄한 흐름이에요.
              </p>
            </div>
          </div>

          {/* Icon control drawer & avatar banner */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => {
                const searchQ = prompt('검색할 할 일 키워드를 입력해 주세요:');
                if (searchQ) {
                  const items = todos.filter(t => t.title.includes(searchQ));
                  alert(`"${searchQ}" 검색 결과: ${items.length}개 발견함`);
                  setView('todos');
                }
              }}
              className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#464555] hover:text-[#3525cd] hover:border-[#3525cd]/40 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => alert('이메일 알림 보드: 새로운 AI 가이드 3건 분석이 보고되었습니다.')}
              className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#464555] hover:text-[#3525cd] hover:border-[#3525cd]/40 transition-all cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
            </button>
            <img 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border border-[#c7c4d8] shadow-sm select-none cursor-pointer hover:opacity-90"
              src={user.avatar} 
            />
          </div>
        </div>

        {/* Quick Stats Grid Bento matching design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Success Rate */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div>
              <p className="text-[11px] font-bold text-[#777587] mb-1 leading-none uppercase tracking-wider">Today's Success Rate</p>
              <h3 className="text-3xl font-extrabold text-[#1b1b24] mt-1">{successRate}%</h3>
            </div>
            
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                <path 
                  className="text-[#f5f2ff]" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3.5" 
                />
                <path 
                  className="text-[#3525cd] transition-all duration-500" 
                  strokeDasharray={`${successRate}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#3525cd]">
                {successRate}%
              </span>
            </div>
          </div>

          {/* Card 2: Streak Index */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#ffddb8] text-[#2a1700] flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-6 h-6 stroke-[#684000] fill-[#ffb95f]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#777587] mb-1 leading-none uppercase tracking-wider">Weekly Streak</p>
              <h3 className="text-xl font-extrabold text-[#1b1b24] mt-1">7일 연속</h3>
            </div>
          </div>

          {/* Card 3: Completion scale */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-end mb-2.5">
              <div>
                <p className="text-[11px] font-bold text-[#777587] mb-1 leading-none uppercase tracking-wider">This Week</p>
                <h3 className="text-xl font-extrabold text-[#1b1b24] mt-1">18/24</h3>
              </div>
              <Activity className="w-5 h-5 text-[#006c49]" />
            </div>
            <div className="w-full h-2 bg-[#eae6f4] rounded-full overflow-hidden">
              <div className="h-full bg-[#006c49] w-3/4 rounded-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Card 4: AI Insights count */}
          <button 
            onClick={() => setView('coach')}
            className="bg-gradient-to-br from-[#e2dfff] to-[#f5f2ff] rounded-2xl p-5 border-2 border-[#c3c0ff] flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-[#3525cd] text-white flex items-center justify-center shrink-0 shadow-md">
              <Lightbulb className="w-6 h-6 stroke-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#3525cd] mb-1 leading-none uppercase tracking-wider">New Insights</p>
              <h3 className="text-xl font-extrabold text-[#3525cd] mt-1">{pendingInsightsCount}개 도착</h3>
            </div>
          </button>
        </div>

        {/* Interactive Layout Area split in columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block Widget: "오늘 할 일" snippet checklist representing 8 cols */}
          <section className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
            
            <div className="p-5 border-b border-[#eae6f4] flex justify-between items-center bg-white sticky top-0">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#1b1b24]" />
                <h3 className="text-md font-bold text-[#1b1b24]">오늘 할 일</h3>
              </div>
              <button 
                onClick={() => setView('todos')}
                className="text-xs font-bold text-[#3525cd] hover:text-[#4f46e5] hover:underline"
              >
                전체 보기
              </button>
            </div>

            <div className="p-3 flex-1 flex flex-col gap-1 overflow-y-auto max-h-[300px]">
              {todayTodos.length === 0 ? (
                <div className="text-center py-12 text-[#777587] text-sm font-medium">
                  오늘 남은 할 일이 전혀 없습니다! 새로운 하루 계획을 추가하세요.
                </div>
              ) : (
                todayTodos.map((todo) => {
                  let badgeColors = 'bg-[#f0ecf9] text-[#3525cd]';
                  if (todo.category === '운동') badgeColors = 'bg-[#eae6f4] text-[#464555]';
                  if (todo.category === '건강') badgeColors = 'bg-[#ffdad6] text-[#ba1a1a]';
                  if (todo.category === '독서') badgeColors = 'bg-[#6cf8bb]/30 text-[#00714d]';

                  return (
                    <div 
                      key={todo.id}
                      className="group flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f0ecf9]/40 hover:translate-x-1.5 duration-200 transition-all border-b border-[#eae6f4]/40"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <input 
                          type="checkbox" 
                          checked={todo.completed}
                          onChange={() => toggleTodoComplete(todo.id)}
                          className="w-5 h-5 border-2 border-[#c7c4d8] text-[#3525cd] rounded-md focus:ring-[#3525cd]/30 cursor-pointer accent-[#3525cd]"
                        />
                        <div className="flex flex-col">
                          <span className={`text-[13px] font-bold ${
                            todo.completed ? 'text-[#777587] line-through font-medium' : 'text-[#1b1b24]'
                          }`}>
                            {todo.title}
                          </span>
                          {todo.notes && (
                            <span className="text-[11px] text-[#777587] mt-0.5 font-medium line-clamp-1">{todo.notes}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColors}`}>
                          {todo.category}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-[#777587] w-12 text-right flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-[#777587]/70" />
                          {todo.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-[#E5E7EB] bg-[#fcf8ff]">
              <button 
                onClick={onAddNewTodo}
                className="w-full py-2.5 border border-[#dad7ff] bg-white text-[#3525cd] font-bold text-xs rounded-xl hover:bg-[#f5f2ff] hover:border-[#3525cd]/40 transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                할 일 추가
              </button>
            </div>
          </section>

          {/* Right Block Widget: "AI 코치 추천" card matching 4 cols */}
          <section className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-2xl border-2 border-[#dad7ff] shadow-sm flex-1 flex flex-col relative overflow-hidden group hover:shadow-md transition-all duration-300">
              {/* Abs decoration backdrop */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#dad7ff]/50 opacity-40 rounded-full blur-3xl pointer-events-none group-hover:scale-110 duration-700 transition-transform"></div>
              
              <div className="p-5 border-b border-[#eae6f4] flex items-center gap-2 z-10 bg-white">
                <Sparkles className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-md font-bold text-[#1b1b24]">AI 코치 추천</h3>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center z-10 bg-gradient-to-b from-white to-[#f5f2ff]/20">
                <p className="text-sm md:text-base text-[#464555] leading-relaxed mb-6 font-medium">
                  {isPresident ? `대표님, ` : ''}최근 밤 10시 이후 등록한 {user.aiExpertise[0] || '공부'} 작업의 실패 빈도가 높습니다. 더 나은 리듬을 위해 주요 집중 업무는 <strong className="text-[#3525cd] bg-[#e2dfff]/60 px-1.5 py-0.5 rounded font-black">오전 시간대</strong>로 이동해 보세요.
                </p>
                
                <button 
                  onClick={() => setView('coach')}
                  className="mt-auto px-4 py-2.5 bg-[#3525cd] text-white rounded-xl font-bold text-xs hover:bg-[#4f46e5] transition-all shadow-md shadow-[#3525cd]/10 flex items-center gap-2 self-start hover:-translate-y-0.5 cursor-pointer active:scale-95"
                >
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Visual Charts Row containing trend and categorical bar breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Trend chart card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 h-64 flex flex-col hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-[#1b1b24] mb-3 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#3525cd]" />
              이번 주 성공률 추이
            </h3>
            
            <div className="flex-1 w-full bg-[#fcf8ff] rounded-xl border border-dashed border-[#c7c4d8]/60 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#c3c0ff]/30 to-transparent"></div>
              
              {/* Customized Vector SVG chart */}
              <svg className="absolute inset-0 w-full h-full p-4" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Horizontal guide grids */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#dad7ff" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#dad7ff" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#dad7ff" strokeWidth="0.5" strokeDasharray="3,3" />

                {/* Spline area */}
                <path 
                  fill="url(#indigoGrad)" 
                  d="M 5,85 L 18,65 L 34,70 L 50,42 L 66,55 L 82,25 L 95,15 L 100,100 L 0,100 Z" 
                  opacity="0.15" 
                />
                
                {/* SVG glowing definitions */}
                <defs>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3525cd" />
                    <stop offset="100%" stopColor="#f5f2ff" />
                  </linearGradient>
                </defs>

                {/* Main line trend graph to simulate successRate fluctuation */}
                <polyline 
                  fill="none" 
                  points="5,85 18,65 34,70 50,42 66,55 82,25 95,15" 
                  stroke="#3525cd" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Bullet data indicators */}
                <circle cx="5" cy="85" fill="#ffffff" stroke="#3525cd" strokeWidth="2.5" r="3"></circle>
                <circle cx="18" cy="65" fill="#ffffff" stroke="#3525cd" strokeWidth="2.5" r="3"></circle>
                <circle cx="34" cy="70" fill="#ffffff" stroke="#3525cd" strokeWidth="2.5" r="3"></circle>
                <circle cx="50" cy="42" fill="#3525cd" stroke="#ffffff" strokeWidth="2" r="4.5" className="animate-ping"></circle>
                <circle cx="50" cy="42" fill="#3525cd" stroke="#ffffff" strokeWidth="2" r="3.5"></circle>
                <circle cx="66" cy="55" fill="#ffffff" stroke="#3525cd" strokeWidth="2.5" r="3"></circle>
                <circle cx="82" cy="25" fill="#ffffff" stroke="#3525cd" strokeWidth="2.5" r="3"></circle>
                <circle cx="95" cy="15" fill="#3525cd" stroke="#ffffff" strokeWidth="2.5" r="4.5"></circle>
              </svg>

              {/* X Axis label array */}
              <div className="absolute bottom-1 left-0 right-0 flex justify-between px-5 text-[10px] text-[#777587] font-semibold">
                <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span>
              </div>
            </div>
          </div>

          {/* Category Success Breakdown card using exact values */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 h-64 flex flex-col hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-[#1b1b24] mb-4 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#ba1a1a]" />
              전체 카테고리별 달성률
            </h3>
            
            <div className="flex-1 flex flex-col justify-around py-1">
              {/* Category Bar: 운동 */}
              <div className="flex items-center gap-3">
                <span className="w-10 text-[11px] font-bold text-[#464555] text-right">운동</span>
                <div className="flex-1 h-2.5 bg-[#eae6f4] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#3525cd] rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="w-8 text-[11px] font-extrabold text-[#3525cd] text-right">85%</span>
              </div>

              {/* Category Bar: 업무 */}
              <div className="flex items-center gap-3">
                <span className="w-10 text-[11px] font-bold text-[#464555] text-right">업무</span>
                <div className="flex-1 h-2.5 bg-[#eae6f4] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#3525cd] rounded-full opacity-90" style={{ width: '70%' }}></div>
                </div>
                <span className="w-8 text-[11px] font-extrabold text-[#3525cd] text-right">70%</span>
              </div>

              {/* Category Bar: 공부 */}
              <div className="flex items-center gap-3">
                <span className="w-10 text-[11px] font-bold text-[#464555] text-right">공부</span>
                <div className="flex-1 h-2.5 bg-[#eae6f4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#c3c0ff] rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="w-8 text-[11px] font-extrabold text-[#777587] text-right">45%</span>
              </div>

              {/* Category Bar: 건강 */}
              <div className="flex items-center gap-3">
                <span className="w-10 text-[11px] font-bold text-[#464555] text-right">건강</span>
                <div className="flex-1 h-2.5 bg-[#eae6f4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006c49] rounded-full opacity-80" style={{ width: '90%' }}></div>
                </div>
                <span className="w-8 text-[11px] font-extrabold text-[#006c49] text-right">90%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
