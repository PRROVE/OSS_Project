import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Target, Shield, Zap, Lightbulb, Check, Sparkles, BookOpen, Briefcase, Heart, Palette, MoreHorizontal, Rocket } from "lucide-react";
import { CategoryType, Task } from "../types.ts";

interface ScreenOnboardingProps {
  onCompleteOnboarding: (selectedCategories: string[], initialTaskTitle: string) => void;
  onGoBack: () => void;
}

export default function ScreenOnboarding({ onCompleteOnboarding, onGoBack }: ScreenOnboardingProps) {
  const [step, setStep] = useState(1); // 1, 2, or 3
  
  // Step 2 state: multiple selection
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Step 3 state
  const [initialTask, setInitialTask] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  // Toggle selection for Step 2
  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onGoBack();
    }
  };

  const handleComplete = () => {
    setIsFinishing(true);
    setTimeout(() => {
      onCompleteOnboarding(selectedInterests, initialTask);
      setIsFinishing(false);
    }, 1000);
  };

  return (
    <div id="onboarding-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen border border-gray-100 shadow-xl rounded-2xl relative">
      
      {/* HEADER SECTION */}
      {step === 1 && (
        <header className="bg-[#3D4A2E] px-6 pb-6 flex justify-between items-center text-white pt-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-[#C5E1A5] font-black">A</span>
            </div>
            <span className="font-bold text-lg">Adaptive AI</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs opacity-70">1 / 3</span>
            <div className="flex gap-1 mt-1">
              <div className="w-8 h-1 bg-white rounded-full transition-all duration-300"></div>
              <div className="w-3 h-1 bg-white/30 rounded-full transition-all duration-300"></div>
              <div className="w-3 h-1 bg-white/30 rounded-full transition-all duration-300"></div>
            </div>
          </div>
        </header>
      )}

      {step === 2 && (
        <header className="px-6 pt-12 pb-4 flex justify-between items-center bg-white border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3D4A2E] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C5E1A5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#3D4A2E]">Adaptive AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">2 / 3</span>
            <div className="flex gap-1">
              <div className="w-3 h-1 bg-slate-200 rounded-full"></div>
              <div className="w-6 h-1 bg-[#3D4A2E] rounded-full"></div>
              <div className="w-3 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </header>
      )}

      {step === 3 && (
        <header className="flex flex-col items-center px-6 py-6 bg-white border-b border-gray-50 pt-12">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#4e6535]" />
            <h1 className="font-bold text-xl tracking-tight text-gray-900">Adaptive AI</h1>
          </div>
          <div className="text-xs font-semibold text-slate-400">3 / 3</div>
        </header>
      )}

      {/* CONTENT SCROLLER */}
      <div className="flex-1 overflow-y-auto bg-white">
        
        {/* STEP 1: WELCOME & INTRO */}
        {step === 1 && (
          <div className="animate-fade-in">
            <section className="px-6 space-y-4 pt-6">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                AI가 당신의 실행 체력을<br />설계합니다
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                어려운 과제를 거창하게 세우고 실패하던 패턴은 끝납니다.<br />
                개인화된 AI가 완수 허들을 지능적으로 낮춰드립니다.
              </p>
              
              <div className="flex gap-4 pt-2 text-[11px] text-gray-600 font-medium">
                <div className="flex items-center gap-1">
                  <span className="text-[#3D4A2E] text-base font-bold">◎</span> 목표 단계 분해
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#3D4A2E] text-base font-bold">⚡︎</span> 집중 시간 설계
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#3D4A2E] text-base font-bold">✨</span> AI 코칭
                </div>
              </div>
            </section>

            <section className="bg-[#3D4A2E] mx-6 rounded-2xl p-6 text-white mb-8 mt-8">
              <h2 className="text-lg font-bold mb-6">목표 달성을 위한<br />초기 설정</h2>
              <p className="text-xs text-white/60 mb-8 -mt-4">AI가 당신의 루틴을 맞춤 준비합니다.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-white text-[#3D4A2E]">1</div>
                  <div>
                    <p className="text-sm font-semibold">시작하기</p>
                    <p className="text-[11px] opacity-60">서비스 소개</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-white/20 text-white/70">2</div>
                  <div>
                    <p className="text-sm font-semibold">관심 분야 선택</p>
                    <p className="text-[11px] opacity-40">카테고리 설정</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-white/20 text-white/70">3</div>
                  <div>
                    <p className="text-sm font-semibold">첫 번째 목표</p>
                    <p className="text-[11px] opacity-40">바로 시작</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white/5 border border-white/20 rounded-xl p-4 flex gap-3">
                <div className="text-white mt-0.5">💡</div>
                <p className="text-[11px] leading-normal opacity-90">
                  AI를 러닝메이트로 삼아 목표를 작게 쪼개 시작해 보세요.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: CATEGORY SELECTION */}
        {step === 2 && (
          <div className="px-6 py-6 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2 text-gray-950">어떤 분야에 집중하나요?</h1>
              <p className="text-slate-500 text-sm">여러 개 선택할 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Exercise */}
              <button
                type="button"
                onClick={() => toggleInterest("운동")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left relative transition-all duration-200 ${
                  selectedInterests.includes("운동")
                    ? "border-[#3a4431] bg-white shadow-md scale-102"
                    : "border-gray-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">운동</span>
                {selectedInterests.includes("운동") && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3D4A2E] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Study */}
              <button
                type="button"
                onClick={() => toggleInterest("공부")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left relative transition-all duration-200 ${
                  selectedInterests.includes("공부")
                    ? "border-[#3a4431] bg-white shadow-md scale-102"
                    : "border-gray-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">공부</span>
                {selectedInterests.includes("공부") && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3D4A2E] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Work */}
              <button
                type="button"
                onClick={() => toggleInterest("업무")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left relative transition-all duration-200 ${
                  selectedInterests.includes("업무")
                    ? "border-[#3a4431] bg-white shadow-md scale-102"
                    : "border-gray-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">업무</span>
                {selectedInterests.includes("업무") && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3D4A2E] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Hobby */}
              <button
                type="button"
                onClick={() => toggleInterest("취미")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left relative transition-all duration-200 ${
                  selectedInterests.includes("취미")
                    ? "border-[#3a4431] bg-white shadow-md scale-102"
                    : "border-gray-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">취미</span>
                {selectedInterests.includes("취미") && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3D4A2E] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Health */}
              <button
                type="button"
                onClick={() => toggleInterest("건강")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left relative transition-all duration-200 ${
                  selectedInterests.includes("건강")
                    ? "border-[#3a4431] bg-white shadow-md scale-102"
                    : "border-gray-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">건강</span>
                {selectedInterests.includes("건강") && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3D4A2E] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Other */}
              <button
                type="button"
                onClick={() => toggleInterest("기타")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left relative transition-all duration-200 ${
                  selectedInterests.includes("기타")
                    ? "border-[#3a4431] bg-white shadow-md scale-102"
                    : "border-gray-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <MoreHorizontal className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">기타</span>
                {selectedInterests.includes("기타") && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3D4A2E] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FIRST MICRO-TASK INPUT */}
        {step === 3 && (
          <div className="px-6 py-6 animate-fade-in flex flex-col gap-6 align-middle">
            {/* Step Indicator Visual */}
            <div className="flex gap-2 justify-center mb-4">
              <div className="sky-1 w-8 h-1 rounded-full bg-slate-200"></div>
              <div className="sky-2 w-8 h-1 rounded-full bg-slate-200"></div>
              <div className="sky-3 w-12 h-1 rounded-full bg-[#4e6535]"></div>
            </div>

            <div className="flex flex-col gap-2 text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                가벼운 첫 걸음을 적어보세요
              </h2>
              <p className="text-sm text-slate-500 px-2">
                아주 작은 목표(예: 책 1쪽 읽기)를 입력하면 대시보드에 바로 추가됩니다.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={initialTask}
                onChange={(e) => setInitialTask(e.target.value)}
                placeholder="예: 마케팅 기사 1편 읽기"
                className="w-full h-14 bg-white border border-gray-200 rounded-xl px-4 text-on-surface placeholder:text-slate-400 focus:outline-none focus:border-[#4e6535] focus:ring-2 focus:ring-[#4e6535]/20 focus:shadow-lg transition-all duration-300 text-gray-800"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#f0f1ea] rounded-xl border border-transparent">
              <Lightbulb className="w-5 h-5 text-[#4e6535] mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                입력하지 않아도 괜찮습니다. 나중에 할 일 탭에서 추가할 수 있습니다.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTIONS BAR */}
      <footer className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onCompleteOnboarding(selectedInterests, "")}
          className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors active:scale-95 duration-150"
        >
          건너뛰기
        </button>

        <div className="flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 duration-150 text-sm"
            >
              이전
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isFinishing}
            className="bg-[#3D4A2E] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#3D4A2E]/20 hover:bg-[#3D4A2E]/90 active:scale-95 duration-150 text-sm disabled:opacity-50"
          >
            {isFinishing ? (
              <span>시작하는 중...</span>
            ) : step === 3 ? (
              <>
                <span>시작하기</span>
                <Rocket className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>다음</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>

    </div>
  );
}
