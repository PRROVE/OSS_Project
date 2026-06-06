/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewTab, UserProfile, Task, TaskStatus } from './types';
import { INITIAL_PROFILE, INITIAL_TASKS, INITIAL_INSIGHTS, TODAY_STR } from './data';

import SideNavBar from './components/SideNavBar';
import TopAppBar from './components/TopAppBar';
import LoginView from './components/LoginView';
import OnboardingView from './components/OnboardingView';
import DashboardView from './components/DashboardView';
import TodosView from './components/TodosView';
import AnalyticsView from './components/AnalyticsView';
import CoachView from './components/CoachView';
import CommunityView from './components/CommunityView';
import SettingsView from './components/SettingsView';
import PricingModal from './components/PricingModal';

import { Sparkles, X, Brain, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState<ViewTab>('login');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 전역 토스트 — window.dispatchEvent(new CustomEvent('notify', { detail: 'msg' })) 로 사용
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      setToastMsg(msg);
      setTimeout(() => setToastMsg(null), 3000);
    };
    window.addEventListener('notify', handler);
    return () => window.removeEventListener('notify', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // App state — localStorage 연동으로 새로고침 후에도 유지
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('adaptive_user');
      return saved ? { ...INITIAL_PROFILE, ...JSON.parse(saved) } : INITIAL_PROFILE;
    } catch { return INITIAL_PROFILE; }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('adaptive_tasks');
      const parsed: Task[] = saved ? JSON.parse(saved) : INITIAL_TASKS;
      // status 필드 마이그레이션 — 기존 저장 데이터엔 status가 없을 수 있음
      return parsed.map((t: any) => ({
        ...t,
        status: (t.status ?? (t.completed ? 'done' : 'todo')) as TaskStatus,
      }));
    } catch { return INITIAL_TASKS; }
  });
  const [insights] = useState(INITIAL_INSIGHTS);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);

  // tasks / user 변경 시 즉시 저장
  useEffect(() => {
    localStorage.setItem('adaptive_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const { totalCount, completedCount, successRate, ...saveable } = user;
    localStorage.setItem('adaptive_user', JSON.stringify(saveable));
  }, [user]);

  // UI States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickSummaryOpen, setIsQuickSummaryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Synchronize overall profile metrics when tasks array updates
  useEffect(() => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    
    setUser(prev => ({
      ...prev,
      totalCount,
      completedCount,
      successRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 75
    }));
  }, [tasks]);

  // 체크박스 토글 — 3단계 순환: (진행전/진행중) → 완료 → 실패 → 진행 전
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      if (task.status !== 'done' && !task.failed) {
        // 1번째: 완료(성공)
        return { ...task, status: 'done', completed: true, failed: false };
      } else if (task.status === 'done') {
        // 2번째: 실패
        return { ...task, status: 'todo', completed: false, failed: true };
      } else {
        // 3번째: 진행 전으로 리셋
        return { ...task, status: 'todo', completed: false, failed: false };
      }
    }));
  };

  // 작업 상태 직접 설정 (진행 전 / 진행 중 / 완료)
  const handleSetStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? {
            ...task,
            status,
            completed: status === 'done',
            failed: status === 'done' ? false : task.failed,
          }
        : task
    ));
  };

  const handleImportTasks = (tasksToImport: { title: string }[]) => {
    const newTasks: Task[] = tasksToImport.map((t, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: t.title,
      priority: 'medium',
      category: 'Work',
      date: TODAY_STR,
      completed: false,
      status: 'todo',
      description: '커뮤니티 공유 피드에서 가져온 완수 도전 추천 과업입니다.',
      duration: '30분'
    }));
    setTasks(prev => [...newTasks, ...prev]);
  };

  // 백업 파일에서 할 일 데이터 복원 (status 마이그레이션 포함)
  const handleImportData = (importedTasks: Task[]) => {
    const normalized: Task[] = importedTasks.map((t: any) => ({
      ...t,
      status: (t.status ?? (t.completed ? 'done' : 'todo')) as TaskStatus,
    }));
    setTasks(normalized);
  };

  const handleAddTask = (newTaskFields: Omit<Task, 'id' | 'completed' | 'status'>) => {
    const newTask: Task = {
      ...newTaskFields,
      id: `task-${Date.now()}`,
      completed: false,
      status: 'todo'
    };
    setTasks(prev => [newTask, ...prev]);
    window.dispatchEvent(new CustomEvent('notify', { detail: `'${newTaskFields.title}' 추가되었습니다.` }));
  };

  const handleUpdateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updatedFields } 
        : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    // 등록된 할 일을 목록에서 완전히 제거
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleAddFirstTodoOnboarding = (title: string) => {
    handleAddTask({
      title,
      priority: 'medium',
      category: 'Work',
      date: TODAY_STR,
      timeStart: '09:00',
      description: '온보딩 단계를 통해 생성된 나의 스마트 목표 과업입니다.',
      duration: '1시간'
    });
  };

  const handleNewTaskClick = () => {
    setTab('todos');
    setIsMobileSidebarOpen(false);
    // Slight timeout to let TodosView mount then trigger adding trigger
    setTimeout(() => {
      const btn = document.getElementById('add-new-task-btn') as HTMLButtonElement;
      if (btn) btn.click();
    }, 150);
  };

  const handleSelectTab = (tab: ViewTab) => {
    // 온보딩은 매 로그인마다 표시 (첫 방문 제한 없음)
    setTab(tab);
    setHighlightedTaskId(null);
    setIsMobileSidebarOpen(false);
  };

  const handleOnboardingComplete = (tab: ViewTab) => {
    // 온보딩 완료 플래그 저장
    localStorage.setItem('adaptive_onboarded', 'true');
    setTab(tab);
    setHighlightedTaskId(null);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#e0ddd8] flex items-center justify-center antialiased font-sans">

      {/* 전역 토스트 */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] animate-fadeIn
          bg-[#1c1c14] text-white text-[13px] font-medium px-5 py-2.5 rounded-xl
          shadow-level-2 flex items-center gap-2 whitespace-nowrap pointer-events-none">
          <svg className="w-4 h-4 text-[#a4b878] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toastMsg}
        </div>
      )}
      
      {/* 1. Login Full Screen View */}
      {currentTab === 'login' && (
        <div className="w-full h-full flex items-center justify-center bg-[#f7f6f2]">
          <LoginView
            setTab={handleSelectTab}
            setUserEmail={(email) => setUser(prev => ({ ...prev, email }))}
            userName={user.name}
          />
        </div>
      )}

      {/* 2. Onboarding Stepper Dialog View */}
      {currentTab === 'onboarding' && (
        <div className="w-full h-full flex items-center justify-center bg-[#f7f6f2]">
          <OnboardingView
            setTab={handleOnboardingComplete}
            onAddFirstTodo={handleAddFirstTodoOnboarding}
          />
        </div>
      )}

      {/* 3. Persistent Standard Split view configuration */}
      {currentTab !== 'login' && currentTab !== 'onboarding' && (
        <div className="flex w-full max-w-[1920px] h-full overflow-hidden bg-[#e0ddd8] p-2.5 gap-0 rounded-xl">

          {/* Main Desktop Sidebar */}
          <SideNavBar
            currentTab={currentTab}
            setTab={handleSelectTab}
            onNewTaskClick={handleNewTaskClick}
            onHelpClick={() => setIsHelpOpen(true)}
            onUpgradeClick={() => setIsPricingOpen(true)}
          />

          {/* Collapsible Mobile Responsive Overlay Sidebar */}
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              {/* Back backdrop mask */}
              <div 
                className="absolute inset-0 bg-[#f7f6f2]/40 backdrop-blur-sm"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              
              {/* Slide panel */}
              <div className="relative w-[280px] h-full bg-white flex flex-col p-4 border-r border-[#e0ddd8] animate-slideIn text-left">
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#edecea] text-[#9a9a86]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6 px-2 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1c1c14] to-[#4a5c2e] text-white flex items-center justify-center shadow">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-display text-base font-bold text-[#1c1c14] tracking-tight leading-none">Adaptive AI</h1>
                    <p className="font-mono text-[11px] text-[#9a9a86] mt-1">Productivity Engine</p>
                  </div>
                </div>

                {/* Mobile NAV anchors */}
                <nav className="space-y-1 pt-6 flex-grow">
                  {([
                    { id: 'dashboard', label: '홈', icon: 'dashboard' },
                    { id: 'todos', label: '할 일 목록', icon: 'checklist' },
                    { id: 'analytics', label: '분석', icon: 'analytics' },
                    { id: 'coach', label: 'AI 코치', icon: 'psychology' },
                    { id: 'community', label: '커뮤니티', icon: 'groups' },
                    { id: 'settings', label: '환경설정', icon: 'settings' }
                  ] as const).map((nav) => (
                    <button
                      key={nav.id}
                      onClick={() => handleSelectTab(nav.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        currentTab === nav.id
                          ? 'text-[#1c1c14] font-bold bg-[#5a6e38]/10'
                          : 'text-[#6b6b58] hover:bg-[#edecea]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#9a9a86]">{nav.icon}</span>
                      <span className="text-xs">{nav.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Mobile logout and helpers */}
                <div className="border-t border-[#e0ddd8] pt-4 space-y-2 pb-10">
                  <button
                    onClick={() => { setIsHelpOpen(true); setIsMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[#6b6b58] hover:bg-[#edecea] rounded-lg text-xs font-bold text-left cursor-pointer transition-all"
                  >
                    <HelpCircle className="w-4 h-4 text-[#9a9a86]" />
                    <span>도움말 및 가이드</span>
                  </button>

                  <button
                    onClick={() => handleSelectTab('login')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[#c4674a] hover:bg-[#f8ede8] rounded-lg text-xs font-bold text-left cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Shell Layout Container */}
          <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#f7f6f2] rounded-r-lg">
            
            {/* Top Bar Header */}
            <TopAppBar
              user={user}
              tasks={tasks}
              setTab={handleSelectTab}
              onQuickSummaryClick={() => setIsQuickSummaryOpen(true)}
              currentTab={currentTab}
              toggleMobileMenu={() => setIsMobileSidebarOpen(true)}
              isDarkMode={false}
              onToggleDarkMode={() => { /* No-op: Actual theme change disabled as per user request */ }}
            />

            {/* Scrollable Main Segment Viewport */}
            <div className="flex-grow overflow-hidden flex flex-col">
              {currentTab === 'dashboard' && (
                <DashboardView 
                  user={user} 
                  tasks={tasks} 
                  onToggleTask={handleToggleTask}
                  setTab={handleSelectTab}
                  onAddTaskClick={handleNewTaskClick}
                  onQuickSummaryClick={() => setIsQuickSummaryOpen(true)}
                />
              )}

              {currentTab === 'todos' && (
                <TodosView
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onSetStatus={handleSetStatus}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  highlightedTaskId={highlightedTaskId}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView tasks={tasks} />
              )}

              {currentTab === 'coach' && (
                <CoachView 
                  insights={insights} 
                  tasks={tasks} 
                  userName={user.name}
                  onAddTask={handleAddTask}
                />
              )}

              {currentTab === 'community' && (
                <CommunityView 
                  user={user}
                  tasks={tasks}
                  onImportTasks={handleImportTasks}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  user={user}
                  tasks={tasks}
                  onUpdateUser={(updatedUser) => setUser(updatedUser)}
                  onResetTasks={() => setTasks(INITIAL_TASKS)}
                  onImportTasks={handleImportData}
                />
              )}
            </div>

          </div>

        </div>
      )}

      {/* 4. REAL-TIME AI BRIEFING MODAL ("Quick Summary" Action) */}
      {isQuickSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop mask */}
          <div 
            className="absolute inset-0 bg-[#f7f6f2]/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsQuickSummaryOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-xl w-full max-w-[460px] border border-[#e0ddd8] shadow-level-2 p-6 overflow-hidden animate-pop text-left">
            <div className="absolute right-4 top-4">
              <button 
                onClick={() => setIsQuickSummaryOpen(false)}
                className="p-1 rounded-lg hover:bg-[#edecea] text-[#9a9a86] hover:text-[#6b6b58] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brain icon glowing banner */}
            <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#edecea] text-[#1c1c14] flex items-center justify-center border border-[#e0ddd8]">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1c1c14]">AI 일일 브리핑</h3>
                <span className="text-[11px] text-[#1c1c14] font-bold tracking-wider uppercase">AI 코치 브리핑</span>
              </div>
            </div>

            {/* AI Generated text details in Korean */}
            <div className="space-y-4">
              <p className="text-xs text-[#6b6b58] leading-relaxed font-sans font-medium">
                안녕하세요, <strong>{user.name}</strong>님! 오늘 예정된 총 {tasks.filter(t => t.date === TODAY_STR).length}개의 태스크 중 현재 <strong className="text-[#1c1c14]">{tasks.filter(t => t.date === TODAY_STR && t.completed).length}개</strong>가 체크 성사되어 오늘의 완료율은 약 <span className="text-[#1c1c14] font-bold">{Math.round((tasks.filter(t => t.date === TODAY_STR && t.completed).length / tasks.filter(t => t.date === TODAY_STR).length) * 100) || 0}%</span>를 메우고 있습니다.
              </p>
              
              <div className="bg-[#edecea]/50 rounded-xl border border-[#e0ddd8]/60 p-4 shrink-0 text-xs font-sans text-[#6b6b58] leading-relaxed space-y-2 shadow-sm font-medium">
                <p className="font-bold text-[#1c1c14] flex items-center gap-1">
                  <Sparkles className="w-4.5 h-4.5 text-[#1c1c14]" />
                  <span>오늘의 AI 권장 사항</span>
                </p>
                <p>
                  - 오후 3시에 정기적인 에너지 휴식 벨이 예견됩니다. 약 15분간의 물리적 가동 오프라인(비휴대폰 휴식) 상태를 매칭해 두면 저녁 성과 기획 완료까지의 추진률이 26% 가량 보완됩니다.
                </p>
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="mt-6 pt-4 border-t border-[#e0ddd8] flex justify-end gap-3.5">
              <button 
                onClick={() => { setIsQuickSummaryOpen(false); setTab('coach'); }}
                className="px-4 py-2 bg-[#5a6e38] text-white hover:bg-[#4a5c2e] rounded-xl text-xs font-semibold shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-97 flex items-center gap-1"
              >
                <span>AI Coach 더 상담하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* 5. GORGEOUS HELP & GUIDE CENTER MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop mask */}
          <div 
            className="absolute inset-0 bg-[#f7f6f2]/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsHelpOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-xl w-full max-w-[500px] border border-[#e0ddd8] shadow-level-2 p-6 overflow-hidden animate-pop text-left">
            <div className="absolute right-4 top-4">
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="p-1 rounded-lg hover:bg-[#edecea] text-[#9a9a86] hover:text-[#6b6b58] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Help title glowing banner */}
            <div className="flex items-center gap-3 mb-5 border-b border-[#e0ddd8] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#edecea] text-[#1c1c14] flex items-center justify-center border border-[#e0ddd8]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1c1c14]">도움말 및 가이드 센터</h3>
                <span className="text-[11px] text-[#1c1c14] font-bold tracking-wider uppercase">도움말</span>
              </div>
            </div>

            {/* Help Content Grid */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {/* Core Concept */}
              <div className="bg-[#edecea]/50 border border-[#e0ddd8]/50 rounded-xl p-4.5">
                <h4 className="text-xs font-semibold text-[#1c1c14] flex items-center gap-1.5 mb-1.5 font-display">
                  <Brain className="w-4 h-4 text-[#1c1c14]" />
                  <span>목표 완수 러닝메이트 철학</span>
                </h4>
                <p className="text-[12px] text-[#6b6b58] leading-relaxed font-sans font-medium">
                  우리는 수동적으로 명령만 바라는 AI 비서가 아닙니다. 사용자가 세운 오늘 복잡하거나 거대한 계획을 <strong>실행 가능한 수준으로 쪼개주고, 인지적 에너지 방어 전략을 조율하는 긴밀한 동반자(Partner)</strong>입니다.
                </p>
              </div>

              {/* Feature walk-through */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#9a9a86] uppercase tracking-widest font-mono">주요 모듈 조작 가이드</h4>
                
                <div className="space-y-2.5">
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#1c1c14] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#1c1c14] block">목표 다운사이징 (AI Coach)</span>
                      <p className="text-[11px] text-[#6b6b58] font-medium leading-relaxed font-sans">
                        하기 어려운 무거운 업무가 있다면 AI Coach 탭에서 제안칩을 선택하거나, 생각을 편하게 자유 문장으로 입력하세요. 즉시 착수하기 쉬운 마이크로 3단계로 계획을 세분화해 To-Do 리스트에 전진 탑재해 드립니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#1c1c14] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#1c1c14] block">인지 배터리 관리 (Cognitive Battery)</span>
                      <p className="text-[11px] text-[#6b6b58] font-medium leading-relaxed font-sans">
                        대시보드 상단의 뇌 전두엽 배터리 피로 눈금을 상시 체크하여, 피크 시간 이후 과부하를 막는 '5분 스크린 이완'과 '유휴 타임 배정' 등 가속 윤리를 실천하세요.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#1c1c14] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#1c1c14] block">정밀 흐름 보고서 (Analytics & Tactic)</span>
                      <p className="text-[11px] text-[#6b6b58] font-medium leading-relaxed font-sans">
                        어느 요일, 어느 주기가 취약한지 실시간으로 성향을 추적하고, 우회 전술을 세부 연동해서 장애물과 완벽주의를 가뿐히 우회해 낼 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer contact support */}
              <div className="border-t border-[#e0ddd8] pt-4 text-center">
                <p className="text-[11px] text-[#9a9a86] font-bold font-sans">
                  시스템 건의, 피드백 및 공동 조약 파트너십 제안:
                </p>
                <p className="text-xs font-black text-[#1c1c14] font-mono mt-0.5">
                  support@adaptive.ai
                </p>
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="mt-5 pt-4 border-t border-[#e0ddd8] flex justify-end">
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="px-5 py-2 bg-[#1c1c14] text-white hover:bg-[#2a2a1e] rounded-xl text-xs font-semibold shadow-sm cursor-pointer transition-all active:scale-97"
              >
                확인 및 닫기
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* 5. PREMIUM LEVEL SAAS PRICING MATRIX MODAL */}
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
      />

    </div>
  );
}
