import React, { useState } from "react";
import { MessageSquare, Heart, Send, Bell, Search, Sparkles, Image, CheckCircle, Circle, LogIn, Award, TrendingUp, Hand } from "lucide-react";
import { CommunityFeed, CategoryType, Task } from "../types";

interface ScreenCommunityProps {
  feeds: CommunityFeed[];
  onAddFeed: (feed: CommunityFeed) => void;
  onUpdateFeed: (feed: CommunityFeed) => void;
  onImportSharedTasks: (tasks: Array<{ title: string; duration: string; category: CategoryType }>) => void;
  currentTasks: Task[];
}

export default function ScreenCommunity({
  feeds,
  onAddFeed,
  onUpdateFeed,
  onImportSharedTasks,
  currentTasks
}: ScreenCommunityProps) {
  
  const [newPostText, setNewPostText] = useState("");
  const [includeTasks, setIncludeTasks] = useState(false);
  const [activeCommentFeedId, setActiveCommentFeedId] = useState<string | null>("feed-1");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const handlePostFeed = () => {
    if (!newPostText.trim()) return;

    // Optional dynamic attachment of user's active tasks
    let sharedTasksAttached: any = undefined;
    if (includeTasks && currentTasks.length > 0) {
      sharedTasksAttached = currentTasks.slice(0, 3).map(t => ({
        title: t.title,
        duration: t.duration,
        category: t.category,
        completed: t.completed
      }));
    }

    const newFeed: CommunityFeed = {
      id: `feed-${Date.now()}`,
      authorName: "윤관 (나)",
      authorEmail: "yoon.kwan@example.com",
      authorRole: "Professional Designer",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxSVa6i3f3upJdUrPp4C_2-3OL2RHQZcmrODd-rsb3HjITjJIfaTThOoKOvCJR6p6QYrT3RQ0WNxrjMjbEiwbo8llYQR_ycmx5Oa26iReTFHPLZBdfdhZSt_IJbpunOXrOA2dtW6oUIoHC8mFf9Zp9Trl_Cu9kd5ZaTCOYnhdZ0JG18wMzFFisXCJhIeE5dceeWKvoGObW8Ncc2NKHa9g50K5NhYROy2yhQo-juO7GoTCbIAFEvyhD_xZtZ3RGSpQP3w5fCJrj9Nq7",
      timeAgo: "방금 전",
      content: newPostText.trim(),
      likes: 0,
      likedByMe: false,
      comments: [],
      sharedTasks: sharedTasksAttached
    };

    onAddFeed(newFeed);
    setNewPostText("");
    setIncludeTasks(false);
    alert("🎉 피드가 커뮤니티 타임라인에 무사히 배포되었습니다!");
  };

  const handleLikeToggle = (feed: CommunityFeed) => {
    const updated = { ...feed };
    if (updated.likedByMe) {
      updated.likes -= 1;
      updated.likedByMe = false;
    } else {
      updated.likes += 1;
      updated.likedByMe = true;
    }
    onUpdateFeed(updated);
  };

  const handleAddComment = (feed: CommunityFeed) => {
    const text = commentInputs[feed.id];
    if (!text || !text.trim()) return;

    const updated = { ...feed };
    updated.comments = [
      ...updated.comments,
      {
        id: `comment-${Date.now()}`,
        author: "윤관 (나)",
        avatarInitials: "윤",
        content: text.trim(),
        timeAgo: "방금 전"
      }
    ];

    onUpdateFeed(updated);
    setCommentInputs({ ...commentInputs, [feed.id]: "" });
  };

  const handleImportTasksClick = (sharedTasks: any) => {
    if (!sharedTasks || sharedTasks.length === 0) return;
    onImportSharedTasks(sharedTasks);
    alert("⚡ 피드의 루틴 3단계 목표를 나의 오늘 To-Do 목록에 동기화 완료했습니다!");
  };

  return (
    <div id="community-screen" className="w-full max-w-[393px] bg-white overflow-hidden flex flex-col min-h-screen pb-24 border border-gray-100 shadow-xl rounded-2xl relative">
      
      {/* Top Header App bar */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-5 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="p-1 px-1.5 rounded-lg bg-[#d0ecaf] font-black text-sm">👥</span>
          <h1 className="font-bold text-lg tracking-tight text-[#374d20]">커뮤니티</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700">
            <Search className="w-5 h-5" />
          </button>
          <div className="relative">
            <button className="text-slate-500 hover:text-slate-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Social container flow */}
      <main className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* Post Creation Segment */}
        <section className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              alt="My Avatar" 
              className="w-10 h-10 rounded-full border border-gray-200" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxSVa6i3f3upJdUrPp4C_2-3OL2RHQZcmrODd-rsb3HjITjJIfaTThOoKOvCJR6p6QYrT3RQ0WNxrjMjbEiwbo8llYQR_ycmx5Oa26iReTFHPLZBdfdhZSt_IJbpunOXrOA2dtW6oUIoHC8mFf9Zp9Trl_Cu9kd5ZaTCOYnhdZ0JG18wMzFFisXCJhIeE5dceeWKvoGObW8Ncc2NKHa9g50K5NhYROy2yhQo-juO7GoTCbIAFEvyhD_xZtZ3RGSpQP3w5fCJrj9Nq7"
            />
            <input 
              type="text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="오늘 어떤 막막한 일을 15분 단위로 쪼개어 극복하고 계신가요?"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-slate-400 focus:outline-[#374d20] focus:ring-1 focus:ring-[#374d20]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pb-1">
            <button 
              type="button"
              onClick={() => {
                if (currentTasks.length === 0) {
                  alert("아직 등록된 오늘 과업이 없어요! 오늘 할 일을 먼저 등록해 주세요.");
                  return;
                }
                setIncludeTasks(!includeTasks);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold shadow-xs transition-colors ${
                includeTasks 
                  ? "bg-[#374d20] border-transparent text-[#e1fec0]" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>내 할 일 연동 {includeTasks ? "✓" : ""}</span>
            </button>
            <button 
              type="button"
              onClick={() => setNewPostText("오늘의 성공률 90% 달성 완료! 점진적 15분 룰이 저의 집중력을 견인해 주었습니다. 모두 화이팅하세요!")}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#374d20]" />
              <span>내 분석 공유하기</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
            <button className="flex items-center gap-1 text-slate-400 font-semibold hover:text-slate-600 text-xs pl-1">
              <Image className="w-3.5 h-3.5 text-slate-400" />
              <span>이미지 올리기</span>
            </button>
            
            <button 
              type="button" 
              onClick={handlePostFeed}
              disabled={!newPostText.trim()}
              className="px-5 py-2 bg-[#374d20] hover:bg-[#2c3d17] text-white text-xs font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
            >
              피드에 올리기
            </button>
          </div>
        </section>

        {/* Weekly Ranking 가로 스크롤 카드보드 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 px-1">이번 주 랭킹</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
            
            {/* Box Action 1: 완수 랭크 */}
            <div className="min-w-[280px] bg-white border border-slate-150 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-4 text-[#374d20]">
                <TrendingUp className="w-4 h-4" />
                <span className="font-extrabold text-xs">이번 주 완수 랭킹</span>
              </div>
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#3c4a2f] text-white text-[10px] font-black rounded-full">1</span>
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">박도현</p>
                      <p className="text-[10px] text-slate-400">주간 완수율 96%</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">12회 연속 성공</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-200 text-slate-600 text-[10px] font-black rounded-full">2</span>
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">이혜린</p>
                      <p className="text-[10px] text-slate-400">주간 완수율 92%</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">8회 연속 성공</span>
                </div>

              </div>
            </div>

            {/* Box Action 2: 응원 랭크 */}
            <div className="min-w-[280px] bg-white border border-slate-150 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-4 text-red-500">
                <Heart className="w-4 h-4 fill-red-500" />
                <span className="font-extrabold text-xs">이번 주 좋아요 랭킹</span>
              </div>
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#3c4a2f] text-white text-[10px] font-black rounded-full">1</span>
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">박도현</p>
                      <p className="text-[10px] text-slate-400">응원 좋아요 54개</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-[#d0ecaf] text-[#4e6535] rounded-full font-bold">인기 피드 메이커</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-200 text-slate-600 text-[10px] font-black rounded-full">2</span>
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">이혜린</p>
                      <p className="text-[10px] text-slate-400">응원 좋아요 38개</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-[#d0ecaf] text-[#4e6535] rounded-full font-bold">인기 피드 메이커</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Social Feeds timeline list */}
        <section className="space-y-5">
          {feeds.map(feed => {
            const isCommentsOpen = activeCommentFeedId === feed.id;
            return (
              <article key={feed.id} className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4">
                  
                  {/* Author Header info row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        alt={feed.authorName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                        src={feed.avatarUrl} 
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-gray-900">{feed.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{feed.authorEmail}</span>
                        </div>
                        <span className="text-[10px] text-[#374d20] font-bold">{feed.authorRole}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{feed.timeAgo}</span>
                  </div>

                  {/* Main feed body code text */}
                  <p className="text-xs leading-relaxed text-slate-700 mb-4 whitespace-pre-wrap">
                    {feed.content}
                  </p>

                  {/* Attachment image illustration if any */}
                  {feed.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden mb-4 aspect-video border border-slate-100">
                      <img 
                        alt="Attached metric diagram" 
                        className="w-full h-full object-cover" 
                        src={feed.imageUrl} 
                      />
                    </div>
                  )}

                  {/* Embedded shared dynamic tasks checklist */}
                  {feed.sharedTasks && feed.sharedTasks.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3.5 mb-4 border border-slate-200/55">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                          공유받은 To-Do 목록 ({feed.sharedTasks.length}개)
                        </span>
                        
                        <button 
                          type="button"
                          onClick={() => handleImportTasksClick(feed.sharedTasks)}
                          className="text-[9px] flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-650 font-bold hover:border-[#374d20] transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-[#374d20]" />
                          <span>내 To-Do 목록으로 연동받기</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {feed.sharedTasks.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-lg opacity-85">
                            {t.completed ? (
                              <CheckCircle className="w-3.5 h-3.5 text-[#374d20]" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-350" />
                            )}
                            <span className="text-[10px] font-bold text-slate-650 truncate max-w-[210px]">
                              {t.title} ({t.duration})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar layout */}
                  <div className="flex items-center gap-5 text-slate-450 border-t border-slate-100 pt-3">
                    <button 
                      type="button"
                      onClick={() => handleLikeToggle(feed)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                        feed.likedByMe ? "text-red-500 scale-102" : "hover:text-[#374d20]"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${feed.likedByMe ? "fill-red-500 text-red-500" : ""}`} />
                      <span>좋아요 {feed.likes}</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setActiveCommentFeedId(isCommentsOpen ? null : feed.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                        isCommentsOpen ? "text-[#374d20]" : "hover:text-slate-650"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>댓글 {feed.comments.length}개 {isCommentsOpen ? "(닫기)" : "(보기)"}</span>
                    </button>
                  </div>

                  {/* Optional Comments Section slide container */}
                  {isCommentsOpen && (
                    <div className="bg-slate-100/50 rounded-xl p-3.5 mt-4 space-y-3.5 anim-slide-down">
                      {feed.comments.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic text-center py-2">
                          첫 댓글을 남겨 이 도전을 응원해 주세요!
                        </p>
                      ) : (
                        feed.comments.map(comment => (
                          <div key={comment.id} className="flex gap-2.5 items-start">
                            <div className="w-6 h-6 flex-shrink-0 bg-slate-200 font-extrabold rounded-full flex items-center justify-center text-[10px] text-slate-650">
                              {comment.avatarInitials}
                            </div>
                            <div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-[10px] text-slate-700">{comment.author}</span>
                                <span className="text-[9px] text-slate-400">{comment.timeAgo}</span>
                              </div>
                              <p className="text-[10px] leading-relaxed text-slate-650 font-semibold">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Comment Input row layout */}
                      <div className="relative mt-2">
                        <input 
                          type="text"
                          value={commentInputs[feed.id] || ""}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [feed.id]: e.target.value })}
                          placeholder="응원의 한마디나 꿀팁을 달아 주세요..."
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-[10px] font-semibold text-gray-800 outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => handleAddComment(feed)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-350 hover:text-[#374d20] p-1 rounded-full transition-transform active:scale-90"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </article>
            );
          })}
        </section>

      </main>

    </div>
  );
}
