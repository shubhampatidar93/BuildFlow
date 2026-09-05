import React, { useState } from 'react';
import {
  X,
  Check,
  Plus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Wrench,
  Heart,
  Briefcase,
  Users,
  Clock,
  Flame
} from 'lucide-react';
import { UserProfile, ExperienceLevel, DifficultyLevel } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => Promise<void>;
  initialProfile?: UserProfile | null;
  userEmail?: string;
  userUid?: string;
}

const DEFAULT_SKILLS = [
  'Python',
  'Java',
  'JavaScript',
  'React',
  'Node.js',
  'Machine Learning',
  'Deep Learning',
  'Data Science',
  'SQL',
  'MongoDB',
  'Firebase',
  'Flutter',
  'Android',
  'Cloud',
  'Cybersecurity',
  'IoT',
  'Computer Vision',
  'NLP',
  'Generative AI'
];

const DEFAULT_INTERESTS = [
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Cloud',
  'IoT',
  'Data Science',
  'Healthcare',
  'Education',
  'Finance',
  'Agriculture',
  'Environment',
  'Social Impact'
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const TEAM_SIZES = ['1', '2', '3', '4', '5+'];
const TIMELINES = ['2 weeks', '1 month', '2 months', '3 months', '4+ months'];
const BUDGETS = ['Free', 'Under ₹1,000', '₹1,000–₹5,000', '₹5,000+'];
const DIFFICULTIES: DifficultyLevel[] = ['Easy', 'Medium', 'Hard', 'Innovative'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
  userEmail,
  userUid
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState(initialProfile?.name || 'Shubham Patidar');
  const [skills, setSkills] = useState<string[]>(
    initialProfile?.skills || ['Python', 'React', 'Machine Learning']
  );
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>(
    initialProfile?.interests || ['AI/ML', 'Web Development', 'Education']
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialProfile?.experienceLevel || 'Intermediate'
  );
  const [teamSize, setTeamSize] = useState(initialProfile?.teamSize || '3');
  const [timeline, setTimeline] = useState(initialProfile?.timeline || '2 months');
  const [budget, setBudget] = useState(initialProfile?.budget || 'Free');
  const [preferredDifficulty, setPreferredDifficulty] = useState<DifficultyLevel>(
    initialProfile?.preferredDifficulty || 'Innovative'
  );

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills(prev => [...prev, clean]);
      setCustomSkillInput('');
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const profile: UserProfile = {
        uid: userUid || initialProfile?.uid || 'guest-user',
        name: name.trim() || 'Student',
        email: userEmail || initialProfile?.email || 'student@university.edu',
        skills,
        interests,
        experienceLevel,
        teamSize,
        timeline,
        budget,
        preferredDifficulty,
        onboardingCompleted: true,
        createdAt: initialProfile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(profile);
      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D1220] border border-[#263247] p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Progress Bar & Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#263247]">
          <div>
            <span className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-wider">
              Step {step} of 8
            </span>
            <h2 className="text-lg font-bold text-[#F8FAFC] mt-0.5">
              {step === 1 && 'What is your full name?'}
              {step === 2 && 'Select your technical skills'}
              {step === 3 && 'What domains interest you?'}
              {step === 4 && 'Your coding experience level'}
              {step === 5 && 'How many members on your team?'}
              {step === 6 && 'What is your project timeline?'}
              {step === 7 && 'What is your project budget?'}
              {step === 8 && 'Preferred project innovation level'}
            </h2>
          </div>
          <button
            id="onboarding-close-btn"
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#111827] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-[#111827] h-1 mt-3 rounded-full overflow-hidden border border-[#263247]/50">
          <div
            className="bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] h-full transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="py-6 flex-1 overflow-y-auto text-xs">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#94A3B8]">
                This will appear on your generated IEEE project blueprint and dashboard.
              </p>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  id="onboarding-name-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Shubham Patidar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#263247] text-sm text-[#F8FAFC] focus:outline-none focus:border-[#6C63FF] placeholder-[#94A3B8]/60"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[#94A3B8]">
                Select skills you or your team have touched. BUILDflow uses this to recommend viable projects.
              </p>
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                {DEFAULT_SKILLS.map(skill => {
                  const selected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selected
                          ? 'bg-[#6C63FF] text-white shadow-sm'
                          : 'bg-[#111827] text-[#CBD5E1] hover:bg-[#172033] border border-[#263247]'
                      }`}
                    >
                      {selected && <Check className="inline h-3 w-3 mr-1 -mt-0.5" />}
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. Docker, Rust)..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[#111827] border border-[#263247] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6C63FF] placeholder-[#94A3B8]/60"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#111827] hover:bg-[#172033] border border-[#263247] text-[#CBD5E1] rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-[#94A3B8]">
                Choose domains you're excited to build within.
              </p>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {DEFAULT_INTERESTS.map(interest => {
                  const selected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        selected
                          ? 'bg-[#22D3EE] text-black font-bold shadow-sm'
                          : 'bg-[#111827] text-[#CBD5E1] hover:bg-[#172033] border border-[#263247]'
                      }`}
                    >
                      {selected && <Check className="inline h-3 w-3 mr-1.5 -mt-0.5" />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Experience Level */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-[#94A3B8]">
                This helps calibrate architectural complexity and library selections.
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      experienceLevel === level
                        ? 'bg-[#080B14] border-[#6C63FF] text-[#F8FAFC]'
                        : 'bg-[#111827] border-[#263247] text-[#CBD5E1] hover:border-[#6C63FF]/40'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#F8FAFC]">{level}</div>
                    <div className="text-xs text-[#94A3B8] mt-1">
                      {level === 'Beginner' && 'Comfortable with basic syntax; prefer guided frameworks with clean boilerplate.'}
                      {level === 'Intermediate' && 'Built projects before; comfortable with full-stack APIs and libraries.'}
                      {level === 'Advanced' && 'Confident with system architecture, microservices, cloud deployments, and custom ML.'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Team Size */}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-xs text-[#94A3B8]">
                Number of students collaborating on this capstone.
              </p>
              <div className="grid grid-cols-5 gap-2">
                {TEAM_SIZES.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`py-3.5 rounded-xl font-bold text-base transition-all border ${
                      teamSize === size
                        ? 'bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white border-[#22D3EE] shadow-sm'
                        : 'bg-[#111827] border-[#263247] text-[#CBD5E1] hover:border-[#6C63FF]/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#94A3B8] text-center pt-2">
                {teamSize === '1' ? 'Solo Capstone Project' : `${teamSize} Members • Tasks will be partitioned across contributors`}
              </p>
            </div>
          )}

          {/* Step 6: Timeline */}
          {step === 6 && (
            <div className="space-y-3">
              <p className="text-xs text-[#94A3B8]">
                How much time do you have until your final submission or demo?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TIMELINES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeline(t)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      timeline === t
                        ? 'bg-[#080B14] border-[#6C63FF] text-[#F8FAFC]'
                        : 'bg-[#111827] border-[#263247] text-[#CBD5E1] hover:border-[#6C63FF]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F8FAFC]">{t}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">
                      {t === '2 weeks' ? 'High sprint intensity' : 'Standard academic semester'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Budget */}
          {step === 7 && (
            <div className="space-y-3">
              <p className="text-xs text-[#94A3B8]">
                Will you be spending on hardware (e.g. Raspberry Pi, sensors) or cloud hosting?
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {BUDGETS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      budget === b
                        ? 'bg-[#080B14] border-[#6C63FF] text-[#F8FAFC]'
                        : 'bg-[#111827] border-[#263247] text-[#CBD5E1] hover:border-[#6C63FF]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F8FAFC]">{b}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">
                      {b === 'Free' ? 'Pure open-source & free tiers' : 'Hardware or paid APIs'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Preferred Difficulty */}
          {step === 8 && (
            <div className="space-y-3">
              <p className="text-xs text-[#94A3B8]">
                Target ambition level for your final-year college presentation.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setPreferredDifficulty(diff)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      preferredDifficulty === diff
                        ? 'bg-[#080B14] border-[#6C63FF] text-[#F8FAFC]'
                        : 'bg-[#111827] border-[#263247] text-[#CBD5E1] hover:border-[#6C63FF]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F8FAFC]">{diff}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">
                      {diff === 'Innovative' ? 'Hackathon winner tier' : `${diff} engineering scope`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-[#263247] flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1 || isSubmitting}
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          {step < 8 ? (
            <button
              id="onboarding-next-btn"
              type="button"
              onClick={() => setStep(prev => Math.min(8, prev + 1))}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white flex items-center gap-1.5 hover:opacity-95 shadow-sm transition-all"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              id="onboarding-submit-btn"
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 text-white flex items-center gap-2 shadow-[0_0_15px_rgba(108,99,255,0.35)] transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving Profile...' : 'Save & Continue'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
