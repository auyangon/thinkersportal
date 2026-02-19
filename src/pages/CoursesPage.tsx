import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCourses } from '@/api/examService';
import type { CourseInfo } from '@/types';
import { BookOpen, Users, GraduationCap } from 'lucide-react';
import { cn } from '@/utils/cn';

const pastelCards = [
  'bg-gradient-to-br from-sky-50/80 to-blue-50/60 border-sky-100 hover:border-sky-200',
  'bg-gradient-to-br from-violet-50/80 to-purple-50/60 border-violet-100 hover:border-violet-200',
  'bg-gradient-to-br from-rose-50/80 to-pink-50/60 border-rose-100 hover:border-rose-200',
  'bg-gradient-to-br from-amber-50/80 to-yellow-50/60 border-amber-100 hover:border-amber-200',
  'bg-gradient-to-br from-emerald-50/80 to-teal-50/60 border-emerald-100 hover:border-emerald-200',
  'bg-gradient-to-br from-indigo-50/80 to-cyan-50/60 border-indigo-100 hover:border-indigo-200',
];

const pastelIcons = [
  'from-sky-100 to-blue-200 text-sky-600',
  'from-violet-100 to-purple-200 text-violet-600',
  'from-rose-100 to-pink-200 text-rose-600',
  'from-amber-100 to-yellow-200 text-amber-600',
  'from-emerald-100 to-teal-200 text-emerald-600',
  'from-indigo-100 to-cyan-200 text-indigo-600',
];

const pastelBadges = [
  'bg-sky-100 text-sky-600',
  'bg-violet-100 text-violet-600',
  'bg-rose-100 text-rose-600',
  'bg-amber-100 text-amber-600',
  'bg-emerald-100 text-emerald-600',
  'bg-indigo-100 text-indigo-600',
];

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Courses" subtitle="Overview of all AUY courses" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-600" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <GlassCard key={c.id} className={cn('group transition-all hover:shadow-md', pastelCards[i % pastelCards.length])}>
              <div className="flex items-start gap-3">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-all', pastelIcons[i % pastelIcons.length])}>
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs font-mono text-slate-400">{c.code}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <GraduationCap size={13} className="text-slate-400" />
                  <span>{c.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users size={13} className="text-slate-400" />
                  <span>{c.students} students enrolled</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/60">
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold', pastelBadges[i % pastelBadges.length])}>{c.department}</span>
              </div>
            </GlassCard>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 text-sm text-slate-400">No courses found</div>
          )}
        </div>
      )}
    </div>
  );
}
