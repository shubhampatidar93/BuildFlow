import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Clock,
  Target,
  Trophy,
  Loader2,
  Lightbulb,
  Check,
  Star
} from 'lucide-react';
import { ProjectIdea, UserProfile } from '../types';

interface IdeaGeneratorViewProps {
  profile: UserProfile | null;
  onSelectIdea: (idea: ProjectIdea) => void;
  onGenerateIdeas: (prompt?: string) => Promise<ProjectIdea[]>;
  initialIdeas?: ProjectIdea[];
}

export const IdeaGeneratorView: React.FC<IdeaGeneratorViewProps> = ({
  profile,
  onSelectIdea,
  onGenerateIdeas,
  initialIdeas = []
}) => {
  const [ideas, setIdeas] = useState<ProjectIdea[]>(initialIdeas);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const generated = await onGenerateIdeas(customPrompt);
      setIdeas(generated);
      if (generated.length > 0) {
        setSelectedIdeaId(generated[0].id);
      }
    } catch (err) {
      console.error('Failed generating ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find best scoring project for highlight
  const highestScoringIdea = ideas.reduce<ProjectIdea | null>((prev, current) => {
    if (!prev) return current;
    return current.overallScore > prev.overallScore ? current : prev;
  }, null);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
          AI PROJECT INTELLIGENCE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC] mt-1">
          WHAT DO YOU WANT TO BUILD?
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1.5">
          Tell us what you're interested in. BUILDflow will find projects that fit you.
        </p>
      </div>

      {/* Input Prompt Box */}
      <form
        onSubmit={handleGenerate}
        className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-[#263247] space-y-4 shadow-sm"
      >
        <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
          Project Interest or Domain Focus
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., I want to build something using computer vision or machine learning for education..."
            className="flex-1 rounded-xl bg-[#0D1220] border border-[#263247] px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#6C63FF] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(108,99,255,0.35)] flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>EVALUATING IDEAS...</span>
              </>
            ) : (
              <>
                <span>GENERATE IDEAS ✦</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#94A3B8]">Suggestions:</span>
          {[
            'Machine Learning Placement Predictor',
            'Full-Stack Developer Tool with LLM',
            'Computer Vision Healthcare Triage',
            'IoT Campus Energy Optimizer',
          ].map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => {
                setCustomPrompt(promptText);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0D1220] border border-[#263247] text-[11px] text-[#CBD5E1] hover:text-[#22D3EE] hover:border-[#22D3EE]/40 transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>
      </form>

      {/* Generated Project Ideas List */}
      {ideas.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              Recommended Projects ({ideas.length})
            </h2>
            <span className="text-xs text-[#94A3B8]">
              Calibrated to your tech stack
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ideas.map((idea) => {
              const isBestFit = highestScoringIdea?.id === idea.id;
              const isSelected = selectedIdeaId === idea.id;

              return (
                <div
                  key={idea.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                    isBestFit
                      ? 'bg-[#111827] border-2 border-[#6C63FF] shadow-[0_0_20px_rgba(108,99,255,0.2)]'
                      : 'bg-[#111827] border border-[#263247] hover:border-[#263247]'
                  }`}
                >
                  {/* Best Fit Badge */}
                  {isBestFit && (
                    <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-[#6C63FF] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Star className="h-3 w-3 fill-white" />
                      <span>BEST FIT FOR YOU</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-base font-bold text-[#F8FAFC] leading-snug">
                        {idea.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                        {idea.description}
                      </p>
                    </div>

                    {/* Scores: Feasibility, Impact, Novelty */}
                    <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-[#0D1220] border border-[#263247] text-center">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-[#94A3B8]">
                          FEASIBILITY
                        </span>
                        <p className="text-sm font-extrabold text-[#34D399]">
                          {idea.feasibilityScore}
                        </p>
                      </div>
                      <div className="border-x border-[#263247]">
                        <span className="text-[9px] font-bold uppercase text-[#94A3B8]">
                          IMPACT
                        </span>
                        <p className="text-sm font-extrabold text-[#22D3EE]">
                          {idea.impactScore}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-[#94A3B8]">
                          NOVELTY
                        </span>
                        <p className="text-sm font-extrabold text-[#6C63FF]">
                          {idea.noveltyScore}
                        </p>
                      </div>
                    </div>

                    {/* Technology Pills */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                        Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-[#0D1220] border border-[#263247] text-[10px] font-medium text-[#CBD5E1]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta: Duration & Difficulty */}
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                      <span>Duration: <strong className="text-[#F8FAFC]">{idea.duration}</strong></span>
                      <span>Difficulty: <strong className="text-[#22D3EE]">{idea.difficulty}</strong></span>
                    </div>

                    {/* Why it fits you */}
                    {idea.whyFits && (
                      <div className="p-2.5 rounded-lg bg-[#0D1220]/70 border border-[#263247] text-[11px] text-[#CBD5E1] leading-relaxed">
                        <span className="font-semibold text-[#22D3EE]">Why it fits you: </span>
                        {idea.whyFits}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="pt-4 mt-4 border-t border-[#263247]">
                    <button
                      onClick={() => onSelectIdea(idea)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>SELECT PROJECT →</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when no ideas loaded yet */}
      {ideas.length === 0 && !isLoading && (
        <div className="rounded-2xl bg-[#111827] border border-[#263247] p-8 text-center">
          <Lightbulb className="h-10 w-10 text-[#6C63FF] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#F8FAFC]">
            Ready to generate ideas?
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Click "GENERATE IDEAS ✦" above or pick a suggestion to find tailored capstone projects.
          </p>
          <button
            onClick={() => handleGenerate()}
            className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-md"
          >
            Generate Tailored Ideas Now
          </button>
        </div>
      )}
    </div>
  );
};
