/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  User, 
  Settings, 
  Lock, 
  Trash2, 
  Sun, 
  Moon, 
  UserCheck, 
  BrainCircuit, 
  Check, 
  MessageSquare,
  ShieldAlert,
  Bell,
  Camera
} from 'lucide-react';
import { AIPartnerConfig, AIPersona, AIFrequency, UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  aiConfig: AIPartnerConfig;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateAIConfig: (config: AIPartnerConfig) => void;
  theme: 'light' | 'dark';
  onChangeTheme: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
}

const EXPERTISE_PRESETS = ["시간 관리", "프로젝트 기획", "데이터 분석", "창의적 글쓰기"];

export default function SettingsView({
  profile,
  aiConfig,
  onUpdateProfile,
  onUpdateAIConfig,
  theme,
  onChangeTheme,
  onLogout
}: SettingsViewProps) {
  // Local form states
  const [name, setName] = useState(profile.name || '홍길동');
  const [email, setEmail] = useState(profile.email || 'user@example.com');
  const [persona, setPersona] = useState<AIPersona>(aiConfig.persona || 'logical');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(aiConfig.expertiseAreas || ["프로젝트 기획"]);
  const [frequency, setFrequency] = useState<AIFrequency>(aiConfig.communicationFrequency || 'moderate');
  const [instructions, setInstructions] = useState(aiConfig.customInstructions || '대표님이라고 불러주세요. 모든 제안은 3단계 분석 결과를 포함해서 보고해주세요.');
  
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);
  
  const [saveStatus, setSaveStatus] = useState('');

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      email: email.trim()
    });
    triggerSuccessMessage("프로필 정보가 저장되었습니다.");
  };

  const handleUpdateAI = (newPersona?: AIPersona, newExpertise?: string[], newFreq?: AIFrequency, newInst?: string) => {
    const updated: AIPartnerConfig = {
      persona: newPersona || persona,
      expertiseAreas: newExpertise || selectedExpertise,
      communicationFrequency: newFreq || frequency,
      customInstructions: typeof newInst === 'string' ? newInst : instructions
    };
    onUpdateAIConfig(updated);
  };

  const handleToggleExpertise = (preset: string) => {
    const next = selectedExpertise.includes(preset)
      ? selectedExpertise.filter(x => x !== preset)
      : [...selectedExpertise, preset];
    setSelectedExpertise(next);
    handleUpdateAI(persona, next, frequency, instructions);
  };

  const selectPersona = (p: AIPersona) => {
    setPersona(p);
    handleUpdateAI(p, selectedExpertise, frequency, instructions);
  };

  const selectFrequency = (f: AIFrequency) => {
    setFrequency(f);
    handleUpdateAI(persona, selectedExpertise, f, instructions);
  };

  const handleSaveInstructions = () => {
    handleUpdateAI(persona, selectedExpertise, frequency, instructions);
    triggerSuccessMessage("AI 코치 지시사항이 연동되었습니다.");
  };

  const triggerSuccessMessage = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBg = theme === 'dark' ? 'glass-card-dark' : 'bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] border border-slate-100';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Settings Header */}
      <section className="space-y-1">
        <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>설정</h2>
        <p className={`text-sm ${textMuted}`}>계정 환경설정 및 AI 파트너 설정을 관리합니다.</p>
      </section>

      {saveStatus && (
        <div id="save-status-toast" className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          ✓ {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Profile Configuration */}
          <section className={`${cardBg} rounded-[24px] p-6 space-y-6`}>
            <h3 className={`text-base font-bold ${textPrimary}`}>프로필 설정</h3>

            <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="relative">
                <img
                  alt="High quality corporate business headshot portrait of user"
                  className="w-20 h-20 rounded-[20px] object-cover shadow-md border border-slate-100"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAVibeDZwp4Bv8tMwJOhoEStCHcWATLgfJHxEqq1NQHNgyq7bhqEjYozvsq36iySTJBS6JGcor1GUcaNKIhsagAmRiTZQOTCNv5jsMVbqsVeUHMtJSVJMct6NkK-bBNsoYf-UG7jbRZnKmkrYLo1wlFzxPkxkqaOVx8o00qhwN3nyqLLOiu0K8C7cWQYCQpIDy2XrhPkNg-MqFFdJaDGeaAU0P-GL1Siz15ggmOp8RE4BcueeERGhsXSZwpttXGpO176X6IjesfnE"
                />
                <button 
                  title="사진 보정 Presets (UI Sim)"
                  onClick={() => triggerSuccessMessage("아우라 고해상도 아바타가 이미 적용되어 있습니다.")}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8B5CF6] hover:bg-[#7246cb] text-white rounded-lg flex items-center justify-center shadow transition-all active:scale-90 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <button 
                  type="button"
                  onClick={() => triggerSuccessMessage("기본 장치 라이브러리 연동 시률레이션")}
                  className={`px-4 py-2 ${theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'} rounded-xl text-xs font-semibold hover:bg-opacity-80 active:scale-95 transition-all cursor-pointer`}
                >
                  사진 변경
                </button>
                <p className="text-[10px] text-slate-400 mt-2 font-semibold">JPG, GIF, PNG (최대 5MB)</p>
              </div>
            </div>

            {/* Profile fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5 px-0.5">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full h-11 px-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] font-medium`}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5 px-0.5">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-11 px-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] font-medium`}
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full h-11 bg-[#8B5CF6] hover:bg-[#784ecc] text-white font-semibold text-xs rounded-xl active:scale-98 transition-all cursor-pointer shadow-md"
            >
              변경사항 저장
            </button>
          </section>

          {/* Account security flags */}
          <section className={`${cardBg} rounded-[24px] p-6 space-y-2`}>
            <h3 className={`text-base font-bold mb-4 ${textPrimary}`}>계정 및 보안</h3>

            <button 
              onClick={() => triggerSuccessMessage("안전 비밀번호 갱신 링크가 발송되었습니다.")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <span className={`text-xs font-semibold ${textPrimary}`}>비밀번호 변경</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-rose-500">계정 로그아웃</span>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </section>

          {/* Display Preferences */}
          <section className={`${cardBg} rounded-[24px] p-6 flex items-center justify-between`}>
            <span className={`text-xs font-bold leading-none ${textPrimary}`}>화면 테마</span>
            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 p-0.5 rounded-xl flex gap-0.5 shadow-inner">
              <button
                onClick={() => onChangeTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-[#8B5CF6] shadow-sm' 
                    : 'text-slate-450 hover:text-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>라이트</span>
              </button>
              <button
                onClick={() => onChangeTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#1e293b] text-violet-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>다크</span>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* AI Partner configuration matching mockups */}
          <section className={`${cardBg} rounded-[24px] p-6 space-y-6`}>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <BrainCircuit className="text-[#8B5CF6] w-5 h-5 shrink-0" />
              <h3 className={`text-base font-bold ${textPrimary}`}>AI 파트너 설정</h3>
            </div>

            {/* Persona picker cards Friendly / Logical / Assertive */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 block px-0.5">페르소나 (성격)</label>
              
              <div className="grid grid-cols-3 gap-2.5">
                {/* Friendly option */}
                <button
                  type="button"
                  onClick={() => selectPersona('friendly')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                    persona === 'friendly'
                      ? 'border-[#8B5CF6] bg-violet-50/50 dark:bg-violet-950/20 text-[#8B5CF6] font-bold'
                      : 'border-slate-200/70 dark:border-slate-800 bg-transparent text-slate-400'
                  }`}
                >
                  <Smile className="w-5 h-5" />
                  <span className="text-[10px]">친근한</span>
                </button>

                {/* Logical option */}
                <button
                  type="button"
                  onClick={() => selectPersona('logical')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                    persona === 'logical'
                      ? 'border-[#8B5CF6] bg-violet-50/50 dark:bg-violet-950/20 text-[#8B5CF6] font-bold'
                      : 'border-slate-200/70 dark:border-slate-800 bg-transparent text-slate-400'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[10px]">논리적인</span>
                </button>

                {/* Assertive option */}
                <button
                  type="button"
                  onClick={() => selectPersona('assertive')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                    persona === 'assertive'
                      ? 'border-[#8B5CF6] bg-violet-50/50 dark:bg-violet-950/20 text-[#8B5CF6] font-bold'
                      : 'border-slate-200/70 dark:border-slate-800 bg-transparent text-slate-400'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-[10px]">단호한</span>
                </button>
              </div>
            </div>

            {/* Expertise tags section */}
            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 block px-0.5">전문 분야 설정</label>
              
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_PRESETS.map((tag) => {
                  const isActive = selectedExpertise.includes(tag);
                  const chipColor = isActive 
                    ? 'bg-[#8B5CF6] text-white shadow shadow-violet-500/10' 
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:bg-slate-200';
                  
                  return (
                    <span
                      key={tag}
                      onClick={() => handleToggleExpertise(tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer select-none transition-all ${chipColor}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Communication frequency switcher */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 block px-0.5">소통 빈도</label>
              
              <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 p-0.5 rounded-xl shadow-inner">
                <button
                  type="button"
                  onClick={() => selectFrequency('minimal')}
                  className={`flex-1 py-2 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${
                    frequency === 'minimal'
                      ? 'bg-white dark:bg-slate-850 text-[#8B5CF6] shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  필요할 때만
                </button>
                <button
                  type="button"
                  onClick={() => selectFrequency('moderate')}
                  className={`flex-1 py-2 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${
                    frequency === 'moderate'
                      ? 'bg-white dark:bg-slate-850 text-[#8B5CF6] shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  적절하게
                </button>
                <button
                  type="button"
                  onClick={() => selectFrequency('proactive')}
                  className={`flex-1 py-2 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${
                    frequency === 'proactive'
                      ? 'bg-white dark:bg-slate-850 text-[#8B5CF6] shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  능동적으로
                </button>
              </div>
            </div>

            {/* System specific prompt instructions */}
            <div className="border-l-2 border-l-[#8B5CF6] pl-4 py-1 space-y-2">
              <label className="text-xs font-bold text-[#8B5CF6] block">맞춤 지시사항 (AI Insight)</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="AI 코치가 나에게 어떻게 행동하길 원하시나요?"
                className={`w-full min-h-[100px] p-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-700'} border-none outline-none focus:ring-1 focus:ring-[#8B5CF6] rounded-xl text-xs leading-relaxed resize-none`}
              />
              <button
                type="button"
                onClick={handleSaveInstructions}
                className="px-4 py-1.5 bg-[#8B5CF6] hover:bg-[#794dd5] text-white text-[10px] font-bold rounded-lg cursor-pointer"
              >
                지시사항 적용
              </button>
            </div>
          </section>

          {/* Notifications toggles exactly matches mockups */}
          <section className={`${cardBg} rounded-[24px] p-6 space-y-4`}>
            <h3 className={`text-base font-bold ${textPrimary}`}>알림 설정</h3>

            <div className="space-y-3">
              {/* Email Alert toggle */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className={`text-xs font-semibold ${textPrimary}`}>이메일 알림</span>
                </div>
                
                {/* Custom toggle slider switch matching mockups */}
                <div 
                  onClick={() => setNotificationEmail(!notificationEmail)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                    notificationEmail ? 'bg-[#8B5CF6]' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    notificationEmail ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Push Alert toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className={`text-xs font-semibold ${textPrimary}`}>푸시 알림</span>
                </div>
                
                <div 
                  onClick={() => setNotificationPush(!notificationPush)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                    notificationPush ? 'bg-[#8B5CF6]' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    notificationPush ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
