/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Home, 
  CheckSquare, 
  BrainCircuit, 
  BarChart2, 
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Sparkles,
  Menu
} from 'lucide-react';
import { AppState, TaskItem, AIPartnerConfig, UserProfile, CoachMessage } from './types';

// Extract views
import AuthView from './components/AuthView';
import OnboardingView from './components/OnboardingView';
import HomeView from './components/HomeView';
import TasksView from './components/TasksView';
import CoachView from './components/CoachView';
import InsightsView from './components/InsightsView';
import SettingsView from './components/SettingsView';

const STORAGE_KEY = 'aura_intelligence_app_state';

const DEFAULT_STATE: AppState = {
  profile: {
    name: '홍길동',
    email: 'user@example.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAVibeDZwp4Bv8tMwJOhoEStCHcWATLgfJHxEqq1NQHNgyq7bhqEjYozvsq36iySTJBS6JGcor1GUcaNKIhsagAmRiTZQOTCNv5jsMVbqsVeUHMtJSVJMct6NkK-bBNsoYf-UG7jbRZnKmkrYLo1wlFzxPkxkqaOVx8o00qhwN3nyqLLOiu0K8C7cWQYCQpIDy2XrhPkNg-MqFFdJaDGeaAU0P-GL1Siz15ggmOp8RE4BcueeERGhsXSZwpttXGpO176X6IjesfnE'
  },
  aiPartner: {
    persona: 'logical',
    expertiseAreas: ['프로젝트 기획', '시간 관리'],
    communicationFrequency: 'moderate',
    customInstructions: '대표님이라고 불러주세요. 모든 제안은 3단계 분석 결과를 포함해서 보고해주세요.'
  },
  tasks: [
    {
      id: 'task-1',
      title: '아키텍처 사양 상세화',
      description: '새로운 Aura 뉴럴 엔진 문서 및 노드에 대한 상세 검토...',
      status: 'active',
      progress: 75,
      durationMinutes: 45,
      priority: 'high',
      category: '프로젝트 기획'
    },
    {
      id: 'task-2',
      title: 'UI 모션 경로 검토',
      description: '대시보드의 글래스모피즘 블러 전환 효과에 대해 모션 팀과 협의하세요.',
      status: 'upcoming',
      progress: 0,
      durationMinutes: 80,
      priority: 'medium',
      category: '디자인'
    },
    {
      id: 'task-3',
      title: 'Aura와 아침 동기화',
      description: '오전 9:15에 완료한 아우라 동기화 정보',
      status: 'completed',
      progress: 100,
      durationMinutes: 15,
      priority: 'medium',
      category: '프로젝트 기획'
    },
    {
      id: 'task-4',
      title: '데이터 노드 정리',
      description: '아우라 인프라 데이터 노드 정렬',
      status: 'upcoming',
      progress: 30,
      durationMinutes: 30,
      priority: 'low',
      category: '데이터 분석'
    }
  ],
  chatHistory: [],
  onboarding: {
    categories: [],
    isOnboarded: false
  },
  theme: 'light'
};

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // 1. Initial State Load
  useEffect(() => {
    try {
      const persisted = localStorage.getItem(STORAGE_KEY);
      const isAuth = localStorage.getItem('aura_is_logged_in');
      
      if (persisted) {
        const parsed = JSON.parse(persisted);
        setState(parsed);
        // Apply theme correctly on start
        if (parsed.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      if (isAuth === 'true') {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Failed to load local storage state:", err);
    }
  }, []);

  // Helper to persist state
  const saveState = (updatedState: AppState) => {
    setState(updatedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
  };

  // 2. Authentication triggers
  const handleLogin = (email: string) => {
    const updated = {
      ...state,
      profile: {
        ...state.profile,
        email
      }
    };
    saveState(updated);
    setIsLoggedIn(true);
    localStorage.setItem('aura_is_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('aura_is_logged_in');
    // Keep configurations but send out of main tabs
    setActiveTab('home');
  };

  // 3. Onboarding completion
  const handleOnboardingComplete = (categories: string[]) => {
    const updated = {
      ...state,
      onboarding: {
        categories,
        isOnboarded: true
      }
    };
    saveState(updated);
  };

  // 4. Tasks manipulations
  const handleAddTask = (task: TaskItem) => {
    const updated = {
      ...state,
      tasks: [task, ...state.tasks]
    };
    saveState(updated);
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    const updated = {
      ...state,
      tasks: state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    };
    saveState(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = {
      ...state,
      tasks: state.tasks.filter(t => t.id !== id)
    };
    saveState(updated);
  };

  // 5. Appended Tasks planner Callback
  const handleGenerateTasks = (generated: TaskItem[], insightText: string) => {
    const initialWelcome: CoachMessage = {
      id: `ai-msg-${Date.now()}-welcome`,
      sender: 'ai',
      text: insightText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = {
      ...state,
      tasks: [...generated, ...state.tasks],
      chatHistory: [...state.chatHistory, initialWelcome]
    };
    saveState(updated);
    setActiveTab('tasks');
  };

  // 6. Virtual Coaching submissions
  const handleSendMessage = async (text: string) => {
    const userMsg: CoachMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const nextHistory = [...state.chatHistory, userMsg];
    const updatedStateWithUser = {
      ...state,
      chatHistory: nextHistory
    };
    saveState(updatedStateWithUser);
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: nextHistory,
          aiConfig: state.aiPartner,
          profileName: state.profile.name
        })
      });

      if (!response.ok) {
        throw new Error("Coaching core unreachable.");
      }

      const data = await response.json();
      const aiMsg: CoachMessage = {
        id: `ai-msg-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      const updatedStateWithAi = {
        ...state,
        chatHistory: [...nextHistory, aiMsg]
      };
      saveState(updatedStateWithAi);
    } catch (error) {
      console.error(error);
      const errorMsg: CoachMessage = {
        id: `ai-msg-err-${Date.now()}`,
        sender: 'ai',
        text: "서버가 오프라인이거나 일시적으로 정지되어 인지 로직 시뮬레이션을 가동했습니다.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      saveState({
        ...state,
        chatHistory: [...nextHistory, errorMsg]
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  // 7. Profile and AI Configuration updates
  const handleUpdateProfile = (profile: UserProfile) => {
    const updated = {
      ...state,
      profile
    };
    saveState(updated);
  };

  const handleUpdateAIConfig = (aiPartner: AIPartnerConfig) => {
    const updated = {
      ...state,
      aiPartner
    };
    saveState(updated);
  };

  // 8. Theme toggler
  const handleChangeTheme = (newTheme: 'light' | 'dark') => {
    const updated = {
      ...state,
      theme: newTheme
    };
    saveState(updated);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 9. CONDITIONAL RENDER SCREEN ROUTING FLOW
  if (!isLoggedIn) {
    return <AuthView onLogin={handleLogin} theme={state.theme} />;
  }

  if (!state.onboarding.isOnboarded) {
    return (
      <OnboardingView 
        onComplete={handleOnboardingComplete} 
        theme={state.theme} 
      />
    );
  }

  // Active view switcher
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            profileName={state.profile.name}
            categories={state.onboarding.categories}
            tasks={state.tasks}
            onGenerateTasks={handleGenerateTasks}
            onNavigateToTab={setActiveTab}
            theme={state.theme}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={state.tasks}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            theme={state.theme}
          />
        );
      case 'coach':
        return (
          <CoachView
            profileName={state.profile.name}
            chatHistory={state.chatHistory}
            onSendMessage={handleSendMessage}
            isAiTyping={isAiTyping}
            aiConfig={state.aiPartner}
            onNavigateToTab={setActiveTab}
            theme={state.theme}
          />
        );
      case 'insights':
        return (
          <InsightsView
            profileName={state.profile.name}
            theme={state.theme}
          />
        );
      case 'settings':
        return (
          <SettingsView
            profile={state.profile}
            aiConfig={state.aiPartner}
            onUpdateProfile={handleUpdateProfile}
            onUpdateAIConfig={handleUpdateAIConfig}
            theme={state.theme}
            onChangeTheme={handleChangeTheme}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  const bgStyle = state.theme === 'dark' ? 'bg-[#0b1326] text-slate-100' : 'bg-[#faf8ff] text-slate-950';
  const sidebarBg = state.theme === 'dark' ? 'bg-[#131b2e] border-slate-800' : 'bg-white border-slate-200/50 shadow-sm';
  const textMuted = state.theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bgStyle} flex transition-colors duration-400`}>
      
      {/* 1. SIDEBAR NAVIGATION - (Web Desktop Viewport Grid) */}
      <aside className={`hidden md:flex flex-col w-64 ${sidebarBg} border-r p-6 sticky top-0 h-screen shrink-0`}>
        {/* Workspace Brand details */}
        <div className="flex items-center gap-3 mb-10 select-none">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#6b38d4] to-[#8455ef] rounded-xl flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">Aura</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Intelligence Partner</p>
          </div>
        </div>

        {/* Tab triggers list exactly matches original list design system */}
        <nav className="flex-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'home' 
                ? 'bg-violet-50 dark:bg-violet-950/40 text-[#8B5CF6]' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'tasks' 
                ? 'bg-violet-50 dark:bg-violet-950/40 text-[#8B5CF6]' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600'
            }`}
          >
            <CheckSquare className="w-5 h-5 shrink-0" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'coach' 
                ? 'bg-violet-50 dark:bg-violet-950/40 text-[#8B5CF6]' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'insights' 
                ? 'bg-violet-50 dark:bg-violet-950/40 text-[#8B5CF6]' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600'
            }`}
          >
            <BarChart2 className="w-5 h-5 shrink-0" />
            <span>Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-violet-50 dark:bg-violet-950/40 text-[#8B5CF6]' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600'
            }`}
          >
            <SettingsIcon className="w-5 h-5 shrink-0" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Floating User quick-profile panel inside bottom sidebar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center gap-3 select-none">
          <img 
            alt="Corporate visual preset profile portrait"
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAVibeDZwp4Bv8tMwJOhoEStCHcWATLgfJHxEqq1NQHNgyq7bhqEjYozvsq36iySTJBS6JGcor1GUcaNKIhsagAmRiTZQOTCNv5jsMVbqsVeUHMtJSVJMct6NkK-bBNsoYf-UG7jbRZnKmkrYLo1wlFzxPkxkqaOVx8o00qhwN3nyqLLOiu0K8C7cWQYCQpIDy2XrhPkNg-MqFFdJaDGeaAU0P-GL1Siz15ggmOp8RE4BcueeERGhsXSZwpttXGpO176X6IjesfnE"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate leading-none mb-1 text-slate-800 dark:text-slate-200">
              {state.profile.name}
            </p>
            <p className="text-[10px] text-slate-450 truncate leading-none">
              {state.profile.email}
            </p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT PORT - (Dynamic Router Container) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobil-Only top apps header branding */}
        <header className="md:hidden flex justify-between items-center px-6 h-16 bg-white/85 dark:bg-[#131b2e]/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 w-full sticky top-0 z-30 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6b38d4] to-[#8455ef] rounded-[10px] flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-base font-extrabold bg-gradient-to-r from-[#6b38d4] to-[#3B82F6] bg-clip-text text-transparent">
              Aura
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 select-none">
              <Bell className="w-5 h-5" />
            </button>
            <img
              alt="Avatar thumbnail"
              className="w-8 h-8 rounded-full border border-slate-100"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPjMkhbGgkrgysb_rhELSAJsiQhdMxdqAceZlffRbRMlpLUOXW8dExcdI_eZPboFeCPq-KrZtmlNAnQlufKWiOz3gFgUeflHbRMYNd12LY92oJw_JfypUVQvf5mvxYwooGhZYkCi4ytdLRAKWzfmjocCn5pSHhEIweQ5fSGzMLR0dlhHqCoZNcUOaNHMT4xtp27ROJ7_Uim8TzALAEfwn0LojROVZsSEDBa0L5Gzpv2uzWt58jokHhWt0G_PWYQX9DqEFBwTHgHDk"
            />
          </div>
        </header>

        {/* Centered Scrollable Core Module Frame */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 pt-6 pb-28 md:pb-12 overflow-y-auto no-scrollbar">
          {renderTabContent()}
        </main>

        {/* 3. MOBILE ONLY BOTTOM NAVIGATION BAR - (Adaptive Mobile Footers) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-4 py-3 bg-white/95 dark:bg-[#131b2e]/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/80 rounded-t-2xl shadow-inner select-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all active:scale-90 duration-150 ${
              activeTab === 'home' ? 'text-[#8B5CF6] font-bold scale-102' : 'text-slate-400'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 font-semibold leading-none">홈</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all active:scale-90 duration-150 ${
              activeTab === 'tasks' ? 'text-[#8B5CF6] font-bold scale-102' : 'text-slate-400'
            }`}
          >
            <CheckSquare className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 font-semibold leading-none">할 일</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`relative -top-3 w-14 h-14 bg-gradient-to-tr from-[#6b38d4] to-[#3b82f6] rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer`}
          >
            <BrainCircuit className="w-6 h-6 animate-pulse" />
            <span className="absolute -bottom-6 text-[10px] font-bold text-[#8B5CF6] leading-none whitespace-nowrap">AI 코치</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all active:scale-90 duration-150 ${
              activeTab === 'insights' ? 'text-[#8B5CF6] font-bold scale-102' : 'text-slate-400'
            }`}
          >
            <BarChart2 className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 font-semibold leading-none font-sans">인사이트</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-all active:scale-90 duration-150 ${
              activeTab === 'settings' ? 'text-[#8B5CF6] font-bold scale-102' : 'text-slate-400'
            }`}
          >
            <SettingsIcon className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-1 font-semibold leading-none">설정</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
