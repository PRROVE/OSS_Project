import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Camera, Lock, Trash2, ChevronRight, Sun, Moon, 
  Brain, Smile, Briefcase, Flame, Check, Bell, BellRing, Eye, EyeOff
} from 'lucide-react';
import { AppState, AIPartnerSettings, Theme } from '../types';

interface SettingsViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export default function SettingsView({ state, updateState }: SettingsViewProps) {
  // Profiles state
  const [profileName, setProfileName] = useState(state.user.name);
  const [profileEmail, setProfileEmail] = useState(state.user.email);
  
  // Custom Instruction state
  const [instructions, setInstructions] = useState(state.aiPartner.customInstructions);
  
  // feedback toasts
  const [toastMessage, setToastMessage] = useState('');
  
  const isLight = state.settings.theme === 'light';
  const currentThemeText = isLight ? 'text-[#131b2e]' : 'text-white';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  // Toggle profile saves
  const handleSaveProfile = () => {
    if (!profileName.trim() || !profileEmail.trim()) {
      showToast('이름과 이메일을 올바르게 입력해 주세요.');
      return;
    }
    updateState({
      user: {
        ...state.user,
        name: profileName.trim(),
        email: profileEmail.trim()
      }
    });
    showToast('프로필 정보가 안정적으로 저장되었습니다.');
  };

  const handleUpdatePersona = (personaType: 'friendly' | 'logical' | 'assertive') => {
    updateState({
      aiPartner: {
        ...state.aiPartner,
        persona: personaType
      }
    });
    showToast(`AI 코치 페르소나가 '${personaType === 'friendly' ? '친근한' : personaType === 'logical' ? '논리적인' : '단호한'}' 성격으로 변경되었습니다.`);
  };

  const handleToggleExpertise = (tag: string) => {
    let currentExpertise = [...state.aiPartner.expertise];
    if (currentExpertise.includes(tag)) {
      if (currentExpertise.length === 1) {
        showToast('최소 한 개의 전문 분야가 지정되어야 합니다.');
        return;
      }
      currentExpertise = currentExpertise.filter(item => item !== tag);
    } else {
      currentExpertise.push(tag);
    }

    updateState({
      aiPartner: {
        ...state.aiPartner,
        expertise: currentExpertise
      }
    });
  };

  const handleUpdateFrequency = (freq: 'needed' | 'moderate' | 'proactive') => {
    updateState({
      aiPartner: {
        ...state.aiPartner,
        frequency: freq
      }
    });
    showToast('소통 빈도 주기가 적용되었습니다.');
  };

  const handleSaveInstructions = () => {
    updateState({
      aiPartner: {
        ...state.aiPartner,
        customInstructions: instructions
      }
    });
    showToast('AI 맞춤 지시사항이 업데이트되었습니다.');
  };

  const handleToggleTheme = (selectedTheme: Theme) => {
    updateState({
      settings: {
        ...state.settings,
        theme: selectedTheme
      }
    });
    showToast(`테마가 ${selectedTheme === 'light' ? '라이트' : '다크'} 모드로 변경되었습니다.`);
  };

  const handleToggleNotification = (type: 'email' | 'push') => {
    if (type === 'email') {
      updateState({
        settings: {
          ...state.settings,
          emailNotifications: !state.settings.emailNotifications
        }
      });
      showToast('이메일 알림 수신 상태가 변경되었습니다.');
    } else {
      updateState({
        settings: {
          ...state.settings,
          pushNotifications: !state.settings.pushNotifications
        }
      });
      showToast('푸시 실시간 알림 상태가 변경되었습니다.');
    }
  };

  const handleResetApp = () => {
    if (confirm('Aura 공간의 기존 설정 및 대화 일정을 모두 초기화하고 로그아웃 하시겠습니까?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Preset Expertise Areas
  const availableExpertise = ['시간 관리', '프로젝트 기획', '데이터 분석', '창의적 글쓰기'];

  return (
    <div className="space-y-8 relative pb-20">
      
      {/* Toast message rendering */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-6 left-6 md:left-auto md:w-80 z-50 bg-[#8b5cf6] text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-xs flex items-center gap-2 "
          >
            <Check size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-1">
        <h2 className={`text-3xl font-semibold tracking-tight ${currentThemeText}`}>설정</h2>
        <p className={`text-sm font-medium ${isLight ? 'text-neutral-500' : 'text-[#cbc3d7]'}`}>계정 환경설정 및 AI 파트너 설정을 관리합니다.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column Settings */}
        <div className="space-y-6">
          
          {/* Profile Settings */}
          <section className={`rounded-[24px] p-6 border ${
            isLight ? 'bg-white border-[#dae2fd]/60 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
          }`}>
            <h3 className={`text-lg font-bold mb-6 ${currentThemeText}`}>프로필 설정</h3>
            
            <div className="space-y-6">
              
              {/* Overlapping profile camera */}
              <div className="flex items-center gap-6 pb-6 border-b border-dashed border-neutral-500/10">
                <div className="relative shrink-0">
                  <img 
                    alt="Aura User portrait" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAVibeDZwp4Bv8tMwJOhoEStCHcWATLgfJHxEqq1NQHNgyq7bhqEjYozvsq36iySTJBS6JGcor1GUcaNKIhsagAmRiTZQOTCNv5jsMVbqsVeUHMtJSVJMct6NkK-bBNsoYf-UG7jbRZnKmkrYLo1wlFzxPkxkqaOVx8o00qhwN3nyqLLOiu0K8C7cWQYCQpIDy2XrhPkNg-MqFFdJaDGeaAU0P-GL1Siz15ggmOp8RE4BcueeERGhsXSZwpttXGpO176X6IjesfnE"
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-[24px] object-cover shrink-0 border border-white/10" 
                  />
                  <button 
                    onClick={() => showToast('사진 가져오기 기능이 데모 환경에서 시뮬레이션됩니다.')}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl flex items-center justify-center shadow-md shadow-black/20"
                    title="프로필 사진 바꾸기"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                <div>
                  <button 
                    onClick={() => showToast('새로운 이미지 탐색기 가동')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer hover:bg-neutral-500/10 transition-colors ${
                      isLight ? 'border-neutral-300 text-[#131b2e]' : 'border-[#494454]/40 text-[#dae2fd]'
                    }`}
                  >
                    사진 변경
                  </button>
                  <p className="text-[10px] text-neutral-500 font-semibold mt-2">JPG, GIF, PNG (최대 5MB 지원)</p>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#cbc3d7] px-1">이름</label>
                  <input 
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={`w-full h-12 px-4 rounded-[16px] text-sm border focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] font-medium transition-all ${
                      isLight 
                        ? 'bg-[#f2f3ff] border-[#cbc3d7]/60 text-slate-900' 
                        : 'bg-[#1e263a] border-[#494454]/30 text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#cbc3d7] px-1">이메일</label>
                  <input 
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className={`w-full h-12 px-4 rounded-[16px] text-sm border focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] font-medium transition-all ${
                      isLight 
                        ? 'bg-[#f2f3ff] border-[#cbc3d7]/60 text-slate-900' 
                        : 'bg-[#1e263a] border-[#494454]/30 text-white'
                    }`}
                  />
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                className="w-full h-12 bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] text-white font-bold text-sm rounded-[16px] shadow-lg shadow-[#8b5cf6]/20 cursor-pointer hover:brightness-110 transition-all text-center flex items-center justify-center"
              >
                변경사항 저장
              </motion.button>
            </div>
          </section>

          {/* Account Security options */}
          <section className={`rounded-[24px] p-6 border ${
            isLight ? 'bg-white border-[#dae2fd]/60 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${currentThemeText}`}>계정 및 보안</h3>
            <div className="space-y-1 flex flex-col">
              
              <button 
                onClick={() => showToast('비밀번호 변경용 인증 이메일 발송 완료.')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-500/5 transition-all text-left cursor-pointer group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLight ? 'bg-neutral-50 border-[#dae2fd]' : 'bg-[#1e263a] border-[#494454]/40'
                  }`}>
                    <Lock size={16} className="text-[#8b5cf6]" />
                  </div>
                  <span className={`text-sm font-semibold ${isLight ? 'text-neutral-800' : 'text-[#dae2fd]'}`}>비밀번호 변경</span>
                </div>
                <ChevronRight size={18} className="text-neutral-500 shrink-0" />
              </button>

              <button 
                onClick={handleResetApp}
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-500/10 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0`}>
                    <Trash2 size={16} className="text-red-400" />
                  </div>
                  <span className="text-sm font-bold text-red-400">계정 로그아웃 및 초기화</span>
                </div>
                <ChevronRight size={18} className="text-red-400 shrink-0" />
              </button>

            </div>
          </section>

          {/* Graphical Display & Light mode override screen setter */}
          <section className={`rounded-[24px] p-6 border ${
            isLight ? 'bg-white border-[#dae2fd]/60 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${currentThemeText}`}>테마 설정</h3>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${isLight ? 'text-neutral-500' : 'text-[#dae2fd]'}`}>화면 테마 지정</p>
              
              <div className={`p-1.5 rounded-2xl flex gap-1 ${isLight ? 'bg-neutral-100' : 'bg-[#1e263a]'}`}>
                <button 
                  onClick={() => handleToggleTheme('light')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-white shadow-md text-[#8b5cf6]' 
                      : 'text-neutral-500 hover:text-neutral-100'
                  }`}
                >
                  <Sun size={14} />
                  <span>라이트</span>
                </button>
                <button 
                  onClick={() => handleToggleTheme('dark')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    !isLight 
                      ? 'bg-[#2d3449] shadow-md text-[#8b5cf6]' 
                      : 'text-[#494454] hover:text-neutral-900'
                  }`}
                >
                  <Moon size={14} />
                  <span>다크</span>
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column Settings */}
        <div className="space-y-6">
          
          {/* AI Partner module layout matching screenshot */}
          <section className={`rounded-[24px] p-6 border ${
            isLight ? 'bg-white border-[#dae2fd]/60 shadow-sm' : 'bg-[#131b2e]/60 border-[#8b5cf6]/10 shadow-md shadow-[#8b5cf6]/5'
          }`}>
            <div className="flex items-center gap-2 mb-6">
              <Brain size={24} className="text-[#8b5cf6]" />
              <h3 className={`text-lg font-bold ${currentThemeText}`}>AI 파트너 설정</h3>
            </div>

            <div className="space-y-8">
              {/* Persona Selection */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">
                  페르소나 (성격)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  
                  <button 
                    onClick={() => handleUpdatePersona('friendly')}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 border-2 transition-all cursor-pointer ${
                      state.aiPartner.persona === 'friendly'
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 text-[#8b5cf6]'
                        : isLight 
                        ? 'border-transparent bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                        : 'border-transparent bg-[#1e263a]/60 text-[#cbc3d7] hover:bg-[#1e263a]'
                    }`}
                  >
                    <Smile size={20} />
                    <span className="text-xs font-bold">친근한</span>
                  </button>

                  <button 
                    onClick={() => handleUpdatePersona('logical')}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 border-2 transition-all cursor-pointer ${
                      state.aiPartner.persona === 'logical'
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 text-[#8b5cf6]'
                        : isLight 
                        ? 'border-transparent bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                        : 'border-transparent bg-[#1e263a]/60 text-[#cbc3d7] hover:bg-[#1e263a]'
                    }`}
                  >
                    <Briefcase size={20} />
                    <span className="text-xs font-bold">논리적인</span>
                  </button>

                  <button 
                    onClick={() => handleUpdatePersona('assertive')}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 border-2 transition-all cursor-pointer ${
                      state.aiPartner.persona === 'assertive'
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 text-[#8b5cf6]'
                        : isLight 
                        ? 'border-transparent bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                        : 'border-transparent bg-[#1e263a]/60 text-[#cbc3d7] hover:bg-[#1e263a]'
                    }`}
                  >
                    <Flame size={20} />
                    <span className="text-xs font-bold">단호한</span>
                  </button>

                </div>
              </div>

              {/* Tag Selection selector block */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">
                  전문 분야 설정
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableExpertise.map((tag) => {
                    const isSelected = state.aiPartner.expertise.includes(tag);
                    return (
                      <span 
                        key={tag}
                        onClick={() => handleToggleExpertise(tag)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-[#8b5cf6] text-white border-transparent shadow-md shadow-[#8b5cf6]/20'
                            : isLight 
                            ? 'bg-[#f2f3ff] border-[#cbc3d7]/60 text-neutral-600 hover:bg-neutral-100' 
                            : 'bg-[#1e263a]/50 border-[#494454]/40 text-[#cbc3d7] hover:bg-[#1e263a]'
                        }`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Communication Frequency selectors */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">
                  소통 빈도
                </label>
                <div className={`flex p-1 rounded-2xl ${isLight ? 'bg-neutral-100' : 'bg-[#1e263a]/70'}`}>
                  {(['needed', 'moderate', 'proactive'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => handleUpdateFrequency(freq)}
                      className={`flex-grow py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        state.aiPartner.frequency === freq
                          ? 'bg-[#8b5cf6] text-white shadow-md'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {freq === 'needed' ? '필요할 때만' : freq === 'moderate' ? '적절하게' : '능동적으로'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Instruction text fields custom */}
              <div className="border-l-2 border-[#8b5cf6] pl-4 space-y-2 pt-1">
                <label className="text-xs font-bold text-[#8b5cf6] block">
                  맞춤 지시사항 (AI Insight)
                </label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="AI가 어떻게 행동하고 답변을 작성하길 원하시나요?"
                  className={`w-full min-h-[100px] p-4 rounded-2xl text-sm border-none focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] font-medium resize-none ${
                    isLight ? 'bg-[#f2f3ff] text-neutral-900' : 'bg-[#1e263a]/50 text-white'
                  }`}
                />
                <button 
                  onClick={handleSaveInstructions}
                  className="px-4 py-1.5 text-[11px] bg-[#8b5cf6] text-white font-bold rounded-lg shadow-sm hover:brightness-110 cursor-pointer"
                >
                  지시사항 임베딩 반영
                </button>
              </div>

            </div>
          </section>

          {/* Toggle Switches for notifications */}
          <section className={`rounded-[24px] p-6 border ${
            isLight ? 'bg-white border-[#dae2fd]/60 shadow-sm' : 'bg-[#131b2e]/60 border-white/5 shadow-md shadow-black/10'
          }`}>
            <h3 className={`text-lg font-bold mb-6 ${currentThemeText}`}>알림 설정</h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-neutral-500" />
                  <span className={`text-sm font-semibold ${isLight ? 'text-neutral-800' : 'text-[#dae2fd]'}`}>이메일 알림 수신</span>
                </div>
                
                {/* Custom Toggle Selector button */}
                <button 
                  onClick={() => handleToggleNotification('email')}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${
                    state.settings.emailNotifications ? 'bg-[#8b5cf6]' : 'bg-neutral-600'
                  }`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                    state.settings.emailNotifications ? 'left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 border-t border-dashed border-neutral-500/10">
                <div className="flex items-center gap-3">
                  <BellRing size={18} className="text-neutral-500" />
                  <span className={`text-sm font-semibold ${isLight ? 'text-neutral-800' : 'text-[#dae2fd]'}`}>실시간 브라우저 푸시 알림</span>
                </div>
                
                {/* Custom Toggle Selector button */}
                <button 
                  onClick={() => handleToggleNotification('push')}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${
                    state.settings.pushNotifications ? 'bg-[#8b5cf6]' : 'bg-neutral-600'
                  }`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                    state.settings.pushNotifications ? 'left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>

            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
