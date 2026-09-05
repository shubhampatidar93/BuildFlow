import React, { useState, useMemo } from 'react';
import {
  Kanban,
  Map,
  Users,
  BarChart3,
  Bot,
  Layout,
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
  Send,
  Loader2,
  Filter,
  Check,
  Activity,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Flame,
  ArrowRight,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Project,
  ProjectPhase,
  ProjectTask,
  TaskStatus,
  TeamMember,
  ProjectActivity,
  MentorMessage
} from '../types';
import { calculateProjectAnalytics, getSmartNextTask } from '../lib/taskIntelligence';

interface ProjectWorkspaceViewProps {
  project: Project;
  phases: ProjectPhase[];
  tasks: ProjectTask[];
  team: TeamMember[];
  activities: ProjectActivity[];
  mentorMessages: MentorMessage[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenTaskModal: (task: ProjectTask) => void;
  onSendMentorMessage: (prompt: string) => Promise<void>;
  isSendingMentorMessage: boolean;
  initialTab?: string;
  onAssignTask: (taskId: string, memberName: string) => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceViewProps> = ({
  project,
  phases,
  tasks,
  team,
  activities,
  mentorMessages,
  onUpdateTaskStatus,
  onOpenTaskModal,
  onSendMentorMessage,
  isSendingMentorMessage,
  initialTab = 'overview',
  onAssignTask
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mentorInput, setMentorInput] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('ALL');

  // Real dynamic task analytics & health
  const analytics = useMemo(() => {
    return calculateProjectAnalytics(tasks, phases, project.deadline, project.startDate);
  }, [tasks, phases, project.deadline, project.startDate]);

  // Days left calculation from intelligence
  const daysLeft = analytics.daysRemaining;

  // Filtered tasks for task board
  const filteredTasks = useMemo(() => {
    if (selectedPhaseFilter === 'ALL') return tasks;
    return tasks.filter(t => t.phaseId === selectedPhaseFilter || t.phase === selectedPhaseFilter);
  }, [tasks, selectedPhaseFilter]);

  // Next Best Task Logic with reasoning
  const smartNext = useMemo(() => {
    return getSmartNextTask(tasks, phases, analytics.currentPhaseTitle, analytics.daysRemaining);
  }, [tasks, phases, analytics.currentPhaseTitle, analytics.daysRemaining]);

  const nextBestTask = smartNext?.task || tasks.find(t => t.status === 'IN PROGRESS') || tasks.find(t => t.status === 'NOT STARTED') || tasks[0];

  // Tasks grouped by Status for Kanban
  const kanbanColumns = useMemo(() => {
    return {
      'NOT STARTED': filteredTasks.filter(t => t.status === 'NOT STARTED'),
      'IN PROGRESS': filteredTasks.filter(t => t.status === 'IN PROGRESS'),
      'COMPLETED': filteredTasks.filter(t => t.status === 'COMPLETED'),
      'BLOCKED': filteredTasks.filter(t => t.status === 'BLOCKED')
    };
  }, [filteredTasks]);

  // Analytics Chart Data
  const statusPieData = useMemo(() => {
    return [
      { name: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length, color: '#34D399' },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'IN PROGRESS').length, color: '#6C63FF' },
      { name: 'To Do', value: tasks.filter(t => t.status === 'NOT STARTED').length, color: '#94A3B8' },
      { name: 'Blocked', value: tasks.filter(t => t.status === 'BLOCKED').length, color: '#FB7185' }
    ].filter(d => d.value > 0);
  }, [tasks]);

  const phaseProgressData = useMemo(() => {
    return phases.map(p => {
      const pTasks = tasks.filter(t => t.phaseId === p.id || t.phase === p.title);
      const completed = pTasks.filter(t => t.status === 'COMPLETED').length;
      const total = pTasks.length || 1;
      return {
        name: p.title.split(':')[0] || p.title,
        completed,
        total,
        percent: Math.round((completed / total) * 100)
      };
    });
  }, [phases, tasks]);

  const burnDownData = useMemo(() => {
    const total = analytics.totalTasks || 20;
    const completed = analytics.completedTasks || 0;
    const step = Math.max(1, Math.round(total / 5));
    return [
      { day: 'Day 1', completed: 0, target: Math.round(step * 0.5) },
      { day: 'Day 5', completed: Math.min(completed, Math.round(step * 1.2)), target: Math.round(step * 1.5) },
      { day: 'Day 10', completed: Math.min(completed, Math.round(step * 2.2)), target: Math.round(step * 2.6) },
      { day: 'Day 15', completed: Math.min(completed, Math.round(step * 3.2)), target: Math.round(step * 3.6) },
      { day: 'Current', completed: completed, target: Math.min(total, Math.round(step * 4.2)) },
      { day: 'Final Viva', completed: null, target: total }
    ];
  }, [analytics.totalTasks, analytics.completedTasks]);

  const handleSendMentor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = mentorInput.trim();
    if (!clean || isSendingMentorMessage) return;
    setMentorInput('');
    await onSendMentorMessage(clean);
  };

  const handleChipClick = (text: string) => {
    setMentorInput(text);
  };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const currentPhaseTasks = tasks.filter(t => t.phase === project.currentPhase || t.phaseId === 'phase-4');
  const currentPhaseDone = currentPhaseTasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-14">
      {/* WORKSPACE HEADER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-[#263247] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] bg-[#0D1220] px-2.5 py-0.5 rounded border border-[#263247]">
                PROJECT WORKSPACE
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                ● {project.health || 'ON TRACK'}
              </span>
              <span className="text-xs text-[#94A3B8] flex items-center gap-1 ml-1">
                <Calendar className="h-3 w-3 text-[#22D3EE]" />
                <span>{daysLeft} DAYS LEFT</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {project.title}
            </h1>
          </div>

          {/* Quick Progress Indicator */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-[#94A3B8] block">Overall</span>
              <span className="text-xl font-extrabold text-[#22D3EE]">{project.progress}% COMPLETE</span>
            </div>
            <div className="w-24 sm:w-32 h-2.5 rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
              <div
                className="h-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#263247] pt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Layout },
            { id: 'roadmap', label: 'Roadmap', icon: Map },
            { id: 'tasks', label: 'Tasks', icon: Kanban, count: tasks.length },
            { id: 'team', label: 'Team', icon: Users, count: team.length || 3 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'mentor', label: 'AI Mentor', icon: Bot, isSpecial: true }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`workspace-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D1220]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${tab.isSpecial && !isActive ? 'text-[#22D3EE]' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-[#0D1220] text-[#94A3B8]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Phase & Smart Task Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CURRENT PHASE CARD */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#263247]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  CURRENT PHASE
                </span>
                <span className="text-[10px] font-bold text-[#22D3EE] bg-[#0D1220] px-2 py-0.5 rounded border border-[#263247]">
                  {analytics.currentPhasePercent}% Done
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {analytics.currentPhaseTitle}
              </h3>
              <p className="text-xs text-[#34D399] mt-2 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{analytics.currentPhaseDoneTasks} / {analytics.currentPhaseTotalTasks} phase tasks completed</span>
              </p>
              <div className="mt-3 w-full h-1.5 rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
                <div
                  className="h-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE]"
                  style={{ width: `${analytics.currentPhasePercent}%` }}
                />
              </div>
            </div>

            {/* NEXT BEST TASK CARD */}
            {nextBestTask && (
              <div className="p-5 rounded-2xl bg-[#111827] border border-[#6C63FF]/40 shadow-[0_0_20px_rgba(108,99,255,0.12)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>SMART RECOMMENDED TASK</span>
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    ~{nextBestTask.estimatedHours || 2} hours
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {nextBestTask.title}
                </h3>
                {smartNext?.reasoning ? (
                  <p className="text-xs text-[#22D3EE]/90 mt-1 line-clamp-1 italic">
                    💡 {smartNext.reasoning}
                  </p>
                ) : (
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                    {nextBestTask.deliverable ? `Deliverable: ${nextBestTask.deliverable}` : nextBestTask.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => onOpenTaskModal(nextBestTask)}
                    className="text-xs font-semibold text-[#CBD5E1] hover:text-[#22D3EE] transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onUpdateTaskStatus(nextBestTask.id, 'IN PROGRESS')}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-semibold hover:opacity-95 shadow-sm"
                  >
                    {nextBestTask.status === 'IN PROGRESS' ? 'Continue Task →' : 'Start Task →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Execution Phases Progress Bars */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
            <h3 className="text-base font-bold text-[#F8FAFC] mb-4">
              Execution Phases ({phases.length})
            </h3>
            <div className="space-y-3.5">
              {phases.map(p => {
                const pTasks = tasks.filter(t => t.phaseId === p.id || t.phase === p.title);
                const completed = pTasks.filter(t => t.status === 'COMPLETED').length;
                const total = pTasks.length || 1;
                const percent = Math.round((completed / total) * 100);

                return (
                  <div key={p.id} className="p-3.5 rounded-xl bg-[#0D1220] border border-[#263247]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#F8FAFC]">{p.title}</span>
                      <span className="text-[#22D3EE] font-bold">
                        {completed} / {total} tasks ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
                      <div
                        className="h-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Activity Log Stream */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE]">
                  AUDIT & PROGRESS STREAM
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Live Project Activity Log
                </h3>
              </div>
              <span className="text-xs text-[#94A3B8]">
                {activities.length} recorded events
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-[#94A3B8]/60 italic py-3 text-center">No recorded activity yet.</p>
              ) : (
                activities.map(act => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-[#0D1220] border border-[#263247] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-[#6C63FF] shrink-0" />
                      <span className="text-[#F8FAFC] font-medium truncate">
                        {act.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[10px] text-[#94A3B8]">
                      {act.author && (
                        <span className="font-semibold text-[#CBD5E1] bg-[#111827] px-2 py-0.5 rounded border border-[#263247]">
                          {act.author}
                        </span>
                      )}
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROADMAP (Vertical Project Journey) */}
      {activeTab === 'roadmap' && (
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE]">
              EXECUTION MILESTONES
            </span>
            <h2 className="text-xl font-bold text-[#F8FAFC] mt-0.5">
              Vertical Project Journey
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              From foundational literature research to code deliverables and dissertation defense.
            </p>
          </div>

          <div className="relative border-l-2 border-[#263247] ml-4 space-y-8 pl-6">
            {phases.map((p, idx) => {
              const pTasks = tasks.filter(t => t.phaseId === p.id || t.phase === p.title);
              const completed = pTasks.filter(t => t.status === 'COMPLETED').length;
              const isCurrent = p.status === 'IN PROGRESS';
              const isFinished = p.status === 'COMPLETED';

              return (
                <div key={p.id} className="relative group">
                  {/* Circle marker on timeline line */}
                  <div
                    className={`absolute -left-[33px] top-1.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isFinished
                        ? 'bg-[#34D399] border-[#34D399] text-black'
                        : isCurrent
                        ? 'bg-[#6C63FF] border-[#22D3EE] text-white shadow-[0_0_12px_rgba(108,99,255,0.6)] animate-pulse'
                        : 'bg-[#080B14] border-[#263247] text-[#94A3B8]'
                    }`}
                  >
                    {isFinished ? (
                      <Check className="h-3 w-3 stroke-[3]" />
                    ) : (
                      <span className="text-[9px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#0D1220] border-[#6C63FF]/50 shadow-[0_0_20px_rgba(108,99,255,0.1)]'
                        : isFinished
                        ? 'bg-[#0D1220] border-[#34D399]/30'
                        : 'bg-[#0D1220]/60 border-[#263247]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#F8FAFC]">
                          {p.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isFinished
                              ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30'
                              : isCurrent
                              ? 'bg-[#6C63FF]/20 text-[#22D3EE] border-[#6C63FF]/40'
                              : 'bg-[#111827] text-[#94A3B8] border-[#263247]'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#94A3B8]">
                        {completed} of {pTasks.length} tasks completed (~{p.estimatedHours}h)
                      </span>
                    </div>

                    <p className="text-xs text-[#94A3B8] mb-4">
                      {p.description}
                    </p>

                    {/* Phase Tasks list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t border-[#263247]">
                      {pTasks.map(task => {
                        const taskDone = task.status === 'COMPLETED';
                        return (
                          <div
                            key={task.id}
                            onClick={() => onOpenTaskModal(task)}
                            className="p-2.5 rounded-lg bg-[#111827] hover:bg-[#172033] border border-[#263247] flex items-center justify-between gap-2 text-xs cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`h-2 w-2 rounded-full shrink-0 ${
                                  taskDone ? 'bg-[#34D399]' : 'bg-[#94A3B8]'
                                }`}
                              />
                              <span
                                className={`truncate font-medium ${
                                  taskDone ? 'text-[#94A3B8] line-through' : 'text-[#F8FAFC] group-hover:text-[#22D3EE]'
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#94A3B8] shrink-0">
                              {task.estimatedHours}h
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TASK BOARD (KANBAN) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Phase Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#111827] border border-[#263247]">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="h-4 w-4 text-[#22D3EE]" />
              <span className="text-[#94A3B8] font-semibold">Filter Phase:</span>
              <select
                id="tasks-phase-filter-select"
                value={selectedPhaseFilter}
                onChange={e => setSelectedPhaseFilter(e.target.value)}
                className="bg-[#0D1220] border border-[#263247] text-[#F8FAFC] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="ALL">All Phases ({tasks.length} tasks)</option>
                {phases.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-[#94A3B8]">
              Showing <span className="text-[#F8FAFC] font-bold">{filteredTasks.length}</span> tasks • Click card for details
            </div>
          </div>

          {/* Kanban Columns (Horizontally scrollable on mobile) */}
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4">
            {(['NOT STARTED', 'IN PROGRESS', 'COMPLETED', 'BLOCKED'] as TaskStatus[]).map(status => {
              const colTasks = kanbanColumns[status];
              const colStyles = {
                'NOT STARTED': { label: 'TO DO', color: 'border-[#263247] text-[#94A3B8]' },
                'IN PROGRESS': { label: 'IN PROGRESS', color: 'border-[#6C63FF]/50 text-[#22D3EE]' },
                'COMPLETED': { label: 'COMPLETED', color: 'border-[#34D399]/50 text-[#34D399]' },
                'BLOCKED': { label: 'BLOCKED', color: 'border-[#FB7185]/50 text-[#FB7185]' },
              }[status];

              return (
                <div
                  key={status}
                  className="w-72 md:w-auto shrink-0 rounded-2xl bg-[#111827] border border-[#263247] p-4 flex flex-col min-h-[480px]"
                >
                  {/* Column Header */}
                  <div className={`pb-3 mb-3 border-b flex items-center justify-between ${colStyles.color}`}>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {colStyles.label}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0D1220] text-[#F8FAFC] border border-[#263247]">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards list */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                    {colTasks.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#94A3B8]/60 italic">
                        No tasks in this state
                      </div>
                    ) : (
                      colTasks.map(task => (
                        <div
                          key={task.id}
                          id={`kanban-card-${task.id}`}
                          className="p-4 rounded-xl bg-[#0D1220] border border-[#263247] hover:border-[#6C63FF]/40 transition-all shadow-sm space-y-2 group cursor-pointer"
                          onClick={() => onOpenTaskModal(task)}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#22D3EE] font-semibold truncate max-w-[120px]">
                              {task.phase?.split(':')[0]}
                            </span>
                            <span
                              className={`font-semibold px-1.5 py-0.5 rounded border ${
                                task.priority === 'HIGH'
                                  ? 'text-[#FB7185] bg-[#FB7185]/10 border-[#FB7185]/30'
                                  : task.priority === 'MEDIUM'
                                  ? 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30'
                                  : 'text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/30'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors leading-snug line-clamp-2">
                            {task.title}
                          </h4>

                          {task.deliverable && (
                            <p className="text-[11px] text-[#94A3B8] line-clamp-1 flex items-center gap-1">
                              <FileCheck2 className="h-3 w-3 text-[#34D399] shrink-0" />
                              <span>{task.deliverable}</span>
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-[#263247] text-[10px] text-[#94A3B8]">
                            <span>~{task.estimatedHours}h</span>
                            <span className="text-[#CBD5E1] font-medium">
                              {task.assignedTo || 'Unassigned'}
                            </span>
                          </div>

                          {/* Fast Action Buttons */}
                          <div
                            className="pt-1 flex items-center justify-end gap-1.5"
                            onClick={e => e.stopPropagation()}
                          >
                            {status !== 'IN PROGRESS' && status !== 'COMPLETED' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'IN PROGRESS')}
                                className="px-2 py-1 rounded bg-[#111827] text-[#22D3EE] hover:bg-[#172033] text-[10px] font-semibold border border-[#263247]"
                                title="Start Task"
                              >
                                Start
                              </button>
                            )}
                            {status !== 'COMPLETED' ? (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'COMPLETED')}
                                className="px-2 py-1 rounded bg-[#34D399]/10 text-[#34D399] hover:bg-[#34D399]/20 text-[10px] font-semibold border border-[#34D399]/30"
                                title="Mark Completed"
                              >
                                Done
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'NOT STARTED')}
                                className="px-2 py-1 rounded bg-[#111827] text-[#94A3B8] hover:text-white text-[10px] font-semibold border border-[#263247]"
                                title="Reopen Task"
                              >
                                Reopen
                              </button>
                            )}
                            {status !== 'BLOCKED' && status !== 'COMPLETED' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'BLOCKED')}
                                className="px-2 py-1 rounded bg-[#FB7185]/10 text-[#FB7185] hover:bg-[#FB7185]/20 text-[10px] font-semibold border border-[#FB7185]/30"
                                title="Mark Task as Blocked"
                              >
                                Block
                              </button>
                            )}
                            {status === 'BLOCKED' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'IN PROGRESS')}
                                className="px-2 py-1 rounded bg-[#6C63FF]/20 text-[#22D3EE] hover:bg-[#6C63FF]/30 text-[10px] font-semibold border border-[#6C63FF]/40"
                                title="Unblock Task"
                              >
                                Unblock
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: TEAM */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
          <h2 className="text-lg font-bold text-[#F8FAFC] mb-1">
            Team Workload & Contributor Allocation
          </h2>
          <p className="text-xs text-[#94A3B8] mb-6">
            Ensure balanced responsibility distributions across teammates for final project viva evaluation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {team.map(member => {
              const memberTasks = tasks.filter(t => t.assignedTo?.toLowerCase().includes(member.name.split(' ')[0].toLowerCase()));
              const completed = memberTasks.filter(t => t.status === 'COMPLETED').length;
              const total = memberTasks.length || 1;
              const percent = Math.round((completed / total) * 100);

              return (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-[#0D1220] border border-[#263247] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#22D3EE] text-white font-bold text-sm flex items-center justify-center">
                        {member.name[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#F8FAFC]">
                          {member.name}
                        </h3>
                        <p className="text-xs text-[#22D3EE] font-medium">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="my-3 py-2.5 border-y border-[#263247] grid grid-cols-2 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[#94A3B8] block text-[10px]">Tasks</span>
                        <span className="text-base font-bold text-[#F8FAFC]">{memberTasks.length}</span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8] block text-[10px]">Completed</span>
                        <span className="text-base font-bold text-[#34D399]">{completed}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Progress</span>
                        <span className="font-semibold text-[#F8FAFC]">{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
                        <div
                          className="h-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#263247]">
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-1.5">
                      Active Responsibilities:
                    </span>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {memberTasks.slice(0, 3).map(t => (
                        <p key={t.id} className="text-[11px] text-[#CBD5E1] truncate">
                          • {t.title}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* 4 Analytics metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#111827] border border-[#263247]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                PROJECT COMPLETION
              </span>
              <p className="text-2xl font-extrabold text-[#22D3EE] mt-1">
                {analytics.progressPercent}%
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                {analytics.completedTasks} of {analytics.totalTasks} tasks closed
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111827] border border-[#263247]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                PROJECT HEALTH
              </span>
              <p className={`text-2xl font-extrabold mt-1 ${
                analytics.health === 'ON TRACK'
                  ? 'text-[#34D399]'
                  : analytics.health === 'NEEDS ATTENTION'
                  ? 'text-[#FBBF24]'
                  : 'text-[#FB7185]'
              }`}>
                {analytics.health}
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">{analytics.pace}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#111827] border border-[#263247]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                TASK STATUS
              </span>
              <p className="text-2xl font-extrabold text-[#6C63FF] mt-1">
                {analytics.inProgressTasks} <span className="text-xs font-semibold text-[#94A3B8]">active</span>
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                {analytics.blockedTasks} blocked, {analytics.notStartedTasks} to-do
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111827] border border-[#263247]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                EFFORT REMAINING
              </span>
              <p className="text-2xl font-extrabold text-[#FBBF24] mt-1">
                {analytics.estimatedHoursLeft} <span className="text-xs font-semibold text-[#94A3B8]">hours</span>
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Across {analytics.daysRemaining} days remaining
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Burn Down Area Chart */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
              <h3 className="text-sm font-bold text-[#F8FAFC] mb-1">
                Sprint Milestone Burn-down
              </h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                Completed milestone deliverables vs ideal trajectory
              </p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={burnDownData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0D1220', borderColor: '#263247', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeDasharray="3 3" fill="none" />
                    <Area type="monotone" dataKey="completed" stroke="#6C63FF" fillOpacity={1} fill="url(#colorCompleted)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tasks Status Pie Chart */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
              <h3 className="text-sm font-bold text-[#F8FAFC] mb-1">
                Task Status Breakdown
              </h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                Distribution across engineering workflow states
              </p>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0D1220', borderColor: '#263247', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center flex-wrap gap-4 text-xs">
                {statusPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#CBD5E1]">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI MENTOR */}
      {activeTab === 'mentor' && (
        <div className="rounded-2xl bg-[#111827] border border-[#263247] flex flex-col h-[640px] overflow-hidden">
          {/* AI Mentor Header */}
          <div className="p-5 border-b border-[#263247] bg-[#0D1220] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  BUILDflow AI MENTOR
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Your project-aware engineering assistant.
                </p>
              </div>
            </div>

            {/* Context Bar */}
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="px-2.5 py-1 rounded-md bg-[#111827] text-[#CBD5E1] border border-[#263247]">
                <strong className="text-[#22D3EE]">PROJECT:</strong> {project.title.split(' ')[0]}...
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#111827] text-[#CBD5E1] border border-[#263247]">
                <strong className="text-[#6C63FF]">PHASE:</strong> {project.currentPhase || 'Model Dev'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#111827] text-[#CBD5E1] border border-[#263247]">
                <strong className="text-[#34D399]">TASK:</strong> {nextBestTask?.title?.slice(0, 18)}...
              </span>
            </div>
          </div>

          {/* Suggested Prompt Pills */}
          <div className="px-5 py-2.5 flex flex-wrap gap-2 border-b border-[#263247] bg-[#111827]">
            {[
              'What should I do next?',
              'Explain this task',
              "I'm stuck",
              'Make this easier',
              'Can I finish before my deadline?',
              'Improve my project'
            ].map(pill => (
              <button
                key={pill}
                onClick={() => handleChipClick(pill)}
                className="px-2.5 py-1 rounded-lg bg-[#0D1220] hover:bg-[#172033] border border-[#263247] text-[11px] text-[#CBD5E1] hover:text-[#22D3EE] hover:border-[#22D3EE]/40 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {mentorMessages.map(m => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="h-7 w-7 rounded-lg bg-[#6C63FF]/20 border border-[#6C63FF]/30 text-[#22D3EE] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white rounded-tr-none shadow-sm'
                      : 'bg-[#0D1220] border border-[#263247] text-[#CBD5E1] rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isSendingMentorMessage && (
              <div className="flex gap-2.5 text-xs text-[#94A3B8] items-center">
                <Loader2 className="h-4 w-4 animate-spin text-[#22D3EE]" />
                <span>BUILDflow mentor is analyzing your project code & phase...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMentor} className="p-4 border-t border-[#263247] bg-[#0D1220] flex gap-2">
            <input
              id="mentor-chat-input"
              type="text"
              value={mentorInput}
              onChange={e => setMentorInput(e.target.value)}
              placeholder="Ask for guidance, code snippets, architecture debugging, or thesis tips..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#111827] border border-[#263247] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#6C63FF]"
            />
            <button
              id="mentor-chat-send-btn"
              type="submit"
              disabled={isSendingMentorMessage || !mentorInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
