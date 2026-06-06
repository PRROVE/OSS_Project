/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Task } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from './CustomSelect';
import {
  User, Mail, Camera, Upload, Check, Save,
  Sparkles, Brain, Smile, Shield, Bell, Lock,
  Download, RotateCcw,
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  tasks: Task[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onResetTasks: () => void;
  onImportTasks: (tasks: Task[]) => void;
}

const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYdzSVSmYgpM3s4K96TigpLDHQ_ZWXH0Y8Sqbd9jVt6GtwFJR4esPez0b8NQwCxHmMeAKU5aYTWTZ-f_SWh59hseJxZGbIa5864w23eBK0NetoLy1gFj1Y6uEgbJxwC4Vt7e3uVnFbPPDC104As2aSs-3B201E84Xqn-BF8B5qVSa6lecMnTPgmY57bgzPITC-WC8GJkipshsY1sjn9eC-5kTvIXzA5DWZlIv4Ik58NAQLeL9u_UU2eKPCECQHuYEXzBVnSbuhuLA',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
];

const TONES = [
  { key: 'analytic', icon: Brain, color: 'text-[#1c1c14]', label: '분석형', desc: '내 완료율·패턴을 바탕으로 객관적으로 짚어줘요.' },
  { key: 'friendly', icon: Smile, color: 'text-[#2d7a3a]', label: '다정형', desc: '일이 밀려도 따뜻하게 다독여주고 쉬라고 권해요.' },
  { key: 'strict', icon: Shield, color: 'text-[#c4674a]', label: '스파르타형', desc: '미루는 습관을 단호하게 지적하며 밀어붙여요.' },
] as const;

// 토글 스위치
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 cursor-pointer ${checked ? 'bg-[#5a6e38]' : 'bg-[#e0ddd8]'}`}
    >
      <span className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

export default function SettingsView({ user, tasks, onUpdateUser, onResetTasks, onImportTasks }: SettingsViewProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [dailyGoalCount, setDailyGoalCount] = useState(user.dailyGoalCount || 5);
  const [coachTone, setCoachTone] = useState<'friendly' | 'strict' | 'analytic'>(user.coachTone || 'analytic');
  const [gender, setGender] = useState<'male' | 'female' | 'none'>(user.gender || 'none');
  const [phone, setPhone] = useState(user.phone || '');

  // 알림 설정 (localStorage 유지)
  const [notifDeadline, setNotifDeadline] = useState(() => localStorage.getItem('notif_deadline') !== 'false');
  const [notifDaily, setNotifDaily] = useState(() => localStorage.getItem('notif_daily') === 'true');
  const [dailyTime, setDailyTime] = useState(() => localStorage.getItem('notif_daily_time') || '18:00');
  const [notifWeekly, setNotifWeekly] = useState(() => localStorage.getItem('notif_weekly') === 'true');

  // 할 일 기본 설정 (localStorage 유지 → 새 할 일/기본 보기에 실제 적용)
  const [defaultCategory, setDefaultCategory] = useState(() => localStorage.getItem('default_category') || 'Work');
  const [defaultPriority, setDefaultPriority] = useState(() => localStorage.getItem('default_priority') || 'medium');
  const [defaultView, setDefaultView] = useState(() => localStorage.getItem('default_view') || 'list');

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const notify = (msg: string) =>
    window.dispatchEvent(new CustomEvent('notify', { detail: msg }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...user, name, email, avatarUrl, gender, phone, dailyGoalCount, coachTone });
      localStorage.setItem('notif_deadline', String(notifDeadline));
      localStorage.setItem('notif_daily', String(notifDaily));
      localStorage.setItem('notif_daily_time', dailyTime);
      localStorage.setItem('notif_weekly', String(notifWeekly));
      localStorage.setItem('default_category', defaultCategory);
      localStorage.setItem('default_priority', defaultPriority);
      localStorage.setItem('default_view', defaultView);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }, 500);
  };

  const handleResetConfirm = () => {
    onResetTasks();
    setShowResetConfirm(false);
    notify('할 일을 기본 상태로 초기화했어요.');
  };

  // 할 일을 PDF(인쇄 → PDF로 저장) 형식으로 백업
  const handleExportPdf = () => {
    const esc = (s: string) => (s || '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
    const catKor: Record<string, string> = { Work: '업무', Study: '학업', Personal: '개인', Team: '팀플', Meeting: '미팅', Research: '연구', Admin: '지원', Project: '프로젝트', Health: '건강', Other: '기타' };
    const statusKor = (t: Task) => t.failed ? '실패' : t.status === 'done' ? '완료' : t.status === 'inprogress' ? '진행 중' : '진행 전';
    const done = tasks.filter(t => t.completed).length;
    const rows = tasks.map((t, i) => `
      <tr>
        <td class="c">${i + 1}</td>
        <td>${esc(t.title)}</td>
        <td class="c">${catKor[t.category] || t.category}</td>
        <td class="c">${esc(t.date)}</td>
        <td class="c">${esc(t.deadline || '-')}</td>
        <td class="c">${statusKor(t)}</td>
      </tr>`).join('');

    const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>할 일 백업</title>
      <style>
        * { font-family: 'Malgun Gothic','Apple SD Gothic Neo',sans-serif; }
        body { color:#1c1c14; padding:32px; }
        h1 { font-size:20px; margin:0 0 4px; }
        .sub { color:#888; font-size:12px; margin-bottom:20px; }
        .summary { font-size:13px; margin-bottom:16px; }
        table { width:100%; border-collapse:collapse; font-size:12px; }
        th { background:#f0efe9; text-align:left; padding:8px; border-bottom:2px solid #ddd; }
        td { padding:8px; border-bottom:1px solid #eee; }
        .c { text-align:center; }
        @media print { body { padding:0; } }
      </style></head><body>
        <h1>Adaptive To-Do — 할 일 백업</h1>
        <div class="sub">생성일: ${new Date().toLocaleString('ko-KR')} · ${esc(name)}님</div>
        <div class="summary">전체 ${tasks.length}개 · 완료 ${done}개 · 완료율 ${tasks.length ? Math.round(done / tasks.length * 100) : 0}%</div>
        <table>
          <thead><tr><th class="c">#</th><th>할 일</th><th class="c">분류</th><th class="c">예정일</th><th class="c">마감일</th><th class="c">상태</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body></html>`;

    const w = window.open('', '_blank');
    if (!w) { notify('팝업이 차단됐어요. 팝업 허용 후 다시 시도해주세요.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  const inputCls = 'w-full px-3 py-2.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-xs text-[#1c1c14] placeholder-[#9a9a86] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5a6e38] focus:border-[#5a6e38] transition-all font-semibold';

  return (
    <div className="flex-grow overflow-y-auto bg-[#f7f6f2] px-6 py-6 space-y-6 max-w-[1280px] mx-auto w-full pb-24">

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-20 right-6 z-50 bg-[#5a6e38] text-white px-5 py-3.5 rounded-xl shadow-level-2 flex items-center gap-3"
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-white/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold">설정이 저장되었어요</p>
              <p className="text-[11px] text-white/70 mt-0.5">변경한 내용이 바로 적용됐어요.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-[#e0ddd8] pb-5 text-left">
        <h2 className="text-2xl font-bold font-display text-[#1c1c14] tracking-tight">설정</h2>
        <p className="text-[13px] text-[#9a9a86] mt-1">프로필과 앱 사용 환경을 관리하세요.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-left">

        {/* 1. 프로필 */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#edecea] text-[#1c1c14] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">프로필</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">대시보드와 AI 코치에 표시되는 내 정보예요.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#f7f6f2]">
                  <img src={avatarUrl} alt="프로필" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <label htmlFor="avatar-file" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </label>
                </div>
              </div>
              <label htmlFor="avatar-file" className="px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#5a6e38] rounded-lg text-[11px] font-bold text-[#6b6b58] hover:text-[#1c1c14] transition-all flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> 사진 변경
              </label>
              <input id="avatar-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div className="flex gap-1.5">
                {PRESET_AVATARS.map((url, idx) => (
                  <button key={idx} type="button" onClick={() => setAvatarUrl(url)}
                    className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${avatarUrl === url ? 'border-[#5a6e38] scale-110' : 'border-transparent hover:scale-105'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">이름</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">성별</label>
                  <CustomSelect
                    value={gender}
                    onChange={(v) => setGender(v as 'male' | 'female' | 'none')}
                    options={[{ value: 'none', label: '선택 안 함' }, { value: 'male', label: '남성' }, { value: 'female', label: '여성' }]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">전화번호</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86]" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className={`${inputCls} pl-9`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 알림 */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#edecea] text-[#1c1c14] flex items-center justify-center">
              <Bell className="w-4 h-4" />
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
                  <div className="w-28">
                    <CustomSelect
                      value={dailyTime}
                      onChange={setDailyTime}
                      options={['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(t => ({ value: t, label: t }))}
                    />
                  </div>
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

        {/* 3. AI 코치 (페르소나) */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#ecf0e4] text-[#2d7a3a] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">AI 코치</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">코치의 말투와 하루 목표량을 정해요.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-[#1c1c14] mb-2.5">코치 말투</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TONES.map(({ key, icon: Icon, color, label, desc }) => (
                  <button key={key} type="button" onClick={() => setCoachTone(key)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${coachTone === key ? 'border-[#5a6e38] bg-[#edecea]/30' : 'border-[#e0ddd8] bg-white hover:bg-[#edecea]'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-[12px] font-semibold text-[#1c1c14]">{label}</span>
                      {coachTone === key && <Check className="w-3.5 h-3.5 text-[#5a6e38] ml-auto" />}
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
                <button type="button" onClick={() => setDailyGoalCount(p => Math.max(1, p - 1))} className="px-3.5 py-2 text-[#6b6b58] hover:bg-[#edecea] font-bold cursor-pointer">−</button>
                <span className="w-10 text-center text-sm font-bold font-mono text-[#1c1c14]">{dailyGoalCount}</span>
                <button type="button" onClick={() => setDailyGoalCount(p => Math.min(20, p + 1))} className="px-3.5 py-2 text-[#6b6b58] hover:bg-[#edecea] font-bold cursor-pointer">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 할 일 기본 설정 */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#edecea] text-[#1c1c14] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c1c14]">할 일 기본 설정</h3>
              <p className="text-[11px] text-[#9a9a86] mt-0.5">새 할 일을 만들 때 미리 채워질 값과 기본 보기를 정해요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">기본 분류</label>
              <CustomSelect
                value={defaultCategory}
                onChange={setDefaultCategory}
                options={[['Work', '업무'], ['Study', '학업'], ['Personal', '개인'], ['Team', '팀플'], ['Meeting', '미팅'], ['Research', '연구'], ['Project', '프로젝트'], ['Other', '기타']].map(([value, label]) => ({ value, label }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">기본 중요도</label>
              <CustomSelect
                value={defaultPriority}
                onChange={setDefaultPriority}
                options={[{ value: 'high', label: '높음' }, { value: 'medium', label: '중간' }, { value: 'low', label: '낮음' }]}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6b6b58] mb-1.5">기본 보기</label>
              <CustomSelect
                value={defaultView}
                onChange={setDefaultView}
                options={[{ value: 'list', label: '목록형' }, { value: 'calendar', label: '달력형' }]}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-1">
          <button type="submit" disabled={isSaving}
            className="px-6 py-3 bg-[#5a6e38] text-white hover:bg-[#4a5c2e] disabled:bg-[#6b6b58] rounded-xl text-xs font-bold shadow-sm active:scale-97 transition-all flex items-center gap-2 cursor-pointer">
            {isSaving ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin" /><span>저장 중...</span></>
            ) : (
              <><Save className="w-3.5 h-3.5" /><span>설정 저장</span></>
            )}
          </button>
        </div>
      </form>

      {/* 백업 & 초기화 — 부가 기능(하단, 작게) */}
      <div className="border-t border-[#e0ddd8] pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <p className="text-[11px] text-[#9a9a86]">할 일은 자동 저장돼요. 필요하면 PDF로 백업하거나 초기화할 수 있어요.</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e0ddd8] hover:border-[#5a6e38] text-[#6b6b58] hover:text-[#1c1c14] rounded-lg text-[11px] font-bold transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" /> PDF로 백업
          </button>
          {showResetConfirm ? (
            <>
              <button type="button" onClick={handleResetConfirm} className="px-3 py-1.5 bg-[#c4674a] hover:bg-[#b05a3e] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer">초기화</button>
              <button type="button" onClick={() => setShowResetConfirm(false)} className="px-3 py-1.5 bg-[#f7f6f2] hover:bg-[#edecea] text-[#6b6b58] rounded-lg text-[11px] font-bold transition-all cursor-pointer">취소</button>
            </>
          ) : (
            <button type="button" onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8c0b0] text-[#c4674a] hover:bg-[#f8ede8]/40 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" /> 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
