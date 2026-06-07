import React, { useState } from "react";
import { User, Lock, Eye, ArrowRight, Star } from "lucide-react";
import { UserProfile } from "../types";

interface ScreenLoginProps {
  onLoginSuccess: (email: string) => void;
  profile: UserProfile;
}

export default function ScreenLogin({ onLoginSuccess, profile }: ScreenLoginProps) {
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(email);
    }, 800);
  };

  return (
    <div id="login-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen border border-gray-100 shadow-xl rounded-3xl">
      {/* Top Branding Header */}
      <section className="bg-[#3D4A2E] p-8 text-white relative">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#C5E1A5] rounded-xl flex items-center justify-center">
            <span className="text-[#3D4A2E] font-bold text-xs">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Adaptive AI</span>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-6">
          <Star className="w-3.5 h-3.5 text-[#C5E1A5] fill-[#C5E1A5]" />
          <span className="text-[10px] uppercase tracking-widest text-[#C5E1A5] font-semibold">Easy Routine with AI</span>
        </div>
        
        <h1 className="text-2xl font-bold leading-tight mb-4">
          시작은 물론,<br />
          <span className="text-[#C5E1A5]">끝까지 쉽게 완수하도록!</span>
        </h1>
        
        <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
          AI가 할 일의 장애물과 집중 분포를 정렬하여 지치지 않고 완전한 완수까지 페이스를 이끌어 줍니다.
        </p>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 flex items-center justify-center opacity-70">
              <span className="text-xs">◎</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold">끝까지 가는 단계 분해</p>
              <p className="text-[11px] text-gray-400">막막한 일을 15분 단위로 쪼개기</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form Area */}
      <section className="flex-1 bg-white p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
          <p className="text-sm text-gray-400">등록된 이메일로 로그인하세요.</p>
        </div>

        {/* Tab switcher (pure layout feedback) */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button className="flex-1 py-2 text-sm font-semibold bg-white rounded-lg shadow-sm text-gray-900 transition-all duration-200">
            LOGIN
          </button>
          <button className="flex-1 py-2 text-sm font-semibold text-gray-400 transition-all duration-200 hover:text-gray-600">
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F5F1] border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A2E]/20 transition-all placeholder:text-gray-400 text-gray-800"
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5F5F1] border-none rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A2E]/20 transition-all placeholder:text-gray-400 text-gray-800"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3D4A2E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#3D4A2E]/90 active:scale-95 transition-all duration-150 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? "로딩 중..." : "워크스페이스 입장"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Social logins */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-200 w-full absolute"></div>
            <span className="bg-white px-4 text-xs text-gray-400 relative z-10">또는</span>
          </div>

          <div className="flex justify-center gap-4">
            {/* Google */}
            <button
              type="button"
              onClick={() => onLoginSuccess(profile.email)}
              className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            {/* Kakao */}
            <button
              type="button"
              onClick={() => onLoginSuccess("yoon.kakao@example.com")}
              className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <div className="w-5 h-5 bg-[#FEE500] rounded-sm flex items-center justify-center font-black text-[10px] text-[#3c1e1e]">K</div>
            </button>
            {/* Naver */}
            <button
              type="button"
              onClick={() => onLoginSuccess("yoon.naver@example.com")}
              className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <div className="w-5 h-5 bg-[#03C75A] rounded-sm flex items-center justify-center font-black text-[10px] text-white">N</div>
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-between items-center text-xs text-gray-400 font-medium">
          <a href="#" className="hover:text-gray-600 transition-colors">비밀번호 찾기</a>
          <button
            type="button"
            onClick={() => onLoginSuccess(profile.email)}
            className="text-gray-900 font-bold hover:underline"
          >
            회원가입
          </button>
        </div>
      </section>

      {/* Mobile nav indicator bar */}
      <div className="w-full flex justify-center pb-2 pt-4">
        <div className="w-32 h-1 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}
