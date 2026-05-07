'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Store user safely in firestore on login
      if (user && firestore) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          await setDoc(userRef, {
            email: user.email,
            uid: user.uid,
            lastLoginAt: new Date().toISOString(),
          }, { merge: true });
        } catch (error) {
          console.error("Error storing user in Firestore:", error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was closed by the user.');
      } else {
        console.error('Error signing in with Google', error);
      }
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
