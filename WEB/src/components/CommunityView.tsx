/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Task, UserProfile } from '../types';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Share2, 
  Users, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Plus, 
  Search, 
  Flame, 
  Award,
  BookOpen,
  MessageSquareOff,
  User,
  ThumbsUp,
  X,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Info,
  Image,
  ChevronDown
} from 'lucide-react';

interface CommunityPost {
  id: string;
  userName: string;
  userEmail: string;
  avatarUrl: string;
  userTitle: string;
  content: string;
  imageUrl?: string;
  attachedType?: 'weekly_report' | 'category_share' | 'efficiency_curve' | 'hourly_heatmap' | 'failure_pattern';
  sharedTasks: { title: string; completed: boolean }[];
  likes: number;
  likedByCurrentUser?: boolean;
  comments: { id: string; author: string; text: string; time: string }[];
  createdAt: string;
}

interface CommunityViewProps {
  user: UserProfile;
  tasks: Task[];
  onImportTasks: (tasksToImport: { title: string }[]) => void;
}

export default function CommunityView({ user, tasks, onImportTasks }: CommunityViewProps) {
  const myCompleted  = tasks.filter(t => t.completed).length;
  const myTotal      = tasks.length;
  const myRate       = myTotal > 0 ? Math.round((myCompleted / myTotal) * 100) : 0;
  // Feed posts state seeded with beautiful initial community submissions
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'post-1',
      userName: '이혜린',
      userEmail: 'hyerin.lee@partner.design',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      userTitle: 'Google UX Design Lead',
      content: '어제 완료한 To-Do 목록 스크린샷과 함께 성공률 60% 정비 기록 인증하고 갑니다! 15분 단위로 쪼개도 집중력을 끝까지 유지하기란 쉽지 않네요. 그래도 무리한 과제들은 다음으로 넘겨서 번아웃은 막았습니다. 다들 이번 주도 무리하지 말고 화이팅입니다!',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
      sharedTasks: [
        { title: '피그마 컴포넌트 라이브러리 정렬 & 싱크 (15분)', completed: true },
        { title: '프론트엔드 개발팀 전달용 디자인 명세서 작성 (30분)', completed: true },
        { title: 'UX 테스트 세션 최종 피드백 분류 & 요약 (15분)', completed: false }
      ],
      likes: 18,
      likedByCurrentUser: false,
      comments: [
        { id: 'c-1', author: '김완수', text: 'To-Do 성공률 60%라니 저보다 높으시네요! 꼼꼼한 관리 자극 받고 갑니다', time: '1시간 전' },
        { id: 'c-2', author: '이현우 (나)', text: '체계적인 지표 관리 부럽습니다! 저도 내 할 일 탭으로 참고할게요!', time: '30분 전' }
      ],
      createdAt: '2시간 전'
    },
    {
      id: 'post-2',
      userName: '김완수',
      userEmail: 'wansu.kim@partner.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      userTitle: 'Lead Cloud Architect',
      content: '주간 분석 리포트 화면입니다. 투자용 데이터베이스 최적화와 OAuth 검증 작업을 쪼개서 수행해 보니 이전 주 대비 To-Do 완료율이 무려 35% 이상 성공적으로 상승했습니다. 코파일럿 기능은 사랑입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop',
      sharedTasks: [
        { title: 'OAuth 리디렉션 로직 검증 및 예외 케이스 처리 (20분)', completed: true },
        { title: 'DB 인덱스 세부 튜닝 쿼리 검증 & 마이그레이션 적용 (15분)', completed: false }
      ],
      likes: 12,
      likedByCurrentUser: false,
      comments: [
        { id: 'c-3', author: '박도현', text: '와, 최적화 통계 곡선이 기가 막힙니다. 쿼리 성능이 확 눈에 밟히네요!', time: '3시간 전' }
      ],
      createdAt: '4시간 전'
    }
  ]);

  // Feed control states
  const [filter, setFilter] = useState<'all' | 'mine' | 'popular'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Post Form State
  const [newPostContent, setNewPostContent] = useState('');
  const [includeTasks, setIncludeTasks] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [importedToastMessage, setImportedToastMessage] = useState<string | null>(null);

  // Dynamic Image upload and Share Analysis States
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [attachedAnalysisType, setAttachedAnalysisType] = useState<'none' | 'weekly_report' | 'hourly_heatmap' | 'category_share' | 'failure_pattern'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically pre-select tasks when they change so user has a working default
  useEffect(() => {
    if (tasks.length > 0) {
      setSelectedTaskIds(tasks.map(t => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  }, [tasks]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareAnalysis = () => {
    const formattedDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const analysisText = `[${formattedDate} 주간 성과 분석 및 피어 피드백]\n이번 주 완료율 60.8%를 기록했습니다. 지연된 일정과 원인을 공유하며 서로의 성장에 도움이 되길 바랍니다!`;
    setNewPostContent(analysisText);
    setAttachedAnalysisType('weekly_report');
  };

  const handleCopyTasks = (sharedTasks: { title: string }[]) => {
    if (!sharedTasks || sharedTasks.length === 0) return;
    onImportTasks(sharedTasks);
    setImportedToastMessage('해당 To-Do 목록이 내 할 일 탭으로 완벽하게 복사 연계되었습니다!');
    setTimeout(() => setImportedToastMessage(null), 3500);
  };
  
  // Comments input text state dictionary per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true
  });

  // Calculate loaded items counting
  const totalSharesCount = posts.length;
  const popularCount = posts.filter(p => p.likes >= 15).length;

  const renderDashboardScreenshot = (postId: string) => {
    switch (postId) {
      case 'post-1':
        // 이혜린: 주간 완수 지표 추이 (60% 완료)
        return (
          <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left">
            <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: WEEKLY COMPLETION INDEX</span>
              </div>
              <span className="text-[11px] bg-[#edecea] border border-[#9a9a86] text-[#1c1c14] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#1c1c14]" />
                <span>성공률 ${Math.round((tasks.filter(t=>t.completed).length/Math.max(tasks.length,1))*100)}%</span>
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-end justify-between h-24 pt-2 px-4 bg-white rounded-xl border border-[#e0ddd8] relative">
                {/* Simulated Grid Lines */}
                <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-5 px-1 py-1.5">
                  <div className="border-b border-[#e0ddd8] w-full" />
                  <div className="border-b border-[#e0ddd8] w-full" />
                  <div className="border-b border-[#e0ddd8] w-full" />
                </div>
                
                {/* Bars */}
                {[
                  { label: '월', height: '58%', active: false },
                  { label: '화', height: '62%', active: false },
                  { label: '수', height: '65%', active: false },
                  { label: '목', height: '54%', active: false },
                  { label: '금', height: '60%', active: false },
                  { label: '토', height: '50%', active: false },
                  { label: '일(어제)', height: '61%', active: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 z-10 w-8">
                    <div className="w-full flex justify-center items-end h-16">
                      <div 
                        style={{ height: item.height }}
                        className={`w-3.5 rounded-t-xs transition-all duration-500 ${
                          item.active 
                            ? 'bg-gradient-to-t from-[#1c1c14] to-[#2d7a3a] shadow-[0_0_8px_rgba(79,70,229,0.25)]' 
                            : 'bg-[#edecea]/20'
                        }`}
                      />
                    </div>
                    <span className={`text-[12px] font-bold ${item.active ? 'text-[#1c1c14] font-semibold' : 'text-[#9a9a86]'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 bg-white p-2.5 rounded-xl border border-[#e0ddd8] text-center">
                <div>
                  <span className="text-[11px] text-[#9a9a86] font-bold block">완수 목표 수</span>
                  <span className="text-xs font-semibold font-mono text-[#1c1c14]">3개 완료</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9a9a86] font-bold block">스마트 슬라이싱</span>
                  <span className="text-xs font-semibold font-mono text-[#1c1c14]">15분 단위</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9a9a86] font-bold block">주간 가동비율</span>
                  <span className="text-xs font-semibold font-mono text-[#2d7a3a]">+18% 상승</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'post-2':
        // 김완수: 부문별 업무 점유율 Chart (Pie/Donut & List simulation)
        return (
          <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left text-[#1c1c14]">
            <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: CATEGORY JOB SHARE</span>
              </div>
              <span className="text-[11px] bg-[#edecea] border border-[#9a9a86] text-[#1c1c14] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                <PieChart className="w-3 h-3 text-[#1c1c14]" />
                <span>업무 밸런스 점유율</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Donut visualizer (md:col-span-5) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-white p-4.5 rounded-xl border border-[#e0ddd8]/60 h-full min-h-[160px] shadow-xs">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 112 112">
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      fill="transparent"
                      stroke="#e0ddd8"
                      strokeWidth="9"
                    />
                    {/* 45% Indigo */}
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      fill="transparent"
                      stroke="#5a6e38"
                      strokeWidth="9"
                      strokeDasharray="124.407 276.46"
                      strokeDashoffset="0"
                    />
                    {/* 25% Emerald */}
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      fill="transparent"
                      stroke="#2d7a3a"
                      strokeWidth="9"
                      strokeDasharray="69.115 276.46"
                      strokeDashoffset="-124.407"
                    />
                    {/* 15% Amber */}
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      fill="transparent"
                      stroke="#c4674a"
                      strokeWidth="9"
                      strokeDasharray="41.469 276.46"
                      strokeDashoffset="-193.522"
                    />
                    {/* 15% Slate */}
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      fill="transparent"
                      stroke="#9a9a86"
                      strokeWidth="9"
                      strokeDasharray="41.469 276.46"
                      strokeDashoffset="-234.991"
                    />
                  </svg>
                  <div className="absolute text-center z-10 font-sans">
                    <span className="text-[11px] text-[#9a9a86] font-semibold block leading-none">측정 기간</span>
                    <span className="text-xs font-semibold text-[#1c1c14] block mt-1 leading-none">1주일</span>
                    <span className="text-[11px] font-semibold text-[#1c1c14] font-mono mt-0.5 block leading-none">(7일간)</span>
                  </div>
                </div>
              </div>

              {/* Detailed percentages items (md:col-span-7) */}
              <div className="md:col-span-7 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: '개발 및 엔지니어링 (DB튜닝)', pct: '45%', color: 'bg-[#5a6e38]' },
                    { name: 'OAuth 인증 및 마이그레이션', pct: '25%', color: 'bg-[#2d7a3a]' },
                    { name: '시스템 밸런스 점검', pct: '15%', color: 'bg-[#c4674a]' },
                    { name: '개인 정비 및 정적 검사', pct: '15%', color: 'bg-[#f7f6f2]' },
                  ].map((dept, idx) => (
                    <div key={idx} className="space-y-1 bg-white p-2.5 rounded-xl border border-[#e0ddd8]/80 shadow-3xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#6b6b58] font-semibold truncate max-w-[125px]">{dept.name}</span>
                        <span className="font-mono text-[#1c1c14] font-semibold">{dept.pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden">
                        <div className={`h-full ${dept.color} rounded-full`} style={{ width: dept.pct }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#e0ddd8] flex items-center gap-1.5 text-[12px] font-semibold text-[#9a9a86] leading-snug">
                  <Info className="w-3.5 h-3.5 text-[#1c1c14] shrink-0" />
                  <span>해당 분포 비율은 지난 7일 동안 코파일럿 가동 로그 백로그 기준입니다.</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'post-3':
        // 박도현: 분석 성공률 추이 및 활동총량 Curve
        return (
          <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left text-[#1c1c14]">
            <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c4674a] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: RECENT EFFICIENCY CURVE</span>
              </div>
              <span className="text-[11px] bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                12회 성공 스트릭
              </span>
            </div>

            <div className="space-y-4">
              {/* Curve Drawing Area */}
              <div className="h-28 bg-white rounded-xl border border-[#e0ddd8] p-2.5 relative flex flex-col justify-end">
                {/* SVG Line represent the actual uptrend curve */}
                <svg className="absolute inset-x-0 bottom-4 w-full h-16 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5a6e38" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#5a6e38" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area */}
                  <path 
                    d="M 5 95 C 15 80, 25 85, 35 60 C 45 40, 55 55, 65 30 C 75 10, 85 15, 95 5 L 95 100 L 5 100 Z" 
                    fill="url(#curveGrad)" 
                  />
                  
                  {/* Stroke Line */}
                  <path 
                    d="M 5 95 C 15 80, 25 85, 35 60 C 45 40, 55 55, 65 30 C 75 10, 85 15, 95 5" 
                    fill="none" 
                    stroke="#5a6e38" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Interactive Dot indicators */}
                  <circle cx="5" cy="95" r="3" fill="#5a6e38" />
                  <circle cx="35" cy="60" r="3" fill="#5a6e38" />
                  <circle cx="65" cy="30" r="3" fill="#5a6e38" />
                  <circle cx="95" cy="5" r="4" fill="#2d7a3a" />
                </svg>

                {/* Y-axis micro indicators */}
                <div className="absolute left-2.5 top-2 flex flex-col gap-1 text-[11px] font-mono text-[#9a9a86] font-bold">
                  <span>최고 가동률 96%</span>
                  <span>평균 가동률 85%</span>
                </div>

                {/* Legend labels */}
                <div className="flex justify-between text-[11px] font-bold text-[#6b6b58] px-1 pt-1 z-10">
                  <span>5월말</span>
                  <span>6월 초(집중 모드)</span>
                  <span>현재(정비 및 개선)</span>
                </div>
              </div>

              {/* Score indicators */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-2 border border-[#e0ddd8] rounded-xl">
                  <span className="text-[11px] block text-[#9a9a86]">전체 성공률</span>
                  <span className="text-xs font-semibold font-mono text-[#1c1c14]">{myRate}%</span>
                </div>
                <div className="bg-white p-2 border border-[#e0ddd8] rounded-xl">
                  <span className="text-[11px] block text-[#9a9a86]">완료 / 전체</span>
                  <span className="text-xs font-semibold font-mono text-[#1c1c14]">{myCompleted} / {myTotal}개</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Handles updating the "Likes" count
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = !post.likedByCurrentUser;
        return {
          ...post,
          likes: isLiked ? post.likes + 1 : post.likes - 1,
          likedByCurrentUser: isLiked
        };
      }
      return post;
    }));
  };

  // Handles adding a new comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment-${Date.now()}`,
              author: `${user.name} (나)`,
              text: text,
              time: '방금 전'
            }
          ]
        };
      }
      return post;
    }));

    // Reset input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    // Auto-reveal comments
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  // Key press to submit comment
  const handleCommentKeyDown = (e: React.KeyboardEvent, postId: string) => {
    if (e.key === 'Enter') {
      handleAddComment(postId);
    }
  };

  // Auto-import current user's To-Dos with the single click
  const handleImportToDos = () => {
    if (tasks.length === 0) {
      setNewPostContent(prev => 
        (prev ? prev + '\n\n' : '') + '현재 등록된 오늘의 To-Do가 없습니다. 새로운 할 일을 추가한 뒤 공유해 보세요!'
      );
      return;
    }
    
    // Select all task IDs
    setSelectedTaskIds(tasks.map(t => t.id));
    
    const formattedDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const introText = `${formattedDate} 오늘의 할 일 완수 현황을 팀원들과 소통하며 공유합니다! 총 ${tasks.length}개 중 ${tasks.filter(t => t.completed).length}개 완수 진행 중. `;
    setNewPostContent(prev => prev ? prev : introText);
    setIncludeTasks(true);
  };

  // Submits a new community post
  const handleSharePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    // Build shared task list
    let sharedTasksList: { title: string; completed: boolean }[] = [];
    if (includeTasks && tasks.length > 0 && selectedTaskIds.length > 0) {
      sharedTasksList = tasks
        .filter(t => selectedTaskIds.includes(t.id))
        .map(t => ({
          title: `${t.title} (${t.duration || '약속시간 없음'})`,
          completed: t.completed
        }));
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userName: user.name,
      userEmail: user.email,
      avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      userTitle: '나의 워크스페이스 코파일럿',
      content: newPostContent,
      imageUrl: newPostImage || undefined,
      attachedType: attachedAnalysisType !== 'none' ? attachedAnalysisType : undefined,
      sharedTasks: sharedTasksList,
      likes: 0,
      likedByCurrentUser: false,
      comments: [],
      createdAt: '방금 전'
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostImage(null);
    setAttachedAnalysisType('none');
    setIncludeTasks(false);
    // Pre-select current task list as the default
    setSelectedTaskIds(tasks.map(t => t.id));
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 3000);
  };

  // Filter & Search handler
  const filteredPosts = posts.filter(post => {
    // 1. Search term
    const matchesSearch = 
      post.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.userTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Main Tab filter
    if (filter === 'mine') {
      return post.userName.includes(user.name) || post.userEmail === user.email;
    }
    if (filter === 'popular') {
      return post.likes >= 15;
    }
    return true;
  });

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f7f6f2] text-left overflow-y-auto">
      {/* 🚀 Header & Summary Panel */}
      <div className="p-6 bg-white border-b border-[#e0ddd8] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-[#1c1c14]">커뮤니티</h1>
            <p className="text-[13px] text-[#9a9a86] mt-0.5">다른 사용자와 할 일과 진행 상황을 공유합니다.</p>
          </div>

          {/* Core Counter Widget */}
          <div className="flex gap-4">
            <div className="bg-[#f7f6f2] border border-[#e0ddd8]/60 p-3 rounded-xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#edecea] flex items-center justify-center text-[#1c1c14]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-widest block">총 게시물 수</span>
                <span className="text-sm font-semibold text-[#1c1c14] tracking-tight font-mono">{totalSharesCount}개 공유됨</span>
              </div>
            </div>
            
            <div className="bg-[#f7f6f2] border border-[#e0ddd8]/60 p-3 rounded-xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#f8ede8] flex items-center justify-center text-[#c4674a]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#9a9a86] uppercase tracking-widest block">인기 완수 글</span>
                <span className="text-sm font-semibold text-[#1c1c14] tracking-tight font-mono">{popularCount}개 달성</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout Area */}
      <div className="p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Share form and Community Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Post Creation Panel */}
          <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#5a6e38]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e0ddd8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5a6e38]/10 text-[#1c1c14] flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[#1c1c14] font-display">오늘의 완수 스토리 & 지표 공유</h3>
                  <p className="text-[11px] text-[#9a9a86] font-semibold">내 성과와 노하우를 팀원들과 즉시 논의해보세요</p>
                </div>
              </div>
              
              {/* Import Actions header */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleImportToDos}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#f7f6f2] hover:bg-[#edecea]/50 border border-[#e0ddd8] hover:border-[#9a9a86] rounded-lg text-[11px] font-semibold text-[#6b6b58] hover:text-[#1c1c14] transition-all cursor-pointer"
                  title="오늘 작성한 할 일 리스트의 제목들과 성과를 자동으로 로드합니다."
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" />
                  <span>내 할 일 연동</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareAnalysis}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#edecea] hover:bg-[#e0ddd8]/70 border border-[#9a9a86] hover:border-[#e0ddd8] rounded-lg text-[11px] font-semibold text-[#1c1c14] transition-all cursor-pointer shadow-3xs"
                  title="내 정밀 종합 분석 리포트를 피드에 연계 첨부하여 팀에 자랑 공유합니다."
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#1c1c14]" />
                  <span>내 분석 공유하기</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSharePost} className="space-y-4">
              <div className="relative">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="오늘 어떤 막막한 일을 15분 단위로 쪼개어 극복하고 계신가요? 완수한 기쁨과 노하우를 팀에 공유해 주세요."
                  className="w-full min-h-[90px] p-3 text-xs bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl focus:border-[#e0ddd8] focus:bg-white outline-none transition-all resize-y leading-relaxed"
                />
              </div>

              {/* Previews and Attachments status rendering */}
              <div className="space-y-2">
                {newPostImage && (
                  <div className="relative inline-block bg-[#f7f6f2] p-2 rounded-xl border border-[#e0ddd8] shadow-3xs">
                    <div className="relative rounded-lg overflow-hidden border border-[#e0ddd8] max-w-[150px] aspect-video">
                      <img src={newPostImage} alt="Uploaded attachment" className="h-20 w-auto object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewPostImage(null)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full p-1 transition-all pointer-events-auto"
                        title="이미지 제거"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-[#9a9a86] mt-1 block text-center font-bold">첨부된 이미지</span>
                  </div>
                )}

                {attachedAnalysisType !== 'none' && (
                  <div className="flex items-center justify-between bg-[#edecea]/60 border border-[#9a9a86] p-2.5 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#1c1c14] font-semibold pb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" />
                      <span>
                        {attachedAnalysisType === 'weekly_report' && '주간 성과 지표 보고서'}
                        {attachedAnalysisType === 'hourly_heatmap' && '시간대별 가동률 히트맵 보고서'}
                        {attachedAnalysisType === 'category_share' && '업무 카테고리 밸런스 점유율 보고서'}
                        {attachedAnalysisType === 'failure_pattern' && '인지적 주저현상 및 실패 패턴 보고서'}
                        {' '}첨부 완벽 장착됨
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedAnalysisType('none')}
                      className="text-[#1c1c14]/60 hover:text-[#1c1c14] hover:bg-[#e0ddd8]/60 rounded-full p-0.5 transition-all cursor-pointer block"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Selective To-Do Checklist Selector (Collapsible Folded Card) */}
              {tasks.length > 0 && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIncludeTasks(!includeTasks)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      includeTasks 
                        ? 'bg-[#edecea]/20 border-[#9a9a86]/90 shadow-3xs' 
                        : 'bg-[#f7f6f2] border-[#e0ddd8] hover:bg-[#edecea]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg transition-colors scale-90 ${includeTasks ? 'bg-[#e0ddd8] text-[#1c1c14]' : 'bg-[#f7f6f2] text-[#6b6b58]'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-[#1c1c14]">공유할 To-Do</span>
                        </div>
                        <p className="text-[12px] text-[#6b6b58] font-bold mt-0.5 truncate">
                          {includeTasks ? '피드에 함께 올릴 할 일 항목들을 원하는 대로 선택해 보세요.' : '클릭하여 오늘의 할 일 목록을 선택형으로 동반 첨부합니다.'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center border transition-all ${includeTasks ? 'rotate-180 bg-white border-[#9a9a86] text-[#1c1c14] shadow-3xs' : 'bg-white border-[#e0ddd8] text-[#9a9a86]'}`}>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </button>

                  {includeTasks && (
                    <div className="p-3.5 bg-white border border-[#9a9a86]/70 rounded-xl space-y-3 shadow-3xs">
                      <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-2">
                        <span className="text-[11px] font-semibold text-[#6b6b58]">동반 연계 공유할 항목</span>
                        
                        <div className="flex items-center gap-1 bg-[#f7f6f2] p-1 rounded-lg border border-[#e0ddd8]">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTaskIds(tasks.map(t => t.id));
                            }}
                            className="px-2 py-0.5 hover:bg-white text-[12px] font-bold text-[#6b6b58] rounded cursor-pointer border-0 bg-transparent transition-all"
                          >
                            전체 선택
                          </button>
                          <div className="w-px h-2.5 bg-[#f7f6f2]" />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTaskIds([]);
                            }}
                            className="px-2 py-0.5 hover:bg-white text-[12px] font-bold text-[#6b6b58] rounded cursor-pointer border-0 bg-transparent transition-all"
                          >
                            모두 해제
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                        {tasks.map((task) => {
                          const isChecked = selectedTaskIds.includes(task.id);
                          let priorityColor = 'text-[#6b6b58] bg-[#f7f6f2]';
                          if (task.priority === 'high') priorityColor = 'text-[#c4674a] bg-[#f8ede8]';
                          else if (task.priority === 'medium') priorityColor = 'text-[#c4674a] bg-[#f8ede8]';
                          
                          return (
                            <div
                              key={task.id}
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedTaskIds(prev => prev.filter(id => id !== task.id));
                                } else {
                                  setSelectedTaskIds(prev => [...prev, task.id]);
                                }
                              }}
                              className={`flex items-start gap-2.5 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-white border-[#9a9a86]/85 shadow-3xs hover:bg-[#edecea]/20'
                                  : 'bg-[#f7f6f2]/50 border-[#e0ddd8] opacity-60 hover:opacity-100 hover:bg-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // handled by outer div click
                                className="w-3.5 h-3.5 mt-0.5 rounded text-[#1c1c14] focus:ring-[#5a6e38] cursor-pointer animate-none"
                              />
                              <div className="flex-grow min-w-0 pointer-events-none">
                                <span className={`text-[12px] font-bold block truncate text-[#1c1c14] leading-tight ${task.completed ? 'line-through opacity-70' : ''}`}>
                                  {task.title}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1 font-sans">
                                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-sm ${priorityColor}`}>
                                    {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                                  </span>
                                  <span className="text-[11px] text-[#9a9a86] font-bold font-mono">
                                    {task.duration || '약속 없음'}
                                  </span>
                                  {task.completed && (
                                    <span className="text-[11px] text-[#2d7a3a] font-semibold bg-[#ecf0e4] px-1 rounded-sm">
                                      완료
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Rows */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2.5 border-t border-[#e0ddd8]">
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#f7f6f2] hover:bg-[#f7f6f2]/80 border border-[#e0ddd8] rounded-xl text-[12px] font-semibold text-[#6b6b58] transition-all cursor-pointer shadow-3xs"
                    title="이미지를 피드에 업로드하여 공유합니다."
                  >
                    <Image className="w-3.5 h-3.5 text-[#6b6b58]" />
                    <span>이미지 올리기</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-end gap-3.5">
                  <span className="text-[11px] text-[#9a9a86] font-bold hidden md:inline">
                    * 게시물은 실시간으로 팀원 피드보드에 동기화 배치 연계됩니다.
                  </span>
                  
                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                      newPostContent.trim() 
                        ? 'bg-[#5a6e38] hover:bg-[#3d33cd] hover:shadow-[#e0ddd8] hover:shadow-md' 
                        : 'bg-[#f7f6f2] pointer-events-none'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>피드에 올리기</span>
                  </button>
                </div>
              </div>
            </form>

            {/* success toast alert */}
            {showShareSuccess && (
              <div className="mt-3 p-2 bg-[#2d7a3a]/10 border border-[#2d7a3a]/20 text-[#2d7a3a] text-[11px] font-bold rounded-lg text-center">
                할 일과 스토리가 커뮤니티 피드보드에 완벽하게 등재 공유되었습니다!
              </div>
            )}
          </div>

          {/* Filtering Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 border border-[#e0ddd8] rounded-xl shrink-0">
            {/* Filter buttons */}
            <div className="flex gap-1.5 bg-[#f7f6f2] p-1 rounded-lg border border-[#e0ddd8]">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                  filter === 'all' 
                    ? 'bg-white text-[#1c1c14] shadow-xs' 
                    : 'text-[#6b6b58] hover:text-[#1c1c14]'
                }`}
              >
                전체 피드
              </button>
              <button
                onClick={() => setFilter('mine')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                  filter === 'mine' 
                    ? 'bg-white text-[#1c1c14] shadow-xs' 
                    : 'text-[#6b6b58] hover:text-[#1c1c14]'
                }`}
              >
                내가 올린 글
              </button>
              <button
                onClick={() => setFilter('popular')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                  filter === 'popular' 
                    ? 'bg-white text-[#1c1c14] shadow-xs' 
                    : 'text-[#6b6b58] hover:text-[#1c1c14]'
                }`}
              >
                인기 완수
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색 (이름, 본문 내용)..."
                className="pl-8 pr-3 py-1.5 w-full sm:w-[190px] bg-[#f7f6f2]/75 text-xs rounded-xl border border-[#e0ddd8] outline-none focus:border-[#e0ddd8] focus:bg-white transition-all text-left"
              />
              <Search className="w-3.5 h-3.5 text-[#9a9a86] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white border border-[#e0ddd8] rounded-xl p-10 text-center space-y-2">
                <MessageSquareOff className="w-8 h-8 text-[#9a9a86] mx-auto" />
                <h4 className="text-xs font-bold text-[#6b6b58]">등록된 완수 스토리가 없습니다</h4>
                <p className="text-[11px] text-[#9a9a86]">새로운 검색어로 필터를 변경하거나 스토리를 가장 먼저 적어보세요!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-white border border-[#e0ddd8] rounded-xl p-5 shadow-xs text-left relative overflow-hidden">
                  
                  {/* Top user profile section */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[#e0ddd8] overflow-hidden shrink-0">
                        <img 
                          src={post.avatarUrl} 
                          alt={post.userName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#1c1c14] font-display">{post.userName}</span>
                          <span className="text-[11px] font-mono font-bold text-[#9a9a86]">{post.userEmail}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#1c1c14] block">{post.userTitle}</span>
                      </div>
                    </div>
                    
                    <span className="text-[12px] font-mono font-semibold text-[#9a9a86]">
                      {post.createdAt}
                    </span>
                  </div>

                  {/* Main Post Body */}
                  <div className="space-y-3 pl-0 sm:pl-1 pt-1">
                    <p className="text-xs text-[#9a9a86] leading-relaxed font-semibold whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Real dashboard widget/screenshot attachment design or workspace image */}
                    {post.imageUrl ? (
                      <div className="rounded-xl overflow-hidden border border-[#e0ddd8] bg-[#f7f6f2] max-h-[220px] md:max-h-[300px] w-full flex items-center justify-center shadow-xs relative group">
                        <img 
                          src={post.imageUrl} 
                          alt="공유 이미지" 
                          className="w-full max-h-48 md:max-h-64 object-contain select-none group-hover:scale-[1.01] transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : post.attachedType === 'weekly_report' ? (
                      <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left text-[#1c1c14] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38] animate-pulse" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: WEEKLY ANALYSIS REPORT</span>
                          </div>
                          <span className="text-[11px] bg-[#edecea] border border-[#9a9a86] text-[#1c1c14] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                            <TrendingUp className="w-3 h-3 text-[#1c1c14]" />
                            <span>주간 분석 리포트</span>
                          </span>
                        </div>

                        {/* Weekly completion index bar charts (Simulated) */}
                        <div className="space-y-4 bg-white p-4.5 rounded-xl border border-[#e0ddd8]/60 shadow-3xs">
                          <div className="flex items-end justify-between h-24 pt-2 px-6 bg-[#f7f6f2] border border-[#e0ddd8] rounded-xl relative">
                            <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-5 px-1 py-1.5">
                              <div className="border-b border-[#e0ddd8] w-full" />
                              <div className="border-b border-[#e0ddd8] w-full" />
                            </div>
                            {[
                              { label: '월', height: '58%' },
                              { label: '화', height: '62%' },
                              { label: '수', height: '65%' },
                              { label: '목', height: '54%' },
                              { label: '금', height: '60%' },
                              { label: '토', height: '50%' },
                              { label: '일', height: '61%', active: true },
                            ].map((item, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1 z-15 w-6">
                                <div className="w-full flex justify-center items-end h-16">
                                  <div 
                                    style={{ height: item.height }}
                                    className={`w-2.5 rounded-t-xs transition-all duration-500 ${
                                      item.active 
                                        ? 'bg-gradient-to-t from-[#1c1c14] to-[#2d7a3a] shadow-[0_0_8px_rgba(79,70,229,0.25)]' 
                                        : 'bg-[#1c1c14]'
                                    }`}
                                  />
                                </div>
                                <span className={`text-[11px] font-bold ${item.active ? 'text-[#1c1c14] font-semibold' : 'text-[#9a9a86]'}`}>
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Category job share donut indicator */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
                            <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#f7f6f2] p-3 rounded-xl border border-[#e0ddd8] min-h-[120px]">
                              <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="30"
                                    fill="transparent"
                                    stroke="#e0ddd8"
                                    strokeWidth="6"
                                  />
                                  {/* 45% Indigo */}
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="30"
                                    fill="transparent"
                                    stroke="#5a6e38"
                                    strokeWidth="6"
                                    strokeDasharray="84.823 188.4955"
                                    strokeDashoffset="0"
                                  />
                                  {/* 25% Emerald */}
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="30"
                                    fill="transparent"
                                    stroke="#2d7a3a"
                                    strokeWidth="6"
                                    strokeDasharray="47.124 188.4955"
                                    strokeDashoffset="-84.823"
                                  />
                                  {/* 15% Amber */}
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="30"
                                    fill="transparent"
                                    stroke="#c4674a"
                                    strokeWidth="6"
                                    strokeDasharray="28.274 188.4955"
                                    strokeDashoffset="-131.947"
                                  />
                                  {/* 15% Slate */}
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="30"
                                    fill="transparent"
                                    stroke="#9a9a86"
                                    strokeWidth="6"
                                    strokeDasharray="28.274 188.4955"
                                    strokeDashoffset="-160.221"
                                  />
                                </svg>
                                <div className="absolute text-center z-10 font-sans">
                                  <span className="text-[11px] text-[#9a9a86] font-semibold block leading-none">측정 기간</span>
                                  <span className="text-[11px] font-semibold text-[#1c1c14] block mt-0.5 leading-none">1주일</span>
                                  <span className="text-[11px] font-semibold text-[#1c1c14] font-mono mt-0.5 block leading-none">(7일간)</span>
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-7 space-y-1.5">
                              {[
                                { name: '개발 및 엔지니어링 (DB튜닝)', pct: '45%', color: 'bg-[#5a6e38]' },
                                { name: 'OAuth 인증 및 마이그레이션', pct: '25%', color: 'bg-[#2d7a3a]' },
                                { name: '시스템 밸런스 점검', pct: '15%', color: 'bg-[#c4674a]' },
                                { name: '개인 정비 및 정적 검사', pct: '15%', color: 'bg-[#f7f6f2]' },
                              ].map((dept, idx) => (
                                <div key={idx} className="space-y-0.5">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-[#6b6b58] font-bold truncate max-w-[140px]">{dept.name}</span>
                                    <span className="font-mono text-[#1c1c14] font-semibold">{dept.pct}</span>
                                  </div>
                                  <div className="w-full h-1 bg-[#f7f6f2] rounded-full overflow-hidden">
                                    <div className={`h-full ${dept.color} rounded-full`} style={{ width: dept.pct }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : post.attachedType === 'hourly_heatmap' ? (
                      <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left text-[#1c1c14] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38] animate-pulse" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: HOURLY ACTIVITY HEATMAP</span>
                          </div>
                          <span className="text-[11px] bg-[#edecea] border border-[#9a9a86] text-[#1c1c14] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono hover:bg-[#e0ddd8] transition-colors">
                            <Activity className="w-3 h-3 text-[#1c1c14]" />
                            <span>시간대별 히트맵</span>
                          </span>
                        </div>

                        {/* Rendering a gorgeous mini 4x7 grid activity representation */}
                        <div className="bg-white p-4.5 rounded-xl border border-[#e0ddd8]/65 shadow-3xs space-y-3.5">
                          <div className="flex items-center justify-between text-[11px] text-[#9a9a86] font-bold border-b border-[#e0ddd8] pb-2">
                            <span>요일별 시간대 가동 밀도</span>
                            <div className="flex items-center gap-1 text-[11px] text-[#9a9a86] font-medium">
                              <span>Low</span>
                              <span className="w-2 h-2 bg-[#f7f6f2] rounded-[2px]" />
                              <span className="w-2 h-2 bg-[#9a9a86]" />
                              <span className="w-2 h-2 bg-[#1c1c14]" />
                              <span className="w-2 h-2 bg-[#5a6e38]" />
                              <span>High</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-8 gap-y-1.5 gap-x-1 font-sans">
                            <div className="col-span-1" />
                            <div className="col-span-7 grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-[#9a9a86] pb-1">
                              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>

                            {[
                              { hour: '09:00', vals: [80, 10, 90, 30, 75, 0, 0] },
                              { hour: '12:00', vals: [20, 60, 45, 85, 95, 10, 0] },
                              { hour: '15:00', vals: [95, 90, 15, 60, 40, 0, 5] },
                              { hour: '18:00', vals: [40, 15, 80, 95, 30, 20, 0] },
                            ].map((row, rIdx) => (
                              <React.Fragment key={rIdx}>
                                <div className="col-span-1 text-right text-[12px] font-mono font-bold text-[#9a9a86] self-center pr-1.5">
                                  {row.hour}
                                </div>
                                <div className="col-span-7 grid grid-cols-7 gap-1">
                                  {row.vals.map((v, cIdx) => {
                                    let cellBg = 'bg-[#f7f6f2]';
                                    if (v > 0 && v <= 30) cellBg = 'bg-[#edecea] border-[#e0ddd8]/30';
                                    else if (v > 30 && v <= 65) cellBg = 'bg-[#9a9a86] border-[#9a9a86]/30';
                                    else if (v > 65 && v <= 85) cellBg = 'bg-[#1c1c14] border-[#e0ddd8]/30';
                                    else if (v > 85) cellBg = 'bg-[#5a6e38] border-[#4a5c2e]';
                                    return (
                                      <div 
                                        key={cIdx} 
                                        className={`aspect-square rounded-[2px] border ${cellBg}`}
                                        title={`가동지표: ${v}%`}
                                      />
                                    );
                                  })}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : post.attachedType === 'category_share' ? (
                      <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left text-[#1c1c14] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#5a6e38] animate-pulse" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: COMPREHENSIVE CATEGORY DISTRIBUTION</span>
                          </div>
                          <span className="text-[11px] bg-[#edecea] border border-[#9a9a86] text-[#1c1c14] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono hover:bg-[#e0ddd8]/60 transition-all">
                            <PieChart className="w-3 h-3 text-[#1c1c14]" />
                            <span>업무 밸런스 점유율</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-white p-4.5 rounded-xl border border-[#e0ddd8]/60 shadow-3xs">
                          <div className="sm:col-span-4 flex justify-center">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="30" fill="transparent" stroke="#e0ddd8" strokeWidth="6" />
                                <circle cx="40" cy="40" r="30" fill="transparent" stroke="#5a6e38" strokeWidth="6" strokeDasharray="94.24 188.49" strokeDashoffset="0" />
                                <circle cx="40" cy="40" r="30" fill="transparent" stroke="#2d7a3a" strokeWidth="6" strokeDasharray="56.54 188.49" strokeDashoffset="-94.24" />
                                <circle cx="40" cy="40" r="30" fill="transparent" stroke="#c4674a" strokeWidth="6" strokeDasharray="37.7 188.49" strokeDashoffset="-150.78" />
                              </svg>
                              <div className="absolute text-center">
                                <span className="text-[11px] text-[#9a9a86] font-semibold block">비율 분포</span>
                                <span className="text-[11px] font-semibold text-[#1c1c14] block">밸런스</span>
                              </div>
                            </div>
                          </div>
                          <div className="sm:col-span-8 space-y-2.5">
                            {[
                              { name: '개발 및 엔지니어링 (Core Work)', pct: '50%', color: 'bg-[#5a6e38]' },
                              { name: '기술 연구 및 마이그레이션 (Study)', pct: '30%', color: 'bg-[#2d7a3a]' },
                              { name: '행정 지원 및 리팩터링 (Admin)', pct: '20%', color: 'bg-[#c4674a]' },
                            ].map((item, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[12px]">
                                  <span className="font-semibold text-[#6b6b58]">{item.name}</span>
                                  <span className="font-mono font-semibold text-[#1c1c14]">{item.pct}</span>
                                </div>
                                <div className="w-full h-1 bg-[#f7f6f2] rounded-full overflow-hidden">
                                  <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : post.attachedType === 'failure_pattern' ? (
                      <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-5 rounded-xl shadow-xs font-sans w-full text-left text-[#1c1c14] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e0ddd8] pb-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#c4674a] animate-pulse" />
                            <span className="text-[11px] font-semibold tracking-wide text-[#6b6b58] font-mono">DASHBOARD SCREENSHOT: COGNITIVE INTERFERENCE DIAGNOSIS</span>
                          </div>
                          <span className="text-[11px] bg-[#f8ede8] border border-[#e8c0b0] text-[#c4674a] font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                            <Sparkles className="w-3 h-3 text-[#c4674a] animate-spin" style={{ animationDuration: '3s' }} />
                            <span>실패 패턴 분석</span>
                          </span>
                        </div>

                        <div className="bg-white p-4.5 rounded-xl border border-[#e0ddd8]/60 shadow-3xs space-y-3.5">
                          <div>
                            <span className="text-[12px] font-semibold text-[#c4674a] block">주간 주요 실패 유도 패턴</span>
                            <span className="text-[12px] font-semibold text-[#1c1c14] block mt-1">"시작 전 과다 리서치에 의한 인지적 주저현상" (84% 가중치)</span>
                            <p className="text-[11px] text-[#6b6b58] font-bold leading-relaxed mt-1.5">
                              할 일을 작은 마일스톤 단위로 구체화하지 않고 관망하면 시작 단계에서 인지 피로를 겪습니다. 15분 스프린트 시작 요법을 추천합니다.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
                            <div className="bg-[#f7f6f2] p-2.5 rounded-xl border border-[#e0ddd8]">
                              <span className="text-[11px] font-bold text-[#9a9a86] block uppercase">가장 큰 방해요인</span>
                              <span className="text-[11px] font-semibold text-[#1c1c14] block mt-0.5">SNS 및 기타 메신저 알림 (42%)</span>
                            </div>
                            <div className="bg-[#f7f6f2] p-2.5 rounded-xl border border-[#e0ddd8]">
                              <span className="text-[11px] font-bold text-[#1c1c14] block uppercase">권장 개선 방법</span>
                              <span className="text-[11px] font-semibold text-[#1c1c14] block mt-0.5">30분 강제 집중 뽀모도로 가동</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : post.id === 'post-1' ? (
                      <div className="rounded-xl overflow-hidden border border-[#e0ddd8] bg-[#f7f6f2] max-h-[220px] md:max-h-[300px] w-full flex items-center justify-center shadow-xs relative group">
                        <img 
                          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop" 
                          alt="인증 이미지" 
                          className="w-full h-48 md:h-64 object-cover select-none group-hover:scale-[1.01] transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3.5 flex items-center justify-between text-white text-[12px]">
                          <span className="font-semibold flex items-center gap-1.5 leading-none drop-shadow-md">
                            <Sparkles className="w-3.5 h-3.5 text-[#c4674a] fill-amber-400" />
                            <span>15분 오토-슬라이싱 완료 & 전술 가동 자축인증</span>
                          </span>
                          <span className="text-[11px] bg-[#5a6e38] font-mono font-bold px-2 py-0.5 rounded leading-none border border-[#9a9a88]">
                            CERTIFIED
                          </span>
                        </div>
                      </div>
                    ) : (
                      renderDashboardScreenshot(post.id)
                    )}

                    {/* Shared To-Do Lists visual checklist cards */}
                    {post.sharedTasks && post.sharedTasks.length > 0 && (
                      <div className="bg-[#f7f6f2] border border-[#e0ddd8]/80 p-3.5 rounded-xl space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#e0ddd8]">
                          <span className="text-[11px] font-mono font-semibold text-[#6b6b58] uppercase tracking-wider block">
                            SHARED TO-DO WORKFLOW ({post.sharedTasks.length}개)
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleCopyTasks(post.sharedTasks)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edecea] hover:bg-[#5a6e38]/10 border border-[#9a9a86] hover:border-[#e0ddd8] rounded-lg text-[11px] font-semibold text-[#1c1c14] transition-all cursor-pointer shadow-xs active:scale-95"
                            title="이 사용자의 계획 리스트를 내 할 일 목록 탭으로 복사 영입합니다."
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#1c1c14]" />
                            <span>내 To-Do 목록으로 공유받기</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {post.sharedTasks.map((task, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-start gap-2 p-2 rounded-lg border text-left transition-all ${
                                task.completed 
                                  ? 'bg-[#2d7a3a]/5 border-[#2d7a3a]/10 text-[#2d7a3a]/90' 
                                  : 'bg-white border-[#e0ddd8] text-[#6b6b58]'
                              }`}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2d7a3a] shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-[#9a9a86] shrink-0 mt-0.5" />
                              )}
                              <span className={`text-[12px] font-bold leading-tight ${task.completed ? 'line-through opacity-85' : ''}`}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Button Metrics (Likes, Comments switcher) */}
                  <div className="flex items-center gap-4 border-t border-[#e0ddd8] mt-4.5 pt-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        post.likedByCurrentUser 
                          ? 'text-[#c4674a]' 
                          : 'text-[#6b6b58] hover:text-[#c4674a]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 transition-transform active:scale-130 ${post.likedByCurrentUser ? 'fill-rose-500 text-[#c4674a] animate-bounce' : ''}`} />
                      <span>좋아요 {post.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-[#6b6b58] hover:text-[#1c1c14] transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>댓글 {post.comments.length}개 {expandedComments[post.id] ? '(닫기)' : '(열기)'}</span>
                    </button>
                  </div>

                  {/* Comments expanded sub-frame */}
                  {expandedComments[post.id] && (
                    <div className="mt-3.5 pt-3.5 border-t border-[#e0ddd8] space-y-3 bg-[#f7f6f2]/50 p-3 rounded-xl">
                      
                      {/* Comments feed list */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2.5">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="text-[12px] leading-relaxed text-left flex items-start gap-2 bg-white px-2.5 py-2 rounded-lg border border-[#e0ddd8]">
                              <div className="w-5 h-5 rounded-full bg-[#5a6e38]/10 text-[#1c1c14] flex items-center justify-center text-[11px] font-semibold shrink-0">
                                {comment.author.charAt(0)}
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                  <strong className="text-[#1c1c14] font-bold">{comment.author}</strong>
                                  <span className="text-[11px] text-[#6b6b58]">{comment.time}</span>
                                </div>
                                <p className="text-[#6b6b58] mt-0.5 leading-normal font-semibold font-sans">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Draft form inputs */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => handleCommentKeyDown(e, post.id)}
                          placeholder="응원의 한마디나 꿀팁 코멘트를 달아보세요..."
                          className="flex-grow text-[11px] bg-white border border-[#e0ddd8] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#e0ddd8] text-left"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all flex items-center gap-1 cursor-pointer ${
                            commentInputs[post.id]?.trim() 
                              ? 'bg-[#5a6e38] hover:bg-[#3228cc]' 
                              : 'bg-[#f7f6f2] pointer-events-none'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>작성</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Guide and System Stats Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Productivity Board Top Learners */}
          <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 text-left space-y-4 font-sans">
            <div className="flex items-center gap-1.5 pb-1 border-b border-[#e0ddd8]">
              <TrendingUp className="w-4 h-4 text-[#1c1c14]" />
              <h3 className="text-xs font-semibold text-[#1c1c14] font-display uppercase tracking-tight">이번 주 완수 랭킹</h3>
            </div>

            <div className="space-y-3">
              {/* Leader 1 */}
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#e0ddd8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f8ede8] text-[#c4674a] flex items-center justify-center text-[11px] font-bold border border-[#e8c0b0] shrink-0">
                    1st
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#1c1c14] block">박도현</span>
                    <span className="text-[11px] text-[#9a9a86] block font-bold">주간 완수율 96%</span>
                  </div>
                </div>
                
                <span className="text-[11px] text-[#6b6b58] font-bold font-mono">12회 연속 성공</span>
              </div>

              {/* Leader 2 */}
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#e0ddd8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f7f6f2] text-[#6b6b58] flex items-center justify-center text-[11px] font-bold border border-[#e0ddd8] shrink-0">
                    2nd
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#1c1c14] block">이혜린</span>
                    <span className="text-[11px] text-[#9a9a86] block font-bold">주간 완수율 92%</span>
                  </div>
                </div>
                
                <span className="text-[11px] text-[#6b6b58] font-bold font-mono">8회 연속 성공</span>
              </div>

              {/* Leader 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f8ede8]/40 text-[#c4674a] flex items-center justify-center text-[11px] font-bold border border-[#e8c0b0] shrink-0">
                    3rd
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#1c1c14] block">이현우 (나)</span>
                    <span className="text-[11px] text-[#9a9a86] block font-bold">주간 완수율 {user.successRate || 85}%</span>
                  </div>
                </div>
                
                <span className="text-[11px] text-[#6b6b58] font-bold font-mono">{user.streak || 5}회 연속 성공</span>
              </div>
            </div>
          </div>

          {/* Productivity Board Top Likes */}
          <div className="bg-white border border-[#e0ddd8] rounded-xl p-5 text-left space-y-4 font-sans">
            <div className="flex items-center gap-1.5 pb-1 border-b border-[#e0ddd8]">
              <Heart className="w-4 h-4 text-[#c4674a] fill-rose-500" />
              <h3 className="text-xs font-semibold text-[#1c1c14] font-display uppercase tracking-tight">이번 주 좋아요 랭킹</h3>
            </div>

            <div className="space-y-3">
              {/* Leader 1 */}
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#e0ddd8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f8ede8] text-[#c4674a] flex items-center justify-center text-[11px] font-bold border border-[#e8c0b0] shrink-0">
                    1st
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#1c1c14] block">박도현</span>
                    <span className="text-[11px] text-[#9a9a86] block font-bold">누적 응원 좋아요 54개</span>
                  </div>
                </div>
                
                <span className="text-[11px] text-[#c4674a] font-semibold font-mono">인기 피드 메이커</span>
              </div>

              {/* Leader 2 */}
              <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#e0ddd8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f7f6f2] text-[#6b6b58] flex items-center justify-center text-[11px] font-bold border border-[#e0ddd8] shrink-0">
                    2nd
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#1c1c14] block">이혜린</span>
                    <span className="text-[11px] text-[#9a9a86] block font-bold">누적 응원 좋아요 38개</span>
                  </div>
                </div>
                
                <span className="text-[11px] text-[#6b6b58] font-bold font-mono">인기 피드 메이커</span>
              </div>

              {/* Leader 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f8ede8]/40 text-[#c4674a] flex items-center justify-center text-[11px] font-bold border border-[#e8c0b0] shrink-0">
                    3rd
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#1c1c14] block">김완수</span>
                    <span className="text-[11px] text-[#9a9a86] block font-bold">누적 응원 좋아요 25개</span>
                  </div>
                </div>
                
                <span className="text-[11px] text-[#6b6b58] font-bold font-mono">활발한 파트너</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Imported overlay toast notification */}
      {importedToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5a6e38]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-[#e0ddd8]/30 animate-bounce max-w-[340px]">
          <CheckCircle2 className="w-5 h-5 text-[#2d7a3a] shrink-0" />
          <span className="text-xs font-semibold leading-relaxed font-sans">{importedToastMessage}</span>
        </div>
      )}
    </div>
  );
}
