/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewTab } from '../types.ts';
import { Brain, ArrowRight, Eye, EyeOff, Mail, Lock, Sparkles, Check, Activity } from 'lucide-react';

interface LoginViewProps {
  setTab: (tab: ViewTab) => void;
  setUserEmail: (email: string) => void;
  userName: string;
}

export default function LoginView({ setTab, setUserEmail }: LoginViewProps) {
  const [isLogin, setIsLogin]               = useState(true);
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [errorMessage, setErrorMessage]     = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email)    return setErrorMessage('이메일을 입력해 주세요.');
    if (!password) return setErrorMessage('비밀번호를 입력해 주세요.');
    if (!isLogin && password !== confirmPassword) return setErrorMessage('비밀번호가 일치하지 않습니다.');
    setIsLoading(true);
    setUserEmail(email);
    setTimeout(() => { setIsLoading(false); setTab('onboarding'); }, 850);
  };

  const handleSocial = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setTab('onboarding'); }, 700);
  };

  /* ── shared input class ── */
  const inputCls = "w-full py-2.5 border border-[#e0ddd8] rounded-lg text-[13px] text-[#1c1c14] bg-[#f7f6f2] placeholder-[#9a9a86] focus:outline-none focus:bg-white focus:border-[#5a6e38] focus:ring-1 focus:ring-[#5a6e38] transition-all";

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-5xl bg-white rounded-2xl shadow-level-2 flex flex-col md:flex-row overflow-hidden min-h-[620px]">

        {/* ── LEFT: dark olive panel ── */}
        <section data-keep-color className="hidden md:flex md:w-[42%] flex-col justify-between p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #2c3420 0%, #323a24 55%, #282e1c 100%)' }}>
          {/* subtle radial glow */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />

          {/* brand */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#5a6e38] flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-bold text-white tracking-tight">Adaptive AI</span>
          </div>

          {/* headline */}
          <div className="relative z-10 space-y-6 text-left">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9a9a86] uppercase tracking-widest bg-[#5a6e38]/20 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3" /> Easy Routine With AI
              </span>
              <h2 className="text-[22px] font-bold text-white leading-snug tracking-tight">
                시작은 물론,<br />
                <span style={{ color: '#b4ce8a' }}>끝까지 쉽게 완수하도록!</span>
              </h2>
              <p className="text-[12px] text-[#8a9a72] leading-relaxed max-w-[270px]">
                AI가 할 일의 장애물과 집중 분포를 정렬하여 지치지 않고 완전한 완수까지 페이스를 이끌어 줍니다.
              </p>
            </div>

            {/* pillars */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {[
                { Icon: Sparkles, color: '#9a9a86', bg: 'rgba(255,255,255,0.05)', title: '끝까지 가는 단계 분해', desc: '막막한 일을 15분 단위로 쪼개기' },
                { Icon: Check,    color: '#78c878', bg: 'rgba(40,100,40,0.15)', title: '포기 없는 흐름 유지',  desc: '집중과 휴식 사이 예비 시간 안전 배치' },
                { Icon: Activity, color: '#c8b060', bg: 'rgba(120,90,20,0.15)', title: '지치지 않는 컨디션 조율', desc: '페이스에 맞춰 목표치 유연 변경' },
              ].map(({ Icon, color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-3 group">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: bg, color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white">{title}</p>
                    <p className="text-[11px] text-[#6b6b58] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* foot */}
          <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="text-[11px] text-[#6a7a54]">지침 없이 완벽하게 도달하는 완수</span>
            <span className="text-[11px] font-mono font-semibold text-[#9a9a86] bg-[#5a6e38]/20 px-2 py-0.5 rounded uppercase tracking-wider">Adaptive AI</span>
          </div>
        </section>

        {/* ── RIGHT: form ── */}
        <section className="flex-1 flex flex-col justify-center p-8 sm:p-12 bg-white">
          <div className="max-w-[340px] w-full mx-auto space-y-5">

            {/* mobile brand */}
            <div className="md:hidden text-left">
              <h1 className="text-lg font-bold text-[#1c1c14] flex items-center gap-1.5">
                <Brain className="w-5 h-5" /> Adaptive AI
              </h1>
              <p className="text-[12px] text-[#9a9a86] mt-0.5">목표 완수와 습관 형성의 차세대 시스템</p>
            </div>

            {/* desktop title */}
            <div className="hidden md:block text-left">
              <h2 className="text-[18px] font-bold text-[#1c1c14]">
                {isLogin ? '로그인' : '회원가입'}
              </h2>
              <p className="text-[12px] text-[#9a9a86] mt-1">
                {isLogin ? '등록된 이메일로 로그인하세요.' : '30초면 가입 완료, 바로 시작할 수 있어요.'}
              </p>
            </div>

            {/* tab toggle */}
            <div className="flex p-1 bg-[#edecea] rounded-lg">
              {(['LOGIN', 'SIGN UP'] as const).map((label, i) => {
                const active = (i === 0) === isLogin;
                return (
                  <button key={label} type="button"
                    onClick={() => { setIsLogin(i === 0); setErrorMessage(''); }}
                    className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                      active ? 'bg-white text-[#1c1c14] shadow-sm' : 'text-[#9a9a86] hover:text-[#1c1c14]'
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* form */}
            <form className="flex flex-col gap-3.5 text-left" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="bg-[#fdf2f0] text-[#c4674a] px-3 py-2 rounded-lg text-[12px] border border-[#f5c6c0]">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86]" />
                  <input type="email" placeholder="name@company.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`${inputCls} pl-9 pr-4`} required />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a9a86]" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`${inputCls} pl-9 pr-10`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a86] hover:text-[#6b6b58] cursor-pointer transition-colors">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="flex flex-col gap-1 animate-fadeIn">
                  <label className="text-[11px] font-semibold text-[#9a9a86] uppercase tracking-wider">Confirm Password</label>
                  <input type="password" placeholder="••••••••" value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`${inputCls} px-4`} required={!isLogin} />
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full py-2.5 mt-1 bg-[#5a6e38] hover:bg-[#4a5c2e] text-white rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm">
                {isLoading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>{isLogin ? '워크스페이스 입장' : '시작하기'}</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e0ddd8]" />
              <span className="text-[11px] text-[#9a9a86]">또는</span>
              <div className="flex-1 h-px bg-[#e0ddd8]" />
            </div>

            {/* social */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Google', node: (
                  <span className="w-5 h-5 flex items-center justify-center bg-white border border-[#e0ddd8] rounded-md shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </span>
                )},
                { label: '카카오', node: <span className="w-5 h-5 flex items-center justify-center bg-[#FEE500] text-[#191919] rounded-md font-bold text-[12px] shrink-0">K</span> },
                { label: '네이버', node: <span className="w-5 h-5 flex items-center justify-center bg-[#03C75A] text-white rounded-md font-bold text-[12px] shrink-0">N</span> },
              ].map(({ label, node }) => (
                <button key={label} type="button" onClick={() => handleSocial(label)}
                  className="flex items-center justify-center py-2 border border-[#e0ddd8] hover:border-[#e0ddd8] hover:bg-[#f7f6f2] rounded-lg transition-colors cursor-pointer">
                  {node}
                </button>
              ))}
            </div>

            {/* links */}
            <div className="flex justify-between text-[11px] pt-1">
              <button type="button" className="text-[#9a9a86] hover:text-[#1c1c14] transition-colors cursor-pointer">
                비밀번호 찾기
              </button>
              <button type="button" onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}
                className="text-[#1c1c14] hover:text-[#4a5c2e] font-semibold transition-colors cursor-pointer">
                {isLogin ? '회원가입' : '이미 계정이 있나요?'}
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
