import { Project, ProjectPhase, ProjectTask, TeamMember, ProjectActivity } from '../types';

export const HACKATHON_DEMO_PROJECT: Project = {
  id: 'demo-hackathon-medialert',
  ownerId: 'demo-user',
  title: 'MediAlert AI: 36-Hr Multimodal Emergency Triage & Dispatch Copilot',
  description: 'An autonomous, rapid-response triage platform that combines real-time streaming audio with multimodal vision models (Gemini 2.5 Flash) to classify mass-casualty emergency calls into START triage codes and dispatch field alerts in under 3 seconds.',
  problem: 'In disaster scenarios and overloaded ER trauma bays, dispatchers face severe cognitive overload trying to transcribe chaotic voice calls, leading to a critical 4–7 minute delay in classifying trauma severity.',
  solution: 'Streams caller audio directly to Gemini 2.5 Flash for simultaneous audio transcription, symptom semantic extraction, and automated START triage categorization (Immediate/Delayed/Minor/Deceased), generating instant WebRTC trauma telemetry for incoming ambulances.',
  targetUsers: '911 Emergency Dispatchers, Field Paramedics, Disaster Response Teams, Hackathon Jury',
  techStack: ['React', 'TypeScript', 'Gemini 2.5 Flash', 'FastAPI', 'WebRTC', 'Tailwind CSS', 'Firebase Firestore', 'Google Cloud Run'],
  requiredSkills: ['Prompt Engineering', 'WebRTC', 'React', 'FastAPI', 'Python', 'Real-Time Telemetry'],
  duration: '36 hours',
  difficulty: 'Innovative',
  feasibilityScore: 95,
  noveltyScore: 97,
  impactScore: 98,
  overallScore: 96,
  whyFits: 'Tailor-made for hackathon victory: showcases live Gemini multimodal audio/vision capabilities, high-stakes social impact, and a working real-time dispatcher telemetry UI.',
  progress: 58,
  health: 'ON TRACK',
  currentPhase: 'Phase 3: Live Telemetry Dispatch Board & Audio Pipeline',
  startDate: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  deadline: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
  blueprint: {
    title: 'MediAlert AI: 36-Hr Multimodal Emergency Triage & Dispatch Copilot',
    problemStatement: 'Emergency trauma dispatch response times degrade drastically during multi-incident emergencies. Dispatchers spend critical minutes manually documenting fragmented speech and calculating triage scores, delaying ambulance deployment.',
    solutionOverview: 'A sub-second emergency response copilot built during a 36-hour sprint. Uses Gemini 2.5 Flash streaming API to parse 911 audio and smartphone trauma images, calculating standardized START triage classifications, vitals extraction, and nearest ER bed routing.',
    targetUsers: 'Emergency dispatchers, triage nurses, EMT field crews, municipal disaster response command',
    objectives: [
      'Ingest live WebRTC caller audio and generate sub-second transcription with symptom extraction',
      'Execute prompt-engineered Gemini 2.5 Flash triage classifier outputting JSON structured trauma tags',
      'Display real-time interactive hospital trauma bay map with automated bed capacity alerts',
      'Deploy single-container FastAPI and React stack to Google Cloud Run with low latency',
      'Prepare live 3-minute hackathon pitch with simulated 911 emergency test cases'
    ],
    mvpFeatures: [
      'Live microphone speech-to-triage simulator with simulated caller audio playback',
      'Automated START color-coded triage badges (Red: Immediate, Yellow: Delayed, Green: Walking Wounded)',
      'Extracted patient vital indicators (GCS Score, Respiratory Rate, Radial Pulse, Ambulation)',
      'One-click ambulance dispatch dispatch notification dispatch card',
      'Live countdown timer to hackathon code-freeze and submission pitch deck'
    ],
    advancedFeatures: [
      'Multimodal camera image upload for rapid burn-percentage and wound severity estimation',
      'Offline-first indexedDB queue for field ambulances operating in cellular dead-zones'
    ],
    techStack: [
      { category: 'Frontend', tool: 'React, TypeScript, Tailwind CSS, Lucide Icons', reason: 'High-contrast trauma dispatch console with immediate visual feedback' },
      { category: 'AI Inference', tool: 'Gemini 2.5 Flash via Server-Side REST Proxy', reason: 'Sub-second structured JSON reasoning and streaming speech parsing' },
      { category: 'Backend Engine', tool: 'Node.js Express + FastAPI', reason: 'Low-overhead streaming endpoints and mock call telemetry dispatch' },
      { category: 'Database & Sync', tool: 'Firebase Firestore', reason: 'Real-time collaborative reactive sync between dispatcher and field units' },
      { category: 'Deployment', tool: 'Google Cloud Run', reason: 'Instant serverless deployment accessible to hackathon evaluators' }
    ],
    architecture: 'Caller audio or simulated trauma stream enters client microphone -> Web Audio API buffers PCM chunks -> Server-side proxy calls Gemini 2.5 Flash with structured system instructions -> JSON triage classification writes to Firestore -> Dispatch dashboard visualizes live incident pins with audio waveform.',
    datasets: ['MIMIC-IV Emergency Department Triage Benchmark & Simulated START Algorithm 911 audio samples'],
    apis: ['Google Gemini API, Web Audio API, Firebase Firestore Real-Time SDK'],
    expectedOutput: 'A functioning 36-hour hackathon web application with live voice-to-triage demo, responsive dispatch map, test audio simulator, and 5-slide PDF pitch deck.',
    risks: [
      { risk: 'Gemini rate-limits during high-frequency hackathon judging', mitigation: 'Cached fallback responses and local heuristic fallback triage engine' },
      { risk: 'Browser microphone permission blockages in iframe', mitigation: 'Pre-recorded realistic audio scenario player with instant transcript injection' }
    ],
    nextSteps: [
      'Verify Gemini API structured JSON schema for START triage codes',
      'Polish 3-minute pitch deck narrative highlighting life-saving trauma intervention',
      'Rehearse live judge demo using simulated multi-casualty highway collision scenario'
    ]
  },
  createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString()
};

export const HACKATHON_DEMO_PHASES: ProjectPhase[] = [
  {
    id: 'hphase-1',
    projectId: 'demo-hackathon-medialert',
    title: 'Phase 1: Problem Pitch & Architecture Blueprint',
    order: 1,
    description: 'Establish team roles, draft system architecture, configure Gemini API keys, and establish the emergency dispatch UI layout (Hours 0–6).',
    status: 'COMPLETED',
    startDate: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hphase-2',
    projectId: 'demo-hackathon-medialert',
    title: 'Phase 2: Gemini Triage Prompting & Core Pipeline',
    order: 2,
    description: 'Engineer strict structured JSON system prompts for START triage criteria, integrate server-side Gemini API proxy, and build trauma scoring model (Hours 6–16).',
    status: 'COMPLETED',
    startDate: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hphase-3',
    projectId: 'demo-hackathon-medialert',
    title: 'Phase 3: Live Telemetry Dispatch Board & Audio Pipeline',
    order: 3,
    description: 'Build real-time Web Audio transcription waveform, interactive hospital capacity triage board, and audio playback test harness (Hours 16–28).',
    status: 'IN PROGRESS',
    startDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hphase-4',
    projectId: 'demo-hackathon-medialert',
    title: 'Phase 4: Cloud Run Deployment, Pitch Deck & Live Rehearsal',
    order: 4,
    description: 'Deploy live container to Cloud Run, record backup demo video, create 5-slide hackathon pitch deck, and rehearse 3-min live presentation (Hours 28–36).',
    status: 'NOT STARTED',
    startDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString()
  }
];

export const HACKATHON_DEMO_TASKS: ProjectTask[] = [
  // Phase 1 Tasks (Completed)
  {
    id: 'htask-101',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-1',
    phase: 'Phase 1: Problem Pitch & Architecture Blueprint',
    title: 'Define START algorithm clinical rules & trauma tags',
    description: 'Formulate precise medical logic for Simple Triage and Rapid Treatment (START) algorithm: respiration rate (>30 bpm = Immediate), radial pulse assessment, and mental status commands.',
    status: 'COMPLETED',
    priority: 'HIGH',
    estimatedHours: 2,
    actualHours: 1.5,
    deliverable: 'Standardized START medical triage decision tree specification markdown',
    whyMatters: 'Guarantees clinical accuracy and shows medical domain credibility to hackathon evaluators',
    commonMistakes: 'Using non-standard triage rubrics that doctors or healthcare mentors will question',
    howToVerify: 'Verify test cases where RR > 30 automatically tags RED (Immediate)',
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-102',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-1',
    phase: 'Phase 1: Problem Pitch & Architecture Blueprint',
    title: 'Initialize repository, Tailwind theme & dark dispatch UI shell',
    description: 'Set up Vite + React project with emergency ops dark theme (#080B14 canvas, emergency red #FB7185, vital cyan #22D3EE, and ambulance yellow #FBBF24).',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    estimatedHours: 2,
    actualHours: 2,
    deliverable: 'Clean modular layout with high-contrast emergency console frame',
    whyMatters: 'Immediate visual impact when judges first glance at the demo screen',
    commonMistakes: 'Generic white SaaS look that does not feel like an emergency operations center',
    howToVerify: 'Inspect typography and contrast across desktop and mobile screens',
    createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-103',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-1',
    phase: 'Phase 1: Problem Pitch & Architecture Blueprint',
    title: 'Configure server-side Gemini 2.5 Flash API proxy route',
    description: 'Build secure Express backend endpoint `/api/triage/classify` that injects GEMINI_API_KEY from environment without exposing secrets in client bundle.',
    status: 'COMPLETED',
    priority: 'HIGH',
    estimatedHours: 2,
    actualHours: 1.8,
    deliverable: 'Working server proxy returning valid Gemini responses to frontend',
    whyMatters: 'Prevents security leakage and adheres to strict hackathon rule requirements',
    commonMistakes: 'Putting API keys in frontend VITE_ environment variables',
    howToVerify: 'Send test payload via curl and verify HTTP 200 with structured JSON',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },

  // Phase 2 Tasks (Completed)
  {
    id: 'htask-201',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-2',
    phase: 'Phase 2: Gemini Triage Prompting & Core Pipeline',
    title: 'Engineer structured JSON schema for Gemini 2.5 Flash triage parsing',
    description: 'Craft comprehensive system prompt enforcing JSON output: triageCategory (RED/YELLOW/GREEN/BLACK), confidenceScore, vitalsDetected, recommendedEquipment, and 1-sentence dispatcher summary.',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    estimatedHours: 3,
    actualHours: 2.5,
    deliverable: 'Tested system prompt producing 100% parseable JSON objects',
    whyMatters: 'Unstructured text breaks downstream UI widgets during rapid live demos',
    commonMistakes: 'Letting LLM output conversational markdown preambles like "Sure, here is the triage:"',
    howToVerify: 'Test 20 noisy speech inputs and ensure JSON.parse never fails',
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-202',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-2',
    phase: 'Phase 2: Gemini Triage Prompting & Core Pipeline',
    title: 'Build simulated 911 audio scenario test dataset',
    description: 'Curate 4 high-stakes audio scenario presets: Multi-Vehicle Pileup (RED), Compound Fracture in Hiking Trail (YELLOW), Minor Laceration (GREEN), and Cardiac Arrest with CPR in progress (RED).',
    status: 'COMPLETED',
    priority: 'HIGH',
    estimatedHours: 2.5,
    actualHours: 2,
    deliverable: 'Interactive audio simulator pill buttons for instant one-click demonstration',
    whyMatters: 'Hackathon Wi-Fi or microphone failures will kill a demo if you do not have rock-solid presets',
    commonMistakes: 'Relying exclusively on live microphone speaking in a noisy hackathon hall',
    howToVerify: 'Click each scenario and confirm immediate triage classification within 1.5 seconds',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-203',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-2',
    phase: 'Phase 2: Gemini Triage Prompting & Core Pipeline',
    title: 'Connect Firebase Firestore real-time triage event synchronization',
    description: 'Set up collection `emergency_events` with onSnapshot listeners so any new incoming call appears immediately across all connected paramedic iPads without page refresh.',
    status: 'COMPLETED',
    priority: 'HIGH',
    estimatedHours: 3,
    actualHours: 2.8,
    deliverable: 'Real-time WebSocket/Firestore reactive event synchronization',
    whyMatters: 'Demonstrates collaborative multi-user capabilities that judges reward heavily',
    commonMistakes: 'Polling server every 5 seconds instead of real-time reactive sync',
    howToVerify: 'Open two browser windows side by side and trigger a call in window A; see window B update instantly',
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
  },

  // Phase 3 Tasks (In Progress / Active)
  {
    id: 'htask-301',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-3',
    phase: 'Phase 3: Live Telemetry Dispatch Board & Audio Pipeline',
    title: 'Implement animated audio waveform & live transcription streamer',
    description: 'Create Web Audio API canvas visualizer displaying real-time sound frequencies and typewriter transcription stream as the caller speaks into the microphone.',
    status: 'IN PROGRESS',
    priority: 'CRITICAL',
    estimatedHours: 3,
    actualHours: 1.5,
    deliverable: 'Smooth 60fps pulsating audio wave and synchronized transcript box',
    whyMatters: 'Visual punchiness: judges instantly see that real-time AI audio processing is occurring',
    commonMistakes: 'Static text with no motion; judges cannot tell if speech processing is real-time',
    howToVerify: 'Speak into microphone and see waveform amplitude scale dynamically with volume',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-302',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-3',
    phase: 'Phase 3: Live Telemetry Dispatch Board & Audio Pipeline',
    title: 'Create trauma bay hospital capacity tracker & dynamic routing',
    description: 'Render interactive map/grid showing regional Level-1 trauma centers with live ICU bed counts, estimated ambulance transit time, and automatic best-facility assignment.',
    status: 'IN PROGRESS',
    priority: 'HIGH',
    estimatedHours: 2.5,
    actualHours: 1,
    deliverable: 'Interactive hospital cards with live bed counts and one-click ambulance rerouting',
    whyMatters: 'Shows end-to-end ecosystem value beyond a simple chatbot wrapper',
    commonMistakes: 'Showing only patient score without solving the logistical destination problem',
    howToVerify: 'Click "Reroute to Metro Trauma Bay" and confirm updated dispatch destination',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-303',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-3',
    phase: 'Phase 3: Live Telemetry Dispatch Board & Audio Pipeline',
    title: 'Add photo wound analysis modal with Gemini multimodal vision',
    description: 'Build camera capture component allowing field EMTs to photograph trauma wounds and receive instant laceration/burn severity estimation to cross-verify audio triage.',
    status: 'NOT STARTED',
    priority: 'MEDIUM',
    estimatedHours: 2.5,
    actualHours: 0,
    deliverable: 'Drag-and-drop / camera snapshot uploader with instant Gemini vision diagnosis',
    whyMatters: 'Showcases cutting-edge Gemini 2.5 Flash multimodal vision capabilities',
    commonMistakes: 'Uploading giant uncompressed 15MB phone images that crash the server',
    howToVerify: 'Upload test trauma image and receive bounding box or severity estimate within 2 seconds',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },

  // Phase 4 Tasks (Upcoming)
  {
    id: 'htask-401',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-4',
    phase: 'Phase 4: Cloud Run Deployment, Pitch Deck & Live Rehearsal',
    title: 'Containerize and deploy application to Google Cloud Run',
    description: 'Ensure single Docker build compiles Vite frontend to dist/ and starts Express backend on port 3000, deploying live public URL for judges.',
    status: 'NOT STARTED',
    priority: 'CRITICAL',
    estimatedHours: 2,
    actualHours: 0,
    deliverable: 'Live accessible HTTPS URL running in high-performance production mode',
    whyMatters: 'Judges test the app on their own phones during evaluations',
    commonMistakes: 'Testing only on localhost and discovering CORS/port issues 10 minutes before judging',
    howToVerify: 'Load app on mobile LTE network and test complete audio triage loop',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-402',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-4',
    phase: 'Phase 4: Cloud Run Deployment, Pitch Deck & Live Rehearsal',
    title: 'Craft 5-slide pitch deck (Problem, Live Demo Hook, Architecture, Impact, Tech Stack)',
    description: 'Build crisp, high-impact presentation deck: Slide 1 The 7-Minute Triage Gap, Slide 2 Live Architecture Flow, Slide 3 Gemini 2.5 Flash Real-Time Magic, Slide 4 Field Validation, Slide 5 Team & Next Steps.',
    status: 'NOT STARTED',
    priority: 'HIGH',
    estimatedHours: 2,
    actualHours: 0,
    deliverable: 'High-resolution PDF pitch deck ready for projector display',
    whyMatters: 'Hackathons are 50% technical execution and 50% storytelling clarity',
    commonMistakes: 'Too many text-heavy slides; judges want to see the product in action immediately',
    howToVerify: 'Time verbal walkthrough to ensure it fits comfortably within 3 minutes',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'htask-403',
    projectId: 'demo-hackathon-medialert',
    phaseId: 'hphase-4',
    phase: 'Phase 4: Cloud Run Deployment, Pitch Deck & Live Rehearsal',
    title: 'Record 2-minute backup demo screen recording with audio',
    description: 'Record flawless walkthrough video showing audio triage, Firestore sync, and hospital bed assignment in case projector Wi-Fi experiences jitter during the live pitch.',
    status: 'NOT STARTED',
    priority: 'MEDIUM',
    estimatedHours: 1.5,
    actualHours: 0,
    deliverable: '1080p MP4 backup demo video hosted on YouTube/Loom and local laptop storage',
    whyMatters: 'Zero risk of pitch failure even if live Wi-Fi goes down in presentation hall',
    commonMistakes: 'Not having a backup video and freezing on stage when internet drops',
    howToVerify: 'Play MP4 video file locally with audio unmuted',
    createdAt: new Date().toISOString()
  }
];

export const HACKATHON_DEMO_TEAM: TeamMember[] = [
  {
    id: 'hmem-1',
    projectId: 'demo-hackathon-medialert',
    name: 'Priya Sharma',
    role: 'Lead Developer & ML Engineer',
    email: 'priya.s@hackathon.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    assignedTaskCount: 5,
    completedTaskCount: 3
  },
  {
    id: 'hmem-2',
    projectId: 'demo-hackathon-medialert',
    name: 'Shubham Patidar',
    role: 'Full Stack & Audio Specialist',
    email: 'patidarshubh17@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    assignedTaskCount: 4,
    completedTaskCount: 2
  },
  {
    id: 'hmem-3',
    projectId: 'demo-hackathon-medialert',
    name: 'Alex Rivera',
    role: 'Product Designer & Pitch Lead',
    email: 'alex.r@hackathon.dev',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    assignedTaskCount: 3,
    completedTaskCount: 1
  }
];

export const HACKATHON_DEMO_ACTIVITIES: ProjectActivity[] = [
  {
    id: 'hact-1',
    projectId: 'demo-hackathon-medialert',
    type: 'TASK_COMPLETED',
    description: 'Connected Firebase Firestore real-time triage event synchronization',
    author: 'Shubham Patidar',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'hact-2',
    projectId: 'demo-hackathon-medialert',
    type: 'TASK_COMPLETED',
    description: 'Simulated 911 audio scenario test dataset completed with 4 trauma presets',
    author: 'Priya Sharma',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hact-3',
    projectId: 'demo-hackathon-medialert',
    type: 'TASK_STARTED',
    description: 'Began building animated Web Audio waveform & live transcription streamer',
    author: 'Shubham Patidar',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hact-4',
    projectId: 'demo-hackathon-medialert',
    type: 'STATUS_CHANGE',
    description: 'Phase 2 (Gemini Triage Prompting) marked COMPLETED at 100%',
    author: 'Priya Sharma',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hact-5',
    projectId: 'demo-hackathon-medialert',
    type: 'PROJECT_CREATED',
    description: 'Hackathon team registered: MediAlert AI 36-Hr Multimodal Emergency Triage Copilot',
    author: 'Alex Rivera',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
  }
];
