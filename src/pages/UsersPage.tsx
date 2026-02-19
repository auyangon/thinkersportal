import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { getAllUsers, getSystemStats } from '@/api/userService';
import type { UserProfile, SystemStats } from '@/types';
import { Users, GraduationCap, BookOpen, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllUsers(), getSystemStats()])
      .then(([u, s]) => { setUsers(u); setStats(s); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="User Management" subtitle="View and manage all AUY portal users" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-600" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Total Users" value={stats?.totalUsers ?? users.length} icon={<Users size={20} />}
              iconBg="bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-600"
              pastelBg="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 hover:border-indigo-200" />
            <StatCard title="Students" value={stats?.totalStudents ?? users.filter(u => u.role === 'student').length}
              icon={<GraduationCap size={20} />}
              iconBg="bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-600"
              pastelBg="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-200" />
            <StatCard title="Teachers" value={stats?.totalTeachers ?? users.filter(u => u.role === 'teacher').length}
              icon={<BookOpen size={20} />}
              iconBg="bg-gradient-to-br from-violet-100 to-purple-200 text-violet-600"
              pastelBg="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:border-violet-200" />
          </div>

          <GlassCard noPadding>
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'admin', 'teacher', 'student'].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all',
                      roleFilter === r ? 'bg-navy-100 text-navy-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    )}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">User</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Role</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Department</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.uid} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-navy-700 text-[10px] font-bold text-white">
                            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={cn(
                          'rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize',
                          u.role === 'admin' ? 'bg-purple-100 text-purple-600'
                            : u.role === 'teacher' ? 'bg-blue-100 text-blue-600'
                              : 'bg-emerald-100 text-emerald-600'
                        )}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-500">{u.department || u.course || '—'}</td>
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">{u.studentId || u.uid.slice(0, 12)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">No users found</div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
