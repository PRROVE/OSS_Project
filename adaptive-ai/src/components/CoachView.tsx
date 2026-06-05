/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Zap, 
  RefreshCw, 
  User, 
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Flame,
  Award,
  ChevronRight,
  Sliders,
  Play,
  Heart,
  FileText,
  AlertTriangle,
  Smile,
  Target,
  MinusCircle,
  Plus,
  Compass as RunningIcon,
  Check
} from 'lucide-react';
import { CoachingInsight, Task } from '../types';
import { TODAY_STR } from '../data';

interface CoachViewProps {
  insights: CoachingInsight[];
  tasks: Task[];
  userName: string;
  onAddTask?: (task: Omit<Task, 'id' | 'completed' | 'failed'>) => void;
}

interface PartnerDecomposedStep {
  label: string;
  duration: string;
  details: string;
  difficulty: '하' | '중' | '상';
}

interface Message {
  sender: 'partner' | 'user';
  text: string;
  time: string;
  suggestedSteps?: PartnerDecomposedStep[];
  theme?: 'clarity' | 'recovery' | 'simplified';
}

export default function CoachView({ insights, tasks, userName, onAddTask }: CoachViewProps) {
  // Goal calibration & alignment mode
  const [partnerMode, setPartnerMode] = useState<'clarity' | 'recovery' | 'simplify'>('clarity');
  const [inputText, setInputText] = useState('');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Popover / Sidebar Drawer toggle states for custom UX
  const [showRunningMate, setShowRunningMate] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  // Vague Goal Calibrator Form
  const [vagueGoalInput, setVagueGoalInput] = useState('');
  const [calibrationResult, setCalibrationResult] = useState<{
    original: string;
    clearTitle: string;
    category: string;
    difficultyText: string;
    steps: PartnerDecomposedStep[];
  } | null>(null);

  const [calibratedSuccessMessage, setCalibratedSuccessMessage] = useState<string | null>(null);

  // Dynamic Active Tactics state (Simulating active partner agreement)
  const [tacticsAgreement, setTacticsAgreement] = useState<Record<string, 'inactive' | 'active' | 'completed'>>({
    bufferTime: 'inactive',
    microSlicing: 'active',
    refreshNap: 'inactive'
  });

  // Partner Messages Log
  const [messages, setMessages] = useState<Message[]>([]);

  // Sync initial welcome message and suggestion prompts based on PartnerMode switching
  useEffect(() => {
    let modeText = '';
    if (partnerMode === 'clarity') {
      modeText = `반가워요, ${userName}님! 오늘 꼭 해내고 싶지만 시작하기는 어쩐지 부담스러운 목표가 있으신가요? 마음속에 있는 막연한 생각을 입력해주시면, 아주 실천하기 쉬운 마이크로 일상으로 쪼개드릴게요. 같이 시작해봐요!`;
    } else if (partnerMode === 'recovery') {
      modeText = `요즘 쉼 없이 달리시느라 피로가 쌓이진 않으셨나요? 목표를 끝까지 선순환 완주하기 위해 가장 중대한 것은 '나의 에너지 방어'입니다. 오늘 무리한 일정 대신 뇌에 휴식을 선물하는 충전 전략을 수립해봐요.`;
    } else {
      modeText = `일의 덩어리가 너무 크면 착수 저항감(Friction)이 기하급수적으로 올라갑니다. 목표를 30분 단위의 초정밀 가설 단위로 축약해서 빠르게 가볍게 치고 나가는 단순화(Simplify) 훈련을 리드해 드릴게요.`;
    }
    setMessages([
      {
        sender: 'partner',
        text: modeText,
        time: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' }),
        theme: partnerMode
      }
    ]);
  }, [partnerMode, userName]);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCalibrating]);

  // Handle message sending to partner
  const handleSendMessage = (textToSend: string, autoDecomposeSteps?: PartnerDecomposedStep[]) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
    
    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: currentTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsCalibrating(true);

    // Simulate supportive partner response
    setTimeout(() => {
      setIsCalibrating(false);
      let replyText = '';
      let steps: PartnerDecomposedStep[] | undefined = autoDecomposeSteps;

      if (!steps) {
        if (textToSend.includes('피크타임') || textToSend.includes('오전')) {
          replyText = `좋은 생각이에요! 우리의 한정된 아침 집중력을 기획과 연구 같은 '핵심 성취'에 집중적으로 녹여내는 설계 조합입니다. 이 과정을 거쳐 완수 부담을 최소화해 봐요.`;
          steps = [
            { label: '1순위 딥워크 격리', duration: '50분', details: '팀 메신저와 알림 배너를 일체 잠금하고 마스터 기획 문서 편집에 완전히 격리 집중', difficulty: '상' },
            { label: '자발적 수면 충전', duration: '10분', details: '화면에서 시야를 완전히 차단하고 따듯한 티 한 모금 마시며 긴장 완화', difficulty: '하' },
            { label: '가볍고 단순한 피드백 수습', duration: '20분', details: '이메일 확인, 간단한 피드백 회신 등을 묶음으로 깔끔하게 털어내기', difficulty: '중' }
          ];
        } else if (textToSend.includes('완성도') || textToSend.includes('습관')) {
          replyText = `목표 성취 연속률을 높이기 위해서 가장 좋은 동반 전략은 '착수 시작선 낮추기'입니다. 바로 활용할 수 있는 단순화 단계를 합의해 보시죠.`;
          steps = [
            { label: '시작 노트 선행 활성화', duration: '5분', details: '내일 아침 즉시 시작 가능한 코드 창이나 작업 메모를 화면에 미리 오픈해 둔 뒤 퇴근', difficulty: '하' },
            { label: '30분 마이너 타임 프레임', duration: '30분', details: '완벽주의 부담감을 버리고 70% 완성도 통과를 원칙으로 거칠게 초안 초고 작성', difficulty: '중' }
          ];
        } else if (textToSend.includes('피로') || textToSend.includes('충전')) {
          replyText = `끝없는 과부하에 노출된 전두엽 세포를 보호하고 복구하기 위한 파트너 케어 가이드라인입니다.`;
          steps = [
            { label: '시각 피로 해소', duration: '5분', details: '스마트 기기를 절대적으로 안배하고 멀리 있는 정적인 녹지 공간 혹은 벽면 시야 관찰', difficulty: '하' },
            { label: '복식 호흡으로 리셋', duration: '3분', details: '복부 팽창을 유도하는 가벼운 호흡을 반복 수행하여 자율 신경 수축 안정 유인', difficulty: '하' }
          ];
        } else {
          replyText = `${userName}님과 같이 가동률을 맞추어 보았을 때, 지금 고민 중이신 일은 목표가 너무 큰 것 같습니다. 기획과 실행을 분리해서 시작해볼게요.`;
          steps = [
            { label: '필수 1차 산출물 규정', duration: '15분', details: '가장 간략화한 뼈대 기획안의 1페이지 목차 채우기 수준으로 착수 장치 완화', difficulty: '하' },
            { label: '레퍼런스 집중 취합 격리', duration: '30분', details: '기어들어가기 전 필요한 사이트, 레퍼런스 노트를 미리 창에 띄우고 퇴근하기', difficulty: '중' }
          ];
        }
      } else {
        replyText = `${userName}님의 목표를 바로 실행 가능한 단계로 쪼갰습니다. 아래에서 확인해보세요!`;
      }

      const partnerMsg: Message = {
        sender: 'partner',
        text: replyText,
        time: currentTime,
        suggestedSteps: steps,
        theme: partnerMode
      };
      setMessages(prev => [...prev, partnerMsg]);
    }, 1000);
  };

  // Run clarity calibration engine on client-side
  const handleRunCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vagueGoalInput.trim()) return;

    // Split Vague goals such as "마케팅 보고서 끝판왕 만들기" or "기획서 작성" into micro-action steps
    const sampleDecompositions: Record<string, { title: string; category: string; steps: PartnerDecomposedStep[] }> = {
      '기획서': {
        title: '신규 마케팅 기획안 핵심 프레임워크 뼈대 세우기',
        category: 'Work',
        steps: [
          { label: '목차 3개 및 타겟 정의 한 줄 약술', duration: '20분', details: '완벽한 형식을 고민하기 전, 신규 전략안의 1순위 타겟 명제를 한 문장으로 축약', difficulty: '하' },
          { label: '참고 벤치마킹 장단점 2줄 요약', duration: '30분', details: '해외 포트폴리오 PDF 상위 2개를 가볍게 훑으며 요점 한 장 보드로 요약', difficulty: '중' },
          { label: '예상 성과 정량 지표 1안 발할', duration: '15분', details: '목표치 대비 1차 시너지 기여 지수 마일스톤 러프하게 도출', difficulty: '하' }
        ]
      },
      '운동': {
        title: '퇴근 직후 피트니스 러닝 및 스트레칭 안착',
        category: 'Other',
        steps: [
          { label: '운동복으로 환복 및 신발 신기', duration: '5분', details: '도착 후 눕거나 휴대폰을 켜지 않고 가벼운 마음으로 전선 세팅 끝내기', difficulty: '하' },
          { label: '가벼운 트랙 속보 및 안도감 정체', duration: '20분', details: '뛰기 지루하다면 음악 한 곡을 들으며 보폭을 살려 가볍게 워밍업 페이스 진행', difficulty: '하' },
          { label: '샤워 후 몸의 따스한 혈류 보존 감상', duration: '15분', details: '성공 성사를 굳히는 미샤 전신 케어로 기쁨의 전리품 호르몬 안착', difficulty: '하' }
        ]
      },
      '메일': {
        title: '중대 업무 관련 메일함 분류 및 회신 소거 묶음 처리',
        category: 'Admin',
        steps: [
          { label: '지연 메일함 10단위 분류', duration: '10분', details: '오늘 무조건 보충 답신이 정합해야 하는 핵심 고객 메일 3건 우선 추리기', difficulty: '하' },
          { label: '사전 작성용 메모 초고', duration: '15분', details: '정형화 문구 복사-붙여넣기 템플릿을 활용해 알림 회신 정돈 완성', difficulty: '중' }
        ]
      }
    };

    // Find closest or fallback
    let match = sampleDecompositions.기획서;
    if (vagueGoalInput.includes('운동') || vagueGoalInput.includes('공부') || vagueGoalInput.includes('헬스')) {
      match = sampleDecompositions.운동;
    } else if (vagueGoalInput.includes('메일') || vagueGoalInput.includes('정리') || vagueGoalInput.includes('청소')) {
      match = sampleDecompositions.메일;
    }

    const clearTitle = vagueGoalInput.length > 5 ? `[명확화] ${vagueGoalInput} - 1차 디버깅 슬롯` : match.title;

    const result = {
      original: vagueGoalInput,
      clearTitle,
      category: match.category,
      difficultyText: '실행 착수 난이도 [하]로 60% 다운사이징 완료',
      steps: vagueGoalInput.length > 8 ? [
        { label: '1단계: 초경량 뼈대 시각화', duration: '15분', details: `성수기 부하감을 완전히 제거하고 '${vagueGoalInput}' 관련 핵심 아이디어 2가지만 우선 메모장에 기입`, difficulty: '하' },
        { label: '2단계: 가벼운 참고 탐색', duration: '20분', details: '인터넷 서핑을 통해 가볍게 참고 문헌 1개 주소를 즐겨찾기 폴더에 수습', difficulty: '하' },
        { label: '3단계: 점식 완성 완수체크', duration: '10분', details: '더 무거운 다음 단계를 무리하게 확장하지 않고 여기서 체크박스를 완수해 마무리', difficulty: '하' }
      ] : match.steps
    };

    setCalibrationResult(result);
    setCalibratedSuccessMessage(null);
  };

  // Convert the Partner Decomposed Steps directly into real To-Dos in App!
  const handleDeployToTodoList = () => {
    if (!calibrationResult || !onAddTask) return;

    // Deploy the main parent clear task to our real to-do list
    onAddTask({
      title: calibrationResult.clearTitle,
      priority: 'medium',
      category: calibrationResult.category as any,
      date: TODAY_STR,
      timeStart: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      description: `[러닝메이트와 세운 실천 루틴]\n${calibrationResult.steps.map((s, idx) => `${idx + 1}. ${s.label} (${s.duration}): ${s.details}`).join('\n')}`
    });

    setCalibratedSuccessMessage('러닝메이트와의 협업 계획이 즉시 To-Do 리스트에 동기화 완료되었습니다!');
    
    // Also push a record to chat history to show mutual alignment
    handleSendMessage(`러닝메이트와 공동 설계한 '${calibrationResult.clearTitle}' 실천 단계를 내 To-Do에 안착시키고 수행을 약속했습니다!`, calibrationResult.steps);
    setVagueGoalInput('');
    setCalibrationResult(null);
  };

  // Suggeston chip triggers
  const getSuggestionChips = () => {
    if (partnerMode === 'clarity') {
      return [
        '업무 계획을 실행하기 쉬운 명확한 루트로 쪼개기',
        '시작하기 너무 부담스러운 고질적인 완벽주의 우회안',
        '내 To-Do 완성도 완수를 위한 협동 조약 체결'
      ];
    } else if (partnerMode === 'recovery') {
      return [
        '뇌의 과 부하(Overload)를 푸는 초단축 3단계 리커버리',
        '퇴근길 잔여 번아웃 방전 케어 피드백 수집',
        '주의력 집중 피크 이후 영리하게 쉬는법'
      ];
    } else {
      return [
        '기획서 업무를 작게 쪼개기',
        '뽀모도로 기법과 러닝메이트 페이싱 조화 수치화',
        '30분 초단축 집중 완수 포맷 전송'
      ];
    }
  };

  const currentActiveSuggestions = getSuggestionChips();

  // Highlight active tactics Agreement change
  const toggleTacticAgreement = (key: string) => {
    setTacticsAgreement(prev => {
      const current = prev[key];
      const next = current === 'inactive' ? 'active' : current === 'active' ? 'completed' : 'inactive';
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="flex-1 flex max-w-[1920px] mx-auto w-full h-[84vh] text-[#1c1c14] relative bg-[#f7f6f2]/50 overflow-hidden font-sans">
      
      {/* 💬 LEFT COLUMN: The Primary 1:1 Conversational Chat Workspace (Always Default & Open) */}
      <div className="flex-1 flex flex-col bg-white h-full relative overflow-hidden border-r border-[#e0ddd8]">
        
        {/* Workspace Clear Header (Branded as Goal Partner / RunningMate, NOT a generic secretary!) */}
        <header className="p-4 bg-[#f7f6f2] border-b border-[#e0ddd8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 text-left">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5a6e38] text-white flex items-center justify-center border border-[#e0ddd8] relative shadow-sm">
              <Compass className="w-5 h-5 animate-spin-slow" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2d7a3a] rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-semibold text-[#1c1c14] font-display tracking-tight">AI 코치</h2>
              </div>
              <p className="text-[11px] text-[#9a9a86] font-bold mt-0.5">
                비서처럼 명령을 기다리는 챗봇이 아닌, 함께 명확한 마일스톤을 튜닝하고 쪼개 실천하는 파트너입니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Summary / Action Button for opening Sidebar */}
            <button
              onClick={() => setShowTracker(prev => !prev)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer shadow-sm ${
                showTracker
                  ? 'bg-[#ecf0e4] border-[#c8d4a8] text-[#4a5c2e]'
                  : 'bg-white border-[#e0ddd8] text-[#1c1c14] hover:bg-[#edecea]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>전술 트래커 / 진단 도구 {showTracker ? '접기' : '열기'}</span>
            </button>
          </div>

        </header>

        {/* Sub Mode Switches for Focusing Goal Tasks */}
        <div className="px-4 py-2 bg-[#f7f6f2]/50 border-b border-[#e0ddd8] flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-2 text-left">
          <div className="flex items-center gap-1 select-none overflow-x-auto shrink-0">
            <span className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-widest mr-2">포커스 전환:</span>
            <button
              onClick={() => setPartnerMode('clarity')}
              className={`px-2.5 py-1.5 rounded-md text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                partnerMode === 'clarity'
                  ? 'bg-white text-[#1c1c14] shadow-sm border border-[#e0ddd8]/40'
                  : 'text-[#6b6b58] hover:text-[#1c1c14]'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>목표 명확화</span>
            </button>
            <button
              onClick={() => setPartnerMode('recovery')}
              className={`px-2.5 py-1.5 rounded-md text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                partnerMode === 'recovery'
                  ? 'bg-white text-[#1c1c14] shadow-sm border border-[#e0ddd8]/40'
                  : 'text-[#6b6b58] hover:text-[#1c1c14]'
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>에너지 방어</span>
            </button>
            <button
              onClick={() => setPartnerMode('simplify')}
              className={`px-2.5 py-1.5 rounded-md text-[12px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                partnerMode === 'simplify'
                  ? 'bg-white text-[#4a5c2e] shadow-sm border border-[#e0ddd8]/40'
                  : 'text-[#6b6b58] hover:text-[#1c1c14]'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>실천 단순화</span>
            </button>
          </div>

          <span className="text-[12px] text-[#9a9a86] font-bold hidden md:block">
            선택된 집중 프레임에 따라 파트너의 의사결정 시너지가 연동 조정됩니다.
          </span>
        </div>

        {/* Conversation Area with Scroll Bars */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-5 bg-[#FCFDFE]">
          
          <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-4 text-left flex items-start gap-3">
            <RunningIcon className="w-5 h-5 text-[#1c1c14] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-widest font-mono">가이드라인</span>
              <p className="text-xs text-[#6b6b58] font-semibold leading-relaxed mt-1 font-sans">
                안녕하세요! 저는 완수의 거대한 해일에 정체되지 않고, 한걸음씩 성공을 완성할 수 있도록 실천 단위를 세분 조정하는 <strong>목표 동반 파트너</strong>입니다. 완수한 뒤에는 리스트 등록 버튼을 눌러 바로 할 일에 동기화하세요!
              </p>
            </div>
          </div>

          {messages.map((msg, idx) => {
            const isPartner = msg.sender === 'partner';
            return (
              <div 
                key={idx}
                className={`flex gap-3 ${isPartner ? 'mr-auto text-left max-w-[85%]' : 'ml-auto flex-row-reverse text-right max-w-[70%]'}`}
              >
                {/* Partner Avatar icons */}
                <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                  isPartner
                    ? 'bg-[#5a6e38] text-white border-[#4a5c2e]'
                    : 'bg-[#edecea] border-[#e0ddd8] text-[#6b6b58] font-bold text-xs'
                }`}>
                  {isPartner ? <Compass className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div className={`space-y-1 ${isPartner ? 'w-full max-w-[540px]' : 'w-fit max-w-[480px]'}`}>
                  <div className={`px-4 py-3 rounded-xl text-[13px] leading-relaxed font-medium transition-all ${
                    isPartner
                      ? 'bg-white text-[#1c1c14] border border-[#e0ddd8] rounded-tl-sm shadow-sm'
                      : 'bg-[#5a6e38] text-white rounded-tr-sm shadow-sm'
                  }`}>
                    <div className="whitespace-pre-line font-sans leading-relaxed">
                      {msg.text}
                    </div>

                    {/* Step-by-step collaborative suggestions inside message log block */}
                    {isPartner && msg.suggestedSteps && msg.suggestedSteps.length > 0 && (
                      <div className="mt-4 border-t border-[#e0ddd8] pt-4 space-y-3.5 animate-fadeIn">
                        <span className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-wider font-mono block">AI 추천 실행 단계</span>
                        
                        <div className="relative pl-4 border-l-2 border-[#9a9a86] space-y-3 ml-1">
                          {msg.suggestedSteps.map((st, sIdx) => (
                            <div key={sIdx} className="relative text-left">
                              <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#5a6e38]" />
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="font-bold text-[#1c1c14] text-[11px] font-display">{st.label}</span>
                                <span className="bg-[#f7f6f2] border border-[#e0ddd8] text-[#6b6b58] font-mono font-bold text-[11px] px-1.5 py-0.5 rounded-md block max-w-fit shadow-xs">
                                  {st.duration}
                                </span>
                              </div>
                              <p className="text-[12px] text-[#9a9a86] leading-normal font-semibold font-sans mt-0.5">{st.details}</p>
                            </div>
                          ))}
                        </div>

                        {/* Direct deployment CTA inside bubble list */}
                        <button
                          onClick={() => {
                            if (onAddTask) {
                              onAddTask({
                                title: `[협의 루틴] ${msg.suggestedSteps?.[0]?.label || '러닝메이트 실천 조약'} 등 세부 단위`,
                                priority: 'medium',
                                category: 'Work',
                                date: TODAY_STR,
                                timeStart: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
                                description: `[대화방 피드백 동기화]\n${msg.suggestedSteps?.map((s, i) => `${i + 1}. ${s.label} (${s.duration}): ${s.details}`).join('\n')}`
                              });
                              window.dispatchEvent(new CustomEvent('notify', { detail: '할 일 목록에 추가되었습니다.' }));
                            }
                          }}
                          className="mt-3.5 w-full py-2 bg-[#5a6e38] hover:bg-[#4a5c2e] active:scale-95 text-white text-[12px] font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>이 세분화된 행동 그대로 할 일 목록(ToDo)에 원클릭 등록</span>
                        </button>

                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-[#9a9a86] font-bold tracking-wide mt-0.5 px-1">{msg.time}</div>
                </div>
              </div>
            );
          })}

          {isCalibrating && (
            <div className="flex gap-3 max-w-[80%] mr-auto text-left">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#5a6e38] text-white flex items-center justify-center shrink-0 shadow-sm animate-bounce">
                <Compass className="w-4 h-4" />
              </div>
              <div className="bg-white text-[#9a9a86] text-[11px] px-4 py-3 rounded-xl rounded-tl-sm border border-[#e0ddd8] shadow-sm flex items-center gap-1.5">
                <span>분석 중...</span>
                <span className="flex gap-0.5 pt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#5a6e38]/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#5a6e38]/60 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-[#5a6e38] rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips Selector Container */}
        <div className="px-4 py-3 flex flex-wrap gap-2 justify-start items-center border-t border-[#e0ddd8] shrink-0 bg-[#f7f6f2]/40">
          <span className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-widest flex items-center gap-1 select-none mr-2 font-display">
            <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" /> 추천 대화 시작하기:
          </span>
          {currentActiveSuggestions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#5a6e38] hover:bg-[#edecea]/25 text-xs font-bold text-[#6b6b58] hover:text-[#1c1c14] rounded-full cursor-pointer transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Text Area Input Action Bar */}
        <div className="px-4 py-4 border-t border-[#e0ddd8] flex items-center gap-3 shrink-0 bg-white">
          <input 
            type="text" 
            placeholder={
              partnerMode === 'clarity' 
                ? "작성하기 겁나는 메일, 기획, 운동 목표 등을 적어보세요. 즉시 가벼운 마일스톤 루틴으로 쪼갭니다..." 
                : partnerMode === 'recovery'
                ? "지치고 리프레시가 필요할 때 완수 압박을 낮추는 에너지 회복이 필요할 때 작성해보세요..."
                : "30분 단위로 할 일을 쪼개 드립니다..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            className="flex-1 px-4 py-3 bg-[#f7f6f2] focus:bg-white border border-[#e0ddd8] focus:outline-none focus:ring-2 focus:ring-[#5a6e38] focus:border-[#5a6e38] text-xs font-bold text-[#1c1c14] rounded-xl transition-all shadow-inner placeholder:text-[#9a9a86]"
          />
          <button 
            type="button"
            onClick={() => handleSendMessage(inputText)}
            className="p-3 bg-[#5a6e38] text-white hover:bg-[#4a5c2e] rounded-xl transition-all cursor-pointer shadow-sm shrink-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 🛠 RIGHT COLUMN/DRAWER: Side Tools Panel (Vague Goal Calibrator + Tactics Tracker + Diagnosis Board) */}
      {showTracker && (
        <aside className="w-80 md:w-96 border-l border-[#e0ddd8]/75 bg-[#f7f6f2] flex flex-col h-full overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] animate-slide-over z-25 shrink-0 text-left">
          
          {/* Header of Toolbox Side Panel */}
          <header className="p-4 bg-white border-b border-[#e0ddd8]/80 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2d7a3a] text-white flex items-center justify-center shadow-sm">
                <Sliders className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#1c1c14] tracking-tight font-display">
                  러닝메이트 전술 보조 & 진단
                </h3>
                <span className="text-[11px] font-bold text-[#2d7a3a] uppercase font-mono block">동반 도구 모음 작동 중</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowTracker(false)}
              className="p-1 px-2 text-[11px] font-semibold text-[#9a9a86] hover:text-[#1c1c14] bg-[#f7f6f2] hover:bg-[#f7f6f2]/60 rounded-lg transition-colors cursor-pointer"
            >
              닫기 ✕
            </button>
          </header>

          {/* Sidebar Tools Scrollable Body */}
          <div className="p-4 space-y-5 flex-grow">
            
            {/* 🔍 COMPONENT 1: 막연한 목표 명확화 기획기 (Target Clarity Calibrator Form) */}
            <section className="bg-white border border-[#e0ddd8]/70 rounded-xl p-4 shadow-sm text-left space-y-3.5">
              <div className="flex items-center gap-1 text-[#1c1c14]">
                <Target className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase tracking-widest font-display">막연한 목표 우회 가설기</span>
              </div>
              <p className="text-[11px] text-[#9a9a86] font-bold leading-normal">
                "책 한 권 읽기", "기획서 끝내기" 같은 애매한 다짐을 적으면, 러닝메이트 알고리즘으로 분해해 할 일에 바로 꽂아 줍니다.
              </p>

              <form onSubmit={handleRunCalibration} className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={vagueGoalInput}
                    onChange={(e) => setVagueGoalInput(e.target.value)}
                    placeholder="예: 마케팅 보고서 작성, 코딩 운동 등..."
                    className="flex-1 px-2.5 py-1.5 text-[11px] font-bold border border-[#e0ddd8] focus:outline-none focus:ring-2 focus:ring-[#5a6e38] bg-[#f7f6f2]/50 rounded-lg"
                  />
                  <button 
                    type="submit"
                    className="px-3 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer shrink-0"
                  >
                    자동 분해
                  </button>
                </div>
              </form>

              {/* Show calibrated results output */}
              {calibrationResult && (
                <div className="mt-3.5 p-3 bg-[#edecea]/45 border border-[#e0ddd8]/60 rounded-lg space-y-3 animate-fadeIn text-left">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-[#4a5c2e] tracking-wider font-mono">
                      {calibrationResult.category} / {calibrationResult.difficultyText}
                    </span>
                    <h5 className="text-[12px] font-semibold text-[#1c1c14] leading-tight">
                      {calibrationResult.clearTitle}
                    </h5>
                  </div>

                  <div className="space-y-2 pl-2 border-l border-[#9a9a86]">
                    {calibrationResult.steps.map((st, idx) => (
                      <div key={idx} className="text-[11px] text-[#6b6b58] font-semibold leading-normal">
                        <span className="font-bold text-[#1c1c14]">{idx + 1}. {st.label} ({st.duration})</span>
                        <p className="text-[#9a9a86] text-[12px] font-medium leading-relaxed">{st.details}</p>
                      </div>
                    ))}
                  </div>

                  {calibratedSuccessMessage ? (
                    <p className="text-[11px] text-[#2d7a3a] font-semibold pt-1">{calibratedSuccessMessage}</p>
                  ) : (
                    <button
                      onClick={handleDeployToTodoList}
                      className="w-full py-1.5 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-center"
                    >
                      이 쪼갠 루틴 그대로 내 ToDo 리스트에 격파/저장하기
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* 🛡 COMPONENT 2: 상호 합의 전술 트래커 (Active Goal Tactics Agreement Board) */}
            <section className="bg-white border border-[#e0ddd8]/70 rounded-xl p-4 shadow-sm text-left space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#2d7a3a]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest font-display">상호 합의 전술 트래커</span>
                </div>
                <span className="bg-[#ecf0e4] text-[#2d7a3a] border border-[#c8d4a8] text-[11px] px-1.5 py-0.5 rounded font-semibold font-mono">
                  우회 조약 Active
                </span>
              </div>

              <div className="space-y-1 leading-tight">
                <h4 className="text-[12px] font-semibold text-[#1c1c14] tracking-tight">집중 방어 장치 제어보드</h4>
                <p className="text-[12px] text-[#9a9a86] font-bold leading-normal">
                  일하는 도중 주의력이 분해되고 완벽주의 마찰이 일어날 때, 아래 카드를 눌러 방어 장치를 켜고 완료하세요.
                </p>
              </div>

              {/* Tactics list items */}
              <div className="space-y-2.5 pt-1">
                
                {/* Tactic 1 */}
                <div 
                  onClick={() => toggleTacticAgreement('bufferTime')}
                  className={`p-3 rounded-lg border transition-all duration-200 select-none cursor-pointer hover:shadow-sm text-left ${
                    tacticsAgreement.bufferTime === 'inactive'
                      ? 'bg-[#f7f6f2] border-[#e0ddd8] text-[#9a9a86]'
                      : tacticsAgreement.bufferTime === 'active'
                      ? 'bg-[#edecea]/50 border-[#5a6e38]/40 text-[#1c1c14]'
                      : 'bg-[#ecf0e4]/40 border-[#c8d4a8] text-[#2d7a3a]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 mt-0.5 shrink-0 ${
                      tacticsAgreement.bufferTime === 'inactive' 
                        ? 'border-[#e0ddd8]' 
                        : tacticsAgreement.bufferTime === 'active' 
                        ? 'border-[#5a6e38]' 
                        : 'border-[#2d7a3a] bg-[#2d7a3a] text-white'
                    }`}>
                      {tacticsAgreement.bufferTime === 'completed' && <Check className="w-2 h-2" />}
                    </div>
                    <div>
                      <span className={`text-[12px] font-semibold block ${
                        tacticsAgreement.bufferTime === 'inactive' ? 'text-[#6b6b58]' : tacticsAgreement.bufferTime === 'active' ? 'text-[#1c1c14]' : 'text-[#9a9a86]'
                      }`}>
                        일정 사이 30분 차단 버퍼타임
                      </span>
                      <span className="text-[12px] text-[#9a9a86] font-semibold block mt-0.5 leading-relaxed">
                        갑작스러운 회의나 요구 난입 시 핵심 집중 지대를 보호하는 완충 조치 {tacticsAgreement.bufferTime === 'inactive' ? '(꺼짐)' : tacticsAgreement.bufferTime === 'active' ? '(우회 작동 중)' : '(조치 완료!)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tactic 2 */}
                <div 
                  onClick={() => toggleTacticAgreement('microSlicing')}
                  className={`p-3 rounded-lg border transition-all duration-200 select-none cursor-pointer hover:shadow-sm text-left ${
                    tacticsAgreement.microSlicing === 'inactive'
                      ? 'bg-[#f7f6f2] border-[#e0ddd8] text-[#9a9a86]'
                      : tacticsAgreement.microSlicing === 'active'
                      ? 'bg-[#edecea]/50 border-[#5a6e38]/40 text-[#1c1c14]'
                      : 'bg-[#ecf0e4]/40 border-[#c8d4a8] text-[#2d7a3a]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 mt-0.5 shrink-0 ${
                      tacticsAgreement.microSlicing === 'inactive' 
                        ? 'border-[#e0ddd8]' 
                        : tacticsAgreement.microSlicing === 'active' 
                        ? 'border-[#5a6e38]' 
                        : 'border-[#2d7a3a] bg-[#2d7a3a] text-white'
                    }`}>
                      {tacticsAgreement.microSlicing === 'completed' && <Check className="w-2 h-2" />}
                    </div>
                    <div>
                      <span className={`text-[12px] font-semibold block ${
                        tacticsAgreement.microSlicing === 'inactive' ? 'text-[#6b6b58]' : tacticsAgreement.microSlicing === 'active' ? 'text-[#1c1c14]' : 'text-[#9a9a86]'
                      }`}>
                        완벽주의 회항 30분 마이너 프레임
                      </span>
                      <span className="text-[12px] text-[#9a9a86] font-semibold block mt-0.5 leading-relaxed">
                        스트레스를 셧다운하고, 우선 투박한 초고 기안을 완성하는 실천 규칙 {tacticsAgreement.microSlicing === 'inactive' ? '(꺼짐)' : tacticsAgreement.microSlicing === 'active' ? '(우회 작동 중)' : '(조치 완료!)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tactic 3 */}
                <div 
                  onClick={() => toggleTacticAgreement('refreshNap')}
                  className={`p-3 rounded-lg border transition-all duration-200 select-none cursor-pointer hover:shadow-sm text-left ${
                    tacticsAgreement.refreshNap === 'inactive'
                      ? 'bg-[#f7f6f2] border-[#e0ddd8] text-[#9a9a86]'
                      : tacticsAgreement.refreshNap === 'active'
                      ? 'bg-[#edecea]/50 border-[#5a6e38]/40 text-[#1c1c14]'
                      : 'bg-[#ecf0e4]/40 border-[#c8d4a8] text-[#2d7a3a]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 mt-0.5 shrink-0 ${
                      tacticsAgreement.refreshNap === 'inactive' 
                        ? 'border-[#e0ddd8]' 
                        : tacticsAgreement.refreshNap === 'active' 
                        ? 'border-[#5a6e38]' 
                        : 'border-[#2d7a3a] bg-[#2d7a3a] text-white'
                    }`}>
                      {tacticsAgreement.refreshNap === 'completed' && <Check className="w-2 h-2" />}
                    </div>
                    <div>
                      <span className={`text-[12px] font-semibold block ${
                        tacticsAgreement.refreshNap === 'inactive' ? 'text-[#6b6b58]' : tacticsAgreement.refreshNap === 'active' ? 'text-[#1c1c14]' : 'text-[#9a9a86]'
                      }`}>
                        오후 3시 두뇌 충전 이완 브레이크
                      </span>
                      <span className="text-[12px] text-[#9a9a86] font-semibold block mt-0.5 leading-relaxed">
                        화면에서 시선 격리 후 5분간 온전히 자율 호흡하며 피로 초기화 {tacticsAgreement.refreshNap === 'inactive' ? '(꺼짐)' : tacticsAgreement.refreshNap === 'active' ? '(우회 작동 중)' : '(조치 완료!)'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 📈 COMPONENT 3: 실시간 동반 진단 보드 (Co-partner Insights Trigger) */}
            <section className="text-left space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#e0ddd8]/50 pb-2">
                <div className="flex items-center gap-1 text-[#9a9a86]">
                  <Sparkles className="w-4 h-4 text-[#1c1c14]" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest font-display">실시간 동반 진단 분석</h3>
                </div>
                <span className="text-[11px] text-[#9a9a86] font-mono font-bold">Total: {insights.length}건</span>
              </div>
              
              <div className="space-y-3">
                {insights.map((ins) => (
                  <div 
                    key={ins.id}
                    className="bg-white border border-[#e0ddd8]/50 rounded-xl p-4 shadow-sm flex flex-col gap-2 hover:border-[#5a6e38]/45 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5a6e38] shrink-0" />
                      <span className="text-xs font-bold text-[#1c1c14] group-hover:underline font-display tracking-tight">{ins.title}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-wider font-mono">{ins.subTitleKOR}</div>
                    <p className="text-[12px] text-[#6b6b58] leading-normal font-sans font-medium">{ins.description}</p>
                    
                    {/* Ask Partner option - posts request to the default chat! */}
                    <div className="border-t border-[#e0ddd8] pt-2 flex justify-between items-center text-[12px] font-bold">
                      <span className="text-[#1c1c14] flex items-center gap-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" /> 파트너 조치방안 공동 조율
                      </span>
                      <button 
                        onClick={() => {
                          handleSendMessage(`[동반 조약 건의] '${ins.title}'의 위험 요소를 영리하게 해결하기 위한 3단계 마이크로 솔루션을 구성해줘.`);
                        }}
                        className="text-[#9a9a86] hover:text-[#1c1c14] flex items-center shrink-0 cursor-pointer"
                      >
                        채팅방에 요청 <ChevronRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Motivational Partner Wisdom */}
            <section className="bg-[#1c1c14] text-white p-4 rounded-xl shadow-sm relative overflow-hidden group text-left">
              <div className="absolute right-0 bottom-0 opacity-[0.04] transform translate-y-2 translate-x-2 pointer-events-none text-white font-bold text-5xl select-none">
                
              </div>
              <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#9a9a86] mb-1.5 font-display flex items-center gap-1.5">
                <RunningIcon className="w-3.5 h-3.5 text-[#2d7a3a]" />
                <span>점진적 완수의 힘</span>
              </h4>
              <p className="text-[12px] text-[#9a9a86] leading-relaxed font-sans font-medium">
                "완벽주의라는 성벽은 우리의 정치를 가로막습니다. 아주 투박하고 보잘것없는 시작이야말로 거대한 루틴을 견인합니다."
              </p>
            </section>

          </div>
        </aside>
      )}

    </div>
  );
}
