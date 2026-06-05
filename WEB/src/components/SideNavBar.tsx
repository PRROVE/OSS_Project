/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewTab } from '../types';
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
    <aside className="hidden md:flex flex-col h-full w-[210px] shrink-0 bg-[#edecea] rounded-l-lg py-4 px-3">

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 mb-5">
        <div className="w-6 h-6 rounded bg-[#5a6e38] flex items-center justify-center shrink-0">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[13px] font-semibold text-[#1c1c14] tracking-tight">Adaptive AI</span>
      </div>

      {/* New task */}
      <button
        onClick={onNewTaskClick}
        className="mb-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#5a6e38] hover:bg-[#4a5c2e] text-white text-xs font-medium transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        새 할 일
      </button>

      <div className="h-px bg-[#e0ddd8] mb-3" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left text-[13px] transition-colors cursor-pointer ${
                active
                  ? 'bg-[#5a6e38]/12 text-[#1c1c14] font-semibold'
                  : 'text-[#6b6b58] hover:bg-[#e0ddd8] hover:text-[#1c1c14]'
              }`}
            >
              <Icon className={`w-[15px] h-[15px] shrink-0 ${active ? 'text-[#1c1c14]' : 'text-[#9a9a86]'}`} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="h-px bg-[#e0ddd8] mb-3" />
      <div className="space-y-0.5">
        <button
          onClick={onHelpClick}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left text-[13px] text-[#6b6b58] hover:bg-[#e0ddd8] hover:text-[#1c1c14] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-[15px] h-[15px] text-[#9a9a86] shrink-0" />
          도움말
        </button>
        <button
          onClick={() => setTab('login')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left text-[13px] text-[#c4674a]/70 hover:bg-[#f8ede8]/50 hover:text-[#c4674a] transition-colors cursor-pointer"
        >
          <LogOut className="w-[15px] h-[15px] shrink-0" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
