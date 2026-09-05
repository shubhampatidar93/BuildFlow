export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Innovative';
export type ProjectHealth = 'ON TRACK' | 'AT RISK' | 'BEHIND';
export type TaskStatus = 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  skills: string[];
  interests: string[];
  experienceLevel: ExperienceLevel;
  teamSize: string;
  timeline: string;
  budget: string;
  preferredDifficulty: DifficultyLevel;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  targetUsers: string;
  techStack: string[];
  requiredSkills: string[];
  duration: string;
  difficulty: DifficultyLevel;
  expectedImpact: string;
  novelty: string;
  feasibility: string;
  datasetRequirements: string;
  apiRequirements: string;
  mvpScope: string[];
  futureImprovements: string[];
  feasibilityScore: number;
  noveltyScore: number;
  impactScore: number;
  overallScore: number;
  whyFits: string;
}

export interface TechStackItem {
  category: string;
  tool: string;
  reason: string;
}

export interface ProjectRisk {
  risk: string;
  mitigation: string;
}

export interface ProjectBlueprint {
  title: string;
  problemStatement: string;
  solutionOverview: string;
  targetUsers: string;
  objectives: string[];
  mvpFeatures: string[];
  advancedFeatures: string[];
  techStack: TechStackItem[];
  architecture: string;
  datasets: string[];
  apis: string[];
  expectedOutput: string;
  risks: ProjectRisk[];
  futureImprovements: string[];
}

export interface ProjectPhase {
  id: string;
  title: string;
  description?: string;
  order: number;
  status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED';
  totalTasks: number;
  completedTasks: number;
  estimatedHours: number;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  phase: string;
  phaseId?: string;
  phaseOrder: number;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string;
  deliverable: string;
  whyMatters?: string;
  aiTips?: string;
  commonMistakes?: string;
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  assignedTasks: number;
  completedTasks: number;
}

export interface ProjectActivity {
  id: string;
  type:
    | 'PROJECT_CREATED'
    | 'ROADMAP_GENERATED'
    | 'TASK_STARTED'
    | 'TASK_COMPLETED'
    | 'TASK_BLOCKED'
    | 'AI_MENTOR_USED'
    | 'TASK_ADDED'
    | 'DEADLINE_CHANGED'
    | 'STATUS_CHANGED';
  title: string;
  timestamp: string;
  taskId?: string;
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'BREAK_TASK' | 'ADD_TEST_TASK' | 'MOVE_ADVANCED' | 'EASIER_VERSION' | 'ADJUST_DEADLINE';
    label: string;
    details?: string;
  };
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  targetUsers: string;
  techStack: string[];
  requiredSkills: string[];
  duration: string;
  difficulty: DifficultyLevel;
  feasibilityScore: number;
  noveltyScore: number;
  impactScore: number;
  overallScore: number;
  whyFits: string;
  progress: number;
  health: ProjectHealth;
  currentPhase: string;
  startDate: string;
  deadline: string;
  blueprint?: ProjectBlueprint;
  createdAt: string;
  updatedAt: string;
}
