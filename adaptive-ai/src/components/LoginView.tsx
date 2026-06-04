import React, { useState } from 'react';
import { Mail, Lock, LogIn, Sparkles, MessageSquare, Compass, ShieldAlert } from 'lucide-react';
import { UserProfile, ViewType } from '../types';

interface LoginViewProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function LoginView({ currentView, setView, user, setUser }: LoginViewProps) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('password123');
  const [isDemoTextVisible, setIsDemoTextVisible] = useState(true);

  if (currentView !== 'login') return null;

  const handleActionLogin = (emailAddress?: string) => {
    // If we pass an email, update user state
    const resolvedEmail = emailAddress || email || 'custom@example.com';
    const parts = resolvedEmail.split('@');
    const resolvedName = parts[0] === 'user' ? '홍길동' : parts[0].toUpperCase();
    
    // Update profile state
    setUser(prev => ({
      ...prev,
      email: resolvedEmail,
      name: resolvedName,
    }));

    // If it's the default mock email or a common default, jump directly to dashboard,
    // otherwise if it's a new sign-up, let's guide them through onboarding!
    if (resolvedEmail === 'user@example.com' || resolvedEmail === 'demo@example.com') {
      setView('dashboard');
    } else {
      setView('onboarding');
    }
  };

  const handleSocialSubmit = (provider: string, demoEmail: string) => {
    setUser(prev => ({
      ...prev,
      name: provider === 'Google' ? '김구글 대표님' : provider === 'Kakao' ? '이카카오' : '최네이버',
      email: demoEmail
    }));
    setView('onboarding');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#fcf8ff] text-[#1b1b24] antialiased">
      {/* Left Abstract Visual (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-[#eae6f4] items-center justify-center overflow-hidden h-screen sticky top-0 select-none">
        
        {/* Abstract Background Image with Hotlink */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-65 scale-105 duration-1000 transform hover:scale-100 transition-all"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD90ox5VnPJy8yefysXj9M7p2kSOzABJU8u5MjyWeoJA66jYF8msIdjnoyBBlI1afnMwBQ0c4Gbpaduz9yPUSelX3emkblm5Vi99x__C5kMWoUf7PFyuqAub95en5L7Ia21rbU8op7qABARaBvFLL8wPN2M6ZRWDJHcmbHC3Bjv9N7ZUevlK237B5qvcPR9LQ5QFZbYAjC1GZ-28R0y-qDUPA55SqnwpCwu6ivPz0ozOOfeECOdtPOpSIddfSgnSQn2T98Vb_xv2HjD')"
          }}
        />

        {/* Navy/Indigo Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5]/85 to-[#fcf8ff]/30" />

        {/* Center Floating Core info */}
        <div className="relative z-10 text-center max-w-md px-6 flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-5 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 shadow-xl border border-white/20 animate-bounce duration-3000">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">
            Adaptive AI
          </h2>
          <p className="text-base text-white/90 font-medium leading-relaxed drop-shadow-sm">
            A sophisticated partner in productivity, adapting to your unique workflow.
          </p>
        </div>

        {/* Small aesthetic corner tags */}
        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 tracking-widest uppercase">
          SYS_STATUS: HYPERCONNECTED
        </div>
      </div>

      {/* Right Content Area: Login Screen */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-24 bg-white relative z-10 shadow-2xl min-h-screen">
        <div className="w-full max-w-[400px] mx-auto flex flex-col gap-6">
          
          {/* Mobile Display Logo */}
          <div className="md:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center text-white shadow-md">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-[#3525cd]">Adaptive AI</span>
          </div>

          {/* Heading Greetings */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1b1b24]">
              반가워요! 다시 시작해볼까요?
            </h1>
            <p className="text-sm text-[#464555] font-medium">
              AI와 함께 더 스마트한 습관을 만들어보세요.
            </p>
          </div>

          {/* Dynamic Demo Credentials Info Alert */}
          {isDemoTextVisible && (
            <div className="bg-[#f0ecf9] border border-[#dad7ff] rounded-xl p-3.5 text-xs text-[#3525cd] flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#3525cd]" />
              <div>
                <span className="font-bold">체험 계정 안내:</span> 기본 이메일(<span className="font-mono font-bold">user@example.com</span>)로 로그인하시면 데모 데이터가 가득 찬 대시보드로 바로 순간이동합니다. 새로운 이메일을 입력하시면 온보딩 영역으로 갑니다!
              </div>
            </div>
          )}

          {/* Social Logins */}
          <div className="flex flex-col gap-2.5 mt-2">
            {/* Kakao */}
            <button 
              onClick={() => handleSocialSubmit('Kakao', 'kakao-user@kakao.com')}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] hover:opacity-90 shadow-sm transition-all focus:ring-2 focus:ring-[#FEE500]/50"
              style={{ backgroundColor: '#FEE500', color: '#1b1b24' }}
              type="button"
            >
              <MessageSquare className="w-4 h-4 fill-current text-[#1b1b24]" />
              카카오 로그인
            </button>

            {/* Naver */}
            <button 
              onClick={() => handleSocialSubmit('Naver', 'naver-member@naver.com')}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] hover:opacity-90 shadow-sm transition-all focus:ring-2 focus:ring-[#03C75A]/50"
              style={{ backgroundColor: '#03C75A', color: '#FFFFFF' }}
              type="button"
            >
              <Compass className="w-4 h-4 fill-current text-white animate-spin-slow" />
              네이버 로그인
            </button>

            {/* Google */}
            <button 
              onClick={() => handleSocialSubmit('Google', 'google-lead@gmail.com')}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-white border border-[#c7c4d8] text-[#1b1b24] text-xs font-bold transition-all active:scale-[0.98] hover:bg-[#f5f2ff] hover:border-[#3525cd]/40 shadow-sm focus:ring-2 focus:ring-[#3525cd]/20"
              type="button"
            >
              <LogIn className="w-4 h-4 stroke-[#1b1b24]" />
              Google 로그인
            </button>
          </div>

          {/* Separator Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px bg-[#c7c4d8] flex-1"></div>
            <span className="text-[11px] text-[#777587] font-semibold tracking-wider uppercase">또는 이메일로 계속하기</span>
            <div className="h-px bg-[#c7c4d8] flex-1"></div>
          </div>

          {/* Email Login Form Form Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleActionLogin(); }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#464555] font-semibold ml-1" htmlFor="email-input">
                이메일 주소
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777587]">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  id="email-input"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#fcf8ff] border border-[#c7c4d8] rounded-xl text-sm placeholder-[#777587]/60 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 outline-none transition-all shadow-sm font-medium" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isDemoTextVisible && e.target.value !== 'user@example.com') {
                      // Keep it active or hint
                    }
                  }}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#464555] font-semibold ml-1" htmlFor="pword">
                비밀번호
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777587]">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  id="pword"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#fcf8ff] border border-[#c7c4d8] rounded-xl text-sm placeholder-[#777587]/60 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 outline-none transition-all shadow-sm font-semibold tracking-wider" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#3525cd] text-white font-bold text-sm hover:from-[#3525cd] hover:to-[#4f46e5] active:scale-[0.98] shadow-lg shadow-[#3525cd]/15 transition-all text-center flex justify-center items-center gap-2 cursor-pointer focus:ring-4 focus:ring-[#3525cd]/20"
            >
              로그인
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Assistance Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-6 border-t border-[#eae6f4]">
            <button 
              onClick={() => alert('비밀번호 찾기 코드가 귀하의 임시 데이터 주소로 발송되지 않습니다. 이 시스템은 데모 안전한 모드입니다. "user@example.com"을 사용하시길 적극 권장합니다.')}
              className="text-xs text-[#464555] hover:text-[#3525cd] transition-all font-semibold"
            >
              비밀번호를 잊으셨나요?
            </button>
            <button 
              onClick={() => {
                setUser(prev => ({ ...prev, email: 'newbie@example.com', name: '새도전자' }));
                setView('onboarding');
              }}
              className="text-xs text-[#464555]"
            >
              계정이 없으신가요? <span className="text-[#3525cd] font-bold hover:underline cursor-pointer">회원가입</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
