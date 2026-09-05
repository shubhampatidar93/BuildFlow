import React from 'react';
import {
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  Play,
  Bot,
  UserCheck,
  Sparkles,
  FileCheck2,
  FileWarning,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ProjectTask, TaskStatus, TeamMember } from '../types';

interface TaskDetailModalProps {
  task: ProjectTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAssignTask: (taskId: string, memberName: string) => void;
  onAskMentorForTask: (task: ProjectTask) => void;
  teamMembers?: TeamMember[];
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
  onAssignTask,
  onAskMentorForTask,
  teamMembers = []
}) => {
  if (!isOpen || !task) return null;

  const priorityColors = {
    HIGH: 'bg-[#FB7185]/10 text-[#FB7185] border-[#FB7185]/30',
    MEDIUM: 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30',
    LOW: 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity">
      {/* Click outside to close backdrop */}
      <div className="flex-1 hidden sm:block" onClick={onClose} />

      {/* Right-Side Drawer */}
      <div className="relative w-full max-w-lg bg-[#0D1220] border-l border-[#263247] shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#263247] bg-[#111827]/80">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] bg-[#080B14] px-2.5 py-0.5 rounded border border-[#263247]">
              {task.phase}
            </span>

            <button
              id="task-drawer-close-btn"
              onClick={onClose}
              className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#111827] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-[#F8FAFC] leading-snug">
            {task.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                task.priority ? priorityColors[task.priority] : priorityColors.MEDIUM
              }`}
            >
              PRIORITY: {task.priority || 'MEDIUM'}
            </span>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#111827] text-[#CBD5E1] border border-[#263247] flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#22D3EE]" />
              <span>ESTIMATED TIME: {task.estimatedHours || 2} hours</span>
            </span>

            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                task.status === 'COMPLETED'
                  ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30'
                  : task.status === 'IN PROGRESS'
                  ? 'bg-[#6C63FF]/15 text-[#22D3EE] border-[#6C63FF]/30'
                  : task.status === 'BLOCKED'
                  ? 'bg-[#FB7185]/10 text-[#FB7185] border-[#FB7185]/30'
                  : 'bg-[#111827] text-[#94A3B8] border-[#263247]'
              }`}
            >
              ● {task.status}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs text-[#CBD5E1]">
          {/* Description */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
              Task Description
            </span>
            <p className="text-sm text-[#F8FAFC] leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Why this matters */}
          {task.whyMatters && (
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263247]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] block mb-1">
                WHY THIS MATTERS
              </span>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {task.whyMatters}
              </p>
            </div>
          )}

          {/* Deliverable */}
          {task.deliverable && (
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263247] flex items-start gap-2.5">
              <FileCheck2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-0.5">
                  DELIVERABLE
                </span>
                <p className="text-xs font-semibold text-[#F8FAFC]">
                  {task.deliverable}
                </p>
              </div>
            </div>
          )}

          {/* AI Tip (Actionable engineering advice) */}
          {task.aiTips && (
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#6C63FF]/40 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
              <div className="flex items-center gap-1.5 text-[#22D3EE] mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#6C63FF]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  AI ENGINEERING TIP
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {task.aiTips}
              </p>
            </div>
          )}

          {/* Common Mistakes */}
          {task.commonMistakes && (
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263247] flex items-start gap-2">
              <FileWarning className="h-4 w-4 text-[#FBBF24] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBBF24] block mb-0.5">
                  COMMON MISTAKE TO AVOID
                </span>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {task.commonMistakes}
                </p>
              </div>
            </div>
          )}

          {/* Status Switcher */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
              Task Status
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['NOT STARTED', 'IN PROGRESS', 'COMPLETED', 'BLOCKED'] as TaskStatus[]).map((st) => {
                const isCurrent = task.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(task.id, st)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                      isCurrent
                        ? st === 'COMPLETED'
                          ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/50 shadow-sm'
                          : st === 'IN PROGRESS'
                          ? 'bg-[#6C63FF]/25 text-[#22D3EE] border-[#6C63FF]/60 shadow-sm'
                          : st === 'BLOCKED'
                          ? 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]/50 shadow-sm'
                          : 'bg-[#0D1220] text-[#F8FAFC] border-[#22D3EE]/50 shadow-sm'
                        : 'bg-[#111827] text-[#94A3B8] border-[#263247] hover:border-[#6C63FF]/30'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Assignment */}
          {teamMembers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                Assigned Team Member
              </span>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((m) => {
                  const isAssigned = task.assignedTo === m.name;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onAssignTask(task.id, m.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isAssigned
                          ? 'bg-[#6C63FF]/20 text-[#22D3EE] border-[#6C63FF]/50 font-bold'
                          : 'bg-[#111827] text-[#94A3B8] border-[#263247] hover:border-[#6C63FF]/40'
                      }`}
                    >
                      {m.name} {isAssigned ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-5 border-t border-[#263247] bg-[#111827] space-y-2.5">
          <div className="flex items-center gap-2">
            {task.status === 'NOT STARTED' && (
              <button
                onClick={() => {
                  onUpdateStatus(task.id, 'IN PROGRESS');
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0D1220] hover:bg-[#172033] border border-[#263247] hover:border-[#22D3EE]/40 text-xs font-bold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="h-3.5 w-3.5 text-[#22D3EE]" />
                <span>START TASK</span>
              </button>
            )}

            {task.status === 'BLOCKED' && (
              <button
                onClick={() => {
                  onUpdateStatus(task.id, 'IN PROGRESS');
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#6C63FF]/20 hover:bg-[#6C63FF]/30 border border-[#6C63FF]/40 text-xs font-bold text-[#22D3EE] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="h-3.5 w-3.5 text-[#22D3EE]" />
                <span>RESUME WORK</span>
              </button>
            )}

            <button
              onClick={() => {
                const next = task.status === 'COMPLETED' ? 'NOT STARTED' : 'COMPLETED';
                onUpdateStatus(task.id, next);
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-bold shadow-[0_0_15px_rgba(108,99,255,0.3)] flex items-center justify-center gap-1.5 hover:opacity-95 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{task.status === 'COMPLETED' ? 'REOPEN TASK' : 'MARK COMPLETE'}</span>
            </button>

            {task.status !== 'BLOCKED' && task.status !== 'COMPLETED' && (
              <button
                onClick={() => {
                  onUpdateStatus(task.id, 'BLOCKED');
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#FB7185]/10 hover:bg-[#FB7185]/20 border border-[#FB7185]/30 text-xs font-bold text-[#FB7185] flex items-center justify-center gap-1 transition-colors"
                title="Mark this task as blocked"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">BLOCKED</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onAskMentorForTask(task);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#0D1220] hover:bg-[#172033] border border-[#263247] text-xs font-semibold text-[#22D3EE] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>ASK AI MENTOR ABOUT THIS TASK →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
