/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Target, 
  Brain, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Save, 
  Mail,
  Shield,
  Smile,
  AlertTriangle,
  Zap,
  Info,
  Camera,
  Upload,
  Clock,
  Sliders,
  Bell,
  SlidersHorizontal,
  Moon,
  ToggleLeft
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onResetTasks: () => void;
}

const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYdzSVSmYgpM3s4K96TigpLDHQ_ZWXH0Y8Sqbd9jVt6GtwFJR4esPez0b8NQwCxHmMeAKU5aYTWTZ-f_SWh59hseJxZGbIa5864w23eBK0NetoLy1gFj1Y6uEgbJxwC4Vt7e3uVnFbPPDC104As2aSs-3B201E84Xqn-BF8B5qVSa6lecMnTPgmY57bgzPITC-WC8GJkipshsY1sjn9eC-5kTvIXzA5DWZlIv4Ik58NAQLeL9u_UU2eKPCECQHuYEXzBVnSbuhuLA',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
];

export default function SettingsView({ user, onUpdateUser, onResetTasks }: SettingsViewProps) {
  // Local state initialized with current user props
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [dailyGoalCount, setDailyGoalCount] = useState(user.dailyGoalCount || 5);
  const [coachTone, setCoachTone] = useState<'friendly' | 'strict' | 'analytic'>(user.coachTone || 'analytic');
  const [cognitiveTipsEnabled, setCognitiveTipsEnabled] = useState(user.cognitiveTipsEnabled ?? true);
  
  // High-fidelity micro-settings (persisted locally)
  const [slicingUnit, setSlicingUnit] = useState<number>(() => {
    const val = localStorage.getItem('slicing_unit');
    return val ? parseInt(val) : 15;
  });
  const [targetSuccessRate, setTargetSuccessRate] = useState<number>(() => {
    const val = localStorage.getItem('target_success_rate');
    return val ? parseFloat(val) : 60.8;
  });
  const [restBreakStrength, setRestBreakStrength] = useState<'light' | 'normal' | 'deep'>(() => {
    const val = localStorage.getItem('rest_break_strength');
    return (val as 'light' | 'normal' | 'deep') || 'normal';
  });
  const [dailyDeadline, setDailyDeadline] = useState<string>(() => {
    return localStorage.getItem('daily_deadline') || '18:00';
  });
  const [autoReschedule, setAutoReschedule] = useState<boolean>(() => {
    const val = localStorage.getItem('auto_reschedule');
    return val === null ? true : val === 'true';
  });
  const [weeklyEmailSub, setWeeklyEmailSub] = useState<boolean>(() => {
    const val = localStorage.getItem('weekly_email_sub');
    return val === null ? false : val === 'true';
  });

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      // 1. Update Core Context
      onUpdateUser({
        ...user,
        name,
        email,
        avatarUrl,
        dailyGoalCount,
        coachTone,
        cognitiveTipsEnabled
      });

      // 2. Persist Advanced Fine-tuned Settings
      localStorage.setItem('slicing_unit', slicingUnit.toString());
      localStorage.setItem('target_success_rate', targetSuccessRate.toString());
      localStorage.setItem('rest_break_strength', restBreakStrength);
      localStorage.setItem('daily_deadline', dailyDeadline);
      localStorage.setItem('auto_reschedule', autoReschedule.toString());
      localStorage.setItem('weekly_email_sub', weeklyEmailSub.toString());

      setIsSaving(false);
      setShowToast(true);
      
      // Auto dismiss toast
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 800);
  };

  const handleResetConfirm = () => {
    onResetTasks();
    setShowResetConfirm(false);
  };

  const decrementGoal = () => setDailyGoalCount(prev => Math.max(1, prev - 1));
  const incrementGoal = () => setDailyGoalCount(prev => Math.min(20, prev + 1));

  return (
    <div className="flex-grow overflow-y-auto bg-[#f7f6f2] p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full pb-24">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-[#5a6e38] text-white px-5 py-3.5 rounded-xl shadow-xl border border-[#e0ddd8]/20 flex items-center gap-3"
            id="settings-success-toast"
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-white/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold">설정이 정상 저장되었습니다</p>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">분석 지표 및 코파일럿 피드백 환경에 즉시 적용되었습니다.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e0ddd8]/80 pb-6 text-left">
        <div>
          <h2 className="text-lg font-semibold text-[#1c1c14] mb-0.5">설정</h2>
          <p className="text-[13px] text-[#9a9a86]">프로필과 앱 환경을 관리합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-left">
        
        {/* Card 1: User Profile Section */}
        <div className="bg-white rounded-xl border border-[#e0ddd8]/80 shadow-xs p-6 overflow-hidden transition-all hover:border-[#e0ddd8]" id="profile-card">
          <div className="flex items-center gap-3 mb-6 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#edecea] text-[#1c1c14] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">개인 프로필 정보 설정</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">시스템 대시보드 및 AI 메시지에 반영될 사용자 정보입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Avatar Preview & Selection */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#f7f6f2]/50 rounded-xl border border-dashed border-[#e0ddd8]">
              <span className="text-[11px] font-bold text-[#9a9a86] mb-3 uppercase tracking-wider font-mono">프로필 이미지 수정</span>
              
              <div className="relative group mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md relative bg-[#f7f6f2]">
                  <img 
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                    referrerPolicy="no-referrer"
                  />
                  <label htmlFor="avatar-file-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </label>
                </div>
              </div>

              {/* Upload Button */}
              <div className="mb-4">
                <label 
                  htmlFor="avatar-file-upload" 
                  className="px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#e0ddd8] rounded-lg text-[11px] font-bold text-[#6b6b58] hover:text-[#1c1c14] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#6b6b58]" />
                  <span>내 사진 업로드</span>
                </label>
                <input 
                  id="avatar-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Quick Select Presets */}
              <div className="flex gap-1.5 justify-center mt-1">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-6 h-6 rounded-full overflow-hidden border-2 duration-150 transition-all ${
                      avatarUrl === url ? 'border-[#5a6e38] scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <img src={url} alt="Preset Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-[#9a9a86] mt-3 text-center leading-normal">
                기본 프리셋을 선택하거나 컴퓨터에 저장된<br />이미지 파일을 불러올 수 있습니다.
              </p>
            </div>

            {/* Form Inputs */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5 flex items-center gap-1">
                  <span>사용자 성함</span>
                  <span className="text-[#c4674a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-xs leading-none text-[#1c1c14] placeholder-[#9a9a86] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all font-semibold"
                  placeholder="예: 이현우"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5 flex items-center gap-1">
                  <span>이메일 주소</span>
                  <span className="text-[#c4674a]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a86]">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-xs leading-none text-[#1c1c14] placeholder-[#9a9a86] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all font-semibold"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">
                  외부 이미지 경로 (직접 주소 연결)
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-[12px] font-mono leading-none text-[#6b6b58] placeholder-[#9a9a86] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Slicing & Targets Configuration */}
        <div className="bg-white rounded-xl border border-[#e0ddd8]/80 shadow-xs p-6 overflow-hidden transition-all hover:border-[#e0ddd8]" id="slicing-rules-card">
          <div className="flex items-center gap-3 mb-6 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#ecf0e4] text-[#2d7a3a] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">할 일 쪼개기 및 성공률 세부 조정</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">15분 쪼개기 단위 설정 및 지치지 않는 맞춤형 주간 목표 성공률 조율 공간입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#e0ddd8]">
            {/* Daily Goal Count Controls */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#6b6b58]">
                하루 권장 할 일 목표 개수 (Daily Target)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[#e0ddd8] rounded-lg overflow-hidden bg-[#f7f6f2]">
                  <button 
                    type="button" 
                    onClick={decrementGoal}
                    className="px-3 py-2 text-[#6b6b58] hover:bg-[#f7f6f2]/60 font-bold transition-all text-sm"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xs font-semibold font-mono text-[#1c1c14]">{dailyGoalCount}</span>
                  <button 
                    type="button" 
                    onClick={incrementGoal}
                    className="px-3 py-2 text-[#6b6b58] hover:bg-[#f7f6f2]/60 font-bold transition-all text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#6b6b58] font-semibold">개 / 일일 계획</span>
              </div>
              <p className="text-[11px] text-[#9a9a86] leading-normal">
                개인화 맞춤 기획 시, 추천 일정으로 채워지는 하루의 핵심 과업 총량 기준치입니다.
              </p>
            </div>

            {/* Slicing Time Unit Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#6b6b58]">
                스케줄 쪼개기 기본 간격 (Time Slice Unit)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSlicingUnit(val)}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                      slicingUnit === val 
                        ? 'border-[#2d7a3a] bg-[#ecf0e4]/40 text-[#2d7a3a] shadow-3xs' 
                        : 'border-[#e0ddd8] hover:bg-[#edecea] text-[#6b6b58]'
                    }`}
                  >
                    {slicingUnit === val && <Check className="w-3 h-3 text-[#2d7a3a]" />}
                    <span>{val}분 단위</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#9a9a86] leading-normal">
                일정 진행 부담을 줄이기 위한 마이크로 투두 할 일 카드의 권장 쪼개기 배당 단위입니다.
              </p>
            </div>
          </div>

          <div className="pt-5 space-y-5">
            {/* Target Success Rate Control */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58]">
                    목표 성공률 기준 조정 (Target Completion Rate)
                  </label>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">내 실체 조건에 반응하는 생산성 지표의 안전 마일스톤 기준선입니다.</p>
                </div>
                <span className="text-xs font-semibold font-mono text-[#1c1c14] bg-[#edecea] border border-[#e0ddd8] px-2 py-0.5 rounded">
                  {targetSuccessRate}%
                </span>
              </div>

              {/* Slider Input */}
              <div className="pt-2">
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.1"
                  value={targetSuccessRate}
                  onChange={(e) => setTargetSuccessRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#f7f6f2] rounded-lg appearance-none cursor-pointer accent-[#1c1c14]"
                />
                <div className="flex justify-between text-[11px] font-bold text-[#9a9a86] px-1 mt-1 font-mono">
                  <span>50% (안정 집중화)</span>
                  <span className="text-[#1c1c14] font-semibold">60.8% (정비 및 점진 완수 권장)</span>
                  <span>80% (도전 행동 지향)</span>
                  <span>100% (완벽 철저 지향)</span>
                </div>
              </div>

              {/* Target Premade Info block */}
              <div className="p-3.5 bg-[#f7f6f2]/70 border border-[#e0ddd8] rounded-xl text-left flex gap-3 items-start">
                <Info className="w-4 h-4 text-[#9a9a86] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-[#1c1c14]">
                    현재 모드: {targetSuccessRate <= 65 ? '무리하지 않는 자가 정비 및 조율 상태' : targetSuccessRate <= 85 ? '보통 난이도 균형 생산적 상태' : '강도 높은 밀착 고몰입 상태'}
                  </h4>
                  <p className="text-[11px] text-[#6b6b58] leading-normal">
                    {targetSuccessRate <= 65 
                      ? '과도한 목표량으로 인한 스트레스를 피하기 위해 60% 안팎의 편안한 정비를 기본 지향합니다. 인지적 가동 부담을 덜고 소화할 수 있는 일만 완수해내는 피드백 구조입니다.' 
                      : '일과의 80% 가량을 철저히 소화하고 밀도 있게 진행하는 것에 마커를 배치합니다. 어느 정도 집중 트랙 관리에 익숙해진 상황에서 추천합니다.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rest break scheduling strength */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#6b6b58]">
                휴식 및 완충 강도 분배 (Rest Interval Density)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { key: 'light', label: '유연한 자율 휴식', desc: '고정 간격 없이 자유롭게 멈추고 환기합니다.' },
                  { key: 'normal', label: '집중-휴식 균형 완충', desc: '15분 쪼개기 완료 마다 3분 환기를 예비합니다.' },
                  { key: 'deep', label: '강화된 리커버리', desc: '피로 누적 시 권장하며 매 주기 충실한 브레이크를 제공.' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setRestBreakStrength(item.key as 'light' | 'normal' | 'deep')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      restBreakStrength === item.key 
                        ? 'border-[#5a6e38] bg-[#edecea]/10 shadow-3xs' 
                        : 'border-[#e0ddd8] bg-white hover:bg-[#edecea]'
                    }`}
                  >
                    <span className={`text-[11px] font-semibold block mb-1 ${restBreakStrength === item.key ? 'text-[#1c1c14]' : 'text-[#1c1c14]'}`}>
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[#9a9a86] leading-snug block">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: AI Assistant Cognitive Tuning */}
        <div className="bg-white rounded-xl border border-[#e0ddd8]/80 shadow-xs p-6 overflow-hidden transition-all hover:border-[#e0ddd8]" id="ai-tuning-card">
          <div className="flex items-center gap-3 mb-6 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#edecea] text-[#1c1c14] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">AI 코치 지능 성향 및 가동 상태 조율</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">인공지능 코치가 생성해 제공하는 피드백 성향과 의사결정 방식을 제어합니다.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#6b6b58]">
                코파일럿 어조 선택 (Coach Character Tone)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tone 1: Analytic */}
                <button
                  type="button"
                  onClick={() => setCoachTone('analytic')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    coachTone === 'analytic'
                      ? 'border-[#5a6e38] bg-[#edecea]/30 shadow-3xs'
                      : 'border-[#e0ddd8] bg-white hover:bg-[#edecea]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px] text-[#1c1c14] font-bold">query_stats</span>
                    <span className="text-[11px] font-semibold text-[#1c1c14]">객관 지표 밀착형</span>
                  </div>
                  <p className="text-[11px] text-[#9a9a86] leading-relaxed">
                    실제 작업 성공치, 피로 지연 누적 수치와 일일 로그 시간을 기반으로 분석하여 개선 방안을 던져줍니다.
                  </p>
                </button>

                {/* Tone 2: Friendly */}
                <button
                  type="button"
                  onClick={() => setCoachTone('friendly')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    coachTone === 'friendly'
                      ? 'border-[#5a6e38] bg-[#edecea]/30 shadow-3xs'
                      : 'border-[#e0ddd8] bg-white hover:bg-[#edecea]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Smile className="w-4 h-4 text-[#2d7a3a]" />
                    <span className="text-[11px] font-semibold text-[#1c1c14]">공감 페이스 메이커</span>
                  </div>
                  <p className="text-[11px] text-[#9a9a86] leading-relaxed">
                    일정이 밀리거나 지연될 때 따뜻하게 다독이며, 인지 과부하 상황에 적합한 휴식을 지원합니다.
                  </p>
                </button>

                {/* Tone 3: Strict */}
                <button
                  type="button"
                  onClick={() => setCoachTone('strict')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    coachTone === 'strict'
                      ? 'border-[#5a6e38] bg-[#edecea]/30 shadow-3xs'
                      : 'border-[#e0ddd8] bg-white hover:bg-[#edecea]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[#c4674a]" />
                    <span className="text-[11px] font-semibold text-[#1c1c14]">냉정 엄격 단련주의</span>
                  </div>
                  <p className="text-[11px] text-[#9a9a86] leading-relaxed">
                    지연 습관 및 낭비 동선을 면밀히 파악하고 긴장감 있게 성과 마감을 채찍질하는 밀착 코칭입니다.
                  </p>
                </button>
              </div>
            </div>

            {/* Cognitive tips switch */}
            <div className="bg-[#f7f6f2]/60 p-4 rounded-xl border border-[#e0ddd8] flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-[#1c1c14] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" />
                  <span>뇌인지 피로 상태 감지 팝업 가이드 활성화</span>
                </span>
                <p className="text-[11px] text-[#9a9a86] max-w-lg">
                  집중 시간이 누적되어 피로도가 감지되면 즉시 가벼운 보상 활동이나 비스트레스성 루틴을 제안하는 다이얼로그를 제공합니다.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={cognitiveTipsEnabled} 
                  onChange={(e) => setCognitiveTipsEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-[#f7f6f2] focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#e0ddd8] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5a6e38]"></div>
              </label>
            </div>

            {/* Automatic rescheduling switch */}
            <div className="bg-[#f7f6f2]/60 p-4 rounded-xl border border-[#e0ddd8] flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-[#1c1c14] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1c1c14]" />
                  <span>미완수 일정 지능 자율 이월 전술</span>
                </span>
                <p className="text-[11px] text-[#9a9a86] max-w-lg">
                  선택한 마감 시간까지 완료하지 못한 미소화 할 일 카드를 수작업 이월 없이 자동으로 내일 오전 일정으로 정리 이관합니다.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={autoReschedule} 
                  onChange={(e) => setAutoReschedule(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-[#f7f6f2] focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#e0ddd8] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5a6e38]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Card 4: Notifications & General Preferences */}
        <div className="bg-white rounded-xl border border-[#e0ddd8]/80 shadow-xs p-6 overflow-hidden transition-all hover:border-[#e0ddd8]" id="notification-settings-card">
          <div className="flex items-center gap-3 mb-6 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#edecea] text-[#1c1c14] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">일과 알림 및 알람 정비</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">매일 퇴근 정렬 및 피드백 기록 알림 시간을 설계합니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#6b6b58]">
                일일 회고 및 완료 알림 정렬 시간
              </label>
              <select
                value={dailyDeadline}
                onChange={(e) => setDailyDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-xs leading-none text-[#1c1c14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all font-semibold"
              >
                <option value="17:00">17:00 (오후 5시)</option>
                <option value="18:00">18:00 (오후 6시) - 디폴트 권장</option>
                <option value="19:00">19:00 (오후 7시)</option>
                <option value="20:00">20:00 (오후 8시)</option>
                <option value="21:00">21:00 (오후 9시)</option>
                <option value="22:00">22:00 (오후 10시)</option>
              </select>
              <p className="text-[11px] text-[#9a9a86] leading-normal">
                설정한 시간에 맞춰 오늘 하루를 점검하고 성공률 60% 안팎의 정비 완료 리포트를 전송합니다.
              </p>
            </div>

            {/* Email Subscription Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#6b6b58]">
                피어 피드백 및 주간 리포트 이메일 구독
              </label>
              <div className="flex items-center justify-between p-2.5 bg-[#f7f6f2] rounded-lg border border-[#e0ddd8]">
                <span className="text-[11px] font-bold text-[#6b6b58]">주간 성과 변동 종합 분석 메일</span>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={weeklyEmailSub} 
                    onChange={(e) => setWeeklyEmailSub(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-[#f7f6f2] focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#e0ddd8] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5a6e38]"></div>
                </label>
              </div>
              <p className="text-[11px] text-[#9a9a86] leading-normal">
                매주 일요일 저녁 한 주간의 쪼개기 마커 성패 지점과 요일별 인지 피로 지점의 세밀한 비교 진단을 메일박스로 받아봅니다.
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Danger Zone */}
        <div className="bg-[#f8ede8]/40 rounded-xl border border-[#e8c0b0] p-6 overflow-hidden" id="danger-zone-card">
          <div className="flex items-center gap-3 mb-4 border-b border-[#e8c0b0] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8ede8] text-[#c4674a] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#9a9a86]">위험 관리 구역 (Danger Zone)</h3>
              <p className="text-[11px] text-[#c4674a] mt-0.5">시스템 내부의 데이터 적재 공간을 정리하거나 리셋 시킵니다.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-[#1c1c14]">작업 보드 초기 리스트 복구</span>
              <p className="text-[11px] text-[#6b6b58] max-w-md">
                내가 등록하거나 수정한 할 일을 지우고, 사용법 학습을 위한 기본 데모 일정(스마트 To-Do) 배열로 즉각 채워 복귀합니다.
              </p>
            </div>

            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetConfirm}
                  className="px-3.5 py-1.5 bg-[#c4674a] hover:bg-[#c4674a] text-white rounded-lg text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  예, 데이터 초기화 실행
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 bg-[#f7f6f2] hover:bg-[#f7f6f2] text-[#1c1c14] rounded-lg text-[11px] font-bold shadow-2xs transition-all"
                >
                  보류/취소
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-white hover:bg-[#f8ede8]/30 text-[#c4674a] border border-[#e8c0b0] rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-97 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c4674a]" />
                <span>데이터 베이스 데모 상태로 초기화</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Save Trigger Area */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#5a6e38] text-white hover:bg-[#4a5c2e] disabled:bg-[#6b6b58] rounded-xl text-xs font-bold shadow-[0px_4px_16px_rgba(79,70,229,0.3)] active:scale-97 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                <span>정렬 데이터 저장 매칭 중...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>설정 저장 및 환경 전체 동기화</span>
              </>
            )}
          </button>
        </div>

      </form>
      
    </div>
  );
}
