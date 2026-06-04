import { 
  LayoutDashboard, 
  CheckCircle, 
  LineChart, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus,
  Compass
} from 'lucide-react';
import { ViewType, UserProfile } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserProfile;
  onAddNewTodo: () => void;
}

export default function Sidebar({ currentView, setView, user, onAddNewTodo }: SidebarProps) {
  // If we are in login or onboarding views, do not render standard sidebar.
  if (currentView === 'login' || currentView === 'onboarding') return null;

  const tabs = [
    { id: 'dashboard', label: '대시보드', engLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'todos', label: '할일', engLabel: 'To-dos', icon: CheckCircle },
    { id: 'analytics', label: '분석', engLabel: 'Analytics', icon: LineChart },
    { id: 'coach', label: 'AI코치', engLabel: 'AI Coach', icon: Sparkles },
    { id: 'settings', label: '설정', engLabel: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 left-0 bg-white border-r border-[#E5E7EB] py-6 px-4 shrink-0 transition-all duration-300">
        {/* Header Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center shrink-0 shadow-md">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#1b1b24]">Adaptive AI</h1>
            <p className="text-[11px] text-[#464555] font-medium">Productivity Partner</p>
          </div>
        </div>

        {/* CTA "New Goal" Button */}
        <button 
          onClick={onAddNewTodo}
          className="mb-8 w-full bg-[#3525cd] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#4f46e5] transition-all duration-200 text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>

        {/* Main Tabs Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as ViewType)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-left text-sm font-medium ${
                  isActive
                    ? 'bg-[#f0ecf9] text-[#3525cd] font-bold scale-[1.02]'
                    : 'text-[#464555] hover:bg-[#f5f2ff] hover:text-[#3525cd] active:scale-95'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'stroke-[#3525cd]' : 'stroke-[#464555]'}`} />
                <span>{tab.engLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation Tabs */}
        <div className="mt-auto flex flex-col gap-1.5 pt-4 border-t border-[#E5E7EB]">
          <button 
            onClick={() => alert(`도움말 지원 센터 준비 중입니다.\nAdaptive AI는 ‘설정 > AI 파트너 설정’ 등을 통해 더 긴밀히 조율할 수 있습니다.`)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#464555] hover:bg-[#f5f2ff] hover:text-[#3525cd] transition-all text-sm font-medium text-left"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
            <span>Help</span>
          </button>
          <button 
            onClick={() => setView('login')}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all text-sm font-medium text-left"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Visible only on smaller screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#E5E7EB] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] pb-safe-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as ViewType)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-2.5 gap-1 transition-all ${
                  isActive ? 'text-[#3525cd]' : 'text-[#464555]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[#3525cd]' : 'stroke-[#464555]'}`} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
