import React, { useState } from "react";
import { Todo } from "../types";

interface AnalyticsProps {
  todos: Todo[];
  setScreen: (screen: string) => void;
  streakDays: number;
}

export default function Analytics({ todos, setScreen, streakDays }: AnalyticsProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 60; // 60 default from mockup

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Header section */}
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen("home")}
            className="p-1 -ml-1 hover:bg-[#f3f4f2] rounded-full active:scale-95 transition-all text-charcoal flex"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <h1 className="font-display font-extrabold text-xl text-[#191c1b]">성장 분석</h1>
        </div>
        <div>
          <button
            onClick={() => setPeriod(period === "week" ? "month" : "week")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#c6c8ba]/70 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[#455528] text-xs font-bold">calendar_today</span>
            <span className="text-[10px] font-extrabold text-[#455528] font-sans">
              {period === "week" ? "이번 주 분석" : "이번 달 분석"}
            </span>
          </button>
        </div>
      </header>

      {/* Summary Bento Grid */}
      <section className="grid grid-cols-2 gap-3">
        <div className="col-span-1 bg-white p-4 rounded-xl soft-card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-400 font-bold text-[10px] uppercase font-sans">종합 완수율</span>
            <span className="material-symbols-outlined text-[#455528] text-base font-bold">trending_up</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-2xl text-[#191c1b]">{successRate}%</span>
            <span className="text-[9px] text-[#455528] font-extrabold">▲ 5%</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-semibold">총 {totalCount}개 중 {completedCount}개 완료</p>
        </div>

        <div className="col-span-1 space-y-3 flex flex-col">
          {/* Streak Card */}
          <div className="bg-white p-3 rounded-xl soft-card flex items-center justify-between flex-1">
            <div>
              <span className="text-gray-400 font-bold text-[9px] block">연속 성공</span>
              <span className="font-display font-bold text-xs text-charcoal mt-1 block">
                {streakDays}일째
              </span>
            </div>
            <span className="material-symbols-outlined text-amber-600 animate-pulse font-bold text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
          </div>
          {/* Missed Stats Card */}
          <div className="bg-white p-3 rounded-xl soft-card flex items-center justify-between flex-1">
            <div>
              <span className="text-gray-400 font-bold text-[9px] block">지연/미뤄짐</span>
              <span className="font-display font-bold text-xs text-charcoal mt-1 block">
                {todos.filter((t) => t.failed).length}개
              </span>
            </div>
            <span className="material-symbols-outlined text-emerald-500 font-bold text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
        </div>
      </section>

      {/* AI Insights Card from mockup */}
      <section className="bg-[#f3f4f2] p-4.5 rounded-2xl border border-[#455528]/10 relative overflow-hidden space-y-3.5">
        <div className="absolute top-1 right-2 p-2 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#455528] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            lightbulb
          </span>
          <h2 className="font-display font-extrabold text-xs text-[#455528]">AI 코치 코멘트</h2>
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-sm text-[#86361d]">오후 3시-4시 마의 구간</h3>
          <p className="text-[11px] text-[#45483d] leading-relaxed">
            지속적인 성취 피크 정체 구간이 분석되었습니다. 이 시점에는 중대한 업무보다 10분 스트레칭 및 이메일 답신 처리가 성취율을 방어하기에 가장 유리합니다.
          </p>
          <div className="flex gap-2 pt-1">
            <span className="px-3 py-1 bg-white/60 border border-[#c6c8ba] rounded-full text-[9px] font-bold text-[#5c5f57]">
              리듬 조정 제안
            </span>
            <span className="px-3 py-1 bg-white/60 border border-[#c6c8ba] rounded-full text-[9px] font-bold text-[#5c5f57]">
              휴식 10분 권장
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Trend success rate block bars */}
      <section className="bg-white p-4.5 rounded-2xl soft-card space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display font-extrabold text-sm text-charcoal">성공률 추이</h2>
            <p className="text-[10px] text-gray-400 font-bold">주간 종합 리포트</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#455528]"></div>
            <span className="text-[9px] text-[#45483d] font-bold">조정 완수</span>
          </div>
        </div>

        <div className="h-40 flex items-end justify-between px-2 gap-3 pt-4 font-mono">
          {[
            { label: "월", pct: 45, fill: "opacity-30" },
            { label: "화", pct: 60, fill: "opacity-40" },
            { label: "수", pct: 75, fill: "opacity-60" },
            { label: "목", pct: 55, fill: "opacity-40" },
            { label: "금", pct: 80, fill: "opacity-80" },
            { label: "토", pct: successRate, fill: "opacity-100" },
            { label: "일", pct: 40, fill: "opacity-20" },
          ].map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full bg-[#f3f4f2] rounded-t-lg relative overflow-hidden flex-1 flex flex-col justify-end">
                <div
                  className={`bg-[#455528] rounded-t-lg w-full transition-all duration-500 ${item.fill}`}
                  style={{ height: `${item.pct}%` }}
                />
              </div>
              <span className="text-[9px] font-bold text-gray-400 font-sans">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category domain balance lists */}
      <section className="bg-white p-4.5 rounded-2xl soft-card space-y-4">
        <h2 className="font-display font-extrabold text-sm text-charcoal">업무 영역별 밸런스</h2>
        <div className="space-y-3 font-sans">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>기초 마케팅 및 엔지니어링</span>
              <span className="text-charcoal font-extrabold">45%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#455528] rounded-full" style={{ width: "45%" }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>OAuth 및 연동 모듈 개발</span>
              <span className="text-charcoal font-extrabold">25%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#5d6d3e] rounded-full" style={{ width: "25%" }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-extrabold text-gray-400">
                <span>시스템 스탬프</span>
                <span className="text-charcoal">15%</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-extrabold text-gray-400">
                <span>피해 방지 회복</span>
                <span className="text-charcoal">15%</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time analyses columns */}
      <section className="space-y-3">
        <h2 className="font-display font-extrabold text-sm text-charcoal">시간대별 집중 분석</h2>
        <div className="space-y-3 font-sans">
          {/* Morning column */}
          <div className="bg-white p-4.5 rounded-2xl soft-card border-l-4 border-l-[#455528] space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-bold text-charcoal">오전 시간대 (09:00 - 12:00)</h3>
              <span className="text-[#455528] font-extrabold text-xs">상성 96%</span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold font-mono">12개 완료 · 피로도 매우 낮음</p>
            <p className="text-[11px] text-gray-500 leading-normal">핵심 설계 마스터 및 로직 배치가 극도로 성공적으로 완수되었습니다.</p>
          </div>

          {/* Risk column */}
          <div className="bg-white p-4.5 rounded-2xl soft-card border-l-4 border-l-[#a54d32] space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-bold text-charcoal">오후 집중 위험 (15:00 - 17:00)</h3>
              <span className="text-[#a54d32] font-extrabold text-xs">주의 42%</span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold font-mono">3개 완료 · 피로 축적 지수 높음</p>
            <p className="text-[11px] text-gray-500 leading-normal">주의력 고갈 피크 지점입니다. 가벼운 회독 및 텍스트 쪼개기 중심을 권장합니다.</p>
          </div>
        </div>
      </section>

      {/* Performance highlight chips */}
      <section className="bg-white p-4.5 rounded-2xl soft-card space-y-3">
        <h2 className="font-display font-extrabold text-sm text-charcoal">성과 하이라이트</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-[#f3f4f2] rounded-full border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#455528]"></span>
            <span className="text-[10px] font-bold text-charcoal">일일 마스터 최적화</span>
            <span className="text-[9px] font-extrabold text-[#455528] font-sans">완료</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-[#f3f4f2] rounded-full border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#455528]"></span>
            <span className="text-[10px] font-bold text-charcoal">OAuth 인증 통합</span>
            <span className="text-[9px] font-extrabold text-[#455528] font-sans">완료</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-[#f3f4f2] rounded-full border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a54d32]"></span>
            <span className="text-[10px] font-bold text-charcoal">마라톤 훈련 클리어</span>
            <span className="text-[9px] font-extrabold text-[#a54d32] font-sans">진행중</span>
          </div>
        </div>
      </section>

      {/* Daily diagnosis logs */}
      <section className="space-y-3">
        <h2 className="font-display font-extrabold text-sm text-charcoal">자가 주간 진단 피드백</h2>
        <div className="bg-white divide-y divide-gray-100 rounded-2xl soft-card overflow-hidden">
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f3f4f2] flex flex-col items-center justify-center">
                <span className="text-[8px] text-gray-400 font-extrabold">SAT</span>
                <span className="font-bold text-xs text-charcoal">06</span>
              </div>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-[#45483d] font-bold">인쇄 명세서</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-[#45483d] font-bold">Design</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-extrabold text-[#455528]">60% 완수</div>
              <div className="w-12 h-1 bg-gray-100 mt-1 rounded-full overflow-hidden">
                <div className="h-full bg-[#455528] w-[60%]" />
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f3f4f2] flex flex-col items-center justify-center">
                <span className="text-[8px] text-gray-400 font-extrabold">FRI</span>
                <span className="font-bold text-xs text-charcoal">05</span>
              </div>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-[#45483d] font-bold">코드리뷰</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-extrabold text-[#455528]">60% 완수</div>
              <div className="w-12 h-1 bg-gray-100 mt-1 rounded-full overflow-hidden">
                <div className="h-full bg-[#455528] w-[60%]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
