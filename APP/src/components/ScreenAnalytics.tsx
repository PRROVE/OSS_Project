import React, { useState } from "react";
import { TrendingUp, BarChart2, Bell, MessageSquare, Timer, CheckSquare, Award } from "lucide-react";
import { DiagnosisRecord } from "../types";

interface ScreenAnalyticsProps {
  diagnosisRecords: DiagnosisRecord[];
}

export default function ScreenAnalytics({ diagnosisRecords }: ScreenAnalyticsProps) {
  
  // Interactive Chart active hour state
  const [selectedHour, setSelectedHour] = useState<string>("10시");

  // Chart dataset matching the original design
  const hourlyData = [
    { hour: "08시", value: 40 },
    { hour: "09시", value: 65 },
    { hour: "10시", value: 95, active: true },
    { hour: "11시", value: 75 },
    { hour: "12시", value: 30 },
    { hour: "13시", value: 45 },
    { hour: "14시", value: 85 },
    { hour: "15시", value: 80 },
    { hour: "16시", value: 60 }
  ];

  return (
    <div id="analytics-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen pb-24 border border-gray-100 shadow-xl rounded-2xl relative">
      
      {/* Top App Bar */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 h-16 flex justify-between items-center">
        <h1 className="font-bold text-lg text-[#4e6535]">Adaptive AI</h1>
        <div className="flex items-center gap-3">
          <button className="p-1 rounded-full hover:bg-slate-100 active:scale-95 transition-all">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="w-8 h-8 rounded-full bg-[#d0ecaf] overflow-hidden border border-slate-200">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArx2x2iqKauwUSWeIHFWSGflA8a3_oxERTeWF6wvTg-hLO4Zx0QyHdmeniU3IzegsUH0rQwAbrMR3E7TpHqWxFoPSz7DUhb-_nJYze4ECxOYTpiMkCL3FfhZQXcyu5DIMlVpJcfU36EbJxMzbbu0SyfygDPXf2SafkNo1aO-3fKBM7dB_LXWYZbrVH6VkPIy-gV_PIiVUECUp8yUKq9VUpj_uV6G5OBs2kf2idLDN7KLReVpMy-cRxUJ0o1v0GSHyS9A09VtG3uKKd"
            />
          </div>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-grow p-5 space-y-6 overflow-y-auto">
        
        {/* Weekly Completion Rate Card */}
        <section className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-[#4e6535]/10 shadow-soft bg-slate-50 space-y-4 relative overflow-hidden">
            
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">주간 완료율</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#4e6535]">60%</span>
                  <span className="text-xs text-[#4e6535] font-extrabold">+12% vs last week</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400">집중 분야</span>
                <div className="font-extrabold text-sm text-gray-800">Work 20%</div>
              </div>
            </div>

            {/* Simulated progress slider bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#4e6535] rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
            </div>

            {/* AI Coach comments summary box */}
            <div className="bg-[#4e6535]/5 border border-[#4e6535]/10 p-4 rounded-xl flex gap-3">
              <span className="text-base text-[#4e6535] mt-0.5 shrink-0">💡</span>
              <p className="text-[11px] leading-relaxed text-[#3D4A2E] font-medium">
                사용자의 업무 패턴이 개선되고 있습니다. 특히 오전 10시 세션에서 집중도가 가장 높게 나타납니다. Work 비중을 25%까지 점진적으로 높이는 것을 제안합니다.
              </p>
            </div>

          </div>
        </section>

        {/* Hourly success rate bar chart */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 px-1">시간대별 성공률</h2>
          
          <div className="border border-slate-100 p-5 bg-white rounded-2xl shadow-sm">
            <div className="flex overflow-x-auto hide-scrollbar gap-5.5 justify-between items-end h-32 pt-2 scroll-smooth">
              {hourlyData.map(item => {
                const isSelected = selectedHour === item.hour;
                return (
                  <div 
                    key={item.hour} 
                    onClick={() => setSelectedHour(item.hour)}
                    className="flex flex-col items-center gap-2 flex-1 cursor-pointer group"
                  >
                    <div className="w-4 bg-slate-100 rounded-t-full relative h-24">
                      {/* Inner colored fill bar based on percentage value */}
                      <div 
                        className={`absolute bottom-0 w-full rounded-t-full transition-all duration-500 ${
                          isSelected ? "bg-[#4e6535] scale-x-110 saturate-120" : "bg-[#4e6535]/40 hover:bg-[#4e6535]/65"
                        }`}
                        style={{ height: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className={`text-[9px] font-bold transition-all ${
                      isSelected ? "text-[#4e6535] font-black" : "text-slate-400"
                    }`}>
                      {item.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">평균 성공률</span>
              <span className="font-extrabold text-[#4e6535]">72%</span>
            </div>
          </div>
        </section>

        {/* Performance Highlights segment */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 px-1">주요 하이라이트</h2>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Box 1 */}
            <div className="border border-slate-150 p-4 rounded-xl flex flex-col justify-between aspect-square hover:shadow-md transition-shadow bg-slate-50">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-[#4e6535]/10 rounded-lg text-[#4e6535] text-xs font-black">📄</span>
                <span className="text-[9px] px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full font-bold">완료</span>
              </div>
              <div className="mt-4">
                <h3 className="font-black text-xs text-gray-800 leading-tight">Weekly Report</h3>
                <p className="text-[10px] text-slate-400 mt-1">100% 최적화됨</p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="border border-slate-150 p-4 rounded-xl flex flex-col justify-between aspect-square hover:shadow-md transition-shadow bg-slate-50">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 text-xs font-black">📈</span>
                <span className="text-[9px] px-2 py-0.5 bg-[#d0ecaf] text-[#4e6535] rounded-full font-bold">진행중</span>
              </div>
              <div className="mt-4">
                <h3 className="font-black text-xs text-gray-800 leading-tight">Q3 Marketing</h3>
                <p className="text-[10px] text-slate-400 mt-1">AI 분석 중</p>
              </div>
            </div>

          </div>
        </section>

        {/* Self-Diagnosis historical logs */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-bold text-gray-900">자가 진단 기록</h2>
            <button className="text-xs text-[#4e6535] font-bold hover:underline">전체보기</button>
          </div>
          
          <div className="space-y-2">
            {diagnosisRecords.map(record => (
              <div key={record.id} className="border border-slate-150 p-4 bg-white rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-black text-sm text-[#4e6535]">
                    {record.day}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-800">{record.dateStr}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      성공률 {record.rate}% • {record.status}
                    </div>
                  </div>
                </div>
                <span className="text-slate-300 font-semibold p-1">〉</span>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed numeric highlights logs */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 px-1">상세 분석 데이터</h2>
          
          <div className="grid grid-cols-1 gap-4">
            
            {/* Highly focused hour box */}
            <div className="border border-slate-150 p-4 rounded-xl flex items-center gap-4 bg-slate-50">
              <div className="w-11 h-11 rounded-full bg-[#4e6535]/15 flex items-center justify-center text-[#4e6535]">
                <Timer className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold mb-0.5">가장 집중력이 높았던 시간</p>
                <p className="font-black text-sm text-gray-800 uppercase">오전 10:00 - 11:30</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Box A */}
              <div className="border border-slate-150 p-4 rounded-xl flex flex-col gap-2 bg-slate-50">
                <CheckSquare className="w-4 h-4 text-[#4e6535]" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold">완료된 총 과업</p>
                  <p className="font-black text-base text-gray-800">42개</p>
                </div>
              </div>

              {/* Box B */}
              <div className="border border-slate-150 p-4 rounded-xl flex flex-col gap-2 bg-slate-50">
                <Award className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold">집중도 점수</p>
                  <p className="font-black text-base text-gray-800">94/100</p>
                </div>
              </div>
            </div>

            {/* Weekly Resource Distributions */}
            <div className="border border-slate-150 p-5 rounded-xl bg-white space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-xs text-gray-800">주간 리소스 분배</h3>
                <span className="text-[9px] text-slate-400 font-semibold">최근 7일 기준</span>
              </div>

              <div className="space-y-3">
                
                {/* Progress bar A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>업무 (Work)</span>
                    <span className="font-extrabold text-[#4e6535]">45%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4e6535] rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>

                {/* Progress bar B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>학습 (Learning)</span>
                    <span className="font-extrabold text-[#bdcca7]">30%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#bdcca7] rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>

                {/* Progress bar C */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>휴식 (Rest)</span>
                    <span className="font-extrabold text-slate-450">25%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
