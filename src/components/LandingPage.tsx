import React from 'react';
import {
  ArrowRight,
  Play,
  Brain,
  Map,
  CheckCircle2,
  Bot,
  Clock,
  BarChart3,
  Layers,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import { BuildFlowLogo } from './BuildFlowLogo';

interface LandingPageProps {
  onStart: () => void;
  onLoadDemo: () => void;
  onLoadHackathonDemo?: () => void;
  onExploreIdeas: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLoadDemo,
  onLoadHackathonDemo,
  onExploreIdeas,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Describe yourself',
      desc: 'Input your programming skills, available timeline, team members, and target domain interests.',
    },
    {
      num: '02',
      title: 'Get personalized ideas',
      desc: 'AI scores ideas across Feasibility (40%), Novelty (30%), and Real-world Impact (30%) for your portfolio.',
    },
    {
      num: '03',
      title: 'Build your execution plan',
      desc: 'Transforms the chosen idea into an engineering blueprint and 20–30 modular, milestone tasks.',
    },
    {
      num: '04',
      title: 'Track every task',
      desc: 'Know exactly what to work on today with step-by-step Kanban tracking and deliverable checks.',
    },
    {
      num: '05',
      title: 'Finish your project',
      desc: 'Deliver a production-grade capstone project on time with full viva presentation readiness.',
    },
  ];

  const whyBuildFlow = [
    {
      icon: Brain,
      title: 'AI Project Intelligence',
      desc: 'Personalized project recommendations calibrated to your actual technical skill set and college timeline.',
    },
    {
      icon: Map,
      title: 'Execution Roadmap',
      desc: 'Turns vague ideas into 20–30 granular, actionable engineering tasks with clear deliverables and hours.',
    },
    {
      icon: CheckCircle2,
      title: 'Smart Task Tracking',
      desc: 'Always know what to work on next. Keep daily focus sharp with active phase prioritization.',
    },
    {
      icon: Bot,
      title: 'AI Mentor',
      desc: 'Project-aware engineering guidance grounded in your code architecture, current blockers, and deadlines.',
    },
    {
      icon: Clock,
      title: 'Deadline Intelligence',
      desc: 'Live velocity tracking alerts you whether your project is ON TRACK or AT RISK before crunch time.',
    },
    {
      icon: BarChart3,
      title: 'Project Analytics',
      desc: 'High-visibility charts track completion velocity, hours invested, and departmental viva benchmarks.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#080B14] text-[#F8FAFC]">
      {/* Subtle glowing violet/cyan radial background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[840px] h-[480px] bg-gradient-to-b from-[#6C63FF]/15 via-[#22D3EE]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1220] border border-[#263247] text-[#22D3EE] text-xs font-semibold mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
            <span>FROM IDEA TO EXECUTION</span>
          </div>

          {/* Display Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.1] mb-6">
            BUILD<span className="text-[#22D3EE]">flow</span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-[#CBD5E1] mb-4">
            From Idea to Execution.
          </p>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-8">
            Turn your final-year project idea into a step-by-step execution plan and actually finish it. Generate a project, build the roadmap, complete it step by step.
          </p>

          {/* Primary / Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-start-building-btn"
              onClick={onStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_24px_rgba(108,99,255,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Building</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="hero-explore-demo-btn"
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#CBD5E1] hover:text-white bg-[#0D1220] hover:bg-[#111827] border border-[#263247] hover:border-[#22D3EE]/50 transition-all"
            >
              <Play className="h-4 w-4 fill-[#22D3EE] text-[#22D3EE]" />
              <span>Explore Demo</span>
            </button>
          </div>
        </div>

        {/* HERO VISUAL: Floating Project Execution Dashboard */}
        <div className="mt-14 relative max-w-3xl mx-auto">
          {/* Subtle ambient glow behind dashboard */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/20 to-[#22D3EE]/20 rounded-2xl blur-xl -z-10" />

          <div className="rounded-2xl border border-[#263247] bg-[#111827] p-5 sm:p-6 shadow-2xl">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#263247]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FB7185]/60" />
                <div className="h-3 w-3 rounded-full bg-[#FBBF24]/60" />
                <div className="h-3 w-3 rounded-full bg-[#34D399]/60" />
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  AI PROJECT WORKSPACE
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                ON TRACK
              </span>
            </div>

            {/* Project Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  AI Student Placement Predictor
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  12 / 18 tasks completed • 18 days remaining
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#CBD5E1]">Progress</span>
                  <p className="text-lg font-extrabold text-[#22D3EE] leading-none">68%</p>
                </div>
                <div className="w-24 sm:w-28 h-2 rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE]"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>
            </div>

            {/* Active Phase & Next Task Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Current Phase Card */}
              <div className="rounded-xl bg-[#0D1220] border border-[#263247] p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  CURRENT PHASE
                </span>
                <p className="text-sm font-bold text-[#F8FAFC] mt-1">
                  Model Development
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#34D399]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>4 of 6 phase tasks done</span>
                </div>
              </div>

              {/* Next Best Task Card */}
              <div className="rounded-xl bg-[#0D1220] border border-[#6C63FF]/40 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE]">
                    NEXT BEST TASK
                  </span>
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    ~2 hours
                  </span>
                </div>
                <p className="text-sm font-bold text-[#F8FAFC] mt-1">
                  Train baseline model
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#CBD5E1]">Deliverable: benchmark.py</span>
                  <button
                    onClick={onLoadDemo}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-sm"
                  >
                    Start Task →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#263247]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
            EXECUTION PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1.5">
            How It Works
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2">
            Five deliberate steps designed to guide any student from zero to a finished, viva-ready project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative rounded-xl bg-[#111827] border border-[#263247] p-5 hover:border-[#6C63FF]/50 transition-all group"
            >
              <div className="text-2xl font-extrabold text-[#6C63FF] mb-2 font-display">
                {step.num}
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY BUILDFLOW? SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#263247]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6C63FF]">
            ENGINEERED FOR FINISHERS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1.5">
            Why BUILDflow?
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2">
            Most student projects stall because of vague plans. BUILDflow converts intent into execution momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyBuildFlow.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-xl bg-[#111827] border border-[#263247] p-5 hover:border-[#22D3EE]/40 hover:bg-[#172033] transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D1220] border border-[#263247] mb-4 text-[#22D3EE]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#F8FAFC] mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#0D1220] via-[#111827] to-[#0D1220] border border-[#263247] p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Ready to finish your capstone?
            </h3>
            <p className="text-sm text-[#94A3B8] mt-2 mb-6">
              Skip weeks of confusion. Generate your custom execution blueprint in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_20px_rgba(108,99,255,0.35)] transition-all"
              >
                <span>Generate Your Project</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onLoadDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-white bg-[#080B14] border border-[#263247] hover:border-[#6C63FF]/40 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-[#22D3EE] text-[#22D3EE]" />
                <span>Load Live Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#263247] py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#94A3B8]">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <BuildFlowLogo size="sm" />
          <p>
            BUILDflow AI • From Idea to Execution. Built for university students and hackathons.
          </p>
          <div className="flex items-center gap-4 text-[#CBD5E1]">
            <button onClick={onLoadDemo} className="hover:text-[#22D3EE] transition-colors" title="Load AI Placement Predictor Demo">
              Capstone Demo
            </button>
            {onLoadHackathonDemo && (
              <button onClick={onLoadHackathonDemo} className="hover:text-[#34D399] transition-colors" title="Load MediAlert 36-Hr Hackathon Demo">
                Hackathon Demo
              </button>
            )}
            <button onClick={onStart} className="hover:text-[#22D3EE] transition-colors">
              New Project
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
