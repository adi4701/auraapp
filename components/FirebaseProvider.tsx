'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface FirebaseContextType {
  user: User | null;
  isAuthReady: boolean;
  signIn: () => void;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isAuthReady: false,
  signIn: () => {},
  logOut: async () => {},
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        try {
          await setDoc(doc(db, 'presence', currentUser.uid), {
            lastActive: serverTimestamp()
          });
        } catch (error) {
          console.error('Failed to update presence:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Update presence every minute while logged in
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const interval = setInterval(async () => {
      try {
        await setDoc(doc(db, 'presence', user.uid), {
          lastActive: serverTimestamp()
        });
      } catch (error) {
        console.error('Failed to update presence:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, isAuthReady]);

  // signIn is a plain synchronous function — NOT async
  // This is critical: popup must be triggered directly from user click
  // with zero async delay, otherwise browsers block it
  const signIn = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    signInWithPopup(auth, provider).catch((error) => {
      console.error('Sign in error:', error.code, error.message);
    });
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, isAuthReady, signIn, logOut }}>
      {children}
    </FirebaseContext.Provider>
  );
}
