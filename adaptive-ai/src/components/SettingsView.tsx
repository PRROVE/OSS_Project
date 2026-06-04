import React, { useState } from 'react';
import { 
  User, 
  Settings2, 
  Sparkles, 
  Volume2, 
  Palette, 
  BellRing, 
  Save, 
  Check, 
  ShieldCheck,
  Smile,
  Zap,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  currentView: string;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function SettingsView({ currentView, user, setUser }: SettingsViewProps) {
  // Local form states to avoid direct premature mutations
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [customInstruction, setCustomInstruction] = useState(user.customInstruction);
  const [aiPersona, setAiPersona] = useState(user.aiPersona);
  const [aiExpertise, setAiExpertise] = useState<string[]>(user.aiExpertise);
  const [aiFrequency, setAiFrequency] = useState(user.aiFrequency);
  const [notificationsEmail, setNotificationsEmail] = useState(user.notifications.email);
  const [notificationsPush, setNotificationsPush] = useState(user.notifications.push);
  const [theme, setTheme] = useState(user.theme);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  if (currentView !== 'settings') return null;

  const prebuiltAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDhBqXjP7Zs1r0DMoE9Cm6i7-FuUAIVl5Hb2LPZWG7DRxHn6Q-SS6t2hrAGr2nKi-NWsueGpr0o8A0lzHpmyTty4mPrx6Gq54KGN0EpUs1Z7GzFh9W2Nv7I4HVZB61cjIbXQ8_9KjueDFmiP-lE8CmZCm825uSXb-6fr-kytv2f3Ut4tJUU0m94pzV05A7ZYfjIhijJq3aA9Vo2x7o-hAX5vgOox5huJ1SFtZv4dTWHU-oKYE7X8JSGdfxDsZlcgNf03HqRtaWv18ys',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAKd-wRcOlG8NE9YI7t_kewxXHLt5JLKEt92T2tHuuZoffOrkuODzsme9ewucLm8B-qqAs8VuFSV4rE71yQC7UyzgdveUxy2weLqFykFOq3YG_YGnrW5-2mxDDj0cBbxuh3MCtjrtqgzdJteQYF_LBxRLstef35BMb3O--iivYI_rb3ydGqSR6F5-GFDXNEi7tYf2YHbiNHUDk57BLqsGzSKGxccsg7mZsk387QqyIPn466c76NoAomrCXqIATik7R1744Yc2F6axss',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAk_7CpjvnDNuooXX-xkW2bafS9SLa-ra8yhrWBTNyQ08hlEc1jIuoWnsWIZXOAMjHOmIq8F3uNZImlMpeJORON-_mmoJDQiC1Txl1OHGm4lJehcsg5OI6shc91d-3bT1Ygel_X2kR2QzOAv9gwMFmt7nNMBRzMrdMbn8rFHVQAaFRYCHDouVDAQSuTePPxfkjsjRWWgTBJ5A9RJTSLiXAJvU03f03LxqDRpPanUOD0A7kZGWHhfJpZuRp0OkekuH6uoNuOIUxAPvb5',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCuP8SlihaDPrcTJLZx6C5pQWR7t_BQF3HkCePGGP8H95X_Y64cfjoEGymFd-tu-nPVyXimSIb8qh7BofVbwjdg0f6P8hv87E3iRmnt--Qt8i6Ky_ooBsW2WhmkTlO6G318CHU0LXUNOW42rQL92O-DhExt8HOQFwJVJGXQCN4i2Ahgeug6JCU-_34Lv_92iecETM0Hj907iB65z2kYBH4M5hWUV03MYvVxYgxlc5Cvfof-VYfjLqiqaUDqW9ScbysjkgydVrVIMGMZ'
  ];

  const handleToggleExpertise = (tag: string) => {
    setAiExpertise(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFormSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');

    setTimeout(() => {
      setUser({
        name,
        email,
        avatar,
        customInstruction,
        aiPersona,
        aiExpertise,
        aiFrequency,
        notifications: {
          email: notificationsEmail,
          push: notificationsPush
        },
        theme
      });

      setSaveStatus('done');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 8000000000); // Trigger instantly inside short timeout
    
    // Perform instant update for maximum UX responsiveness
    setUser({
      name,
      email,
      avatar,
      customInstruction,
      aiPersona,
      aiExpertise,
      aiFrequency,
      notifications: {
        email: notificationsEmail,
        push: notificationsPush
      },
      theme
    });
    setSaveStatus('done');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB] font-sans">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-6">

        {/* View Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#1b1b24] tracking-tight">개인 환경 및 프로필 설정</h2>
          <p className="text-xs text-[#777587] font-semibold mt-1">
            계정 표시 데이터, 밀착 코칭 파트너의 의사소통 태도, 시스템 알림 규칙을 통합 편집합니다.
          </p>
        </div>

        {/* Form elements container */}
        <form onSubmit={handleFormSave} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Block column: Profile & Theme settings (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            
            {/* 1. Profile block */}
            <fieldset className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col items-center">
              <legend className="sr-only">프로필 설정</legend>
              <div className="relative group mb-6">
                <img 
                  alt="Current Profile avatar photo selector" 
                  className="w-24 h-24 rounded-full border-2 border-[#3525cd]/25 shadow-md object-cover select-none duration-200"
                  src={avatar} 
                />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold pointer-events-none">
                  선택됨
                </div>
              </div>

              {/* Avatar options picker */}
              <div className="w-full mb-6">
                <span className="text-[11px] font-bold text-[#777587] uppercase tracking-wider block text-center mb-2.5">프로필 사진 교체</span>
                <div className="flex justify-center gap-2">
                  {prebuiltAvatars.map((avLink, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(avLink)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${
                        avatar === avLink ? 'border-[#3525cd] ring-2 ring-[#3525cd]/15' : 'border-[#E5E7EB]'
                      }`}
                    >
                      <img src={avLink} alt={`Preset photo option ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & email fields */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" htmlFor="name-input">사용자 이름</label>
                  <input 
                    type="text" 
                    id="name-input"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl focus:border-[#3525cd] outline-none transition-all font-bold text-[#1b1b24]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" htmlFor="email-input">이메일 주소</label>
                  <input 
                    type="email" 
                    id="email-input"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl focus:border-[#3525cd] outline-none transition-all font-bold text-[#1b1b24]"
                  />
                </div>
              </div>
            </fieldset>

            {/* 2. Theme Preferences widget */}
            <fieldset className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
              <legend className="text-[11px] font-bold text-[#777587] uppercase tracking-wider mb-5 flex items-center gap-1.5 ml-0.5">
                <Palette className="w-4 h-4 text-[#3525cd]" />
                테마 외관 설정
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-3 rounded-xl text-xs font-extrabold transition-all border ${
                    theme === 'light' 
                      ? 'bg-white text-[#3525cd] border-2 border-[#3525cd] shadow-sm font-black' 
                      : 'bg-[#F9FAFB] text-[#777587] border-[#E5E7EB] hover:bg-[#eae6f4]/20'
                  }`}
                >
                  ☀️ 라이트 모드 (Default)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    alert('밤 시간 자율보강을 돕기 위한 코스믹 다크 스킨 모드가 활성화 시그널을 탑재했으며, 본 데모는 아름다운 일관성 테마로 눈 피로를 보호합니다.');
                  }}
                  className={`py-3 rounded-xl text-xs font-extrabold transition-all border ${
                    theme === 'dark' 
                      ? 'bg-white text-[#3525cd] border-2 border-[#3525cd] shadow-sm font-black' 
                      : 'bg-[#F9FAFB] text-[#777587] border-[#E5E7EB] hover:bg-[#eae6f4]/20'
                  }`}
                >
                  🌙 다크 모드 스킨
                </button>
              </div>
            </fieldset>

          </div>

          {/* Right Block column: AI Partner adjustments (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-5">
            
            {/* AI Coaching Configuration Card */}
            <fieldset className="bg-white rounded-2xl border-2 border-[#dad7ff] p-5 shadow-sm">
              <legend className="text-sm font-black text-[#1b1b24] mb-1.5 flex items-center gap-1.5 px-1 ml-0.5">
                <Sparkles className="w-4.5 h-4.5 text-[#3525cd]" />
                밀착 AI 코치 파트너십 상세 조율
              </legend>
              <p className="text-[10px] text-[#777587] font-bold mb-5 uppercase tracking-wide px-1">
                Calibrate custom conversational persona and credentials
              </p>

              <div className="flex flex-col gap-5">
                
                {/* AI Persona selection slider radio sets */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" id="persona-label">코칭 피드백 어조 성향</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-labelledby="persona-label">
                    {[
                      { id: 'friendly', desc: '😊 친근하고 격려하는', title: '친근형' },
                      { id: 'logical', desc: '⚙️ 스마트하고 객관적', title: '논리형' },
                      { id: 'firm', desc: '⚔️ 엄격하고 타협없는', title: '단호형' }
                    ].map((item) => {
                      const isActive = aiPersona === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setAiPersona(item.id as 'friendly' | 'logical' | 'firm')}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-center gap-1 ${
                            isActive 
                              ? 'border-2 border-[#3525cd] bg-[#f5f2ff] ring-2 ring-[#3525cd]/15' 
                              : 'bg-white text-[#464555] border-[#E5E7EB] hover:bg-[#F9FAFB]/90'
                          }`}
                        >
                          <span className={`font-extrabold ${isActive ? 'text-[#3525cd]' : 'text-[#1b1b24]'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#777587] font-medium leading-none mt-0.5">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom instruction prompt text field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between ml-0.5">
                    <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider" htmlFor="instructions-area">나를 위한 정밀 맞춤 지시사항</label>
                    <span className="text-[9px] font-bold text-[#3525cd] uppercase bg-[#f0ecf9] px-2 py-0.5 rounded">유도 규칙</span>
                  </div>
                  <textarea
                    id="instructions-area"
                    rows={2}
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder='예: "대표님이라고 불러주세요." 혹은 "독촉하지 말고 부드럽게 설득해 줘."'
                    className="w-full px-3.5 py-2.5 text-xs font-semibold placeholder-[#777587]/40 bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl focus:border-[#3525cd] outline-none focus:ring-2 focus:ring-[#3525cd]/15 resize-none text-[#1b1b24]"
                  />
                  <p className="text-[10px] text-[#777587] font-medium ml-1">
                    💡 <strong className="text-[#3525cd]">"대표님이라고 불러주세요."</strong>를 작성하고 저장을 누르시면, 대시보드 대문 타이틀이 감쪽같이 연동 변경됩니다!
                  </p>
                </div>

                {/* Priority Expertise checklist array */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5">AI 모니터링 주요 카테고리</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['프로젝트 기획', '시간 관리', '운동 정기화', '독서 지수', '마인드 세트 명상', '영양 보충과 깊은 수면'].map((tag) => {
                      const isSelected = aiExpertise.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleToggleExpertise(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            isSelected 
                              ? 'bg-[#3525cd] border-[#3525cd] text-white' 
                              : 'bg-white text-[#464555] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Intervention frequency rate slider equivalents */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" id="freq-label">피드백 간섭 위험 감지 지수</span>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="freq-label">
                    {[
                      { id: 'minimal', label: '가끔씩 검수 (Minimal)' },
                      { id: 'moderate', label: '주기적 알림 (Moderate)' },
                      { id: 'active', label: '밀착 코칭 (Active)' }
                    ].map((freq) => {
                      const isMatched = aiFrequency === freq.id;
                      return (
                        <button
                          type="button"
                          key={freq.id}
                          onClick={() => setAiFrequency(freq.id as 'minimal' | 'moderate' | 'active')}
                          className={`py-2 px-1 rounded-xl text-[10px] font-black tracking-tight text-center border transition-all ${
                            isMatched
                              ? 'bg-[#3525cd] text-white border-[#3525cd]'
                              : 'bg-white text-[#464555] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                          }`}
                        >
                          {freq.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </fieldset>

            {/* Notification triggers toggles widget */}
            <fieldset className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
              <legend className="text-[11px] font-bold text-[#777587] uppercase tracking-wider mb-4 flex items-center gap-1.5 ml-0.5">
                <BellRing className="w-4 h-4 text-[#3525cd]" />
                알림 수신 관리 설정
              </legend>
              <div className="flex flex-col gap-3">
                {/* Switch 1: EMail */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1b1b24]">주간 AI 로드맵 리포트 메일 구독</span>
                    <span className="text-[10px] text-[#777587]">매주 월요일 새벽, 성숙도와 개선 지표를 첨부한 이메일을 받습니다.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationsEmail} 
                    onChange={(e) => setNotificationsEmail(e.target.checked)}
                    className="w-9 h-5 bg-gray-200 rounded-full focus:ring-[#3525cd] accent-[#3525cd] cursor-pointer" 
                  />
                </div>

                <div className="h-px bg-[#eae6f4]" />

                {/* Switch 2: OS Push alert indicators */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1b1b24]">수행 촉구 푸시 실시간 알림 받기</span>
                    <span className="text-[10px] text-[#777587]">설정한 수행 시간 기준 10분 전 리마인더 신호를 스크린에 띄웁니다.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationsPush} 
                    onChange={(e) => setNotificationsPush(e.target.checked)}
                    className="w-9 h-5 bg-gray-200 rounded-full focus:ring-[#3525cd] accent-[#3525cd] cursor-pointer" 
                  />
                </div>
              </div>
            </fieldset>

            {/* Form Save triggers button layout */}
            <div className="flex items-center justify-between p-5 bg-[#fafbfd] border border-[#e8ecf1] rounded-2xl shadow-inner mt-2">
              <span className="text-[11px] font-semibold text-[#777587] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                환경이 귀하의 디바이스 로컬 저장소에 상시 보안 암호화됩니다.
              </span>
              
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#3525cd] text-white font-extrabold text-xs flex items-center gap-1.5 hover:shadow-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>저장 중...</span>
                  </>
                ) : saveStatus === 'done' ? (
                  <>
                    <Check className="w-4 h-4 text-white font-bold" />
                    <span>저장 완료!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>설정 변경사항 적용저장</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
