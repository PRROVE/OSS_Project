/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, ViewTab, Task } from '../types';
import { Search, Bell, Sun, Moon, AlertCircle, Clock, X } from 'lucide-react';
import { getDeadlineInfo } from '../data';

interface TopAppBarProps {
  user: UserProfile;
  tasks: Task[];
  setTab: (tab: ViewTab) => void;
  onQuickSummaryClick: () => void;
  currentTab: ViewTab;
  toggleMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function TopAppBar({
  user,
  tasks,
  setTab,
  currentTab,
  toggleMobileMenu,
  isDarkMode,
  onToggleDarkMode,
}: TopAppBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  if (currentTab === 'login' || currentTab === 'onboarding') return null;

  // 실제 할 일 데이터에서 알림 생성 (마감 지남 / 오늘 마감 / 마감 임박)
  const notifItems = tasks
    .filter(t => t.status !== 'done' && !t.failed)
    .map(t => {
      const info = getDeadlineInfo(t.deadline);
      if (!info) return null;
      if (info.overdue) return { id: t.id, title: t.title, label: `마감 지남 · ${info.text}`, tone: 'overdue' as const };
      if (info.text === 'D-DAY') return { id: t.id, title: t.title, label: '오늘 마감', tone: 'today' as const };
      if (info.urgent) return { id: t.id, title: t.title, label: `마감 임박 · ${info.text}`, tone: 'soon' as const };
      return null;
    })
    .filter((x): x is { id: string; title: string; label: string; tone: 'overdue' | 'today' | 'soon' } => x !== null)
    .sort((a, b) => {
      const order = { overdue: 0, today: 1, soon: 2 };
      return order[a.tone] - order[b.tone];
    });

  const hasNotif = notifItems.length > 0;

  return (
    <header className="shrink-0 w-full bg-white px-6 py-3 flex items-center justify-between min-h-[60px] relative z-10 shadow-[0_4px_14px_-8px_rgba(26,26,20,0.15)]">

      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile trigger */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-1.5 rounded hover:bg-[#e0ddd8] text-[#6b6b58] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        {/* Search */}
        <div className="relative hidden md:block max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a86]" />
          <input
            type="text"
            placeholder="할 일·일정 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f7f6f2] border border-[#e0ddd8] rounded-lg text-[13px] text-[#1c1c14] placeholder-[#9a9a86] focus:outline-none focus:bg-white focus:border-[#5a6e38] focus:ring-1 focus:ring-[#5a6e38] transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="p-2.5 rounded-lg text-[#6b6b58] hover:text-[#1c1c14] hover:bg-[#edecea] transition-colors cursor-pointer relative"
            title="알림"
          >
            <Bell className="w-[18px] h-[18px]" />
            {hasNotif && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 bg-[#c4674a] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {notifItems.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              {/* 바깥 클릭 시 닫힘 */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />

              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e0ddd8] rounded-xl shadow-level-2 z-50 overflow-hidden animate-fadeIn text-left">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0ddd8]">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#1c1c14]" />
                    <span className="text-sm font-bold text-[#1c1c14]">알림</span>
                    {hasNotif && (
                      <span className="text-[11px] font-bold text-[#c4674a] bg-[#f8ede8] px-1.5 py-0.5 rounded-full">
                        {notifItems.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-1 rounded-lg hover:bg-[#edecea] text-[#9a9a86] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {!hasNotif ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-xs text-[#9a9a86]">마감 임박하거나 지난 할 일이 없습니다.</p>
                    </div>
                  ) : (
                    notifItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setTab('todos'); setNotifOpen(false); }}
                        className="w-full flex items-start gap-2.5 px-4 py-3 border-b border-[#e0ddd8]/60 hover:bg-[#f7f6f2] transition-colors cursor-pointer text-left"
                      >
                        <span className={`mt-0.5 shrink-0 ${item.tone === 'soon' ? 'text-[#6b6b58]' : 'text-[#c4674a]'}`}>
                          {item.tone === 'overdue'
                            ? <AlertCircle className="w-4 h-4" />
                            : <Clock className="w-4 h-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1c1c14] truncate">{item.title}</p>
                          <p className={`text-[11px] font-bold mt-0.5 ${item.tone === 'soon' ? 'text-[#6b6b58]' : 'text-[#c4674a]'}`}>
                            {item.label}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={() => { setTab('todos'); setNotifOpen(false); }}
                  className="w-full py-2.5 text-[11px] font-bold text-[#5a6e38] hover:bg-[#f7f6f2] transition-colors cursor-pointer border-t border-[#e0ddd8]"
                >
                  할 일 목록에서 모두 보기
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-lg text-[#6b6b58] hover:text-[#1c1c14] hover:bg-[#edecea] transition-colors cursor-pointer"
        >
          {isDarkMode
            ? <Sun className="w-[18px] h-[18px] text-[#c4674a]" />
            : <Moon className="w-[18px] h-[18px]" />
          }
        </button>

        <div className="w-px h-7 bg-[#e0ddd8] mx-2" />

        {/* 프로필 — 표시 전용 (클릭 불가) */}
        <div className="flex items-center gap-2.5 pl-1 pr-1 py-1 select-none">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-[#e0ddd8]"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:flex flex-col text-left leading-tight">
            <span className="text-[10px] text-[#c4674a] font-bold tracking-wider uppercase">Pro</span>
            <span className="text-[13px] font-semibold text-[#1c1c14]">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
