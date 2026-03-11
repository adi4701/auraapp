'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wind, Play, Square } from 'lucide-react';

export function Breathe() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 8;
          } else {
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleBreathing = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('inhale');
      setTimeLeft(4);
    } else {
      setIsActive(true);
      setPhase('inhale');
      setTimeLeft(4);
    }
  };

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  const getDuration = () => {
    switch (phase) {
      case 'inhale': return 4;
      case 'hold': return 7;
      case 'exhale': return 8;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center text-center">
      <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 mb-6">
        <Wind className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-display font-semibold text-white mb-2">4-7-8 Breathing</h2>
      <p className="text-white/60 text-sm mb-12">A simple technique to reduce anxiety and help you relax.</p>

      <div className="relative w-48 h-48 flex items-center justify-center mb-12">
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: isActive ? getDuration() : 0.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl will-change-transform"
        />
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: isActive ? getDuration() : 0.5, ease: "easeInOut" }}
          className="absolute inset-4 bg-emerald-500/30 rounded-full border border-emerald-400/30"
        />
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-4xl font-bold text-white mb-1">{isActive ? timeLeft : ''}</span>
          <span className="text-sm font-medium text-emerald-200 uppercase tracking-widest">
            {isActive ? getInstruction() : 'Ready'}
          </span>
        </div>
      </div>

      <button
        onClick={toggleBreathing}
        className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
          isActive 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-emerald-600 text-white hover:bg-emerald-500'
        }`}
      >
        {isActive ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Start Exercise
          </>
        )}
      </button>
    </div>
  );
}
