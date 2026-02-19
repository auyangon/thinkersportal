import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { getAnnouncements, createAnnouncement } from '@/api/announcementService';
import type { Announcement, UserRole } from '@/types';
import { Megaphone, AlertCircle, Plus, Users, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';

export function AnnouncementsPage() {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState<{
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    target: 'all' | 'students' | 'teachers';
  }>({
    title: '', message: '', priority: 'medium', target: 'all',
  });

  useEffect(() => {
    setLoading(true);
    getAnnouncements().then(setAnnouncements).finally(() => setLoading(false));
  }, []);

  if (!profile) return null;

  const isTeacherOrAdmin = profile.role === 'teacher' || profile.role === 'admin';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await createAnnouncement({
      ...form,
      author: profile.name,
      authorRole: profile.role as UserRole,
      date: new Date().toISOString().split('T')[0],
    });
    setSuccessMsg('Announcement posted successfully!');
    setShowForm(false);
    setForm({ title: '', message: '', priority: 'medium', target: 'all' });
    setTimeout(() => setSuccessMsg(''), 3000);
    setSubmitting(false);
  };

  const priorityConfig = {
    high: { cardBg: 'bg-gradient-to-br from-red-50/70 to-rose-50/50 border-red-100', iconBg: 'bg-red-100 text-red-500 border-red-200', badge: 'bg-red-100 text-red-600' },
    medium: { cardBg: 'bg-gradient-to-br from-amber-50/70 to-yellow-50/50 border-amber-100', iconBg: 'bg-amber-100 text-amber-500 border-amber-200', badge: 'bg-amber-100 text-amber-600' },
    low: { cardBg: 'bg-gradient-to-br from-sky-50/70 to-blue-50/50 border-sky-100', iconBg: 'bg-sky-100 text-sky-500 border-sky-200', badge: 'bg-sky-100 text-sky-600' },
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Stay updated with the latest AUY notices"
      >
        {isTeacherOrAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-600 to-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy-200 transition-all hover:shadow-xl">
            <Plus size={16} /> Post Announcement
          </button>
        )}
      </PageHeader>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMsg}</div>
      )}

      {showForm && isTeacherOrAdmin && (
        <GlassCard className="bg-gradient-to-br from-violet-50/40 to-pink-50/30 border-violet-100">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Post Announcement</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Title</label>
              <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                placeholder="Announcement title" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Message</label>
              <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 resize-none"
                placeholder="Write your announcement..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Target Audience</label>
                <select value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value as 'all' | 'students' | 'teachers' }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100">
                  <option value="all">All</option>
                  <option value="students">Students Only</option>
                  <option value="teachers">Teachers Only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50">
                {submitting ? 'Posting...' : 'Post'}
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
        <div className="space-y-4">
          {announcements.length === 0 && (
            <GlassCard className="text-center py-12 bg-gradient-to-br from-slate-50 to-sky-50/30 border-slate-100">
              <Megaphone size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-400">No announcements yet</p>
            </GlassCard>
          )}
          {announcements.map(a => {
            const cfg = priorityConfig[a.priority];
            return (
              <GlassCard key={a.id} className={cfg.cardBg}>
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', cfg.iconBg)}>
                    <AlertCircle size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-800">{a.title}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', cfg.badge)}>{a.priority}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-white/80">
                        {a.target === 'all' ? <Globe size={9} /> : <Users size={9} />}
                        {a.target}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.message}</p>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-500">{a.author}</span>
                      <span>•</span>
                      <span>{a.date}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
