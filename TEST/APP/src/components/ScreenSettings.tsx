import React, { useState } from "react";
import {
  User, Mail, Camera, Upload, Check, Save,
  Sparkles, Brain, Smile, Shield, Bell, Lock,
  Download, RotateCcw,
} from "lucide-react";
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

const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYdzSVSmYgpM3s4K96TigpLDHQ_ZWXH0Y8Sqbd9jVt6GtwFJR4esPez0b8NQwCxHmMeAKU5aYTWTZ-f_SWh59hseJxZGbIa5864w23eBK0NetoLy1gFj1Y6uEgbJxwC4Vt7e3uVnFbPPDC104As2aSs-3B201E84Xqn-BF8B5qVSa6lecMnTPgmY57bgzPITC-WC8GJkipshsY1sjn9eC-5kTvIXzA5DWZlIv4Ik58NAQLeL9u_UU2eKPCECQHuYEXzBVnSbuhuLA',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
];

const TONES: { key: CoachStyleType; icon: React.ElementType; color: string; label: string; desc: string }[] = [
  { key: "분석형", icon: Brain, color: "text-[#1c1c14]", label: "분석형", desc: "내 완료율·패턴을 바탕으로 객관적으로 짚어줘요." },
  { key: "다정형", icon: Smile, color: "text-[#2d7a3a]", label: "다정형", desc: "일이 밀려도 따뜻하게 다독여주고 쉬라고 권해요." },
  { key: "스파르타형", icon: Shield, color: "text-[#c4674a]", label: "스파르타형", desc: "미루는 습관을 단호하게 지적하며 밀어붙여요." },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-[#5a6e38]" : "bg-[#e0ddd8]"}`}
    >
      <span className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

export default function ScreenSettings({
  profile,
  notifications,
  coachStyle,
  onUpdateProfile,
  onUpdateNotifications,
  onUpdateCoachStyle,
  onLogout,
}: ScreenSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState(profile.gender);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);

  const [notifDeadline, setNotifDeadline] = useState(notifications.onDeadline);
  const [notifDaily, setNotifDaily] = useState(notifications.onDailyReview);
  const [dailyTime, setDailyTime] = useState(() => localStorage.getItem("notif_daily_time") || "18:00");
  const [notifWeekly, setNotifWeekly] = useState(notifications.onWeeklySummary);

  const [tone, setTone] = useState<CoachStyleType>(coachStyle);
  const [dailyGoal, setDailyGoal] = useState(() => parseInt(localStorage.getItem("daily_goal") || "5", 10));

  const [defaultCategory, setDefaultCategory] = useState(() => localStorage.getItem("default_category") || "WORK");
  const [defaultPriority, setDefaultPriority] = useState(() => localStorage.getItem("default_priority") || "medium");
  const [defaultView, setDefaultView] = useState(() => localStorage.getItem("default_view") || "list");

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({ name, role: profile.role, gender, phone, email });
      onUpdateNotifications({ onDeadline: notifDeadline, onDailyReview: notifDaily, onWeeklySummary: notifWeekly });
      onUpdateCoachStyle(tone);
      localStorage.setItem("notif_daily_time", dailyTime);
      localStorage.setItem("daily_goal", String(dailyGoal));
      localStorage.setItem("default_category", defaultCategory);
      localStorage.setItem("default_priority", defaultPriority);
      localStorage.setItem("default_view", defaultView);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }, 500);
  };

  const handleExportBackup = () => {
    const backup = {
      profile: { name, gender, phone, email },
      notifications: { onDeadline: notifDeadline, onDailyReview: notifDaily, onWeeklySummary: notifWeekly },
      coachStyle: tone,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adaptive_ai_backup_${name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-xs text-[#1c1c14] placeholder-[#9a9a86] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all font-semibold";
  const selectCls = "w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-xs text-[#1c1c14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all font-semibold appearance-none";

  return (
    <div id="settings-screen" className="w-full bg-white flex flex-col min-h-screen pb-24 relative">

      {/* Toast */}
      <div className={`fixed top-20 right-4 z-50 bg-[#5a6e38] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 ${showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold">설정이 저장되었어요</p>
          <p className="text-[11px] text-white/70 mt-0.5">변경한 내용이 바로 적용됐어요.</p>
        </div>
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-[#f7f6f2] border-b border-[#e0ddd8] px-5 py-4 shrink-0">
        <h1 className="text-lg font-bold text-[#1c1c14]">설정</h1>
        <p className="text-[11px] text-[#9a9a86] mt-0.5">프로필과 앱 사용 환경을 관리하세요.</p>
      </header>

      <main className="px-5 py-5 space-y-5">
        <form onSubmit={handleSave} className="space-y-5">

          {/* ── 1. 프로필 ── */}
          <div className="bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
              <div className="w-8 h-8 rounded-lg bg-[#edecea] flex items-center justify-center">
                <User className="w-4 h-4 text-[#1c1c14]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1c1c14]">프로필</h3>
                <p className="text-[11px] text-[#9a9a86] mt-0.5">대시보드와 AI 코치에 표시되는 내 정보예요.</p>
              </div>
            </div>

            {/* 아바타 */}
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#f7f6f2]">
                  <img src={avatarUrl} alt="프로필" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <label htmlFor="avatar-file" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </label>
                </div>
              </div>
              <label htmlFor="avatar-file" className="px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#5a6e38] rounded-lg text-[11px] font-bold text-[#6b6b58] flex items-center gap-1.5 cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5" /> 사진 변경
              </label>
              <input id="avatar-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div className="flex gap-1.5">
                {PRESET_AVATARS.map((url, idx) => (
                  <button key={idx} type="button" onClick={() => setAvatarUrl(url)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${avatarUrl === url ? "border-[#5a6e38] scale-110" : "border-transparent hover:scale-105"}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* 입력 필드 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">이름</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력하세요" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">성별</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className={selectCls}>
                    <option value="기타">선택 안 함</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">전화번호</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86]" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" className={`${inputCls} pl-9`} />
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. 알림 ── */}
          <div className="bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
              <div className="w-8 h-8 rounded-lg bg-[#edecea] flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#1c1c14]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1c1c14]">알림</h3>
                <p className="text-[11px] text-[#9a9a86] mt-0.5">어떤 알림을 받을지 선택해요.</p>
              </div>
            </div>

            <div className="divide-y divide-[#e0ddd8]">
              <div className="flex items-center justify-between py-3">
                <div className="pr-4">
                  <p className="text-xs font-bold text-[#1c1c14]">마감 임박 알림</p>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">할 일 마감이 가까워지면 알려줘요.</p>
                </div>
                <Toggle checked={notifDeadline} onChange={setNotifDeadline} />
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-[#1c1c14]">하루 정리 알림</p>
                    <p className="text-[11px] text-[#9a9a86] mt-0.5">정해진 시간에 오늘 한 일을 정리하라고 알려줘요.</p>
                  </div>
                  <Toggle checked={notifDaily} onChange={setNotifDaily} />
                </div>
                {notifDaily && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#6b6b58]">알림 시간</span>
                    <select value={dailyTime} onChange={e => setDailyTime(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-[11px] font-semibold text-[#1c1c14] focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38]">
                      {["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="pr-4">
                  <p className="text-xs font-bold text-[#1c1c14]">주간 요약 메일</p>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">매주 일요일 저녁, 한 주 완료 현황을 메일로 받아요.</p>
                </div>
                <Toggle checked={notifWeekly} onChange={setNotifWeekly} />
              </div>
            </div>
          </div>

          {/* ── 3. AI 코치 ── */}
          <div className="bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
              <div className="w-8 h-8 rounded-lg bg-[#ecf0e4] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#2d7a3a]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1c1c14]">AI 코치</h3>
                <p className="text-[11px] text-[#9a9a86] mt-0.5">코치의 말투와 하루 목표량을 정해요.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-[#1c1c14] mb-2.5">코치 말투</p>
                <div className="grid grid-cols-1 gap-3">
                  {TONES.map(({ key, icon: Icon, color, label, desc }) => (
                    <button key={key} type="button" onClick={() => setTone(key)}
                      className={`p-4 rounded-xl border text-left transition-all ${tone === key ? "border-[#5a6e38] bg-[#edecea]/30" : "border-[#e0ddd8] bg-white hover:bg-[#edecea]"}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span className="text-xs font-semibold text-[#1c1c14]">{label}</span>
                        {tone === key && <Check className="w-3.5 h-3.5 text-[#5a6e38] ml-auto" />}
                      </div>
                      <p className="text-[11px] text-[#9a9a86] leading-relaxed">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-[#1c1c14]">하루 목표 개수</p>
                  <p className="text-[11px] text-[#9a9a86] mt-0.5">하루에 몇 개를 목표로 할지 정해요.</p>
                </div>
                <div className="flex items-center border border-[#e0ddd8] rounded-lg overflow-hidden bg-[#f7f6f2]">
                  <button type="button" onClick={() => setDailyGoal(p => Math.max(1, p - 1))} className="px-3.5 py-2 text-[#6b6b58] hover:bg-[#edecea] font-bold">−</button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-[#1c1c14]">{dailyGoal}</span>
                  <button type="button" onClick={() => setDailyGoal(p => Math.min(20, p + 1))} className="px-3.5 py-2 text-[#6b6b58] hover:bg-[#edecea] font-bold">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. 할 일 기본 설정 ── */}
          <div className="bg-white border border-[#e0ddd8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
              <div className="w-8 h-8 rounded-lg bg-[#edecea] flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#1c1c14]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1c1c14]">할 일 기본 설정</h3>
                <p className="text-[11px] text-[#9a9a86] mt-0.5">새 할 일을 만들 때 미리 채워질 값이에요.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">기본 분류</label>
                <select value={defaultCategory} onChange={e => setDefaultCategory(e.target.value)} className={selectCls}>
                  <option value="WORK">업무</option>
                  <option value="STUDY">학업</option>
                  <option value="MEETING">미팅</option>
                  <option value="HOBBY">취미</option>
                  <option value="HEALTH">건강</option>
                  <option value="PROJECT">프로젝트</option>
                  <option value="ADMIN">지원</option>
                  <option value="RESEARCH">연구</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">기본 중요도</label>
                  <select value={defaultPriority} onChange={e => setDefaultPriority(e.target.value)} className={selectCls}>
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">기본 보기</label>
                  <select value={defaultView} onChange={e => setDefaultView(e.target.value)} className={selectCls}>
                    <option value="list">목록형</option>
                    <option value="calendar">달력형</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── 저장 버튼 ── */}
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving}
              className="px-6 py-3 bg-[#5a6e38] text-white hover:bg-[#4a5c2e] disabled:bg-[#6b6b58] rounded-xl text-xs font-bold shadow-sm active:scale-97 transition-all flex items-center gap-2">
              {isSaving ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin" /><span>저장 중...</span></>
              ) : (
                <><Save className="w-3.5 h-3.5" /><span>설정 저장</span></>
              )}
            </button>
          </div>
        </form>

        {/* ── 백업 & 초기화 ── */}
        <div className="border-t border-[#e0ddd8] pt-5 space-y-3">
          <p className="text-[11px] text-[#9a9a86]">할 일은 자동 저장돼요. 필요하면 백업하거나 초기화할 수 있어요.</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#5a6e38] text-[#6b6b58] hover:text-[#1c1c14] rounded-lg text-[11px] font-bold transition-all">
              <Download className="w-3.5 h-3.5" /> 백업 내보내기
            </button>
            {showResetConfirm ? (
              <>
                <button type="button" onClick={() => { onLogout(); setShowResetConfirm(false); }}
                  className="px-3 py-1.5 bg-[#c4674a] hover:bg-[#b05a3e] text-white rounded-lg text-[11px] font-bold transition-all">
                  초기화 확인
                </button>
                <button type="button" onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 bg-[#f7f6f2] hover:bg-[#edecea] text-[#6b6b58] rounded-lg text-[11px] font-bold transition-all">
                  취소
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8c0b0] text-[#c4674a] hover:bg-[#f8ede8]/40 rounded-lg text-[11px] font-bold transition-all">
                <RotateCcw className="w-3.5 h-3.5" /> 초기화
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
