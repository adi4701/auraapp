'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useFirebase } from './FirebaseProvider';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  song: string;
  artist: string;
  createdAt: any;
}

export function CommunityFeed() {
  const { isAuthReady } = useFirebase();
  const [feed, setFeed] = useState<MoodEntry[]>([]);

  useEffect(() => {
    if (!isAuthReady) return;

    const q = query(
      collection(db, 'communityMoods'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: MoodEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as MoodEntry);
      });
      setFeed(entries);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'communityMoods');
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Community Vibes</h3>
      <div className="space-y-3">
        {feed.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3 will-change-transform"
          >
            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-300">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-medium">Feeling {entry.mood}</p>
              <p className="text-white/50 text-xs mt-1">Listening to <span className="text-white/70">{entry.song}</span> by {entry.artist}</p>
            </div>
          </motion.div>
        ))}
        {feed.length === 0 && (
          <p className="text-white/40 text-sm text-center py-4">No vibes shared yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
