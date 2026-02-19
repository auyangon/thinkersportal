import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from '@/config/firebase';
import { getUserByEmail } from '@/api/userService';
import type { UserProfile } from '@/types';

interface AuthState {
  firebaseUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
}

interface AuthContextType extends AuthState {
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginAsDemo: (role: 'admin' | 'teacher' | 'student') => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_EMAILS: Record<string, string> = {
  admin: 'admin@university.edu',
  teacher: 'teacher@university.edu',
  student: 'student@university.edu',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    profile: null,
    loading: true,
    error: null,
    isDemoMode: false,
  });

  const fetchProfile = useCallback(async (email: string) => {
    try {
      const profile = await getUserByEmail(email);
      setState(prev => ({ ...prev, profile, loading: false, error: null }));
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load user profile',
      }));
    }
  }, []);

  useEffect(() => {
    // Check for persisted demo session
    const demoRole = sessionStorage.getItem('demo_role');
    if (demoRole) {
      const email = DEMO_EMAILS[demoRole] || DEMO_EMAILS.student;
      fetchProfile(email).then(() => {
        setState(prev => ({ ...prev, isDemoMode: true }));
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setState(prev => ({ ...prev, firebaseUser: user, loading: true }));
        await fetchProfile(user.email || '');
      } else if (!sessionStorage.getItem('demo_role')) {
        setState({ firebaseUser: null, profile: null, loading: false, error: null, isDemoMode: false });
      }
    });

    return unsubscribe;
  }, [fetchProfile]);

  const loginWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await signInWithPopup(auth, googleProvider);
      await fetchProfile(result.user.email || '');
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Google sign-in failed',
      }));
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchProfile(result.user.email || '');
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Email sign-in failed',
      }));
    }
  };

  const loginAsDemo = (role: 'admin' | 'teacher' | 'student') => {
    const email = DEMO_EMAILS[role];
    sessionStorage.setItem('demo_role', role);
    setState(prev => ({ ...prev, loading: true, isDemoMode: true }));
    fetchProfile(email);
  };

  const logout = async () => {
    try {
      if (!state.isDemoMode) {
        await firebaseSignOut(auth);
      }
      sessionStorage.removeItem('demo_role');
      setState({ firebaseUser: null, profile: null, loading: false, error: null, isDemoMode: false });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Sign out failed',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, loginWithGoogle, loginWithEmail, loginAsDemo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
