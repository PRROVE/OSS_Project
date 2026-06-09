import React, { useState, useEffect } from "react";
import { 
  Home, 
  CheckSquare, 
  BarChart2, 
  MessageCircle, 
  Users, 
  Settings as SettingsIcon,
  Sparkles,
  ArrowRight
} from "lucide-react";

// Types and default data imports
import { Task, ChatMessage, CommunityFeed, DiagnosisRecord, UserProfile, NotificationSettings, CoachStyleType, CategoryType } from "./types";
import { DEFAULT_TASKS, DEFAULT_FEEDS, DEFAULT_DIAGNOSIS, DEFAULT_PROFILE, DEFAULT_NOTIFICATIONS } from "./data";

// Sub-screen component imports
import ScreenLogin from "./components/ScreenLogin";
import ScreenOnboarding from "./components/ScreenOnboarding";
import ScreenDashboard from "./components/ScreenDashboard";
import ScreenTasks from "./components/ScreenTasks";
import ScreenAnalytics from "./components/ScreenAnalytics";
import ScreenAICoach from "./components/ScreenAICoach";
import ScreenCommunity from "./components/ScreenCommunity";
import ScreenSettings from "./components/ScreenSettings";

export default function App() {
  
  // 1. Session Navigation state
  // "login" | "onboarding" | "dashboard" | "tasks" | "analytics" | "ai-coach" | "community" | "settings"
  const [currentScreen, setCurrentScreen] = useState<string>("login");

  // 2. Core Application state with LocalStorage persistence cache
  const [tasks, setTasks] = useState<Task[]>([]);
  const [feeds, setFeeds] = useState<CommunityFeed[]>([]);
  const [diagnosisRecords, setDiagnosisRecords] = useState<DiagnosisRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [coachStyle, setCoachStyle] = useState<CoachStyleType>("분석형");
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // 3. Load state from localStorage on init
  useEffect(() => {
    const cachedScreen = localStorage.getItem("adaptive_ai_screen");
    const cachedTasks = localStorage.getItem("adaptive_ai_tasks");
    const cachedFeeds = localStorage.getItem("adaptive_ai_feeds");
    const cachedDiag = localStorage.getItem("adaptive_ai_diag");
    const cachedProfile = localStorage.getItem("adaptive_ai_profile");
    const cachedNotif = localStorage.getItem("adaptive_ai_notif");
    const cachedCoachStyle = localStorage.getItem("adaptive_ai_coach_style");
    const cachedChat = localStorage.getItem("adaptive_ai_chat");

    // 화면 상태는 복원하지 않음 — 항상 로그인부터 시작
    
    // Core sets
    setTasks(cachedTasks ? JSON.parse(cachedTasks) : DEFAULT_TASKS);
    setFeeds(cachedFeeds ? JSON.parse(cachedFeeds) : DEFAULT_FEEDS);
    setDiagnosisRecords(cachedDiag ? JSON.parse(cachedDiag) : DEFAULT_DIAGNOSIS);
    
    if (cachedProfile) setProfile(JSON.parse(cachedProfile));
    if (cachedNotif) setNotifications(JSON.parse(cachedNotif));
    if (cachedCoachStyle) setCoachStyle(cachedCoachStyle as CoachStyleType);
    
    // Default chat setup
    if (cachedChat) {
      setChatHistory(JSON.parse(cachedChat));
    } else {
      const defaultChat: ChatMessage[] = [
        {
          id: "welcome-1",
          role: "assistant",
          content: `반갑습니다, ${profile.name}님! 저는 완수의 거대한 파도를 이길 수 있도록 실천 단위를 세부 조정하는 목표 동반 파트너입니다. \n\n기획서 작성이나 마라톤 훈련 등 오늘 어떤 일을 해야 할지 말씀만 해주시면, 뇌에 부담 없는 '15분 마이크로 루틴'으로 가뿐하게 쪼개 드릴게요!`,
          timestamp: "오전 09:00"
        }
      ];
      setChatHistory(defaultChat);
    }
  }, []);

  // 4. Save state changes helpers
  const updateScreen = (screenName: string) => {
    setCurrentScreen(screenName);
    localStorage.setItem("adaptive_ai_screen", screenName);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("adaptive_ai_profile", JSON.stringify(newProfile));
  };

  const handleUpdateNotifications = (newNotif: NotificationSettings) => {
    setNotifications(newNotif);
    localStorage.setItem("adaptive_ai_notif", JSON.stringify(newNotif));
  };

  const handleUpdateCoachStyle = (style: CoachStyleType) => {
    setCoachStyle(style);
    localStorage.setItem("adaptive_ai_coach_style", style);
  };

  // State changes sync helper
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem("adaptive_ai_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (feeds.length > 0) localStorage.setItem("adaptive_ai_feeds", JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    if (chatHistory.length > 0) localStorage.setItem("adaptive_ai_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // 5. App-level Task Handlers
  const handleAddTask = (title: string, category: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      category: category as CategoryType,
      duration: "15분",
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
  };

  const handleAddSubTasks = (subTasks: Array<{ title: string; duration: string; category: CategoryType }>) => {
    const formatted: Task[] = subTasks.map((t, index) => ({
      id: `task-ai-${Date.now()}-${index}`,
      title: t.title,
      duration: t.duration,
      category: t.category,
      completed: false,
      aiTip: "AI: 15분 초집중을 유도하는 쪼개진 태스크입니다.",
      createdAt: new Date().toISOString()
    }));
    
    // Add subtasks and clear other states
    const updated = [...formatted, ...tasks];
    setTasks(updated);
  };

  const handleCompleteTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed, failed: false };
      }
      return t;
    });
    setTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
  };

  const handleUpdateTask = (id: string, fields: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t));
  };

  const handleAddFullTask = (data: {
    title: string;
    category: CategoryType;
    duration?: string;
    dueDateStr?: string;
    timeStr?: string;
    aiTip?: string;
    createdAt?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      category: data.category,
      duration: data.duration || "15분",
      completed: false,
      dueDateStr: data.dueDateStr,
      timeStr: data.timeStr,
      aiTip: data.aiTip,
      createdAt: data.createdAt || new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // 6. Login & Onboarding Completers
  const handleLoginSuccess = (email: string) => {
    handleUpdateProfile({ ...profile, email });
    updateScreen("onboarding");
  };

  const handleCompleteOnboarding = (categories: string[], initialTaskTitle: string) => {
    if (initialTaskTitle.trim()) {
      handleAddTask(initialTaskTitle.trim(), "WORK");
    }
    updateScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setTasks(DEFAULT_TASKS);
    setFeeds(DEFAULT_FEEDS);
    setDiagnosisRecords(DEFAULT_DIAGNOSIS);
    setProfile(DEFAULT_PROFILE);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setCoachStyle("분석형");
    setChatHistory([
      {
        id: "welcome-1",
        role: "assistant",
        content: `반갑습니다, ${DEFAULT_PROFILE.name}님! 오프라인 캐시가 초기화되었습니다. 다시 목표 달성을 안내해 드리겠습니다.`,
        timestamp: "오전 09:00"
      }
    ]);
    updateScreen("login");
  };

  // 7. Community import tasks helper
  const handleImportSharedTasks = (sharedTasks: Array<{ title: string; duration: string; category: CategoryType }>) => {
    handleAddSubTasks(sharedTasks);
  };

  // 8. Render router logic
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "login":
        return <ScreenLogin onLoginSuccess={handleLoginSuccess} profile={profile} />;
      case "onboarding":
        return <ScreenOnboarding onGoBack={() => updateScreen("login")} onCompleteOnboarding={handleCompleteOnboarding} />;
      case "dashboard":
        return (
          <ScreenDashboard
            tasks={tasks}
            profile={profile}
            onNavigateToTab={updateScreen}
            onCompleteTask={handleCompleteTask}
            onAddTask={handleAddTask}
          />
        );
      case "tasks":
        return (
          <ScreenTasks
            tasks={tasks}
            onAddTask={handleAddTask}
            onAddFullTask={handleAddFullTask}
            onAddSubTasks={handleAddSubTasks}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        );
      case "analytics":
        return <ScreenAnalytics tasks={tasks} />;
      case "ai-coach":
        return (
          <ScreenAICoach
            chatHistory={chatHistory}
            onAddChatMessage={(msg) => setChatHistory([...chatHistory, msg])}
            coachStyle={coachStyle}
          />
        );
      case "community":
        return (
          <ScreenCommunity
            feeds={feeds}
            onAddFeed={(feed) => setFeeds([feed, ...feeds])}
            onUpdateFeed={(updatedFeed) => setFeeds(feeds.map(f => f.id === updatedFeed.id ? updatedFeed : f))}
            onImportSharedTasks={handleImportSharedTasks}
            currentTasks={tasks}
          />
        );
      case "settings":
        return (
          <ScreenSettings
            profile={profile}
            notifications={notifications}
            coachStyle={coachStyle}
            onUpdateProfile={handleUpdateProfile}
            onUpdateNotifications={handleUpdateNotifications}
            onUpdateCoachStyle={handleUpdateCoachStyle}
            onLogout={handleLogout}
          />
        );
      default:
        return <ScreenDashboard tasks={tasks} profile={profile} onNavigateToTab={updateScreen} onCompleteTask={handleCompleteTask} onAddTask={handleAddTask} />;
    }
  };

  // Show normal persistent bottom tabbar only when user log in and finish onboarding
  const hasBottomNav = !["login", "onboarding"].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#e0ddd8] flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-[393px] bg-white min-h-screen shadow-level-2 sm:overflow-hidden flex flex-col sm:rounded-2xl border sm:border-[#e0ddd8]">
        
        {/* Render actual main active layout screen */}
        {renderCurrentScreen()}

        {/* Global Bottom Tab Bar */}
        {hasBottomNav && (
          <nav className="fixed bottom-0 sm:absolute left-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#e0ddd8] h-20 flex justify-around items-center px-4 py-2 z-50">
            
            {/* Dashboard Tab */}
            <button 
              type="button"
              onClick={() => updateScreen("dashboard")}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors focus:outline-none ${
                currentScreen === "dashboard" ? "text-[#5a6e38]" : "text-[#9a9a86] hover:text-[#6b6b58]"
              }`}
            >
              <Home className="w-5.5 h-5.5" />
              <span className="text-[9px] font-bold">홈</span>
            </button>

            {/* Tasks list Tab */}
            <button 
              type="button"
              onClick={() => updateScreen("tasks")}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors focus:outline-none ${
                currentScreen === "tasks" ? "text-[#5a6e38]" : "text-[#9a9a86] hover:text-[#6b6b58]"
              }`}
            >
              <CheckSquare className="w-5.5 h-5.5" />
              <span className="text-[9px] font-bold">할 일</span>
            </button>

            {/* Analytics Tab */}
            <button 
              type="button"
              onClick={() => updateScreen("analytics")}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors focus:outline-none ${
                currentScreen === "analytics" ? "text-[#5a6e38]" : "text-[#9a9a86] hover:text-[#6b6b58]"
              }`}
            >
              <BarChart2 className="w-5.5 h-5.5" />
              <span className="text-[9px] font-bold">분석</span>
            </button>

            {/* Coach Tab */}
            <button 
              type="button"
              onClick={() => updateScreen("ai-coach")}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors focus:outline-none ${
                currentScreen === "ai-coach" ? "text-[#5a6e38]" : "text-[#9a9a86] hover:text-[#6b6b58]"
              }`}
            >
              <MessageCircle className="w-5.5 h-5.5" />
              <span className="text-[9px] font-bold">AI 코치</span>
            </button>

            {/* Social Community Tab */}
            <button 
              type="button"
              onClick={() => updateScreen("community")}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors focus:outline-none ${
                currentScreen === "community" ? "text-[#5a6e38]" : "text-[#9a9a86] hover:text-[#6b6b58]"
              }`}
            >
              <Users className="w-5.5 h-5.5" />
              <span className="text-[9px] font-bold">커뮤니티</span>
            </button>

            {/* Settings Tab */}
            <button 
              type="button"
              onClick={() => updateScreen("settings")}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors focus:outline-none ${
                currentScreen === "settings" ? "text-[#5a6e38]" : "text-[#9a9a86] hover:text-[#6b6b58]"
              }`}
            >
              <SettingsIcon className="w-5.5 h-5.5" />
              <span className="text-[9px] font-bold">설정</span>
            </button>

          </nav>
        )}

      </div>
    </div>
  );
}
