/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Filter, 
  MoreVertical,
  Activity,
  Maximize2,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  Zap,
  Play,
  Pause,
  ListTodo,
  CheckCircle2,
  XCircle,
  PieChart
} from 'lucide-react';
import { MOCK_HOURLY_HEAT_DATA, getRelativeDate } from '../data';

import { Task } from '../types';
import { TODAY_STR } from '../data';

type AnalyticsTab = 'summary' | 'weekly_report' | 'hourly' | 'category' | 'pattern';

interface AnalyticsViewProps {
  tasks: Task[];
}

export default function AnalyticsView({ tasks }: AnalyticsViewProps) {
  // 실제 task 데이터 기반 통계
  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const failedTasks    = tasks.filter(t => t.failed).length;
  const successRate    = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayTasks     = tasks.filter(t => t.date === TODAY_STR);
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const todayRate      = todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('summary');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredHeatCell, setHoveredHeatCell] = useState<{ row: string; idx: number; val: number } | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedRowDate, setSelectedRowDate] = useState<string | null>(null);

  const getDynamicWeekRange = () => {
    const currentDay = new Date().getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const mon = new Date();
    mon.setDate(mon.getDate() + mondayOffset);
    const sun = new Date();
    sun.setDate(sun.getDate() + mondayOffset + 6);
    
    const format = (d: Date) => d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    return `이번 주: ${format(mon)} – ${format(sun)}`;
  };

  const [dateRange] = useState(getDynamicWeekRange());

  const getFormatRelative = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const tableData = [
    { 
      date: getFormatRelative(0), 
      tag1: 'Design System', 
      tag2: 'Meeting', 
      success: 60, 
      momentum: [40, 55, 50, 45, 60, 60],
      totalTasks: 5,
      completedTasks: 3,
      duration: '5.2시간',
      details: [
        { name: '컴포넌트 마크업 작업', category: 'Work', time: '오전 10:30', duration: '45분', status: 'done' },
        { name: 'OAuth 인증 세션 연동 모듈 오류 해결', category: 'Project', time: '오후 1:15', duration: '1.5시간', status: 'done' },
        { name: '팀 빌딩 피드백 수렴을 위한 데일리 스크럼', category: 'Meeting', time: '오후 4:00', duration: '30분', status: 'done' },
        { name: '데이터베이스 튜닝 최적화 계획 검토', category: 'Research', time: '오후 5:30', duration: '1시간', status: 'failed' },
        { name: '주간 분석 피드백 모듈 점검', category: 'Admin', time: '오후 6:00', duration: '30분', status: 'failed' }
      ],
      cognitiveBurden: '주의력 분산 보통 (작업 난이도 높음)',
      interruptionNotes: '계획한 과제 중 3개의 핵심 행동을 완수했으나 집중력 저하와 피로 누적으로 2개는 다음 세션으로 이전.'
    },
    { 
      date: getFormatRelative(-1), 
      tag1: 'Code Review', 
      tag2: null, 
      success: 60, 
      momentum: [30, 40, 60, 50, 60, 62],
      totalTasks: 5,
      completedTasks: 3,
      duration: '6.2시간',
      details: [
        { name: '백엔드 UI 접근성 CSS 코드리뷰 보완', category: 'Work', time: '오전 9:15', duration: '1시간', status: 'done' },
        { name: 'OAuth 인증 마이그레이션 백로그 통계 체크', category: 'Project', time: '오전 11:30', duration: '2시간', status: 'done' },
        { name: '시간 관리 타이머 훅 메모리 누수 수정', category: 'Work', time: '오후 3:00', duration: '1.2시간', status: 'failed' },
        { name: '클라이언트 사이드 테마 프리셋 렌더링 튜닝', category: 'Research', time: '오후 4:45', duration: '45분', status: 'done' },
        { name: '기본 도큐먼트 업데이트 작업', category: 'Admin', time: '오후 5:30', duration: '30분', status: 'failed' }
      ],
      cognitiveBurden: '주의력 분산 보통 (오후 3-4시 혼선)',
      interruptionNotes: '오후 3시에 긴급 연락으로 인해 집중 시간이 중단되어 계획 지연 발생.'
    },
    { 
      date: getFormatRelative(-2), 
      tag1: 'Planning', 
      tag2: 'Emails', 
      success: 50, 
      momentum: [50, 30, 45, 52, 48, 50],
      totalTasks: 4,
      completedTasks: 2,
      duration: '5.8시간',
      details: [
        { name: '주중 스프린트 기획 보드 마일스톤 관리', category: 'Project', time: '오전 10:00', duration: '2시간', status: 'done' },
        { name: '파이썬 백그라운드 쿼리 최적화 회의', category: 'Meeting', time: '오후 2:00', duration: '1시간', status: 'done' },
        { name: '밀린 이메일 및 백로그 티켓 행정 마감', category: 'Admin', time: '오후 4:30', duration: '1.5시간', status: 'failed' },
        { name: '디자인 구성 요소 세부 설계', category: 'Work', time: '오후 5:30', duration: '1시간', status: 'failed' }
      ],
      cognitiveBurden: '주의력 분산 다소 높음 (체력 일시 고갈)',
      interruptionNotes: '피로감 증가로 오후 집중 태스크의 일부를 미루고 리커버리로 전향.'
    }
  ];

  // 1. Math-synced Combined Trend Data List
  const daysOfWeekFull = [
    { label: '월', dateLabel: '월요일', volume: 12, rate: 58, volumeMax: 30 },
    { label: '화', dateLabel: '화요일', volume: 15, rate: 62, volumeMax: 30 },
    { label: '수', dateLabel: '수요일', volume: 16, rate: 65, volumeMax: 30 },
    { label: '목', dateLabel: '목요일', volume: 13, rate: 54, volumeMax: 30 },
    { label: '금', dateLabel: '금요일', volume: 18, rate: 60, volumeMax: 30 },
    { label: '토', dateLabel: '토요일', volume: 10, rate: 50, volumeMax: 30 },
    { label: '일', dateLabel: '일요일', volume: 12, rate: 61, volumeMax: 30 }
  ];

  // Plot mathematics calculation: Grid dimensions (viewBox = 0 0 700 240)
  // Left padding = 60, Right padding = 40, Top = 30, Bottom = 200
  const svgWidth = 700;
  const svgHeight = 240;
  const graphLeft = 60;
  const graphWidth = 600;
  const graphBottom = 200;
  const graphTop = 30;
  const graphHeight = graphBottom - graphTop; // 170

  const getPoints = () => {
    return daysOfWeekFull.map((day, idx) => {
      const x = graphLeft + idx * (graphWidth / 6);
      const y = graphBottom - (day.rate / 100) * graphHeight;
      return { x, y, day, idx };
    });
  };

  const points = getPoints();
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},${graphBottom} L ${points[0].x},${graphBottom} Z`
    : '';

  // 2. Mock Data for Category Tab
  const categoryStats = [
    { key: 'Work', label: '업무 (Work)', count: 14, completed: 12, rate: 85, fill: 'w-[85%]', color: 'bg-[#5a6e38]', progressColor: 'from-[#4F46E5] to-[#6366F1]' },
    { key: 'Meeting', label: '미팅 (Meeting)', count: 6, completed: 5, rate: 83, fill: 'w-[83%]', color: 'bg-[#5a6e38]', progressColor: 'from-[#1c1c14] to-[#1c1c14]' },
    { key: 'Project', label: '프로젝트 (Project)', count: 8, completed: 6, rate: 75, fill: 'w-[75%]', color: 'bg-[#5a6e38]', progressColor: 'from-[#5a6e38] to-[#4a5c2e]' },
    { key: 'Research', label: '리서치 (Research)', count: 5, completed: 4, rate: 80, fill: 'w-[80%]', color: 'bg-[#f7f6f2]', progressColor: 'from-[#f7f6f2] to-[#e0ddd8]' },
    { key: 'Admin', label: '기타/행정 (Admin)', count: 4, completed: 1, rate: 25, fill: 'w-[25%]', color: 'bg-[#c4674a]', progressColor: 'from-[#c4674a] to-[#c4674a]' },
    { key: 'Other', label: '개인/기타 (Other)', count: 3, completed: 2, rate: 66, fill: 'w-[66%]', color: 'bg-[#2d7a3a]', progressColor: 'from-[#2d7a3a] to-[#2d7a3a]' }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f7f6f2] animate-fadeIn text-[#1c1c14]">
      
      {/* Page Header & Tabs layout block */}
      <header className="sticky top-0 z-10 bg-[#f7f6f2]/95 backdrop-blur-md border-b border-[#e0ddd8] px-6 pt-5 pb-0">
        <div className="max-w-[1920px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div className="text-left w-full sm:w-auto">
              <h1 className="text-2xl font-bold font-display text-[#1c1c14] tracking-tight">분석</h1>
              <p className="text-xs font-semibold text-[#9a9a86] mt-0.5">할 일 완료 현황과 패턴을 확인합니다.</p>
            </div>
            
            {/* Date Picker trigger */}
            <div className="flex items-center">
              <div 
                className="flex items-center gap-2 bg-white border border-[#e0ddd8] px-3.5 py-1.5 rounded-lg shadow-sm text-xs font-bold text-[#1c1c14] cursor-default"
              >
                <Calendar className="text-[#9a9a86] w-3.5 h-3.5" />
                <span>{dateRange}</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-[#e0ddd8] overflow-x-auto whitespace-nowrap scrollbar-none">
            {(['summary', 'weekly_report', 'hourly', 'category', 'pattern'] as AnalyticsTab[]).map((tab) => {
              const labelKOR = 
                tab === 'summary' ? '일일 요약' : 
                tab === 'weekly_report' ? '주간 리포트' :
                tab === 'hourly' ? '시간대별' : 
                tab === 'category' ? '카테고리' : 
                '실패 패턴';
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 border-b-2 font-display text-[13px] font-bold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? 'border-[#5a6e38] text-[#1c1c14]' 
                      : 'border-transparent text-[#9a9a86] hover:text-[#1c1c14] hover:border-[#e0ddd8]'
                  }`}
                >
                  {labelKOR}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main Stats Scroll Area */}
      <div className="max-w-[1920px] w-full mx-auto px-6 py-6 space-y-6">
        
        {/* Row 1: Overview summaries cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Success */}
          <div className="bg-white border border-[#e0ddd8]/90 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:shadow-level-2 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-[#1c1c14] transform translate-x-3 -translate-y-3 group-hover:scale-105 transition-transform pointer-events-none">
              <span className="material-symbols-custom text-[110px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-left">
              <div className="w-8 h-8 rounded-full bg-[#ecf0e4] flex items-center justify-center text-[#2d7a3a]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider font-display">종합 완수율</h3>
            </div>
            
            <div className="flex items-baseline gap-2.5 text-left">
              <span className="text-3xl font-bold text-[#1c1c14] font-sans tracking-tight">{successRate}%</span>
              {successRate >= 70 && (
                <span className="text-[11px] font-semibold text-[#2d7a3a] flex items-center bg-[#ecf0e4] px-2 py-0.5 rounded-full">
                  양호 ▲
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#9a9a86] font-medium text-left mt-2">총 {totalTasks}개 중 {completedTasks}개 완료 ({failedTasks}개 실패)</p>
          </div>

          {/* Card 2: Best Category */}
          <div className="bg-white border border-[#e0ddd8]/90 rounded-xl p-6 shadow-sm hover:shadow-level-2 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4 text-left">
              <div className="w-8 h-8 rounded-full bg-[#edecea] flex items-center justify-center text-[#1c1c14]">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider font-display">집중 부문</h3>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-[#1c1c14] font-display">Deep Work 업무</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5a6e38] rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs font-semibold text-[#6b6b58] shrink-0">14시간 20분</span>
              </div>
            </div>
            <p className="text-[11px] text-[#9a9a86] font-medium text-left mt-3">가장 높은 몰입도 및 일정 성공 지속률</p>
          </div>

          {/* Card 3: AI Coach Insight Energy dip */}
          <div className="bg-[#edecea]/40 border-l-[3px] border-[#5a6e38] rounded-r-2xl rounded-l-md p-6 shadow-sm relative overflow-hidden text-left">
            <div className="absolute top-2.5 right-2.5 text-[#1c1c14]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#c4674a] border border-[#e0ddd8]">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-[11px] font-bold text-[#1c1c14] uppercase tracking-wider font-display">AI 코치 코멘트</h3>
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-[#1c1c14] font-display tracking-tight">오후 3시–4시 마의 구간</span>
              <span className="text-xs font-semibold text-[#6b6b58] mt-1">지속적인 성취 피크 정체 구간 분석됨</span>
            </div>
            <p className="text-[11px] text-[#9a9a86] leading-normal mt-2.5 font-sans">
              추천 피드백: 이 시점에는 중대한 업무보다 10분 스트레칭 및 이메일 답신 처리가 성취율을 방어합니다.
            </p>
          </div>
        </section>

        {/* Dynamic Tab Views Rendering */}
        
        {/* Tab 1: Comprehensive Summary View */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Stat Extra Details - Simple overview */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-xs text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">완료 성공률</span>
                <span className="text-lg font-semibold text-[#1c1c14] mt-1 block">{successRate}% 유지</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">전체 {totalTasks}개 기준</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-xs text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">오늘 성공률</span>
                <span className="text-lg font-semibold text-[#2d7a3a] mt-1 block">{todayRate}%</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">오늘 {todayTasks.length}개 중 {todayCompleted}개</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-xs text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">실패 기록</span>
                <span className="text-lg font-semibold text-[#c4674a] mt-1 block">{failedTasks}개</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">전체의 {totalTasks > 0 ? Math.round((failedTasks/totalTasks)*100) : 0}%</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-4.5 shadow-xs text-left">
                <span className="text-[11px] font-bold text-[#9a9a86] block uppercase tracking-wider font-mono">연속 성공 일수</span>
                <span className="text-lg font-semibold text-[#1c1c14] font-sans">3일 연속 성공</span>
                <p className="text-[12px] text-[#6b6b58] font-medium mt-1">누적 종합 성취 습관 60.8% 기록</p>
              </div>
            </section>

            {/* Side-by-Side Grid Layout: Trend Chart & Category share ratio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: SVG Interactive Trend (Col-span-7) */}
              <div className="lg:col-span-12 xl:col-span-7 bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left flex flex-col justify-between hover:shadow-level-2 transition-shadow">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-[#1c1c14] font-display flex items-center gap-1.5">
                        <TrendingUp className="w-4.5 h-4.5 text-[#1c1c14]" />
                        <span>성공률 추이 및 활동 총량 (주간 종합)</span>
                      </h2>
                      <p className="text-[12px] text-[#9a9a86] mt-0.5 font-medium">요일별 할 일 완료율과 계획 개수 비교</p>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase text-[#6b6b58] font-sans">
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-xs bg-[#f7f6f2] border border-[#e0ddd8]" />
                        <span>일정수량</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-0.5 bg-[#5a6e38] rounded-full" />
                        <span>완수율(%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Single Mathematically Unified Interactive SVG Graph */}
                  <div className="relative w-full mt-2 rounded-lg">
                    <svg className="w-full h-auto overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="xMidYMid meet">
                      {/* Grid Lines */}
                      <line x1={graphLeft} y1={graphTop} x2={graphLeft + graphWidth} y2={graphTop} stroke="#f7f6f2" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={graphLeft} y1={graphTop + graphHeight * 0.25} x2={graphLeft + graphWidth} y2={graphTop + graphHeight * 0.25} stroke="#f7f6f2" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={graphLeft} y1={graphTop + graphHeight * 0.5} x2={graphLeft + graphWidth} y2={graphTop + graphHeight * 0.5} stroke="#f7f6f2" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={graphLeft} y1={graphTop + graphHeight * 0.75} x2={graphLeft + graphWidth} y2={graphTop + graphHeight * 0.75} stroke="#f7f6f2" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={graphLeft} y1={graphBottom} x2={graphLeft + graphWidth} y2={graphBottom} stroke="#e0ddd8" strokeWidth="1.5" />

                      {/* Y Axis Labels for % (Left Hand) */}
                      <g className="font-mono text-[11px] fill-[#e0ddd8] font-bold select-none text-right">
                        <text x={graphLeft - 12} y={graphTop + 3} textAnchor="end">100%</text>
                        <text x={graphLeft - 12} y={graphTop + graphHeight * 0.25 + 3} textAnchor="end">75%</text>
                        <text x={graphLeft - 12} y={graphTop + graphHeight * 0.5 + 3} textAnchor="end">50%</text>
                        <text x={graphLeft - 12} y={graphTop + graphHeight * 0.75 + 3} textAnchor="end">25%</text>
                        <text x={graphLeft - 12} y={graphBottom + 3} textAnchor="end">0%</text>
                      </g>

                      {/* Y Axis Labels for Task Count Volume (Right Hand - scale 0 to 30 tasks max) */}
                      <g className="font-mono text-[11px] fill-[#e0ddd8] font-bold select-none">
                        <text x={graphLeft + graphWidth + 12} y={graphTop + 3} textAnchor="start">30개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphTop + graphHeight * 0.25 + 3} textAnchor="start">22개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphTop + graphHeight * 0.5 + 3} textAnchor="start">15개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphTop + graphHeight * 0.75 + 3} textAnchor="start">7개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphBottom + 3} textAnchor="start">0개</text>
                      </g>

                      {/* Definitions for gradient effects */}
                      <defs>
                        <linearGradient id="oliveStrokeFade" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5a6e38" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#5a6e38" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* 1. Draw Task Volume Bar Columns */}
                      {points.map((p) => {
                        const barHeight = (p.day.volume / p.day.volumeMax) * graphHeight;
                        const barY = graphBottom - barHeight;
                        const barWidth = 24;
                        const isHovered = hoveredTrendIndex === p.idx;

                        return (
                          <g key={`bar-${p.idx}`} className="transition-all duration-300">
                            <rect 
                              x={p.x - barWidth / 2} 
                              y={barY} 
                              width={barWidth} 
                              height={barHeight} 
                              rx="4"
                              ry="4"
                              fill={isHovered ? "#cbd5e1" : "#f7f6f2"} 
                              stroke={isHovered ? "#9a9a86" : "transparent"}
                              strokeWidth="1"
                              className="transition-colors duration-200"
                            />
                          </g>
                        );
                      })}

                      {/* 2. Success Rate Indigo Line Gradient Area Underneath */}
                      <path d={areaPath} fill="url(#oliveStrokeFade)" />

                      {/* 3. Actual Success Rate Line Path */}
                      <path d={linePath} fill="none" stroke="#5a6e38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {/* 4. Overlay Points Anchor Circles */}
                      {points.map((p) => {
                        const isHovered = hoveredTrendIndex === p.idx;
                        return (
                          <g key={`circle-${p.idx}`}>
                            <circle 
                              cx={p.x} 
                              cy={p.y} 
                              r={isHovered ? "7" : "5"} 
                              fill="white" 
                              stroke="#5a6e38" 
                              strokeWidth="3" 
                              className="transition-all duration-150"
                            />
                            {isHovered && (
                              <circle cx={p.x} cy={p.y} r="12" fill="#5a6e38" fillOpacity="0.12" />
                            )}
                          </g>
                        );
                      })}

                      {/* 5. Tooltip display popup logic inside SVG */}
                      {hoveredTrendIndex !== null && points[hoveredTrendIndex] && (
                        <g className="pointer-events-none transition-all duration-150">
                          <rect 
                            x={Math.max(20, Math.min(svgWidth - 165, points[hoveredTrendIndex].x - 70))} 
                            y={Math.max(5, points[hoveredTrendIndex].y - 65)} 
                            width="140" 
                            height="52" 
                            rx="8" 
                            fill="#0f172a" 
                            opacity="0.95" 
                          />
                          <text x={Math.max(90, Math.min(svgWidth - 95, points[hoveredTrendIndex].x))} y={Math.max(5, points[hoveredTrendIndex].y - 65) + 16} fill="#f7f6f2" fontSize="10px" fontWeight="bold" textAnchor="middle" className="font-sans">
                            {points[hoveredTrendIndex].day.dateLabel} 종합 지표
                          </text>
                          <text x={Math.max(90, Math.min(svgWidth - 95, points[hoveredTrendIndex].x))} y={Math.max(5, points[hoveredTrendIndex].y - 65) + 30} fill="#9a9a86" fontSize="10.5px" fontWeight="bold" textAnchor="middle" className="font-sans">
                            성공수치: {points[hoveredTrendIndex].day.rate}%
                          </text>
                          <text x={Math.max(90, Math.min(svgWidth - 95, points[hoveredTrendIndex].x))} y={Math.max(5, points[hoveredTrendIndex].y - 65) + 42} fill="#9a9a86" fontSize="8.5px" textAnchor="middle" className="font-mono font-medium">
                            공식 등록 과업: {points[hoveredTrendIndex].day.volume}건
                          </text>
                        </g>
                      )}

                      {/* 6. Big interactive vertical bounds to hover trigger */}
                      {points.map((p) => (
                        <rect 
                          key={`trigger-${p.idx}`}
                          x={p.x - 30}
                          y={graphTop}
                          width={60}
                          height={graphHeight + 10}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredTrendIndex(p.idx)}
                          onMouseLeave={() => setHoveredTrendIndex(null)}
                        />
                      ))}

                      {/* Horizontal Labels at Bottom */}
                      {points.map((p) => (
                        <text key={`label-${p.idx}`} x={p.x} y={graphBottom + 20} textAnchor="middle" fill={hoveredTrendIndex === p.idx ? "#1c1c14" : "#9a9a86"} fontSize="10px" fontWeight="bold" className="font-mono">
                          {p.day.label}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 bg-[#f7f6f2] border border-[#e0ddd8] p-2.5 rounded-xl text-[#6b6b58] text-[12px] font-bold leading-none">
                  <Info className="w-3.5 h-3.5 text-[#1c1c14] shrink-0" />
                  <span>마우스 호버 시 일자별 정확한 과업 개수 및 전사 연계 완수 비가 연동되어 안내됩니다.</span>
                </div>
              </div>

              {/* Right Column: Embedded Category Balance Ratio metrics (Col-span-5) */}
              <div className="lg:col-span-12 xl:col-span-5 bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left flex flex-col justify-between hover:shadow-level-2 transition-shadow">
                <div>
                  <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <PieChart className="w-4 h-4 text-[#2d7a3a]" />
                      <h3 className="text-sm font-semibold text-[#1c1c14] font-display">업무 영역별 밸런스 점유율</h3>
                    </div>
                    <span className="text-[11px] bg-[#edecea] border border-[#9a9a86] text-[#1c1c14] px-1.5 py-0.5 rounded font-semibold font-mono">
                      WEEKLY BALANCE
                    </span>
                  </div>

                  {/* 도넛 + 요약 */}
                  <div className="flex items-center gap-5 bg-[#f7f6f2] border border-[#e0ddd8] p-4 rounded-xl mb-4">
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" fill="transparent" stroke="#e0ddd8" strokeWidth="6" />
                        <circle cx="32" cy="32" r="24" fill="transparent" stroke="#5a6e38" strokeWidth="6"
                          strokeDasharray="67.858 150.796" strokeDashoffset="0" />
                        <circle cx="32" cy="32" r="24" fill="transparent" stroke="#2d7a3a" strokeWidth="6"
                          strokeDasharray="37.699 150.796" strokeDashoffset="-67.858" />
                        <circle cx="32" cy="32" r="24" fill="transparent" stroke="#c4674a" strokeWidth="6"
                          strokeDasharray="22.619 150.796" strokeDashoffset="-105.557" />
                        <circle cx="32" cy="32" r="24" fill="transparent" stroke="#9a9a86" strokeWidth="6"
                          strokeDasharray="22.619 150.796" strokeDashoffset="-128.176" />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-[16px] font-bold text-[#1c1c14] leading-none block">45%</span>
                        <span className="text-[10px] text-[#9a9a86] leading-none mt-0.5 block">최다</span>
                      </div>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[11px] text-[#9a9a86] block mb-1">주간 분포</span>
                      <span className="text-[14px] font-semibold text-[#1c1c14] block leading-snug">카테고리 비율 : 고른 편</span>
                      <p className="text-[12px] text-[#9a9a86] mt-1 leading-relaxed">여러 분야의 일정을 고르게 계획했습니다.</p>
                    </div>
                  </div>

                  {/* 진행바 */}
                  <div className="space-y-3">
                    {[
                      { name: '개발 및 엔지니어링', pct: '45%', color: 'bg-[#5a6e38]' },
                      { name: 'OAuth 인증 및 마이그레이션', pct: '25%', color: 'bg-[#2d7a3a]' },
                      { name: '시스템 점검',             pct: '15%', color: 'bg-[#c4674a]' },
                      { name: '기획 및 정비',             pct: '15%', color: 'bg-[#9a9a86]' },
                    ].map((dept, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[12px] text-[#6b6b58] truncate max-w-[200px]">{dept.name}</span>
                          <span className="text-[12px] font-semibold text-[#1c1c14] tabular-nums">{dept.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#edecea] rounded-full overflow-hidden">
                          <div className={`h-full ${dept.color} rounded-full`} style={{ width: dept.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 일일 분석 리포트 정밀 진단 모듈 추가 */}
            <section className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#1c1c14]" />
                  <h3 className="text-sm font-semibold text-[#1c1c14] font-display">시간대별 성공률 분석</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#e0ddd8] bg-[#f7f6f2]/50 font-mono text-[12px] font-semibold text-[#9a9a86] uppercase tracking-wider">
                      <th className="py-2.5 px-4 font-bold">시간대</th>
                      <th className="py-2.5 px-4 text-center font-bold">작업 완료율</th>
                      <th className="py-2.5 px-4 text-center font-bold">수행 과업수</th>
                      <th className="py-2.5 px-4 text-center font-bold">피로 상태</th>
                      <th className="py-2.5 px-4 font-bold">AI 진단 및 맞춤 추천 피드백</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0ddd8] text-[12px] font-semibold text-[#6b6b58] font-sans">
                    {[
                      {
                        time: "오전 시간대 (09:00 - 12:00)",
                        intensity: "96%",
                        intensityColor: "text-[#2d7a3a]",
                        switching: "12개 완료",
                        fatigue: "낮음 (쾌적)",
                        prescription: "가장 복잡하고 중요한 데이터베이스 스케일링 핵심 설계 및 인증 로직 배치가 성공적으로 완수되었습니다."
                      },
                      {
                        time: "오후 시간대 (13:00 - 15:00)",
                        intensity: "84%",
                        intensityColor: "text-[#1c1c14]",
                        switching: "8개 완료",
                        fatigue: "보통 (안정)",
                        prescription: "부차적인 To-Do 카드를 15분 단위로 잘게 슬라이싱 가동하여 업무 마스킹 전환 지연을 안전하게 방어했습니다."
                      },
                      {
                        time: "오후 리스크 (15:00 - 17:00)",
                        intensity: "42%",
                        intensityColor: "text-[#c4674a]",
                        switching: "3개 완료",
                        fatigue: "높음 (피로)",
                        prescription: "마의 구간으로 분석된 주의력 고갈 지점입니다. 10분 스트레칭 처방과 함께 가벼운 텍스트 작업 위주 배치를 추천합니다."
                      },
                      {
                        time: "저녁/야간 (18:00 - 21:00)",
                        intensity: "91%",
                        intensityColor: "text-[#1c1c14]",
                        switching: "10개 완료",
                        fatigue: "매우 낮음 (회복)",
                        prescription: "하루 과업들의 정적 회고록 작성 및 피어 피드백 수신 모듈이 동기화되며, 전체 성과가 깔끔하게 갈무리되었습니다."
                      }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#edecea]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#1c1c14]">{row.time}</td>
                        <td className={`py-3 px-4 text-center font-semibold ${row.intensityColor}`}>{row.intensity}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium text-[#6b6b58]">{row.switching}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium text-[#6b6b58]">{row.fatigue}</td>
                        <td className="py-3 px-4 text-[#6b6b58] font-semibold leading-relaxed">{row.prescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Part 3: Weekly Core Tasks Milestones Highlights */}
            <section className="bg-white border border-[#e0ddd8]/80 rounded-xl p-6 shadow-xs text-left">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#1c1c14]" />
                  <h3 className="text-sm font-semibold text-[#1c1c14] font-display">성과 하이라이트</h3>
                </div>
                <span className="text-[12px] bg-[#ecf0e4] text-[#2d7a3a] font-semibold px-2 py-0.5 rounded border border-[#c8d4a8] flex items-center gap-0.5 font-mono">
                  ● 완료 검정 필
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                {[
                  {
                    title: '1. 데이터베이스 최적화',
                    progress: 100,
                    status: '완료',
                    tags: ['Indexed', 'ScaleUp'],
                    desc: '과업 가중치 및 생산 진단용 종합 테이블 생성 속도를 15% 이상 가속하여 뷰포트 지연율을 방어 완료했습니다.',
                  },
                  {
                    title: '2. OAuth 인증 통합 연계 마이그레이션',
                    progress: 100,
                    status: '완료',
                    tags: ['Security', 'Vite'],
                    desc: '세션 토큰 만료 지장 방지를 위해 로컬 영구 유지 및 팀 프레임워크 상호 호환 마이그레이션 패치를 탑재했습니다.',
                  },
                  {
                    title: '3. 15분 단위 기획 작업',
                    progress: 80,
                    status: '진행중',
                    tags: ['Planning', 'Optimization'],
                    desc: '지엽적으로 산재한 과업 일정을 15분, 30분 카드로 자동 분해 연계 룸에 동기화하는 기능을 전개 보강 중입니다.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#f7f6f2] border border-[#e0ddd8] p-4.5 rounded-xl flex flex-col justify-between hover:border-[#e0ddd8] transition-all duration-200">
                    <div>
                      <div className="flex justify-between items-start gap-1 pb-2">
                        <h4 className="text-[12px] font-semibold text-[#1c1c14] font-sans tracking-tight leading-snug">{item.title}</h4>
                        <span className={`text-[11px] font-bold shrink-0 px-1.5 py-0.5 rounded-sm ${item.status === '완료' ? 'bg-[#2d7a3a] text-white' : 'bg-[#c4674a] text-[#1c1c14]'}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex gap-1 mb-2.5">
                        {item.tags.map((tg, key) => (
                          <span key={key} className="text-[11px] px-1.5 py-0.5 bg-white border border-[#e0ddd8] rounded text-[#6b6b58] font-mono font-semibold">{tg}</span>
                        ))}
                      </div>

                      <p className="text-[12px] text-[#6b6b58] leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Row 4: Spreadsheet historical performance details table */}
            <section className="bg-white border border-[#e0ddd8] rounded-xl overflow-hidden shadow-sm text-left">
              <div className="px-6 py-5 border-b border-[#e0ddd8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#f7f6f2]/50">
                <div>
                  <h2 className="text-sm font-semibold text-[#1c1c14] font-display">자가 진단</h2>
                  <p className="text-[12px] text-[#9a9a86] mt-0.5 font-semibold">날짜를 클릭하면 그날 완료한 일과 분석 피드백을 확인할 수 있습니다.</p>
                </div>
                <span className="text-[11px] text-[#1c1c14] font-semibold flex items-center gap-1.5 border border-[#9a9a86]/65 bg-[#edecea]/50 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto font-mono">
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>행 클릭 시 심층 분석 활성화</span>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-[#e0ddd8] bg-[#f7f6f2]/30 font-mono text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider select-none">
                      <th className="py-3 px-6">완수 일자</th>
                      <th className="py-3 px-6">주요 성취 요약 태스크</th>
                      <th className="py-3 px-6 text-center">당일 최종 완수율</th>
                      <th className="py-3 px-6">성취 모멘텀 (7일 스파크라인)</th>
                      <th className="py-3 px-4 text-center">동기 상세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0ddd8] text-xs font-semibold text-[#1c1c14]">
                    {tableData.map((row) => {
                      const isExpanded = selectedRowDate === row.date;
                      return (
                        <React.Fragment key={row.date}>
                          <tr 
                            onClick={() => setSelectedRowDate(isExpanded ? null : row.date)}
                            className="hover:bg-[#edecea]/70 transition-colors group cursor-pointer border-b border-[#e0ddd8]"
                          >
                            <td className="py-4 px-6 font-bold text-[#1c1c14] flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${row.success === 100 ? 'bg-[#2d7a3a]' : 'bg-[#1c1c14]'}`} />
                              <span>{row.date}</span>
                            </td>
                            
                            <td className="py-4 px-6">
                              <div className="flex gap-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#edecea] border border-[#e0ddd8]/55 text-[#1c1c14] text-[12px] font-bold font-sans">
                                  {row.tag1}
                                </span>
                                {row.tag2 && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#f7f6f2] text-[#6b6b58] text-[12px] font-bold font-sans">
                                    {row.tag2}
                                  </span>
                                )}
                              </div>
                            </td>
                            
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3 justify-center">
                                <span className="text-[#2d7a3a] font-bold shrink-0">{row.success}%</span>
                                <div className="w-24 h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden shrink-0">
                                  <div 
                                    className="h-full rounded-full bg-[#5a6e38]" 
                                    style={{ width: `${row.success}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Miniature horizontal inline performance sparklines bar */}
                            <td className="py-4 px-6 select-none pointer-events-none">
                              <div className="flex items-end gap-0.5 h-6 w-20">
                                {row.momentum.map((val, idx) => (
                                  <div 
                                    key={idx}
                                    className="bg-[#5a6e38]/80 rounded-t-[2px] w-[14%]"
                                    style={{ height: `${val}%` }}
                                  />
                                ))}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f7f6f2] text-[#6b6b58] group-hover:bg-[#5a6e38] group-hover:text-white transition-all">
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </div>
                            </td>
                          </tr>

                          {/* Interactive Sub Expansion Panel for complete details */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="bg-[#f7f6f2]/50 p-6 border-b border-[#e0ddd8]/60 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                  
                                  {/* Sub-A: Checklist of Today's tasks (Col-span-7) */}
                                  <div className="md:col-span-12 xl:col-span-7 bg-white border border-[#e0ddd8] p-5 rounded-xl shadow-3xs text-left">
                                    <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-2.5 mb-3.5">
                                      <span className="text-[11px] font-semibold text-[#6b6b58] block uppercase tracking-wider font-mono">
                                        당일 시간 별 기획 / 세부 완수 목록
                                      </span>
                                      <span className="text-[12px] text-[#9a9a86] font-semibold">{row.completedTasks} / {row.totalTasks} 완료완비</span>
                                    </div>

                                    {/* Task loops */}
                                    <div className="space-y-2.5">
                                      {row.details.map((task, k) => (
                                        <div key={k} className="flex items-start gap-4 p-2 w-full hover:bg-[#edecea] rounded-xl border border-[#e0ddd8]/40 transition-colors">
                                          {task.status === 'done' ? (
                                            <CheckCircle2 className="w-4 h-4 text-[#2d7a3a] mt-0.5 shrink-0" />
                                          ) : (
                                            <XCircle className="w-4 h-4 text-[#c4674a] mt-0.5 shrink-0" />
                                          )}
                                          <div className="space-y-0.5 flex-1 select-none min-w-0 font-sans">
                                            <h5 className={`text-[11px] font-bold leading-normal truncate ${task.status === 'done' ? 'text-[#1c1c14]' : 'text-[#6b6b58] line-through decoration-[#e0ddd8]'}`}>
                                              {task.name}
                                            </h5>
                                            <div className="flex items-center gap-2 text-[12px] text-[#6b6b58] font-bold font-mono">
                                              <span className="bg-[#edecea]/40 text-[#1c1c14] px-1 rounded text-[#6b6b58] font-sans font-semibold">{task.category}</span>
                                              <span>•</span>
                                              <span>개시: {task.time}</span>
                                              <span>•</span>
                                              <span>소요: {task.duration}</span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Sub-B: Diagnostics, hours, and interruption logs (Col-span-5) */}
                                  <div className="md:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-4 text-left">
                                    <div className="bg-white border border-[#e0ddd8] p-5 rounded-xl shadow-3xs flex-1">
                                      <span className="text-[11px] font-bold text-[#9a9a86] block uppercase tracking-wider font-mono mb-3">
                                        AI 주간 분석 자가 인지 진단
                                      </span>

                                      <div className="space-y-3 font-sans">
                                        <div>
                                          <span className="text-[11px] text-[#9a9a86] font-bold block">총 집중 시간</span>
                                          <span className="text-xs font-semibold text-[#1c1c14] font-mono bg-[#f7f6f2] border border-[#e0ddd8] px-2 py-0.5 rounded mt-0.5 inline-block">
                                            {row.duration}
                                          </span>
                                        </div>

                                        <div>
                                          <span className="text-[11px] text-[#1c1c14] font-semibold block">집중도 급락</span>
                                          <span className="text-[12px] font-semibold text-[#1c1c14] block mt-0.5">
                                            {row.cognitiveBurden}
                                          </span>
                                        </div>

                                        <div className="pt-2 border-t border-[#e0ddd8]">
                                          <span className="text-[11px] text-[#9a9a86] font-bold block">우발적 요인 및 방해 로그</span>
                                          <p className="text-[12px] text-[#6b6b58] leading-normal font-semibold mt-1">
                                            {row.interruptionNotes}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action check button */}
                                    <div className="flex items-center gap-1.5 p-3 bg-[#edecea] border border-[#9a9a86]/40 rounded-xl text-[#4a5c2e] text-[11px] font-semibold leading-normal">
                                      <Sparkles className="w-4 h-4 shrink-0 text-[#1c1c14]" />
                                      <span>목표 달성률이 100%입니다.</span>
                                    </div>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}

        {/* Tab 1.5: Detailed Weekly Analysis Report (Includes exact visuals shown in community feed) */}
        {activeTab === 'weekly_report' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Overview Cards group */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e0ddd8] p-4.5 rounded-xl shadow-sm text-left">
                <span className="text-[12px] font-bold text-[#9a9a86] block uppercase tracking-wider font-mono">주간 완성도 지수</span>
                <span className="text-xl font-semibold text-[#1c1c14] font-sans">성공률 60.8% 달성</span>
                <p className="text-[11px] text-[#9a9a86] font-medium mt-1">목표 쪼개기 개선 진행 중</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] p-4.5 rounded-xl shadow-sm text-left">
                <span className="text-[12px] font-bold text-[#9a9a86] block uppercase tracking-wider font-mono">업무 밸런스 총량</span>
                <span className="text-xl font-semibold text-[#2d7a3a] font-sans">7일간 집중</span>
                <p className="text-[11px] text-[#9a9a86] font-medium mt-1">이전 주 대비 +3.2%</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] p-4.5 rounded-xl shadow-sm text-left">
                <span className="text-[12px] font-bold text-[#9a9a86] block uppercase tracking-wider font-mono">종합분석 성능곡선</span>
                <span className="text-xl font-semibold text-[#c4674a] font-sans">집중 조율기 도입</span>
                <p className="text-[11px] text-[#9a9a86] font-medium mt-1">평균 집중도 60%</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] p-4.5 rounded-xl shadow-sm text-left">
                <span className="text-[12px] font-bold text-[#9a9a86] block uppercase tracking-wider font-mono">완료 통계 지표</span>
                <span className="text-xl font-semibold text-[#1c1c14] font-sans">15 / 25개 완수</span>
                <p className="text-[11px] text-[#9a9a86] font-medium mt-1">이번 주 평균 성과밀도 60.8%</p>
              </div>
            </div>

            {/* Main Visual Layout Column (Horizontal layout stacks) */}
            <div className="space-y-6">
              
              {/* 1. Weekly Completion Index Visual Bar Chart (Expanded to be wide) */}
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left w-full">
                <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1c14] font-display flex items-center gap-1.5">
                      <TrendingUp className="w-4.5 h-4.5 text-[#1c1c14]" />
                      <span>주간 완수 지표 추이</span>
                    </h3>
                    <p className="text-[12px] text-[#9a9a86] mt-0.5 font-medium">요일별 할 일 완료율 및 성공 비율</p>
                  </div>
                  <span className="text-[11px] bg-[#edecea] text-[#1c1c14] font-semibold px-2 py-0.5 rounded border border-[#5a6e38]/20">
                    성공률 60.8%
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between h-32 pt-2 px-8 md:px-16 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl relative">
                    <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-5 px-1 py-1.5">
                      <div className="border-b border-[#e0ddd8] w-full" />
                      <div className="border-b border-[#e0ddd8] w-full" />
                      <div className="border-b border-[#e0ddd8] w-full" />
                    </div>
                    
                    {[
                      { label: '월요일', height: '58%', active: false },
                      { label: '화요일', height: '62%', active: false },
                      { label: '수요일', height: '65%', active: false },
                      { label: '목요일', height: '54%', active: false },
                      { label: '금요일', height: '60%', active: false },
                      { label: '토요일', height: '50%', active: false },
                      { label: '일요일', height: '61%', active: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 z-15 w-14">
                        <div className="w-full flex justify-center items-end h-22">
                          <div 
                            style={{ height: item.height }}
                            className={`w-4 rounded-t-xs transition-all duration-500 ${
                              item.active 
                                ? 'bg-gradient-to-t from-[#1c1c14] to-[#2d7a3a] shadow-[0_0_8px_rgba(79,70,229,0.25)]' 
                                : 'bg-[#5a6e38]/40'
                            }`}
                          />
                        </div>
                        <span className={`text-[11px] font-bold ${item.active ? 'text-[#1c1c14] font-semibold' : 'text-[#9a9a86]'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-[#f7f6f2]/50 p-3.5 rounded-xl border border-[#e0ddd8] text-center">
                    <div>
                      <span className="text-[11px] text-[#9a9a86] font-bold block">완수 목표 수</span>
                      <span className="text-xs font-semibold font-mono text-[#1c1c14]">3개 완료</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#9a9a86] font-bold block">스마트 슬라이싱</span>
                      <span className="text-xs font-semibold font-mono text-[#1c1c14]">15분 단위</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#9a9a86] font-bold block">주간 비율</span>
                      <span className="text-xs font-semibold font-mono text-[#2d7a3a]">+18% 상승</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Category Job Share Donut and Detail Bars (Widescreen layout below completion chart) */}
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left w-full">
                <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3.5 mb-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38]" />
                    <h3 className="text-sm font-bold text-[#1c1c14] font-display">업무 밸런스 점유율 (CATEGORY JOB SHARE)</h3>
                  </div>
                  <span className="text-[12px] bg-[#edecea] border border-[#e0ddd8] text-[#1c1c14] px-2 py-0.5 rounded font-semibold font-mono">
                    BALANCE CODE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Donut visualizer (md:col-span-5) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#f7f6f2]/50 p-6 rounded-xl border border-[#e0ddd8]/60 h-full min-h-[180px]">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                        <circle
                          cx="64"
                          cy="64"
                          r="52"
                          fill="transparent"
                          stroke="#e0ddd8"
                          strokeWidth="10"
                        />
                        {/* 45% Indigo */}
                        <circle
                          cx="64"
                          cy="64"
                          r="52"
                          fill="transparent"
                          stroke="#5a6e38"
                          strokeWidth="10"
                          strokeDasharray="147.027 326.726"
                          strokeDashoffset="0"
                        />
                        {/* 25% Emerald */}
                        <circle
                          cx="64"
                          cy="64"
                          r="52"
                          fill="transparent"
                          stroke="#2d7a3a"
                          strokeWidth="10"
                          strokeDasharray="81.681 326.726"
                          strokeDashoffset="-147.027"
                        />
                        {/* 15% Amber */}
                        <circle
                          cx="64"
                          cy="64"
                          r="52"
                          fill="transparent"
                          stroke="#c4674a"
                          strokeWidth="10"
                          strokeDasharray="49.009 326.726"
                          strokeDashoffset="-228.708"
                        />
                        {/* 15% Slate */}
                        <circle
                          cx="64"
                          cy="64"
                          r="52"
                          fill="transparent"
                          stroke="#9a9a86"
                          strokeWidth="10"
                          strokeDasharray="49.009 326.726"
                          strokeDashoffset="-277.717"
                        />
                      </svg>
                      <div className="absolute text-center z-10">
                        <span className="text-[12px] text-[#9a9a86] font-semibold block leading-none">측정 기간</span>
                        <span className="text-base font-semibold font-sans text-[#1c1c14] block mt-1 leading-none">1주일</span>
                        <span className="text-[11px] font-semibold text-[#1c1c14] font-mono mt-0.5 block">(7일간)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed percentages items (md:col-span-7) */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: '개발 및 엔지니어링 (DB튜닝)', pct: '45%', color: 'bg-[#5a6e38]' },
                        { name: 'OAuth 인증 및 마이그레이션', pct: '25%', color: 'bg-[#2d7a3a]' },
                        { name: '시스템 밸런스 점검', pct: '15%', color: 'bg-[#c4674a]' },
                        { name: '개인 정비 및 정적 검사', pct: '15%', color: 'bg-[#f7f6f2]' },
                      ].map((dept, idx) => (
                        <div key={idx} className="space-y-1 bg-[#f7f6f2]/50 p-2.5 rounded-xl border border-[#e0ddd8]">
                          <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#6b6b58] font-semibold truncate max-w-[150px]">{dept.name}</span>
                            <span className="font-mono text-[#1c1c14] font-semibold">{dept.pct}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden">
                            <div className={`h-full ${dept.color} rounded-full`} style={{ width: dept.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#e0ddd8] flex items-center gap-2 text-[11px] font-semibold text-[#9a9a86]">
                      <Info className="w-4 h-4 text-[#1c1c14] shrink-0" />
                      <span>해당 분포 비율은 지난 7일 동안 실제 완료 기록 기준입니다.</span>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* 요일별 상세 분석 데이터 그리드 모듈 추가 */}
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left w-full">
                <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-[#1c1c14]" />
                    <h3 className="text-sm font-semibold text-[#1c1c14] font-display">요일별 상세 분석</h3>
                  </div>
                  <span className="text-[11px] text-[#2d7a3a] bg-[#ecf0e4] border border-[#c8d4a8] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">7-day tracking</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#e0ddd8] bg-[#f7f6f2]/50 font-mono text-[12px] font-semibold text-[#9a9a86] uppercase tracking-wider">
                        <th className="py-2.5 px-4 font-bold">요일</th>
                        <th className="py-2.5 px-4 text-center font-bold">집중 시간</th>
                        <th className="py-2.5 px-4 text-center font-bold">완료한 세부 작업수</th>
                        <th className="py-2.5 px-4 text-center font-bold">피드백 수신</th>
                        <th className="py-2.5 px-4 text-center font-bold">피로도</th>
                        <th className="py-2.5 px-4 text-center font-bold">집중 효율</th>
                        <th className="py-2.5 px-4 font-bold">요일별 핵심 성과 및 AI 피드백</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0ddd8] text-[12px] font-semibold text-[#6b6b58] font-sans">
                      {[
                        { day: "월요일", deep: "4.5시간", slicing: "7개 슬롯", peer: "2회", fatigue: "15% (매우 양호)", efficiency: "58%", effColor: "text-[#1c1c14]", feedback: "계획한 과제 중 4개는 완료했으나 3개는 지연되어 성공률이 다소 저조했습니다." },
                        { day: "화요일", deep: "5.0시간", slicing: "8개 슬롯", peer: "4회", fatigue: "28% (양호)", efficiency: "62%", effColor: "text-[#2d7a3a]", feedback: "오전 딥워크는 집중했으나, 오후에 긴급 일정이 개입되면서 할 일 카드의 일부만 마감했습니다." },
                        { day: "수요일", deep: "6.2시간", slicing: "10개 슬롯", peer: "5회", fatigue: "42% (보통)", efficiency: "65%", effColor: "text-[#2d7a3a]", feedback: "핵심 연산 모듈 최적화에 성공하는 등 주중 최고의 완료 속도를 지켜냈습니다." },
                        { day: "목요일", deep: "4.8시간", slicing: "6개 슬롯", peer: "3회", fatigue: "35% (양호)", efficiency: "54%", effColor: "text-[#1c1c14]", feedback: "회의 및 행정 처리 비중이 높아져 실제 집중 과제들의 완료 시점이 다수 밀렸습니다." },
                        { day: "금요일", deep: "5.5시간", slicing: "9개 슬롯", peer: "6회", fatigue: "50% (주의)", efficiency: "60%", effColor: "text-[#2d7a3a]", feedback: "피어 간 교류 및 주간 리포트 정리는 완수했으나 개인 과제는 지연율이 있었습니다." },
                        { day: "토요일", deep: "3.5시간", slicing: "4개 슬롯", peer: "1회", fatigue: "18% (안정)", efficiency: "50%", effColor: "text-[#1c1c14]", feedback: "주말 휴식을 위해 계획을 가볍게 세웠으나 2개의 기본 작업만 마무리했습니다." },
                        { day: "일요일", deep: "4.0시간", slicing: "5개 슬롯", peer: "3회", fatigue: "25% (우수)", efficiency: "61%", effColor: "text-[#2d7a3a]", feedback: "주간 성과를 정리하며 무리하지 않는 선에서 5개 중 3개를 안정적으로 완료했습니다." }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#edecea]/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#1c1c14]">{row.day}</td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-[#6b6b58]">{row.deep}</td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-[#6b6b58]">{row.slicing}</td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-[#6b6b58]">{row.peer}</td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-[#6b6b58]">{row.fatigue}</td>
                          <td className={`py-3 px-4 text-center font-semibold ${row.effColor}`}>{row.efficiency}</td>
                          <td className="py-3 px-4 text-[#6b6b58] font-semibold leading-relaxed">{row.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* AI Coaching Strategy Assessment summary card (Bottom) */}
            <div className="border border-[#9a9a86]/80 bg-[#edecea]/20 p-5 rounded-xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#1c1c14]" />
                <h4 className="text-xs font-semibold text-[#4a5c2e] uppercase tracking-wider font-display">AI 주간 분석</h4>
              </div>
              <p className="text-[12px] text-[#6b6b58] font-medium leading-relaxed font-sans">
                요일별 완료율을 분석한 결과, 오전 시간대 집중도가 가장 높습니다. 중요한 작업은 오전에 배치하고, 일일 계획은 5개 이하로 유지하는 것을 권장합니다.
              </p>
            </div>

          </div>
        )}

        {/* Tab 2: Hourly Performance Heatmap & Breakdown Details */}
        {activeTab === 'hourly' && (
          <div className="space-y-6 animate-fadeIn">
            
            <section className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#e0ddd8] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1c1c14] font-display flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#1c1c14]" />
                    <span>요일 및 시간대 집중 수치 분석 (종합 Heatmap)</span>
                  </h2>
                  <p className="text-xs font-semibold text-[#9a9a86] mt-0.5">그리드를 터치하거나 마우스를 올리면 각 시간 슬롯의 실제 몰입 달성률 분석 수치가 로딩됩니다.</p>
                </div>
                <span className="text-[11px] text-[#1c1c14] bg-[#edecea] border border-[#e0ddd8] px-2.5 py-1 rounded font-mono font-bold uppercase tracking-wider block self-start md:self-auto">
                  LIVE INTERACTIVE MATRIX
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Dynamic Grid */}
                <div className="lg:col-span-2 bg-[#f7f6f2]/50 p-6 rounded-xl border border-[#e0ddd8]/70 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-[#e0ddd8]">
                      <span className="text-xs font-bold text-[#6b6b58] uppercase tracking-wider font-mono">Hourly Contribution Activity</span>
                      {/* legend status color specs */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9a9a86] uppercase font-mono">
                        <span>Less</span>
                        <span className="w-3.5 h-3.5 bg-[#f7f6f2] rounded-[4px] border border-[#e0ddd8]/40" />
                        <span className="w-3.5 h-3.5 bg-[#edecea]/80 rounded-[4px] border border-[#e0ddd8]/40" />
                        <span className="w-3.5 h-3.5 bg-[#9a9a86]/60 rounded-[4px] border border-[#9a9a86]/40" />
                        <span className="w-3.5 h-3.5 bg-[#5a6e38]/50 rounded-[4px] border border-[#e0ddd8]/40" />
                        <span className="w-3.5 h-3.5 bg-[#5a6e38]/80 rounded-[4px] border border-[#e0ddd8]/40" />
                        <span className="w-3.5 h-3.5 bg-[#5a6e38] rounded-[4px] border border-[#4a5c2e]" />
                        <span>More</span>
                      </div>
                    </div>

                    {/* Highly precise structural grid replacing absolute offsets */}
                    <div className="grid grid-cols-8 gap-y-2 gap-x-2 flex-grow font-sans">
                      {/* Header Row: Column 1 is empty for the hour label, Columns 2-8 are weekday headers */}
                      <div className="col-span-1" />
                      <div className="col-span-7 grid grid-cols-7 gap-2 text-center font-mono text-[11px] font-semibold text-[#6b6b58] uppercase">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>

                      {/* Hourly Data Rows */}
                      {MOCK_HOURLY_HEAT_DATA.map((row) => (
                        <React.Fragment key={row.hour}>
                          {/* Left Hour Indicator */}
                          <div className="col-span-1 text-right text-[11px] font-mono font-semibold text-[#9a9a86] self-center pr-2">
                            {row.hour}
                          </div>
                          
                          {/* Right 7 Blocks */}
                          <div className="col-span-7 grid grid-cols-7 gap-2">
                            {row.values.map((val, idx) => {
                              let fillStyle = 'bg-[#f7f6f2] border-[#e0ddd8]/40'; 
                              if (val > 0 && val <= 20) fillStyle = 'bg-[#edecea]/80 border-[#e0ddd8]/40';
                              else if (val > 20 && val <= 40) fillStyle = 'bg-[#9a9a86]/60 border-[#9a9a86]/40';
                              else if (val > 40 && val <= 60) fillStyle = 'bg-[#5a6e38]/50 border-[#e0ddd8]/40';
                              else if (val > 60 && val <= 80) fillStyle = 'bg-[#5a6e38]/80 border-[#e0ddd8]/40';
                              else if (val > 80) fillStyle = 'bg-[#5a6e38] border-[#4a5c2e] shadow-xs';

                              const isSelected = hoveredHeatCell?.row === row.hour && hoveredHeatCell?.idx === idx;

                              return (
                                <div 
                                  key={`${row.hour}-${idx}`}
                                  onMouseEnter={() => setHoveredHeatCell({ row: row.hour, idx, val })}
                                  onMouseLeave={() => setHoveredHeatCell(null)}
                                  className={`aspect-square rounded-[4px] border hover:scale-110 cursor-crosshair transition-all duration-150 ${fillStyle} ${
                                    isSelected ? 'ring-2 ring-[#5a6e38] ring-offset-2 scale-105 z-10' : ''
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Base Information Guidelines */}
                  <div className="mt-8 pt-4 border-t border-[#e0ddd8] text-[#9a9a86] text-[11px] font-medium leading-relaxed font-sans">
                    <p className="flex items-start gap-1">
                      <span className="text-[#1c1c14] font-semibold mr-0.5">•</span>
                      <span>과거 7일 동안의 64개 활성 타임슬롯을 트래킹하여 인지 활동의 활성 패턴을 5단계 명도(Opacity) 톤으로 정밀 산하 시각화했습니다.</span>
                    </p>
                  </div>
                </div>

                {/* Right Side: Info Panel details matching the Hover state */}
                <div className="flex flex-col justify-between space-y-4">
                  
                  {/* Detailed Analysis Panel box */}
                  <div className="bg-[#f7f6f2] border border-[#e0ddd8] p-6 rounded-xl flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1c1c14] font-display flex items-center gap-2 mb-3 pb-2 border-b border-[#e0ddd8]">
                        <Activity className="w-4.5 h-4.5 text-[#1c1c14]" />
                        <span>타임슬롯 정밀 분석 피드백</span>
                      </h3>
                      
                      {hoveredHeatCell ? (
                        <div className="space-y-4 pt-1">
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[11px] text-[#9a9a86] font-bold uppercase font-mono">분석 요일 및 시간</span>
                              <span className="text-xs font-bold text-[#1c1c14]">
                                {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'][hoveredHeatCell.idx]} • {hoveredHeatCell.row}
                              </span>
                            </div>

                            <div className="flex justify-between items-baseline">
                              <span className="text-[11px] text-[#9a9a86] font-bold uppercase font-mono">해당 슬롯 완수율</span>
                              <span className="text-sm font-semibold text-[#1c1c14]">
                                {hoveredHeatCell.val}%
                              </span>
                            </div>
                          </div>

                          {/* Progress visual bar */}
                          <div className="h-1.5 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#5a6e38] rounded-full transition-all"
                              style={{ width: `${hoveredHeatCell.val}%` }}
                            />
                          </div>

                          {/* Dynamic Feedback Text based on actual percent */}
                          <div className="text-[12px] text-[#6b6b58] leading-relaxed font-semibold bg-white p-3 rounded-xl border border-[#e0ddd8] text-left">
                            {hoveredHeatCell.val > 80 ? (
                              <p className="text-[#2d7a3a]">✓ 초고도 집중력을 유지하는 최고의 골든 슬롯입니다! 대규모 코드 리팩토링이나 마이그레이션 기술 설계를 배치하세요.</p>
                            ) : hoveredHeatCell.val > 40 ? (
                              <p className="text-[#1c1c14]">✓ 일정한 업무 리듬이 안정적으로 유지되는 시간대입니다. 정규 태스크 처리 및 회의 정렬에 매우 적합합니다.</p>
                            ) : hoveredHeatCell.val > 0 ? (
                              <p className="text-[#c4674a]">의욕 고갈이나 외부 방해 자극 개입도가 높은 슬롯입니다. To-Do를 15분 단위로 쪼개어 가볍게 대응하세요.</p>
                            ) : (
                              <p className="text-[#9a9a86]">일정 내역이 확인되지 않는 유휴 타임이거나 편안한 인지 회복을 달성한 힐링 구간입니다.</p>
                            )}
                          </div>

                          {/* Dynamic target subtasks completed */}
                          <div className="space-y-2">
                            <span className="text-[11px] text-[#9a9a86] font-bold uppercase font-mono block">이 시각 시뮬레이션 추천 행동</span>
                            <div className="space-y-1">
                              {hoveredHeatCell.row === '9AM' ? (
                                <>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0" />
                                    <span>일일 오전 할 일 분할 슬라이싱 배정</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0" />
                                    <span>백로그 1차 우선순위 정렬 및 준비</span>
                                  </div>
                                </>
                              ) : hoveredHeatCell.row === '12PM' ? (
                                <>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0" />
                                    <span>기술 핵심 모듈 빌드 및 배포 교신</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0" />
                                    <span>최적 집중 타이밍</span>
                                  </div>
                                </>
                              ) : hoveredHeatCell.row === '3PM' ? (
                                <>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#c4674a] shrink-0" />
                                    <span>마이크로 15분단위 휴식 인터벌 수행</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#c4674a] shrink-0" />
                                    <span>가벼운 이메일 마스터링 및 단순 정비</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#1c1c14] shrink-0" />
                                    <span>일일 정비 회고록 작성 및 피드백 전송</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#1c1c14] shrink-0" />
                                    <span>내일 오전 핵심 과업 예비 홀딩 선점</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-xs text-[#9a9a86] font-semibold font-sans space-y-3">
                          <div className="w-12 h-12 rounded-full bg-[#f7f6f2] flex items-center justify-center mx-auto text-[#9a9a86]">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p>왼쪽 히트맵 셀 위에 마우스를 올려보세요.</p>
                            <p className="text-[11px] text-[#9a9a86] font-medium font-mono">HOVER OVER GRID CELL FOR DEEP ANALYSIS</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#e0ddd8]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1c1c14] bg-[#edecea]/50 p-3 rounded-xl justify-center font-sans">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>생화학적 몰입 성향: 오전 10-12시 최대 효율</span>
                      </div>
                    </div>
                  </div>

                  {/* Supplemental insight block */}
                  <div className="border border-[#e0ddd8] bg-[#edecea]/20 p-5 rounded-xl text-left">
                    <h4 className="text-xs font-bold text-[#1c1c14] mb-1 font-display flex items-center gap-1">
                      <span>효율 황금율 요일 추천</span>
                    </h4>
                    <p className="text-[11px] text-[#6b6b58] font-medium leading-relaxed font-sans">
                      수요일 오전 10시는 평균 90% 이상의 완수 가속을 자랑하지만, 금요일 오후 3시 이후에는 급작스럽게 주의집중도가 떨어지므로 이 지점을 미리 감지해 무리한 계획을 피하도록 안내합니다.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* 시간대별 종합 리포트의 정밀 스탯 대시보드 */}
            <section className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-[#1c1c14]" />
                  <h3 className="text-sm font-semibold text-[#1c1c14] font-display">시간대별 정밀 집중 효율 분석 가이드</h3>
                </div>
                <span className="text-[11px] text-[#2d7a3a] bg-[#ecf0e4] border border-[#c8d4a8] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Granular Insights</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "골든 몰입 타임 (09:00 - 12:00)",
                    rate: "93.6%",
                    desc: "하루 중 집중도가 최고값에 도달하는 집중도가 최고인 시간대입니다. 중요한 작업을 이 시간에 배치하세요.",
                    color: "border-l-4 border-[#2d7a3a] bg-[#ecf0e4]/10"
                  },
                  {
                    title: "주의·누수 타임 (15:00 - 16:30)",
                    rate: "41.2%",
                    desc: "신체 에너지 방전 및 인지 능률 부하가 집중되는 고위험 피로 정체 구간입니다. 과업의 성과 누수가 가장 자주 감지되므로, 15분 단위 오토-슬라이싱 처방을 통해 기계적으로 대응하는 방어율 확보를 추천합니다.",
                    color: "border-l-4 border-[#c4674a] bg-[#f8ede8]/10"
                  },
                  {
                    title: "퇴근전 정비 타임 (18:00 - 19:30)",
                    rate: "89.8%",
                    desc: "완수된 성과들의 마무리 피드백 회고록 등록 및 공유가 마무리되는 시간입니다. 내일 맞춤으로 스터디할 슬라이싱 과제를 미리 홀딩 예비해 두어, 다음날 아침 전환 지연 마찰을 없애기에 최적입니다.",
                    color: "border-l-4 border-[#5a6e38] bg-[#edecea]/10"
                  }
                ].map((slot, index) => (
                  <div key={index} className={`p-5 rounded-xl border border-[#e0ddd8] flex flex-col justify-between ${slot.color}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-[#1c1c14] font-display">{slot.title}</h4>
                        <span className="text-xs font-semibold text-[#1c1c14] font-mono">{slot.rate}</span>
                      </div>
                      <p className="text-[11px] text-[#6b6b58] font-semibold leading-relaxed font-sans">{slot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* Tab 3: Category Balance Dynamic Review */}
        {activeTab === 'category' && (
          <div className="space-y-6 animate-fadeIn">
            
            <section className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1c1c14] font-display">카테고리별 일정 분포 및 성취 지수</h2>
                  <p className="text-xs font-semibold text-[#9a9a86] mt-0.5">각 카테고리 태스크의 실질 할당량과 완수 지퍼 비율을 입체 분석합니다.</p>
                </div>
                
                {selectedCategoryFilter && (
                  <button 
                    onClick={() => setSelectedCategoryFilter(null)}
                    className="text-xs font-bold bg-[#5a6e38] text-white px-3 py-1.5 rounded-lg hover:bg-[#4338ca] transition-all cursor-pointer shadow-sm"
                  >
                    필터 전체 해제
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryStats.map((cat) => {
                  const isFiltered = selectedCategoryFilter === cat.key;
                  return (
                    <div 
                      key={cat.key}
                      onClick={() => setSelectedCategoryFilter(cat.key)}
                      className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between h-[180px] ${
                        isFiltered 
                          ? 'border-[#5a6e38] bg-[#edecea]/10 shadow-md ring-1 ring-[#6b6b58]' 
                          : 'border-[#e0ddd8] bg-white hover:border-[#e0ddd8] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                          <h3 className="font-bold text-sm text-[#1c1c14] font-display">{cat.label}</h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#9a9a86]">
                          {cat.completed}/{cat.count}개 완료
                        </span>
                      </div>

                      <div className="my-3">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-xs text-[#9a9a86] font-bold font-mono">CATEGORY SUCCESS RATE</span>
                          <span className="text-lg font-bold text-[#1c1c14]">{cat.rate}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${cat.progressColor} rounded-full transition-all duration-1000`} 
                            style={{ width: `${cat.rate}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#9a9a86] font-semibold border-t border-[#e0ddd8] pt-2.5 mt-1 font-sans">
                        <span>전체 생산 점유율 {Math.round((cat.count / 40) * 100)}%</span>
                        <span className="flex items-center text-[#1c1c14] font-bold">
                          분석 상세 검토 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedCategoryFilter && (
                <div className="mt-6 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-5 animate-fadeIn text-left">
                  <h3 className="text-xs font-bold text-[#9a9a86] uppercase tracking-wider font-mono mb-2">CATEGORY SPECS COCHING • {selectedCategoryFilter}</h3>
                  <div className="text-[#1c1c14] text-xs font-medium font-sans leading-relaxed">
                    {selectedCategoryFilter === 'Work' && (
                      <p>업무 과업의 완수 비율은 현재 매우 호조(85%)입니다! 다만 주말 및 늦은 미팅과 겹쳐서 진행하는 케이스가 지속 관측되니 휴일에는 완전 차단형 비활성화 시간을 보장하는 것이 장기적으로 안정적입니다.</p>
                    )}
                    {selectedCategoryFilter === 'Meeting' && (
                      <p>미팅은 다른 파트너와의 상호 일체 조율이 정렬되어 취소 비중이 최저 수준(83%)으로 잘 진행되고 있습니다. 미팅 안건 작성에 과실이 없는지 사전 10분 백로그 검수 장치를 보완하면 더욱 증진됩니다.</p>
                    )}
                    {selectedCategoryFilter === 'Project' && (
                      <p>프로젝트 기획 영역은 타 단위 대비 소요 시간이 큽니다. 업무 카드를 쪼개어 단계별 30분 단위 수량 마스터 플랜으로 배치해 보시기 바랍니다.</p>
                    )}
                    {selectedCategoryFilter === 'Admin' && (
                      <p className="text-[#c4674a] font-semibold">행정/메인 커뮤니케이션 업무의 체크율이 수치 25% 수준으로 현저히 떨어집니다. 주요 딥워크 업무의 긴장감이 풀려 피로도가 높은 주간 후반에 묶어서 몰아 처리하시는 수정을 기획해 보세요.</p>
                    )}
                    {selectedCategoryFilter === 'Research' && (
                      <p>리서치 업무는 벤치마킹 분석을 포함하여 원활합니다! 리서치 내용을 즉시 가공할 수 있는 마크다운 작성 보관 루틴과 연결되어 있어 아주 준수한 흐름입을 파악했습니다.</p>
                    )}
                    {selectedCategoryFilter === 'Other' && (
                      <p>개인 잡무 일상 관리에 대해서도 높은 관리 완성도를 수지하고 계십니다. 하루의 피크 시각이 종료되는 18:00 직후 퇴근길에 쾌속 처리하도록 배치하는 현재 패턴이 매우 훌륭합니다.</p>
                    )}
                  </div>
                </div>
              )}
            </section>

          </div>
        )}

        {/* Tab 4: Performance Pattern Analysis */}
        {activeTab === 'pattern' && (
          <div className="space-y-6 animate-fadeIn">
            
            <section className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#1c1c14] font-display">실패 패턴</h2>
                <p className="text-xs font-semibold text-[#9a9a86] mt-0.5">내 일상의 활동 데이터를 기반으로 찾아낸 할 일 실패 원인과 집중 방해 요인 분석 결과입니다.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Pattern 1: Failure Root Causes */}
                <div className="border border-[#e0ddd8] rounded-xl p-6 bg-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1c14] font-display flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#c4674a]" />
                      <span>목표 등록 수행 지연 및 실패 분석</span>
                    </h3>
                    <p className="text-xs text-[#9a9a86] font-semibold mb-5 font-sans">최근 2주간 취소 또는 시간 미완수 마감된 일정 원인 분포</p>
                    
                    <div className="space-y-4">
                      {/* Factor 1 */}
                      <div>
                        <div className="flex justify-between items-baseline text-xs font-semibold mb-1">
                          <span className="text-[#1c1c14]">기타 우발적 외풍 개입 (팀원 요청, 급작스런 사정)</span>
                          <span className="text-[#6b6b58] font-bold">58%</span>
                        </div>
                        <div className="h-2 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                          <div className="h-full bg-[#c4674a]" style={{ width: '58%' }} />
                        </div>
                      </div>

                      {/* Factor 2 */}
                      <div>
                        <div className="flex justify-between items-baseline text-xs font-semibold mb-1">
                          <span className="text-[#1c1c14]">체력 피크 이탈 및 의지 저하 (휴식 제어 장치 부족)</span>
                          <span className="text-[#6b6b58] font-bold">24%</span>
                        </div>
                        <div className="h-2 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                          <div className="h-full bg-[#5a6e38]" style={{ width: '24%' }} />
                        </div>
                      </div>

                      {/* Factor 3 */}
                      <div>
                        <div className="flex justify-between items-baseline text-xs font-semibold mb-1">
                          <span className="text-[#1c1c14]">네트워크 설비 소실 및 주위 산만</span>
                          <span className="text-[#6b6b58] font-bold">18%</span>
                        </div>
                        <div className="h-2 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                          <div className="h-full bg-[#f7f6f2]" style={{ width: '18%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#9a9a86] leading-relaxed font-sans pt-4 border-t border-[#e0ddd8] mt-4 font-medium">
                    * 비고: 타인 소싱 차단용 슬롯 확보 장치인 방해금지 전용 업무 ‘Buffer Time’을 스케줄 속에 매일 40분씩 미리 심어두면, 58% 분포의 외부 방해를 탄탄하게 상쇄할 수 있습니다.
                  </p>
                </div>

                {/* Pattern 2: Consecutive Success Metrics Streak Chart */}
                <div className="border border-[#e0ddd8] rounded-xl p-6 bg-white text-left flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1c14] font-display flex items-center gap-2 mb-1.5">
                      <TrendingUp className="w-4 h-4 text-[#2d7a3a]" />
                      <span>일정 완수 연속도 성향 (Consistencies)</span>
                    </h3>
                    <p className="text-xs text-[#9a9a86] font-semibold mb-5 font-sans">하루 최소 3개 이상의 기획 태스크를 연속 완수하여 굳힌 빌딩 습관 연속력</p>
                    
                    <div className="space-y-4 pt-1">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#ecf0e4] rounded-xl px-4 py-3 border border-[#c8d4a8]/60 text-center shrink-0 min-w-[100px]">
                          <span className="block text-2xl font-bold text-[#2d7a3a] font-mono">12일</span>
                          <span className="text-[11px] text-[#2d7a3a] uppercase font-bold tracking-wider font-mono">Current Streak</span>
                        </div>
                        <p className="text-xs text-[#6b6b58] leading-relaxed font-sans font-medium">
                          상위 8% 수준에 해당하는 놀라운 일관성입니다! 주말에 완벽한 무계획 마감 후 월요일에 가동 세우기가 원활합니다.
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-[#5a6e38]/5 rounded-xl px-4 py-3 border border-[#e0ddd8]/60 text-center shrink-0 min-w-[100px]">
                          <span className="block text-2xl font-bold text-[#1c1c14] font-mono">21일</span>
                          <span className="text-[11px] text-[#1c1c14] uppercase font-bold tracking-wider font-mono">Max Record</span>
                        </div>
                        <p className="text-xs text-[#6b6b58] leading-relaxed font-sans font-medium">
                          역대 최대 연속 완수 이력과의 점유가 9일 차이납니다. 다음주 금요일을 무사히 맞추시면 개인 최고 신기록을 경신하게 됩니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#edecea]/40 p-4 rounded-xl border border-[#e0ddd8]/40 text-xs text-[#4a5c2e] leading-relaxed font-semibold mt-4">
                    📢 AI 핵심 진단: 저녁 6시 대의 최종 검토율이 높아 퇴근 전 피드백 적용율이 뛰어나므로 이 주간 성공 고리는 계속 전개가 가능합니다.
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8"></div>
      </div>

    </div>
  );
}
