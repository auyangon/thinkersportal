import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/ui/StatCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { AttendanceCircle } from '@/components/ui/AttendanceCircle';
import { getAttendanceSummary } from '@/api/attendanceService';
import { getExams, getResults } from '@/api/examService';
import { getAnnouncements } from '@/api/announcementService';
import { getSystemStats, getAllUsers } from '@/api/userService';
import type { AttendanceSummary, Exam, Result, Announcement, SystemStats, UserProfile } from '@/types';
import {
  Users, BookOpen, CalendarCheck, Megaphone,
  BarChart3, FileText, Clock, AlertCircle,
  TrendingUp, Award,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export function DashboardPage() {
  const { profile } = useAuth();

  if (!profile) return null;

  switch (profile.role) {
    case 'student':
      return <StudentDashboard profile={profile} />;
    case 'teacher':
      return <TeacherDashboard profile={profile} />;
    case 'admin':
      return <AdminDashboard profile={profile} />;
    default:
      return null;
  }
}

/* ── Student Dashboard ──────────────────────────────────────────── */
function StudentDashboard({ profile }: { profile: UserProfile }) {
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    Promise.all([
      getAttendanceSummary(profile.email),
      getExams(profile.email),
      getResults(profile.email),
      getAnnouncements(),
    ]).then(([att, ex, res, ann]) => {
      setAttendance(att);
      setExams(ex);
      setResults(res);
      setAnnouncements(ann);
    });
  }, [profile.email]);

  const upcomingExams = exams.filter(e => e.status === 'upcoming');

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome back, ${profile.name.split(' ')[0]}`}
        subtitle={`${profile.course || 'Student'} • ${profile.studentId || ''}`}
      />

      {/* Stats Row - Pastel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance"
          value={attendance ? `${attendance.percentage}%` : '—'}
          subtitle={attendance ? `${attendance.present} of ${attendance.totalClasses} classes` : ''}
          icon={<CalendarCheck size={20} />}
          iconBg="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600"
          pastelBg="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 hover:border-emerald-200"
        />
        <StatCard
          title="Upcoming Exams"
          value={upcomingExams.length}
          subtitle="Scheduled this month"
          icon={<FileText size={20} />}
          iconBg="bg-gradient-to-br from-sky-100 to-blue-200 text-blue-600"
          pastelBg="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100 hover:border-sky-200"
        />
        <StatCard
          title="Results"
          value={results.length}
          subtitle="Exams graded"
          icon={<Award size={20} />}
          iconBg="bg-gradient-to-br from-violet-100 to-purple-200 text-purple-600"
          pastelBg="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:border-violet-200"
        />
        <StatCard
          title="Announcements"
          value={announcements.length}
          subtitle="Active notices"
          icon={<Megaphone size={20} />}
          iconBg="bg-gradient-to-br from-amber-100 to-orange-200 text-orange-600"
          pastelBg="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 hover:border-amber-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Circle */}
        <GlassCard className="bg-gradient-to-br from-teal-50/60 to-emerald-50/40 border-teal-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Attendance Overview</h3>
          <div className="flex flex-col items-center gap-4">
            <AttendanceCircle percentage={attendance?.percentage ?? 0} />
            {attendance && (
              <div className="flex gap-6 text-center">
                <div className="rounded-xl bg-emerald-50 px-4 py-2">
                  <p className="text-lg font-bold text-emerald-600">{attendance.present}</p>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400">Present</p>
                </div>
                <div className="rounded-xl bg-red-50 px-4 py-2">
                  <p className="text-lg font-bold text-red-500">{attendance.absent}</p>
                  <p className="text-[10px] uppercase tracking-wider text-red-400">Absent</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-4 py-2">
                  <p className="text-lg font-bold text-amber-500">{attendance.late}</p>
                  <p className="text-[10px] uppercase tracking-wider text-amber-400">Late</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Upcoming Exams */}
        <GlassCard className="bg-gradient-to-br from-sky-50/60 to-indigo-50/40 border-sky-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Upcoming Exams</h3>
          <div className="space-y-3">
            {upcomingExams.length === 0 && (
              <p className="text-sm text-slate-400">No upcoming exams</p>
            )}
            {upcomingExams.slice(0, 4).map(exam => (
              <div key={exam.id} className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white/70 p-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{exam.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock size={11} />
                    <span>{exam.date} • {exam.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Results */}
        <GlassCard className="bg-gradient-to-br from-violet-50/60 to-pink-50/40 border-violet-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Recent Results</h3>
          <div className="space-y-3">
            {results.length === 0 && (
              <p className="text-sm text-slate-400">No results yet</p>
            )}
            {results.slice(0, 4).map(r => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-purple-100 bg-white/70 p-3 backdrop-blur-sm">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{r.examTitle}</p>
                  <p className="text-[11px] text-slate-400">{r.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{r.marksObtained}/{r.totalMarks}</p>
                  <span className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    r.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-600'
                      : r.grade.startsWith('B') ? 'bg-blue-100 text-blue-600'
                        : 'bg-amber-100 text-amber-600'
                  )}>{r.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Announcements */}
      <GlassCard className="bg-gradient-to-br from-rose-50/40 to-amber-50/40 border-rose-100">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Latest Announcements</h3>
        <div className="space-y-3">
          {announcements.slice(0, 3).map(a => (
            <div key={a.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/70 p-4 backdrop-blur-sm">
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                a.priority === 'high' ? 'bg-red-100 text-red-500'
                  : a.priority === 'medium' ? 'bg-amber-100 text-amber-500'
                    : 'bg-slate-100 text-slate-400'
              )}>
                <AlertCircle size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <span className="shrink-0 text-[10px] text-slate-400">{a.date}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ── Teacher Dashboard ──────────────────────────────────────────── */
function TeacherDashboard({ profile }: { profile: UserProfile }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    Promise.all([
      getExams(profile.email),
      getAnnouncements(),
    ]).then(([ex, ann]) => {
      setExams(ex);
      setAnnouncements(ann);
    });
  }, [profile.email]);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome, ${profile.name}`}
        subtitle={profile.department || 'Faculty'}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Exams"
          value={exams.length}
          subtitle="Created exams"
          icon={<FileText size={20} />}
          iconBg="bg-gradient-to-br from-sky-100 to-blue-200 text-blue-600"
          pastelBg="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100 hover:border-sky-200"
        />
        <StatCard
          title="Upcoming"
          value={exams.filter(e => e.status === 'upcoming').length}
          subtitle="Scheduled exams"
          icon={<Clock size={20} />}
          iconBg="bg-gradient-to-br from-violet-100 to-purple-200 text-purple-600"
          pastelBg="bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-100 hover:border-violet-200"
        />
        <StatCard
          title="Announcements"
          value={announcements.length}
          subtitle="Active notices"
          icon={<Megaphone size={20} />}
          iconBg="bg-gradient-to-br from-amber-100 to-orange-200 text-orange-600"
          pastelBg="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-200"
        />
        <StatCard
          title="Avg Attendance"
          value="82%"
          subtitle="Across classes"
          icon={<TrendingUp size={20} />}
          iconBg="bg-gradient-to-br from-emerald-100 to-teal-200 text-teal-600"
          pastelBg="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="bg-gradient-to-br from-sky-50/60 to-indigo-50/40 border-sky-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Exams Overview</h3>
          <div className="space-y-3">
            {exams.slice(0, 5).map(exam => (
              <div key={exam.id} className="flex items-center justify-between rounded-xl border border-blue-100 bg-white/70 p-3 backdrop-blur-sm">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{exam.title}</p>
                  <p className="text-[11px] text-slate-400">{exam.course} • {exam.date}</p>
                </div>
                <span className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-semibold',
                  exam.status === 'upcoming' ? 'bg-blue-100 text-blue-600'
                    : exam.status === 'completed' ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                )}>{exam.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-rose-50/60 to-pink-50/40 border-rose-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Recent Announcements</h3>
          <div className="space-y-3">
            {announcements.slice(0, 4).map(a => (
              <div key={a.id} className="rounded-xl border border-pink-100 bg-white/70 p-3 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <span className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    a.priority === 'high' ? 'bg-red-100 text-red-500'
                      : a.priority === 'medium' ? 'bg-amber-100 text-amber-500'
                        : 'bg-slate-100 text-slate-400'
                  )}>{a.priority}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{a.message}</p>
                <p className="mt-1 text-[10px] text-slate-400">{a.date}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ── Admin Dashboard ──────────────────────────────────────────── */
function AdminDashboard({ profile }: { profile: UserProfile }) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    Promise.all([
      getSystemStats(),
      getAllUsers(),
      getAnnouncements(),
    ]).then(([st, us, ann]) => {
      setStats(st);
      setUsers(us);
      setAnnouncements(ann);
    });
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Welcome, ${profile.name}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? '—'}
          subtitle={`${stats?.totalStudents ?? 0} students, ${stats?.totalTeachers ?? 0} teachers`}
          icon={<Users size={20} />}
          iconBg="bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-600"
          pastelBg="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 hover:border-indigo-200"
          trend={{ value: '+12%', positive: true }}
        />
        <StatCard
          title="Courses"
          value={stats?.totalCourses ?? '—'}
          subtitle="Active courses"
          icon={<BookOpen size={20} />}
          iconBg="bg-gradient-to-br from-violet-100 to-purple-200 text-purple-600"
          pastelBg="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:border-violet-200"
        />
        <StatCard
          title="Avg Attendance"
          value={stats ? `${stats.averageAttendance}%` : '—'}
          subtitle="Across all courses"
          icon={<BarChart3 size={20} />}
          iconBg="bg-gradient-to-br from-emerald-100 to-teal-200 text-teal-600"
          pastelBg="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-200"
          trend={{ value: '+3.2%', positive: true }}
        />
        <StatCard
          title="Announcements"
          value={stats?.activeAnnouncements ?? '—'}
          subtitle="Active notices"
          icon={<Megaphone size={20} />}
          iconBg="bg-gradient-to-br from-rose-100 to-pink-200 text-rose-600"
          pastelBg="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 hover:border-rose-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <GlassCard className="bg-gradient-to-br from-indigo-50/50 to-sky-50/40 border-indigo-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Recent Users</h3>
          <div className="space-y-2">
            {users.slice(0, 6).map(u => (
              <div key={u.uid} className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-white/70 p-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-navy-700 text-xs font-bold text-white">
                  {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{u.name}</p>
                  <p className="truncate text-[11px] text-slate-400">{u.email}</p>
                </div>
                <span className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize',
                  u.role === 'admin' ? 'bg-purple-100 text-purple-600'
                    : u.role === 'teacher' ? 'bg-blue-100 text-blue-600'
                      : 'bg-emerald-100 text-emerald-600'
                )}>{u.role}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Announcements */}
        <GlassCard className="bg-gradient-to-br from-amber-50/50 to-rose-50/40 border-amber-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Announcements</h3>
          <div className="space-y-3">
            {announcements.slice(0, 5).map(a => (
              <div key={a.id} className="rounded-xl border border-amber-100 bg-white/70 p-3 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <span className="shrink-0 text-[10px] text-slate-400">{a.date}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">{a.message}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
