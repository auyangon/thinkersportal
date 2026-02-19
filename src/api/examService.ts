import type { Exam, Result, CourseInfo } from '@/types';
import { apiGet, apiPost } from './baseService';
import { getMockExams, getMockResults, getMockCourses } from './mockData';

export async function getExams(_email?: string): Promise<Exam[]> {
  try {
    return await apiGet<Exam[]>('getExams', _email ? { email: _email } : {});
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockExams();
    }
    throw e;
  }
}

export async function getResults(email: string): Promise<Result[]> {
  try {
    return await apiGet<Result[]>('getResults', { email });
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockResults();
    }
    throw e;
  }
}

export async function createExam(payload: Omit<Exam, 'id'>): Promise<{ success: boolean }> {
  try {
    return await apiPost<{ success: boolean }>('createExam', payload as unknown as Record<string, unknown>);
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return { success: true };
    }
    throw e;
  }
}

export async function submitResult(payload: Omit<Result, 'id'>): Promise<{ success: boolean }> {
  try {
    return await apiPost<{ success: boolean }>('submitResult', payload as unknown as Record<string, unknown>);
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return { success: true };
    }
    throw e;
  }
}

export async function getCourses(): Promise<CourseInfo[]> {
  try {
    return await apiGet<CourseInfo[]>('getCourses');
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockCourses();
    }
    throw e;
  }
}
