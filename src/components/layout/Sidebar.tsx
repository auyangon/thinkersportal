import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Megaphone,
  BookOpen,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'teacher', 'student'] },
  { label: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} />, roles: ['admin', 'teacher', 'student'] },
  { label: 'Exams', path: '/exams', icon: <FileText size={20} />, roles: ['admin', 'teacher', 'student'] },
  { label: 'Results', path: '/results', icon: <BarChart3 size={20} />, roles: ['admin', 'teacher', 'student'] },
  { label: 'Announcements', path: '/announcements', icon: <Megaphone size={20} />, roles: ['admin', 'teacher', 'student'] },
  { label: 'Users', path: '/users', icon: <Users size={20} />, roles: ['admin'] },
  { label: 'Courses', path: '/courses', icon: <BookOpen size={20} />, roles: ['admin', 'teacher'] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const filtered = navItems.filter(item => profile && item.roles.includes(profile.role));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-100 bg-white transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 shadow-md shadow-navy-200">
          <GraduationCap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-navy-900 tracking-tight leading-tight">Thinkers' Portal</h1>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">American Univ. of Yangon</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {filtered.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-navy-50 text-navy-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                )
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-3 space-y-1">
        {!collapsed && profile && (
          <div className="mb-3 rounded-xl bg-gradient-to-br from-slate-50 to-navy-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-navy-700 text-xs font-bold text-white shadow-sm">
                {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{profile.name}</p>
                <p className="truncate text-[11px] text-slate-400 capitalize">{profile.role}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
