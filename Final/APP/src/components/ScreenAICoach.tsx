import React, { useState, useRef, useEffect } from "react";
import {
  Send, Sliders, Compass, Target, Heart, User,
  ShieldCheck, Sparkles, Check, ChevronRight, X
} from "lucide-react";
import { ChatMessage, CoachStyleType } from "../types";

interface ScreenAICoachProps {
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  coachStyle: CoachStyleType;
}

type TacticState = "inactive" | "active" | "completed";

const DEFAULT_TACTICS: Record<string, TacticState> = {
  bufferTime: "inactive",
  microSlicing: "active",
  refreshNap: "inactive",
};

const TACTICS = [
  {
    key: "bufferTime",
    title: "일정 사이 30분 차단 버퍼타임",
    desc: "갑작스러운 회의나 요구 난입 시 핵심 집중 지대를 보호하는 완충 조치",
  },
  {
    key: "microSlicing",
    title: "완벽주의 회항 30분 마이너 프레임",
    desc: "스트레스를 셧다운하고, 우선 투박한 초고 기안을 완성하는 실천 규칙",
  },
  {
    key: "refreshNap",
    title: "오후 3시 두뇌 충전 이완 브레이크",
    desc: "화면에서 시선 격리 후 5분간 온전히 자율 호흡하며 피로 초기화",
  },
];

const INSIGHTS = [
  {
    id: "ins-1",
    title: "완벽주의 시작 저항 패턴",
    sub: "START RESISTANCE",
    desc: "아직 시작 못 한 일이 있다면, 완벽한 첫 줄보다 '지금 당장 30초 적기'가 더 강력합니다.",
  },
  {
    id: "ins-2",
    title: "오후 3시 집중력 저하 구간",
    sub: "AFTERNOON DIP",
    desc: "집중력이 가장 떨어지는 오후 2~4시에는 창의 작업보다 기계적 처리 업무로 교체하면 완수율이 올라갑니다.",
  },
  {
    id: "ins-3",
    title: "미완료 과제 인지 부하",
    sub: "ZEIGARNIK EFFECT",
    desc: "완료되지 않은 일은 뇌가 계속 기억하려 에너지를 소모합니다. 할 일에 등록하는 것만으로 뇌 부하가 줄어듭니다.",
  },
];

export default function ScreenAICoach({
  chatHistory,
  onAddChatMessage,
  coachStyle,
}: ScreenAICoachProps) {
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"clarity" | "recovery" | "simplify">("clarity");
  const [showTracker, setShowTracker] = useState(false);

  // 목표 분해기
  const [vagueGoal, setVagueGoal] = useState("");
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibResult, setCalibResult] = useState<Array<{ title: string; duration: string }> | null>(null);
  const [calibSuccess, setCalibSuccess] = useState(false);

  // 전술 트래커
  const [tactics, setTactics] = useState<Record<string, TacticState>>(DEFAULT_TACTICS);

  const bottomRef = useRef<HTMLDivElement>(null);

  // 트래커 드래그 dismiss
  const trackerRef = useRef<HTMLElement>(null);
  const dragStartY = useRef(0);
  const dragDeltaY = useRef(0);
  const dragging = useRef(false);

  const onTrackerPointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    dragDeltaY.current = 0;
    dragging.current = true;
    if (trackerRef.current) trackerRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTrackerPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = Math.max(0, e.clientY - dragStartY.current);
    dragDeltaY.current = delta;
    if (delta > 4 && trackerRef.current) {
      trackerRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const onTrackerPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const el = trackerRef.current;
    if (!el) return;
    if (dragDeltaY.current > 120) {
      el.style.transition = "transform 0.25s ease";
      el.style.transform = "translateY(110%)";
      setTimeout(() => {
        setShowTracker(false);
        dragDeltaY.current = 0;
        if (trackerRef.current) trackerRef.current.style.transform = "";
      }, 250);
    } else {
      el.style.transition = "transform 0.25s ease";
      el.style.transform = "";
      dragDeltaY.current = 0;
    }
  };

  // 트래커 열릴 때 스크롤 잠금
  useEffect(() => {
    if (showTracker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showTracker]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-user`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    onAddChatMessage(userMsg);
    setInputText("");
    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg].slice(-10).map(m => ({ role: m.role, content: m.content })),
          coachStyle,
        }),
      });
      const data = await res.json();
      onAddChatMessage({
        id: `chat-${Date.now()}-ai`,
        role: "assistant",
        content: data.success ? data.content : "일시적 타임아웃이 발생했습니다. 다시 말씀해주세요!",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      });
    } catch {
      onAddChatMessage({
        id: `chat-${Date.now()}-err`,
        role: "assistant",
        content: "네트워크 오류로 연결이 실패했습니다. 힘내세요!",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) handleSendMessage(inputText);
  };

  // 목표 분해기
  const handleCalibrate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vagueGoal.trim()) return;
    setIsCalibrating(true);
    setCalibResult(null);
    setCalibSuccess(false);
    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: vagueGoal, category: "WORK" }),
      });
      const data = await res.json();
      if (data.tasks?.length) setCalibResult(data.tasks);
      else setCalibResult([{ title: vagueGoal, duration: "30분" }]);
    } catch {
      setCalibResult([{ title: vagueGoal, duration: "30분" }]);
    } finally {
      setIsCalibrating(false);
    }
  };

  const toggleTactic = (key: string) => {
    setTactics(prev => {
      const cur = prev[key];
      const next: TacticState = cur === "inactive" ? "active" : cur === "active" ? "completed" : "inactive";
      return { ...prev, [key]: next };
    });
  };

  const tacticStyle = (state: TacticState) => ({
    wrapper: state === "inactive"
      ? "bg-[#f7f6f2] border-[#e0ddd8]"
      : state === "active"
      ? "bg-[#edecea]/50 border-[#5a6e38]/40"
      : "bg-[#ecf0e4]/40 border-[#c8d4a8]",
    dot: state === "inactive"
      ? "border-[#e0ddd8]"
      : state === "active"
      ? "border-[#5a6e38]"
      : "border-[#2d7a3a] bg-[#2d7a3a]",
    label: state === "inactive" ? "text-[#6b6b58]" : state === "active" ? "text-[#1c1c14]" : "text-[#9a9a86] line-through",
    suffix: state === "inactive" ? "(꺼짐)" : state === "active" ? "(작동 중)" : "(완료!)",
  });

  const getSuggestions = () => {
    if (activeTab === "recovery") return [
      "뇌의 과부하를 푸는 초단축 3단계 리커버리",
      "퇴근길 번아웃 방전 케어 피드백",
      "집중 피크 이후 영리하게 쉬는 법",
    ];
    if (activeTab === "simplify") return [
      "기획서 업무를 작게 쪼개기",
      "뽀모도로와 러닝메이트 페이싱 조화",
      "30분 초단축 집중 완수 포맷",
    ];
    return [
      "업무 계획을 실행하기 쉬운 루트로 쪼개기",
      "완벽주의 우회안",
      "To-Do 완수를 위한 협동 조약",
    ];
  };

  const getGuideText = () => {
    if (activeTab === "recovery") return "완벽주의와 지친 뇌를 보호하는 에너지 방어 세션입니다. 피로도가 높을 땐 과감히 쉼표를 찍고 에너지를 배분하는 전략적 리셋 방법을 제시합니다.";
    if (activeTab === "simplify") return "가장 단순하고 명료한 첫 한 걸음을 제안하는 극단의 미니멀리즘 실전 가이드입니다. 뇌가 전혀 저항하지 못하는 룰을 씌워드립니다.";
    return "안녕하세요! 완수의 거대한 해일에 정체되지 않고, 한걸음씩 성공을 완성할 수 있도록 실천 단위를 세분 조정하는 목표 동반 파트너입니다.";
  };

  return (
    <div id="ai-coach-screen" className="w-full bg-white flex flex-col relative" style={{ height: "calc(100dvh - 5rem)" }}>

      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-[#f7f6f2] border-b border-[#e0ddd8] px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#5a6e38] text-white flex items-center justify-center shrink-0 border border-[#4a5c2e] shadow-sm relative">
            <Compass className="w-5 h-5" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2d7a3a] rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-[#1c1c14] tracking-tight">AI 코치</h1>
            <p className="text-[10px] text-[#9a9a86] font-semibold mt-0.5 leading-tight line-clamp-1">
              비서처럼 명령을 기다리는 챗봇이 아닌, 함께 마일스톤을 튜닝하는 파트너입니다.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowTracker(true)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition-all shadow-sm bg-white border-[#e0ddd8] text-[#1c1c14] hover:bg-[#edecea]"
        >
          <Sliders className="w-3 h-3" />
          <span>전술 트래커</span>
        </button>
      </header>

      {/* 포커스 탭 */}
      <div className="px-4 py-2 bg-[#f7f6f2]/70 border-b border-[#e0ddd8] flex items-center gap-1 overflow-x-auto hide-scrollbar shrink-0">
        <span className="text-[10px] font-semibold text-[#9a9a86] uppercase tracking-widest mr-1.5 shrink-0">포커스:</span>
        {[
          { key: "clarity" as const, label: "목표 명확화", icon: <Target className="w-3 h-3" /> },
          { key: "recovery" as const, label: "에너지 방어", icon: <Heart className="w-3 h-3" /> },
          { key: "simplify" as const, label: "실전 단순화", icon: <Sliders className="w-3 h-3" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
              activeTab === tab.key
                ? "bg-white text-[#1c1c14] shadow-sm border border-[#e0ddd8]/60"
                : "text-[#6b6b58] hover:text-[#1c1c14]"
            }`}
          >
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 대화 영역 */}
      <main className="flex-grow overflow-y-auto px-4 py-5 space-y-5 bg-[#FCFDFE]">
        <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4 flex items-start gap-3">
          <Compass className="w-4 h-4 text-[#1c1c14] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-semibold text-[#9a9a86] uppercase tracking-widest font-mono block mb-1">가이드라인</span>
            <p className="text-xs text-[#6b6b58] font-semibold leading-relaxed">{getGuideText()}</p>
          </div>
        </div>

        <div className="space-y-5">
          {chatHistory.map(msg => {
            const isPartner = msg.role === "assistant";
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isPartner ? "mr-auto max-w-[88%]" : "ml-auto flex-row-reverse max-w-[78%]"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                  isPartner ? "bg-[#5a6e38] text-white border-[#4a5c2e]" : "bg-[#edecea] border-[#e0ddd8] text-[#6b6b58]"
                }`}>
                  {isPartner ? <Compass className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="space-y-1 flex-1">
                  <div className={`px-4 py-3 rounded-xl text-xs leading-relaxed font-medium shadow-sm ${
                    isPartner ? "bg-white text-[#1c1c14] border border-[#e0ddd8] rounded-tl-sm" : "bg-[#5a6e38] text-white rounded-tr-sm"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className="text-[10px] text-[#9a9a86] font-semibold tracking-wide px-1">{msg.timestamp}</div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-2.5 mr-auto max-w-[88%]">
              <div className="w-8 h-8 rounded-xl bg-[#5a6e38] text-white flex items-center justify-center shrink-0 border border-[#4a5c2e] animate-pulse">
                <Compass className="w-4 h-4" />
              </div>
              <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl rounded-tl-sm px-4 py-3 text-xs text-[#9a9a86] italic shadow-sm">
                목표 에너지를 세부 튜닝하고 있어요...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* 제안 칩 + 입력창 */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        <div className="bg-gradient-to-t from-white via-white to-transparent pt-5 pb-2">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4">
            {getSuggestions().map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(s)}
                className="whitespace-nowrap px-3.5 py-2 bg-[#f7f6f2] hover:bg-[#edecea] text-[#6b6b58] text-[10px] font-bold rounded-full border border-[#e0ddd8] shadow-sm active:scale-95 transition-all shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border-t border-[#e0ddd8] px-4 pt-2 pb-4">
          <form onSubmit={handleSubmit} className="flex items-center bg-[#edecea] focus-within:bg-white rounded-2xl px-4 py-3 border border-transparent focus-within:border-[#5a6e38]/30 focus-within:ring-1 focus-within:ring-[#5a6e38]/25 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="작성하기 겁나는 메일, 기획, 운동 목표 등을 적어보세요..."
              className="bg-transparent border-none outline-none focus:ring-0 w-full text-xs text-[#1c1c14] placeholder:text-[#9a9a86]"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="ml-2 w-9 h-9 bg-[#5a6e38] hover:bg-[#4a5c2e] rounded-xl flex items-center justify-center text-white active:scale-90 transition-all shrink-0 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ── 전술 트래커 바텀 시트 ── */}
      {showTracker && (
        <>
          <div
            className="fixed sm:absolute inset-0 bg-black/30 z-40"
            onClick={() => setShowTracker(false)}
          />
          <aside
            ref={trackerRef}
            className="fixed sm:absolute bottom-0 left-0 right-0 z-50 bg-[#f7f6f2] border-t border-[#e0ddd8] rounded-t-2xl shadow-xl flex flex-col"
            style={{ maxHeight: "88dvh" }}
          >
            {/* 드래그 핸들 + 헤더 */}
            <div
              className="shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={onTrackerPointerDown}
              onPointerMove={onTrackerPointerMove}
              onPointerUp={onTrackerPointerUp}
              onPointerCancel={onTrackerPointerUp}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-[#d0cdc8] rounded-full" />
              </div>
              <div className="px-5 pt-2 pb-3 bg-white border-b border-[#e0ddd8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2d7a3a] text-white flex items-center justify-center shadow-sm">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1c1c14] tracking-tight">러닝메이트 전술 보조 & 진단</h3>
                    <span className="text-[10px] font-bold text-[#2d7a3a] uppercase font-mono">동반 도구 모음 작동 중</span>
                  </div>
                </div>
                <div onPointerDown={e => e.stopPropagation()}>
                  <button
                    onClick={() => setShowTracker(false)}
                    className="p-1.5 text-[#9a9a86] hover:bg-[#edecea] rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 스크롤 본문 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">

              {/* 섹션 1: 막연한 목표 우회 가설기 */}
              <section className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 text-[#1c1c14]">
                  <Target className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">막연한 목표 우회 가설기</span>
                </div>
                <p className="text-[11px] text-[#9a9a86] font-semibold leading-normal">
                  "책 한 권 읽기", "기획서 끝내기" 같은 애매한 다짐을 적으면 15분 단위 루틴으로 분해해 드립니다.
                </p>
                <form onSubmit={handleCalibrate} className="flex gap-2">
                  <input
                    type="text"
                    value={vagueGoal}
                    onChange={e => setVagueGoal(e.target.value)}
                    placeholder="예: 마케팅 보고서 작성, 코딩 공부..."
                    className="flex-1 px-2.5 py-2 text-xs font-semibold border border-[#e0ddd8] rounded-lg bg-[#f7f6f2] outline-none focus:border-[#5a6e38]"
                  />
                  <button
                    type="submit"
                    disabled={isCalibrating || !vagueGoal.trim()}
                    className="px-3 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 shrink-0"
                  >
                    {isCalibrating ? "분석 중..." : "자동 분해"}
                  </button>
                </form>

                {calibResult && (
                  <div className="p-3 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg space-y-2">
                    <span className="text-[10px] font-bold text-[#5a6e38] uppercase tracking-wider">분해 결과 {calibResult.length}개</span>
                    <div className="space-y-1.5 pl-2 border-l-2 border-[#c8d4a8]">
                      {calibResult.map((step, idx) => (
                        <div key={idx}>
                          <span className="text-[11px] font-bold text-[#1c1c14]">{idx + 1}. {step.title}</span>
                          <span className="text-[10px] text-[#9a9a86] ml-1">({step.duration})</span>
                        </div>
                      ))}
                    </div>
                    {calibSuccess ? (
                      <p className="text-[11px] text-[#2d7a3a] font-bold">✓ 채팅방에 분해 요청을 전송했습니다!</p>
                    ) : (
                      <button
                        onClick={() => {
                          handleSendMessage(`[목표 분해 요청] "${vagueGoal}"을 15분 단위 루틴으로 더 자세히 쪼개서 실천 계획을 만들어줘.`);
                          setCalibSuccess(true);
                          setShowTracker(false);
                        }}
                        className="w-full py-2 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-[11px] font-bold rounded-lg transition-colors"
                      >
                        이 루틴 채팅방에서 더 구체화하기
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* 섹션 2: 상호 합의 전술 트래커 */}
              <section className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#2d7a3a]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">상호 합의 전술 트래커</span>
                  </div>
                  <span className="bg-[#ecf0e4] text-[#2d7a3a] border border-[#c8d4a8] text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">
                    우회 조약 Active
                  </span>
                </div>
                <p className="text-[11px] text-[#9a9a86] font-semibold leading-normal">
                  주의력이 분해되거나 완벽주의 마찰이 생길 때, 아래 카드를 눌러 방어 장치를 켜세요.
                </p>
                <div className="space-y-2">
                  {TACTICS.map(t => {
                    const st = tacticStyle(tactics[t.key]);
                    return (
                      <div
                        key={t.key}
                        onClick={() => toggleTactic(t.key)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${st.wrapper}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 mt-0.5 shrink-0 ${st.dot}`}>
                            {tactics[t.key] === "completed" && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <div>
                            <span className={`text-[12px] font-semibold block ${st.label}`}>{t.title}</span>
                            <span className="text-[11px] text-[#9a9a86] font-semibold block mt-0.5 leading-relaxed">
                              {t.desc} <span className="text-[#5a6e38]">{st.suffix}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 섹션 3: 실시간 동반 진단 분석 */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1c1c14]" />
                    <h3 className="text-[11px] font-bold uppercase tracking-widest">실시간 동반 진단 분석</h3>
                  </div>
                  <span className="text-[10px] text-[#9a9a86] font-mono font-bold">Total: {INSIGHTS.length}건</span>
                </div>
                <div className="space-y-3">
                  {INSIGHTS.map(ins => (
                    <div key={ins.id} className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5a6e38] shrink-0" />
                        <span className="text-xs font-bold text-[#1c1c14] tracking-tight">{ins.title}</span>
                      </div>
                      <div className="text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider font-mono">{ins.sub}</div>
                      <p className="text-[11px] text-[#6b6b58] leading-normal font-semibold">{ins.desc}</p>
                      <div className="border-t border-[#e0ddd8] pt-2 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#1c1c14] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />파트너 조치방안 공동 조율
                        </span>
                        <button
                          onClick={() => {
                            handleSendMessage(`[동반 조약 건의] '${ins.title}'의 위험 요소를 영리하게 해결하기 위한 3단계 마이크로 솔루션을 구성해줘.`);
                            setShowTracker(false);
                          }}
                          className="text-[#9a9a86] hover:text-[#1c1c14] flex items-center text-[11px] font-bold"
                        >
                          채팅방에 요청 <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 섹션 4: 동기부여 */}
              <section className="bg-[#1c1c14] text-white p-4 rounded-xl shadow-sm">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#9a9a86] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#2d7a3a]" />점진적 완수의 힘
                </h4>
                <p className="text-[12px] text-[#9a9a86] leading-relaxed font-semibold">
                  "완벽주의라는 성벽은 우리의 전진을 가로막습니다. 아주 투박하고 보잘것없는 시작이야말로 거대한 루틴을 견인합니다."
                </p>
              </section>

            </div>
          </aside>
        </>
      )}

    </div>
  );
}
