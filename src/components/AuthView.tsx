/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Brain, MessageCircle, Circle, Mail, Lock, Sparkles } from 'lucide-react';

interface AuthViewProps {
  onLogin: (email: string) => void;
  theme: 'light' | 'dark';
}

export default function AuthView({ onLogin, theme }: AuthViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    } else {
      onLogin("baejihwan000@gmail.com");
    }
  };

  const handleSocialLogin = (provider: string) => {
    onLogin(`${provider.toLowerCase()}@aura.intelligence`);
  };

  const bgStyle = theme === 'dark' ? 'bg-[#0b1326]' : 'bg-slate-50';
  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const cardBg = theme === 'dark' ? 'glass-card-dark' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100';

  return (
    <div className={`min-h-screen ${bgStyle} flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300`}>
      {/* Background Luminal Blows */}
      <div className="absolute top-10 -left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div id="auth-card" className={`w-full max-w-md ${cardBg} rounded-[32px] p-8 space-y-8 relative z-10 transition-transform duration-300`}>
        {/* Header/Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#6b38d4] to-[#8455ef] rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
            <Brain className="text-white w-9 h-9" />
          </div>
          <div className="text-center">
            <h1 className={`font-display text-2xl font-bold tracking-tight ${textPrimary}`}>
              Aura Intelligence
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              고도의 몰입을 위한 당신만의 고요한 공간
            </p>
          </div>
        </div>

        {/* Social Authentication Slabs */}
        <div className="space-y-3">
          {/* Kakao Start */}
          <button
            id="btn-kakao"
            onClick={() => handleSocialLogin('Kakao')}
            className="w-full h-12 bg-[#FEE500] text-[#191C1E] rounded-xl flex items-center justify-center space-x-3 font-medium text-sm hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>카카오로 시작하기</span>
          </button>

          {/* Naver Start */}
          <button
            id="btn-naver"
            onClick={() => handleSocialLogin('Naver')}
            className="w-full h-12 bg-[#03C75A] text-white rounded-xl flex items-center justify-center space-x-3 font-medium text-sm hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          >
            <Circle className="w-5 h-5 fill-current text-white" />
            <span>네이버로 시작하기</span>
          </button>

          {/* Google Start */}
          <button
            id="btn-google"
            onClick={() => handleSocialLogin('Google')}
            className={`w-full h-12 bg-white border border-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center space-x-3 font-medium text-sm hover:bg-slate-50 active:scale-98 transition-all cursor-pointer`}
          >
            <img
              alt="Google logo"
              className="w-5 h-5 object-contain"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnO3UUbTPUDp-TPFtGJIqkDiPQqFJRzr5LKX72ebjqdXC4JMZptlBy16wsGxnykxRqMzMN26gLWqpSYwA5sQvV-13HtyaYr3s_wS_GIXUntx1zhIt4WKeAS_8btW1Cc4owj5ZIhkvFEVEmIVyl7V_1frHHrTtgWgJE7wu2aindKUkQzl5pXh8ulc9PRl3WoOggUjSfuVumX7Umweglqz5syqSOwq6nzL1yMG3YVHXjNo0HxJMgEbVrTgFlHN_Ktolc7vqqHOc3FWQ"
            />
            <span>Google 계정으로 시작하기</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200/60'}`} />
          </div>
          <span className={`relative px-4 text-xs ${theme === 'dark' ? 'bg-[#151d30] text-slate-500' : 'bg-white text-slate-400'}`}>
            또는
          </span>
        </div>

        {/* Login/Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* Email Input */}
            <div className="space-y-1">
              <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} px-1`}>
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className={`w-full h-12 pl-12 pr-4 bg-slate-50/50 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b38d4] focus:bg-white transition-all`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} px-1`}>
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  className={`w-full h-12 pl-12 pr-4 bg-slate-50/50 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b38d4] focus:bg-white transition-all`}
                />
              </div>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex justify-end pr-1">
              <button
                type="button"
                className="text-xs text-[#6b38d4] hover:underline font-semibold cursor-pointer"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}

          {/* Action Trigger */}
          <button
            type="submit"
            className="w-full h-12 bg-[#6b38d4] hover:bg-[#5b2bc4] text-white font-semibold rounded-xl shadow-lg shadow-violet-500/10 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSignUp ? "회원가입 완료" : "로그인"}</span>
          </button>
        </form>

        {/* Footer Toggle Mode */}
        <p className="text-center text-xs text-slate-400 font-medium pb-2">
          {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{' '}
          <button
            id="btn-toggle-auth-mode"
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#6b38d4] hover:underline font-bold cursor-pointer ml-1"
          >
            {isSignUp ? "로그인" : "회원가입"}
          </button>
        </p>
      </div>
    </div>
  );
}
