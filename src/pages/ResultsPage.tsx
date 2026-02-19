import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { getResults, submitResult } from '@/api/examService';
import type { Result } from '@/types';
import { Award, TrendingUp, BarChart3, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export function ResultsPage() {
  const { profile } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    examId: '', examTitle: '', course: '', studentEmail: '', studentName: '',
    marksObtained: 0, totalMarks: 100, grade: '', date: '',
  });

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    getResults(profile.email).then(setResults).finally(() => setLoading(false));
  }, [profile]);

  if (!profile) return null;

  const isTeacherOrAdmin = profile.role === 'teacher' || profile.role === 'admin';

  const avgPercentage = results.length > 0
    ? Math.round(results.reduce((a, r) => a + (r.marksObtained / r.totalMarks) * 100, 0) / results.length)
    : 0;

  const bestResult = results.length > 0
    ? results.reduce((best, r) => (r.marksObtained / r.totalMarks > best.marksObtained / best.totalMarks) ? r : best)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await submitResult(form);
    setSuccessMsg('Result submitted successfully!');
    setShowForm(false);
    setForm({ examId: '', examTitle: '', course: '', studentEmail: '', studentName: '', marksObtained: 0, totalMarks: 100, grade: '', date: '' });
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Results"
        subtitle={isTeacherOrAdmin ? 'Enter and manage results' : 'Your exam results and grades'}
      >
        {isTeacherOrAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-600 to-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy-200 transition-all hover:shadow-xl">
            <Plus size={16} /> Enter Result
          </button>
        )}
      </PageHeader>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMsg}</div>
      )}

      {showForm && isTeacherOrAdmin && (
        <GlassCard className="bg-gradient-to-br from-amber-50/40 to-rose-50/30 border-amber-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Enter Result</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Exam Title</label>
              <input type="text" required value={form.examTitle} onChange={e => setForm(p => ({ ...p, examTitle: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Course</label>
              <input type="text" required value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Student Email</label>
              <input type="email" required value={form.studentEmail} onChange={e => setForm(p => ({ ...p, studentEmail: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Student Name</label>
              <input type="text" required value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Marks Obtained</label>
              <input type="number" required value={form.marksObtained} onChange={e => setForm(p => ({ ...p, marksObtained: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Total Marks</label>
              <input type="number" required value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Grade</label>
              <input type="text" required value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder="A+" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
              <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Result'}
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
          {profile.role === 'student' && results.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard title="Average" value={`${avgPercentage}%`} icon={<BarChart3 size={20} />}
                iconBg="bg-gradient-to-br from-sky-100 to-blue-200 text-blue-600"
                pastelBg="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100 hover:border-sky-200" />
              <StatCard title="Best Score" value={bestResult ? `${bestResult.marksObtained}/${bestResult.totalMarks}` : '—'}
                subtitle={bestResult?.examTitle} icon={<Award size={20} />}
                iconBg="bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-600"
                pastelBg="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-200" />
              <StatCard title="Exams Taken" value={results.length} icon={<TrendingUp size={20} />}
                iconBg="bg-gradient-to-br from-violet-100 to-purple-200 text-purple-600"
                pastelBg="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:border-violet-200" />
            </div>
          )}

          <GlassCard noPadding>
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-700">All Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Exam</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Course</th>
                    {isTeacherOrAdmin && <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Student</th>}
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Marks</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Grade</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-slate-800">{r.examTitle}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.course}</td>
                      {isTeacherOrAdmin && <td className="px-5 py-3 text-sm text-slate-600">{r.studentName}</td>}
                      <td className="px-5 py-3 text-sm text-slate-700">{r.marksObtained}/{r.totalMarks}</td>
                      <td className="px-5 py-3">
                        <span className={cn(
                          'rounded-full px-2.5 py-1 text-[10px] font-semibold',
                          r.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-600'
                            : r.grade.startsWith('B') ? 'bg-blue-100 text-blue-600'
                              : 'bg-amber-100 text-amber-600'
                        )}>{r.grade}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length === 0 && (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">No results found</div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
