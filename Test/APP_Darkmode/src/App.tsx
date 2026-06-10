/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, CheckSquare, Brain, Activity, Settings, 
  Bell, LogOut, Menu, ArrowRight, UserCheck 
} from 'lucide-react';

import { AppState, Task, ChatMessage } from './types.ts';
import { getStoredState, saveStoredState, DEFAULT_STATE } from './initialData.ts';

// import modular custom subviews
import LoginView from './components/LoginView.tsx';
import OnboardingView from './components/OnboardingView.tsx';
import HomeView from './components/HomeView.tsx';
import TasksView from './components/TasksView.tsx';
import AICoachView from './components/AICoachView.tsx';
import InsightsView from './components/InsightsView.tsx';
import SettingsView from './components/SettingsView.tsx';

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Load initial persistent state
  useEffect(() => {
    const loadedState = getStoredState();
    setState(loadedState);
  }, []);

  // Sync state with theme selector class additions of document element
  useEffect(() => {
    const isLight = state.settings.theme === 'light';
    if (isLight) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [state.settings.theme]);

  // Helper callback for state modification saves
  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      const merged = { ...prev, ...updates };
      saveStoredState(merged);
      return merged;
    });
  };

  // Helper callback when a prompt is forwarded from any subview to the AI Coach
  const handleSendPromptToCoach = (promptText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-fwd-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...state.chatMessages, userMsg];
    updateState({ chatMessages: updatedMessages });
    setActiveTab('coach');

    // Instantly simulate a typing responder inside the companion view
    setTimeout(() => {
      const aiResponseText = `"${promptText}" 과(와) 아우라 집중 일정 분석 연계를 환영합니다. ${state.user.name} 대표님이 방금 요청하신 목표 사항을 AI 코칭 신경망 엔진에 임베딩 처리 완료했습니다. 이 방향성을 기반으로 오늘 효율성 지수를 15% 가량 끌어올리도록 서포트하겠습니다. 구체적인 추진 상세 일정을 가동해드릴까요?`;
      
      const aiMsg: ChatMessage = {
        id: `msg-ai-fwd-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      
      updateState({ chatMessages: [...updatedMessages, aiMsg] });
    }, 1200);
  };

  // Quick helper to push a standard test notification alert
  const triggerDemoNotification = () => {
    const list = [
      '대표님, 수면 최적화를 위한 호흡 루틴 예약 시간이 되었습니다.',
      '시간 관리 전문 코칭 피드가 새로 업데이트되었습니다.',
      '집중 효율지수가 88% 피크를 감지했습니다.'
    ];
    const picked = list[Math.floor(Math.random() * list.length)] || 'Aura 가동 준비 완료.';
    setNotifications((prev) => [picked, ...prev]);
    setShowNotificationPopup(true);
  };

  const isLight = state.settings.theme === 'light';

  // Auth routing flows
  if (!state.isLoggedIn) {
    return <LoginView state={state} updateState={updateState} />;
  }

  if (!state.completedOnboarding) {
    return <OnboardingView state={state} updateState={updateState} />;
  }

  return (
    <div className={`min-h-screen flex text-[15px] font-sans antialiased transition-colors duration-500 ${
      isLight ? 'bg-[#faf8ff] text-[#131b2e]' : 'bg-[#0b1326] text-[#dae2fd]'
    }`}>
      
      {/* 1. SOLID WEB DESKTOP SIDE BAR NAVIGATION NAVIGATION  */}
      <aside className={`hidden md:flex flex-col w-64 border-r p-6 sticky top-0 h-screen transition-all z-40 ${
        isLight 
          ? 'bg-white border-[#dae2fd] shadow-sm' 
          : 'bg-[#060e20] border-white/5 shadow-2xl shadow-black/30'
      }`}>
        <div className="flex items-center gap-3 mb-10 select-none">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#8b5cf6] to-[#6d3bd7] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#8b5cf6]/20 shrink-0">
            <Brain className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>Aura</h1>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold leading-none">Intelligence Space</p>
          </div>
        </div>

        {/* Sidebar Tabs links */}
        <nav className="flex-grow space-y-2.5">
          {[
            { id: 'home', label: '홈', icon: Home },
            { id: 'tasks', label: '할 일', icon: CheckSquare },
            { id: 'coach', label: 'AI 코치', icon: Brain },
            { id: 'insights', label: '인사이트', icon: Activity },
            { id: 'settings', label: '설정', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${
                  isTabActive
                    ? 'bg-[#8b5cf6] text-white shadow-md shadow-[#8b5cf6]/20'
                    : isLight 
                    ? 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800' 
                    : 'text-neutral-400 hover:bg-[#131b2e]/60 hover:text-[#dae2fd]'
                }`}
              >
                <Icon size={18} className={isTabActive ? 'fill-current/10' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop profile bottom row */}
        <div className="mt-auto space-y-4 pt-6 border-t border-dashed border-neutral-500/10">
          <div 
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-3 px-2 cursor-pointer group hover:opacity-90 max-w-full"
            title="설정 페이지로 이동"
          >
            <img 
              alt="User Avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAVibeDZwp4Bv8tMwJOhoEStCHcWATLgfJHxEqq1NQHNgyq7bhqEjYozvsq36iySTJBS6JGcor1GUcaNKIhsagAmRiTZQOTCNv5jsMVbqsVeUHMtJSVJMct6NkK-bBNsoYf-UG7jbRZnKmkrYLo1wlFzxPkxkqaOVx8o00qhwN3nyqLLOiu0K8C7cWQYCQpIDy2XrhPkNg-MqFFdJaDGeaAU0P-GL1Siz15ggmOp8RE4BcueeERGhsXSZwpttXGpO176X6IjesfnE"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border border-neutral-500/20 shrink-0 group-hover:ring-1 group-hover:ring-[#8b5cf6] duration-200" 
            />
            <div className="overflow-hidden">
              <p className={`text-sm font-bold truncate group-hover:text-[#8b5cf6] duration-200 ${isLight ? 'text-[#131b2e]' : 'text-[#dae2fd]'}`}>
                {state.user.name}
              </p>
              <p className="text-[10px] text-neutral-500 font-semibold truncate leading-none mt-0.5">{state.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT PORT ROUTER */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* TopAppBar header - Web Desktop header and Mobile bar */}
        <header className={`sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b transition-all duration-300 ${
          isLight 
            ? 'bg-white/80 border-[#dae2fd] backdrop-blur-xl' 
            : 'bg-[#0b1326]/80 border-white/5 backdrop-blur-xl'
        }`}>
          {/* Logo representation in mobile */}
          <div className="flex items-center gap-3 md:gap-0">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#8b5cf6] to-[#6d3bd7] rounded-lg flex items-center justify-center text-white shrink-0">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <h1 className={`text-base font-extrabold tracking-tight ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>
                Aura Intelligence
              </h1>
            </div>
            
            {/* Desktop spacer label */}
            <h2 className="hidden md:block text-xs uppercase font-extrabold tracking-wider text-neutral-500">
              Workspace Profile: <span className="text-[#8b5cf6] font-bold">Optimal Node active</span>
            </h2>
          </div>

          {/* Interactive bell actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={triggerDemoNotification}
                className={`p-2 rounded-xl transition-colors shrink-0 ${
                  isLight ? 'text-neutral-500 hover:bg-neutral-100' : 'text-[#cbc3d7] hover:bg-white/5'
                }`}
                title="공식 알림 트리거 데모"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full animate-bounce shrink-0" />
                )}
              </motion.button>
            </div>

            {/* Avatar switcher mapping setting tab */}
            <img 
              onClick={() => setActiveTab('settings')}
              alt="Profile Toggle" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAVibeDZwp4Bv8tMwJOhoEStCHcWATLgfJHxEqq1NQHNgyq7bhqEjYozvsq36iySTJBS6JGcor1GUcaNKIhsagAmRiTZQOTCNv5jsMVbqsVeUHMtJSVJMct6NkK-bBNsoYf-UG7jbRZnKmkrYLo1wlFzxPkxkqaOVx8o00qhwN3nyqLLOiu0K8C7cWQYCQpIDy2XrhPkNg-MqFFdJaDGeaAU0P-GL1Siz15ggmOp8RE4BcueeERGhsXSZwpttXGpO176X6IjesfnE"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-neutral-500/20 cursor-pointer hover:ring-2 hover:ring-[#8b5cf6] shrink-0" 
              title="설정 페이지로 이동"
            />
          </div>
        </header>

        {/* Dynamic subview container renders */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {activeTab === 'home' && (
                <HomeView 
                  state={state} 
                  updateState={updateState} 
                  setActiveTab={setActiveTab}
                  onSendPromptToCoach={handleSendPromptToCoach}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksView 
                  state={state} 
                  updateState={updateState} 
                />
              )}
              {activeTab === 'coach' && (
                <AICoachView 
                  state={state} 
                  updateState={updateState} 
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'insights' && (
                <InsightsView 
                  state={state} 
                  updateState={updateState} 
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsView 
                  state={state} 
                  updateState={updateState} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 3. COHESIVE MOBILE FLOATING BOTTOM TAB NAV BAR NAVIGATION */}
        <nav className={`md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-8 pt-3 border-t transition-all duration-300 shadow-[0_-8px_24px_rgba(0,0,0,0.15)] rounded-t-2xl ${
          isLight 
            ? 'bg-white/95 border-[#cbc3d7]/40 backdrop-blur-2xl' 
            : 'bg-[#0b1326]/95 border-white/5 backdrop-blur-2xl'
        }`}>
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center shrink-0 cursor-pointer ${
              activeTab === 'home' ? 'text-[#8b5cf6] font-bold' : 'text-neutral-500'
            }`}
          >
            <Home size={20} className={activeTab === 'home' ? 'fill-current/10' : ''} />
            <span className="text-[10px] font-semibold mt-1">홈</span>
          </button>

          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center justify-center shrink-0 cursor-pointer ${
              activeTab === 'tasks' ? 'text-[#8b5cf6] font-bold' : 'text-neutral-500'
            }`}
          >
            <CheckSquare size={20} className={activeTab === 'tasks' ? 'fill-current/10' : ''} />
            <span className="text-[10px] font-semibold mt-1">할 일</span>
          </button>

          {/* Central AI psychology custom highlighted button */}
          <div className="relative -top-7 shrink-0 pointer-events-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab('coach')}
              className={`w-15 h-15 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#6d3bd7] shadow-lg shadow-[#8b5cf6]/35 flex items-center justify-center text-white cursor-pointer`}
            >
              <Brain size={24} className="fill-current/10" />
            </motion.button>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[#8b5cf6] whitespace-nowrap font-bold">
              AI 코치
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center shrink-0 cursor-pointer ${
              activeTab === 'insights' ? 'text-[#8b5cf6] font-bold' : 'text-neutral-500'
            }`}
          >
            <Activity size={20} />
            <span className="text-[10px] font-semibold mt-1">인사이트</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center shrink-0 cursor-pointer ${
              activeTab === 'settings' ? 'text-[#8b5cf6] font-bold' : 'text-neutral-500'
            }`}
          >
            <Settings size={20} />
            <span className="text-[10px] font-semibold mt-1">설정</span>
          </button>

        </nav>

        {/* Dynamic Alerts Popup Alert Toasts */}
        <AnimatePresence>
          {showNotificationPopup && notifications.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-18 right-6 z-50 p-4 rounded-xl border max-w-sm w-[calc(100vw-3rem)] shadow-lg ${
                isLight ? 'bg-white border-neutral-200 text-neutral-900 shadow-neutral-200' : 'bg-[#1e263a] border-[#8b5cf6]/30 text-[#dae2fd] shadow-black/80'
              }`}
            >
              <div className="flex gap-2 items-start">
                <span className="text-[#8b5cf6] mt-0.5"><Bell size={16} /></span>
                <div className="flex-1 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1">Aura Live 알림</p>
                  <p className="font-medium text-neutral-500 leading-snug">{notifications[0]}</p>
                </div>
                <button onClick={() => setShowNotificationPopup(false)} className="text-[10px] text-neutral-500 font-bold hover:underline">
                  닫기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
