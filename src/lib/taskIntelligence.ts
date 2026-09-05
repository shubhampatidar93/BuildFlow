import { Project, ProjectPhase, ProjectTask, ProjectHealth, TaskStatus } from '../types';

export interface NextTaskRecommendation {
  task: ProjectTask;
  reasoning: string;
}

export interface ProjectAnalytics {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  progressPercent: number;
  estimatedHoursTotal: number;
  estimatedHoursCompleted: number;
  estimatedHoursLeft: number;
  daysRemaining: number;
  health: ProjectHealth;
  healthReason: string;
  currentPhaseTitle: string;
}

/**
 * Calculates project health and pace based on:
 * - target deadline
 * - remaining tasks
 * - estimated hours left
 * - current pace
 */
export function calculateProjectAnalytics(
  tasks: ProjectTask[],
  phases: ProjectPhase[],
  deadlineStr?: string,
  startDateStr?: string
): ProjectAnalytics {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN PROGRESS').length;
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length;
  const remainingTasks = Math.max(0, totalTasks - completedTasks);

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const estimatedHoursTotal = tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 3), 0);
  const estimatedHoursCompleted = tasks
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + (Number(t.estimatedHours) || 3), 0);
  const estimatedHoursLeft = tasks
    .filter(t => t.status !== 'COMPLETED')
    .reduce((sum, t) => sum + (Number(t.estimatedHours) || 3), 0);

  // Days remaining calculation
  let daysRemaining = 30;
  if (deadlineStr) {
    const deadlineTime = new Date(deadlineStr).getTime();
    const nowTime = Date.now();
    daysRemaining = Math.max(0, Math.ceil((deadlineTime - nowTime) / (1000 * 60 * 60 * 24)));
  }

  // Health calculation
  let health: ProjectHealth = 'ON TRACK';
  let healthReason = 'Progress pace aligns comfortably with your target submission timeline.';

  if (totalTasks > 0) {
    // Assuming realistic student work capacity of ~3.5 hours per day
    const availableWorkCapacityHours = Math.max(1, daysRemaining * 3.5);

    if (daysRemaining <= 0 && remainingTasks > 0) {
      health = 'BEHIND';
      healthReason = 'Target deadline has passed with pending engineering milestones.';
    } else if (daysRemaining <= 5 && remainingTasks > 4) {
      health = 'BEHIND';
      healthReason = `${remainingTasks} tasks remain with only ${daysRemaining} days left. Immediate acceleration needed.`;
    } else if (estimatedHoursLeft > availableWorkCapacityHours * 1.25) {
      health = 'BEHIND';
      healthReason = `Required effort (${estimatedHoursLeft}h) substantially exceeds available capacity (${Math.round(availableWorkCapacityHours)}h).`;
    } else if (estimatedHoursLeft > availableWorkCapacityHours * 0.85 || blockedTasks >= 2) {
      health = 'AT RISK';
      healthReason = blockedTasks >= 2
        ? `${blockedTasks} tasks currently blocked. Resolve blockers to avoid milestone slippage.`
        : `Tight schedule: ${estimatedHoursLeft}h required across ${daysRemaining} remaining days.`;
    } else {
      health = 'ON TRACK';
      healthReason = `${progressPercent}% complete with ${daysRemaining} days remaining. Steady milestone velocity.`;
    }
  }

  // Current Phase Title
  const activePhase = phases.find(p => p.status === 'IN PROGRESS')
    || phases.find(p => p.status === 'NOT STARTED')
    || phases[0];
  const currentPhaseTitle = activePhase ? activePhase.title : 'Phase 1: Project Setup';

  return {
    totalTasks,
    completedTasks,
    remainingTasks,
    inProgressTasks,
    blockedTasks,
    progressPercent,
    estimatedHoursTotal,
    estimatedHoursCompleted,
    estimatedHoursLeft,
    daysRemaining,
    health,
    healthReason,
    currentPhaseTitle
  };
}

/**
 * Recalculates phase completion counts, estimated hours, and status
 * based on the tasks assigned to each phase.
 */
export function recalculatePhases(
  phases: ProjectPhase[],
  tasks: ProjectTask[]
): ProjectPhase[] {
  let foundFirstIncomplete = false;

  return phases.map((phase, idx) => {
    const phaseTasks = tasks.filter(t => t.phaseId === phase.id || t.phase === phase.title);
    const totalTasks = phaseTasks.length;
    const completedTasks = phaseTasks.filter(t => t.status === 'COMPLETED').length;
    const estimatedHours = phaseTasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 3), 0) || phase.estimatedHours || 15;

    let status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' = 'NOT STARTED';

    if (totalTasks > 0 && completedTasks === totalTasks) {
      status = 'COMPLETED';
    } else if (phaseTasks.some(t => t.status === 'IN PROGRESS') || completedTasks > 0) {
      status = 'IN PROGRESS';
      foundFirstIncomplete = true;
    } else if (!foundFirstIncomplete) {
      // The first incomplete phase is marked IN PROGRESS
      status = 'IN PROGRESS';
      foundFirstIncomplete = true;
    } else {
      status = 'NOT STARTED';
    }

    return {
      ...phase,
      totalTasks: totalTasks || phase.totalTasks || 0,
      completedTasks,
      estimatedHours,
      status
    };
  });
}

/**
 * Helper to test if a task's dependencies are completed
 */
function areDependenciesMet(task: ProjectTask, allTasks: ProjectTask[]): boolean {
  if (!task.dependencies || task.dependencies.trim() === '' || task.dependencies.toLowerCase() === 'none') {
    return true;
  }

  const depStr = task.dependencies.toLowerCase();

  // If task lists a dependency like "task-1" or "SRS Document" or "Task 1", check if those tasks are completed
  return allTasks.every(other => {
    if (other.id === task.id) return true;
    const titleMatch = depStr.includes(other.title.toLowerCase()) || other.title.toLowerCase().includes(depStr);
    const idMatch = depStr.includes(other.id.toLowerCase());
    if (titleMatch || idMatch) {
      return other.status === 'COMPLETED';
    }
    return true;
  });
}

/**
 * Smart Next Task Recommender based on:
 * - task dependencies
 * - current task status
 * - current phase
 * - priority
 * - deadline
 */
export function getSmartNextTask(
  tasks: ProjectTask[],
  phases: ProjectPhase[],
  currentPhaseTitle?: string,
  daysRemaining?: number
): NextTaskRecommendation | null {
  if (!tasks || tasks.length === 0) return null;

  // 1. If any task is currently IN PROGRESS, finish it first!
  const inProgressTasks = tasks.filter(t => t.status === 'IN PROGRESS');
  if (inProgressTasks.length > 0) {
    // Sort by priority HIGH -> MEDIUM -> LOW
    const priorityWeight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    inProgressTasks.sort((a, b) => (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1));
    const task = inProgressTasks[0];
    return {
      task,
      reasoning: `Currently in progress. Finishing started tasks maintains momentum, eliminates context-switching, and locks in your ~${task.estimatedHours}h milestone.`
    };
  }

  // 2. Identify unblocked NOT STARTED tasks
  const notStartedTasks = tasks.filter(t => t.status === 'NOT STARTED');
  if (notStartedTasks.length === 0) {
    // If all tasks are completed or blocked
    const blocked = tasks.find(t => t.status === 'BLOCKED');
    if (blocked) {
      return {
        task: blocked,
        reasoning: `Task is currently marked as blocked. Clear external blockers or consult the AI Mentor to resume progress.`
      };
    }
    return {
      task: tasks[tasks.length - 1],
      reasoning: `All scheduled tasks are completed. You are ready for final viva presentation review!`
    };
  }

  // Separate tasks with dependencies satisfied vs unsatisfied
  const unblockedTasks = notStartedTasks.filter(t => areDependenciesMet(t, tasks));
  const candidatePool = unblockedTasks.length > 0 ? unblockedTasks : notStartedTasks;

  // Filter for tasks belonging to current phase first
  const currentPhaseTasks = currentPhaseTitle
    ? candidatePool.filter(t => t.phase === currentPhaseTitle || t.phase?.toLowerCase().includes(currentPhaseTitle.toLowerCase()))
    : [];

  const pool = currentPhaseTasks.length > 0 ? currentPhaseTasks : candidatePool;

  // Sort pool:
  // 1. Priority: HIGH (3) > MEDIUM (2) > LOW (1)
  // 2. Phase order: Earlier phase order first
  // 3. Shorter estimated hours if deadline is close (<= 10 days)
  const priorityWeight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const sorted = [...pool].sort((a, b) => {
    const pDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
    if (pDiff !== 0) return pDiff;

    const orderDiff = (a.phaseOrder || 0) - (b.phaseOrder || 0);
    if (orderDiff !== 0) return orderDiff;

    if (daysRemaining !== undefined && daysRemaining <= 10) {
      return (a.estimatedHours || 3) - (b.estimatedHours || 3);
    }

    return 0;
  });

  const recommended = sorted[0];

  let reasoning = `Highest priority unblocked deliverable in ${recommended.phase.split(':')[0]}.`;
  if (recommended.deliverable) {
    reasoning += ` Producing "${recommended.deliverable}" (~${recommended.estimatedHours}h) directly unblocks downstream evaluation requirements.`;
  }
  if (daysRemaining !== undefined && daysRemaining <= 14) {
    reasoning += ` With ${daysRemaining} days left, tackling high-impact core items now guarantees milestone delivery.`;
  }

  return {
    task: recommended,
    reasoning
  };
}

/**
 * Selects 3-5 high-relevance tasks for "Today's Focus" on the dashboard
 */
export function getTodaysTasks(
  tasks: ProjectTask[],
  phases: ProjectPhase[],
  currentPhaseTitle?: string,
  maxCount = 4
): ProjectTask[] {
  if (!tasks || tasks.length === 0) return [];

  const result: ProjectTask[] = [];
  const addedIds = new Set<string>();

  // 1. Add any currently IN PROGRESS tasks
  const inProgress = tasks.filter(t => t.status === 'IN PROGRESS');
  for (const t of inProgress) {
    if (result.length < maxCount && !addedIds.has(t.id)) {
      result.push(t);
      addedIds.add(t.id);
    }
  }

  // 2. Add Smart Next Task if not already added
  const smartNext = getSmartNextTask(tasks, phases, currentPhaseTitle);
  if (smartNext && result.length < maxCount && !addedIds.has(smartNext.task.id)) {
    result.push(smartNext.task);
    addedIds.add(smartNext.task.id);
  }

  // 3. Add unblocked NOT STARTED tasks in current phase (HIGH priority first)
  const currentPhaseNotStarted = tasks
    .filter(t => t.status === 'NOT STARTED' && (!currentPhaseTitle || t.phase === currentPhaseTitle))
    .sort((a, b) => (b.priority === 'HIGH' ? 1 : 0) - (a.priority === 'HIGH' ? 1 : 0));

  for (const t of currentPhaseNotStarted) {
    if (result.length < maxCount && !addedIds.has(t.id)) {
      result.push(t);
      addedIds.add(t.id);
    }
  }

  // 4. If still under maxCount, add other NOT STARTED tasks
  const otherNotStarted = tasks.filter(t => t.status === 'NOT STARTED');
  for (const t of otherNotStarted) {
    if (result.length < maxCount && !addedIds.has(t.id)) {
      result.push(t);
      addedIds.add(t.id);
    }
  }

  // 5. If still under maxCount, include recently completed task for positive reinforcement
  const completed = tasks.filter(t => t.status === 'COMPLETED').slice(-1);
  for (const t of completed) {
    if (result.length < maxCount && !addedIds.has(t.id)) {
      result.push(t);
      addedIds.add(t.id);
    }
  }

  return result;
}
