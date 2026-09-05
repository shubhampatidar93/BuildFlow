import React from 'react';
import {
  FolderGit2,
  ArrowRight,
  Plus,
  Play,
  Calendar,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { Project } from '../types';

interface MyProjectsViewProps {
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (project: Project) => void;
  onNavigateToIdeas: () => void;
  onLoadDemo: () => void;
  onLoadHackathonDemo: () => void;
}

export const MyProjectsView: React.FC<MyProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNavigateToIdeas,
  onLoadDemo,
  onLoadHackathonDemo
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE]">
            CAPSTONES & REPOSITORIES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC] mt-0.5">
            My Projects
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Manage your active execution plans, progress tracking, and deliverables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="my-projects-load-demo-btn"
            onClick={onLoadDemo}
            className="px-3.5 py-2 rounded-xl bg-[#0D1220] border border-[#263247] hover:border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] flex items-center gap-1.5 transition-colors"
            title="Load Capstone Demo: AI Student Placement Predictor"
          >
            <Play className="h-3.5 w-3.5 fill-[#22D3EE] text-[#22D3EE]" />
            <span>Load Demo Project</span>
          </button>
          <button
            id="my-projects-load-hackathon-btn"
            onClick={onLoadHackathonDemo}
            className="px-3.5 py-2 rounded-xl bg-[#0D1220] border border-[#263247] hover:border-[#34D399]/40 text-xs font-semibold text-[#34D399] flex items-center gap-1.5 transition-colors"
            title="Load 36-Hr Hackathon Demo: MediAlert AI Triage Copilot"
          >
            <Zap className="h-3.5 w-3.5 fill-[#34D399] text-[#34D399]" />
            <span>Load Hackathon Demo</span>
          </button>
          <button
            id="my-projects-new-idea-btn"
            onClick={onNavigateToIdeas}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-xs font-semibold text-white shadow-[0_0_15px_rgba(108,99,255,0.3)] flex items-center gap-1.5 hover:opacity-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project Idea</span>
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#111827] border border-[#263247] text-center">
          <FolderGit2 className="h-12 w-12 text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#F8FAFC]">No projects found</h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Generate your custom capstone blueprint or load a pre-built demo project to explore execution tracking.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onNavigateToIdeas}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-semibold"
            >
              Generate Ideas
            </button>
            <button
              onClick={onLoadDemo}
              className="px-5 py-2.5 rounded-xl bg-[#0D1220] text-[#22D3EE] border border-[#263247] text-xs font-semibold flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-[#22D3EE]" />
              <span>Load Capstone Demo</span>
            </button>
            <button
              onClick={onLoadHackathonDemo}
              className="px-5 py-2.5 rounded-xl bg-[#0D1220] text-[#34D399] border border-[#263247] text-xs font-semibold flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 fill-[#34D399]" />
              <span>Load Hackathon Demo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => {
            const isActive = activeProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#111827] border-[#6C63FF] shadow-[0_0_20px_rgba(108,99,255,0.15)]'
                    : 'bg-[#111827] border-[#263247] hover:border-[#6C63FF]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                      ● {proj.health || 'ON TRACK'}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {proj.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F8FAFC]">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                    {proj.problem}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-[#263247]">
                    <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5">
                      <span>Progress</span>
                      <span className="font-semibold text-[#22D3EE]">{proj.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#080B14] overflow-hidden border border-[#263247]">
                      <div
                        className="h-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#0D1220] border border-[#263247] text-[#CBD5E1] text-[10px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#263247] flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8]">
                    {proj.difficulty} Level
                  </span>
                  <button
                    id={`open-project-btn-${proj.id}`}
                    onClick={() => onSelectProject(proj)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
