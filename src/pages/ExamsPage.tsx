import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { getExams, createExam } from '@/api/examService';
import type { Exam } from '@/types';
import { FileText, Clock, Calendar, Plus, BookOpen } from 'lucide-react';
import { cn } from '@/utils/cn';

const pastelColors = [
  'bg-gradient-to-br from-sky-50/80 to-blue-50/60 border-sky-100 hover:border-sky-200',
  'bg-gradient-to-br from-violet-50/80 to-purple-50/60 border-violet-100 hover:border-violet-200',
  'bg-gradient-to-br from-rose-50/80 to-pink-50/60 border-rose-100 hover:border-rose-200',
  'bg-gradient-to-br from-amber-50/80 to-yellow-50/60 border-amber-100 hover:border-amber-200',
  'bg-gradient-to-br from-emerald-50/80 to-teal-50/60 border-emerald-100 hover:border-emerald-200',
  'bg-gradient-to-br from-indigo-50/80 to-cyan-50/60 border-indigo-100 hover:border-indigo-200',
];

const pastelIcons = [
  'bg-sky-100 text-sky-500',
  'bg-violet-100 text-violet-500',
  'bg-rose-100 text-rose-500',
  'bg-amber-100 text-amber-500',
  'bg-emerald-100 text-emerald-500',
  'bg-indigo-100 text-indigo-500',
];

export function ExamsPage() {
  const { profile } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    course: '',
    date: '',
    time: '',
    duration: '',
    totalMarks: 100,
  });

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    getExams(profile.email).then(setExams).finally(() => setLoading(false));
  }, [profile]);

  if (!profile) return null;

  const isTeacherOrAdmin = profile.role === 'teacher' || profile.role === 'admin';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await createExam({
      ...form,
      createdBy: profile.name,
      status: 'upcoming',
    });
    setSuccessMsg('Exam created successfully!');
    setShowForm(false);
    setForm({ title: '', course: '', date: '', time: '', duration: '', totalMarks: 100 });
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  const upcoming = exams.filter(e => e.status === 'upcoming');
  const completed = exams.filter(e => e.status === 'completed');

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Exams"
        subtitle={isTeacherOrAdmin ? 'Create and manage exams' : 'Your upcoming and past exams'}
      >
        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-600 to-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy-200 transition-all hover:shadow-xl"
          >
            <Plus size={16} />
            Create Exam
          </button>
        )}
      </PageHeader>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMsg}</div>
      )}

      {showForm && isTeacherOrAdmin && (
        <GlassCard className="bg-gradient-to-br from-violet-50/40 to-sky-50/30 border-violet-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Create New Exam</h3>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Title</label>
              <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder="Mid-Term Exam" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Course</label>
              <input type="text" required value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder="Data Structures" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
              <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Time</label>
              <input type="text" required value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder="10:00 AM" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Duration</label>
              <input type="text" required value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder="2 hours" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Total Marks</label>
              <input type="number" required value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Exam'}
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
        <div className="space-y-6">
          {/* Upcoming */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Upcoming Exams</h3>
            {upcoming.length === 0 && <p className="text-sm text-slate-400">No upcoming exams</p>}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((exam, i) => (
                <GlassCard key={exam.id} className={cn('transition-all hover:shadow-md', pastelColors[i % pastelColors.length])}>
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', pastelIcons[i % pastelIcons.length])}>
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{exam.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><BookOpen size={11} /> {exam.course}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white/60 p-2.5 text-center backdrop-blur-sm border border-white/80">
                      <Calendar size={12} className="mx-auto text-slate-400 mb-1" />
                      <p className="text-xs font-medium text-slate-700">{exam.date}</p>
                    </div>
                    <div className="rounded-lg bg-white/60 p-2.5 text-center backdrop-blur-sm border border-white/80">
                      <Clock size={12} className="mx-auto text-slate-400 mb-1" />
                      <p className="text-xs font-medium text-slate-700">{exam.time}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{exam.duration}</span>
                    <span>{exam.totalMarks} marks</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Completed Exams</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completed.map((exam) => (
                  <GlassCard key={exam.id} className={cn('opacity-80 transition-all hover:opacity-100', 'bg-gradient-to-br from-emerald-50/60 to-green-50/40 border-emerald-100')}>
                    <div className="flex items-start gap-3">
                      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-500')}>
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{exam.title}</p>
                        <p className="text-xs text-slate-400">{exam.course}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{exam.date}</span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-600')}>Completed</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
