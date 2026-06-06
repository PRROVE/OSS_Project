/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Sparkles, Building, Zap, Rocket } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: '스타터 플랜',
      desc: '개인 목표 지향형 생산성 관리 기본 팩',
      priceMonthly: 0,
      priceAnnual: 0,
      icon: Rocket,
      colorClass: 'text-[#6b6b58]',
      bgColor: 'bg-[#f7f6f2]',
      borderColor: 'border-[#e0ddd8]',
      features: [
        '기본 할 일 등록 및 시간 연계',
        '스케줄 기한 초과 자동 실패 트랙커',
        '기본 AI 코칭 피드백 Insight (최대 3회/일)',
        '단일 로컬 기기 데이터 캐싱 동기화'
      ],
      buttonText: '현재 사용 중',
      popular: false
    },
    {
      id: 'pro',
      name: '프로페셔널 AI 플랜',
      desc: '고도화된 인지 제어 학습형 일일 지휘소',
      priceMonthly: 12,
      priceAnnual: 9,
      icon: Zap,
      colorClass: 'text-[#1c1c14]',
      bgColor: 'bg-[#edecea]/20',
      borderColor: 'border-[#e0ddd8]',
      features: [
        'Starter 패키지의 모든 기능 포함',
        '무제한 AI 코칭 제안 및 우선 가동권',
        '에너지 배터리 최적 기상/수면 시간 예측',
        '개인 행동 포기(Aborted) 영구 포트폴리오 레포트',
        '다중 디바이스 실시간 클라우드 백업'
      ],
      buttonText: '프로 업그레이드 전술 기동',
      popular: true
    },
    {
      id: 'enterprise',
      name: '팀 협업 워크스페이스',
      desc: '조직 구성원의 실시간 행동 보호 지휘 연계',
      priceMonthly: 35,
      priceAnnual: 27,
      icon: Building,
      colorClass: 'text-[#2d7a3a]',
      bgColor: 'bg-[#ecf0e4]/10',
      borderColor: 'border-[#c8d4a8]',
      features: [
        'Professional 패키지의 모든 기능 포함',
        'B2B 전용 협업 워크스페이스 공유 채널',
        '멤버별 목표 실패율(Abortion Rate) 관리지표 제공',
        '구글 캘린더 / MS Outlook 양방향 완전 통합',
        '엔터프라이즈 전담 엔지니어 1:1 패스트 트랙'
      ],
      buttonText: '엔터프라이즈 스튜디오 연동',
      popular: false
    }
  ];

  const handleCheckout = (planId: string) => {
    if (planId === 'free') {
      onClose();
      return;
    }
    setLoadingPlan(planId);
    setTimeout(() => {
      setLoadingPlan(null);
      window.dispatchEvent(new CustomEvent('notify', { detail: `${planId === 'free' ? '무료 플랜이' : planId === 'pro' ? 'Pro 플랜이' : 'Enterprise 플랜이'} 활성화되었습니다.` }));
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dynamic blurred mask backdrop */}
      <div 
        className="absolute inset-0 bg-[#f7f6f2]/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Pricing Matrix Container Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-level-2 border border-[#e0ddd8] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Glowing header strip */}
        <div className="h-2 bg-gradient-to-r from-[#1c1c14] via-[#1c1c14] to-[#2d7a3a]" />
        
        {/* Header content */}
        <div className="px-6 pt-8 pb-3 text-center sm:px-12 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-[#edecea] text-[#9a9a86] hover:text-[#6b6b58] transition-colors cursor-pointer border border-[#e0ddd8]"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 bg-[#edecea] text-[#1c1c14] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" />
            <span>프리미엄 요금 라이선스 플랜</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black font-display text-[#9a9a86] tracking-tight">
            개인의 루틴 수립부터 대규모 B2B 협업 설계까지
          </h2>
          <p className="text-sm text-[#6b6b58] max-w-2xl mx-auto mt-2 leading-relaxed">
            행동 실패를 기록하여 재도약의 지표로 계량하는 세계 최초의 목표 고집념 워크스페이스입니다. 
            원하시는 플랜을 자유롭게 구독 체결하여 실행력 가치를 증명해 내세요!
          </p>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center mt-6 gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-[#1c1c14]' : 'text-[#9a9a86]'}`}>월간 결제</span>
            <button 
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6.5 bg-[#5a6e38] rounded-full p-1 transition-colors relative focus:outline-none cursor-pointer"
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full transition-transform shadow-sm transform ${
                billingCycle === 'annual' ? 'translate-x-5.5' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-[#1c1c14]' : 'text-[#9a9a86]'}`}>
              <span>연간 결제</span>
              <span className="bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] text-[11px] font-black px-2 py-0.5 rounded-full">
                25% 전격 공제
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid Segment - overflow-y-auto to safeguard view inside low screens */}
        <div className="p-6 sm:px-12 pb-10 overflow-y-auto flex-grow flex flex-col md:grid md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const IconComponent = p.icon;
            const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;
            const isFree = price === 0;

            return (
              <div 
                key={p.id}
                className={`relative flex flex-col p-6 rounded-2.5xl border transition-all text-left ${
                  p.popular 
                    ? 'border-[#5a6e38] bg-gradient-to-b from-white to-[#1c1c14]/2 shadow-md md:scale-103' 
                    : `${p.borderColor} ${p.bgColor}`
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#1c1c14] to-[#1c1c14] text-white text-[11px] font-black tracking-wider rounded-full uppercase shadow">
                    ★ 가장 인기 있는 플랜
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-white shadow-sm border border-[#e0ddd8] ${p.colorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#9a9a86] tracking-tight font-display">{p.name}</h3>
                    <span className="text-[11px] text-[#9a9a86] font-semibold">{p.desc}</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-[#1c1c14]">$</span>
                    <span className="text-4xl font-black text-[#1c1c14] tracking-tight font-mono">{price}</span>
                    <span className="text-xs text-[#9a9a86] ml-1 font-semibold">/ 월 {billingCycle === 'annual' && '연계'}</span>
                  </div>
                  <p className="text-[11px] text-[#9a9a86] font-semibold mt-1">
                    {isFree ? '종류 제약 없음 상시 무료 가동' : billingCycle === 'annual' ? `연간 $${price * 12} 청구 (정가 대비 25% 공제됨)` : '언제든 위원회 승인 하에 해지 가능'}
                  </p>
                </div>

                {/* Main Feature checkmark bullet lines */}
                <ul className="space-y-3 flex-grow mb-6 pt-2 border-t border-[#e0ddd8]/60">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <Check className={`w-4 h-4 shrink-0 stroke-[3] mt-0.5 ${p.popular ? 'text-[#1c1c14]' : 'text-[#6b6b58]'}`} />
                      <span className="text-[#9a9a86] leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy Trigger CTA */}
                <button
                  type="button"
                  onClick={() => handleCheckout(p.id)}
                  disabled={loadingPlan !== null}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    p.popular
                      ? 'bg-[#5a6e38] text-white hover:bg-[#4a5c2e]'
                      : 'bg-white border border-[#e0ddd8] text-[#1c1c14] hover:bg-[#edecea]'
                  }`}
                >
                  {loadingPlan === p.id ? (
                    <span className="w-4 h-4 border-2 border-[#e0ddd8] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{p.buttonText}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Pricing comparison footer message */}
        <div className="bg-[#f7f6f2] p-4 border-t border-[#e0ddd8] text-center">
          <p className="text-[11px] text-[#9a9a86] font-medium">
            🔒 결제 모듈은 가상 샌드박스로 안전히 보호됩니다. 실제 카드 청구 및 법적 의무는 가동되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
