import React, { useState } from "react";

interface SettingsProps {
  username: string;
  setUsername: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  targetCount: number;
  setTargetCount: (cnt: number) => void;
  coachTone: string;
  setCoachTone: (tone: string) => void;
  sliceUnit: string;
  setSliceUnit: (unit: string) => void;
  resetAllData: () => void;
  userAvatar: string;
}

export default function Settings({
  username,
  setUsername,
  userEmail,
  setUserEmail,
  targetCount,
  setTargetCount,
  coachTone,
  setCoachTone,
  sliceUnit,
  setSliceUnit,
  resetAllData,
  userAvatar,
}: SettingsProps) {
  // Slider completion rate state
  const [completeRatio, setCompleteRatio] = useState(60.8);
  const [fatigueCheck, setFatigueCheck] = useState(true);
  const [autoCarry, setAutoCarry] = useState(true);
  const [emailReceive, setEmailReceive] = useState(false);

  // Profile Edit fields
  const [editProfile, setEditProfile] = useState(false);
  const [editNameInst, setEditNameInst] = useState(username);
  const [editEmailInst, setEditEmailInst] = useState(userEmail);
  const [syncSavedToast, setSyncSavedToast] = useState(false);

  const handleSaveSync = () => {
    setUsername(editNameInst);
    setUserEmail(editEmailInst);
    setSyncSavedToast(true);
    setTimeout(() => {
      setSyncSavedToast(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
      {/* Save Sync Floating Pop / Toast */}
      {syncSavedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#455528] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg z-50 animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-sm font-bold">cloud_done</span>
          <span>설정 저장이 클라우드와 안전하게 동기화되었습니다!</span>
        </div>
      )}

      {/* Profile Header Block */}
      <section className="flex flex-col items-center py-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative">
        <div className="relative">
          <img
            referrerPolicy="no-referrer"
            alt="User profile"
            className="w-20 h-20 rounded-full object-cover shadow-sm border-4 border-white"
            src={userAvatar}
          />
          <div className="absolute bottom-0 right-0 bg-[#455528] p-1.5 rounded-full border border-white cursor-pointer hover:bg-[#455528]/90">
            <span className="material-symbols-outlined text-white text-[16px] font-bold">edit</span>
          </div>
        </div>

        <div className="mt-3 text-center w-full">
          {editProfile ? (
            <div className="mt-2 space-y-2 max-w-[240px] mx-auto">
              <input
                type="text"
                value={editNameInst}
                onChange={(e) => setEditNameInst(e.target.value)}
                className="w-full text-xs text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#455528]"
                placeholder="이름 변경"
              />
              <input
                type="email"
                value={editEmailInst}
                onChange={(e) => setEditEmailInst(e.target.value)}
                className="w-full text-xs text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#455528]"
                placeholder="이메일 변경"
              />
              <button
                type="button"
                onClick={() => {
                  setEditProfile(false);
                  handleSaveSync();
                }}
                className="bg-[#455528] text-white text-[10px] font-bold px-3 py-1 rounded inline-block hover:opacity-90"
              >
                적용하기
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display font-extrabold text-base text-[#191c1b]">{username}</h2>
              <p className="font-sans text-xs text-gray-400 font-semibold mt-1">{userEmail}</p>
              <button
                onClick={() => setEditProfile(true)}
                className="mt-2 text-[#455528] font-bold text-[11px] hover:underline flex items-center justify-center gap-0.5 mx-auto"
              >
                프로필 수정
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Quick profile controls */}
      <section className="bg-white rounded-xl overflow-hidden border border-[#c6c8ba]/30 shadow-sm divide-y divide-gray-100">
        <div onClick={() => setEditProfile(true)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
          <span className="text-xs font-semibold text-charcoal">프로필 사진 변경</span>
          <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
        </div>
        <div onClick={() => setEditProfile(true)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
          <span className="text-xs font-semibold text-charcoal">이름 및 닉네임 변경</span>
          <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
        </div>
        <div onClick={() => setEditProfile(true)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
          <span className="text-xs font-semibold text-charcoal">이메일 계정 관리</span>
          <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
        </div>
      </section>

      {/* AI Productivity config section */}
      <section className="bg-white rounded-xl p-5 border border-[#c6c8ba]/30 shadow-sm space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#455528] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <h3 className="font-display font-extrabold text-sm text-[#191c1b]">AI 생산성 설정</h3>
        </div>

        <div className="space-y-4">
          {/* Daily Goal */}
          <div className="flex justify-between items-center">
            <div>
              <label className="text-xs font-bold text-charcoal block">일일 목표</label>
              <p className="text-[10px] text-gray-400">권장 일일 과업 개수</p>
            </div>
            <div className="flex items-center bg-[#f3f4f2] rounded-lg p-1">
              <button
                type="button"
                onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#455528] hover:bg-white rounded-md transition-colors font-bold text-lg"
              >
                -
              </button>
              <span className="px-3 font-display font-bold text-sm text-[#191c1b] min-w-[20px] text-center">
                {targetCount}
              </span>
              <button
                type="button"
                onClick={() => setTargetCount(targetCount + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#455528] hover:bg-white rounded-md transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Time Slicing units */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#191c1b] block">일정 쪼개기 단위</label>
            <div className="flex bg-[#f3f4f2] p-1 rounded-xl">
              {["15분", "30분", "45분"].map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setSliceUnit(unit)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    sliceUnit === unit
                      ? "bg-white text-[#455528] shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-[#455528]"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Target completion rate Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#191c1b]">목표 완료율</label>
              <span className="text-[#455528] font-bold text-sm">{completeRatio.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={completeRatio}
              onChange={(e) => setCompleteRatio(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#455528]"
            />
            <div className="flex justify-between text-[9px] text-[#45483d] font-semibold px-0.5">
              <span>50% (집중)</span>
              <span>80% (도전)</span>
              <span>100% (철저)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Personality Choose */}
      <section className="bg-white rounded-xl p-5 border border-[#c6c8ba]/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#455528] font-bold">psychology</span>
          <h3 className="font-display font-extrabold text-sm text-[#191c1b]">코치 성향</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              tone: "객관적 분석가",
              desc: "데이터, 효율성, 완벽한 통계 논리적 피드백에 집중합니다.",
            },
            {
              tone: "공감형 코치",
              desc: "웰빙, 피로 관리, 따뜻한 격려와 페이스 유지를 주도합니다.",
            },
            {
              tone: "강력한 동기부여가",
              desc: "한계 돌파, 철저한 규율, 고강도 고성과 미션에 집중합니다.",
            },
          ].map((item) => (
            <label
              key={item.tone}
              onClick={() => setCoachTone(item.tone)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                coachTone === item.tone
                  ? "border-2 border-[#455528] bg-[#455528]/5"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="coachTone"
                checked={coachTone === item.tone}
                onChange={() => {}} // handled by parent onClick
                className="mt-0.5 rounded-full text-[#455528] focus:ring-[#455528] h-4 w-4 border-gray-300"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#191c1b] font-bold">{item.tone}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-normal">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Feature toggles */}
      <section className="space-y-3">
        {/* Toggle 1 */}
        <div className="bg-white rounded-xl p-4 border border-[#c6c8ba]/30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-gray-500">battery_status_good</span>
            <span className="text-xs font-bold text-charcoal">피로도 실시간 측정</span>
          </div>
          <button
            onClick={() => setFatigueCheck(!fatigueCheck)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              fatigueCheck ? "bg-[#455528]" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                fatigueCheck ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="bg-white rounded-xl p-4 border border-[#c6c8ba]/30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-gray-500">update</span>
            <span className="text-xs font-bold text-charcoal">미완수 일정 자동 이월</span>
          </div>
          <button
            onClick={() => setAutoCarry(!autoCarry)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              autoCarry ? "bg-[#455528]" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                autoCarry ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Toggle 3 */}
        <div className="bg-white rounded-xl p-4 border border-[#c6c8ba]/30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-gray-500">mail</span>
            <span className="text-xs font-bold text-charcoal">주간 리포트 이메일 수신</span>
          </div>
          <button
            onClick={() => setEmailReceive(!emailReceive)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              emailReceive ? "bg-[#455528]" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                emailReceive ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Alarm times scheduling matching mockup */}
      <section className="bg-white rounded-xl p-5 border border-[#c6c8ba]/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#455528]">notifications_active</span>
          <h3 className="font-display font-extrabold text-sm text-[#191c1b]">알림 설정</h3>
        </div>
        <div className="space-y-3 font-sans">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-semibold text-charcoal">기상 권장 알림 시간</span>
            <input
              type="time"
              defaultValue="09:00"
              className="border-none bg-transparent font-bold text-xs text-[#455528] focus:ring-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-semibold text-charcoal">일일 요약 피드백 시간</span>
            <input
              type="time"
              defaultValue="18:30"
              className="border-none bg-transparent font-bold text-xs text-[#455528] focus:ring-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-semibold text-charcoal">주간 리포트 발송 일시</span>
            <div className="flex items-center gap-2 font-bold text-xs text-[#455528]">
              <span className="text-[10px] text-gray-400 font-extrabold">매주 일요일</span>
              <input
                type="time"
                defaultValue="20:00"
                className="border-none bg-transparent focus:ring-0 cursor-pointer p-0 font-bold"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Danger Reset Zone */}
      <section className="bg-red-50 rounded-xl p-5 border border-red-200 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600 font-bold">report_problem</span>
          <h3 className="font-display font-extrabold text-sm text-red-600">위험 구역</h3>
        </div>
        <p className="text-[11px] text-red-500 leading-normal font-semibold">
          데이터 삭제는 복구할 수 없습니다. 모든 할 일 완료 상태가 기본 도식으로 초기화되며 로컬 채팅 내역 등이 전부 초기 보두맵으로 비워집니다.
        </p>
        <button
          onClick={() => {
            if (window.confirm("정말로 모든 데이터를 공장 출고 설정으로 안전하게 초기화하시겠습니까?")) {
              resetAllData();
            }
          }}
          className="w-full py-2.5 px-4 bg-white hover:bg-red-100/50 border border-red-300 text-red-600 font-bold text-xs rounded-xl active:scale-95 transition-transform"
        >
          모든 데이터 초기화
        </button>
      </section>

      {/* Sticky Bottom Segment trigger button */}
      <div className="fixed bottom-[74px] left-1/2 -translate-x-1/2 w-full max-w-[440px] px-5 py-4 bg-gradient-to-t from-[#f7f8f6] via-[#f7f8f6] to-transparent pointer-events-none z-10">
        <button
          onClick={handleSaveSync}
          className="pointer-events-auto w-full h-11 bg-[#455528] hover:bg-[#455528]/95 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-xs"
        >
          <span className="material-symbols-outlined text-sm">sync</span>
          설정 저장 및 동기화
        </button>
      </div>
    </div>
  );
}
