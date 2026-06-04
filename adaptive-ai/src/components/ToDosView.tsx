import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  Clock, 
  Tag, 
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Todo } from '../types';

interface ToDosViewProps {
  currentView: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  toggleTodoComplete: (id: string) => void;
  registeringTodoRef?: React.RefObject<HTMLFormElement | null>;
  editingTodoId: string | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ToDosView({ 
  currentView, 
  todos, 
  setTodos, 
  toggleTodoComplete,
  editingTodoId,
  setEditingTodoId
}: ToDosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('전체');

  // Form States state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('업무');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [formDate, setFormDate] = useState('오늘');
  const [formTime, setFormTime] = useState('14:00');
  const [formNotes, setFormNotes] = useState('');

  if (currentView !== 'todos') return null;

  // If we start editing a todo, pre-fill form
  const handleInitiateEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setFormTitle(todo.title);
    setFormCategory(todo.category);
    setFormPriority(todo.priority);
    setFormDate(todo.date);
    setFormTime(todo.time);
    setFormNotes(todo.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setFormTitle('');
    setFormCategory('업무');
    setFormPriority('medium');
    setFormDate('오늘');
    setFormTime('14:00');
    setFormNotes('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTodoId) {
      // Editing Mode: Update item
      setTodos(prev => prev.map(t => t.id === editingTodoId ? {
        ...t,
        title: formTitle,
        category: formCategory,
        priority: formPriority,
        date: formDate,
        time: formTime,
        notes: formNotes,
        status: t.completed ? 'completed' : 'normal'
      } : t));
      setEditingTodoId(null);
    } else {
      // Creating Mode: Append new item
      const newTodo: Todo = {
        id: `todo-${Date.now()}`,
        title: formTitle,
        category: formCategory,
        priority: formPriority,
        date: formDate,
        time: formTime,
        completed: false,
        status: 'normal',
        notes: formNotes
      };
      setTodos(prev => [newTodo, ...prev]);
    }

    // Reset Form
    setFormTitle('');
    setFormNotes('');
  };

  const handleActionDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    if (editingTodoId === id) {
      handleCancelEdit();
    }
  };

  // Determine categories to show in quick links
  const availableCategories = ['전체', '업무', '공부', '운동', '건강', '독서', '미팅', '중요'];

  // Filter criteria logic
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (todo.notes && todo.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategoryFilter === '전체' || todo.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group items by Scheduled Date category
  const todayList = filteredTodos.filter(t => t.date === '오늘' && !t.completed);
  const tomorrowAndWeekList = filteredTodos.filter(t => t.date !== '오늘' && !t.completed);
  const completedList = filteredTodos.filter(t => t.completed);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB]">
      <div className="max-w-[1250px] mx-auto flex flex-col gap-6">

        {/* View Header Info */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#1b1b24] tracking-tight">수행 할 일 & 플래너</h2>
          <p className="text-xs text-[#777587] font-semibold mt-1">
            개별 과제들의 주기성, 우발성 및 AI 피드백 상태를 정교하게 모니터링하고 가공할 수 있습니다.
          </p>
        </div>

        {/* View content layout dual-column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 8/12 PANEL: Filters Bar & Todos lists */}
          <main className="lg:col-span-8 flex flex-col gap-5">
            
            {/* Filter controls & Search */}
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
              
              {/* Search textfield */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777587]" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="할 일 제목, 설명 검색..."
                  className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#c7c4d8]/70 rounded-xl text-xs outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]/20 transition-all font-semibold placeholder-[#777587]/60 text-[#1b1b24]"
                />
              </div>

              {/* Horiz line scroll selection category list */}
              <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar py-1">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all border ${
                      activeCategoryFilter === cat
                        ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-sm'
                        : 'bg-white text-[#464555] border-[#E5E7EB] hover:bg-[#f5f2ff] hover:text-[#3525cd]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Structured main checklists stack cards */}
            <div className="flex flex-col gap-5">
              
              {/* 1. 오늘 할 일 */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-1">
                <h3 className="bg-[#fcf8ff] px-5 py-4 border-b border-[#eae6f4] text-xs font-black text-[#3525cd] uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3525cd]" />
                  오늘 할 일 ({todayList.length})
                </h3>
                
                <div className="divide-y divide-[#eae6f4]/60">
                  {todayList.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#777587] font-semibold">
                      오늘 대기 중인 할 일이 없습니다. 축하합니다!
                    </div>
                  ) : (
                    todayList.map((todo) => (
                      <TodoRow 
                        key={todo.id} 
                        todo={todo} 
                        toggleComplete={toggleTodoComplete} 
                        onEdit={handleInitiateEdit} 
                        onDelete={handleActionDelete} 
                      />
                    ))
                  )}
                </div>
              </div>

              {/* 2. 예정된 일 (내일 & 이번 주) */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-1">
                <h3 className="bg-[#fcf8ff] px-5 py-4 border-b border-[#eae6f4] text-xs font-black text-[#464555] uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#464555]" />
                  다가오는 일정 ({tomorrowAndWeekList.length})
                </h3>
                
                <div className="divide-y divide-[#eae6f4]/60">
                  {tomorrowAndWeekList.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#777587] font-semibold">
                      예정된 일정이 없습니다.
                    </div>
                  ) : (
                    tomorrowAndWeekList.map((todo) => (
                      <TodoRow 
                        key={todo.id} 
                        todo={todo} 
                        toggleComplete={toggleTodoComplete} 
                        onEdit={handleInitiateEdit} 
                        onDelete={handleActionDelete} 
                      />
                    ))
                  )}
                </div>
              </div>

              {/* 3. 성공적으로 종료한 일 */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <h3 className="bg-[#f2fcf6] px-5 py-4 border-b border-[#ddf5e7] text-xs font-black text-[#006c49] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#006c49]" />
                  완료된 항목 ({completedList.length})
                </h3>
                
                <div className="divide-y divide-[#eae6f4]/60 bg-[#fafdfb]/25">
                  {completedList.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#777587] font-semibold">
                      완료된 할 일이 아직 없습니다. 한 걸음씩 수행해봐요.
                    </div>
                  ) : (
                    completedList.map((todo) => (
                      <TodoRow 
                        key={todo.id} 
                        todo={todo} 
                        toggleComplete={toggleTodoComplete} 
                        onEdit={handleInitiateEdit} 
                        onDelete={handleActionDelete} 
                      />
                    ))
                  )}
                </div>
              </div>

            </div>

          </main>

          {/* RIGHT 4/12 PANEL: Add or Update Goal/Task Form */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border-2 border-[#dad7ff] p-5 shadow-sm sticky top-6">
            <h3 className="text-md font-extrabold text-[#1b1b24] mb-1.5 flex items-center gap-1.5">
              {editingTodoId ? <Edit3 className="w-4.5 h-4.5 text-[#3525cd]" /> : <Plus className="w-4.5 h-4.5 text-[#3525cd]" />}
              {editingTodoId ? '할 일 정보 수정' : '새 할 일 플래너'}
            </h3>
            <p className="text-[11px] text-[#777587] font-bold mb-5 uppercase tracking-wide">
              {editingTodoId ? 'Selected to-do is ready for changes' : 'Setup custom priorities & categories'}
            </p>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              {/* Title parameter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" htmlFor="title-input">목표 제목</label>
                <input 
                  type="text" 
                  id="title-input"
                  required
                  placeholder="예: 독서록 및 코드 가이드북 챗봇 구현"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold placeholder-[#777587]/50 bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl focus:border-[#3525cd] outline-none transition-all focus:ring-2 focus:ring-[#3525cd]/15"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" htmlFor="category-select">카테고리</label>
                <select 
                  id="category-select"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl focus:border-[#3525cd] outline-none cursor-pointer text-[#1b1b24]"
                >
                  <option value="업무">💻 업무 (Work)</option>
                  <option value="공부">📚 공부 (Study)</option>
                  <option value="운동">🏃 운동 (Exercise)</option>
                  <option value="건강">❤️ 건강 (Health)</option>
                  <option value="독서">📖 독서 (Reading)</option>
                  <option value="취미">🎨 취미 (Hobby)</option>
                  <option value="명상">🧘 명상 (Meditation)</option>
                  <option value="미팅">👥 미팅 (Meetings)</option>
                  <option value="중요">🔥 중요 (Priority Urgent)</option>
                </select>
              </div>

              {/* Priority select horizontal array */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" id="prio-label">우선 순위</span>
                <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="prio-label">
                  {(['high', 'medium', 'low'] as const).map((p) => {
                    const label = p === 'high' ? '높음' : p === 'medium' ? '중간' : '낮음';
                    const activeStyles = p === 'high' 
                      ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-sm' 
                      : p === 'medium' 
                      ? 'bg-[#684000] text-white border-[#684000] shadow-sm' 
                      : 'bg-[#464555] text-white border-[#464555] shadow-sm';
                    const passiveStyles = 'bg-white text-[#464555] border-[#E5E7EB] hover:bg-[#F9FAFB]';
                    const isMatched = formPriority === p;

                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setFormPriority(p)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          isMatched ? activeStyles : passiveStyles
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scheduled Date selection */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" id="date-label">목표 설정일</span>
                <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="date-label">
                  {['오늘', '내일', '이번 주'].map((d) => {
                    const isMatched = formDate === d;
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setFormDate(d)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          isMatched 
                            ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-sm' 
                            : 'bg-white text-[#464555] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time parameter input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" htmlFor="time-input">수행 시간</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777587]" />
                  <input 
                    type="text" 
                    id="time-input"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-mono font-bold bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]/20" 
                    placeholder="HH:MM (예: 14:00)"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Notes / Memos text area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider ml-0.5" htmlFor="notes-area">메모 및 세부 규칙</label>
                <textarea 
                  id="notes-area"
                  rows={2.5}
                  placeholder="달성을 보조하기 위한 작은 실천 약속을 메모하세요."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold placeholder-[#777587]/50 bg-[#F9FAFB] border border-[#c7c4d8] rounded-xl focus:border-[#3525cd] outline-none focus:ring-2 focus:ring-[#3525cd]/15 resize-none"
                />
              </div>

              {/* Submit panel or Reset modifier tags */}
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  type="submit"
                  className="py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#3525cd] text-white font-extrabold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#3525cd]/15 cursor-pointer"
                >
                  <span>{editingTodoId ? '변경사항 업데이트' : '새 목표 등록 등록기'}</span>
                </button>

                {editingTodoId && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-2.5 rounded-xl bg-white border border-[#c7c4d8] text-[#464555] font-bold text-xs hover:bg-[#F9FAFB] transition-all cursor-pointer"
                  >
                    수정 취소
                  </button>
                )}
              </div>

            </form>
          </aside>

        </div>

      </div>
    </div>
  );
}

// Inner helper component for Todo row representing clean card elements
interface TodoRowProps {
  key?: string;
  todo: Todo;
  toggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

function TodoRow({ todo, toggleComplete, onEdit, onDelete }: TodoRowProps) {
  let badgeClasses = 'bg-[#f0ecf9] text-[#3525cd]';
  if (todo.category === '운동') badgeClasses = 'bg-[#eae6f4] text-[#464555]';
  if (todo.category === '미팅') badgeClasses = 'bg-[#006c49]/10 text-[#006c49]';
  if (todo.category === '건강') badgeClasses = 'bg-[#ffdad6] text-[#ba1a1a]';
  if (todo.category === '공부') badgeClasses = 'bg-[#fff5ee] text-[#a0522d]';

  return (
    <div className="group flex items-center justify-between p-4 bg-white hover:bg-[#f0ecf9]/20 font-sans transition-all duration-150">
      <div className="flex items-center gap-4 flex-1">
        
        {/* Real Dynamic functional checkbox */}
        <input 
          type="checkbox" 
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="w-5 h-5 rounded-md border-2 border-[#c7c4d8]/80 text-[#3525cd] focus:ring-[#3525cd]/25 accent-[#3525cd] shrink-0 cursor-pointer"
        />

        {/* Text stack details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-[13px] font-bold ${
              todo.completed ? 'text-[#777587] line-through font-medium' : 'text-[#1b1b24]'
            }`}>
              {todo.title}
            </span>
            
            {/* Missed failure alert indicators */}
            {todo.status === 'failed' && !todo.completed && (
              <span className="px-1.5 py-0.5 bg-[#ffdad6] text-[#ba1a1a] text-[10px] rounded-md font-bold flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3 text-[#ba1a1a]" />
                실패
              </span>
            )}
          </div>

          {todo.notes && (
            <p className="text-[11px] text-[#777587] mt-0.5 font-medium line-clamp-1">{todo.notes}</p>
          )}
        </div>
      </div>

      {/* Badges, info details and action icons on hover state */}
      <div className="flex items-center gap-4.5">
        
        {/* Standard tags */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Priority indicator widget */}
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            todo.priority === 'high' 
              ? 'bg-[#ffdad6] text-[#ba1a1a]' 
              : todo.priority === 'medium' 
              ? 'bg-[#ffe082]/60 text-[#684000]' 
              : 'bg-[#eeeeee] text-[#616161]'
          }`}>
            {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '중간' : '낮음'}
          </span>

          {/* Category indicator tag */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeClasses}`}>
            {todo.category}
          </span>
          
          {/* Date reference indicator */}
          <span className="text-[10px] font-bold text-[#777587] px-1 bg-[#F9FAFB] rounded border border-[#E5E7EB]">
            {todo.date}
          </span>
        </div>

        {/* Time code mapping */}
        <span className="text-xs font-mono font-medium text-[#777587] flex items-center gap-1 w-12 justify-end shrink-0">
          <Clock className="w-3 h-3 text-[#777587]/70" />
          {todo.time}
        </span>

        {/* Hidden action panel revealed during mouse hovers */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0 select-none">
          <button 
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg text-[#464555] hover:bg-[#eae6f4] hover:text-[#3525cd] transition-all cursor-pointer"
            title="수정하기"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          
          <button 
            type="button"
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-[#ba1a1a]/80 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all cursor-pointer"
            title="삭제하기"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
