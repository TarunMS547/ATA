import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  TestTube2, 
  PlaySquare, 
  Bug, 
  BarChart3,
  TestTubeDiagonal
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Requirements', href: '/requirements', icon: FileText },
  { name: 'Test Cases', href: '/test-cases', icon: TestTube2 },
  { name: 'Test Execution', href: '/execution', icon: PlaySquare },
  { name: 'Defects', href: '/defects', icon: Bug },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-10">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-200">
          <TestTubeDiagonal className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-slate-800">QA Agent</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => twMerge(
                clsx(
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors'
                )
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500',
                      'flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
