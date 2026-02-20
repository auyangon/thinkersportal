// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { checkEmailAllowed } from '../checkEmailInSheet';

interface AuthContextType {
  profile: any | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user && user.email) {
        const allowed = await checkEmailAllowed(user.email);
        if (!allowed) {
          await auth.signOut();
          setProfile(null);
        } else {
          setProfile(allowed);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      const allowed = await checkEmailAllowed(email);
      if (!allowed) throw new Error("This email is not authorized");
      await signInWithEmailAndPassword(auth, email, password);
      setProfile(allowed);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email!;
      const allowed = await checkEmailAllowed(email);
      if (!allowed) {
        await auth.signOut();
        throw new Error("This email is not authorized");
      }
      setProfile(allowed);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, loading, error, loginWithEmail, loginWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};