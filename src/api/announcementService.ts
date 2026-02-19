import type { Announcement } from '@/types';
import { apiGet, apiPost } from './baseService';
import { getMockAnnouncements } from './mockData';

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    return await apiGet<Announcement[]>('getAnnouncements');
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockAnnouncements();
    }
    throw e;
  }
}

export async function createAnnouncement(payload: Omit<Announcement, 'id'>): Promise<{ success: boolean }> {
  try {
    return await apiPost<{ success: boolean }>('createAnnouncement', payload as unknown as Record<string, unknown>);
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return { success: true };
    }
    throw e;
  }
}
