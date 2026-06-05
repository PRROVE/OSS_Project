/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile, ViewTab } from '../types';
import { Search, Bell, Brain, Sun, Moon } from 'lucide-react';

interface TopAppBarProps {
  user: UserProfile;
  setTab: (tab: ViewTab) => void;
  onQuickSummaryClick: () => void;
  currentTab: ViewTab;
  toggleMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function TopAppBar({
  user,
  setTab,
  currentTab,
  toggleMobileMenu,
  isDarkMode,
  onToggleDarkMode,
}: TopAppBarProps) {
  if (currentTab === 'login' || currentTab === 'onboarding') return null;

  return (
    <header className="shrink-0 w-full bg-[#f7f6f2] border-b border-[#e0ddd8] px-5 py-2.5 flex items-center justify-between">

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
        <div className="relative hidden md:block max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86]" />
          <input
            type="text"
            placeholder="검색..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#edecea] border border-transparent rounded-md text-xs text-[#1c1c14] placeholder-[#9a9a86] focus:outline-none focus:bg-white focus:border-[#e0ddd8] transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('notify', { detail: 'AI Coach가 오늘의 분석을 정리했습니다.' }))}
            className="p-2 rounded-md text-[#9a9a86] hover:text-[#1c1c14] hover:bg-[#e0ddd8] transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#c4674a] rounded-full" />
          </button>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-md text-[#9a9a86] hover:text-[#1c1c14] hover:bg-[#e0ddd8] transition-colors cursor-pointer"
        >
          {isDarkMode
            ? <Sun className="w-4 h-4 text-[#c4674a]" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        <div className="w-px h-5 bg-[#e0ddd8] mx-1" />

        <button
          onClick={() => setTab('coach')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-[#e0ddd8] transition-colors cursor-pointer"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:flex flex-col text-left leading-none">
            <span className="text-[11px] text-[#c4674a] font-semibold tracking-wide uppercase">Pro</span>
            <span className="text-[12px] font-medium text-[#1c1c14]">{user.name}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
