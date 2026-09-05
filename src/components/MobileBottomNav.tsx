import React from 'react';
import { LayoutDashboard, FolderGit2, Kanban, Bot, User } from 'lucide-react';
import { Project } from '../types';

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onSelectWorkspaceTab: (tab: string) => void;
  onOpenProfile: () => void;
  activeProject: Project | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
  onSelectWorkspaceTab,
  onOpenProfile,
}) => {
  // Only show bottom nav in app views (not landing)
  if (currentView === 'landing') return null;

  const items = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      action: () => setCurrentView('dashboard'),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      action: () => setCurrentView('projects'),
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: Kanban,
      action: () => {
        onSelectWorkspaceTab('tasks');
        setCurrentView('workspace');
      },
    },
    {
      id: 'mentor',
      label: 'Mentor',
      icon: Bot,
      action: () => {
        onSelectWorkspaceTab('mentor');
        setCurrentView('workspace');
      },
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      action: () => onOpenProfile(),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B14]/95 backdrop-blur-lg border-t border-[#263247] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'tasks' && currentView === 'workspace') ||
            (item.id === 'mentor' && currentView === 'mentor');

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-w-[56px] min-h-[44px] transition-colors ${
                isActive
                  ? 'text-[#22D3EE]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`} />
              <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
