import React, { useState, useEffect } from "react";
import { Todo, ChatMessage, Post } from "./types";
import Dashboard from "./components/Dashboard";
import TodoList from "./components/TodoList";
import AiCoach from "./components/AiCoach";
import Community from "./components/Community";
import Settings from "./components/Settings";
import Analytics from "./components/Analytics";
import Login from "./components/Login";

const INITIAL_TODOS: Todo[] = [
  {
    id: "init-todo-1",
    title: "주간 성과 보고서 작성 및 검토",
    time: "14:00-16:30",
    category: "WORK",
    completed: true,
  },
  {
    id: "init-todo-2",
    title: "클라이언트 미팅 준비 (A사)",
    time: "16:30-17:30",
    category: "MEETING",
    completed: false,
    aiMemo: "이전 미팅 노트에 따르면 A사는 이번 분기 예산 집행에 대해 보수적인 입장이었습니다. ROI 중심의 설득이 필요합니다.",
  },
  {
    id: "init-todo-3",
    title: "오전 데일리 스크럼 참석",
    time: "10:00-10:15",
    category: "ADMIN",
    completed: false,
    failed: true,
  },
  {
    id: "init-todo-4",
    title: "개발팀 주간 싱크업 미팅",
    time: "14:00-14:30",
    category: "MEETING",
    completed: false,
  },
];

const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "init-chat-1",
    role: "model",
    content: "반가워요, 윤관님! 오늘 꼭 해내고 싶지만 시작하기는 어쩐지 부담스러운 목표가 있으신가요? 마음속에 있는 막연한 생각을 입력해주시면, 아주 실천하기 쉬운 마이크로 일상으로 쪼개드릴게요. 같이 시작해봐요!",
    time: "오전 1:54",
  },
  {
    id: "init-chat-2",
    role: "user",
    content: "내년 마라톤 완주를 위한 훈련 계획을 세우고 싶어. 근데 어디서부터 시작해야 할지 모르겠어.",
    time: "오전 1:55",
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: "init-post-1",
    authorName: "이혜린",
    authorRole: "Google UX 리드",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnkXRWiB27KD8uOvzJEOI_Kf-BAeLhedee3l9sKx81B38GemykmzJuXQScEySWg_OkvKx6uRrXFFGAt7n_RIHNn-_M_E1Iv6uWa0laFYgMeU_gn9MM-CSz3NNBTybe1fBiYqEUHfl6KWpGmIY1op8CJHhV_F2hGW1RAgmm6g7Nba7Goku_JwCNOcID_g6v1GI3sEGKesP2-c7k2Ggvy9MdXHeGXmLS79SvrkE8DttvVLMePW5Vbd-gmUAKYAQq5kYI7cGPTwLPk-A",
    content: "어제 완료한 To-Do 목록과 함께 성공률 60% 달성! 15분 단위로 쪼개도 집중력을 끝까지 유지하기란 쉽지 않네요. 그래도 무리한 과제들은 다음으로 넘겨서 번아웃은 막았습니다. 다들 이번 주도 무리하지 말고 화이팅입니다!",
    timeString: "2시간 전",
    likes: 18,
    comments: 2,
    imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCozWhpHdXdkJ4c4KNKD1P7CFydn7cRZin4XdLKRIZCEKLRbWR1gxCO-i8kcryrToBqDOUDPo6_JY6h-gKQwAtVkyirh48llx8zE0CUrp4Q7x6pXKkFiH0OeJ2nLYWAlvrMeY6b9RvGPYGSGM6QpCqpSWA5tfCJzXHyiBJG9sNgtonKNRTdN1ijTs_KHqXghEKDc8kY2wgK4Ef3JYZezis5Gc5EkNnjcBT2BpXyXD_cSdM8z875Wdj8EunxjqvaJvoWyrB3LAHMCHw",
  },
  {
    id: "init-post-2",
    authorName: "김완수",
    authorRole: "인하우스 개발자",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw2C55oW8J1d5h8W7XstztrPGIH4H4MDYS_ZgzdYg9pO0-18a_z9WHVCwhIdYcc1Kms2_8JEA7gjgWYDuipuTIL9Qwpul5BRJbA11Zio3ctG1xrZoz952G1jS5IxNbPC4JWesUKV4gUa6EbqD_GcC3gsG6XzAH6mwyLCvKt3SZeOQDOglNYtykMWwm5G9-JNl5olCGPmreXJSB1xLFzJ2JTwcswnpYV9YzUbF0wC_z4SivQWHMeAlaOajAd3V88RFryXkqHGERiJQ",
    content: "To-Do 성공률 60%라니 저보다 높으시네요! 꼼꼼한 관리 자극 받고 갑니다. 제 루틴도 한번 봐주세요.",
    timeString: "1시간 전",
    likes: 5,
    comments: 0,
    sharedRoutine: {
      title: "모닝 루틴 공유",
      text: "집중력 향상을 위한 명상 & 데일리 리포트 (10분)",
    },
  },
];

const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB05UQzOLGLQXIto0SA7DR8P0y8FKNh3p6LfP9Dq0kbO1qHVFVMYZpVD4YfP82NRHuzZ_jKm7cJE8N7JqZHCaXlE-_13eSieMzayEL9qcncEmoqeoXzleEnEBBJWLvu_qTJFSIDxBkrwEZGx_GOXr2M0Gc40RbPmwGyNRU2SDxVkEzFK9ZnfmlEYT8UHT_BFb4QmzAbb_hNaQtyvcuSriacpPdpN5uzbYqV-huscyrX1qOO8-Fvxq9iGimosf4FrU_7jKA5HC3p1-Q";

export default function App() {
  // Screens: "home" | "todo" | "coach" | "comm" | "set" | "anal" | "login"
  const [screen, setScreen] = useState<string>(() => {
    return localStorage.getItem("screen") || "home";
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "false" ? false : true; // Default logged in as profile
  });

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "윤관";
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("userEmail") || "baejihwan000@gmail.com";
  });

  const [targetCount, setTargetCount] = useState<number>(() => {
    const saved = localStorage.getItem("targetCount");
    return saved ? parseInt(saved) : 5;
  });

  const [sliceUnit, setSliceUnit] = useState<string>(() => {
    return localStorage.getItem("sliceUnit") || "15분";
  });

  const [coachTone, setCoachTone] = useState<string>(() => {
    return localStorage.getItem("coachTone") || "공감형 코치";
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem("streakDays");
    return saved ? parseInt(saved) : 3;
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : INITIAL_CHAT_HISTORY;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("screen", screen);
  }, [screen]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("userEmail", userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem("targetCount", String(targetCount));
  }, [targetCount]);

  useEffect(() => {
    localStorage.setItem("sliceUnit", sliceUnit);
  }, [sliceUnit]);

  useEffect(() => {
    localStorage.setItem("coachTone", coachTone);
  }, [coachTone]);

  useEffect(() => {
    localStorage.setItem("streakDays", String(streakDays));
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          // If completed goes true, add to stats
          const nextCompleted = !t.completed;
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const addCustomTodo = (title: string, category: string, time: string, aiMemo?: string) => {
    const newTodo: Todo = {
      id: "custom-" + Date.now(),
      title,
      category,
      time,
      completed: false,
      aiMemo: aiMemo ? aiMemo : undefined,
    };
    setTodos([newTodo, ...todos]);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Add the '마케팅 리포트' task on their todo!
  const addMarketingTask = () => {
    const alreadyExists = todos.some((t) => t.title === "마케팅 리포트 작성");
    if (alreadyExists) return;

    const marketingTodo: Todo = {
      id: "marketing-" + Date.now(),
      title: "마케팅 리포트 작성",
      time: "10:00-11:45",
      category: "WORK",
      completed: false,
      aiMemo: "집중 시간대입니다. 번아웃 주의 및 15분 스프린트 타이머를 가습적으로 가동해 보세요.",
    };
    setTodos([marketingTodo, ...todos]);
    setScreen("todo");
  };

  // Chat message helper
  const addMessage = (role: "user" | "model", content: string) => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    const timeStr = `${ampm} ${hours}:${minutes}`;

    const newMessage: ChatMessage = {
      id: "chat-" + Date.now() + "-" + Math.random(),
      role,
      content,
      time: timeStr,
    };
    setChatHistory((prev) => [...prev, newMessage]);
  };

  // Import Todo lists package from Community stories
  const importSharedTodos = (
    sharedList: { text: string; category: string; time: string; memo: string }[]
  ) => {
    const newItems = sharedList.map((item, idx) => ({
      id: "shared-" + Date.now() + "-" + idx,
      title: item.text,
      category: item.category,
      time: item.time,
      completed: false,
      aiMemo: item.memo,
    }));
    setTodos([...newItems, ...todos]);
  };

  const resetAllData = () => {
    setTodos(INITIAL_TODOS);
    setChatHistory(INITIAL_CHAT_HISTORY);
    setUsername("윤관");
    setUserEmail("baejihwan000@gmail.com");
    setTargetCount(5);
    setSliceUnit("15분");
    setCoachTone("공감형 코치");
    setStreakDays(3);
    setScreen("home");
  };

  const onLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setScreen("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setScreen("login");
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#191c1b] pb-20 font-sans flex flex-col items-center">
      {/* Container holding app max-width matching mockup bezel */}
      <div className="w-full max-w-[440px] px-5 flex-1 flex flex-col min-h-screen bg-[#F7F8F6] relative">
        {!isLoggedIn || screen === "login" ? (
          <Login onLoginSuccess={onLoginSuccess} />
        ) : (
          <div className="flex-1 flex flex-col pt-16">
            {/* Standard Bezel Topbar Header */}
            <header className="flex justify-between items-center py-4 w-full max-w-[440px] fixed top-0 left-1/2 -translate-x-1/2 bg-[#F7F8F6]/90 backdrop-blur-md px-5 z-40">
              <div className="flex items-center gap-2">
                <div className="bg-[#455528] p-1.5 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-base">psychology</span>
                </div>
                <h1 className="font-display font-bold text-base text-[#191c1b]">Adaptive AI</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setScreen("anal")}
                  className="p-1 rounded-full hover:bg-[#e1e4d9] transition-colors relative flex"
                  title="성장 리포트 분석"
                >
                  <span className="material-symbols-outlined text-gray-500">trending_up</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("🚨 읽지 않은 2개의 AI 알람 권장 사항이 준비되었습니다:\n\n1. 오전 집중도 최고피크 10-12시\n2. 오후 3시 휴식 권장 알람")}
                  className="p-1 rounded-full hover:bg-[#e1e4d9] transition-colors relative flex"
                  title="알람 목록"
                >
                  <span className="material-symbols-outlined text-gray-500">notifications</span>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                </button>
                <div onClick={() => setScreen("set")} className="relative cursor-pointer" title="설정화면 이동">
                  <img
                    referrerPolicy="no-referrer"
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-[#d7eab0] object-cover"
                    src={USER_AVATAR}
                  />
                  <div className="absolute -top-1 -right-1 bg-[#86361d] px-1 py-0.2 rounded-full border border-white">
                    <span className="font-sans text-[6px] font-bold text-white">PRO</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dynamic Screen Mounting panel */}
            <main className="flex-1 mt-2">
              {screen === "home" && (
                <Dashboard
                  todos={todos}
                  toggleTodo={toggleTodo}
                  setScreen={setScreen}
                  username={username}
                  addMarketingTask={addMarketingTask}
                  streakDays={streakDays}
                />
              )}
              {screen === "todo" && (
                <TodoList
                  todos={todos}
                  toggleTodo={toggleTodo}
                  addCustomTodo={addCustomTodo}
                  deleteTodo={deleteTodo}
                  userAvatar={USER_AVATAR}
                />
              )}
              {screen === "coach" && (
                <AiCoach chatHistory={chatHistory} addMessage={addMessage} />
              )}
              {screen === "comm" && (
                <Community posts={INITIAL_POSTS} todos={todos} importSharedTodos={importSharedTodos} />
              )}
              {screen === "set" && (
                <Settings
                  username={username}
                  setUsername={setUsername}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                  targetCount={targetCount}
                  setTargetCount={setTargetCount}
                  coachTone={coachTone}
                  setCoachTone={setCoachTone}
                  sliceUnit={sliceUnit}
                  setSliceUnit={setSliceUnit}
                  resetAllData={resetAllData}
                  userAvatar={USER_AVATAR}
                />
              )}
              {screen === "anal" && (
                <Analytics todos={todos} setScreen={setScreen} streakDays={streakDays} />
              )}
            </main>

            {/* Premium Dock BottomNavBar */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40 flex justify-around items-center px-4 pb-6 pt-3.5 bg-[#f9faf8]/95 backdrop-blur-md border-t border-gray-200 shadow-lg rounded-t-2xl">
              {/* Home */}
              <button
                onClick={() => setScreen("home")}
                className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${
                  screen === "home"
                    ? "bg-[#e1e4d9] text-[#191c1b] font-bold"
                    : "text-gray-400 hover:text-charcoal"
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: screen === "home" ? "'FILL' 1" : "'FILL' 0" }}>
                  home
                </span>
                <span className="text-[10px] font-sans mt-1">홈</span>
              </button>

              {/* Tasks */}
              <button
                onClick={() => setScreen("todo")}
                className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${
                  screen === "todo"
                    ? "bg-[#e1e4d9] text-[#191c1b] font-bold"
                    : "text-gray-400 hover:text-charcoal"
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: screen === "todo" ? "'FILL' 1" : "'FILL' 0" }}>
                  check_box
                </span>
                <span className="text-[10px] font-sans mt-1">할 일</span>
              </button>

              {/* AI Coach */}
              <button
                onClick={() => setScreen("coach")}
                className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${
                  screen === "coach"
                    ? "bg-[#e1e4d9] text-[#191c1b] font-bold"
                    : "text-gray-400 hover:text-charcoal"
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: screen === "coach" ? "'FILL' 1" : "'FILL' 0" }}>
                  psychology
                </span>
                <span className="text-[10px] font-sans mt-1">AI 코치</span>
              </button>

              {/* Community */}
              <button
                onClick={() => setScreen("comm")}
                className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${
                  screen === "comm"
                    ? "bg-[#e1e4d9] text-[#191c1b] font-bold"
                    : "text-gray-400 hover:text-charcoal"
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: screen === "comm" ? "'FILL' 1" : "'FILL' 0" }}>
                  group
                </span>
                <span className="text-[10px] font-sans mt-1">커뮤니티</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => setScreen("set")}
                className={`flex flex-col items-center justify-center transition-all px-3 py-1 rounded-xl ${
                  screen === "set"
                    ? "bg-[#e1e4d9] text-[#191c1b] font-bold"
                    : "text-gray-400 hover:text-charcoal"
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: screen === "set" ? "'FILL' 1" : "'FILL' 0" }}>
                  settings
                </span>
                <span className="text-[10px] font-sans mt-1">설정</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
