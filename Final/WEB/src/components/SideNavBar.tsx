/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewTab } from '../types.ts';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Brain,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Users,
} from 'lucide-react';

interface SideNavBarProps {
  currentTab: ViewTab;
  setTab: (tab: ViewTab) => void;
  onNewTaskClick: () => void;
  onHelpClick: () => void;
  onUpgradeClick: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as ViewTab, label: '홈',       Icon: LayoutDashboard },
  { id: 'todos'     as ViewTab, label: '할 일',    Icon: CheckSquare },
  { id: 'analytics' as ViewTab, label: '분석',     Icon: BarChart3 },
  { id: 'coach'     as ViewTab, label: 'AI 코치',  Icon: Brain },
  { id: 'community' as ViewTab, label: '커뮤니티', Icon: Users },
  { id: 'settings'  as ViewTab, label: '설정',     Icon: Settings },
];

export default function SideNavBar({ currentTab, setTab, onNewTaskClick, onHelpClick }: SideNavBarProps) {
  if (currentTab === 'login' || currentTab === 'onboarding') return null;

  return (
    <aside className="hidden md:flex flex-col h-full w-[224px] shrink-0 bg-[#edecea] rounded-l-lg py-5 px-3.5">

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-1.5 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#5a6e38] flex items-center justify-center shrink-0 shadow-sm">
          <Brain className="w-[19px] h-[19px] text-white" />
        </div>
        <div className="leading-tight">
          <span className="block text-[14px] font-bold text-[#1c1c14] tracking-tight">Adaptive AI</span>
          <span className="block text-[10px] text-[#9a9a86] font-semibold tracking-wide">나의 완수 파트너</span>
        </div>
      </div>

      {/* New task */}
      <button
        onClick={onNewTaskClick}
        className="mb-6 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        새 할 일
      </button>

      {/* Nav */}
      <p className="px-2.5 mb-2 text-[10px] font-bold text-[#9a9a86] uppercase tracking-wider">메뉴</p>
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative w-full flex items-center gap-3 pl-3.5 pr-2.5 py-2.5 rounded-xl text-left text-[13px] transition-all cursor-pointer ${
                active
                  ? 'bg-white text-[#1c1c14] font-semibold shadow-sm'
                  : 'text-[#6b6b58] hover:bg-white/55 hover:text-[#1c1c14]'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-[#5a6e38]" />
              )}
              <Icon className={`w-[17px] h-[17px] shrink-0 transition-colors ${active ? 'text-[#5a6e38]' : 'text-[#9a9a86] group-hover:text-[#6b6b58]'}`} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="h-px bg-[#e0ddd8] my-3" />
      <div className="space-y-1">
        <button
          onClick={onHelpClick}
          className="w-full flex items-center gap-3 pl-3.5 pr-2.5 py-2.5 rounded-xl text-left text-[13px] text-[#6b6b58] hover:bg-white/55 hover:text-[#1c1c14] transition-all cursor-pointer"
        >
          <HelpCircle className="w-[17px] h-[17px] text-[#9a9a86] shrink-0" />
          도움말
        </button>
        <button
          onClick={() => setTab('login')}
          className="w-full flex items-center gap-3 pl-3.5 pr-2.5 py-2.5 rounded-xl text-left text-[13px] text-[#c4674a]/80 hover:bg-[#f8ede8]/70 hover:text-[#c4674a] transition-all cursor-pointer"
        >
          <LogOut className="w-[17px] h-[17px] shrink-0" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
