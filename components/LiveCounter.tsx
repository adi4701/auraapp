'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useFirebase } from './FirebaseProvider';
import { Users } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';

export function LiveCounter() {
  const { isAuthReady } = useFirebase();
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    if (!isAuthReady) return;

    let unsubscribe: (() => void) | null = null;

    const setupQuery = () => {
      if (unsubscribe) unsubscribe();

      // Users active in the last 5 minutes
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

      const q = query(
        collection(db, 'presence'),
        where('lastActive', '>=', Timestamp.fromDate(fiveMinutesAgo))
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        setActiveUsers(snapshot.docs.length);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'presence');
      });
    };

    setupQuery();
    const interval = setInterval(setupQuery, 60000); // Refresh query every minute

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [isAuthReady]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <Users className="w-4 h-4 text-white/70" />
      <span className="text-sm font-medium text-white/90">{activeUsers} online</span>
    </div>
  );
}
