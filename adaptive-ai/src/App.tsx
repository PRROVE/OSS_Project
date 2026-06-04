import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import OnboardingView from './components/OnboardingView';
import DashboardView from './components/DashboardView';
import ToDosView from './components/ToDosView';
import AnalyticsView from './components/AnalyticsView';
import AICoachView from './components/AICoachView';
import SettingsView from './components/SettingsView';
import { ViewType, Todo, UserProfile, Insight, CoachingHistory } from './types';
import { INITIAL_TODOS, INITIAL_INSIGHTS, INITIAL_HISTORY, DEFAULT_USER } from './data';

export default function App() {
  const [view, setView] = useState<ViewType>('login');
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [insights, setInsights] = useState<Insight[]>(INITIAL_INSIGHTS);
  const [history, setHistory] = useState<CoachingHistory[]>(INITIAL_HISTORY);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  // Real-time synchronization logic for task completion checkmarks
  const toggleTodoComplete = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const nextCompleted = !todo.completed;
        return {
          ...todo,
          completed: nextCompleted,
          status: nextCompleted ? 'completed' : 'normal'
        };
      }
      return todo;
    }));
  };

  // Redirection trigger when clicking '+ New Goal' in sidebar or dashboard
  const handleAddNewTodoTrigger = () => {
    setEditingTodoId(null);
    setView('todos');
    
    // Auto focus title input
    setTimeout(() => {
      const inputEl = document.getElementById('title-input');
      if (inputEl) {
        inputEl.focus();
      }
    }, 150);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1b1b24] select-none font-sans overflow-x-hidden w-full">
      
      {/* Universal Desktop/Mobile Sidebar Navigation */}
      <Sidebar
        currentView={view}
        setView={setView}
        user={user}
        onAddNewTodo={handleAddNewTodoTrigger}
      />

      {/* Main Panel Frame Viewports */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 relative">
        
        <LoginView 
          currentView={view} 
          setView={setView} 
          user={user} 
          setUser={setUser} 
        />
        
        <OnboardingView
          currentView={view}
          setView={setView}
          user={user}
          setUser={setUser}
        />

        <DashboardView
          currentView={view}
          setView={setView}
          todos={todos}
          setTodos={setTodos}
          insights={insights}
          user={user}
          toggleTodoComplete={toggleTodoComplete}
          onAddNewTodo={handleAddNewTodoTrigger}
        />

        <ToDosView
          currentView={view}
          todos={todos}
          setTodos={setTodos}
          toggleTodoComplete={toggleTodoComplete}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />

        <AnalyticsView
          currentView={view}
        />

        <AICoachView
          currentView={view}
          todos={todos}
          setTodos={setTodos}
          insights={insights}
          setInsights={setInsights}
          history={history}
          setHistory={setHistory}
          user={user}
        />

        <SettingsView
          currentView={view}
          user={user}
          setUser={setUser}
        />
        
      </div>
    </div>
  );
}
