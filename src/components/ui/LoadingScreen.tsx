import { GraduationCap } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-navy-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-navy-200 animate-pulse-ring" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy-600 to-navy-800 shadow-lg shadow-navy-200">
            <GraduationCap className="h-8 w-8 text-white animate-spin-slow" />
          </div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-navy-700">Loading Thinkers' Portal</p>
          <p className="text-xs text-slate-400">American University of Yangon</p>
        </div>
      </div>
    </div>
  );
}
