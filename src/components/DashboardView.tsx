import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Calendar,
  Play,
  Lightbulb,
  Check,
  Bot,
  Activity,
  FolderGit2,
  Sparkles,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { Project, ProjectPhase, ProjectTask, TaskStatus, UserProfile } from '../types';
import { calculateProjectAnalytics, getSmartNextTask, getTodaysTasks } from '../lib/taskIntelligence';

interface DashboardViewProps {
  profile: UserProfile | null;
  activeProject: Project | null;
  tasks: ProjectTask[];
  phases?: ProjectPhase[];
  onOpenWorkspace: () => void;
  onOpenTaskModal: (task: ProjectTask) => void;
  onToggleTaskStatus: (task: ProjectTask) => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: TaskStatus) => void;
  onNavigateToIdeas: () => void;
  onLoadDemo: () => void;
  onAskMentor: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  activeProject,
  tasks,
  phases = [],
  onOpenWorkspace,
  onOpenTaskModal,
  onToggleTaskStatus,
  onUpdateTaskStatus,
  onNavigateToIdeas,
  onLoadDemo,
  onAskMentor,
}) => {
  const studentName = profile?.name?.split(' ')[0] || 'Student';

  // Compute real project analytics via TaskIntelligence
  const analytics = calculateProjectAnalytics(
    tasks,
    phases,
    activeProject?.deadline,
    activeProject?.startDate
  );

  // Smart Next Task Recommendation
  const smartRecommendation = getSmartNextTask(
    tasks,
    phases,
    analytics.currentPhaseTitle,
    analytics.daysRemaining
  );
  const nextBestTask = smartRecommendation?.task || tasks[0] || {
    id: 'sample-task',
    title: 'Initialize System Architecture',
    estimatedHours: 3,
    deliverable: 'Architecture Blueprint',
    phase: 'Phase 1: Architecture',
    status: 'NOT STARTED' as const,
  };

  // Today's Tasks
  const todaysTasks = getTodaysTasks(tasks, phases, analytics.currentPhaseTitle, 4);
  const todaysCompletedCount = todaysTasks.filter((t) => t.status === 'COMPLETED').length;
  const todaysPercent = todaysTasks.length > 0 ? Math.round((todaysCompletedCount / todaysTasks.length) * 100) : 0;

  // Handle direct task status update
  const handleSetStatus = (task: ProjectTask, status: TaskStatus) => {
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(task.id, status);
    } else {
      onToggleTaskStatus(task);
    }
  };

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#111827] border border-[#263247] text-center shadow-xl">
          <div className="h-14 w-14 rounded-2xl bg-[#0D1220] border border-[#263247] flex items-center justify-center mx-auto text-[#22D3EE] mb-5">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            What will you build today?
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-md mx-auto leading-relaxed">
            Generate an AI-powered project tailored to your technical skills with a step-by-step roadmap and live task board.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onNavigateToIdeas}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-semibold shadow-[0_0_20px_rgba(108,99,255,0.35)] flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Generate My Project</span>
            </button>
            <button
              onClick={onLoadDemo}
              className="px-6 py-3 rounded-xl bg-[#0D1220] hover:bg-[#172033] text-[#22D3EE] border border-[#263247] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Play className="h-4 w-4 fill-[#22D3EE] text-[#22D3EE]" />
              <span>Load Placement Predictor Demo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <span>Good morning, {studentName}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Let's move your project forward.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenWorkspace}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_15px_rgba(108,99,255,0.3)] transition-all"
          >
            <span>Open Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* TOP 4 METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl bg-[#111827] border border-[#263247] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE PROJECTS</span>
            <FolderGit2 className="h-4 w-4 text-[#6C63FF]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F8FAFC]">1</p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">{activeProject.title}</p>
        </div>

        <div className="rounded-xl bg-[#111827] border border-[#263247] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">TASKS COMPLETED</span>
            <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F8FAFC]">
            {analytics.completedTasks} <span className="text-xs font-semibold text-[#94A3B8]">/ {analytics.totalTasks}</span>
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">{analytics.progressPercent}% overall completion</p>
        </div>

        <div className="rounded-xl bg-[#111827] border border-[#263247] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">DAYS REMAINING</span>
            <Calendar className="h-4 w-4 text-[#22D3EE]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F8FAFC]">{analytics.daysRemaining}</p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Target submission pace</p>
        </div>

        <div className="rounded-xl bg-[#111827] border border-[#263247] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#94A3B8] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">PROJECT STATUS</span>
            <Activity className="h-4 w-4 text-[#34D399]" />
          </div>
          <p className="text-2xl font-extrabold text-[#34D399]">
            {analytics.health}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            {analytics.remainingTasks} tasks ({analytics.estimatedHoursLeft}h) left
          </p>
        </div>
      </div>

      {/* PROJECT PROGRESS BANNER WITH SMART NEXT TASK */}
      <div className="rounded-2xl bg-[#111827] border border-[#263247] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">
                {analytics.currentPhaseTitle}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                analytics.health === 'ON TRACK'
                  ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30'
                  : analytics.health === 'AT RISK'
                  ? 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30'
                  : 'bg-[#FB7185]/10 text-[#FB7185] border-[#FB7185]/30'
              }`}>
                ● {analytics.health}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC] mt-0.5">
              {activeProject.title}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#22D3EE] bg-[#0D1220] px-3 py-1.5 rounded-lg border border-[#263247] self-start sm:self-center">
            {analytics.progressPercent}% Complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
          <div
            className="h-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(108,99,255,0.6)]"
            style={{ width: `${analytics.progressPercent}%` }}
          />
        </div>

        {/* SMART NEXT TASK CARD */}
        <div className="mt-5 rounded-xl bg-[#0D1220] border border-[#6C63FF]/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(108,99,255,0.08)]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] bg-[#6C63FF]/15 px-2 py-0.5 rounded border border-[#6C63FF]/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#22D3EE]" />
                <span>SMART NEXT TASK</span>
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                • {nextBestTask.phase?.split(':')[0]} • ~{nextBestTask.estimatedHours || 2}h
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                nextBestTask.status === 'IN PROGRESS' ? 'text-[#22D3EE] bg-[#6C63FF]/20 border-[#6C63FF]/40' : 'text-[#94A3B8] bg-[#111827] border-[#263247]'
              }`}>
                {nextBestTask.status}
              </span>
            </div>
            <p className="text-base font-bold text-[#F8FAFC]">
              {nextBestTask.title}
            </p>
            {smartRecommendation?.reasoning && (
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                <strong className="text-[#22D3EE]">Why this task: </strong>
                {smartRecommendation.reasoning}
              </p>
            )}
            {nextBestTask.deliverable && (
              <p className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-[#34D399]" />
                <span>Deliverable: <span className="text-[#CBD5E1] font-mono">{nextBestTask.deliverable}</span></span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <button
              onClick={() => onOpenTaskModal(nextBestTask)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#CBD5E1] hover:text-white bg-[#111827] border border-[#263247] hover:border-[#6C63FF]/40 transition-colors"
            >
              View Details
            </button>
            {nextBestTask.status === 'COMPLETED' ? (
              <button
                onClick={() => handleSetStatus(nextBestTask, 'NOT STARTED')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/30 hover:bg-[#34D399]/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completed ✓</span>
              </button>
            ) : nextBestTask.status === 'IN PROGRESS' ? (
              <button
                onClick={() => handleSetStatus(nextBestTask, 'COMPLETED')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_15px_rgba(108,99,255,0.3)] transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Mark Completed</span>
              </button>
            ) : (
              <button
                onClick={() => handleSetStatus(nextBestTask, 'IN PROGRESS')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_15px_rgba(108,99,255,0.3)] transition-all flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>START TASK →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: TODAY'S FOCUS & AI INSIGHT + HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 cols): TODAY'S FOCUS */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111827] border border-[#263247] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">
                Today's Focus
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {todaysCompletedCount} / {todaysTasks.length} complete ({todaysPercent}%)
              </p>
            </div>
            <button
              onClick={onOpenWorkspace}
              className="text-xs font-semibold text-[#22D3EE] hover:underline"
            >
              Open Full Board →
            </button>
          </div>

          <div className="space-y-2.5">
            {todaysTasks.map((task, idx) => {
              const isDone = task.status === 'COMPLETED';
              const isInProg = task.status === 'IN PROGRESS';
              const isCurrent = task.id === nextBestTask.id;

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskModal(task)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer gap-2 ${
                    isCurrent
                      ? 'bg-[#0D1220] border-[#6C63FF]/40 shadow-sm'
                      : isDone
                      ? 'bg-[#0D1220]/50 border-[#263247]/60 opacity-85'
                      : 'bg-[#0D1220] border-[#263247] hover:border-[#263247]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetStatus(task, isDone ? 'NOT STARTED' : 'COMPLETED');
                      }}
                      className="shrink-0 p-1 text-[#94A3B8] hover:text-[#34D399]"
                      title={isDone ? 'Mark not completed' : 'Mark completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-[#34D399]" />
                      ) : isInProg ? (
                        <div className="h-5 w-5 rounded-full border-2 border-[#22D3EE] flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-[#94A3B8]" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isDone ? 'line-through text-[#94A3B8]' : 'text-[#F8FAFC]'
                        }`}
                      >
                        {idx + 1}. {task.title}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                        {task.phase?.split(':')[0]} • ~{task.estimatedHours}h
                        {task.deliverable ? ` • Deliverable: ${task.deliverable}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Direct status action buttons */}
                  <div
                    className="flex items-center gap-2 shrink-0 self-end sm:self-center ml-8 sm:ml-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isDone && !isInProg && (
                      <button
                        onClick={() => handleSetStatus(task, 'IN PROGRESS')}
                        className="px-2.5 py-1 rounded-lg bg-[#111827] hover:bg-[#172033] border border-[#263247] text-[10px] font-semibold text-[#22D3EE]"
                      >
                        Start
                      </button>
                    )}
                    {!isDone ? (
                      <button
                        onClick={() => handleSetStatus(task, 'COMPLETED')}
                        className="px-2.5 py-1 rounded-lg bg-[#34D399]/10 hover:bg-[#34D399]/20 border border-[#34D399]/30 text-[10px] font-semibold text-[#34D399]"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSetStatus(task, 'NOT STARTED')}
                        className="px-2.5 py-1 rounded-lg bg-[#111827] hover:bg-[#172033] border border-[#263247] text-[10px] font-semibold text-[#94A3B8]"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 col): AI INSIGHT & PROJECT HEALTH */}
        <div className="space-y-4">
          {/* AI INSIGHT CARD */}
          <div className="rounded-2xl bg-[#111827] border border-[#6C63FF]/40 p-5 relative overflow-hidden shadow-[0_0_20px_rgba(108,99,255,0.12)]">
            <div className="flex items-center gap-2 text-[#22D3EE] mb-2.5">
              <Sparkles className="h-4 w-4 text-[#6C63FF]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                AI INSIGHT
              </span>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {analytics.health === 'BEHIND'
                ? `You have ${analytics.remainingTasks} remaining tasks with ${analytics.daysRemaining} days left. Accelerate today by breaking down ${nextBestTask.title}.`
                : analytics.health === 'AT RISK'
                ? `Tight schedule detected. You require ~${analytics.estimatedHoursLeft} hours across ${analytics.daysRemaining} days. Finish the in-progress milestones.`
                : `"You are on track. Focus on completing ${nextBestTask.title} today and you will stay ahead of your milestone target."`}
            </p>

            <button
              onClick={() => onAskMentor("What should I prioritize today to ensure we stay ahead of our milestone deadline?")}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#0D1220] hover:bg-[#172033] border border-[#263247] hover:border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Ask AI Mentor →</span>
            </button>
          </div>

          {/* PROJECT HEALTH CARD */}
          <div className="rounded-2xl bg-[#111827] border border-[#263247] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                PROJECT HEALTH
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                analytics.health === 'ON TRACK'
                  ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30'
                  : analytics.health === 'AT RISK'
                  ? 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30'
                  : 'bg-[#FB7185]/10 text-[#FB7185] border-[#FB7185]/30'
              }`}>
                {analytics.health}
              </span>
            </div>

            <p className="text-[11px] text-[#94A3B8] mb-3 leading-relaxed">
              {analytics.healthReason}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#263247]/60">
                <span className="text-[#94A3B8]">Days remaining</span>
                <span className="font-semibold text-[#F8FAFC]">{analytics.daysRemaining} days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263247]/60">
                <span className="text-[#94A3B8]">Tasks remaining</span>
                <span className="font-semibold text-[#F8FAFC]">{analytics.remainingTasks} tasks</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263247]/60">
                <span className="text-[#94A3B8]">Estimated effort</span>
                <span className="font-semibold text-[#22D3EE]">~{analytics.estimatedHoursLeft} hours</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Pace required</span>
                <span className="font-semibold text-[#F8FAFC]">
                  {(analytics.daysRemaining > 0 ? (analytics.estimatedHoursLeft / analytics.daysRemaining).toFixed(1) : '0')} h/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
