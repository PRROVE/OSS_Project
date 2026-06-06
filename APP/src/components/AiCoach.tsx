import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";

interface AiCoachProps {
  chatHistory: ChatMessage[];
  addMessage: (role: "user" | "model", content: string) => void;
}

export default function AiCoach({ chatHistory, addMessage }: AiCoachProps) {
  const [activeTab, setActiveTab] = useState<"목표" | "에너지" | "실행">("목표");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever history updates or loading status shifts
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add user message
    addMessage("user", textToSend);
    setInputValue("");
    setLoading(true);

    try {
      // Create request payload mapping previous history format
      const historyPayload = chatHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error("서버와의 통신에 실패했습니다.");
      }

      const data = await res.json();
      // 2. Add coach response
      if (data.text) {
        addMessage("model", data.text);
      } else {
        addMessage("model", "죄송합니다. 적절한 응답을 받지 못했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      addMessage(
        "model",
        `⚠️ 에러가 발생했습니다: ${err.message || "네트워크 연결을 확인해 주세요."}\n\n(Settings에서 API key가 잘 구성되었는지 확인하거나, 로컬 가상 비서 모드를 이용해 조언을 받아보세요.)`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  // Switch advice based on tab
  const getGuideInfo = () => {
    switch (activeTab) {
      case "목표":
        return {
          title: "목표 명확화",
          icon: "lightbulb",
          desc: "당신의 비전을 구체적인 실행 계획으로 바꿉니다. 지금 생각하고 있는 큰 그림(예: 마라톤, 자격증 공부)을 말씀해주세요.",
        };
      case "에너지":
        return {
          title: "에너지 최적화",
          icon: "battery_status_good",
          desc: "피로도를 실시간 감지하여, 주의력 고갈 및 성취 피크 정체기(기획/스트레칭 필요)가 언제 오는지 정렬해 드립니다.",
        };
      case "실행":
        return {
          title: "루틴 디자이너",
          icon: "bolt",
          desc: "지연되거나 미뤄지는 일정이 있나요? 당장 실천해 볼 수 있도록 15분 단위의 초소형 조각 단위 하루 습관으로 쪼개줍니다.",
        };
    }
  };

  const guide = getGuideInfo();

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-fade-in">
      {/* Top Header section mirroring mockup */}
      <div className="flex justify-between items-center py-2 h-10">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-extrabold text-[#455528] text-xl">AI 코치</h1>
          <div className="flex items-center gap-1.5 ml-2 bg-[#d7eab0]/50 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 bg-[#455528] rounded-full animate-ping"></span>
            <span className="font-sans text-[10px] font-bold text-[#455528]">활성</span>
          </div>
        </div>
      </div>

      {/* Focus Switch (Segmented Control) */}
      <div className="mt-3">
        <div className="bg-[#f3f4f2] rounded-xl p-1 flex items-center justify-between border border-[#c6c8ba]/30">
          {(["목표", "에너지", "실행"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 font-sans text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#455528] text-white shadow-sm"
                  : "text-[#45483d] hover:text-[#455528]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* AI Guide Card dynamic content */}
      <div className="mt-3">
        <div className="bg-white border border-[#c6c8ba]/50 rounded-2xl p-4 shadow-sm flex gap-3 items-start">
          <div className="p-2 bg-[#e1e4d9] text-[#455528] rounded-lg">
            <span className="material-symbols-outlined text-base font-bold">
              {guide.icon}
            </span>
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#455528] mb-1">{guide.title}</h2>
            <p className="text-[11px] text-[#45483d] leading-relaxed">
              {guide.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Chat Area scrolling panel */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 px-1 scroll-hide">
        {chatHistory.map((msg) => {
          const isAi = msg.role === "model";
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isAi ? "items-start" : "items-end self-end ml-auto"}`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isAi
                    ? "bg-white border border-gray-100 rounded-bl-none text-charcoal"
                    : "bg-[#455528] text-white rounded-br-none font-medium"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
              <span className="text-[9px] text-gray-400 mt-1.5 px-1 font-mono">
                {msg.time}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#455528] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-[#455528] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-[#455528] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts Pill row */}
      <div className="flex gap-2 overflow-x-auto scroll-hide pb-3 -mx-2 px-2">
        {[
          "목표를 세분화해줘 🎯",
          "집중력이 떨어져 🧘‍♂️",
          "오늘 계획 정리해줘 📑",
          "미루는 습관 해결법 🧭",
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="whitespace-nowrap px-4 py-2 bg-white hover:bg-[#f3f4f2] border border-[#c6c8ba]/50 rounded-full text-xs font-bold text-[#45483d] shadow-sm active:scale-95 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Text Input area bar */}
      <div className="relative flex items-center gap-2 pb-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-11 pl-4 pr-10 bg-white border border-[#c6c8ba]/50 rounded-2xl text-xs focus:ring-1 focus:ring-[#455528] focus:bg-white transition-all shadow-sm outline-none"
            placeholder="AI 코치에게 라이프 조언을 물어보세요..."
          />
          <button 
            type="button"
            onClick={() => setInputValue("오후 3시에 집중이 잘 안 돼 😭")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#455528]"
            title="마이크 (시뮬레이션)"
          >
            <span className="material-symbols-outlined text-sm font-bold">mic</span>
          </button>
        </div>
        <button
          onClick={() => handleSendMessage(inputValue)}
          className="w-11 h-11 flex items-center justify-center bg-[#455528] text-white rounded-2xl shadow-md hover:opacity-95 active:scale-90 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">send</span>
        </button>
      </div>
    </div>
  );
}
