import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { AppState } from '../types';

interface LoginViewProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export default function LoginView({ state, updateState }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSocialLogin = (provider: string, demoName: string, demoEmail: string) => {
    updateState({
      isLoggedIn: true,
      user: {
        name: demoName,
        email: demoEmail,
        profilePic: provider === 'Google'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
          : provider === 'Kakao'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'
      }
    });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (!email.includes('@')) {
      setError('올바른 이메일 형식을 입력해 주세요.');
      return;
    }
    setError('');
    updateState({
      isLoggedIn: true,
      user: {
        ...state.user,
        email: email,
        name: email.split('@')[0] || state.user.name
      }
    });
  };

  const isLight = state.settings.theme === 'light';

  return (
    <div className={`w-full min-h-screen py-12 px-6 flex items-center justify-center transition-colors duration-500 ${isLight ? 'bg-[#faf8ff]' : 'bg-[#0b1326]'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`max-w-md w-full rounded-[32px] p-8 space-y-8 relative overflow-hidden shadow-2xl border ${
          isLight 
            ? 'bg-white/80 backdrop-blur-xl border-[#dae2fd]/30 shadow-[#6d3bd7]/5' 
            : 'bg-[#131b2e]/60 backdrop-blur-xl border-white/5 shadow-black/40'
        }`}
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-[#8b5cf6]/5 to-transparent filter blur-2xl" />

        <div className="flex flex-col items-center space-y-4 relative z-10 text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 bg-gradient-to-br from-[#8b5cf6] to-[#d0bcff] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30"
          >
            <Brain className="text-white w-10 h-10" />
          </motion.div>
          <div>
            <h1 className={`font-semibold text-3xl tracking-tight transition-colors duration-300 ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>
              Aura Intelligence
            </h1>
            <p className={`text-sm mt-1.5 transition-colors duration-300 ${isLight ? 'text-[#494454]' : 'text-[#cbc3d7]'}`}>
              고도의 몰입을 위한 당신만의 고요한 공간
            </p>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Kakao', '카카오 프렌즈', 'kakao@aura.ai')}
            className="w-full h-14 bg-[#FEE500] text-[#191C1E] rounded-xl flex items-center justify-center space-x-3 font-semibold hover:bg-[#ffeb3b] transition-all cursor-pointer shadow-sm shadow-[#FEE500]/10"
          >
            <span className="font-bold text-xs bg-[#191C1E] text-[#FEE500] w-5 h-5 rounded-full flex items-center justify-center">K</span>
            <span className="text-sm">카카오로 시작하기</span>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Naver', '네이버 파트너', 'naver@aura.ai')}
            className="w-full h-14 bg-[#03C75A] text-white rounded-xl flex items-center justify-center space-x-3 font-semibold hover:bg-[#02b350] transition-all cursor-pointer shadow-sm shadow-[#03C75A]/10"
          >
            <span className="font-extrabold text-xs bg-white text-[#03C75A] w-5 h-5 rounded-full flex items-center justify-center">N</span>
            <span className="text-sm">네이버로 시작하기</span>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Google', 'Google 파트너', 'google@aura.ai')}
            className={`w-full h-14 border rounded-xl flex items-center justify-center space-x-3 font-semibold transition-colors cursor-pointer shadow-sm ${
              isLight 
                ? 'bg-neutral-50 hover:bg-neutral-100 border-[#cbc3d7] text-neutral-800' 
                : 'bg-[#1e263a] hover:bg-[#2d3449] border-[#494454]/40 text-[#dae2fd]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm">Google 계정으로 시작하기</span>
          </motion.button>
        </div>

        <div className="relative flex items-center justify-center z-10">
          <div className={`absolute inset-0 flex items-center ${isLight ? 'border-neutral-200' : 'border-white/5'}`}>
            <div className={`w-full border-t border-dashed ${isLight ? 'border-neutral-300' : 'border-neutral-700/60'}`} />
          </div>
          <span className={`relative px-4 text-xs transition-colors duration-300 ${
            isLight ? 'bg-white text-[#494454]' : 'bg-[#131b2e] text-[#cbc3d7]'
          }`}>
            또는
          </span>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 relative z-10">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className={`text-sm font-medium transition-colors duration-300 ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>이메일</label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'text-neutral-400' : 'text-[#cbc3d7]/60'}`}>
                <Mail size={18} />
              </span>
              <input 
                className={`w-full h-14 pl-12 pr-4 rounded-xl border transition-all placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 ${
                  isLight 
                    ? 'bg-[#f2f3ff] border-[#cbc3d7] text-[#131b2e]' 
                    : 'bg-[#1e263a] border-[#494454]/30 text-[#dae2fd]'
                }`}
                placeholder="example@domain.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-sm font-medium transition-colors duration-300 ${isLight ? 'text-[#131b2e]' : 'text-white'}`}>비밀번호</label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isLight ? 'text-neutral-400' : 'text-[#cbc3d7]/60'}`}>
                <Lock size={18} />
              </span>
              <input 
                className={`w-full h-14 pl-12 pr-4 rounded-xl border transition-all placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 ${
                  isLight 
                    ? 'bg-[#f2f3ff] border-[#cbc3d7] text-[#131b2e]' 
                    : 'bg-[#1e263a] border-[#494454]/30 text-[#dae2fd]'
                }`}
                placeholder="........"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button 
              type="button"
              onClick={() => {
                setEmail('user@example.com');
                setPassword('password123');
              }}
              className="text-[#8b5cf6] hover:text-[#7c3aed] text-xs font-semibold cursor-pointer"
            >
              간편 로그인 양식 작성 (user@example.com)
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] text-white font-semibold text-lg rounded-xl shadow-lg shadow-[#8b5cf6]/25 transition-all hover:brightness-110 cursor-pointer"
          >
            로그인
          </motion.button>
        </form>

        <p className={`text-center text-sm transition-colors duration-300 ${isLight ? 'text-[#494454]' : 'text-[#cbc3d7]'}`}>
          아직 계정이 없으신가요?{' '}
          <button 
            onClick={() => handleSocialLogin('Google', '새 회원님', 'welcome@aura.ai')}
            className="text-[#8b5cf6] font-bold hover:underline cursor-pointer"
          >
            회원가입
          </button>
        </p>
      </motion.div>
    </div>
  );
}
