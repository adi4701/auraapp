'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useFirebase } from './FirebaseProvider';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { BookOpen, Send, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface JournalEntry {
  id: string;
  mood: string;
  moodScore: number;
  entry: string;
  createdAt: any;
}

export function Dashboard() {
  const { user, isAuthReady } = useFirebase();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [newMood, setNewMood] = useState('');
  const [newMoodScore, setNewMoodScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    const affirmations = [
      "I am capable of achieving my goals.",
      "Every day is a fresh start.",
      "I choose to focus on what I can control.",
      "My potential to succeed is limitless.",
      "I am worthy of peace and happiness.",
      "I embrace the rhythm of life and let it unfold.",
      "I am resilient, strong, and brave.",
      "I give myself permission to rest and recharge.",
      "My mind is clear, focused, and calm."
    ];
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) return;

    const q = query(
      collection(db, 'journals'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setJournals(entries);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'journals');
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEntry.trim() || !newMood.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'journals'), {
        userId: user.uid,
        mood: newMood.substring(0, 50),
        moodScore: newMoodScore,
        entry: newEntry.substring(0, 2000),
        createdAt: serverTimestamp()
      });
      setNewEntry('');
      setNewMood('');
      setNewMoodScore(5);
    } catch (error) {
      console.error("Failed to add journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = journals.map(j => ({
    date: j.createdAt?.toDate ? format(j.createdAt.toDate(), 'MMM dd') : '',
    score: j.moodScore,
    mood: j.mood
  })).filter(d => d.date !== '');

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-semibold text-white mb-2">Your Personal Space</h2>
        <p className="text-white/60">Please sign in to view your dashboard and track your wellness journey.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Daily Affirmation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl text-center"
      >
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Daily Affirmation</p>
        <p className="text-xl md:text-2xl font-display font-medium text-white">&quot;{affirmation}&quot;</p>
      </motion.div>

      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-display font-semibold text-white">Mood Trends</h2>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} domain={[1, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,5,2,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke="#34d399" strokeWidth={3} dot={{ fill: '#34d399', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm">Not enough data to show trends yet.</p>
          </div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Journal Entry Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl"
        >
          <h2 className="text-xl font-display font-semibold text-white mb-6">New Journal Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">How are you feeling?</label>
              <input
                type="text"
                value={newMood}
                onChange={(e) => setNewMood(e.target.value)}
                placeholder="e.g., Anxious, Joyful, Tired..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Mood Score (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newMoodScore}
                onChange={(e) => setNewMoodScore(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>Low</span>
                <span>{newMoodScore}</span>
                <span>High</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Journal Entry</label>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Write down your thoughts..."
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Save Entry
            </button>
          </form>
        </motion.div>

        {/* Recent Entries */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col h-full max-h-[500px]"
        >
          <h2 className="text-xl font-display font-semibold text-white mb-6">Recent Entries</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {[...journals].reverse().map((journal) => (
              <div key={journal.id} className="p-4 bg-black/20 border border-white/5 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-white/10 rounded-md text-xs font-medium text-white/80 mb-1">
                      {journal.mood} ({journal.moodScore}/10)
                    </span>
                  </div>
                  <span className="text-xs text-white/40">
                    {journal.createdAt?.toDate ? format(journal.createdAt.toDate(), 'MMM dd, h:mm a') : 'Just now'}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{journal.entry}</p>
              </div>
            ))}
            {journals.length === 0 && (
              <p className="text-white/40 text-sm text-center py-8">No entries yet. Start journaling!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
