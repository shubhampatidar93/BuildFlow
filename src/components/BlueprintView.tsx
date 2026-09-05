import React from 'react';
import {
  FileCode,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Server,
  Database,
  Layers,
  Sparkles,
  Loader2,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { ProjectBlueprint } from '../types';

interface BlueprintViewProps {
  blueprint: ProjectBlueprint;
  onGenerateRoadmap: () => Promise<void>;
  isLoadingRoadmap?: boolean;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  blueprint,
  onGenerateRoadmap,
  isLoadingRoadmap = false
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#263247] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1220] border border-[#263247] text-[#22D3EE] text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#6C63FF]" />
            <span>AI Project Blueprint Generated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            {blueprint.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
            {blueprint.solutionOverview}
          </p>
        </div>

        <button
          id="blueprint-build-plan-header-btn"
          onClick={onGenerateRoadmap}
          disabled={isLoadingRoadmap}
          className="self-start md:self-center shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white font-bold text-xs shadow-[0_0_20px_rgba(108,99,255,0.35)] flex items-center gap-2.5 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoadingRoadmap ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Generating Execution Plan...</span>
            </>
          ) : (
            <>
              <span>Build My Execution Plan</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem & Solution */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
            Problem Statement
          </h3>
          <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            {blueprint.problemStatement}
          </p>

          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C63FF] pt-2">
            Target Users
          </h3>
          <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            {blueprint.targetUsers}
          </p>
        </div>

        {/* Project Objectives */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-4">
            Core Engineering Objectives
          </h3>
          <ul className="space-y-2.5">
            {blueprint.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#CBD5E1]">
                <CheckCircle className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feature Breakdown: MVP vs Advanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#34D399]">
              MVP Deliverables (Minimum Viable Capstone)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
              Required for Viva
            </span>
          </div>
          <ul className="space-y-2">
            {blueprint.mvpFeatures.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C63FF]">
              Advanced Stretch Features
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#6C63FF]/20 text-[#22D3EE] border border-[#6C63FF]/40">
              Distinction Grade
            </span>
          </div>
          <ul className="space-y-2">
            {blueprint.advancedFeatures.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tech Stack Selection Matrix */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-4">
          Recommended Technology Stack & Architectural Justifications
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#263247] text-[#94A3B8] font-semibold">
                <th className="pb-3 px-3">Layer / Category</th>
                <th className="pb-3 px-3">Recommended Tool</th>
                <th className="pb-3 px-3">Why This Fits Final-Year Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263247]/60">
              {blueprint.techStack.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 px-3 font-semibold text-[#F8FAFC]">{item.category}</td>
                  <td className="py-3 px-3 font-mono text-[#22D3EE]">{item.tool}</td>
                  <td className="py-3 px-3 text-[#94A3B8] leading-relaxed">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture & Dataflow */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-2">
          High-Level Architecture Pipeline
        </h3>
        <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
          {blueprint.architecture}
        </p>

        <div className="mt-4 pt-4 border-t border-[#263247] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase">Datasets:</span>
            <p className="text-xs text-[#CBD5E1] mt-1">
              {blueprint.datasets.join(', ')}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase">APIs & Services:</span>
            <p className="text-xs text-[#CBD5E1] mt-1">
              {blueprint.apis.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Risks & Mitigations */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#263247]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-4 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span>Technical Risks & Pre-Emptive Mitigations</span>
        </h3>
        <div className="space-y-3">
          {blueprint.risks.map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#0D1220] border border-[#263247] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[#FB7185] font-medium">
                ⚠️ {r.risk}
              </div>
              <div className="text-[#CBD5E1] sm:text-right">
                <span className="text-[#94A3B8] font-semibold">Solution: </span>
                {r.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Conversion Action */}
      <div className="text-center pt-4">
        <button
          id="blueprint-build-plan-bottom-btn"
          onClick={onGenerateRoadmap}
          disabled={isLoadingRoadmap}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white font-bold text-sm shadow-[0_0_24px_rgba(108,99,255,0.4)] inline-flex items-center gap-2.5 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoadingRoadmap ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span>Synthesizing Execution Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Build My Execution Plan (Generate Tasks)</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
