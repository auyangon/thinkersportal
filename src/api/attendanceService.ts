import type { AttendanceRecord, AttendanceSummary } from '@/types';
import { apiGet, apiPost } from './baseService';
import { getMockAttendance, getMockAttendanceSummary } from './mockData';

export async function getAttendanceByEmail(email: string): Promise<AttendanceRecord[]> {
  try {
    return await apiGet<AttendanceRecord[]>('getAttendance', { email });
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockAttendance(email);
    }
    throw e;
  }
}

export async function getAttendanceSummary(email: string): Promise<AttendanceSummary> {
  try {
    return await apiGet<AttendanceSummary>('getAttendanceSummary', { email });
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockAttendanceSummary();
    }
    throw e;
  }
}

export async function markAttendance(payload: {
  studentEmail: string;
  studentName: string;
  course: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}): Promise<{ success: boolean }> {
  try {
    return await apiPost<{ success: boolean }>('markAttendance', payload);
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return { success: true };
    }
    throw e;
  }
}
