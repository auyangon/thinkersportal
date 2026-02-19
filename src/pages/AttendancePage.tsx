import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { AttendanceCircle } from '@/components/ui/AttendanceCircle';
import { getAttendanceByEmail, getAttendanceSummary, markAttendance } from '@/api/attendanceService';
import type { AttendanceRecord, AttendanceSummary } from '@/types';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export function AttendancePage() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Teacher mark attendance form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{ studentEmail: string; studentName: string; course: string; date: string; status: 'present' | 'absent' | 'late' }>({ studentEmail: '', studentName: '', course: '', date: '', status: 'present' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.all([
      getAttendanceByEmail(profile.email),
      getAttendanceSummary(profile.email),
    ]).then(([recs, sum]) => {
      setRecords(recs);
      setSummary(sum);
    }).finally(() => setLoading(false));
  }, [profile]);

  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    await markAttendance({ ...formData, markedBy: profile.name });
    setSuccessMsg('Attendance marked successfully!');
    setShowForm(false);
    setFormData({ studentEmail: '', studentName: '', course: '', date: '', status: 'present' });
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  if (!profile) return null;

  const statusIcon = (s: string) => {
    if (s === 'present') return <CheckCircle2 size={14} className="text-emerald-500" />;
    if (s === 'absent') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-amber-500" />;
  };

  const isTeacherOrAdmin = profile.role === 'teacher' || profile.role === 'admin';

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Attendance"
        subtitle={isTeacherOrAdmin ? 'Mark and view attendance records' : 'Your attendance summary and records'}
      >
        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-600 to-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy-200 transition-all hover:shadow-xl"
          >
            <Plus size={16} />
            Mark Attendance
          </button>
        )}
      </PageHeader>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMsg}</div>
      )}

      {/* Mark Attendance Form */}
      {showForm && isTeacherOrAdmin && (
        <GlassCard className="bg-gradient-to-br from-sky-50/50 to-indigo-50/30 border-sky-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Mark Attendance</h3>
          <form onSubmit={handleMark} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Student Email</label>
              <input
                type="email"
                required
                value={formData.studentEmail}
                onChange={e => setFormData(p => ({ ...p, studentEmail: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                placeholder="student@auy.edu.mm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Student Name</label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={e => setFormData(p => ({ ...p, studentName: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Course</label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={e => setFormData(p => ({ ...p, course: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                placeholder="Data Structures"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value as 'present' | 'absent' | 'late' }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-600" />
        </div>
      ) : (
        <>
          {/* Summary */}
          {summary && profile.role === 'student' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <GlassCard className="flex flex-col items-center justify-center bg-gradient-to-br from-teal-50/60 to-emerald-50/40 border-teal-100">
                <AttendanceCircle percentage={summary.percentage} />
              </GlassCard>
              <GlassCard className="lg:col-span-2 bg-gradient-to-br from-violet-50/40 to-sky-50/30 border-violet-100">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">Summary</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Total Classes', value: summary.totalClasses, color: 'text-slate-800', bg: 'bg-slate-50 border border-slate-100' },
                    { label: 'Present', value: summary.present, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
                    { label: 'Absent', value: summary.absent, color: 'text-red-500', bg: 'bg-red-50 border border-red-100' },
                    { label: 'Late', value: summary.late, color: 'text-amber-500', bg: 'bg-amber-50 border border-amber-100' },
                  ].map(s => (
                    <div key={s.label} className={cn('rounded-xl p-4 text-center', s.bg)}>
                      <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Records Table */}
          <GlassCard noPadding>
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <CalendarCheck size={16} /> Attendance Records
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Course</th>
                    {isTeacherOrAdmin && <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Student</th>}
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-sm text-slate-700">{r.date}</td>
                      <td className="px-5 py-3 text-sm text-slate-700">{r.course}</td>
                      {isTeacherOrAdmin && <td className="px-5 py-3 text-sm text-slate-700">{r.studentName}</td>}
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          {statusIcon(r.status)}
                          <span className={cn(
                            'text-xs font-medium capitalize',
                            r.status === 'present' ? 'text-emerald-600'
                              : r.status === 'absent' ? 'text-red-500'
                                : 'text-amber-500'
                          )}>{r.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">{r.markedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {records.length === 0 && (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">No records found</div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
