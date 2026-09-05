import React from 'react';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  LogOut,
  Edit3,
  Key,
  Users,
  Clock,
  Briefcase,
  Layers,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  currentUser: FirebaseUser | null;
  onOpenEditProfile: () => void;
  onOpenAuthOptions: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentUser,
  onOpenEditProfile,
  onOpenAuthOptions,
  onLogout
}) => {
  if (!isOpen) return null;

  const displayName = profile?.name || currentUser?.displayName || 'Student Lead';
  const displayEmail = profile?.email || currentUser?.email || (currentUser?.isAnonymous ? 'Guest Student Session' : 'student@university.edu');
  const isGuest = !currentUser || currentUser.isAnonymous;
  const authProvider = isGuest
    ? 'Guest Session'
    : currentUser?.providerData[0]?.providerId === 'google.com'
    ? 'Google Account'
    : 'Email / Password';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D1220] border border-[#263247] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6C63FF] via-[#22D3EE] to-[#34D399]" />

        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#263247]">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#22D3EE] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_15px_rgba(108,99,255,0.4)]">
              {(displayName[0] || 'S').toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  {displayName}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isGuest
                      ? 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30'
                      : 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30'
                  }`}
                >
                  {authProvider}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3 text-[#94A3B8]" />
                <span>{displayEmail}</span>
              </p>
            </div>
          </div>

          <button
            id="profile-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Guest account upgrade alert */}
          {isGuest && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF]/15 to-[#22D3EE]/15 border border-[#6C63FF]/40 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
                  <span>Guest Mode Active</span>
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  Sign in to save your roadmaps across devices permanently.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthOptions();
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-semibold hover:opacity-95 shrink-0"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Academic & Project Preferences Grid */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2.5">
              Project Preferences & Profile Specs
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#111827] border border-[#263247]">
                <span className="text-[10px] text-[#94A3B8] block">Experience</span>
                <span className="text-xs font-bold text-[#F8FAFC] mt-0.5 block">
                  {profile?.experienceLevel || 'Intermediate'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#111827] border border-[#263247]">
                <span className="text-[10px] text-[#94A3B8] block">Team Size</span>
                <span className="text-xs font-bold text-[#F8FAFC] mt-0.5 block">
                  {profile?.teamSize || '3'} Students
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#111827] border border-[#263247]">
                <span className="text-[10px] text-[#94A3B8] block">Target Timeline</span>
                <span className="text-xs font-bold text-[#F8FAFC] mt-0.5 block">
                  {profile?.timeline || '2 months'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#111827] border border-[#263247]">
                <span className="text-[10px] text-[#94A3B8] block">Difficulty</span>
                <span className="text-xs font-bold text-[#22D3EE] mt-0.5 block">
                  {profile?.preferredDifficulty || 'Innovative'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
              Declared Technical Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.skills && profile.skills.length > 0 ? profile.skills : ['Python', 'React', 'Machine Learning', 'TypeScript']).map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#263247] text-xs font-medium text-[#CBD5E1]"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Domain Interests */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
              Domain Interests
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.interests && profile.interests.length > 0 ? profile.interests : ['AI/ML', 'Web Development', 'Healthcare']).map(
                (interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-lg bg-[#080B14] border border-[#6C63FF]/30 text-xs font-medium text-[#22D3EE]"
                  >
                    {interest}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#263247] space-y-2.5">
            <button
              id="profile-modal-edit-profile-btn"
              onClick={() => {
                onClose();
                onOpenEditProfile();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#263247] hover:border-[#6C63FF]/50 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Edit3 className="h-4 w-4 text-[#22D3EE]" />
              <span>Edit Student Profile & Preferences</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="profile-modal-login-options-btn"
                onClick={() => {
                  onClose();
                  onOpenAuthOptions();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#080B14] hover:bg-[#111827] border border-[#263247] hover:border-[#22D3EE]/40 text-xs font-semibold text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Key className="h-3.5 w-3.5 text-[#22D3EE]" />
                <span>{isGuest ? 'Sign In / Register' : 'Switch Account'}</span>
              </button>

              <button
                id="profile-modal-logout-btn"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#FB7185]/10 hover:bg-[#FB7185]/20 border border-[#FB7185]/30 text-xs font-semibold text-[#FB7185] flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
