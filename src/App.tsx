import React, { useState, useEffect, useRef } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';
import {
  UserProfile,
  Project,
  ProjectIdea,
  ProjectBlueprint,
  ProjectPhase,
  ProjectTask,
  TeamMember,
  ProjectActivity,
  MentorMessage,
  TaskStatus
} from './types';
import {
  saveUserProfile,
  getUserProfile,
  saveProject,
  getUserProjects,
  saveRoadmap,
  updateTaskStatus,
  assignTaskToMember,
  loadDemoProject,
  loadHackathonDemoProject,
  listenToProject,
  listenToTasks,
  listenToPhases,
  listenToActivities,
  listenToTeam
} from './lib/firestoreService';
import { DEMO_PROJECT, DEMO_PHASES, DEMO_TASKS, DEMO_TEAM, DEMO_ACTIVITIES } from './data/demoProject';
import {
  HACKATHON_DEMO_PROJECT,
  HACKATHON_DEMO_PHASES,
  HACKATHON_DEMO_TASKS,
  HACKATHON_DEMO_TEAM,
  HACKATHON_DEMO_ACTIVITIES
} from './data/hackathonDemoProject';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { DashboardView } from './components/DashboardView';
import { IdeaGeneratorView } from './components/IdeaGeneratorView';
import { BlueprintView } from './components/BlueprintView';
import { ProjectWorkspaceView } from './components/ProjectWorkspaceView';
import { MyProjectsView } from './components/MyProjectsView';
import { SettingsView } from './components/SettingsView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const DEFAULT_PROFILE: UserProfile = {
  uid: 'demo-student-lead',
  name: 'Shubham Patidar',
  email: 'shubham.patidar@university.edu',
  skills: ['Python', 'Machine Learning', 'React', 'FastAPI', 'Data Science'],
  interests: ['AI/ML', 'Education', 'Web Development'],
  experienceLevel: 'Intermediate',
  teamSize: '3',
  timeline: '2 months',
  budget: 'Free',
  preferredDifficulty: 'Innovative',
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default function App() {
  // Auth & Profile State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(DEFAULT_PROFILE);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // App Navigation View
  const [currentView, setCurrentView] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<string>('overview');

  // Project & Workspace State
  const [projects, setProjects] = useState<Project[]>([DEMO_PROJECT]);
  const [activeProject, setActiveProject] = useState<Project | null>(DEMO_PROJECT);
  const [phases, setPhases] = useState<ProjectPhase[]>(DEMO_PHASES);
  const [tasks, setTasks] = useState<ProjectTask[]>(DEMO_TASKS);
  const [team, setTeam] = useState<TeamMember[]>(DEMO_TEAM);
  const [activities, setActivities] = useState<ProjectActivity[]>(DEMO_ACTIVITIES);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Hello! I'm your BUILDflow AI Technical Mentor. I have full context on your project: \"AI-Based Student Placement Prediction & Skill Gap Analyzer\". You're currently in Phase 3 (Machine Learning). How can I assist your engineering execution today?",
      timestamp: 'Just now'
    }
  ]);

  // Modals & Selected items
  const [activeTaskForModal, setActiveTaskForModal] = useState<ProjectTask | null>(null);
  const [selectedIdeaForBlueprint, setSelectedIdeaForBlueprint] = useState<ProjectIdea | null>(null);
  const [activeBlueprint, setActiveBlueprint] = useState<ProjectBlueprint | null>(DEMO_PROJECT.blueprint || null);

  // Loading flags
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState<boolean>(false);
  const [isSendingMentorMessage, setIsSendingMentorMessage] = useState<boolean>(false);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userProf = await getUserProfile(user.uid);
        if (userProf) {
          setProfile(userProf);
        } else {
          // Initialize first-time user profile
          const initialProf: UserProfile = {
            uid: user.uid,
            name: user.displayName || 'Student Lead',
            email: user.email || 'student@university.edu',
            photoURL: user.photoURL || undefined,
            skills: ['Python', 'JavaScript', 'React'],
            interests: ['AI/ML', 'Web Development'],
            experienceLevel: 'Intermediate',
            teamSize: '3',
            timeline: '2 months',
            budget: 'Free',
            preferredDifficulty: 'Innovative',
            onboardingCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setProfile(initialProf);
          setOnboardingOpen(true);
        }

        // Fetch user projects
        const userProjects = await getUserProjects(user.uid);
        if (userProjects.length > 0) {
          setProjects(userProjects);
          setActiveProject(userProjects[0]);
        }
      } else {
        // Default to demo guest user for frictionless judging
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Listeners for active project
  useEffect(() => {
    if (!activeProject?.id) return;

    const unsubProject = listenToProject(activeProject.id, (proj) => {
      if (proj) {
        setActiveProject(proj);
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? proj : p))
        );
      }
    });

    const unsubTasks = listenToTasks(activeProject.id, (latestTasks) => {
      if (latestTasks && latestTasks.length > 0) {
        setTasks(latestTasks);
      }
    });

    const unsubPhases = listenToPhases(activeProject.id, (latestPhases) => {
      if (latestPhases && latestPhases.length > 0) {
        setPhases(latestPhases);
      }
    });

    const unsubActivities = listenToActivities(activeProject.id, (latestActs) => {
      if (latestActs && latestActs.length > 0) {
        setActivities(latestActs);
      }
    });

    const unsubTeam = listenToTeam(activeProject.id, (latestTeam) => {
      if (latestTeam && latestTeam.length > 0) {
        setTeam(latestTeam);
      }
    });

    return () => {
      unsubProject();
      unsubTasks();
      unsubPhases();
      unsubActivities();
      unsubTeam();
    };
  }, [activeProject?.id]);

  // Auth Actions
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setCurrentUser(res.user);
        setCurrentView('dashboard');
      }
    } catch (err: any) {
      console.warn('Google popup notice (falling back to guest session):', err.message);
      // Fallback to guest
      handleGuestLogin();
    }
  };

  const handleGuestLogin = () => {
    setProfile(DEFAULT_PROFILE);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Load Capstone Demo Project (AI Student Placement Predictor)
  const handleLoadDemo = async () => {
    const userId = currentUser?.uid || profile?.uid || 'demo-user';
    const demo = await loadDemoProject(userId);

    setActiveProject(demo);
    setPhases(DEMO_PHASES);
    setTasks(DEMO_TASKS);
    setTeam(DEMO_TEAM);
    setActivities(DEMO_ACTIVITIES);
    setActiveBlueprint(demo.blueprint || null);

    setProjects((prev) => {
      const existing = prev.findIndex((p) => p.id === demo.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = demo;
        return next;
      }
      return [demo, ...prev];
    });

    setWorkspaceInitialTab('overview');
    setCurrentView('workspace');
  };

  // Load 36-Hr Hackathon Demo Project (MediAlert AI)
  const handleLoadHackathonDemo = async () => {
    const userId = currentUser?.uid || profile?.uid || 'demo-user';
    const demo = await loadHackathonDemoProject(userId);

    setActiveProject(demo);
    setPhases(HACKATHON_DEMO_PHASES);
    setTasks(HACKATHON_DEMO_TASKS);
    setTeam(HACKATHON_DEMO_TEAM);
    setActivities(HACKATHON_DEMO_ACTIVITIES);
    setActiveBlueprint(demo.blueprint || null);

    setProjects((prev) => {
      const existing = prev.findIndex((p) => p.id === demo.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = demo;
        return next;
      }
      return [demo, ...prev];
    });

    setWorkspaceInitialTab('overview');
    setCurrentView('workspace');
  };

  // Profile Save
  const handleSaveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await saveUserProfile(newProfile);
    if (currentView === 'landing') {
      setCurrentView('dashboard');
    }
  };

  // Idea Generation Endpoint
  const handleGenerateIdeas = async (customPrompt?: string): Promise<ProjectIdea[]> => {
    try {
      const res = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profile || DEFAULT_PROFILE,
          customPrompt
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.ideas)) {
        return data.ideas;
      }
      throw new Error(data.error || 'Failed generating ideas');
    } catch (err) {
      console.error('API generate ideas fallback:', err);
      // Return curated high-scoring options
      return [
        {
          id: 'idea-placement',
          title: 'AI-Based Student Placement Prediction & Skill Gap Analyzer',
          tagline: 'Predict campus recruitment success and get prescriptive learning roadmaps.',
          description: 'Leverages gradient boosting ML models on academic history and coding telemetry to forecast hiring chances.',
          problem: 'Students are blindsided during recruitment drives due to unknown skill mismatches, and placement cells lack predictive diagnostics.',
          solution: 'FastAPI microservice running XGBoost with SHAP explainability and React cohort visualization dashboard.',
          targetUsers: 'Engineering undergraduates, placement directors, faculty mentors',
          techStack: ['Python', 'FastAPI', 'XGBoost', 'React', 'TypeScript', 'Tailwind CSS'],
          requiredSkills: ['Machine Learning', 'Python', 'React', 'REST APIs'],
          duration: '2 months',
          difficulty: 'Innovative',
          expectedImpact: 'Directly helps placement cells proactively identify at-risk students before placement drives begin.',
          novelty: 'Integrates real-time GitHub & LeetCode telemetry with SHAP explainability matrices.',
          feasibility: 'Rich academic Kaggle datasets exist; clean separation between ML pipeline and React UI.',
          datasetRequirements: 'Historical campus hiring datasets with CGPA, internships, and technical assessments.',
          apiRequirements: 'FastAPI REST gateway and GitHub API for student profile verification.',
          mvpScope: ['Candidate questionnaire', 'XGBoost inference model', 'SHAP explainability', 'Skill gap suggestions'],
          futureImprovements: ['LinkedIn badge sync', 'Automated resume parser'],
          feasibilityScore: 92,
          noveltyScore: 89,
          impactScore: 95,
          overallScore: 92,
          whyFits: 'Maximizes your proficiency in Python and ML while giving you a clean React dashboard for your viva demo.'
        },
        {
          id: 'idea-code-mentor',
          title: 'Autonomous Multi-Agent Code Reviewer & Bug Explainer',
          tagline: 'Static AST analysis meets Gemini LLM for automated pull request mentorship.',
          description: 'A GitHub action bot and web dashboard that reviews student pull requests, flags anti-patterns, and suggests fixes.',
          problem: 'Beginner students struggle with software engineering best practices, security vulnerabilities, and code smell.',
          solution: 'Combines tree-sitter AST parser with Gemini 3.8 to generate line-by-line pedagogical review comments.',
          targetUsers: 'Computer science students, open-source contributors, bootcamp teachers',
          techStack: ['Node.js', 'TypeScript', 'Gemini API', 'React', 'Tailwind CSS'],
          requiredSkills: ['JavaScript', 'React', 'Generative AI', 'Node.js'],
          duration: '1 month',
          difficulty: 'Hard',
          expectedImpact: 'Improves software quality and provides students with instantaneous 24/7 code review.',
          novelty: 'Combines deterministic syntax parsing with pedagogical LLM explanations.',
          feasibility: 'Fast API prototyping with Google GenAI SDK and GitHub webhook integration.',
          datasetRequirements: 'OWASP vulnerability benchmarks and open-source GitHub repositories.',
          apiRequirements: 'Gemini 3.8 Flash, GitHub REST API.',
          mvpScope: ['PR diff analyzer', 'Security checker', 'Student feedback dashboard'],
          futureImprovements: ['Multi-language support for Rust and Go'],
          feasibilityScore: 88,
          noveltyScore: 94,
          impactScore: 90,
          overallScore: 90,
          whyFits: 'Leverages your JavaScript and Generative AI strengths to build a high-novelty hackathon submission.'
        },
        {
          id: 'idea-health-ai',
          title: 'Early Diabetic Retinopathy Detection via Deep Learning',
          tagline: 'Computer vision grading of retinal fundus photography with clinical triage tiers.',
          description: 'A deep CNN classification model that grades eye fundus photos into severity tiers with Grad-CAM heatmaps.',
          problem: 'Rural eye clinics face severe ophthalmologist shortages, delaying diabetic retinopathy diagnosis.',
          solution: 'EfficientNet-B4 trained on APTOS dataset wrapped in a secure web intake portal with visual Grad-CAM overlays.',
          targetUsers: 'Rural healthcare workers, clinic technicians, diabetic patients',
          techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Tailwind CSS'],
          requiredSkills: ['Deep Learning', 'Computer Vision', 'Python', 'React'],
          duration: '2 months',
          difficulty: 'Hard',
          expectedImpact: 'High social impact for rural healthcare triage and early disease intervention.',
          novelty: 'Incorporates Grad-CAM visual heatmaps for doctor explainability.',
          feasibility: 'Standard APTOS Kaggle fundus dataset readily available.',
          datasetRequirements: 'APTOS 2019 Blindness Detection Kaggle dataset (3,662 retinal images).',
          apiRequirements: 'TorchVision inference API.',
          mvpScope: ['Image uploader', 'CNN inference', 'Grad-CAM heatmaps', 'Triage report generation'],
          futureImprovements: ['Mobile edge-inference using ONNX Runtime'],
          feasibilityScore: 84,
          noveltyScore: 91,
          impactScore: 96,
          overallScore: 89,
          whyFits: 'Outstanding medical social impact with deep learning that professors and judges love.'
        }
      ];
    }
  };

  // Select an Idea -> Generate Blueprint
  const handleSelectIdea = async (idea: ProjectIdea) => {
    setSelectedIdeaForBlueprint(idea);
    setIsLoadingRoadmap(true);
    setCurrentView('blueprint');

    try {
      const res = await fetch('/api/ai/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: idea,
          profile: profile || DEFAULT_PROFILE
        })
      });
      const data = await res.json();
      if (data.success && data.blueprint) {
        setActiveBlueprint(data.blueprint);

        // Create or update project
        const newProj: Project = {
          id: `proj-${Date.now()}`,
          ownerId: currentUser?.uid || profile?.uid || 'guest-user',
          title: data.blueprint.title || idea.title,
          description: idea.description,
          problem: data.blueprint.problemStatement || idea.problem,
          solution: data.blueprint.solutionOverview || idea.solution,
          targetUsers: data.blueprint.targetUsers || idea.targetUsers,
          techStack: idea.techStack,
          requiredSkills: idea.requiredSkills,
          duration: idea.duration,
          difficulty: idea.difficulty,
          feasibilityScore: idea.feasibilityScore,
          noveltyScore: idea.noveltyScore,
          impactScore: idea.impactScore,
          overallScore: idea.overallScore,
          whyFits: idea.whyFits,
          progress: 0,
          health: 'ON TRACK',
          currentPhase: 'Phase 1: Requirements & System Architecture',
          startDate: new Date().toISOString(),
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          blueprint: data.blueprint,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setActiveProject(newProj);
        setProjects((prev) => [newProj, ...prev]);
        await saveProject(newProj);
      }
    } catch (err) {
      console.warn('Blueprint generation fallback notice:', err);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  // Generate Execution Roadmap (Phases + 20-30 Tasks)
  const handleGenerateRoadmap = async () => {
    if (!activeProject && !activeBlueprint) return;
    setIsLoadingRoadmap(true);

    try {
      const res = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeProject?.title || activeBlueprint?.title || 'Capstone Project',
          blueprint: activeBlueprint || activeProject?.blueprint,
          timeline: profile?.timeline || '2 months'
        })
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.phases) && Array.isArray(data.tasks)) {
        const projectId = activeProject?.id || `proj-${Date.now()}`;
        const generatedTasks: ProjectTask[] = data.tasks.map((t: any, i: number) => ({
          ...t,
          projectId,
          id: t.id || `task-${i + 1}`,
          createdAt: new Date().toISOString()
        }));

        setPhases(data.phases);
        setTasks(generatedTasks);

        if (activeProject) {
          await saveRoadmap(activeProject.id, data.phases, generatedTasks, team);
        }

        setWorkspaceInitialTab('roadmap');
        setCurrentView('workspace');
      } else {
        // Fallback to loaded demo data
        handleLoadDemo();
      }
    } catch (err) {
      console.error('Roadmap generation fallback:', err);
      handleLoadDemo();
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  // Update Task Status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    if (!activeProject) return;

    const { updatedTasks, progress, health } = await updateTaskStatus(
      activeProject.id,
      taskId,
      newStatus,
      tasks,
      activeProject.title,
      activeProject.deadline
    );

    setTasks(updatedTasks);
    setActiveProject((prev) => (prev ? { ...prev, progress, health } : null));
  };

  // Assign Task
  const handleAssignTask = async (taskId: string, memberName: string) => {
    if (!activeProject) return;
    const nextTasks = await assignTaskToMember(activeProject.id, taskId, memberName, tasks);
    setTasks(nextTasks);
  };

  // AI Mentor Chat
  const handleSendMentorMessage = async (prompt: string) => {
    const userMsg: MentorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: 'Just now'
    };

    setMentorMessages((prev) => [...prev, userMsg]);
    setIsSendingMentorMessage(true);

    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          project: activeProject,
          blueprint: activeBlueprint || activeProject?.blueprint,
          phases,
          tasks,
          profile
        })
      });
      const data = await res.json();

      const aiMsg: MentorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "I have analyzed your project state. Focus on closing your current phase tasks to keep your milestone velocity on track.",
        timestamp: 'Just now',
        suggestedAction: data.suggestedAction
      };

      setMentorMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI mentor query error:', err);
      const fallbackMsg: MentorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here is guidance for your capstone: Keep your FastAPI model inference response latency low by pre-loading your XGBoost .joblib model during server startup in a lifespan event rather than re-reading the weights on every request. Make sure your Pydantic schema strictly validates numeric ranges.`,
        timestamp: 'Just now'
      };
      setMentorMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSendingMentorMessage(false);
    }
  };

  // Open mentor chat for specific task
  const handleAskMentorForTask = (task: ProjectTask) => {
    const prompt = `I need guidance on this specific task: "${task.title}". The deliverable is "${task.deliverable}". How should I implement this step-by-step to avoid common pitfalls?`;
    setWorkspaceInitialTab('mentor');
    setCurrentView('workspace');
    handleSendMentorMessage(prompt);
  };

  // Update Deadline in settings
  const handleUpdateDeadline = (newDeadline: string) => {
    if (activeProject) {
      setActiveProject((prev) => (prev ? { ...prev, deadline: newDeadline } : null));
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#6C63FF] selection:text-white pb-16 md:pb-0">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        profile={profile}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => {
          setActiveProject(p);
          setCurrentView('workspace');
        }}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onLoadDemo={handleLoadDemo}
        onLoginGoogle={handleGoogleLogin}
        onLoginGuest={handleGuestLogin}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Body Area */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            onStart={() => {
              if (currentUser || profile) {
                setCurrentView('ideas');
              } else {
                setOnboardingOpen(true);
              }
            }}
            onLoadDemo={handleLoadDemo}
            onExploreIdeas={() => setCurrentView('ideas')}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              activeProject={activeProject}
              onLoadDemo={handleLoadDemo}
              onOpenNewProject={() => setCurrentView('ideas')}
            />
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex">
              <div className="w-72 bg-neutral-950 h-full p-4 border-r border-neutral-800">
                <Sidebar
                  currentView={currentView}
                  setCurrentView={(v) => {
                    setCurrentView(v);
                    setMobileMenuOpen(false);
                  }}
                  activeProject={activeProject}
                  onLoadDemo={() => {
                    handleLoadDemo();
                    setMobileMenuOpen(false);
                  }}
                  onOpenNewProject={() => {
                    setCurrentView('ideas');
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
              <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          {/* Active View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
            {currentView === 'dashboard' && (
              <DashboardView
                profile={profile}
                activeProject={activeProject}
                tasks={tasks}
                phases={phases}
                onOpenWorkspace={() => setCurrentView('workspace')}
                onOpenTaskModal={(t) => setActiveTaskForModal(t)}
                onToggleTaskStatus={(t) => {
                  const nextStatus = t.status === 'COMPLETED' ? 'NOT STARTED' : 'COMPLETED';
                  handleUpdateTaskStatus(t.id, nextStatus);
                }}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onNavigateToIdeas={() => setCurrentView('ideas')}
                onLoadDemo={handleLoadDemo}
                onAskMentor={(q) => {
                  setWorkspaceInitialTab('mentor');
                  setCurrentView('workspace');
                  handleSendMentorMessage(q);
                }}
              />
            )}

            {currentView === 'ideas' && (
              <IdeaGeneratorView
                profile={profile}
                onSelectIdea={handleSelectIdea}
                onGenerateIdeas={handleGenerateIdeas}
              />
            )}

            {currentView === 'blueprint' && activeBlueprint && (
              <BlueprintView
                blueprint={activeBlueprint}
                onGenerateRoadmap={handleGenerateRoadmap}
                isLoadingRoadmap={isLoadingRoadmap}
              />
            )}

            {currentView === 'workspace' && activeProject && (
              <ProjectWorkspaceView
                project={activeProject}
                phases={phases}
                tasks={tasks}
                team={team}
                activities={activities}
                mentorMessages={mentorMessages}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onOpenTaskModal={(t) => setActiveTaskForModal(t)}
                onSendMentorMessage={handleSendMentorMessage}
                isSendingMentorMessage={isSendingMentorMessage}
                initialTab={workspaceInitialTab}
                onAssignTask={handleAssignTask}
              />
            )}

            {currentView === 'projects' && (
              <MyProjectsView
                projects={projects}
                activeProjectId={activeProject?.id}
                onSelectProject={(p) => {
                  setActiveProject(p);
                  setCurrentView('workspace');
                }}
                onNavigateToIdeas={() => setCurrentView('ideas')}
                onLoadDemo={handleLoadDemo}
              />
            )}

            {currentView === 'mentor' && activeProject && (
              <ProjectWorkspaceView
                project={activeProject}
                phases={phases}
                tasks={tasks}
                team={team}
                activities={activities}
                mentorMessages={mentorMessages}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onOpenTaskModal={(t) => setActiveTaskForModal(t)}
                onSendMentorMessage={handleSendMentorMessage}
                isSendingMentorMessage={isSendingMentorMessage}
                initialTab="mentor"
                onAssignTask={handleAssignTask}
              />
            )}

            {currentView === 'analytics' && activeProject && (
              <ProjectWorkspaceView
                project={activeProject}
                phases={phases}
                tasks={tasks}
                team={team}
                activities={activities}
                mentorMessages={mentorMessages}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onOpenTaskModal={(t) => setActiveTaskForModal(t)}
                onSendMentorMessage={handleSendMentorMessage}
                isSendingMentorMessage={isSendingMentorMessage}
                initialTab="analytics"
                onAssignTask={handleAssignTask}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                profile={profile}
                activeProject={activeProject}
                onOpenOnboarding={() => setOnboardingOpen(true)}
                onUpdateDeadline={handleUpdateDeadline}
              />
            )}
          </main>
        </div>
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onSave={handleSaveProfile}
        initialProfile={profile}
        userEmail={currentUser?.email || undefined}
        userUid={currentUser?.uid || undefined}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={activeTaskForModal}
        isOpen={!!activeTaskForModal}
        onClose={() => setActiveTaskForModal(null)}
        onUpdateStatus={handleUpdateTaskStatus}
        onAssignTask={handleAssignTask}
        onAskMentorForTask={handleAskMentorForTask}
        teamMembers={team}
      />

      {/* Mobile Bottom Navigation */}
      {currentView !== 'landing' && (
        <MobileBottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeProject={activeProject}
        />
      )}
    </div>
  );
}
