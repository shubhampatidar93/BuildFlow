import React from 'react';
import {
  Play,
  LogOut,
  Sparkles,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Project, UserProfile } from '../types';
import { BuildFlowLogo } from './BuildFlowLogo';

interface NavbarProps {
  user: User | null;
  profile: UserProfile | null;
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (project: Project) => void;
  onOpenProfile: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profile,
  projects,
  activeProject,
  onSelectProject,
  onOpenProfile,
  onOpenAuthModal,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  currentView,
  setCurrentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#263247] bg-[#080B14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="nav-brand-logo-btn"
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 text-left transition-opacity hover:opacity-95"
            title="BUILDflow AI Home"
          >
            <BuildFlowLogo size="md" />
          </button>

          {/* Tagline snippet visible on wide screens */}
          <span className="hidden xl:inline-block pl-3 ml-2 border-l border-[#263247] text-[11px] font-medium text-[#94A3B8]">
            From Idea to Execution
          </span>

          {/* Active Project Switcher if logged in and in app views */}
          {currentView !== 'landing' && projects.length > 0 && (
            <div className="hidden lg:flex items-center ml-3 pl-3 border-l border-[#263247]">
              <span className="text-[11px] font-medium text-[#94A3B8] mr-2">Project:</span>
              <div className="relative">
                <select
                  id="nav-project-switcher"
                  value={activeProject?.id || ''}
                  onChange={(e) => {
                    const p = projects.find((proj) => proj.id === e.target.value);
                    if (p) onSelectProject(p);
                  }}
                  className="bg-[#0D1220] border border-[#263247] text-xs font-semibold text-[#F8FAFC] rounded-lg pl-2.5 pr-8 py-1.5 appearance-none focus:outline-none focus:border-[#6C63FF] max-w-[220px] truncate cursor-pointer hover:border-[#6C63FF]/50 transition-colors"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0D1220] text-[#F8FAFC]">
                      {p.title} ({p.progress}%)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8] pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Right side navigation & actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user || profile ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* User Profile Button */}
              <button
                id="nav-user-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-xl bg-[#111827] px-2.5 py-1.5 text-xs font-medium text-[#F8FAFC] border border-[#263247] hover:border-[#6C63FF]/50 transition-colors shadow-sm"
                title="View Student Profile & Account"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#22D3EE] text-[10px] font-bold text-white uppercase">
                  {(profile?.name || user?.displayName || user?.email || 'S')[0]}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate text-[#CBD5E1]">
                  {profile?.name || user?.displayName || 'Student'}
                </span>
              </button>

              {/* If guest, show Sign in to cloud option */}
              {(!user || user.isAnonymous) && (
                <button
                  id="nav-signin-upgrade-btn"
                  onClick={onOpenAuthModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_12px_rgba(108,99,255,0.3)] transition-all"
                  title="Sign in to save projects to cloud account"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Sign In</span>
                </button>
              )}

              <button
                id="nav-logout-btn"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827] text-xs transition-colors border border-transparent hover:border-[#263247]"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-open-auth-btn"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] hover:opacity-95 shadow-[0_0_15px_rgba(108,99,255,0.35)] transition-all"
              >
                <span>Sign In / Login</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#111827] border border-transparent hover:border-[#263247]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
