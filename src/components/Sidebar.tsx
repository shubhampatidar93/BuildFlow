import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Kanban,
  Map,
  Bot,
  BarChart3,
  User,
  Settings,
  Sparkles,
  PlayCircle,
  Plus
} from 'lucide-react';
import { Project, UserProfile } from '../types';
import { BuildFlowLogo } from './BuildFlowLogo';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  activeProject: Project | null;
  profile?: UserProfile | null;
  onLoadDemo: () => void;
  onLoadHackathonDemo?: () => void;
  onOpenNewProject: () => void;
  onOpenProfile?: () => void;
  onSelectWorkspaceTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  activeProject,
  profile,
  onLoadDemo,
  onLoadHackathonDemo,
  onOpenNewProject,
  onOpenProfile,
  onSelectWorkspaceTab,
}) => {
  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'BUILD',
      items: [
        { id: 'projects', label: 'My Projects', icon: FolderGit2 },
        {
          id: 'taskboard',
          label: 'Task Board',
          icon: Kanban,
          badge: activeProject ? `${activeProject.progress}%` : undefined,
          action: () => {
            if (onSelectWorkspaceTab) onSelectWorkspaceTab('tasks');
            setCurrentView('workspace');
          }
        },
        {
          id: 'roadmap',
          label: 'Roadmap',
          icon: Map,
          action: () => {
            if (onSelectWorkspaceTab) onSelectWorkspaceTab('roadmap');
            setCurrentView('workspace');
          }
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'mentor',
          label: 'AI Mentor',
          icon: Bot,
          isAi: true,
          action: () => {
            if (onSelectWorkspaceTab) onSelectWorkspaceTab('mentor');
            setCurrentView('workspace');
          }
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          action: () => {
            if (onSelectWorkspaceTab) onSelectWorkspaceTab('analytics');
            setCurrentView('workspace');
          }
        },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          action: () => {
            if (onOpenProfile) onOpenProfile();
          }
        },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-[240px] shrink-0 border-r border-[#263247] bg-[#080B14] flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* New Project Quick Button */}
        <div className="px-1">
          <button
            id="sidebar-new-project-btn"
            onClick={onOpenNewProject}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0D1220] hover:bg-[#111827] border border-[#263247] hover:border-[#6C63FF]/50 text-xs font-semibold text-[#F8FAFC] transition-all group shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-[#22D3EE] group-hover:rotate-90 transition-transform duration-200" />
            <span>Generate New Plan</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.id ||
                    (item.id === 'taskboard' && currentView === 'workspace') ||
                    (item.id === 'roadmap' && currentView === 'workspace');

                  return (
                    <button
                      key={item.id}
                      id={`sidebar-link-${item.id}`}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          setCurrentView(item.id);
                        }
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-[#111827] text-[#F8FAFC] border border-[#263247] shadow-[0_0_12px_rgba(108,99,255,0.15)]'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D1220]'
                      }`}
                    >
                      {/* Left violet accent line when active */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-gradient-to-b from-[#6C63FF] to-[#22D3EE]" />
                      )}

                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? 'text-[#22D3EE]'
                              : item.isAi
                              ? 'text-[#6C63FF]'
                              : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#0D1220] text-[#22D3EE] border border-[#263247]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current Active Project Card */}
        {activeProject && (
          <div className="mx-0.5 rounded-xl p-3 bg-[#0D1220] border border-[#263247] shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                Active Project
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  activeProject.health === 'ON TRACK'
                    ? 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30'
                    : activeProject.health === 'AT RISK'
                    ? 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30'
                    : 'bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/30'
                }`}
              >
                {activeProject.health}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#F8FAFC] line-clamp-1">
              {activeProject.title}
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1">
                <span>Execution Progress</span>
                <span className="text-[#22D3EE] font-bold">{activeProject.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#111827] overflow-hidden border border-[#263247]/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] transition-all duration-500"
                  style={{ width: `${activeProject.progress}%` }}
                />
              </div>
            </div>
            <button
              id="sidebar-open-workspace-btn"
              onClick={() => setCurrentView('workspace')}
              className="mt-2.5 w-full py-1.5 px-2 rounded-lg bg-[#111827] hover:bg-[#172033] border border-[#263247] text-[11px] font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors text-center"
            >
              Open Workspace →
            </button>
          </div>
        )}
      </div>

      {/* Footer Demo Action & Student Profile */}
      <div className="pt-3 border-t border-[#263247] space-y-2.5">
        <button
          id="sidebar-load-demo-btn"
          onClick={onLoadHackathonDemo || onLoadDemo}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0D1220] hover:bg-[#111827] border border-[#263247] hover:border-[#34D399]/40 text-[#34D399] text-xs font-semibold transition-all"
        >
          <PlayCircle className="h-4 w-4 text-[#34D399]" />
          <span>Load Hackathon Demo</span>
        </button>

        {/* Minimal User Profile Strip */}
        <div
          id="sidebar-user-profile-strip"
          role="button"
          tabIndex={0}
          onClick={onOpenProfile}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (onOpenProfile) onOpenProfile();
            }
          }}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#0D1220] cursor-pointer transition-colors"
          title="Open Student Profile & Account Settings"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C63FF] text-[11px] font-bold text-white uppercase shrink-0">
            {(profile?.name || 'S')[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#F8FAFC] truncate">
              {profile?.name || 'Student Lead'}
            </p>
            <p className="text-[10px] text-[#94A3B8] truncate">
              BUILDflow AI v2.4
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
