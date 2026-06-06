import React, { useState } from "react";

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("baejihwan000@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    // Success log trigger to parent
    onLoginSuccess(email);
  };

  const handleSocialClick = (socialName: string) => {
    onLoginSuccess(`${socialName.toLowerCase()}@adaptive.ai`);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col font-sans text-charcoal pb-12 animate-fade-in pt-4">
      {/* Top Header */}
      <header className="w-full flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#455528]" style={{ fontVariationSettings: "'FILL' 0" }}>
            bubble_chart
          </span>
          <h1 className="font-display font-bold text-lg text-[#455528]">Adaptive AI</h1>
        </div>
      </header>

      {/* Main Canvas block */}
      <main className="flex-1 w-full max-w-[360px] mx-auto px-4 pt-6 space-y-6">
        {/* Welcome message section */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-widest text-gray-400 font-extrabold uppercase font-mono pl-0.5">
            플랫폼 인증
          </span>
          <h2 className="font-display font-extrabold text-xl text-charcoal leading-tight">
            워크스페이스 로그인
          </h2>
          <p className="text-[11px] text-gray-400 font-medium">등록된 이메일로 안전하게 로그인하세요.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-xs text-center rounded-lg transition-all ${
              tab === "login"
                ? "bg-white text-charcoal font-bold shadow-sm"
                : "text-gray-400 hover:text-charcoal font-semibold"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-xs text-center rounded-lg transition-all ${
              tab === "signup"
                ? "bg-white text-charcoal font-bold shadow-sm"
                : "text-gray-400 hover:text-charcoal font-semibold"
            }`}
          >
            회원가입
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form container */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 pl-0.5">이메일</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-gray-400 font-bold">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full h-11 pl-10 pr-3 bg-[#f3f4f2] text-xs border-none rounded-xl focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none font-medium transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 pl-0.5">비밀번호</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-gray-400 font-bold">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full h-11 pl-10 pr-10 bg-[#f3f4f2] text-xs border-none rounded-xl focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none font-medium font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#455528] transition-colors p-1"
                title="비밀번호 보이기 토글"
              >
                <span className="material-symbols-outlined text-[16px] font-bold">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#455528] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-sm mt-3"
          >
            <span>{tab === "login" ? "워크스페이스 입장" : "신규 회원 생성 및 입장"}</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </form>

        {/* Separator line */}
        <div className="relative flex py-6 items-center font-sans">
          <div className="flex-grow border-t border-gray-150"></div>
          <span className="flex-shrink mx-4 text-gray-300 font-extrabold text-[10px]">또는 간편로그인</span>
          <div className="flex-grow border-t border-gray-150"></div>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSocialClick("Google")}
            className="flex flex-col items-center justify-center h-12 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors active:scale-95 shadow-sm"
            title="Google 로그인"
          >
            <img
              referrerPolicy="no-referrer"
              alt="Google Icon"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCofibFhG9ERT7wigaIMgveFNVaAA5BHj1shme9Zr7PC8NLq5j-WuqAJm-s93iei8GmKrRUilkOUiF7P-QUESpzJamjwXvG-DgFF_ThTyWyw0fih_tFw0sIvI1vj7UUFPngdXDo7xnRHseyC2eItoFGCsWFFrJTL-aaaHGm26IVtDlMoIXJcdL2dhFovNYVm2DMX-5kevY765VrB5jnIixln_iQkqoK3uVgwXOP1jOMX4ANp168mu14ibgyiE6T3xsZCDPshZOKxVM"
            />
          </button>
          <button
            onClick={() => handleSocialClick("Kakao")}
            className="flex flex-col items-center justify-center h-12 bg-[#FEE500] rounded-xl hover:opacity-95 transition-opacity active:scale-95 shadow-sm"
            title="Kakao 로그인"
          >
            <span className="font-extrabold text-[#191c1b] text-base font-sans leading-none">K</span>
          </button>
          <button
            onClick={() => handleSocialClick("Naver")}
            className="flex flex-col items-center justify-center h-12 bg-[#03C75A] rounded-xl hover:opacity-95 transition-opacity active:scale-95 shadow-sm animate-pulse-slow"
            title="Naver 로그인"
          >
            <span className="font-extrabold text-white text-base font-sans leading-none">N</span>
          </button>
        </div>

        {/* Footer Links option */}
        <div className="flex justify-between mt-6 px-1 text-[11px] font-bold text-gray-400">
          <button type="button" onClick={() => handleSocialClick("Guest")} className="hover:text-[#455528] transition-colors">
            게스트 아이디 접속
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setErrorMsg("");
            }}
            className="text-[#455528] hover:underline"
          >
            회원가입하기
          </button>
        </div>
      </main>

      {/* Embedded footer links row from mockup */}
      <footer className="mt-12 text-center text-[10px] text-gray-300 font-bold space-y-1">
        <p>© Adaptive AI Workspace System Inc.</p>
        <p className="opacity-60">보안 인증 가스 보호 연결 모드 작동 중</p>
      </footer>
    </div>
  );
}
