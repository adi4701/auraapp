'use client';

import { motion } from 'motion/react';
import { useFirebase } from './FirebaseProvider';
import Image from 'next/image';

export function Settings() {
  const { user } = useFirebase();

  return (
    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
      <h2 className="text-2xl font-display font-semibold mb-6">Profile Settings</h2>
      
      <div className="flex items-center gap-6 mb-8">
        <Image 
          src={user?.photoURL || 'https://picsum.photos/seed/user/100/100'} 
          alt="Profile" 
          width={80} 
          height={80} 
          className="rounded-full border-2 border-white/10"
          referrerPolicy="no-referrer"
        />
        <div>
          <h3 className="text-xl font-medium">{user?.displayName || 'Anonymous User'}</h3>
          <p className="text-white/60">{user?.email || 'No email provided'}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Display Name</label>
          <input 
            type="text" 
            disabled
            value={user?.displayName || ''} 
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors opacity-70 cursor-not-allowed"
          />
          <p className="text-xs text-white/40 mt-2">Display name is managed by your Google account.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
          <input 
            type="email" 
            disabled
            value={user?.email || ''} 
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors opacity-70 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
