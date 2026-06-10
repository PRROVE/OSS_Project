import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bell, Brain, AlertUp, Info, HelpCircle } from "lucide-react";
import { ChatMessage, CoachStyleType } from "../types.ts";

interface ScreenAICoachProps {
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  coachStyle: CoachStyleType;
}

export default function ScreenAICoach({
  chatHistory,
  onAddChatMessage,
  coachStyle
}: ScreenAICoachProps) {
  
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab2] = useState<"명확화" | "에너지" | "단순화">("명확화");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-user`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    };
    onAddChatMessage(userMsg);
    setInputText("");
    setIsSending(true);

    try {
      // 2. Prep message payload for backend
      // We pass the last 10 messages from history to keep context
      const historyContext = [...chatHistory, userMsg].slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyContext,
          coachStyle: coachStyle
        })
      });
      const data = await response.json();

      // 3. Add AI Response
      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now()}-ai`,
        role: "assistant",
        content: data.success ? data.content : "AI 응답을 생성하는 도중 일시적 타임아웃이 발생했습니다. 다시 말씀해주세요!",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      };
      onAddChatMessage(assistantMsg);
    } catch (err) {
      console.error("AI chat error", err);
      const errorMsg: ChatMessage = {
        id: `chat-${Date.now()}-err`,
        role: "assistant",
        content: "네트워크 오류로 코치와 연결이 실패했습니다. 하지만 자그마한 일부터 묵묵히 전진하다 보면 어느새 성공해 있을 거예요. 힘내세요!",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      };
      onAddChatMessage(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText);
    }
  };

  // Suggestion Chips text
  const suggestions = [
    "업무 계획을 실행하기 쉬운 명확한 루트로 쪼개기",
    "시작하기 너무 부담스러운 완벽주의 우회안",
    "내 To-Do 완성도 완수를 위한 협동 조약"
  ];

  const getGuideText = () => {
    switch (activeTab) {
      case "에너지":
        return "완벽주의와 지친 뇌를 보호하는 에너지 방어 세션입니다. 피로도가 높을 땐 과감히 쉼표를 찍고 에너지를 배분하는 전략적 리셋 방법을 제시합니다.";
      case "단순화":
        return "가장 단순하고 명료한 첫 한 걸음을 제안하는 극단의 미니멀리즘 실전 가이드입니다. 뇌가 전혀 저항하지 못하는 룰을 씌워드립니다.";
      default:
        return "안녕하세요! 저는 완수의 거대한 해일에 정체되지 않고, 한걸음씩 성공을 완성할 수 있도록 실천 단위는 세분 조정하는 목표 동반 파트너입니다. 완수한 뒤에는 리스트 등록 버튼을 눌러 바로 할 일에 동기화하세요!";
    }
  };

  return (
    <div id="ai-coach-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen pb-32 border border-gray-150 shadow-xl rounded-2xl relative">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex justify-between items-center px-5 h-16 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#374d20] flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#e1fec0]" />
          </div>
          <h1 className="font-bold text-lg text-gray-900">AI 코치</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100">
            <Bell className="w-5 h-5 text-slate-500" />
          </button>
          
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-150 cursor-pointer">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA0Bab6WhpV0UHONgVII2eZ7_IFZhT86HBvo4tlMd1flCqf0WIRJClrqSsKYSe-pw2X-TJfrNuYgXZuQaWL-XPXS6U3xEs6upLXjJuxiGRqBFzaoDsYDicoGJH6yedFWV5_xKI_XzgZGufwK__mFvrJZF1A4lwHhaODIoUjWADO0sXouvlVANcM3aPBuerbgprGyJBb5yOI41om__6hPIcewvBHlDKybM9xMEtM-slpI_mF89VSP5N-NZOud2rbAAqA22MJklGJHrG"
            />
          </div>
        </div>
      </header>

      {/* Sub Header Action row */}
      <div className="px-5 py-2.5 flex items-center justify-between bg-slate-50 border-b border-slate-100 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 opacity-80">실시간 파트너 모드 활성화</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#374d20] text-[#e1fec0] text-[10px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 진단 도구</span>
        </button>
      </div>

      {/* Chat Canvas Section */}
      <main className="flex-grow overflow-y-auto px-5 py-6 space-y-6">
        
        {/* Chips Focus tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 shrink-0">
          <button 
            type="button" 
            onClick={() => setActiveTab2("명확화")}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "명확화" 
                ? "bg-[#c5e1a5] text-[#131f07] border border-[#374d20]/10" 
                : "bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>🎯 목표 명확화</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => setActiveTab2("에너지")}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "에너지" 
                ? "bg-[#c5e1a5] text-[#131f07] border border-[#374d20]/10" 
                : "bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>🛡 에너지 방어</span>
          </button>

          <button 
            type="button" 
            onClick={() => setActiveTab2("단순화")}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "단순화" 
                ? "bg-[#c5e1a5] text-[#131f07] border border-[#374d20]/10" 
                : "bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>⚡︎ 실전 단순화</span>
          </button>
        </div>

        {/* AI Guide Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-[#374d20]/10 flex items-center justify-center">
              <span className="text-[10px] text-[#374d20]">ℹ</span>
            </div>
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">가이드라인</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold transition-all">
            {getGuideText()}
          </p>
        </div>

        {/* Message Bubble Logs */}
        <div className="space-y-5">
          {chatHistory.map(msg => (
            <div 
              key={msg.id} 
              className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : ""}`}
            >
              {/* Message Header */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 px-1">
                  <div className="w-5 h-5 rounded-full bg-[#374d20] flex items-center justify-center">
                    <Brain className="w-3 h-3 text-[#e1fec0]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">AI Coach ({coachStyle})</span>
                </div>
              )}

              {/* Message Content Bubble */}
              <div className={`p-4 shadow-sm border transition-all text-xs leading-relaxed font-semibold ${
                msg.role === "user" 
                  ? "bg-[#374d20] text-[#e1fec0] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl border-transparent" 
                  : "bg-white text-gray-800 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border-slate-100"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Time description footer */}
              <span className="text-[9px] text-slate-400 px-1 opacity-50">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* AI generating loader feedback */}
          {isSending && (
            <div className="flex flex-col gap-1.5 max-w-[80%]">
              <div className="flex items-center gap-1.5 px-1">
                <div className="w-5 h-5 rounded-full bg-[#374d20] flex items-center justify-center animate-pulse">
                  <Brain className="w-3 h-3 text-[#e1fec0]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">AI가 고민 중...</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-4 shadow-sm text-xs text-slate-400 italic">
                윤관님의 오늘 하루 흐름과 목표 에너지를 세부 튜닝하고 있어요...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

      </main>

      {/* Sticky Bottom Interactive Layers */}
      <div className="absolute bottom-0 left-0 w-full z-30 shrink-0">
        
        {/* Suggestion Chips */}
        <div className="bg-gradient-to-t from-white via-white to-transparent pt-6 pb-2 shrink-0">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-5">
            {suggestions.map((suggestion, index) => (
              <button 
                key={index}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-150 shadow-sm active:scale-95 transition-all text-center shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input form container */}
        <div className="bg-white border-t border-slate-100 px-4 pt-2 pb-24 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-100 focus-within:bg-white rounded-2xl px-4 py-3 border border-transparent focus-within:border-[#374d20]/30 focus-within:ring-1 focus-within:ring-[#374d20]/25 transition-all">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="작성하기 겁나는 메일, 기획, 운동 목표 등을 적어보세요..."
              className="bg-transparent border-none outline-none focus:ring-0 w-full text-xs text-gray-800 placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="ml-2 w-10 h-10 bg-[#374d20] hover:bg-[#283819] rounded-xl flex items-center justify-center text-[#e1fec0] active:scale-90 transition-all shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
