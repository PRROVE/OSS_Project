import React, { useState } from "react";
import {
  TrendingUp, Award, AlertTriangle, Sparkles,
  PieChart, Activity, Bell, Clock, Layers, ChevronRight,
  BarChart3, ChevronDown, ChevronUp, CheckCircle2, XCircle,
  Info, Zap
} from "lucide-react";
import { Task } from "../types";

interface ScreenAnalyticsProps {
  tasks: Task[];
}

type AnalyticsTab = "summary" | "weekly_report" | "hourly" | "category" | "pattern";

const CATEGORY_META: Record<string, { label: string; short: string; hex: string; progressColor: string }> = {
  WORK:     { label: "업무 (Work)",        short: "업무",     hex: "#5a6e38", progressColor: "from-[#5a6e38] to-[#4a5c2e]" },
  STUDY:    { label: "학업 (Study)",       short: "학업",     hex: "#4F46E5", progressColor: "from-[#4F46E5] to-[#6366F1]" },
  MEETING:  { label: "미팅 (Meeting)",     short: "미팅",     hex: "#1c1c14", progressColor: "from-[#1c1c14] to-[#1c1c14]" },
  HOBBY:    { label: "취미 (Hobby)",       short: "취미",     hex: "#d4895a", progressColor: "from-[#d4895a] to-[#c4674a]" },
  HEALTH:   { label: "건강 (Health)",      short: "건강",     hex: "#2d7a3a", progressColor: "from-[#2d7a3a] to-[#2d7a3a]" },
  PROJECT:  { label: "프로젝트 (Project)", short: "프로젝트", hex: "#a4b878", progressColor: "from-[#a4b878] to-[#7a8e52]" },
  ADMIN:    { label: "기타/행정 (Admin)",  short: "운영",     hex: "#c4674a", progressColor: "from-[#c4674a] to-[#c4674a]" },
  RESEARCH: { label: "리서치 (Research)",  short: "연구",     hex: "#7a8e52", progressColor: "from-[#7a8e52] to-[#5a6e38]" },
};

const MOCK_HEATMAP: { hour: string; values: number[] }[] = [
  { hour: "9AM",  values: [45, 60, 82, 55, 70, 20, 35] },
  { hour: "10AM", values: [80, 90, 95, 75, 85, 30, 50] },
  { hour: "11AM", values: [70, 75, 80, 65, 78, 25, 40] },
  { hour: "12PM", values: [30, 40, 35, 30, 42, 55, 60] },
  { hour: "1PM",  values: [45, 50, 60, 48, 52, 65, 70] },
  { hour: "3PM",  values: [55, 60, 55, 45, 60, 15, 20] },
  { hour: "6PM",  values: [65, 70, 62, 68, 72, 40, 45] },
  { hour: "9PM",  values: [35, 40, 30, 35, 38, 50, 55] },
];

const weeklyBarData = [
  { label: "월", height: "58%", active: false },
  { label: "화", height: "62%", active: false },
  { label: "수", height: "65%", active: false },
  { label: "목", height: "54%", active: false },
  { label: "금", height: "60%", active: false },
  { label: "토", height: "50%", active: false },
  { label: "일", height: "61%", active: true },
];

const tableData = [
  { date: "오늘", tag1: "보고서", tag2: "미팅",   success: 60, momentum: [40,55,50,45,60,60], totalT: 5, completedT: 3, duration: "5.2시간", cognitiveBurden: "집중도 보통 (오후에 다소 분산)", interruptionNotes: "오전엔 계획대로 잘 진행했지만, 오후 피로가 쌓여 2건을 다음 날로 미뤘어요.", details: [{ name: "주간 성과 보고서 초안 작성", category: "Work", time: "오전 10:30", duration: "45분", status: "done" },{ name: "신제품 출시 마케팅 캠페인 기획", category: "Project", time: "오후 1:15", duration: "1.5시간", status: "done" },{ name: "팀 데일리 스크럼 미팅", category: "Meeting", time: "오후 4:00", duration: "30분", status: "done" },{ name: "경쟁사 리서치 자료 정리", category: "Research", time: "오후 5:30", duration: "1시간", status: "failed" },{ name: "월말 비용 정산 서류 검토", category: "Admin", time: "오후 6:00", duration: "30분", status: "failed" }] },
  { date: "어제", tag1: "리포트", tag2: null,     success: 60, momentum: [30,40,60,50,60,62], totalT: 5, completedT: 3, duration: "6.2시간", cognitiveBurden: "집중도 보통 (오후 3시 흐름 끊김)", interruptionNotes: "오후 3시에 급한 연락이 와서 집중이 끊겨 일부 일정이 밀렸어요.", details: [{ name: "거래처 미팅 자료 준비", category: "Work", time: "오전 9:15", duration: "1시간", status: "done" },{ name: "Q3 분기별 마케팅 리포트 초안", category: "Project", time: "오전 11:30", duration: "2시간", status: "done" },{ name: "주간 일정 정리 및 우선순위 조정", category: "Work", time: "오후 3:00", duration: "1.2시간", status: "failed" },{ name: "고객 피드백 설문 결과 분석", category: "Research", time: "오후 4:45", duration: "45분", status: "done" },{ name: "받은 이메일 정리 및 회신", category: "Admin", time: "오후 5:30", duration: "30분", status: "failed" }] },
  { date: "그제", tag1: "기획",   tag2: "이메일", success: 50, momentum: [50,30,45,52,48,50], totalT: 4, completedT: 2, duration: "5.8시간", cognitiveBurden: "집중도 다소 낮음 (체력 저하)", interruptionNotes: "피로가 쌓여서 오후 작업 일부를 다음 날로 미뤘어요.", details: [{ name: "분기 기획 회의 안건 정리", category: "Project", time: "오전 10:00", duration: "2시간", status: "done" },{ name: "협력사 미팅 참석", category: "Meeting", time: "오후 2:00", duration: "1시간", status: "done" },{ name: "밀린 이메일 회신 및 문서 정리", category: "Admin", time: "오후 4:30", duration: "1.5시간", status: "failed" },{ name: "발표 슬라이드 디자인 다듬기", category: "Work", time: "오후 5:30", duration: "1시간", status: "failed" }] },
];

export default function ScreenAnalytics({ tasks }: ScreenAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("summary");
  const [selectedRowDate, setSelectedRowDate] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [hoveredHeatCell, setHoveredHeatCell] = useState<{ row: string; idx: number; val: number } | null>(null);

  // ── 실제 task 기반 통계 ──
  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const failedTasks    = tasks.filter(t => t.failed).length;
  const successRate    = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingCount   = tasks.filter(t => !t.completed && !t.failed).length;

  const categoryStats = Object.keys(CATEGORY_META).map(key => {
    const ct = tasks.filter(t => t.category === key);
    const completed = ct.filter(t => t.completed).length;
    return {
      key,
      ...CATEGORY_META[key],
      count: ct.length,
      completed,
      rate: ct.length > 0 ? Math.round((completed / ct.length) * 100) : 0,
      share: totalTasks > 0 ? Math.round((ct.length / totalTasks) * 100) : 0,
    };
  }).filter(c => c.count > 0);

  const categoryDistribution = [...categoryStats].sort((a, b) => b.count - a.count);
  const topCat  = categoryDistribution[0];
  const weakCat = [...categoryStats].sort((a, b) => a.rate - b.rate)[0];

  const DONUT_C = 150.796;
  let donutOffset = 0;
  const donutSegments = categoryDistribution.map(cat => {
    const len = totalTasks > 0 ? (cat.count / totalTasks) * DONUT_C : 0;
    const seg = { hex: cat.hex, dash: len, offset: -donutOffset };
    donutOffset += len;
    return seg;
  });

  const topShare = topCat?.share ?? 0;
  const balanceText =
    categoryDistribution.length <= 1 ? "단일 분야 집중"
    : topShare >= 60 ? "특정 분야 편중"
    : topShare >= 40 ? "주력 분야 뚜렷"
    : "고른 편";
  const balanceDesc =
    categoryDistribution.length <= 1 ? "한 가지 분야에 일정이 집중되어 있습니다."
    : topShare >= 60 ? `'${topCat?.short}' 분야에 일정이 크게 몰려 있습니다.`
    : topShare >= 40 ? `'${topCat?.short}' 분야 비중이 가장 높습니다.`
    : "여러 분야의 일정을 고르게 계획했습니다.";

  // SVG 라인 차트 수치
  const svgW = 330; const svgH = 180;
  const gLeft = 30; const gWidth = 280;
  const gBottom = 150; const gTop = 20; const gH = gBottom - gTop;
  const lineData = [
    { label: "09시", rate: 64, volume: 2 },
    { label: "11시", rate: 66, volume: 4 },
    { label: "13시", rate: 60, volume: 3 },
    { label: "15시", rate: 52, volume: 5 },
    { label: "17시", rate: 58, volume: 4 },
    { label: "19시", rate: 62, volume: 2 },
    { label: "21시", rate: 59, volume: 1 },
  ];
  const pts = lineData.map((d, i) => ({
    x: gLeft + i * (gWidth / 6),
    y: gBottom - (d.rate / 100) * gH,
    d
  }));
  const linePath = pts.reduce((acc, p, i) => i === 0 ? `M${p.x},${p.y}` : `${acc} L${p.x},${p.y}`, "");
  const areaPath = pts.length > 0 ? `${linePath} L${pts[pts.length-1].x},${gBottom} L${pts[0].x},${gBottom} Z` : "";

  const TABS: { id: AnalyticsTab; label: string }[] = [
    { id: "summary",       label: "일일 요약" },
    { id: "weekly_report", label: "주간 리포트" },
    { id: "hourly",        label: "시간대별" },
    { id: "category",      label: "카테고리" },
    { id: "pattern",       label: "실패 패턴" },
  ];

  return (
    <div id="analytics-screen" className="w-full bg-[#f7f6f2] flex flex-col min-h-screen pb-24 relative">

      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-50 bg-[#f7f6f2] border-b border-[#e0ddd8] px-5 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1c1c14] tracking-tight">분석</h1>
            <p className="text-[12px] text-[#9a9a86] mt-0.5">할 일 완료 현황과 패턴을 확인합니다.</p>
          </div>
          <button className="p-1 rounded-full hover:bg-[#edecea] transition-all">
            <Bell className="w-5 h-5 text-[#6b6b58]" />
          </button>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar border-b border-[#e0ddd8]">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 border-b-2 text-[12px] font-bold tracking-wide transition-all whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? "border-[#5a6e38] text-[#1c1c14]"
                  : "border-transparent text-[#9a9a86] hover:text-[#1c1c14] hover:border-[#e0ddd8]"
              }`}
            >{tab.label}</button>
          ))}
        </div>
      </header>

      {/* ── 메인 ── */}
      <main className="p-4 space-y-4">

        {/* ── 상단 요약 카드 3개 (공통) ── */}
        <section className="space-y-3">
          <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#ecf0e4] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-[#2d7a3a]" />
              </div>
              <span className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">종합 완수율</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1c1c14]">{successRate}%</span>
              {successRate >= 70 && <span className="text-[10px] font-semibold text-[#2d7a3a] bg-[#ecf0e4] px-2 py-0.5 rounded-full">양호 ▲</span>}
            </div>
            <p className="text-[11px] text-[#9a9a86] font-medium mt-1">총 {totalTasks}개 중 {completedTasks}개 완료 ({failedTasks}개 실패)</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#edecea] flex items-center justify-center">
                  <Award className="w-3 h-3 text-[#1c1c14]" />
                </div>
                <span className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">집중 부문</span>
              </div>
              <span className="text-sm font-bold text-[#1c1c14] block">{topCat ? topCat.short : "—"}</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex-1 h-1 bg-[#f7f6f2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5a6e38] rounded-full" style={{ width: `${topCat?.share ?? 0}%` }} />
                </div>
                <span className="text-[10px] font-semibold text-[#6b6b58]">{topCat ? `${topCat.count}개` : "0개"}</span>
              </div>
            </div>

            <div className="bg-[#edecea]/40 border-l-[3px] border-[#5a6e38] rounded-r-xl rounded-l-sm p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[#1c1c14]/20"><Sparkles className="w-4 h-4" /></div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#e0ddd8]">
                  <AlertTriangle className="w-3 h-3 text-[#c4674a]" />
                </div>
                <span className="text-[10px] font-bold text-[#1c1c14] uppercase tracking-wider">AI 코멘트</span>
              </div>
              {weakCat && weakCat.rate < 70 ? (
                <>
                  <span className="text-xs font-bold text-[#1c1c14] block leading-snug">'{weakCat.short}' 주의</span>
                  <p className="text-[10px] text-[#9a9a86] mt-1">완료율 {weakCat.rate}%로 낮아요</p>
                </>
              ) : failedTasks > 0 ? (
                <>
                  <span className="text-xs font-bold text-[#1c1c14] block">놓친 일 {failedTasks}개</span>
                  <p className="text-[10px] text-[#9a9a86] mt-1">작게 쪼개 다시 잡아보세요</p>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-[#1c1c14] block">좋은 흐름이에요</span>
                  <p className="text-[10px] text-[#9a9a86] mt-1">완료율 {successRate}% 유지 중</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ */}
        {/* Tab 1: 일일 요약            */}
        {/* ════════════════════════════ */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "완료 성공률",    value: `${successRate}% 유지`, sub: `전체 ${totalTasks}개 기준`,      color: "text-[#1c1c14]" },
                { label: "실패 기록",      value: `${failedTasks}개`,     sub: `전체의 ${totalTasks > 0 ? Math.round((failedTasks/totalTasks)*100) : 0}%`, color: "text-[#c4674a]" },
                { label: "완료된 총 과업", value: `${completedTasks}개`,  sub: "누적 완료",                     color: "text-[#1c1c14]" },
                { label: "남은 할 일",     value: `${pendingCount}개`,    sub: "미완료 항목",                   color: "text-[#1c1c14]" },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] text-[#9a9a86] block uppercase tracking-wider">{s.label}</span>
                  <span className={`text-base font-semibold mt-1 block ${s.color}`}>{s.value}</span>
                  <p className="text-[10px] text-[#9a9a86] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* SVG 라인 차트 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-[#e0ddd8] pb-3">
                <div>
                  <h2 className="text-sm font-semibold text-[#1c1c14] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />시간대별 성공률
                  </h2>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">오늘 시간대별 완료율과 과업 수</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6b6b58]">
                  <div className="w-2.5 h-0.5 bg-[#5a6e38] rounded-full" />
                  <span>완수율(%)</span>
                </div>
              </div>
              <svg className="w-full h-auto" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet">
                {[1, 0.75, 0.5, 0.25].map((v, i) => (
                  <line key={i} x1={gLeft} y1={gBottom - v * gH} x2={gLeft + gWidth} y2={gBottom - v * gH}
                    stroke="#f7f6f2" strokeWidth="1" strokeDasharray="3,3" />
                ))}
                <line x1={gLeft} y1={gBottom} x2={gLeft + gWidth} y2={gBottom} stroke="#e0ddd8" strokeWidth="1.5" />
                {[100, 75, 50, 25, 0].map((v, i) => (
                  <text key={i} x={gLeft - 5} y={gBottom - (v / 100) * gH + 3} textAnchor="end" fill="#e0ddd8" fontSize="8px" fontWeight="bold">{v}%</text>
                ))}
                <defs>
                  <linearGradient id="olive-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a6e38" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5a6e38" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {pts.map((p, i) => {
                  const bH = (p.d.volume / 6) * gH;
                  return <rect key={i} x={p.x - 8} y={gBottom - bH} width={16} height={bH} rx={3} fill="#f7f6f2" />;
                })}
                <path d={areaPath} fill="url(#olive-fade)" />
                <path d={linePath} fill="none" stroke="#5a6e38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#5a6e38" strokeWidth="2.5" />
                ))}
                {pts.map((p, i) => (
                  <text key={i} x={p.x} y={gBottom + 14} textAnchor="middle" fill="#9a9a86" fontSize="9px" fontWeight="bold">{p.d.label}</text>
                ))}
              </svg>
              <div className="mt-2 flex items-center gap-1.5 bg-[#f7f6f2] border border-[#e0ddd8] p-2.5 rounded-xl text-[#6b6b58] text-[10px] font-bold">
                <Info className="w-3 h-3 text-[#1c1c14] shrink-0" />
                <span>마우스를 올리면 그 시간대의 과업 수와 완료율을 확인할 수 있어요.</span>
              </div>
            </div>

            {/* 카테고리 밸런스 도넛 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#2d7a3a]" />
                  <h3 className="text-sm font-semibold text-[#1c1c14]">업무 영역별 밸런스 점유율</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#f7f6f2] border border-[#e0ddd8] p-3 rounded-xl mb-3">
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="24" fill="transparent" stroke="#e0ddd8" strokeWidth="6" />
                    {donutSegments.map((seg, idx) => (
                      <circle key={idx} cx="32" cy="32" r="24" fill="transparent" stroke={seg.hex} strokeWidth="6"
                        strokeDasharray={`${seg.dash} ${DONUT_C}`} strokeDashoffset={seg.offset} />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-[#1c1c14]">{topShare}%</span>
                    <span className="text-[9px] text-[#9a9a86]">최다</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#9a9a86] block mb-0.5">오늘 분포</span>
                  <span className="text-sm font-semibold text-[#1c1c14] block">카테고리 비율 : {balanceText}</span>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5 leading-relaxed">{balanceDesc}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {categoryDistribution.length === 0 ? (
                  <p className="text-[12px] text-[#9a9a86] text-center py-4">등록된 할 일이 없습니다.</p>
                ) : categoryDistribution.map(cat => (
                  <div key={cat.key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] text-[#6b6b58] truncate">{cat.label}</span>
                      <span className="text-[11px] font-semibold text-[#1c1c14] tabular-nums ml-2">{cat.share}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#edecea] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.share}%`, backgroundColor: cat.hex }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 시간대별 분석 카드형 테이블 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-[#e0ddd8] pb-3">
                <Activity className="w-4 h-4 text-[#1c1c14]" />
                <h3 className="text-sm font-semibold text-[#1c1c14]">시간대별 성공률 분석</h3>
              </div>
              <div className="space-y-2">
                {[
                  { time: "오전 (09~12시)",       rate: "68%", rateColor: "text-[#2d7a3a]", tasks: "4개 완료", fatigue: "낮음",   tip: "집중이 가장 잘 되는 시간대예요. 중요하고 어려운 일을 이 시간에 배치하면 완료율이 올라가요." },
                  { time: "오후 초 (13~15시)",     rate: "60%", rateColor: "text-[#1c1c14]", tasks: "3개 완료", fatigue: "보통",   tip: "무난한 시간대예요. 가벼운 일들을 묶어서 처리하기 좋아요." },
                  { time: "오후 리스크 (15~17시)", rate: "45%", rateColor: "text-[#c4674a]", tasks: "2개 완료", fatigue: "높음",   tip: "집중이 가장 떨어지는 시간대예요. 잠깐 쉬거나 가벼운 작업 위주로 배치해보세요." },
                  { time: "저녁/야간 (18~21시)",   rate: "62%", rateColor: "text-[#1c1c14]", tasks: "3개 완료", fatigue: "매우 낮음", tip: "하루를 정리하기 좋은 시간대예요. 내일 계획을 가볍게 세워보세요." },
                ].map((row, i) => (
                  <div key={i} className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-[#1c1c14]">{row.time}</span>
                      <span className={`text-[11px] font-bold ${row.rateColor}`}>{row.rate}</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-[#9a9a86] font-semibold mb-1">
                      <span>완료: {row.tasks}</span><span>•</span><span>피로도: {row.fatigue}</span>
                    </div>
                    <p className="text-[10px] text-[#9a9a86] leading-relaxed">{row.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 성과 하이라이트 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 border-b border-[#e0ddd8] pb-3 mb-3">
                <Zap className="w-4 h-4 text-[#1c1c14]" />
                <h3 className="text-sm font-semibold text-[#1c1c14]">성과 하이라이트</h3>
              </div>
              {(() => {
                const highlights = tasks.filter(t => t.completed).slice(0, 3);
                if (highlights.length === 0)
                  return <p className="text-[12px] text-[#9a9a86] py-4 text-center">아직 완료한 할 일이 없습니다.</p>;
                return (
                  <div className="space-y-2">
                    {highlights.map((t, idx) => (
                      <div key={t.id} className="bg-[#f7f6f2] border border-[#e0ddd8] p-3 rounded-xl flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2d7a3a] mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-[#1c1c14] leading-snug truncate">{idx+1}. {t.title}</h4>
                          <div className="flex gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 bg-white border border-[#e0ddd8] rounded text-[#6b6b58] font-semibold">{CATEGORY_META[t.category]?.short ?? t.category}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#2d7a3a] rounded text-white font-semibold">완료</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* 자가 진단 (expandable) */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-4 border-b border-[#e0ddd8] bg-[#f7f6f2]/50">
                <h2 className="text-sm font-semibold text-[#1c1c14]">자가 진단</h2>
                <p className="text-[11px] text-[#9a9a86] mt-0.5 font-semibold">날짜를 탭하면 그날 완료한 일과 분석 피드백을 확인할 수 있습니다.</p>
              </div>
              {tableData.map(row => {
                const isExpanded = selectedRowDate === row.date;
                return (
                  <React.Fragment key={row.date}>
                    <div onClick={() => setSelectedRowDate(isExpanded ? null : row.date)}
                      className="flex items-center justify-between px-4 py-3 border-b border-[#e0ddd8] hover:bg-[#edecea]/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1c1c14] shrink-0" />
                        <span className="text-xs font-bold text-[#1c1c14]">{row.date}</span>
                        <div className="flex gap-1 ml-1">
                          <span className="px-2 py-0.5 rounded-full bg-[#edecea] text-[10px] font-bold text-[#1c1c14]">{row.tag1}</span>
                          {row.tag2 && <span className="px-2 py-0.5 rounded-full bg-[#f7f6f2] text-[10px] font-bold text-[#6b6b58]">{row.tag2}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-[#2d7a3a]">{row.success}%</span>
                        <div className="w-10 h-4 flex items-end gap-0.5">
                          {row.momentum.map((v, i) => (
                            <div key={i} className="bg-[#5a6e38]/80 rounded-t-sm flex-1" style={{ height: `${v}%` }} />
                          ))}
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#f7f6f2] flex items-center justify-center text-[#6b6b58]">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="bg-[#f7f6f2]/50 p-4 border-b border-[#e0ddd8]/60">
                        <div className="bg-white border border-[#e0ddd8] rounded-xl p-3 mb-3">
                          <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-2 mb-2.5">
                            <span className="text-[10px] font-semibold text-[#6b6b58] uppercase tracking-wider">당일 시간별 세부 완수 목록</span>
                            <span className="text-[11px] text-[#9a9a86] font-semibold">{row.completedT}/{row.totalT} 완료</span>
                          </div>
                          <div className="space-y-2">
                            {row.details.map((task, k) => (
                              <div key={k} className="flex items-start gap-2 p-1.5 hover:bg-[#edecea] rounded-lg transition-colors">
                                {task.status === "done"
                                  ? <CheckCircle2 className="w-3.5 h-3.5 text-[#2d7a3a] mt-0.5 shrink-0" />
                                  : <XCircle className="w-3.5 h-3.5 text-[#c4674a] mt-0.5 shrink-0" />
                                }
                                <div className="min-w-0">
                                  <h5 className={`text-[11px] font-bold truncate ${task.status === "done" ? "text-[#1c1c14]" : "text-[#6b6b58] line-through"}`}>{task.name}</h5>
                                  <div className="flex gap-1.5 text-[10px] text-[#9a9a86] font-semibold mt-0.5">
                                    <span className="bg-[#edecea]/40 text-[#6b6b58] px-1 rounded">{task.category}</span>
                                    <span>•</span><span>{task.time}</span>
                                    <span>•</span><span>{task.duration}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white border border-[#e0ddd8] rounded-xl p-3">
                          <span className="text-[10px] font-bold text-[#9a9a86] block uppercase tracking-wider mb-2">AI 주간 분석 자가 인지 진단</span>
                          <div className="space-y-1.5 text-xs text-[#1c1c14] font-semibold">
                            <p>총 집중 시간: <span className="font-mono bg-[#f7f6f2] border border-[#e0ddd8] px-1.5 py-0.5 rounded text-[11px]">{row.duration}</span></p>
                            <p>집중도 급락: <span>{row.cognitiveBurden}</span></p>
                            <p className="text-[11px] text-[#6b6b58] font-semibold pt-1.5 border-t border-[#e0ddd8]">{row.interruptionNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════ */}
        {/* Tab 2: 주간 리포트          */}
        {/* ════════════════════════════ */}
        {activeTab === "weekly_report" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "주간 완성도 지수",  value: "성공률 60% 달성", sub: "목표 쪼개기 개선 진행 중", color: "text-[#1c1c14]" },
                { label: "업무 밸런스 총량",  value: "7일간 집중",      sub: "이전 주 대비 +3.2%",      color: "text-[#2d7a3a]" },
                { label: "종합분석 성능곡선", value: "집중 조율기 도입", sub: "평균 집중도 60%",          color: "text-[#c4674a]" },
                { label: "완료 통계 지표",    value: "15/25개 완수",    sub: "이번 주 평균 완료율 60%",  color: "text-[#1c1c14]" },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] text-[#9a9a86] block uppercase tracking-wider">{s.label}</span>
                  <span className={`text-sm font-semibold mt-1 block ${s.color}`}>{s.value}</span>
                  <p className="text-[10px] text-[#9a9a86] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* 요일별 바 차트 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1c1c14] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />이번 주 완료율
                  </h3>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">요일마다 할 일을 얼마나 끝냈는지 보여줘요</p>
                </div>
                <span className="text-[10px] bg-[#edecea] text-[#1c1c14] font-semibold px-2 py-0.5 rounded border border-[#5a6e38]/20">성공률 60%</span>
              </div>
              <div className="flex items-end justify-between h-28 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl px-4 pt-3">
                {weeklyBarData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-full flex justify-center items-end h-20">
                      <div style={{ height: item.height }}
                        className={`w-4 rounded-t-sm transition-all duration-500 ${item.active ? "bg-gradient-to-t from-[#1c1c14] to-[#2d7a3a]" : "bg-[#5a6e38]/40"}`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${item.active ? "text-[#1c1c14]" : "text-[#9a9a86]"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 bg-[#f7f6f2]/50 p-3 rounded-xl border border-[#e0ddd8] text-center">
                {[
                  { label: "완수 목표 수",  val: "3개 완료",   color: "text-[#1c1c14]" },
                  { label: "스마트 쪼개기", val: "15분 단위",  color: "text-[#1c1c14]" },
                  { label: "주간 비율",     val: "+18% 상승",  color: "text-[#2d7a3a]" },
                ].map((s, i) => (
                  <div key={i}>
                    <span className="text-[10px] text-[#9a9a86] font-bold block">{s.label}</span>
                    <span className={`text-[11px] font-semibold font-mono ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 분야별 비중 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38]" />
                  <h3 className="text-sm font-bold text-[#1c1c14]">분야별 비중</h3>
                </div>
                <span className="text-[10px] bg-[#edecea] border border-[#e0ddd8] text-[#1c1c14] px-2 py-0.5 rounded font-semibold">BALANCE CODE</span>
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="24" fill="transparent" stroke="#e0ddd8" strokeWidth="6" />
                    {donutSegments.map((seg, idx) => (
                      <circle key={idx} cx="32" cy="32" r="24" fill="transparent" stroke={seg.hex} strokeWidth="6"
                        strokeDasharray={`${seg.dash} ${DONUT_C}`} strokeDashoffset={seg.offset} />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-[#9a9a86] leading-none">측정 기간</span>
                    <span className="text-sm font-semibold text-[#1c1c14] leading-none mt-0.5">1주일</span>
                    <span className="text-[9px] font-semibold text-[#1c1c14] font-mono">(7일간)</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  {categoryDistribution.length === 0 ? (
                    <p className="text-[12px] text-[#9a9a86] text-center py-2">등록된 할 일이 없습니다.</p>
                  ) : categoryDistribution.map(cat => (
                    <div key={cat.key} className="space-y-0.5 bg-[#f7f6f2]/50 p-2 rounded-lg border border-[#e0ddd8]">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#6b6b58] font-semibold truncate">{cat.label}</span>
                        <span className="font-mono text-[#1c1c14] font-semibold ml-2">{cat.share}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#f7f6f2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${cat.share}%`, backgroundColor: cat.hex }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#9a9a86] pt-2 border-t border-[#e0ddd8]">
                <Info className="w-3.5 h-3.5 text-[#1c1c14] shrink-0" />
                <span>해당 분포 비율은 실제 등록된 할 일의 카테고리 기준입니다.</span>
              </div>
            </div>

            {/* 요일별 상세 분석 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#1c1c14]" />
                  <h3 className="text-sm font-semibold text-[#1c1c14]">요일별 상세 분석</h3>
                </div>
                <span className="text-[10px] text-[#2d7a3a] bg-[#ecf0e4] border border-[#c8d4a8] px-1.5 py-0.5 rounded font-bold">7-day tracking</span>
              </div>
              <div className="space-y-2">
                {[
                  { day: "월", deep: "4.5h", tasks: "7개", fatigue: "15%", eff: "58%", effColor: "text-[#1c1c14]", tip: "계획한 일 중 4개는 끝냈지만 3개가 밀려서 완료율이 조금 낮았어요." },
                  { day: "화", deep: "5.0h", tasks: "8개", fatigue: "28%", eff: "62%", effColor: "text-[#2d7a3a]", tip: "오전엔 집중이 잘 됐는데, 오후에 급한 일정이 끼면서 일부만 마무리했어요." },
                  { day: "수", deep: "6.2h", tasks: "10개", fatigue: "42%", eff: "65%", effColor: "text-[#2d7a3a]", tip: "이번 주 중 가장 많은 일을 끝낸 날이에요. 좋은 흐름을 잘 유지했어요." },
                  { day: "목", deep: "4.8h", tasks: "6개",  fatigue: "35%", eff: "54%", effColor: "text-[#1c1c14]", tip: "회의와 행정 처리가 많아서 집중해야 할 일들이 뒤로 밀렸어요." },
                  { day: "금", deep: "5.5h", tasks: "9개",  fatigue: "50%", eff: "60%", effColor: "text-[#2d7a3a]", tip: "미팅과 주간 리포트 정리는 끝냈지만 개인 과제는 조금 미뤄졌어요." },
                  { day: "토", deep: "3.5h", tasks: "4개",  fatigue: "18%", eff: "50%", effColor: "text-[#1c1c14]", tip: "주말이라 가볍게 계획했고, 기본 작업 2개만 마무리했어요." },
                  { day: "일", deep: "4.0h", tasks: "5개",  fatigue: "25%", eff: "61%", effColor: "text-[#2d7a3a]", tip: "무리하지 않는 선에서 5개 중 3개를 안정적으로 끝냈어요." },
                ].map((row, i) => (
                  <div key={i} className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg p-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#1c1c14] w-4 shrink-0">{row.day}</span>
                      <span className="text-[10px] text-[#6b6b58] font-semibold">{row.deep}</span>
                      <span className="text-[10px] text-[#9a9a86]">•</span>
                      <span className="text-[10px] text-[#6b6b58] font-semibold">{row.tasks}</span>
                      <span className="text-[10px] text-[#9a9a86]">•</span>
                      <span className="text-[10px] text-[#6b6b58] font-semibold">피로 {row.fatigue}</span>
                      <span className="text-[10px] text-[#9a9a86]">•</span>
                      <span className={`text-[10px] font-bold ${row.effColor}`}>{row.eff}</span>
                    </div>
                    <p className="text-[10px] text-[#9a9a86] leading-snug mt-1 ml-6">{row.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 주간 분석 */}
            <div className="border border-[#9a9a86]/80 bg-[#edecea]/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#1c1c14]" />
                <h4 className="text-xs font-semibold text-[#4a5c2e] uppercase tracking-wider">AI 주간 분석</h4>
              </div>
              <p className="text-[12px] text-[#6b6b58] font-medium leading-relaxed">
                요일별 완료율을 분석한 결과, 오전 시간대 집중도가 가장 높습니다. 중요한 작업은 오전에 배치하고, 일일 계획은 5개 이하로 유지하는 것을 권장합니다.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════ */}
        {/* Tab 3: 시간대별 (히트맵)    */}
        {/* ════════════════════════════ */}
        {activeTab === "hourly" && (
          <div className="space-y-4">
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="mb-4 border-b border-[#e0ddd8] pb-3 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-[#1c1c14] flex items-center gap-2">
                    <Clock className="w-4 h-4" />히트맵 분석
                  </h2>
                  <p className="text-[11px] font-semibold text-[#9a9a86] mt-0.5">요일·시간대별로 언제 집중이 잘 됐는지 한눈에 확인해요. 칸에 마우스를 올리면 자세한 수치가 나와요.</p>
                </div>
                <span className="text-[9px] text-[#1c1c14] bg-[#edecea] border border-[#e0ddd8] px-2 py-1 rounded font-mono font-bold uppercase tracking-wider shrink-0">LIVE MATRIX</span>
              </div>

              {/* 히트맵 */}
              <div className="bg-[#f7f6f2]/50 p-3 rounded-xl border border-[#e0ddd8]/70">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e0ddd8]">
                  <span className="text-[9px] font-bold text-[#6b6b58] uppercase tracking-wider font-mono">Hourly Contribution Activity</span>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-[#9a9a86] font-mono">
                    <span>Less</span>
                    {["bg-[#f7f6f2]","bg-[#edecea]/80","bg-[#9a9a86]/60","bg-[#5a6e38]/50","bg-[#5a6e38]/80","bg-[#5a6e38]"].map((c,i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-[3px] border border-[#e0ddd8]/40 ${c}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>

                {/* 요일 헤더 */}
                <div className="flex mb-1.5">
                  <div className="w-10 shrink-0" />
                  <div className="flex-1 grid grid-cols-7 gap-1.5 text-center">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                      <span key={d} className="text-[9px] font-semibold text-[#6b6b58] font-mono">{d}</span>
                    ))}
                  </div>
                </div>

                {MOCK_HEATMAP.map(row => (
                  <div key={row.hour} className="flex mb-1.5">
                    <div className="w-10 shrink-0 text-right text-[9px] font-mono font-semibold text-[#9a9a86] pr-1.5 self-center">{row.hour}</div>
                    <div className="flex-1 grid grid-cols-7 gap-1.5">
                      {row.values.map((val, idx) => {
                        let fill = "bg-[#f7f6f2] border-[#e0ddd8]/40";
                        if (val > 80)      fill = "bg-[#5a6e38] border-[#4a5c2e] shadow-sm";
                        else if (val > 60) fill = "bg-[#5a6e38]/80 border-[#e0ddd8]/40";
                        else if (val > 40) fill = "bg-[#5a6e38]/50 border-[#e0ddd8]/40";
                        else if (val > 20) fill = "bg-[#9a9a86]/60 border-[#9a9a86]/40";
                        else if (val > 0)  fill = "bg-[#edecea]/80 border-[#e0ddd8]/40";
                        const isHov = hoveredHeatCell?.row === row.hour && hoveredHeatCell?.idx === idx;
                        return (
                          <div key={idx}
                            onMouseEnter={() => setHoveredHeatCell({ row: row.hour, idx, val })}
                            onMouseLeave={() => setHoveredHeatCell(null)}
                            className={`aspect-square rounded-[3px] border transition-all duration-150 cursor-crosshair ${fill} ${isHov ? "ring-2 ring-[#5a6e38] ring-offset-1 scale-110 z-10" : ""}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* 상세 분석 패널 */}
              <div className="mt-4 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#1c1c14] flex items-center gap-2 mb-3 pb-2 border-b border-[#e0ddd8]">
                  <Activity className="w-4 h-4" />타임슬롯 정밀 분석 피드백
                </h3>
                {hoveredHeatCell ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9a9a86] font-bold uppercase font-mono">분석 요일 및 시간</span>
                      <span className="text-[#1c1c14] font-bold">
                        {["월요일","화요일","수요일","목요일","금요일","토요일","일요일"][hoveredHeatCell.idx]} · {hoveredHeatCell.row}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9a9a86] font-bold uppercase font-mono">해당 슬롯 완수율</span>
                      <span className="text-sm font-semibold text-[#1c1c14]">{hoveredHeatCell.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#e0ddd8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#5a6e38] rounded-full transition-all" style={{ width: `${hoveredHeatCell.val}%` }} />
                    </div>
                    <div className={`text-[11px] leading-relaxed font-semibold p-3 rounded-xl border ${
                      hoveredHeatCell.val > 80 ? "text-[#2d7a3a] bg-[#ecf0e4] border-[#c8d4a8]"
                        : hoveredHeatCell.val > 40 ? "text-[#1c1c14] bg-white border-[#e0ddd8]"
                        : hoveredHeatCell.val > 0 ? "text-[#c4674a] bg-[#f8ede8] border-[#e8c0b0]"
                        : "text-[#9a9a86] bg-white border-[#e0ddd8]"
                    }`}>
                      {hoveredHeatCell.val > 80 ? "✓ 초고도 집중력을 유지하는 최고의 골든 슬롯입니다! 복잡하고 어려운 일을 이 시간에 배치하세요."
                        : hoveredHeatCell.val > 40 ? "✓ 일정한 업무 리듬이 안정적으로 유지되는 시간대입니다. 정규 태스크 처리에 매우 적합합니다."
                        : hoveredHeatCell.val > 0 ? "의욕 고갈이나 외부 방해 자극 개입도가 높은 슬롯입니다. To-Do를 15분 단위로 쪼개어 가볍게 대응하세요."
                        : "일정 내역이 확인되지 않는 유휴 타임이거나 편안한 인지 회복을 달성한 힐링 구간입니다."}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-[#9a9a86] font-semibold space-y-2">
                    <Clock className="w-6 h-6 mx-auto" />
                    <p>히트맵 셀 위에 마우스를 올려보세요.</p>
                    <p className="text-[10px] font-mono">HOVER OVER GRID CELL FOR DEEP ANALYSIS</p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#1c1c14] bg-[#edecea]/50 p-3 rounded-xl justify-center">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>생화학적 몰입 성향: 오전 10~12시 최대 효율</span>
              </div>
            </div>

            {/* 정밀 집중 효율 분석 가이드 */}
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#1c1c14]" />
                  <h3 className="text-sm font-semibold text-[#1c1c14]">시간대별 정밀 집중 효율 분석 가이드</h3>
                </div>
                <span className="text-[10px] text-[#2d7a3a] bg-[#ecf0e4] border border-[#c8d4a8] px-1.5 py-0.5 rounded font-bold">상세 분석</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "집중 잘 되는 시간 (09:00 - 12:00)", rate: "68%", desc: "하루 중 집중이 가장 잘 되는 시간대예요. 중요하고 어려운 일을 이 시간에 배치하세요.", color: "border-l-4 border-[#2d7a3a] bg-[#ecf0e4]/10" },
                  { title: "집중 떨어지는 시간 (15:00 - 16:30)", rate: "45%", desc: "피로가 쌓여 집중이 떨어지는 시간대예요. 어려운 일보다 가벼운 작업을 배치하거나, 잠깐 쉬어가세요.", color: "border-l-4 border-[#c4674a] bg-[#f8ede8]/10" },
                  { title: "하루 정리 시간 (18:00 - 19:30)",    rate: "62%", desc: "하루를 정리하기 좋은 시간이에요. 오늘 한 일을 돌아보고 내일 할 일을 미리 정해두면 다음 날 시작이 가벼워져요.", color: "border-l-4 border-[#5a6e38] bg-[#edecea]/10" },
                ].map((slot, i) => (
                  <div key={i} className={`p-3 rounded-xl border border-[#e0ddd8] ${slot.color}`}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[11px] font-bold text-[#1c1c14]">{slot.title}</h4>
                      <span className="text-[11px] font-semibold text-[#1c1c14] font-mono shrink-0 ml-2">{slot.rate}</span>
                    </div>
                    <p className="text-[10px] text-[#6b6b58] font-semibold leading-relaxed">{slot.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════ */}
        {/* Tab 4: 카테고리             */}
        {/* ════════════════════════════ */}
        {activeTab === "category" && (
          <div className="space-y-4">
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-2 border-b border-[#e0ddd8] pb-3">
                <div>
                  <h2 className="text-sm font-bold text-[#1c1c14]">카테고리별 일정 분포 및 성취 지수</h2>
                  <p className="text-[11px] font-semibold text-[#9a9a86] mt-0.5">각 카테고리 태스크의 실질 할당량과 완수 비율을 입체 분석합니다.</p>
                </div>
                {selectedCategoryFilter && (
                  <button onClick={() => setSelectedCategoryFilter(null)}
                    className="text-[10px] font-bold bg-[#5a6e38] text-white px-2.5 py-1 rounded-lg shrink-0 shadow-sm">
                    필터 전체 해제
                  </button>
                )}
              </div>

              {categoryStats.length === 0 ? (
                <p className="text-[12px] text-[#9a9a86] text-center py-8">등록된 할 일이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {categoryStats.map(cat => {
                    const isFiltered = selectedCategoryFilter === cat.key;
                    return (
                      <div key={cat.key}
                        onClick={() => setSelectedCategoryFilter(isFiltered ? null : cat.key)}
                        className={`border rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col gap-2 ${
                          isFiltered ? "border-[#5a6e38] bg-[#edecea]/10 shadow-md ring-1 ring-[#6b6b58]"
                            : "border-[#e0ddd8] bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.hex }} />
                            <h3 className="font-bold text-sm text-[#1c1c14]">{cat.label}</h3>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#9a9a86]">{cat.completed}/{cat.count}개 완료</span>
                        </div>

                        <div>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] text-[#9a9a86] font-bold font-mono">CATEGORY SUCCESS RATE</span>
                            <span className="text-base font-bold text-[#1c1c14]">{cat.rate}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${cat.progressColor} rounded-full transition-all duration-700`}
                              style={{ width: `${cat.rate}%` }} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#9a9a86] font-semibold border-t border-[#e0ddd8] pt-2">
                          <span>전체 생산 점유율 {cat.share}%</span>
                          <span className="flex items-center text-[#1c1c14] font-bold">
                            분석 상세 검토 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedCategoryFilter && (
                <div className="mt-4 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4">
                  <h3 className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-wider mb-2">{selectedCategoryFilter} · 카테고리 피드백</h3>
                  <p className="text-[12px] text-[#1c1c14] font-medium leading-relaxed">
                    {selectedCategoryFilter === "WORK"     && "업무는 완료율이 비교적 잘 나오는 편이에요. 다만 늦은 미팅과 겹칠 때 밀리는 경우가 있으니, 중요한 업무는 오전에 먼저 배치해보세요."}
                    {selectedCategoryFilter === "MEETING"  && "미팅은 안건을 미리 10분만 정리해두면 회의가 더 짧고 깔끔하게 끝나요."}
                    {selectedCategoryFilter === "PROJECT"  && "프로젝트는 한 건당 시간이 큰 편이라 미뤄지기 쉬워요. 30분 단위로 쪼개서 단계별로 진행하면 완료율이 올라가요."}
                    {selectedCategoryFilter === "ADMIN"    && <span className="text-[#c4674a] font-semibold">지원·행정 업무는 완료율이 가장 자주 낮아요. 피로가 쌓이는 오후보다 가벼운 오전 자투리 시간에 몰아서 처리해보세요.</span>}
                    {selectedCategoryFilter === "RESEARCH" && "리서치는 찾은 자료를 바로 한 줄 메모로 남기는 습관이 완료율을 높여줘요."}
                    {selectedCategoryFilter === "STUDY"    && "학습 시간은 규칙적인 루틴으로 확보해두면 꾸준히 유지하기 쉬워요."}
                    {selectedCategoryFilter === "HEALTH"   && "건강 관련 일정은 하루 중 가장 활력 있는 시간대에 배치하면 완료율이 올라가요."}
                    {selectedCategoryFilter === "HOBBY"    && "취미 활동은 번아웃을 방지하고 집중력을 회복시켜 주는 소중한 시간이에요."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════ */}
        {/* Tab 5: 실패 패턴            */}
        {/* ════════════════════════════ */}
        {activeTab === "pattern" && (
          <div className="space-y-4">
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
              <div className="mb-4 border-b border-[#e0ddd8] pb-3">
                <h2 className="text-sm font-bold text-[#1c1c14]">실패 패턴</h2>
                <p className="text-[11px] font-semibold text-[#9a9a86] mt-0.5">내 일상의 활동 데이터를 기반으로 찾아낸 할 일 실패 원인과 집중 방해 요인 분석 결과입니다.</p>
              </div>

              {/* 실패 원인 */}
              <div className="border border-[#e0ddd8] rounded-xl p-4 mb-4">
                <h3 className="text-sm font-bold text-[#1c1c14] flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#c4674a]" />목표 등록 수행 지연 및 실패 분석
                </h3>
                <p className="text-[11px] text-[#9a9a86] font-semibold mb-4">최근 2주간 취소 또는 시간 미완수 마감된 일정 원인 분포</p>
                <div className="space-y-4">
                  {[
                    { label: "기타 우발적 외풍 개입 (팀원 요청, 급작스런 사정)", pct: 58, color: "bg-[#c4674a]" },
                    { label: "체력 피크 이탈 및 의지 저하 (휴식 제어 장치 부족)", pct: 24, color: "bg-[#5a6e38]" },
                    { label: "네트워크 설비 소실 및 주위 산만",                  pct: 18, color: "bg-[#f7f6f2]" },
                  ].map((f, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline text-xs font-semibold mb-1">
                        <span className="text-[#1c1c14] leading-snug flex-1 pr-2">{f.label}</span>
                        <span className="text-[#6b6b58] font-bold shrink-0">{f.pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#f7f6f2] rounded-full overflow-hidden">
                        <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#9a9a86] leading-relaxed pt-4 border-t border-[#e0ddd8] mt-4 font-medium">
                  * 비고: 타인 소싱 차단용 슬롯 확보 장치인 방해금지 전용 업무 'Buffer Time'을 스케줄 속에 매일 40분씩 미리 심어두면, 58% 분포의 외부 방해를 탄탄하게 상쇄할 수 있습니다.
                </p>
              </div>

              {/* 연속 완수 스트릭 */}
              <div className="border border-[#e0ddd8] rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#1c1c14] flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-[#2d7a3a]" />일정 완수 연속도 성향 (Consistencies)
                </h3>
                <p className="text-[11px] text-[#9a9a86] font-semibold mb-4">하루 최소 3개 이상의 기획 태스크를 연속 완수하여 굳힌 빌딩 습관 연속력</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#ecf0e4] rounded-xl px-4 py-3 border border-[#c8d4a8]/60 text-center shrink-0 min-w-[90px]">
                      <span className="block text-xl font-bold text-[#2d7a3a] font-mono">12일</span>
                      <span className="text-[9px] text-[#2d7a3a] uppercase font-bold tracking-wider font-mono">Current Streak</span>
                    </div>
                    <p className="text-xs text-[#6b6b58] leading-relaxed font-medium">
                      상위 8% 수준에 해당하는 놀라운 일관성입니다! 주말에 완벽한 무계획 마감 후 월요일에 가동 세우기가 원활합니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#5a6e38]/5 rounded-xl px-4 py-3 border border-[#e0ddd8]/60 text-center shrink-0 min-w-[90px]">
                      <span className="block text-xl font-bold text-[#1c1c14] font-mono">21일</span>
                      <span className="text-[9px] text-[#1c1c14] uppercase font-bold tracking-wider font-mono">Max Record</span>
                    </div>
                    <p className="text-xs text-[#6b6b58] leading-relaxed font-medium">
                      역대 최대 연속 완수 이력과의 점유가 9일 차이납니다. 다음주 금요일을 무사히 맞추시면 개인 최고 신기록을 경신하게 됩니다.
                    </p>
                  </div>
                </div>
                <div className="bg-[#edecea]/40 p-3 rounded-xl border border-[#e0ddd8]/40 text-[11px] text-[#4a5c2e] leading-relaxed font-semibold mt-4">
                  AI 핵심 진단: 저녁 6시 대의 최종 검토율이 높아 퇴근 전 피드백 적용율이 뛰어나므로 이 주간 성공 고리는 계속 전개가 가능합니다.
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
