import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Map, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Grid3X3,
  BarChart2,
  ListFilter
} from 'lucide-react';

interface AnalyticsViewProps {
  currentView: string;
}

export default function AnalyticsView({ currentView }: AnalyticsViewProps) {
  const [activeDateRange, setActiveDateRange] = useState<'week' | 'lastWeek' | 'month'>('week');
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; rate: number } | null>(null);

  if (currentView !== 'analytics') return null;

  // Render stats based on selected date range
  const stateByRange = {
    week: {
      avgRate: '82.4%',
      ratioText: '+2.8% vs 지난주',
      topCat: '운동 94%',
      topCatRatio: '주간 최고 기록',
      vulnerableHour: '오후 10시 - 12시',
      vulnerableDesc: '실패 빈도 높은 구역',
      trendLine: '5,85 18,65 34,70 50,42 66,55 82,25 95,15',
      radarPoints: '50,15 80,35 85,65 52,80 20,70 18,35'
    },
    lastWeek: {
      avgRate: '79.6%',
      ratioText: '+1.5% vs 지지난주',
      topCat: '공부 88%',
      topCatRatio: '집중도 집중 기간',
      vulnerableHour: '오후 3시 - 5시',
      vulnerableDesc: '피로 누적 주의 구간',
      trendLine: '5,78 18,72 34,50 50,60 66,48 82,32 95,22',
      radarPoints: '50,22 75,40 70,60 48,72 30,62 25,40'
    },
    month: {
      avgRate: '85.1%',
      ratioText: '+4.2% 이번 달 평균',
      topCat: '건강 96%',
      topCatRatio: '달성 지표 최우수',
      vulnerableHour: '오전 8시 - 10시',
      vulnerableDesc: '기상 직후 루틴 불규칙',
      trendLine: '5,90 18,55 34,45 50,30 66,28 82,20 95,10',
      radarPoints: '50,10 85,30 90,70 55,85 15,75 10,30'
    }
  };

  const currentStats = stateByRange[activeDateRange];

  // Heatmap helper configs
  const daysOfWeek = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  
  // Seed random-like numbers for heatmap density colors (24 hours x 7 days)
  const getCellDensityColor = (dayIndex: number, hour: number) => {
    // Generate a fixed but complex looking structure
    const val = (dayIndex * 3 + hour * 7) % 100;
    if (val < 20) return 'bg-[#eae6f4]';   // empty / zero
    if (val < 45) return 'bg-[#dcd8e5]';   // low density
    if (val < 70) return 'bg-[#c3c0ff]';   // medium density
    if (val < 88) return 'bg-[#4f46e5]/70 text-white'; // high density
    return 'bg-[#3525cd] text-white';                 // peak density
  };

  const getCellCompletionRate = (dayIndex: number, hour: number) => {
    return ((dayIndex * 4 + hour * 3) % 45) + 55;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB] font-sans">
      <div className="max-w-[1250px] mx-auto flex flex-col gap-6">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1b1b24] tracking-tight">상세 행동 패턴 분석</h2>
            <p className="text-xs text-[#777587] font-semibold mt-1">
              요일별, 시간 단위별 수행 로그를 정량적 매트릭스와 전방위 레이더 차트로 시각화합니다.
            </p>
          </div>

          {/* Date range dropdown controls */}
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] p-1.5 rounded-xl self-start shadow-sm">
            <button
              onClick={() => setActiveDateRange('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDateRange === 'week' ? 'bg-[#3525cd] text-white' : 'text-[#464555] hover:bg-[#F9FAFB]'
              }`}
            >
              이번 주
            </button>
            <button
              onClick={() => setActiveDateRange('lastWeek')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDateRange === 'lastWeek' ? 'bg-[#3525cd] text-white' : 'text-[#464555] hover:bg-[#F9FAFB]'
              }`}
            >
              지난 주
            </button>
            <button
              onClick={() => setActiveDateRange('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDateRange === 'month' ? 'bg-[#3525cd] text-white' : 'text-[#464555] hover:bg-[#F9FAFB]'
              }`}
            >
              이번 달
            </button>
          </div>
        </div>

        {/* Bento KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Success Rate */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] font-bold text-[#777587] uppercase tracking-wider mb-1">통합 목표 성공률</p>
              <h3 className="text-3xl font-extrabold text-[#1b1b24] mt-1">{currentStats.avgRate}</h3>
              <p className="text-xs font-bold text-[#006c49] flex items-center gap-0.5 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {currentStats.ratioText}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#e2dfff]/60 flex items-center justify-center text-[#3525cd] shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[#3525cd]" />
            </div>
          </div>

          {/* Card 2: Top Category */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] font-bold text-[#777587] uppercase tracking-wider mb-1">최우수 자기규율 영역</p>
              <h3 className="text-3xl font-extrabold text-[#3525cd] mt-1">{currentStats.topCat}</h3>
              <p className="text-xs font-bold text-[#777587] mt-2">
                {currentStats.topCatRatio}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f2fcf6] flex items-center justify-center text-[#006c49] shrink-0">
              <CheckCircle className="w-6 h-6 stroke-[#006c49]" />
            </div>
          </div>

          {/* Card 3: Vulnerable focus hours */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider mb-1">집중력 취약 시간대</p>
              <h3 className="text-3xl font-extrabold text-[#ba1a1a] mt-1">{currentStats.vulnerableHour}</h3>
              <p className="text-xs font-bold text-[#ba1a1a] flex items-center gap-0.5 mt-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                {currentStats.vulnerableDesc}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] shrink-0">
              <Clock className="w-6 h-6 stroke-[#ba1a1a]" />
            </div>
          </div>

        </div>

        {/* Heatmap with Interactive cells details */}
        <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 md:p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#eae6f4] pb-4">
            <h3 className="text-md font-bold text-[#1b1b24] flex items-center gap-1.5">
              <Grid3X3 className="w-5 h-5 text-[#3525cd]" />
              요일 및 시간 단위별 정밀 달성 밀도
            </h3>
            
            {/* Legend guide info */}
            <div className="flex items-center gap-3 text-[10px] text-[#777587] font-semibold">
              <span>미달성</span>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 bg-[#eae6f4] rounded-sm"></span>
                <span className="w-2.5 h-2.5 bg-[#dcd8e5] rounded-sm"></span>
                <span className="w-2.5 h-2.5 bg-[#c3c0ff] rounded-sm"></span>
                <span className="w-2.5 h-2.5 bg-[#4f46e5]/70 rounded-sm"></span>
                <span className="w-2.5 h-2.5 bg-[#3525cd] rounded-sm"></span>
              </div>
              <span>완전 이행</span>
            </div>
          </div>

          {/* Interactive info overlay if mouse is hovering cells */}
          <div className="h-7 mb-2 text-xs font-black text-[#3525cd] flex items-center justify-center bg-[#f5f2ff] rounded-lg">
            {hoveredCell ? (
              <span>✨ {hoveredCell.day} {hoveredCell.hour}시 정각: 통계 완료 달성률 {hoveredCell.rate}%</span>
            ) : (
              <span className="text-[#777587]/70 font-semibold">히트맵 사각형 위에 마우스를 올리면 세부 통계율을 추적합니다.</span>
            )}
          </div>

          <div className="overflow-x-auto w-full no-scrollbar">
            <div className="min-w-[700px] flex flex-col gap-1.5 mt-2">
              
              {/* Top Row hours tags indicator */}
              <div className="flex items-center gap-1 mb-1">
                <div className="w-16 shrink-0"></div>
                <div className="flex-1 grid grid-cols-24 gap-1 select-none text-[9px] font-bold text-[#777587] text-center">
                  {Array.from({ length: 24 }).map((_, h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              </div>

              {/* Rows iteration */}
              {daysOfWeek.map((day, dIdx) => (
                <div key={day} className="flex items-center gap-1">
                  {/* Left row header day of week */}
                  <span className="w-16 shrink-0 text-xs font-bold text-[#464555]">{day.substring(0, 3)}</span>
                  
                  {/* Grid cells representing 24 columns */}
                  <div className="flex-1 grid grid-cols-24 gap-1">
                    {Array.from({ length: 24 }).map((_, h) => {
                      const rate = getCellCompletionRate(dIdx, h);
                      return (
                        <div
                          key={h}
                          onMouseEnter={() => setHoveredCell({ day, hour: h, rate })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`aspect-square rounded-sm cursor-crosshair transition-all hover:scale-125 hover:ring-2 hover:ring-[#3525cd]/50 z-10 ${getCellDensityColor(dIdx, h)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Radar & Progress Table Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-4">
          
          {/* Radar Chart Polygon Vector Area (5 cols) */}
          <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-[#1b1b24] mb-3 flex items-center gap-1.5">
              <Map className="w-4 h-4 text-[#3525cd]" />
              전방위 균형 리포트 (Radar)
            </h3>
            
            <div className="flex-1 flex items-center justify-center min-h-[220px] relative">
              <svg className="w-56 h-56" viewBox="0 0 100 100">
                {/* Radial rings background representation */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Axes lines */}
                <line x1="50" y1="10" x2="50" y2="90" stroke="#eae6f4" strokeWidth="0.75" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="#eae6f4" strokeWidth="0.75" />
                <line x1="22" y1="22" x2="78" y2="78" stroke="#eae6f4" strokeWidth="0.5" />
                <line x1="22" y1="78" x2="78" y2="22" stroke="#eae6f4" strokeWidth="0.5" />

                {/* Metrics label coordinates text */}
                <text x="50" y="8" textAnchor="middle" className="text-[6px] font-bold fill-[#3525cd]">운동</text>
                <text x="88" y="32" textAnchor="start" className="text-[6px] font-bold fill-[#464555]">업무</text>
                <text x="91" y="68" textAnchor="start" className="text-[6px] font-bold fill-[#464555]">건강</text>
                <text x="50" y="95" textAnchor="middle" className="text-[6px] font-bold fill-[#3525cd]">공부</text>
                <text x="8" y="68" textAnchor="end" className="text-[6px] font-bold fill-[#464555]">명상</text>
                <text x="12" y="32" textAnchor="end" className="text-[6px] font-bold fill-[#464555]">독서</text>

                {/* Colored polygon mapped metrics */}
                <polygon 
                  points={currentStats.radarPoints} 
                  fill="#c3c0ff" 
                  fillOpacity="0.45" 
                  stroke="#3525cd" 
                  strokeWidth="1.5" 
                />

                {/* Mapped Points anchors */}
                {currentStats.radarPoints.split(' ').map((pt, i) => {
                  const [cx, cy] = pt.split(',');
                  return (
                    <circle 
                      key={i} 
                      cx={cx} 
                      cy={cy} 
                      r="2" 
                      fill="#3525cd" 
                      stroke="#ffffff" 
                      strokeWidth="0.75" 
                    />
                  );
                })}
              </svg>
            </div>
          </section>

          {/* Detailed stats table log list representing 7 cols */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-[#1b1b24] mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#006c49]" />
              행동 항목 상세 기록대장
            </h3>

            <div className="flex-1 overflow-x-auto w-full no-scrollbar">
              <table className="w-full text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-[#eae6f4] text-[10px] font-black text-[#777587] uppercase tracking-wider">
                    <th className="pb-3 pl-2">카테고리</th>
                    <th className="pb-3 text-center">등록 횟수</th>
                    <th className="pb-3 text-center">성공</th>
                    <th className="pb-3 text-center">실패율</th>
                    <th className="pb-3 text-right pr-2">달성도</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae6f4]/60 text-xs font-semibold text-[#1b1b24]">
                  {/* Row 1: 운동 */}
                  <tr className="hover:bg-[#F9FAFB]">
                    <td className="py-3 pl-2 flex items-center gap-2">🏋️ 운동</td>
                    <td className="py-3 text-center font-mono">14회</td>
                    <td className="py-3 text-center font-mono text-[#006c49]">13회</td>
                    <td className="py-3 text-center font-mono text-[#ba1a1a]">7%</td>
                    <td className="py-3 text-right pr-2 text-[#3525cd] font-black">94%</td>
                  </tr>
                  {/* Row 2: 업무 */}
                  <tr className="hover:bg-[#F9FAFB]">
                    <td className="py-3 pl-2 flex items-center gap-2">💻 업무</td>
                    <td className="py-3 text-center font-mono">20회</td>
                    <td className="py-3 text-center font-mono text-[#006c49]">16회</td>
                    <td className="py-3 text-center font-mono text-[#ba1a1a]">20%</td>
                    <td className="py-3 text-right pr-2 text-[#3525cd] font-black">80%</td>
                  </tr>
                  {/* Row 3: 공부 */}
                  <tr className="hover:bg-[#F9FAFB]">
                    <td className="py-3 pl-2 flex items-center gap-2">📚 공부</td>
                    <td className="py-3 text-center font-mono">15회</td>
                    <td className="py-3 text-center font-mono">10회</td>
                    <td className="py-3 text-center font-mono text-[#ba1a1a]">33%</td>
                    <td className="py-3 text-right pr-2 text-[#777587]">66%</td>
                  </tr>
                  {/* Row 4: 명상 */}
                  <tr className="hover:bg-[#F9FAFB]">
                    <td className="py-3 pl-2 flex items-center gap-2">🧘 명상</td>
                    <td className="py-3 text-center font-mono">8회</td>
                    <td className="py-3 text-center font-mono text-[#006c49]">8회</td>
                    <td className="py-3 text-center font-mono text-[#ba1a1a]">0%</td>
                    <td className="py-3 text-right pr-2 text-[#006c49] font-black">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
