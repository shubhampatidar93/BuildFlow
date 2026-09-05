import { GoogleGenAI } from '@google/genai';
import {
  UserProfile,
  ProjectIdea,
  ProjectBlueprint,
  ProjectTask,
  ProjectPhase
} from '../src/types';

const apiKey = process.env.GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Fallback curated ideas tailored for student project portfolios
const fallbackIdeas: ProjectIdea[] = [
  {
    id: 'idea-1',
    title: 'EduVision: AI Automated Answer Script Evaluation & Feedback',
    tagline: 'Deep Learning OCR & Semantic Grader for Handwritten College Exams',
    description: 'An automated grading system combining handwritten text OCR with semantic embedding similarity to evaluate descriptive student answers against faculty rubric rubrics.',
    problem: 'Professors spend hundreds of hours manually grading descriptive college mid-terms and finals, resulting in delayed student feedback and subjective inconsistency.',
    solution: 'Scans student answer booklets via mobile or flatbed scanner, recognizes handwriting with Vision Transformers, segments answers, and semantically scores technical accuracy against faculty answer keys while generating targeted student feedback.',
    targetUsers: 'University Professors, Teaching Assistants, Exam Controllers',
    techStack: ['Python', 'FastAPI', 'PyTorch / HuggingFace', 'React', 'Tailwind CSS', 'Firebase'],
    requiredSkills: ['Computer Vision', 'NLP', 'Python', 'React', 'REST APIs'],
    duration: '2 months',
    difficulty: 'Innovative',
    expectedImpact: 'Reduces faculty grading overhead by 75% and provides instantaneous, rubric-aligned diagnostic feedback to students.',
    novelty: 'Combines Vision Transformers (TrOCR) with cross-encoder semantic rubric matching and LLM explanatory feedback.',
    feasibility: 'High feasibility with pre-trained open-source TrOCR and sentence-transformers running on student-accessible GPU/Colab.',
    datasetRequirements: 'IAM Handwriting Database, curated college exam questions & sample multi-mark answer scripts.',
    apiRequirements: 'HuggingFace Inference API / Local PyTorch model, Gemini API for synthesized qualitative feedback.',
    mvpScope: [
      'PDF answer script uploader & page alignment',
      'Handwritten OCR text extraction pipeline',
      'Cosine similarity semantic grader for 5-mark technical questions',
      'Faculty review & score override interface',
      'Student score & diagnostic report exporter'
    ],
    futureImprovements: [
      'Mathematical diagram & equation parser using Mathpix / LaTeX OCR',
      'Plagiarism cross-checking across the entire class cohort'
    ],
    feasibilityScore: 88,
    noveltyScore: 94,
    impactScore: 92,
    overallScore: 91,
    whyFits: 'Directly aligns with your interest in Computer Vision & NLP while utilizing your React & Python foundation for an impressive college presentation.'
  },
  {
    id: 'idea-2',
    title: 'SmartCampus IoT: Energy Grid Optimization & Predictive Maintenance',
    tagline: 'Edge IoT telemetry and ML load forecasting for sustainable campus labs',
    description: 'An end-to-end IoT monitoring and predictive analytics platform that models campus classroom power consumption and predicts equipment failure.',
    problem: 'College campuses waste up to 35% of their electricity on empty lab ventilation and equipment left running overnight with zero automated load telemetry.',
    solution: 'Deploys affordable ESP32 current sensors transmitting MQTT packets to a central server that uses LSTM time-series models to predict usage spikes, detect anomalous power drains, and auto-dispatch maintenance alerts.',
    targetUsers: 'Campus Facility Managers, Lab Administrators, Green Campus Councils',
    techStack: ['Node.js', 'Express', 'Python', 'MQTT Broker', 'React', 'Recharts', 'PostgreSQL / Firestore'],
    requiredSkills: ['IoT', 'Node.js', 'Data Science', 'React', 'Time-series Forecasting'],
    duration: '2 months',
    difficulty: 'Medium',
    expectedImpact: 'Saves 25-30% on institutional electrical bills and prevents lab equipment burnouts.',
    novelty: 'Combines low-cost micro-sensors with micro-forecasting models to simulate campus microgrids.',
    feasibility: 'Very practical with simulated or hardware ESP32 sensors and well-documented MQTT protocols.',
    datasetRequirements: 'Open Energy Information (OpenEI) campus load dataset, simulated MQTT telemetry feeds.',
    apiRequirements: 'MQTT over WebSockets, OpenWeatherMap API for thermal correlation.',
    mvpScope: [
      'Live IoT dashboard displaying watts/volts per campus wing',
      'MQTT ingestion pipeline with anomaly detection thresholding',
      'LSTM 24-hour predictive demand curve',
      'Email / SMS alert system for anomalous overnight loads',
      'CSV historical reporting'
    ],
    futureImprovements: [
      'Automated relay control for remote lab power shutdown',
      'Solar microgrid battery storage balancing'
    ],
    feasibilityScore: 94,
    noveltyScore: 85,
    impactScore: 89,
    overallScore: 90,
    whyFits: 'Leverages full-stack development with tangible IoT & Data Science integration, making it a crowd-favorite hardware-software demo for hackathon judges.'
  },
  {
    id: 'idea-3',
    title: 'MediPulse AI: Clinical Triage & Multilingual Patient Symptom Checker',
    tagline: 'Audio-first vernacular health consultation assistant for rural primary health centers',
    description: 'An accessible clinical triage web app that allows patients to describe symptoms in vernacular languages via voice, performing preliminary urgency triage for clinic doctors.',
    problem: 'Rural clinics face overwhelming queues with 1 doctor per 1,500 patients, leading to misdiagnosed urgency levels and severe delays in emergency intervention.',
    solution: 'Patients speak naturally in their local dialect. The system transcribes, summarizes medical symptoms into standard SOAP notes, flags red-flag vitals, and assigns an Emergency Severity Index (ESI) triage score.',
    targetUsers: 'Rural Health Workers (ASHAs), Clinic Duty Nurses, Outpatient Doctors',
    techStack: ['React', 'TypeScript', 'Node.js', 'Whisper / Speech API', 'Gemini AI', 'Tailwind CSS'],
    requiredSkills: ['Generative AI', 'React', 'TypeScript', 'Healthcare Tech'],
    duration: '1 month',
    difficulty: 'Innovative',
    expectedImpact: 'Drastically shortens critical patient triage delays from 45 minutes to under 3 minutes.',
    novelty: 'Integrates speech recognition with clinical knowledge distillation and structured SOAP doctor notes.',
    feasibility: 'Extremely feasible using modern web speech APIs and server-side LLM clinical prompt chaining.',
    datasetRequirements: 'Synthea synthetic patient records and MIMIC-III anonymized emergency triage logs.',
    apiRequirements: 'Web Speech API / Whisper, Gemini 3.8 Flash for clinical symptom structuring.',
    mvpScope: [
      'Voice input in English and regional languages',
      'Clinical symptom extraction & structured SOAP summary',
      'Urgency classification badge (Emergent, Urgent, Non-urgent)',
      'Doctor queue view with sorted triage priority',
      'Printable consultation slip'
    ],
    futureImprovements: [
      'Offline-first PWA caching for remote clinics with zero connectivity',
      'Pulse-oximeter and Bluetooth BP monitor sync'
    ],
    feasibilityScore: 92,
    noveltyScore: 95,
    impactScore: 96,
    overallScore: 94,
    whyFits: 'High social impact project with cutting-edge Generative AI and Speech capabilities that college evaluators and external judges look for.'
  }
];

export async function generateProjectIdeas(
  profile: Partial<UserProfile>,
  customPrompt?: string
): Promise<ProjectIdea[]> {
  const ai = getAI();
  if (!ai) {
    console.warn('GEMINI_API_KEY missing, using curated project ideas fallback');
    return fallbackIdeas;
  }

  const prompt = `
You are an expert Chief Technology Officer, university project evaluator, and hackathon judge.
A final-year engineering student needs exactly 3 high-caliber, practical, and impressive project ideas tailored to their profile.

STUDENT PROFILE:
- Skills: ${(profile.skills || ['Python', 'React', 'Machine Learning']).join(', ')}
- Interests: ${(profile.interests || ['AI/ML', 'Web Development']).join(', ')}
- Experience Level: ${profile.experienceLevel || 'Intermediate'}
- Team Size: ${profile.teamSize || '3'} students
- Project Timeline: ${profile.timeline || '2 months'}
- Budget: ${profile.budget || 'Free'}
- Preferred Difficulty: ${profile.preferredDifficulty || 'Innovative'}
- Additional Student Desire/Prompt: ${customPrompt || 'Create something with high real-world utility and great demo appeal for final-year engineering.'}

REQUIREMENTS:
1. Generate EXACTLY 3 unique, realistic, and impressive project ideas that a college student or team can realistically build.
2. Calculate realistic scores (0-100) for:
   - feasibilityScore (40% weight)
   - impactScore (30% weight)
   - noveltyScore (30% weight)
   - overallScore = Math.round(feasibilityScore * 0.4 + impactScore * 0.3 + noveltyScore * 0.3)
3. Return ONLY a valid JSON array of 3 objects adhering strictly to this JSON format:
[
  {
    "id": "idea-1",
    "title": "Project Title",
    "tagline": "One-line catchy tagline",
    "description": "2-3 sentences concise description",
    "problem": "Clear problem statement",
    "solution": "Proposed technological solution",
    "targetUsers": "Who benefits directly",
    "techStack": ["Tool 1", "Tool 2", "Tool 3"],
    "requiredSkills": ["Skill 1", "Skill 2"],
    "duration": "Duration e.g. 2 months",
    "difficulty": "Easy" | "Medium" | "Hard" | "Innovative",
    "expectedImpact": "Quantified or clear real-world impact",
    "novelty": "What makes this stand out from generic college projects",
    "feasibility": "Why this is achievable within budget and time",
    "datasetRequirements": "Exact datasets or API needed",
    "apiRequirements": "Required external APIs",
    "mvpScope": ["MVP Feature 1", "MVP Feature 2", "MVP Feature 3", "MVP Feature 4"],
    "futureImprovements": ["Future Improvement 1", "Future Improvement 2"],
    "feasibilityScore": 90,
    "noveltyScore": 88,
    "impactScore": 92,
    "overallScore": 90,
    "whyFits": "Personalized 1-2 sentence explanation connecting the student's skills and interests"
  }
]

Do not include markdown code fences like \`\`\`json or commentary. Output pure valid JSON only.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    const ideas = JSON.parse(cleaned) as ProjectIdea[];
    if (Array.isArray(ideas) && ideas.length >= 3) {
      return ideas.map((idea, idx) => ({
        ...idea,
        id: `idea-${idx + 1}-${Date.now()}`,
        overallScore: Math.round(
          (idea.feasibilityScore || 85) * 0.4 +
          (idea.impactScore || 85) * 0.3 +
          (idea.noveltyScore || 85) * 0.3
        ),
      }));
    }
    return fallbackIdeas;
  } catch (error) {
    console.error('Gemini generateProjectIdeas error:', error);
    return fallbackIdeas;
  }
}

export async function generateProjectBlueprint(
  project: Partial<ProjectIdea>,
  profile?: Partial<UserProfile>
): Promise<ProjectBlueprint> {
  const ai = getAI();
  const defaultBlueprint: ProjectBlueprint = {
    title: project.title || 'AI Student Project',
    problemStatement: project.problem || 'Students and institutions struggle with legacy manual workflows with high latency.',
    solutionOverview: project.solution || 'A modern full-stack web and intelligent microservice solution that automates key bottlenecks.',
    targetUsers: project.targetUsers || 'College Students, Evaluators, and Industry Professionals',
    objectives: [
      'Architect a responsive, low-latency web application dashboard',
      'Implement robust backend API microservices with secure validation',
      'Integrate machine learning / AI models for intelligent inference',
      'Deploy continuous integration pipeline on cloud hosting with SSL',
      'Conduct rigorous evaluation with quantifiable benchmark metrics'
    ],
    mvpFeatures: project.mvpScope || [
      'Interactive user dashboard with real-time status feeds',
      'Core ML / logic inference pipeline with sub-second response',
      'Persistent database storage and state management',
      'Exportable audit and evaluation reports'
    ],
    advancedFeatures: project.futureImprovements || [
      'Multi-tenant role-based access control',
      'Real-time WebSocket telemetry updates',
      'Mobile-responsive Progressive Web App offline capabilities'
    ],
    techStack: [
      { category: 'Frontend', tool: 'React + TypeScript + Tailwind CSS', reason: 'High performance UI with typed safety and rapid prototyping' },
      { category: 'Backend', tool: 'Node.js + Express', reason: 'Non-blocking I/O ideal for REST APIs and microservice orchestration' },
      { category: 'AI / Model', tool: 'Python / Gemini AI / PyTorch', reason: 'Industry-standard ecosystem for intelligent processing' },
      { category: 'Database', tool: 'Firebase Firestore', reason: 'Serverless, low-latency real-time synchronization' },
      { category: 'DevOps', tool: 'Docker + Cloud Run', reason: 'Containerized reproducible deployments with instant scale' }
    ],
    architecture: 'Client SPA connects via HTTPS to an Express API Gateway. The Gateway manages authentication tokens and securely proxies inference queries to backend AI services and reads/writes persistent state to Firestore.',
    datasets: [project.datasetRequirements || 'Curated benchmark dataset from Kaggle/UCI Machine Learning Repository'],
    apis: [project.apiRequirements || 'RESTful endpoints, Cloud AI API'],
    expectedOutput: 'A live production deployment, complete Git repository with clean documentation, unit test suites, and IEEE-format project report.',
    risks: [
      { risk: 'Model inference latency or API rate limits', mitigation: 'Implement client-side optimistic UI and Redis/memory caching for repeated queries' },
      { risk: 'Data scarcity or noise in raw inputs', mitigation: 'Apply automated data augmentation and strict input validation filters' },
      { risk: 'Tight timeline for full-stack integration', mitigation: 'Prioritize core MVP features first; defer stretch goals to phase 2' }
    ],
    futureImprovements: project.futureImprovements || [
      'Automated batch analytics pipeline',
      'Native mobile application client'
    ]
  };

  if (!ai) return defaultBlueprint;

  const prompt = `
You are a Principal Software Architect creating an official IEEE-grade Project Blueprint for a final-year engineering college project:

PROJECT DETAILS:
Title: ${project.title}
Tagline: ${project.tagline}
Problem: ${project.problem}
Solution: ${project.solution}
Tech Stack: ${(project.techStack || []).join(', ')}
Difficulty: ${project.difficulty}
Duration: ${project.duration}

Generate a comprehensive, professional, structured blueprint in pure JSON format:
{
  "title": "${project.title}",
  "problemStatement": "Deep, well-articulated engineering problem statement (3-4 sentences)",
  "solutionOverview": "Architectural solution description (3-4 sentences)",
  "targetUsers": "Primary and secondary stakeholders",
  "objectives": ["Objective 1", "Objective 2", "Objective 3", "Objective 4", "Objective 5"],
  "mvpFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "advancedFeatures": ["Stretch Feature 1", "Stretch Feature 2", "Stretch Feature 3"],
  "techStack": [
    { "category": "Frontend", "tool": "Tool name", "reason": "Justification" },
    { "category": "Backend", "tool": "Tool name", "reason": "Justification" },
    { "category": "AI / ML", "tool": "Tool name", "reason": "Justification" },
    { "category": "Database", "tool": "Tool name", "reason": "Justification" },
    { "category": "DevOps / Deployment", "tool": "Tool name", "reason": "Justification" }
  ],
  "architecture": "Clear description of the system architecture, component interaction, and data lifecycle",
  "datasets": ["Dataset 1", "Dataset 2"],
  "apis": ["API 1", "API 2"],
  "expectedOutput": "Tangible project outputs and evaluation deliverables",
  "risks": [
    { "risk": "Technical Risk 1", "mitigation": "Mitigation Strategy" },
    { "risk": "Scope/Time Risk 2", "mitigation": "Mitigation Strategy" }
  ],
  "futureImprovements": ["Improvement 1", "Improvement 2"]
}

Output ONLY valid JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const text = response.text || '';
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(cleaned) as ProjectBlueprint;
  } catch (err) {
    console.error('Gemini generateProjectBlueprint error:', err);
    return defaultBlueprint;
  }
}

export async function generateExecutionRoadmap(
  projectTitle: string,
  blueprint: ProjectBlueprint,
  timeline: string
): Promise<{ phases: ProjectPhase[]; tasks: ProjectTask[] }> {
  const ai = getAI();

  // Curated comprehensive fallback roadmap: 7 phases, 24 tasks
  const generateFallbackRoadmap = () => {
    const phaseNames = [
      'Phase 1: Project Setup & System Planning',
      'Phase 2: Data Acquisition & Preprocessing',
      'Phase 3: Core Architecture & Backend APIs',
      'Phase 4: Frontend Development & State Management',
      'Phase 5: AI / Model Integration & Optimization',
      'Phase 6: Comprehensive Testing & Security Hardening',
      'Phase 7: Cloud Deployment & Presentation Prep'
    ];

    const fallbackPhases: ProjectPhase[] = phaseNames.map((name, index) => ({
      id: `phase-${index + 1}`,
      title: name,
      order: index + 1,
      status: index === 0 ? 'IN PROGRESS' : 'NOT STARTED',
      totalTasks: index === 0 ? 4 : index === 2 || index === 3 ? 4 : 3,
      completedTasks: 0,
      estimatedHours: 18 + index * 2
    }));

    const rawTasks: Array<Omit<ProjectTask, 'id' | 'projectId' | 'createdAt'>> = [
      // Phase 1
      {
        title: 'Project Requirements Specification & IEEE SRS Document',
        description: 'Draft software requirements specification detailing functional, non-functional, and interface constraints.',
        phase: phaseNames[0],
        phaseOrder: 1,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'None',
        deliverable: 'Complete SRS document approved by mentor',
        whyMatters: 'Foundational baseline required for college evaluation panel',
        aiTips: 'Use standard IEEE 830 format with clear use-case diagrams.',
        commonMistakes: 'Leaving requirements vague or not defining measurable acceptance criteria.'
      },
      {
        title: 'System Architecture & Data Flow Diagram (DFD)',
        description: 'Create Level 0, Level 1, and Level 2 data flow diagrams along with class diagrams.',
        phase: phaseNames[0],
        phaseOrder: 1,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'Project Requirements Specification',
        deliverable: 'High-resolution architecture diagram',
        whyMatters: 'Guides development order and prevents architectural dead-ends',
        aiTips: 'Distinguish between sync HTTP REST and async background workers.',
        commonMistakes: 'Mixing presentation logic with data persistence layers.'
      },
      {
        title: 'Development Environment & Monorepo Initialization',
        description: 'Configure Git version control, ESLint, Prettier, TypeScript config, and environment templates.',
        phase: phaseNames[0],
        phaseOrder: 1,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 3,
        dependencies: 'None',
        deliverable: 'Working GitHub repo with branch protections',
        whyMatters: 'Prevents merge conflicts and code styling inconsistencies',
        aiTips: 'Set up Husky pre-commit hooks to run linters automatically.',
        commonMistakes: 'Committing .env secrets or node_modules to Git.'
      },
      {
        title: 'Database Schema & Firestore Collection Setup',
        description: 'Design NoSQL collections, indexes, security rules, and data model interfaces.',
        phase: phaseNames[0],
        phaseOrder: 1,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'System Architecture',
        deliverable: 'Firestore collections initialized with security rules',
        whyMatters: 'Guarantees reliable persistence and avoids costly redesigns',
        aiTips: 'Keep relational references light; favor subcollections for isolated child records.',
        commonMistakes: 'Allowing open read/write security rules in production.'
      },

      // Phase 2
      {
        title: 'Dataset Sourcing & Benchmark Collection',
        description: 'Collect raw datasets, verify open licensing, and download necessary corpus files.',
        phase: phaseNames[1],
        phaseOrder: 2,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 5,
        dependencies: 'Database Schema',
        deliverable: 'Raw dataset repository with metadata manifest',
        whyMatters: 'Model quality depends entirely on training data cleanliness',
        aiTips: 'Check class balance early to avoid accuracy paradox.',
        commonMistakes: 'Using copyright-restricted datasets without attribution.'
      },
      {
        title: 'Data Cleaning, Normalization & EDA Notebook',
        description: 'Clean missing values, normalize numerical features, and plot feature distribution graphs.',
        phase: phaseNames[1],
        phaseOrder: 2,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 6,
        dependencies: 'Dataset Sourcing',
        deliverable: 'Jupyter Notebook with EDA heatmaps and charts',
        whyMatters: 'Demonstrates deep domain understanding to the college jury',
        aiTips: 'Identify and handle outliers using IQR or Z-score thresholds.',
        commonMistakes: 'Failing to split train/validation sets before feature scaling.'
      },
      {
        title: 'Feature Engineering & Data Pipeline Pipeline',
        description: 'Transform raw textual/numerical features into model-ready tensors and clean JSON payloads.',
        phase: phaseNames[1],
        phaseOrder: 2,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'Data Cleaning',
        deliverable: 'Automated Python data transformation script',
        whyMatters: 'Accelerates training iterations and guarantees reproducible results',
        aiTips: 'Cache preprocessed arrays to disk using joblib or numpy npz.',
        commonMistakes: 'Data leakage from test set into training pipeline.'
      },

      // Phase 3
      {
        title: 'Backend REST API Routing & Controller Setup',
        description: 'Implement Express REST endpoints with structured route controllers and error handling.',
        phase: phaseNames[2],
        phaseOrder: 3,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 5,
        dependencies: 'Development Environment',
        deliverable: 'Operational API endpoints with Swagger/Postman collection',
        whyMatters: 'Provides clean contracts between frontend and backend services',
        aiTips: 'Always validate incoming request body with schema libraries like Zod.',
        commonMistakes: 'Returning generic 500 errors without descriptive payload details.'
      },
      {
        title: 'Authentication & Session Token Middleware',
        description: 'Implement secure JWT / Firebase Auth verification middleware for protected routes.',
        phase: phaseNames[2],
        phaseOrder: 3,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'Backend REST API Routing',
        deliverable: 'Working Auth middleware guarding private endpoints',
        whyMatters: 'Critical cyber security criteria for university project rubrics',
        aiTips: 'Extract bearer tokens from headers and attach user context to req.user.',
        commonMistakes: 'Exposing secret keys in client-facing bundles.'
      },
      {
        title: 'Data Persistence Layer & CRUD Handlers',
        description: 'Implement database CRUD operations with pagination, sorting, and filter capabilities.',
        phase: phaseNames[2],
        phaseOrder: 3,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 5,
        dependencies: 'Authentication Middleware',
        deliverable: 'Tested database query utilities',
        whyMatters: 'Enables responsive user project management and audit history',
        aiTips: 'Limit collection queries with limit() and startAfter() pagination.',
        commonMistakes: 'Loading thousands of documents into memory on every read.'
      },
      {
        title: 'Background Worker & Logging Infrastructure',
        description: 'Setup asynchronous task processing and structured Winston/Morgan logging.',
        phase: phaseNames[2],
        phaseOrder: 3,
        priority: 'LOW',
        status: 'NOT STARTED',
        estimatedHours: 3,
        dependencies: 'Backend REST API Routing',
        deliverable: 'Structured logging streams with correlation IDs',
        whyMatters: 'Diagnoses live production bugs instantly during live demo sessions',
        aiTips: 'Log timestamps, route names, status codes, and execution durations.',
        commonMistakes: 'Logging sensitive user credentials or API keys.'
      },

      // Phase 4
      {
        title: 'Design System & Tailwind Theme Tokens',
        description: 'Implement consistent dark theme tokens, font hierarchy, colors, and button styles.',
        phase: phaseNames[3],
        phaseOrder: 4,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 3,
        dependencies: 'Development Environment',
        deliverable: 'Tailwind config and reusable UI component primitives',
        whyMatters: 'Creates immediate polished impression on external judges',
        aiTips: 'Stick to a tight neutral scale with single accent purple/blue gradient.',
        commonMistakes: 'Hardcoding random hex colors and breaking dark mode contrast.'
      },
      {
        title: 'Interactive Dashboard & Metric Visualizers',
        description: 'Build main executive dashboard featuring statistics cards and real-time Recharts.',
        phase: phaseNames[3],
        phaseOrder: 4,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 6,
        dependencies: 'Design System',
        deliverable: 'Responsive dashboard screen with live chart components',
        whyMatters: 'Primary visual anchor for your college presentation slides',
        aiTips: 'Use ResponsiveContainer with memoized chart dataset formats.',
        commonMistakes: 'Overcrowding cards with unreadable font sizes.'
      },
      {
        title: 'Project Workflow & Step-by-Step Execution Views',
        description: 'Create interactive roadmap visualizers and Kanban status boards.',
        phase: phaseNames[3],
        phaseOrder: 4,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 6,
        dependencies: 'Interactive Dashboard',
        deliverable: 'Functional Task Board with status updates',
        whyMatters: 'Allows evaluators to see real interactive state changes',
        aiTips: 'Provide visual feedback immediately with optimistic state updates.',
        commonMistakes: 'Leaving buttons disabled without loading spinners.'
      },
      {
        title: 'Form Validation & Error Boundary Protection',
        description: 'Implement client-side input validation and React Error Boundary wrappers.',
        phase: phaseNames[3],
        phaseOrder: 4,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'Project Workflow Views',
        deliverable: 'Bulletproof forms with inline feedback',
        whyMatters: 'Prevents embarrassing white-screen crashes during the evaluation demo',
        aiTips: 'Provide fallback UI components when network timeouts occur.',
        commonMistakes: 'Uncontrolled inputs losing cursor focus on every keystroke.'
      },

      // Phase 5
      {
        title: 'Baseline Model Implementation & Evaluation',
        description: 'Implement baseline algorithm to establish comparative performance metrics.',
        phase: phaseNames[4],
        phaseOrder: 5,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 6,
        dependencies: 'Feature Engineering',
        deliverable: 'Trained baseline model with confusion matrix & ROC curve',
        whyMatters: 'Academic papers require a baseline to prove proposed method improvement',
        aiTips: 'Save accuracy, precision, recall, and F1-score in a benchmark table.',
        commonMistakes: 'Evaluating only overall accuracy on imbalanced classes.'
      },
      {
        title: 'Model Fine-Tuning & Hyperparameter Optimization',
        description: 'Run GridSearch / Optuna to optimize learning rates, batch sizes, and model layers.',
        phase: phaseNames[4],
        phaseOrder: 5,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 5,
        dependencies: 'Baseline Model Implementation',
        deliverable: 'Optimized model weights file and validation learning curve plot',
        whyMatters: 'Proves experimental rigor and optimization depth to professors',
        aiTips: 'Implement EarlyStopping to prevent overfitting on validation splits.',
        commonMistakes: 'Tuning hyperparameters on the final holdout test set.'
      },
      {
        title: 'AI Inference Microservice Integration',
        description: 'Expose model inference through dedicated backend endpoint with request queuing.',
        phase: phaseNames[4],
        phaseOrder: 5,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 5,
        dependencies: 'Model Fine-Tuning',
        deliverable: 'Live prediction API connected to frontend UI',
        whyMatters: 'Connects the theoretical AI model to a real working product',
        aiTips: 'Quantize weights or leverage cached session states for fast inference.',
        commonMistakes: 'Reloading large model weights from disk on every single HTTP request.'
      },

      // Phase 6
      {
        title: 'Unit & Integration Testing Suite',
        description: 'Write automated unit tests for core algorithms and integration tests for API routes.',
        phase: phaseNames[5],
        phaseOrder: 6,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 5,
        dependencies: 'AI Inference Microservice',
        deliverable: 'Automated test suite passing with code coverage report',
        whyMatters: 'High marks in college rubrics for software engineering methodology',
        aiTips: 'Test boundary conditions, empty inputs, and simulated network failures.',
        commonMistakes: 'Mocking everything so tests pass without testing real code.'
      },
      {
        title: 'Security Audit & Vulnerability Assessment',
        description: 'Audit CORS headers, sanitize user inputs, check rate limiting and token expirations.',
        phase: phaseNames[5],
        phaseOrder: 6,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 3,
        dependencies: 'Unit & Integration Testing',
        deliverable: 'Security checklist verified and clean dependency audit',
        whyMatters: 'Demonstrates professional grade industry practices',
        aiTips: 'Run npm audit and configure helmet security headers on Express.',
        commonMistakes: 'Leaving test API tokens in public Git commit history.'
      },
      {
        title: 'Cross-Device & Mobile Responsiveness QA',
        description: 'Validate layout responsiveness across mobile viewport (375px), tablet, and desktop.',
        phase: phaseNames[5],
        phaseOrder: 6,
        priority: 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: 3,
        dependencies: 'Interactive Dashboard',
        deliverable: 'Flawless UI verified across phone, tablet, and laptop',
        whyMatters: 'Judges often open live URLs on their personal smartphones',
        aiTips: 'Test hamburger drawers and touch-target button sizes (min 44px).',
        commonMistakes: 'Horizontal scrollbars ruining the mobile experience.'
      },

      // Phase 7
      {
        title: 'Cloud Run Production Deployment & SSL Setup',
        description: 'Deploy containerized web service to Google Cloud Run with custom domain and HTTPS.',
        phase: phaseNames[6],
        phaseOrder: 7,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'Security Audit',
        deliverable: 'Live, publicly accessible production URL',
        whyMatters: 'Distinguishes top 5% of student projects from localhost-only projects',
        aiTips: 'Verify environment variables are securely injected in the Cloud Run container.',
        commonMistakes: 'Binding server to localhost instead of 0.0.0.0.'
      },
      {
        title: 'Comprehensive Project Report (Black Book)',
        description: 'Write complete college dissertation documentation covering Introduction, Literature Survey, Methodology, Results, and References.',
        phase: phaseNames[6],
        phaseOrder: 7,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 8,
        dependencies: 'Unit & Integration Testing',
        deliverable: 'Formatted PDF project report following university guidelines',
        whyMatters: 'Accounts for up to 40% of final university marks',
        aiTips: 'Include all architectural diagrams, performance tables, and screen captures.',
        commonMistakes: 'Missing formal bibliography citations or plagiarism threshold violations.'
      },
      {
        title: 'Presentation Slide Deck & Live Demo Script',
        description: 'Craft 12-slide high-impact presentation deck and rehearse 5-minute live demo walk-through.',
        phase: phaseNames[6],
        phaseOrder: 7,
        priority: 'HIGH',
        status: 'NOT STARTED',
        estimatedHours: 4,
        dependencies: 'Cloud Run Production Deployment',
        deliverable: '12-slide polished pitch deck and 5-min demo video recording',
        whyMatters: 'First impressions win hackathons and final project vivas',
        aiTips: 'Structure pitch: Problem (1m) -> Architecture (1m) -> Live Demo (2m) -> Impact & Q&A (1m).',
        commonMistakes: 'Reading slides verbatim instead of showing the live working product.'
      }
    ];

    const tasks: ProjectTask[] = rawTasks.map((t, idx) => ({
      ...t,
      id: `task-${idx + 1}`,
      projectId: 'current',
      phaseId: `phase-${t.phaseOrder}`,
      createdAt: new Date().toISOString()
    }));

    return { phases: fallbackPhases, tasks };
  };

  if (!ai) return generateFallbackRoadmap();

  const prompt = `
You are a Lead Project Architect. Generate a complete, highly detailed engineering execution roadmap for this final-year college project:

Project: ${projectTitle}
Problem: ${blueprint.problemStatement}
Timeline: ${timeline}
Tech Stack: ${blueprint.techStack.map(t => `${t.category}: ${t.tool}`).join(', ')}

REQUIREMENTS:
1. Generate between 6 to 8 sequential phases (e.g. Planning, Data/Architecture, Backend, Frontend, AI/ML, Testing, Deployment & Presentation).
2. Generate 22 to 28 realistic, highly granular engineering tasks distributed across the phases.
3. Every task MUST have:
   - title: Specific action-oriented name
   - description: 2 sentences explaining what to implement
   - phase: Phase name matching one of your generated phases
   - phaseOrder: 1-indexed number of the phase
   - priority: "LOW" | "MEDIUM" | "HIGH"
   - estimatedHours: 2 to 8
   - dependencies: Preceding task name or "None"
   - deliverable: Concrete tangible output (e.g. "Working REST API", "Clean CSV dataset", "Jupyter notebook")
   - whyMatters: Why this is vital for evaluation
   - aiTips: Practical implementation tip
   - commonMistakes: Common trap students fall into
4. Return ONLY valid JSON:
{
  "phases": [
    { "id": "phase-1", "title": "Phase 1: ...", "order": 1, "estimatedHours": 20 }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "...",
      "description": "...",
      "phase": "Phase 1: ...",
      "phaseOrder": 1,
      "priority": "HIGH",
      "estimatedHours": 4,
      "dependencies": "None",
      "deliverable": "...",
      "whyMatters": "...",
      "aiTips": "...",
      "commonMistakes": "..."
    }
  ]
}

No markdown wrappers or explanation. Pure valid JSON only.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const text = response.text || '';
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    const data = JSON.parse(cleaned);
    if (Array.isArray(data.phases) && Array.isArray(data.tasks) && data.tasks.length >= 15) {
      const phases: ProjectPhase[] = data.phases.map((p: any, idx: number) => ({
        id: `phase-${idx + 1}`,
        title: p.title || `Phase ${idx + 1}`,
        order: idx + 1,
        status: idx === 0 ? 'IN PROGRESS' : 'NOT STARTED',
        totalTasks: data.tasks.filter((t: any) => t.phaseOrder === idx + 1 || t.phase === p.title).length || 3,
        completedTasks: 0,
        estimatedHours: p.estimatedHours || 20
      }));

      const tasks: ProjectTask[] = data.tasks.map((t: any, idx: number) => ({
        id: `task-${idx + 1}`,
        projectId: 'current',
        title: t.title,
        description: t.description,
        phase: t.phase,
        phaseId: `phase-${t.phaseOrder || 1}`,
        phaseOrder: t.phaseOrder || 1,
        priority: t.priority || 'MEDIUM',
        status: 'NOT STARTED',
        estimatedHours: t.estimatedHours || 3,
        dependencies: t.dependencies || 'None',
        deliverable: t.deliverable || 'Code artifact',
        whyMatters: t.whyMatters || 'Essential project requirement',
        aiTips: t.aiTips || 'Focus on modularity and testing.',
        commonMistakes: t.commonMistakes || 'Skipping edge-case handling.',
        createdAt: new Date().toISOString()
      }));

      return { phases, tasks };
    }
    return generateFallbackRoadmap();
  } catch (err) {
    console.error('Gemini generateExecutionRoadmap error:', err);
    return generateFallbackRoadmap();
  }
}

export async function askAiMentor(params: {
  question: string;
  project: any;
  blueprint?: any;
  phases: ProjectPhase[];
  tasks: ProjectTask[];
  currentTask?: ProjectTask | null;
  profile: Partial<UserProfile>;
}): Promise<{
  text: string;
  suggestedAction?: {
    type: 'BREAK_TASK' | 'ADD_TEST_TASK' | 'MOVE_ADVANCED' | 'EASIER_VERSION' | 'ADJUST_DEADLINE';
    label: string;
    details?: string;
  };
}> {
  const { question, project, phases, tasks, currentTask, profile } = params;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const totalCount = tasks.length || 1;
  const percent = Math.round((completedCount / totalCount) * 100);
  const nextIncomplete = tasks.find(t => t.status === 'IN PROGRESS' || t.status === 'NOT STARTED');

  const ai = getAI();
  if (!ai) {
    return {
      text: `You have completed ${completedCount} of ${totalCount} tasks (${percent}% overall progress).
      
Your next critical focus should be: **${currentTask ? currentTask.title : nextIncomplete?.title || 'System Implementation'}**.
      
Key advice for your current phase:
1. Double-check input edge-cases and validate schema constraints early.
2. Maintain clean documentation of your methodology so your project report is easy to compile.
3. Don't hesitate to break complex tasks into 1-hour sub-tasks if you feel blocked.`,
      suggestedAction: {
        type: 'BREAK_TASK',
        label: 'Break current task into smaller steps',
        details: 'Split into data setup, core logic, and validation tests.'
      }
    };
  }

  const systemContext = `
You are the dedicated Senior AI Project Mentor for a final-year engineering student working on "${project.title || 'their capstone'}".
You are NOT a generic chatbot. You have full visibility into the student's live project workspace.

STUDENT PROFILE:
- Name: ${profile.name || 'Student'}
- Skills: ${(profile.skills || []).join(', ')}
- Experience: ${profile.experienceLevel || 'Intermediate'}
- Team Size: ${profile.teamSize || 'Solo'}
- Target Deadline: ${project.deadline || '2 months'}
- Health Status: ${project.health || 'ON TRACK'}

CURRENT PROJECT WORKSPACE STATE:
- Progress: ${percent}% (${completedCount}/${totalCount} tasks completed)
- Current Phase: ${project.currentPhase || phases[0]?.title || 'Phase 1'}
- In-Focus Task: ${currentTask ? `${currentTask.title} (${currentTask.priority} priority, ~${currentTask.estimatedHours}h)` : nextIncomplete?.title || 'None selected'}
- In-Progress / Blocked Tasks: ${tasks.filter(t => t.status === 'IN PROGRESS' || t.status === 'BLOCKED').map(t => `${t.title} [${t.status}]`).join(', ') || 'None'}
- Completed Milestones: ${tasks.filter(t => t.status === 'COMPLETED').map(t => t.title).slice(-5).join(', ') || 'None yet'}

USER ASKS:
"${question}"

INSTRUCTIONS:
1. Answer directly, practically, and empathetically in a high-impact technical mentor tone.
2. Directly reference their current task and project progress to prove you understand their exact context.
3. Provide concrete technical steps, best practices, code snippets, or architectural recommendations.
4. You may propose ONE structured actionable recommendation (e.g. BREAK_TASK, ADD_TEST_TASK, MOVE_ADVANCED, EASIER_VERSION, ADJUST_DEADLINE).
5. Output pure JSON format:
{
  "text": "Your markdown formatted mentor advice...",
  "suggestedAction": {
    "type": "BREAK_TASK" | "ADD_TEST_TASK" | "MOVE_ADVANCED" | "EASIER_VERSION" | "ADJUST_DEADLINE",
    "label": "Short button label for student",
    "details": "Explanation of the action"
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemContext,
      config: { responseMimeType: 'application/json' }
    });
    const text = response.text || '';
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini askAiMentor error:', err);
    return {
      text: `Based on your current milestone (${percent}% completion on ${project.title}), focus on **${currentTask ? currentTask.title : nextIncomplete?.title}**. Keep dependencies isolated and verify unit tests before moving to deployment.`,
      suggestedAction: {
        type: 'BREAK_TASK',
        label: 'Break into 1-hour subtasks'
      }
    };
  }
}
