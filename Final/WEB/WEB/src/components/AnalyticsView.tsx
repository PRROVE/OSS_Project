/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
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
  CheckCircle2,
  XCircle,
  PieChart
} from 'lucide-react';
import { MOCK_HOURLY_HEAT_DATA, getRelativeDate } from '../data.ts';

import { Task } from '../types.ts';
import { TODAY_STR } from '../data.ts';

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


  const getFormatRelative = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const tableData = [
    {
      date: getFormatRelative(0),
      tag1: '보고서',
      tag2: '미팅',
      success: 60,
      momentum: [40, 55, 50, 45, 60, 60],
      totalTasks: 5,
      completedTasks: 3,
      duration: '5.2시간',
      details: [
        { name: '주간 성과 보고서 초안 작성', category: 'Work', time: '오전 10:30', duration: '45분', status: 'done' },
        { name: '신제품 출시 마케팅 캠페인 기획', category: 'Project', time: '오후 1:15', duration: '1.5시간', status: 'done' },
        { name: '팀 데일리 스크럼 미팅', category: 'Meeting', time: '오후 4:00', duration: '30분', status: 'done' },
        { name: '경쟁사 리서치 자료 정리', category: 'Research', time: '오후 5:30', duration: '1시간', status: 'failed' },
        { name: '월말 비용 정산 서류 검토', category: 'Admin', time: '오후 6:00', duration: '30분', status: 'failed' }
      ],
      cognitiveBurden: '집중도 보통 (오후에 다소 분산)',
      interruptionNotes: '오전엔 계획대로 잘 진행했지만, 오후 피로가 쌓여 2건을 다음 날로 미뤘어요.'
    },
    {
      date: getFormatRelative(-1),
      tag1: '리포트',
      tag2: null,
      success: 60,
      momentum: [30, 40, 60, 50, 60, 62],
      totalTasks: 5,
      completedTasks: 3,
      duration: '6.2시간',
      details: [
        { name: '거래처 미팅 자료 준비', category: 'Work', time: '오전 9:15', duration: '1시간', status: 'done' },
        { name: 'Q3 분기별 마케팅 리포트 초안', category: 'Project', time: '오전 11:30', duration: '2시간', status: 'done' },
        { name: '주간 일정 정리 및 우선순위 조정', category: 'Work', time: '오후 3:00', duration: '1.2시간', status: 'failed' },
        { name: '고객 피드백 설문 결과 분석', category: 'Research', time: '오후 4:45', duration: '45분', status: 'done' },
        { name: '받은 이메일 정리 및 회신', category: 'Admin', time: '오후 5:30', duration: '30분', status: 'failed' }
      ],
      cognitiveBurden: '집중도 보통 (오후 3시 흐름 끊김)',
      interruptionNotes: '오후 3시에 급한 연락이 와서 집중이 끊겨 일부 일정이 밀렸어요.'
    },
    {
      date: getFormatRelative(-2),
      tag1: '기획',
      tag2: '이메일',
      success: 50,
      momentum: [50, 30, 45, 52, 48, 50],
      totalTasks: 4,
      completedTasks: 2,
      duration: '5.8시간',
      details: [
        { name: '분기 기획 회의 안건 정리', category: 'Project', time: '오전 10:00', duration: '2시간', status: 'done' },
        { name: '협력사 미팅 참석', category: 'Meeting', time: '오후 2:00', duration: '1시간', status: 'done' },
        { name: '밀린 이메일 회신 및 문서 정리', category: 'Admin', time: '오후 4:30', duration: '1.5시간', status: 'failed' },
        { name: '발표 슬라이드 디자인 다듬기', category: 'Work', time: '오후 5:30', duration: '1시간', status: 'failed' }
      ],
      cognitiveBurden: '집중도 다소 낮음 (체력 저하)',
      interruptionNotes: '피로가 쌓여서 오후 작업 일부를 다음 날로 미뤘어요.'
    }
  ];

  // 1. 시간대별 성공률 데이터 (오늘 기준, 평균 60% 안팎으로 자연스럽게 변동)
  const daysOfWeekFull = [
    { label: '09시', dateLabel: '오전 9시', volume: 2, rate: 64, volumeMax: 6 },
    { label: '11시', dateLabel: '오전 11시', volume: 4, rate: 66, volumeMax: 6 },
    { label: '13시', dateLabel: '오후 1시', volume: 3, rate: 60, volumeMax: 6 },
    { label: '15시', dateLabel: '오후 3시', volume: 5, rate: 52, volumeMax: 6 },
    { label: '17시', dateLabel: '오후 5시', volume: 4, rate: 58, volumeMax: 6 },
    { label: '19시', dateLabel: '오후 7시', volume: 2, rate: 62, volumeMax: 6 },
    { label: '21시', dateLabel: '오후 9시', volume: 1, rate: 59, volumeMax: 6 }
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

  // 2. 실제 task 데이터 기반 카테고리 통계 (할 일이 있는 카테고리만 표시)
  const CATEGORY_META: Record<string, { label: string; short: string; hex: string; color: string; progressColor: string }> = {
    Work:     { label: '업무 (Work)',       short: '업무',   hex: '#5a6e38', color: 'bg-[#5a6e38]', progressColor: 'from-[#5a6e38] to-[#4a5c2e]' },
    Study:    { label: '학업 (Study)',      short: '학업',   hex: '#4F46E5', color: 'bg-[#4F46E5]', progressColor: 'from-[#4F46E5] to-[#6366F1]' },
    Personal: { label: '개인 (Personal)',   short: '개인',   hex: '#d4895a', color: 'bg-[#d4895a]', progressColor: 'from-[#d4895a] to-[#c4674a]' },
    Team:     { label: '팀플 (Team)',       short: '팀플',   hex: '#2d7a3a', color: 'bg-[#2d7a3a]', progressColor: 'from-[#2d7a3a] to-[#4a5c2e]' },
    Meeting:  { label: '미팅 (Meeting)',    short: '미팅',   hex: '#1c1c14', color: 'bg-[#1c1c14]', progressColor: 'from-[#1c1c14] to-[#1c1c14]' },
    Research: { label: '리서치 (Research)', short: '연구',   hex: '#7a8e52', color: 'bg-[#7a8e52]', progressColor: 'from-[#7a8e52] to-[#5a6e38]' },
    Admin:    { label: '기타/행정 (Admin)', short: '운영',   hex: '#c4674a', color: 'bg-[#c4674a]', progressColor: 'from-[#c4674a] to-[#c4674a]' },
    Project:  { label: '프로젝트 (Project)', short: '프로젝트', hex: '#a4b878', color: 'bg-[#a4b878]', progressColor: 'from-[#a4b878] to-[#7a8e52]' },
    Health:   { label: '건강 (Health)',     short: '건강',   hex: '#2d7a3a', color: 'bg-[#2d7a3a]', progressColor: 'from-[#2d7a3a] to-[#2d7a3a]' },
    Other:    { label: '기타 (Other)',      short: '기타',   hex: '#9a9a86', color: 'bg-[#9a9a86]', progressColor: 'from-[#9a9a86] to-[#6b6b58]' },
  };
  const categoryStats = Object.keys(CATEGORY_META)
    .map((key) => {
      const ct = tasks.filter(t => t.category === key);
      const completed = ct.filter(t => t.completed).length;
      return {
        key,
        label: CATEGORY_META[key].label,
        short: CATEGORY_META[key].short,
        hex: CATEGORY_META[key].hex,
        color: CATEGORY_META[key].color,
        progressColor: CATEGORY_META[key].progressColor,
        count: ct.length,
        completed,
        rate: ct.length > 0 ? Math.round((completed / ct.length) * 100) : 0,
        share: totalTasks > 0 ? Math.round((ct.length / totalTasks) * 100) : 0,
      };
    })
    .filter(cat => cat.count > 0);

  // 카테고리 분포 (점유율 내림차순) + 도넛 세그먼트 + 균형도 설명
  const categoryDistribution = [...categoryStats].sort((a, b) => b.count - a.count);
  const DONUT_C = 150.796; // 2 * π * 24
  let donutOffset = 0;
  const donutSegments = categoryDistribution.map((cat) => {
    const len = totalTasks > 0 ? (cat.count / totalTasks) * DONUT_C : 0;
    const seg = { hex: cat.hex, dash: len, offset: -donutOffset };
    donutOffset += len;
    return seg;
  });
  const DONUT_C_LG = 326.726; // 2 * π * 52
  let donutOffsetLg = 0;
  const donutSegmentsLg = categoryDistribution.map((cat) => {
    const len = totalTasks > 0 ? (cat.count / totalTasks) * DONUT_C_LG : 0;
    const seg = { hex: cat.hex, dash: len, offset: -donutOffsetLg };
    donutOffsetLg += len;
    return seg;
  });
  const topShare = categoryDistribution[0]?.share ?? 0;
  const balanceText =
    categoryDistribution.length <= 1 ? '단일 분야 집중'
    : topShare >= 60 ? '특정 분야 편중'
    : topShare >= 40 ? '주력 분야 뚜렷'
    : '고른 편';
  const balanceDesc =
    categoryDistribution.length <= 1 ? '한 가지 분야에 일정이 집중되어 있습니다.'
    : topShare >= 60 ? `'${categoryDistribution[0].short}' 분야에 일정이 크게 몰려 있습니다.`
    : topShare >= 40 ? `'${categoryDistribution[0].short}' 분야 비중이 가장 높습니다.`
    : '여러 분야의 일정을 고르게 계획했습니다.';

  // 카드용 파생 지표 (실제 task 기반)
  const topCat = categoryDistribution[0];                              // 가장 많이 한 분야
  const weakCat = [...categoryStats].sort((a, b) => a.rate - b.rate)[0]; // 완료율 가장 낮은 분야
  const inProgressCount = tasks.filter(t => !t.completed && t.status === 'inprogress').length;
  const pendingCount = tasks.filter(t => !t.completed && !t.failed).length;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f7f6f2] animate-fadeIn text-[#1c1c14]">
      
      {/* Page Header & Tabs layout block */}
      <header className="pt-6 pb-0">
        <div className="max-w-[1280px] mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="text-left w-full sm:w-auto">
              <h1 className="text-2xl font-bold font-display text-[#1c1c14] tracking-tight">분석</h1>
              <p className="text-[13px] text-[#9a9a86] mt-1">할 일 완료 현황과 패턴을 확인합니다.</p>
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
      <div className="max-w-[1280px] w-full mx-auto px-6 py-6 space-y-6">
        
        {/* Row 1: Overview summaries cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Success */}
          <div className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm relative overflow-hidden group hover:shadow-level-2 transition-all duration-300">
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
          <div className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm hover:shadow-level-2 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4 text-left">
              <div className="w-8 h-8 rounded-full bg-[#edecea] flex items-center justify-center text-[#1c1c14]">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider font-display">집중 부문</h3>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-[#1c1c14] font-display">{topCat ? topCat.short : '—'}</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5a6e38] rounded-full" style={{ width: `${topCat ? topCat.share : 0}%` }}></div>
                </div>
                <span className="text-xs font-semibold text-[#6b6b58] shrink-0">{topCat ? `${topCat.count}개` : '0개'}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#9a9a86] font-medium text-left mt-3">{topCat ? `전체 일정의 ${topCat.share}%를 차지하는 분야예요` : '등록된 일정이 없습니다'}</p>
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
            
            {weakCat && weakCat.rate < 70 ? (
              <>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold text-[#1c1c14] font-display tracking-tight">'{weakCat.short}' 분야 주의</span>
                  <span className="text-xs font-semibold text-[#6b6b58] mt-1">완료율 {weakCat.rate}%로 가장 낮아요</span>
                </div>
                <p className="text-[11px] text-[#9a9a86] leading-normal mt-2.5 font-sans">
                  추천: 이 분야는 미루기 쉬워요. 가장 작은 한 조각부터 끝내 완료율을 끌어올려 보세요.
                </p>
              </>
            ) : failedTasks > 0 ? (
              <>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold text-[#1c1c14] font-display tracking-tight">놓친 일 {failedTasks}개</span>
                  <span className="text-xs font-semibold text-[#6b6b58] mt-1">전체의 {totalTasks > 0 ? Math.round((failedTasks / totalTasks) * 100) : 0}%</span>
                </div>
                <p className="text-[11px] text-[#9a9a86] leading-normal mt-2.5 font-sans">
                  추천: 놓친 일은 범위를 줄여 다시 잡아보세요. 30%만 이번 목표로 정하면 다시 시작하기 쉬워요.
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold text-[#1c1c14] font-display tracking-tight">좋은 흐름이에요</span>
                  <span className="text-xs font-semibold text-[#6b6b58] mt-1">완료율 {successRate}% 유지 중</span>
                </div>
                <p className="text-[11px] text-[#9a9a86] leading-normal mt-2.5 font-sans">
                  추천: 지금 페이스를 유지하세요. 남은 일은 작게 쪼개 한 번에 하나씩 끝내면 됩니다.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Dynamic Tab Views Rendering */}
        
        {/* Tab 1: Comprehensive Summary View */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Stat Extra Details - Simple overview */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-sm text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">완료 성공률</span>
                <span className="text-lg font-semibold text-[#1c1c14] mt-1 block">{successRate}% 유지</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">전체 {totalTasks}개 기준</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-sm text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">오늘 성공률</span>
                <span className="text-lg font-semibold text-[#2d7a3a] mt-1 block">{todayRate}%</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">오늘 {todayTasks.length}개 중 {todayCompleted}개</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-sm text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">실패 기록</span>
                <span className="text-lg font-semibold text-[#c4674a] mt-1 block">{failedTasks}개</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">전체의 {totalTasks > 0 ? Math.round((failedTasks/totalTasks)*100) : 0}%</p>
              </div>
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-sm text-left">
                <span className="text-[11px] text-[#9a9a86] block uppercase tracking-wider">진행 중</span>
                <span className="text-lg font-semibold text-[#1c1c14] mt-1 block">{inProgressCount}개</span>
                <p className="text-[12px] text-[#9a9a86] mt-1">남은 할 일 {pendingCount}개</p>
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
                        <span>시간대별 성공률</span>
                      </h2>
                      <p className="text-[12px] text-[#9a9a86] mt-0.5 font-medium">오늘 시간대별 완료율과 과업 수</p>
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
                        <text x={graphLeft + graphWidth + 12} y={graphTop + 3} textAnchor="start">6개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphTop + graphHeight * 0.25 + 3} textAnchor="start">5개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphTop + graphHeight * 0.5 + 3} textAnchor="start">3개</text>
                        <text x={graphLeft + graphWidth + 12} y={graphTop + graphHeight * 0.75 + 3} textAnchor="start">2개</text>
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
                            {points[hoveredTrendIndex].day.dateLabel} 지표
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
                  <span>마우스를 올리면 그 시간대의 과업 수와 완료율을 확인할 수 있어요.</span>
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
                      TODAY
                    </span>
                  </div>

                  {/* 도넛 + 요약 (실제 카테고리 데이터 기반) */}
                  <div className="flex items-center gap-5 bg-[#f7f6f2] border border-[#e0ddd8] p-4 rounded-xl mb-4">
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" fill="transparent" stroke="#e0ddd8" strokeWidth="6" />
                        {donutSegments.map((seg, idx) => (
                          <circle key={idx} cx="32" cy="32" r="24" fill="transparent" stroke={seg.hex} strokeWidth="6"
                            strokeDasharray={`${seg.dash} ${DONUT_C}`} strokeDashoffset={seg.offset} />
                        ))}
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-[16px] font-bold text-[#1c1c14] leading-none block">{topShare}%</span>
                        <span className="text-[10px] text-[#9a9a86] leading-none mt-0.5 block">최다</span>
                      </div>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[11px] text-[#9a9a86] block mb-1">오늘 분포</span>
                      <span className="text-[14px] font-semibold text-[#1c1c14] block leading-snug">카테고리 비율 : {balanceText}</span>
                      <p className="text-[12px] text-[#9a9a86] mt-1 leading-relaxed">{balanceDesc}</p>
                    </div>
                  </div>

                  {/* 진행바 (실제 카테고리별 점유율) */}
                  <div className="space-y-3">
                    {categoryDistribution.length === 0 ? (
                      <p className="text-[12px] text-[#9a9a86] text-center py-4">등록된 할 일이 없습니다.</p>
                    ) : categoryDistribution.map((cat) => (
                      <div key={cat.key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[12px] text-[#6b6b58] truncate max-w-[200px]">{cat.label}</span>
                          <span className="text-[12px] font-semibold text-[#1c1c14] tabular-nums">{cat.share}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#edecea] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${cat.share}%`, backgroundColor: cat.hex }} />
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
                        intensity: "68%",
                        intensityColor: "text-[#2d7a3a]",
                        switching: "4개 완료",
                        fatigue: "낮음 (쾌적)",
                        prescription: "집중이 가장 잘 되는 시간대예요. 중요하고 어려운 일을 이 시간에 배치하면 완료율이 올라가요."
                      },
                      {
                        time: "오후 시간대 (13:00 - 15:00)",
                        intensity: "60%",
                        intensityColor: "text-[#1c1c14]",
                        switching: "3개 완료",
                        fatigue: "보통 (안정)",
                        prescription: "무난한 시간대예요. 가벼운 일들을 묶어서 처리하기 좋아요."
                      },
                      {
                        time: "오후 리스크 (15:00 - 17:00)",
                        intensity: "45%",
                        intensityColor: "text-[#c4674a]",
                        switching: "2개 완료",
                        fatigue: "높음 (피로)",
                        prescription: "집중이 가장 떨어지는 시간대예요. 잠깐 쉬거나 가벼운 작업 위주로 배치해보세요."
                      },
                      {
                        time: "저녁/야간 (18:00 - 21:00)",
                        intensity: "62%",
                        intensityColor: "text-[#1c1c14]",
                        switching: "3개 완료",
                        fatigue: "매우 낮음 (회복)",
                        prescription: "하루를 정리하기 좋은 시간대예요. 오늘 한 일을 돌아보고 내일 계획을 가볍게 세워보세요."
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
            <section className="bg-white border border-[#e0ddd8] rounded-xl p-6 shadow-sm text-left">
              <div className="flex items-center gap-1.5 border-b border-[#e0ddd8] pb-3 mb-4">
                <Zap className="w-4 h-4 text-[#1c1c14]" />
                <h3 className="text-sm font-semibold text-[#1c1c14] font-display">성과 하이라이트</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                {(() => {
                  const highlights = [
                    ...tasks.filter(t => t.completed),
                    ...tasks.filter(t => !t.completed && t.status === 'inprogress'),
                  ].slice(0, 3);

                  if (highlights.length === 0) {
                    return (
                      <p className="col-span-full text-[12px] text-[#9a9a86] py-6 text-center">아직 완료하거나 진행 중인 할 일이 없습니다.</p>
                    );
                  }

                  return highlights.map((t, idx) => {
                    const done = t.completed;
                    const catShort = CATEGORY_META[t.category]?.short ?? t.category;
                    return (
                      <div key={t.id} className="bg-[#f7f6f2] border border-[#e0ddd8] p-4.5 rounded-xl flex flex-col justify-between transition-all duration-200">
                        <div>
                          <div className="flex justify-between items-start gap-1 pb-2">
                            <h4 className="text-[12px] font-semibold text-[#1c1c14] font-sans tracking-tight leading-snug">{idx + 1}. {t.title}</h4>
                            <span className={`text-[11px] font-bold shrink-0 px-1.5 py-0.5 rounded-sm ${done ? 'bg-[#2d7a3a] text-white' : 'bg-[#c4674a] text-white'}`}>
                              {done ? '완료' : '진행중'}
                            </span>
                          </div>

                          {/* Tags — 실제 카테고리·우선순위 */}
                          <div className="flex gap-1 mb-2.5">
                            <span className="text-[11px] px-1.5 py-0.5 bg-white border border-[#e0ddd8] rounded text-[#6b6b58] font-semibold">{catShort}</span>
                            {t.priority === 'high' && (
                              <span className="text-[11px] px-1.5 py-0.5 bg-[#f8ede8] border border-[#e8c0b0] rounded text-[#c4674a] font-semibold">중요</span>
                            )}
                          </div>

                          <p className="text-[12px] text-[#6b6b58] leading-relaxed font-medium line-clamp-3">{t.description}</p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>

            {/* Row 4: Spreadsheet historical performance details table */}
            <section className="bg-white border border-[#e0ddd8] rounded-xl overflow-hidden shadow-sm text-left">
              <div className="px-6 py-5 border-b border-[#e0ddd8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#f7f6f2]/50">
                <div>
                  <h2 className="text-sm font-semibold text-[#1c1c14] font-display">자가 진단</h2>
                  <p className="text-[12px] text-[#9a9a86] mt-0.5 font-semibold">날짜를 클릭하면 그날 완료한 일과 분석 피드백을 확인할 수 있습니다.</p>
                </div>
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
                <span className="text-xl font-semibold text-[#1c1c14] font-sans">성공률 60% 달성</span>
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
                <p className="text-[11px] text-[#9a9a86] font-medium mt-1">이번 주 평균 완료율 60%</p>
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
                      <span>이번 주 완료율</span>
                    </h3>
                    <p className="text-[12px] text-[#9a9a86] mt-0.5 font-medium">요일마다 할 일을 얼마나 끝냈는지 보여줘요</p>
                  </div>
                  <span className="text-[11px] bg-[#edecea] text-[#1c1c14] font-semibold px-2 py-0.5 rounded border border-[#5a6e38]/20">
                    성공률 60%
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
                      <span className="text-[11px] text-[#9a9a86] font-bold block">스마트 쪼개기</span>
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
                    <h3 className="text-sm font-bold text-[#1c1c14] font-display">분야별 비중</h3>
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
                        <circle cx="64" cy="64" r="52" fill="transparent" stroke="#e0ddd8" strokeWidth="10" />
                        {donutSegmentsLg.map((seg, idx) => (
                          <circle key={idx} cx="64" cy="64" r="52" fill="transparent" stroke={seg.hex} strokeWidth="10"
                            strokeDasharray={`${seg.dash} ${DONUT_C_LG}`} strokeDashoffset={seg.offset} />
                        ))}
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
                      {categoryDistribution.length === 0 ? (
                        <p className="text-[12px] text-[#9a9a86] col-span-full text-center py-4">등록된 할 일이 없습니다.</p>
                      ) : categoryDistribution.map((cat) => (
                        <div key={cat.key} className="space-y-1 bg-[#f7f6f2]/50 p-2.5 rounded-xl border border-[#e0ddd8]">
                          <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#6b6b58] font-semibold truncate max-w-[150px]">{cat.label}</span>
                            <span className="font-mono text-[#1c1c14] font-semibold">{cat.share}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${cat.share}%`, backgroundColor: cat.hex }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#e0ddd8] flex items-center gap-2 text-[11px] font-semibold text-[#9a9a86]">
                      <Info className="w-4 h-4 text-[#1c1c14] shrink-0" />
                      <span>해당 분포 비율은 실제 등록된 할 일의 카테고리 기준입니다.</span>
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
                        { day: "월요일", deep: "4.5시간", slicing: "7개", peer: "2회", fatigue: "15% (매우 양호)", efficiency: "58%", effColor: "text-[#1c1c14]", feedback: "계획한 일 중 4개는 끝냈지만 3개가 밀려서 완료율이 조금 낮았어요." },
                        { day: "화요일", deep: "5.0시간", slicing: "8개", peer: "4회", fatigue: "28% (양호)", efficiency: "62%", effColor: "text-[#2d7a3a]", feedback: "오전엔 집중이 잘 됐는데, 오후에 급한 일정이 끼면서 일부만 마무리했어요." },
                        { day: "수요일", deep: "6.2시간", slicing: "10개", peer: "5회", fatigue: "42% (보통)", efficiency: "65%", effColor: "text-[#2d7a3a]", feedback: "이번 주 중 가장 많은 일을 끝낸 날이에요. 좋은 흐름을 잘 유지했어요." },
                        { day: "목요일", deep: "4.8시간", slicing: "6개", peer: "3회", fatigue: "35% (양호)", efficiency: "54%", effColor: "text-[#1c1c14]", feedback: "회의와 행정 처리가 많아서 정작 집중해야 할 일들이 뒤로 밀렸어요." },
                        { day: "금요일", deep: "5.5시간", slicing: "9개", peer: "6회", fatigue: "50% (주의)", efficiency: "60%", effColor: "text-[#2d7a3a]", feedback: "미팅과 주간 리포트 정리는 끝냈지만 개인 과제는 조금 미뤄졌어요." },
                        { day: "토요일", deep: "3.5시간", slicing: "4개", peer: "1회", fatigue: "18% (안정)", efficiency: "50%", effColor: "text-[#1c1c14]", feedback: "주말이라 가볍게 계획했고, 기본 작업 2개만 마무리했어요." },
                        { day: "일요일", deep: "4.0시간", slicing: "5개", peer: "3회", fatigue: "25% (우수)", efficiency: "61%", effColor: "text-[#2d7a3a]", feedback: "무리하지 않는 선에서 5개 중 3개를 안정적으로 끝냈어요." }
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
                    <span>히트맵 분석</span>
                  </h2>
                  <p className="text-xs font-semibold text-[#9a9a86] mt-0.5">요일·시간대별로 언제 집중이 잘 됐는지 한눈에 보여줘요. 칸에 마우스를 올리면 자세한 수치가 나와요.</p>
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
                              else if (val > 80) fillStyle = 'bg-[#5a6e38] border-[#4a5c2e] shadow-sm';

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
                              <p className="text-[#2d7a3a]">✓ 초고도 집중력을 유지하는 최고의 골든 슬롯입니다! 복잡하고 어려운 일을 이 시간에 배치하세요.</p>
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
                                    <span>일일 오전 할 일 분할 쪼개기 배정</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b58] font-medium">
                                    <Check className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0" />
                                    <span>할 일 1차 우선순위 정렬 및 준비</span>
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
                      오전 10시 전후에 완료율이 가장 높고, 금요일 오후 3시 이후에는 집중도가 뚝 떨어져요. 이 시간대를 미리 알아두고 무리한 계획을 피하면 도움이 돼요.
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
                <span className="text-[11px] text-[#2d7a3a] bg-[#ecf0e4] border border-[#c8d4a8] px-2 py-0.5 rounded font-bold">상세 분석</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "집중 잘 되는 시간 (09:00 - 12:00)",
                    rate: "68%",
                    desc: "하루 중 집중이 가장 잘 되는 시간대예요. 중요하고 어려운 일을 이 시간에 배치하세요.",
                    color: "border-l-4 border-[#2d7a3a] bg-[#ecf0e4]/10"
                  },
                  {
                    title: "집중 떨어지는 시간 (15:00 - 16:30)",
                    rate: "45%",
                    desc: "피로가 쌓여 집중이 떨어지는 시간대예요. 어려운 일보다 가벼운 작업을 배치하거나, 잠깐 쉬어가세요.",
                    color: "border-l-4 border-[#c4674a] bg-[#f8ede8]/10"
                  },
                  {
                    title: "하루 정리 시간 (18:00 - 19:30)",
                    rate: "62%",
                    desc: "하루를 정리하기 좋은 시간이에요. 오늘 한 일을 돌아보고 내일 할 일을 미리 정해두면 다음 날 시작이 가벼워져요.",
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
                        <span>전체 생산 점유율 {totalTasks > 0 ? Math.round((cat.count / totalTasks) * 100) : 0}%</span>
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
                  <h3 className="text-xs font-bold text-[#9a9a86] uppercase tracking-wider mb-2">{selectedCategoryFilter} · 카테고리 피드백</h3>
                  <div className="text-[#1c1c14] text-xs font-medium font-sans leading-relaxed">
                    {selectedCategoryFilter === 'Work' && (
                      <p>업무는 완료율 64%로 비교적 잘 끝내는 편이에요. 다만 늦은 미팅과 겹칠 때 밀리는 경우가 있으니, 중요한 업무는 오전에 먼저 배치해보세요.</p>
                    )}
                    {selectedCategoryFilter === 'Meeting' && (
                      <p>미팅은 62%로 무난하게 참석하고 있어요. 안건을 미리 10분만 정리해두면 회의가 더 짧고 깔끔하게 끝나요.</p>
                    )}
                    {selectedCategoryFilter === 'Project' && (
                      <p>프로젝트는 한 건당 시간이 큰 편이라 미뤄지기 쉬워요. 30분 단위로 쪼개서 단계별로 진행하면 완료율이 올라가요.</p>
                    )}
                    {selectedCategoryFilter === 'Admin' && (
                      <p className="text-[#c4674a] font-semibold">지원·행정 업무는 완료율 40%로 가장 자주 놓쳐요. 피로가 쌓이는 오후보다 가벼운 오전 자투리 시간에 몰아서 처리해보세요.</p>
                    )}
                    {selectedCategoryFilter === 'Research' && (
                      <p>연구는 60% 안팎으로 무난해요. 찾은 자료를 바로 한 줄 메모로 남기는 습관이 잘 잡혀 있어요.</p>
                    )}
                    {selectedCategoryFilter === 'Other' && (
                      <p>개인 일도 60% 정도로 잘 챙기고 있어요. 퇴근 직후 가볍게 처리하는 지금 패턴이 좋아요.</p>
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
