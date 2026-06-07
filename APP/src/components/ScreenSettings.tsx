import React, { useState } from "react";
import { Bell, Shield, Info, Download, Upload, User, Phone, Mail, Check, Settings, Sparkles, Brain, Lock } from "lucide-react";
import { UserProfile, NotificationSettings, CoachStyleType } from "../types";

interface ScreenSettingsProps {
  profile: UserProfile;
  notifications: NotificationSettings;
  coachStyle: CoachStyleType;
  onUpdateProfile: (p: UserProfile) => void;
  onUpdateNotifications: (n: NotificationSettings) => void;
  onUpdateCoachStyle: (style: CoachStyleType) => void;
  onLogout: () => void;
}

export default function ScreenSettings({
  profile,
  notifications,
  coachStyle,
  onUpdateProfile,
  onUpdateNotifications,
  onUpdateCoachStyle,
  onLogout
}: ScreenSettingsProps) {
  
  // Profile editing local status
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [gender, setGender] = useState(profile.gender);
  
  const [isSaved, setIsSaved] = useState(false);

  // Notifications toggle triggers
  const handleToggleNotification = (key: keyof NotificationSettings) => {
    onUpdateNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, role, phone, email, gender });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  // Micro routine file exporter helper
  const handleExportBackup = () => {
    const backupContent = {
      profile: { name, role, phone, email, gender },
      appSettings: { coachStyle, notifications },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `adaptive_ai_backup_${name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="settings-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen pb-24 border border-gray-100 shadow-xl rounded-2xl relative">
      
      {/* Settings Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-[#374d20]" />
          <h1 className="font-bold text-lg text-gray-900">환경 설정</h1>
        </div>
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Main Settings Panel */}
      <main className="p-5 flex-1 overflow-y-auto space-y-6">
        
        {/* Profile Editing section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-l-3 border-l-[#4e6535] pl-2 leading-none uppercase">
            프로필 정보 수정
          </h2>

          <form onSubmit={handleSaveProfile} className="border border-slate-150 p-5 rounded-2xl bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-150">
                <img 
                  alt="Edit Profile Avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxSVa6i3f3upJdUrPp4C_2-3OL2RHQZcmrODd-rsb3HjITjJIfaTThOoKOvCJR6p6QYrT3RQ0WNxrjMjbEiwbo8llYQR_ycmx5Oa26iReTFHPLZBdfdhZSt_IJbpunOXrOA2dtW6oUIoHC8mFf9Zp9Trl_Cu9kd5ZaTCOYnhdZ0JG18wMzFFisXCJhIeE5dceeWKvoGObW8Ncc2NKHa9g50K5NhYROy2yhQo-juO7GoTCbIAFEvyhD_xZtZ3RGSpQP3w5fCJrj9Nq7"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">{name || "윤관"}님</p>
                <p className="text-[10px] text-slate-400">설명 문고와 대표 프로필이 커뮤니티에 반영됩니다.</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 pl-1 uppercase">이름</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:bg-white" 
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 pl-1 uppercase">직무 또는 설명</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:bg-white" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-400 pl-1 uppercase">이메일</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:bg-white" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 pl-1 uppercase">성별</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:bg-white"
                >
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 pl-1 uppercase">전화번호</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-semibold focus:bg-white" 
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-[#374d20] hover:bg-[#2e401b] transition-all text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 duration-150"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-[#e1fec0]" />
                  <span className="text-[#e1fec0]">저장 완료</span>
                </>
              ) : (
                <span>프로필 정보 저장</span>
              )}
            </button>

          </form>
        </section>

        {/* AI Coaching Style selection card segment */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-gray-900 border-l-3 border-l-[#4e6535] pl-2 leading-none uppercase">
              AI 코치 퍼스널 스타일
            </h2>
            <div className="flex items-center gap-1.5 text-[#374d20]">
              <Sparkles className="w-3.5 h-3.5 text-[#374d20]" />
              <span className="text-[10px] font-extrabold text-[#374d20]">Gemini Dynamic</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Analytical model option */}
            <button
              type="button"
              onClick={() => onUpdateCoachStyle("분석형")}
              className={`border p-4.5 rounded-xl text-center flex flex-col items-center gap-2 cursor-pointer transition-all ${
                coachStyle === "분석형"
                  ? "border-[#4e6535] bg-[#4e6535]/5 shadow-xs scale-102"
                  : "border-slate-150 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">🎯</div>
              <span className="font-extrabold text-[11px] text-gray-800">분석형</span>
            </button>

            {/* Affectionate option */}
            <button
              type="button"
              onClick={() => onUpdateCoachStyle("다정형")}
              className={`border p-4.5 rounded-xl text-center flex flex-col items-center gap-2 cursor-pointer transition-all ${
                coachStyle === "다정형"
                  ? "border-[#4e6535] bg-[#4e6535]/5 shadow-xs scale-102"
                  : "border-slate-150 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold font-sans">🌸</div>
              <span className="font-extrabold text-[11px] text-gray-800">다정형</span>
            </button>

            {/* Spartan option */}
            <button
              type="button"
              onClick={() => onUpdateCoachStyle("스파르타형")}
              className={`border p-4.5 rounded-xl text-center flex flex-col items-center gap-2 cursor-pointer transition-all ${
                coachStyle === "스파르타형"
                  ? "border-[#4e6535] bg-[#4e6535]/5 shadow-xs scale-102"
                  : "border-slate-150 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold font-mono">⚡︎</div>
              <span className="font-extrabold text-[11px] text-gray-800">스파르타형</span>
            </button>
          </div>
        </section>

        {/* Notifications and backup */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-l-3 border-l-[#4e6535] pl-2 leading-none uppercase">
            알림 및 오프라인 백업
          </h2>

          <div className="border border-slate-150 p-5 rounded-2xl bg-white shadow-xs space-y-4 text-xs font-semibold">
            
            {/* Toggle rows */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">마감 기한 지날 때 알림 받기</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={notifications.onDeadline}
                  onChange={() => handleToggleNotification("onDeadline")}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#374d20]"></div>
              </label>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">오늘 하루 루틴 복기 시간 알림</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={notifications.onDailyReview}
                  onChange={() => handleToggleNotification("onDailyReview")}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#374d20]"></div>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">주간 완료율 통계 보고서 요약 알림</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={notifications.onWeeklySummary}
                  onChange={() => handleToggleNotification("onWeeklySummary")}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#374d20]"></div>
              </label>
            </div>

          </div>

          <div className="border border-[#3c4a2e]/10 p-5 rounded-2xl bg-[#374d20]/5 space-y-3">
            <h3 className="font-bold text-gray-900 text-xs">내 리소스 데이터 백업하기</h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              작성한 모든 미세 할 일 목표, 성과 점수, 그리고 AI 설정들을 개인 디바이스에 JSON 포맷 백업 파일로 안전하게 추출해 보세요.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-[#374d20] border border-[#3c4a2e]/30 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#374d20]" />
              <span>백업 파일 내보내기</span>
            </button>
          </div>
        </section>

        {/* Security & Logout button */}
        <section className="space-y-4 pt-2">
          <button 
            type="button"
            onClick={onLogout}
            className="w-full py-4 text-center border border-red-200/60 bg-red-50/50 hover:bg-red-50 text-red-500 font-extrabold rounded-xl transition-all font-sans text-xs active:scale-98"
          >
            로그아웃 후 초기화
          </button>
        </section>

      </main>

    </div>
  );
}
