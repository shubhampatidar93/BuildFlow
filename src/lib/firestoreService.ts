import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  Project,
  ProjectPhase,
  ProjectTask,
  TaskStatus,
  TeamMember,
  ProjectActivity,
  MentorMessage,
  ProjectHealth
} from '../types';
import { DEMO_PROJECT, DEMO_PHASES, DEMO_TASKS, DEMO_TEAM, DEMO_ACTIVITIES } from '../data/demoProject';
import {
  HACKATHON_DEMO_PROJECT,
  HACKATHON_DEMO_PHASES,
  HACKATHON_DEMO_TASKS,
  HACKATHON_DEMO_TEAM,
  HACKATHON_DEMO_ACTIVITIES
} from '../data/hackathonDemoProject';
import { recalculatePhases, calculateProjectAnalytics } from './taskIntelligence';

const STORAGE_KEY_PROFILE = 'pf_user_profile';
const STORAGE_KEY_PROJECTS = 'pf_projects_cache';

// Helper for offline / sandbox fallback
function getLocalCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// 1. User Profile Operations
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  setLocalCache(STORAGE_KEY_PROFILE, profile);
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserProfile notice (using optimistic cache):', err);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const cached = getLocalCache<UserProfile | null>(STORAGE_KEY_PROFILE, null);
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      setLocalCache(STORAGE_KEY_PROFILE, data);
      return data;
    }
  } catch (err) {
    console.warn('Firestore getUserProfile error, using local fallback:', err);
  }
  return cached;
}

// 2. Project Operations
export async function saveProject(project: Project): Promise<void> {
  const cachedProjects = getLocalCache<Project[]>(STORAGE_KEY_PROJECTS, []);
  const existingIdx = cachedProjects.findIndex(p => p.id === project.id);
  if (existingIdx >= 0) {
    cachedProjects[existingIdx] = project;
  } else {
    cachedProjects.unshift(project);
  }
  setLocalCache(STORAGE_KEY_PROJECTS, cachedProjects);

  try {
    const projectRef = doc(db, 'projects', project.id);
    await setDoc(projectRef, {
      ...project,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveProject error:', err);
  }
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const cached = getLocalCache<Project[]>(STORAGE_KEY_PROJECTS, []);
  try {
    const q = query(collection(db, 'projects'), where('ownerId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const projects = snap.docs.map(d => d.data() as Project);
      setLocalCache(STORAGE_KEY_PROJECTS, projects);
      return projects;
    }
  } catch (err) {
    console.warn('Firestore getUserProjects error, using cached:', err);
  }
  return cached.filter(p => p.ownerId === userId || p.ownerId === 'demo-user');
}

// 3. Save Roadmap (Phases + Tasks + Activities)
export async function saveRoadmap(
  projectId: string,
  phases: ProjectPhase[],
  tasks: ProjectTask[],
  teamMembers?: TeamMember[]
): Promise<void> {
  // Update local caches
  setLocalCache(`pf_phases_${projectId}`, phases);
  setLocalCache(`pf_tasks_${projectId}`, tasks);
  if (teamMembers) {
    setLocalCache(`pf_team_${projectId}`, teamMembers);
  }

  try {
    const batch = writeBatch(db);

    // Save Phases
    for (const phase of phases) {
      const phaseRef = doc(db, 'projects', projectId, 'phases', phase.id);
      batch.set(phaseRef, phase, { merge: true });
    }

    // Save Tasks
    for (const task of tasks) {
      const taskRef = doc(db, 'projects', projectId, 'tasks', task.id);
      batch.set(taskRef, task, { merge: true });
    }

    // Save Team if provided
    if (teamMembers) {
      for (const m of teamMembers) {
        const teamRef = doc(db, 'projects', projectId, 'team', m.id);
        batch.set(teamRef, m, { merge: true });
      }
    }

    // Initial activity
    const actRef = doc(db, 'projects', projectId, 'activities', `act-${Date.now()}`);
    batch.set(actRef, {
      id: `act-${Date.now()}`,
      type: 'ROADMAP_GENERATED',
      title: `Generated ${phases.length} phases and ${tasks.length} tasks`,
      timestamp: 'Just now'
    });

    await batch.commit();
  } catch (err) {
    console.warn('Firestore saveRoadmap notice (cached locally):', err);
  }
}

// 4. Update Task Status & Calculate Dynamic Progress
export function calculateHealthAndProgress(
  tasks: ProjectTask[],
  deadlineStr?: string
): { progress: number; health: ProjectHealth } {
  const total = tasks.length;
  if (total === 0) return { progress: 0, health: 'ON TRACK' };

  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const progress = Math.round((completed / total) * 100);

  // Deadline calculation
  let health: ProjectHealth = 'ON TRACK';
  if (deadlineStr) {
    const now = Date.now();
    const deadline = new Date(deadlineStr).getTime();
    const daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
    const remainingTasks = total - completed;
    const remainingHours = tasks
      .filter(t => t.status !== 'COMPLETED')
      .reduce((sum, t) => sum + (t.estimatedHours || 3), 0);

    const availableWorkHours = daysLeft * 4; // assuming 4h/day
    if (daysLeft <= 3 && remainingTasks > 5) {
      health = 'BEHIND';
    } else if (remainingHours > availableWorkHours) {
      health = 'AT RISK';
    } else {
      health = 'ON TRACK';
    }
  }

  return { progress, health };
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  newStatus: TaskStatus,
  currentTasks: ProjectTask[],
  projectTitle?: string,
  deadlineStr?: string,
  currentPhases?: ProjectPhase[]
): Promise<{
  updatedTasks: ProjectTask[];
  updatedPhases: ProjectPhase[];
  progress: number;
  health: ProjectHealth;
  currentPhase: string;
}> {
  const targetIdx = currentTasks.findIndex(t => t.id === taskId);
  if (targetIdx === -1) {
    return {
      updatedTasks: currentTasks,
      updatedPhases: currentPhases || [],
      progress: 0,
      health: 'ON TRACK',
      currentPhase: ''
    };
  }

  const prevTask = currentTasks[targetIdx];
  const updatedTask: ProjectTask = {
    ...prevTask,
    status: newStatus,
    completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined
  };

  const nextTasks = [...currentTasks];
  nextTasks[targetIdx] = updatedTask;

  // Retrieve cached phases if not provided
  const existingPhases = currentPhases && currentPhases.length > 0
    ? currentPhases
    : getLocalCache<ProjectPhase[]>(`pf_phases_${projectId}`, []);

  // Recalculate phases dynamically based on updated tasks
  const updatedPhases = recalculatePhases(existingPhases, nextTasks);

  // Calculate comprehensive analytics
  const analytics = calculateProjectAnalytics(nextTasks, updatedPhases, deadlineStr);
  const { progressPercent: progress, health, currentPhaseTitle: currentPhase } = analytics;

  // Update local caches
  setLocalCache(`pf_tasks_${projectId}`, nextTasks);
  setLocalCache(`pf_phases_${projectId}`, updatedPhases);

  // Activity title
  let actTitle = `Task updated: "${updatedTask.title}" -> ${newStatus}`;
  let actType: ProjectActivity['type'] = 'STATUS_CHANGED';
  if (newStatus === 'COMPLETED') {
    actTitle = `Completed: "${updatedTask.title}"`;
    actType = 'TASK_COMPLETED';
  } else if (newStatus === 'IN PROGRESS') {
    actTitle = `Started: "${updatedTask.title}"`;
    actType = 'TASK_STARTED';
  } else if (newStatus === 'BLOCKED') {
    actTitle = `Blocked: "${updatedTask.title}"`;
    actType = 'TASK_BLOCKED';
  }

  try {
    // 1. Update task doc
    const taskRef = doc(db, 'projects', projectId, 'tasks', taskId);
    await setDoc(taskRef, updatedTask, { merge: true });

    // 2. Update parent project metrics
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      progress,
      health,
      currentPhase,
      updatedAt: new Date().toISOString()
    });

    // 3. Update updated phase doc
    if (updatedTask.phaseId) {
      const phaseObj = updatedPhases.find(p => p.id === updatedTask.phaseId);
      if (phaseObj) {
        const phaseRef = doc(db, 'projects', projectId, 'phases', updatedTask.phaseId);
        await setDoc(phaseRef, phaseObj, { merge: true });
      }
    }

    // 4. Append activity
    const actId = `act-${Date.now()}`;
    const actRef = doc(db, 'projects', projectId, 'activities', actId);
    const actData: ProjectActivity = {
      id: actId,
      type: actType,
      title: actTitle,
      timestamp: 'Just now',
      taskId
    };
    await setDoc(actRef, actData);

    const existingActs = getLocalCache<ProjectActivity[]>(`pf_activities_${projectId}`, []);
    setLocalCache(`pf_activities_${projectId}`, [actData, ...existingActs]);
  } catch (err) {
    console.warn('Firestore updateTaskStatus notice (applied locally):', err);
  }

  return { updatedTasks: nextTasks, updatedPhases, progress, health, currentPhase };
}

// 5. Team Assignment
export async function assignTaskToMember(
  projectId: string,
  taskId: string,
  memberName: string,
  currentTasks: ProjectTask[]
): Promise<ProjectTask[]> {
  const nextTasks = currentTasks.map(t =>
    t.id === taskId ? { ...t, assignedTo: memberName } : t
  );
  setLocalCache(`pf_tasks_${projectId}`, nextTasks);

  try {
    const taskRef = doc(db, 'projects', projectId, 'tasks', taskId);
    await updateDoc(taskRef, { assignedTo: memberName });
  } catch (err) {
    console.warn('Firestore assignTask error:', err);
  }

  return nextTasks;
}

// 6. Real-time Listeners
export function listenToProject(projectId: string, onUpdate: (project: Project | null) => void) {
  // Initial cached emit
  const cachedProjects = getLocalCache<Project[]>(STORAGE_KEY_PROJECTS, []);
  const cached = cachedProjects.find(p => p.id === projectId) || null;
  if (cached) onUpdate(cached);

  try {
    const projectRef = doc(db, 'projects', projectId);
    return onSnapshot(projectRef, snap => {
      if (snap.exists()) {
        const data = snap.data() as Project;
        onUpdate(data);
      }
    }, err => {
      console.warn('Project listener notice:', err.message);
    });
  } catch {
    return () => {};
  }
}

export function listenToTasks(projectId: string, onUpdate: (tasks: ProjectTask[]) => void) {
  const cached = getLocalCache<ProjectTask[]>(`pf_tasks_${projectId}`, []);
  if (cached.length > 0) onUpdate(cached);

  try {
    const tasksCol = collection(db, 'projects', projectId, 'tasks');
    return onSnapshot(tasksCol, snap => {
      if (!snap.empty) {
        const tasks = snap.docs.map(d => d.data() as ProjectTask);
        // Sort by phaseOrder then id
        tasks.sort((a, b) => (a.phaseOrder || 0) - (b.phaseOrder || 0));
        setLocalCache(`pf_tasks_${projectId}`, tasks);
        onUpdate(tasks);
      }
    }, err => {
      console.warn('Tasks listener notice:', err.message);
    });
  } catch {
    return () => {};
  }
}

export function listenToPhases(projectId: string, onUpdate: (phases: ProjectPhase[]) => void) {
  const cached = getLocalCache<ProjectPhase[]>(`pf_phases_${projectId}`, []);
  if (cached.length > 0) onUpdate(cached);

  try {
    const phasesCol = collection(db, 'projects', projectId, 'phases');
    return onSnapshot(phasesCol, snap => {
      if (!snap.empty) {
        const phases = snap.docs.map(d => d.data() as ProjectPhase);
        phases.sort((a, b) => a.order - b.order);
        setLocalCache(`pf_phases_${projectId}`, phases);
        onUpdate(phases);
      }
    }, err => {
      console.warn('Phases listener notice:', err.message);
    });
  } catch {
    return () => {};
  }
}

export function listenToActivities(projectId: string, onUpdate: (activities: ProjectActivity[]) => void) {
  const cached = getLocalCache<ProjectActivity[]>(`pf_activities_${projectId}`, []);
  if (cached.length > 0) onUpdate(cached);

  try {
    const actsCol = collection(db, 'projects', projectId, 'activities');
    return onSnapshot(actsCol, snap => {
      if (!snap.empty) {
        const activities = snap.docs.map(d => d.data() as ProjectActivity);
        setLocalCache(`pf_activities_${projectId}`, activities);
        onUpdate(activities);
      }
    }, err => {
      console.warn('Activities listener notice:', err.message);
    });
  } catch {
    return () => {};
  }
}

export function listenToTeam(projectId: string, onUpdate: (team: TeamMember[]) => void) {
  const cached = getLocalCache<TeamMember[]>(`pf_team_${projectId}`, []);
  if (cached.length > 0) onUpdate(cached);

  try {
    const teamCol = collection(db, 'projects', projectId, 'team');
    return onSnapshot(teamCol, snap => {
      if (!snap.empty) {
        const team = snap.docs.map(d => d.data() as TeamMember);
        setLocalCache(`pf_team_${projectId}`, team);
        onUpdate(team);
      }
    }, err => {
      console.warn('Team listener notice:', err.message);
    });
  } catch {
    return () => {};
  }
}

// 7. Mentor Messages (Firestore persistence for AI Mentor chat history)
export async function saveMentorMessage(projectId: string, message: MentorMessage): Promise<void> {
  const cacheKey = `pf_mentor_${projectId}`;
  const existing = getLocalCache<MentorMessage[]>(cacheKey, []);
  setLocalCache(cacheKey, [...existing, message]);

  try {
    const msgRef = doc(db, 'projects', projectId, 'mentorMessages', message.id);
    await setDoc(msgRef, message, { merge: true });
  } catch (err) {
    console.warn('Firestore saveMentorMessage error:', err);
  }
}

export function listenToMentorMessages(projectId: string, onUpdate: (messages: MentorMessage[]) => void) {
  const cacheKey = `pf_mentor_${projectId}`;
  const cached = getLocalCache<MentorMessage[]>(cacheKey, []);
  if (cached.length > 0) onUpdate(cached);

  try {
    const msgsCol = collection(db, 'projects', projectId, 'mentorMessages');
    return onSnapshot(msgsCol, snap => {
      if (!snap.empty) {
        const msgs = snap.docs.map(d => d.data() as MentorMessage);
        msgs.sort((a, b) => {
          const timeA = typeof a.timestamp === 'string' && a.timestamp.includes('T') ? new Date(a.timestamp).getTime() : 0;
          const timeB = typeof b.timestamp === 'string' && b.timestamp.includes('T') ? new Date(b.timestamp).getTime() : 0;
          return timeA - timeB;
        });
        setLocalCache(cacheKey, msgs);
        onUpdate(msgs);
      }
    }, err => {
      console.warn('Mentor listener notice:', err.message);
    });
  } catch {
    return () => {};
  }
}

// 8. General Activity Logger
export async function logActivity(
  projectId: string,
  type: ProjectActivity['type'],
  title: string,
  taskId?: string
): Promise<ProjectActivity> {
  const actId = `act-${Date.now()}`;
  const actData: ProjectActivity = {
    id: actId,
    type,
    title,
    timestamp: 'Just now',
    taskId
  };

  const existing = getLocalCache<ProjectActivity[]>(`pf_activities_${projectId}`, []);
  setLocalCache(`pf_activities_${projectId}`, [actData, ...existing]);

  try {
    const actRef = doc(db, 'projects', projectId, 'activities', actId);
    await setDoc(actRef, actData);
  } catch (err) {
    console.warn('Firestore logActivity error:', err);
  }

  return actData;
}

// 9. Seed Demo Project into Storage & Firestore
export async function loadDemoProject(userId: string): Promise<Project> {
  const demoProj: Project = {
    ...DEMO_PROJECT,
    ownerId: userId,
    updatedAt: new Date().toISOString()
  };

  await saveProject(demoProj);
  await saveRoadmap(demoProj.id, DEMO_PHASES, DEMO_TASKS, DEMO_TEAM);

  // Cache and persist demo activities
  setLocalCache(`pf_activities_${demoProj.id}`, DEMO_ACTIVITIES);

  try {
    const batch = writeBatch(db);
    for (const act of DEMO_ACTIVITIES) {
      const actRef = doc(db, 'projects', demoProj.id, 'activities', act.id);
      batch.set(actRef, act, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.warn('Firestore loadDemoProject batch activities notice:', err);
  }

  return demoProj;
}

// 10. Seed Hackathon Demo Project into Storage & Firestore
export async function loadHackathonDemoProject(userId: string): Promise<Project> {
  const hackProj: Project = {
    ...HACKATHON_DEMO_PROJECT,
    ownerId: userId,
    updatedAt: new Date().toISOString()
  };

  await saveProject(hackProj);
  await saveRoadmap(hackProj.id, HACKATHON_DEMO_PHASES, HACKATHON_DEMO_TASKS, HACKATHON_DEMO_TEAM);

  // Cache and persist hackathon activities
  setLocalCache(`pf_activities_${hackProj.id}`, HACKATHON_DEMO_ACTIVITIES);

  try {
    const batch = writeBatch(db);
    for (const act of HACKATHON_DEMO_ACTIVITIES) {
      const actRef = doc(db, 'projects', hackProj.id, 'activities', act.id);
      batch.set(actRef, act, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.warn('Firestore loadHackathonDemoProject batch activities notice:', err);
  }

  return hackProj;
}
