import type { UserProfile, SystemStats } from '@/types';
import { apiGet } from './baseService';
import { getMockUser, getMockSystemStats, getMockAllUsers } from './mockData';

export async function getUserByEmail(email: string): Promise<UserProfile> {
  try {
    return await apiGet<UserProfile>('getUser', { email });
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockUser(email);
    }
    throw e;
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    return await apiGet<UserProfile[]>('getAllUsers');
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockAllUsers();
    }
    throw e;
  }
}

export async function getSystemStats(): Promise<SystemStats> {
  try {
    return await apiGet<SystemStats>('getSystemStats');
  } catch (e) {
    if (e instanceof Error && e.message === 'DEMO_MODE') {
      return getMockSystemStats();
    }
    throw e;
  }
}
