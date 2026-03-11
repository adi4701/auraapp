'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';

interface FirebaseContextType {
  user: User | null;
  isAuthReady: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isAuthReady: false,
  signIn: async () => {},
  logOut: async () => {},
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        // Update presence
        try {
          await setDoc(doc(db, 'presence', currentUser.uid), {
            lastActive: serverTimestamp()
          });
        } catch (error) {
          console.error("Failed to update presence", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Update presence periodically
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const interval = setInterval(async () => {
      try {
        await setDoc(doc(db, 'presence', user.uid), {
          lastActive: serverTimestamp()
        });
      } catch (error) {
        console.error("Failed to update presence", error);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [user, isAuthReady]);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, isAuthReady, signIn, logOut }}>
      {children}
    </FirebaseContext.Provider>
  );
}
