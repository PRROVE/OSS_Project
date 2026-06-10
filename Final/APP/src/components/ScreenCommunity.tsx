import React, { useState, useRef, useEffect } from "react";
import {
  Heart, MessageCircle, Send, Share2, CheckCircle, Circle, Sparkles,
  Search, TrendingUp, MessageSquareOff, X, Image, ChevronDown, Bell
} from "lucide-react";
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
  const [filter, setFilter] = useState<'all' | 'mine' | 'popular'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [includeTasks, setIncludeTasks] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [importedToastMessage, setImportedToastMessage] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ 'feed-1': true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentTasks.length > 0) {
      setSelectedTaskIds(currentTasks.map(t => t.id));
    }
  }, [currentTasks]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImportToDos = () => {
    if (currentTasks.length === 0) {
      setNewPostContent(prev => (prev ? prev + '\n\n' : '') + '현재 등록된 오늘의 To-Do가 없습니다. 새로운 할 일을 추가한 뒤 공유해 보세요!');
      return;
    }
    setSelectedTaskIds(currentTasks.map(t => t.id));
    const formattedDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const introText = `${formattedDate} 오늘의 할 일 완수 현황을 팀원들과 공유합니다! 총 ${currentTasks.length}개 중 ${currentTasks.filter(t => t.completed).length}개 완수 진행 중. `;
    setNewPostContent(prev => prev ? prev : introText);
    setIncludeTasks(true);
  };

  const handleShareAnalysis = () => {
    const formattedDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    setNewPostContent(`[${formattedDate} 주간 성과 분석]\n이번 주 완료율을 기록했습니다. 지연된 일정과 원인을 공유하며 서로의 성장에 도움이 되길 바랍니다!`);
  };

  const handleSharePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    let sharedTasksList: Array<{ title: string; duration: string; category: CategoryType; completed: boolean }> = [];
    if (includeTasks && currentTasks.length > 0 && selectedTaskIds.length > 0) {
      sharedTasksList = currentTasks
        .filter(t => selectedTaskIds.includes(t.id))
        .map(t => ({
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
      authorRole: "나의 워크스페이스",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      timeAgo: "방금 전",
      content: newPostContent,
      imageUrl: newPostImage || undefined,
      likes: 0,
      likedByMe: false,
      comments: [],
      sharedTasks: sharedTasksList.length > 0 ? sharedTasksList : undefined
    };

    onAddFeed(newFeed);
    setNewPostContent('');
    setNewPostImage(null);
    setIncludeTasks(false);
    setSelectedTaskIds(currentTasks.map(t => t.id));
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 3000);
  };

  const handleLike = (feed: CommunityFeed) => {
    const isLiked = !feed.likedByMe;
    onUpdateFeed({
      ...feed,
      likes: isLiked ? feed.likes + 1 : feed.likes - 1,
      likedByMe: isLiked
    });
  };

  const handleAddComment = (feed: CommunityFeed) => {
    const text = commentInputs[feed.id]?.trim();
    if (!text) return;
    onUpdateFeed({
      ...feed,
      comments: [
        ...feed.comments,
        {
          id: `comment-${Date.now()}`,
          author: "윤관 (나)",
          avatarInitials: "윤",
          content: text,
          timeAgo: "방금 전"
        }
      ]
    });
    setCommentInputs(prev => ({ ...prev, [feed.id]: '' }));
    setExpandedComments(prev => ({ ...prev, [feed.id]: true }));
  };

  const handleCopyTasks = (sharedTasks: Array<{ title: string; duration: string; category: CategoryType; completed: boolean }>) => {
    if (!sharedTasks || sharedTasks.length === 0) return;
    onImportSharedTasks(sharedTasks.map(t => ({ title: t.title, duration: t.duration, category: t.category })));
    setImportedToastMessage('해당 To-Do 목록이 내 할 일 탭으로 복사 연계되었습니다!');
    setTimeout(() => setImportedToastMessage(null), 3500);
  };

  const filteredFeeds = feeds.filter(feed => {
    const matchesSearch =
      feed.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feed.content.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'mine') return feed.authorName.includes('나');
    if (filter === 'popular') return feed.likes >= 10;
    return true;
  });

  return (
    <div className="w-full bg-[#f7f6f2] flex flex-col min-h-screen pb-24 relative">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#e0ddd8] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1c1c14]">커뮤니티</h1>
            <p className="text-[11px] text-[#9a9a86]">다른 사용자와 할 일과 진행 상황을 공유합니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="text-[#6b6b58] hover:text-[#1c1c14]">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative">
              <button type="button" className="text-[#6b6b58] hover:text-[#1c1c14]">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">

        {/* Post Creation Panel */}
        <div className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#e0ddd8]">
            <div className="w-8 h-8 rounded-lg bg-[#5a6e38]/10 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 text-[#5a6e38]" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#1c1c14]">오늘의 완수 스토리 & 지표 공유</h3>
              <p className="text-[11px] text-[#9a9a86]">내 성과와 노하우를 팀원들과 즉시 논의해보세요</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={handleImportToDos}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#f7f6f2] hover:bg-[#edecea] border border-[#e0ddd8] rounded-lg text-[11px] font-semibold text-[#6b6b58] hover:text-[#1c1c14] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5a6e38]" />
              내 할 일 연동
            </button>
            <button
              type="button"
              onClick={handleShareAnalysis}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#edecea] hover:bg-[#e0ddd8] border border-[#9a9a86] rounded-lg text-[11px] font-semibold text-[#1c1c14] transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              내 분석 공유하기
            </button>
          </div>

          <form onSubmit={handleSharePost} className="space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="오늘 어떤 막막한 일을 15분 단위로 쪼개어 극복하고 계신가요? 완수한 기쁨과 노하우를 팀에 공유해 주세요."
              className="w-full min-h-[80px] p-3 text-xs bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl outline-none focus:bg-white transition-colors resize-none leading-relaxed"
            />

            {newPostImage && (
              <div className="relative inline-block">
                <img src={newPostImage} alt="첨부 이미지" className="h-16 rounded-lg border border-[#e0ddd8] object-cover" />
                <button
                  type="button"
                  onClick={() => setNewPostImage(null)}
                  className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {currentTasks.length > 0 && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIncludeTasks(!includeTasks)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors text-left ${
                    includeTasks ? 'bg-[#edecea] border-[#9a9a86]' : 'bg-[#f7f6f2] border-[#e0ddd8] hover:bg-[#edecea]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${includeTasks ? 'text-[#5a6e38]' : 'text-[#9a9a86]'}`} />
                    <span className="text-xs font-semibold text-[#1c1c14] shrink-0">공유할 To-Do</span>
                    <span className="text-[11px] text-[#9a9a86] truncate">
                      {includeTasks ? '공유할 항목 선택 중' : '클릭하여 할 일 목록 첨부'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#9a9a86] transition-transform shrink-0 ${includeTasks ? 'rotate-180' : ''}`} />
                </button>

                {includeTasks && (
                  <div className="p-3 bg-white border border-[#9a9a86]/50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-1.5">
                      <span className="text-[11px] font-semibold text-[#6b6b58]">동반 공유할 항목</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTaskIds(currentTasks.map(t => t.id))}
                          className="text-[11px] text-[#5a6e38] font-bold"
                        >전체</button>
                        <button
                          type="button"
                          onClick={() => setSelectedTaskIds([])}
                          className="text-[11px] text-[#9a9a86] font-bold"
                        >해제</button>
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                      {currentTasks.map(task => {
                        const isChecked = selectedTaskIds.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTaskIds(prev =>
                              isChecked ? prev.filter(id => id !== task.id) : [...prev, task.id]
                            )}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                              isChecked ? 'bg-white border-[#9a9a86]/80' : 'bg-[#f7f6f2] border-[#e0ddd8] opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-3 h-3 rounded shrink-0"
                            />
                            <span className={`text-[11px] font-semibold text-[#1c1c14] truncate flex-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
                              {task.title}
                            </span>
                            {task.completed && (
                              <span className="text-[10px] text-[#5a6e38] bg-[#ecf0e4] px-1 rounded shrink-0">완료</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-[#e0ddd8]">
              <div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-[#9a9a86] hover:text-[#6b6b58] text-xs font-semibold"
                >
                  <Image className="w-3.5 h-3.5" />
                  이미지 올리기
                </button>
              </div>
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors ${
                  newPostContent.trim() ? 'bg-[#5a6e38] hover:bg-[#4a5c2e]' : 'bg-[#e0ddd8] pointer-events-none'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                피드에 올리기
              </button>
            </div>
          </form>

          {showShareSuccess && (
            <div className="mt-3 p-2 bg-[#ecf0e4] border border-[#5a6e38]/20 text-[#5a6e38] text-[11px] font-bold rounded-lg text-center">
              할 일과 스토리가 커뮤니티 피드보드에 공유되었습니다!
            </div>
          )}
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col gap-2 bg-white p-3 border border-[#e0ddd8] rounded-xl">
          <div className="flex gap-1 bg-[#f7f6f2] p-1 rounded-lg border border-[#e0ddd8]">
            {(['all', 'mine', 'popular'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                  filter === f ? 'bg-white text-[#1c1c14] shadow-sm' : 'text-[#6b6b58]'
                }`}
              >
                {f === 'all' ? '전체 피드' : f === 'mine' ? '내가 올린 글' : '인기 완수'}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색 (이름, 본문 내용)..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#f7f6f2] text-xs rounded-xl border border-[#e0ddd8] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#9a9a86] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Rankings — 가로 스크롤 */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#1c1c14] px-1">이번 주 랭킹</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">

            <div className="min-w-[260px] bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm shrink-0">
              <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#e0ddd8]">
                <TrendingUp className="w-3.5 h-3.5 text-[#5a6e38]" />
                <span className="text-[11px] font-semibold text-[#5a6e38] uppercase tracking-tight">이번 주 완수 랭킹</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { rank: 1, name: '박도현', rate: '96%', streak: '12회 연속 성공', dark: true },
                  { rank: 2, name: '이혜린', rate: '92%', streak: '8회 연속 성공', dark: false },
                ].map(({ rank, name, rate, streak, dark }) => (
                  <div key={rank} className={`flex items-center justify-between ${rank > 1 ? 'pt-2 border-t border-[#e0ddd8]' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${dark ? 'bg-[#2c3420] text-white' : 'bg-[#edecea] text-[#6b6b58]'}`}>{rank}</div>
                      <div>
                        <p className="text-xs font-bold text-[#1c1c14]">{name}</p>
                        <p className="text-[10px] text-[#9a9a86]">주간 완수율 {rate}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#6b6b58] bg-[#f7f6f2] px-2 py-0.5 rounded">{streak}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-[260px] bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm shrink-0">
              <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#e0ddd8]">
                <Heart className="w-3.5 h-3.5 text-[#c4674a] fill-[#c4674a]" />
                <span className="text-[11px] font-semibold text-[#c4674a] uppercase tracking-tight">이번 주 좋아요 랭킹</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { rank: 1, name: '박도현', likes: '54개', label: '인기 피드 메이커', dark: true },
                  { rank: 2, name: '이혜린', likes: '38개', label: '인기 피드 메이커', dark: false },
                ].map(({ rank, name, likes, label, dark }) => (
                  <div key={rank} className={`flex items-center justify-between ${rank > 1 ? 'pt-2 border-t border-[#e0ddd8]' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${dark ? 'bg-[#2c3420] text-white' : 'bg-[#edecea] text-[#6b6b58]'}`}>{rank}</div>
                      <div>
                        <p className="text-xs font-bold text-[#1c1c14]">{name}</p>
                        <p className="text-[10px] text-[#9a9a86]">응원 좋아요 {likes}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#5a6e38] bg-[#ecf0e4] px-2 py-0.5 rounded-full">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Feed List */}
        <section className="space-y-4">
          {filteredFeeds.length === 0 ? (
            <div className="bg-white border border-[#e0ddd8] rounded-xl p-8 text-center space-y-2">
              <MessageSquareOff className="w-8 h-8 text-[#9a9a86] mx-auto" />
              <p className="text-xs font-bold text-[#6b6b58]">등록된 완수 스토리가 없습니다</p>
              <p className="text-[11px] text-[#9a9a86]">새로운 스토리를 가장 먼저 적어보세요!</p>
            </div>
          ) : (
            filteredFeeds.map(feed => (
              <article key={feed.id} className="bg-white border border-[#e0ddd8] rounded-xl p-4 shadow-sm">

                {/* Author */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#e0ddd8] overflow-hidden shrink-0">
                      <img src={feed.avatarUrl} alt={feed.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-[#1c1c14]">{feed.authorName}</span>
                        <span className="text-[10px] text-[#9a9a86] font-semibold">{feed.authorEmail}</span>
                      </div>
                      <span className="text-[10px] text-[#5a6e38] font-bold">{feed.authorRole}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9a9a86] font-semibold shrink-0">{feed.timeAgo}</span>
                </div>

                {/* Content */}
                <p className="text-xs text-[#6b6b58] leading-relaxed mb-3 whitespace-pre-wrap">{feed.content}</p>

                {/* Image */}
                {feed.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#e0ddd8] mb-3">
                    <img src={feed.imageUrl} alt="공유 이미지" className="w-full max-h-48 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Shared Tasks */}
                {feed.sharedTasks && feed.sharedTasks.length > 0 && (
                  <div className="bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl p-3 mb-3 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#e0ddd8]">
                      <span className="text-[10px] font-semibold text-[#9a9a86] uppercase tracking-wider">
                        SHARED TO-DO ({feed.sharedTasks.length}개)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTasks(feed.sharedTasks!)}
                        className="flex items-center gap-1 px-2 py-1 bg-[#edecea] border border-[#9a9a86] rounded-lg text-[10px] font-semibold text-[#1c1c14] hover:bg-[#e0ddd8] transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        내 To-Do로 연동받기
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {feed.sharedTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded-lg border ${
                            task.completed ? 'bg-[#ecf0e4]/50 border-[#5a6e38]/20' : 'bg-white border-[#e0ddd8]'
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle className="w-3.5 h-3.5 text-[#5a6e38] shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-[#9a9a86] shrink-0" />
                          )}
                          <span className={`text-[11px] font-bold text-[#6b6b58] truncate ${task.completed ? 'line-through opacity-80' : ''}`}>
                            {task.title} ({task.duration})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 border-t border-[#e0ddd8] pt-3">
                  <button
                    type="button"
                    onClick={() => handleLike(feed)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      feed.likedByMe ? 'text-[#c4674a]' : 'text-[#6b6b58] hover:text-[#c4674a]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${feed.likedByMe ? 'fill-[#c4674a] text-[#c4674a]' : ''}`} />
                    좋아요 {feed.likes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedComments(prev => ({ ...prev, [feed.id]: !prev[feed.id] }))}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#6b6b58] hover:text-[#1c1c14] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    댓글 {feed.comments.length}개 {expandedComments[feed.id] ? '(닫기)' : '(열기)'}
                  </button>
                </div>

                {/* Comments */}
                {expandedComments[feed.id] && (
                  <div className="mt-3 pt-3 border-t border-[#e0ddd8] space-y-2.5 bg-[#f7f6f2]/60 p-3 rounded-xl">
                    {feed.comments.length === 0 ? (
                      <p className="text-[10px] text-[#9a9a86] italic text-center py-1">첫 댓글을 남겨 이 도전을 응원해 주세요!</p>
                    ) : (
                      feed.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#ecf0e4] text-[#5a6e38] flex items-center justify-center text-[10px] font-bold shrink-0">
                            {comment.avatarInitials}
                          </div>
                          <div className="flex-1 bg-white p-2 rounded-lg border border-[#e0ddd8]">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[10px] font-bold text-[#1c1c14]">{comment.author}</span>
                              <span className="text-[9px] text-[#9a9a86]">{comment.timeAgo}</span>
                            </div>
                            <p className="text-[10px] text-[#6b6b58] leading-relaxed font-semibold">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={commentInputs[feed.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [feed.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(feed); }}
                        placeholder="응원의 한마디나 꿀팁을 달아 주세요..."
                        className="flex-1 bg-white border border-[#e0ddd8] rounded-lg py-1.5 pl-2.5 pr-2 text-[11px] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(feed)}
                        disabled={!commentInputs[feed.id]?.trim()}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 transition-colors ${
                          commentInputs[feed.id]?.trim() ? 'bg-[#5a6e38] hover:bg-[#4a5c2e]' : 'bg-[#e0ddd8] pointer-events-none'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        작성
                      </button>
                    </div>
                  </div>
                )}

              </article>
            ))
          )}
        </section>

      </main>

      {/* Toast */}
      {importedToastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#5a6e38]/95 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#e0ddd8]/30 max-w-[320px] w-[90%]">
          <CheckCircle className="w-4 h-4 text-white shrink-0" />
          <span className="text-xs font-semibold">{importedToastMessage}</span>
        </div>
      )}

    </div>
  );
}
