import React, { useState } from "react";
import { Post, Todo } from "../types";

interface CommunityProps {
  posts: Post[];
  todos: Todo[];
  importSharedTodos: (sharedList: { text: string; category: string; time: string; memo: string }[]) => void;
}

export default function Community({ posts, todos, importSharedTodos }: CommunityProps) {
  const [livePosts, setLivePosts] = useState<Post[]>(posts);
  const [newPostText, setNewPostText] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleLike = (postId: string) => {
    setLivePosts(
      livePosts.map((p) => {
        if (p.id === postId) {
          const liked = !p.hasLiked;
          return {
            ...p,
            likes: liked ? p.likes + 1 : p.likes - 1,
            hasLiked: liked,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorName: "윤관",
      authorRole: "Adaptive AI 멤버 (나)",
      authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB05UQzOLGLQXIto0SA7DR8P0y8FKNh3p6LfP9Dq0kbO1qHVFVMYZpVD4YfP82NRHuzZ_jKm7cJE8N7JqZHCaXlE-_13eSieMzayEL9qcncEmoqeoXzleEnEBBJWLvu_qTJFSIDxBkrwEZGx_GOXr2M0Gc40RbPmwGyNRU2SDxVkEzFK9ZnfmlEYT8UHT_BFb4QmzAbb_hNaQtyvcuSriacpPdpN5uzbYqV-huscyrX1qOO8-Fvxq9iGimosf4FrU_7jKA5HC3p1-Q",
      content: newPostText,
      timeString: "방금 전",
      likes: 0,
      comments: 0,
    };

    setLivePosts([newPost, ...livePosts]);
    setNewPostText("");
    triggerToast("멋진 성과 글이 타계에 공유되었습니다! 🎉");
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2800);
  };

  const handleImportShared = (sharedList: { text: string; category: string; time: string; memo: string }[]) => {
    // Call import trigger callback
    importSharedTodos(sharedList);
    triggerToast("📂 공유된 To-Do 목록 3개가 내 할 일 관리에 안전하게 등록되었습니다!");
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Toast Overlay alert */}
      {successToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#455528] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg z-50 animate-slide-in flex items-center gap-2">
          <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Stories/Tabs horizontal carousel scrolling */}
      <section>
        <div className="flex overflow-x-auto scroll-hide gap-3 -mx-2 px-2 py-1">
          <div className="flex-shrink-0 w-32 h-44 rounded-2xl p-4 flex flex-col justify-between bg-[#455528] relative overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-white text-2xl font-bold">local_fire_department</span>
            <p className="text-white text-[11px] font-bold leading-tight">오늘의<br />완수 스토리</p>
          </div>
          <div className="flex-shrink-0 w-32 h-44 rounded-2xl p-4 flex flex-col justify-between bg-[#5c5f57] relative overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-white text-2xl font-bold">emoji_events</span>
            <p className="text-white text-[11px] font-bold leading-tight">주간<br />챌린지</p>
          </div>
          <div className="flex-shrink-0 w-32 h-44 rounded-2xl p-4 flex flex-col justify-between bg-[#a54d32] relative overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-white text-2xl font-bold">star</span>
            <p className="text-white text-[11px] font-bold leading-tight">인기<br />게시글</p>
          </div>
          <div className="flex-shrink-0 w-32 h-44 rounded-2xl p-4 flex flex-col justify-between border-2 border-dashed border-[#c6c8ba] bg-white active:scale-95 transition-transform cursor-pointer shadow-sm text-center items-center justify-center">
            <span className="material-symbols-outlined text-[#76786c] text-2xl font-bold mb-1">add_circle</span>
            <p className="text-[#45483d] text-[11px] font-bold leading-tight">스토리<br />추가하기</p>
          </div>
        </div>
      </section>

      {/* Post Creation input element */}
      <section>
        <form onSubmit={handleCreatePost} className="bg-white rounded-2xl p-4 border border-[#c6c8ba]/30 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img referrerPolicy="no-referrer" alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB05UQzOLGLQXIto0SA7DR8P0y8FKNh3p6LfP9Dq0kbO1qHVFVMYZpVD4YfP82NRHuzZ_jKm7cJE8N7JqZHCaXlE-_13eSieMzayEL9qcncEmoqeoXzleEnEBBJWLvu_qTJFSIDxBkrwEZGx_GOXr2M0Gc40RbPmwGyNRU2SDxVkEzFK9ZnfmlEYT8UHT_BFb4QmzAbb_hNaQtyvcuSriacpPdpN5uzbYqV-huscyrX1qOO8-Fvxq9iGimosf4FrU_7jKA5HC3p1-Q" />
          </div>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="flex-1 bg-[#f3f4f2] text-xs px-3 py-2 border-none rounded-xl focus:ring-1 focus:ring-[#455528] focus:bg-white outline-none"
            placeholder="오늘의 성장 스토리를 공유해 보세요!"
          />
          <button type="submit" className="text-[#455528] hover:scale-110 transition-transform active:scale-90" title="이미지 올리기">
            <span className="material-symbols-outlined">image</span>
          </button>
        </form>
      </section>

      {/* Weekly completion rankings segment bar */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display font-extrabold text-base text-[#455528] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#a54d32] font-bold">emoji_events</span>
          🏆 주간 완수왕
        </h2>
        
        {/* Scroll list */}
        <div className="flex overflow-x-auto scroll-hide gap-3 pb-1">
          {/* Rank 1 */}
          <div className="flex-shrink-0 w-60 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="bg-[#d7eab0] text-[#131f00] px-3 py-1 rounded-full text-[10px] font-extrabold font-sans">
                1위 박도현
              </span>
              <span className="text-[#455528] font-extrabold font-sans text-xs">96% 성취</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#bbcd96] p-0.5 overflow-hidden">
                <img referrerPolicy="no-referrer" alt="Do Hyun" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKudJOqTC3Gcc9RwA4thYFcd5eApXaQgxRAohqlvPDqHA93DZpV4D9orNZigOo9iRQKZDPOequy9uH-JaG0wkweVoLGWVbjYxspl9Tmt5WbD3EXeBqmh9Nr9-kcEh3FUOCf-syoCcKgcxo4TrTfC2Nq4HYD418VtuM-JAE5YUPNyC2kMoB9RAqQ9elLWNFj8ntLHRwSFFinTul4SZyRvnkXrY3X7pmPCram9VVydsulrV0G5_iv-ZmD3EjKQPT1tHqqoJV3Lhcdvs" />
              </div>
              <div>
                <div className="font-display font-bold text-xs">박도현</div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">12회 연속 성공 기록</div>
              </div>
            </div>
          </div>

          {/* Rank 2 */}
          <div className="flex-shrink-0 w-60 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="bg-gray-100 text-[#45483d] px-3 py-1 rounded-full text-[10px] font-extrabold font-sans">
                2위 이혜린
              </span>
              <span className="text-gray-600 font-extrabold font-sans text-xs">92% 성취</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-slate-200 p-0.5 overflow-hidden">
                <img referrerPolicy="no-referrer" alt="Hye Rin" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARgOmxd-G6J1PmsT566rA2v7sj-MluuGcA2uDd2P4IcZdKFIjGix5-nP1oo0ijpKizpd-u-5BPeAsa9F0WZc6dWu0_0CJ9n7ZJRUrJZucfq9rpYeWWvkBTzVvWdekhsvD1OpJ-Y_J9u059ZY1EKont_sEtAhhIYYG4_oqfk2DAXDSYSHj4fxl5PgqrW29v8IPuPWf4MPsdRErShQDCr7JGCp0Ufc5BlDIkVGFhpeRYel-wj9qHtlZSZtzFVI4TCqbK_RfcSkuPBBI" />
              </div>
              <div>
                <div className="font-display font-bold text-xs">이혜린</div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">8회 연속 성공 기록</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Social Feed */}
      <section className="space-y-4">
        {livePosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-[#c6c8ba]/20 flex flex-col gap-3.5 transition-shadow hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img referrerPolicy="no-referrer" alt={post.authorName} className="w-full h-full object-cover" src={post.authorImage} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xs leading-none">{post.authorName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1.5">{post.timeString} · {post.authorRole}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-charcoal transition-colors">
                <span className="material-symbols-outlined text-sm">more_horiz</span>
              </button>
            </div>

            <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Embedded mockup charts visualization */}
            {post.imgUrl && (
              <div className="rounded-xl overflow-hidden aspect-video bg-gray-50 border border-gray-100 shadow-inner">
                <img referrerPolicy="no-referrer" alt="Feed Graphics" className="w-full h-full object-cover" src={post.imgUrl} />
              </div>
            )}

            {/* Shareable tasks list item card */}
            {post.id === "init-post-1" && (
              <div className="bg-[#f9faf8] rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-1 flex-col sm:flex-row">
                  <span className="text-[10px] font-extrabold text-[#455528] tracking-wider uppercase pl-0.5">
                    공유된 To-Do 목록 (3개)
                  </span>
                  <button
                    onClick={() =>
                      handleImportShared([
                        {
                          text: "피그마 컴포넌트 프레임 정리 & 동기화 (15분)",
                          category: "WORK",
                          time: "10:30-10:45",
                          memo: "공유된 15분 마이크로 집중 스프린트 기법입니다.",
                        },
                        {
                          text: "프론트엔드 개발팀 송부용 명세서 작성 (30분)",
                          category: "WORK",
                          time: "11:00-11:30",
                          memo: "목표 쪼개기에 기초한 핵심 업무 집중 시간입니다.",
                        },
                        {
                          text: "UX 테스트 결과 피드백 분류 & 요약 (15분)",
                          category: "PROJECT",
                          time: "15:00-15:15",
                          memo: "번아웃을 방지하기 위한 오후 가벼운 업무 배치입니다.",
                        },
                      ])
                    }
                    className="text-[10px] font-bold text-white bg-[#455528] hover:bg-[#455528]/90 px-3 py-1 rounded-full flex items-center gap-1 transition-all shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[12px] font-bold">download</span>
                    내 할 일 목록으로 스캔하기
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="material-symbols-outlined text-[#455528] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-[11px] text-[#45483d] font-semibold">피그마 컴포넌트 프레임 정리 & 동기화 (15분)</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="material-symbols-outlined text-[#455528] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-[11px] text-[#45483d] font-semibold font-sans">프론트엔드 개발팀 송부용 명세서 작성 (30분)</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="material-symbols-outlined text-gray-400 text-sm">
                      radio_button_unchecked
                    </span>
                    <span className="text-[11px] text-gray-400">UX 테스트 결과 피드백 분류 & 요약 (15분)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Routine card */}
            {post.sharedRoutine && (
              <div className="bg-[#e1e4d9] rounded-xl p-4 border border-[#c5c8bd]/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="material-symbols-outlined text-[#455528] text-sm">schedule</span>
                  <span className="text-[10px] font-bold text-charcoal">{post.sharedRoutine.title}</span>
                </div>
                <div className="text-xs font-bold font-sans text-charcoal">{post.sharedRoutine.text}</div>
              </div>
            )}

            {/* Social actions interactions */}
            <div className="flex items-center gap-6 pt-1 border-t border-gray-50">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-[11px] transition-colors active:scale-90 ${
                  post.hasLiked ? "text-[#ba1a1a] font-bold" : "text-gray-400 hover:text-[#455528]"
                }`}
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: post.hasLiked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
                <span>{post.likes}</span>
              </button>
              
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#455528] text-[11px]">
                <span className="material-symbols-outlined text-sm">
                  mode_comment
                </span>
                <span>{post.comments}</span>
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(post.content);
                  triggerToast("📋 텍스트가 클립보드에 복사되었습니다!");
                }}
                className="flex items-center gap-1.5 text-gray-400 hover:text-[#455528] text-[11px] ml-auto"
                title="공유 복사"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
