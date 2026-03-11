'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FirebaseProvider, useFirebase } from '../components/FirebaseProvider';
import { Chatbot } from '../components/Chatbot';
import { LiveCounter } from '../components/LiveCounter';
import { CommunityFeed } from '../components/CommunityFeed';
import { Dashboard } from '../components/Dashboard';
import { Breathe } from '../components/Breathe';
import { Resources } from '../components/Resources';
import { LandingPage } from '../components/LandingPage';
import { Settings } from '../components/Settings';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, MessageSquare, LayoutDashboard, Wind, HeartHandshake, LogOut, Settings as SettingsIcon } from 'lucide-react';

function MainContent() {
  const { user, signIn, logOut } = useFirebase();
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'breathe' | 'resources' | 'settings'>('chat');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <main className={`min-h-screen relative overflow-hidden font-mono transition-colors duration-1000 ${user ? 'bg-[#0a0502] text-white' : 'bg-zinc-950 text-zinc-50'}`}>
      {/* Atmospheric Background - Only show when logged in to keep landing page monochromatic */}
      <AnimatePresence>
        {user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] will-change-transform" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] will-change-transform" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl backdrop-blur-md border flex items-center justify-center ${user ? 'bg-white/10 border-white/10' : 'bg-zinc-900 border-zinc-800'}`}>
              <Image src="/logo.svg" alt="Aura Logo" width={20} height={20} className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xl tracking-tight">Aura</span>
          </div>
          
          <div className="flex items-center gap-4">
            <LiveCounter />
            {!user ? (
              <button
                onClick={signIn}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-full text-sm font-medium border border-zinc-800 text-zinc-300"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-full border border-white/10 backdrop-blur-md"
                >
                  <Image src={user.photoURL || 'https://picsum.photos/seed/user/100/100'} alt="User" width={24} height={24} className="rounded-full" referrerPolicy="no-referrer" />
                  <span className="text-sm font-medium text-white/80">{user.displayName?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setActiveTab('settings');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                        >
                          <SettingsIcon className="w-4 h-4" />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            logOut();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* Navigation Tabs */}
        {user && (
          <div className="flex justify-center mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md whitespace-nowrap">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Aura Chat
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </button>
              <button
                onClick={() => setActiveTab('breathe')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'breathe' ? 'bg-teal-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wind className="w-4 h-4" />
                Breathe
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'resources' ? 'bg-rose-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                Resources
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="will-change-transform"
            >
              <LandingPage onSignIn={signIn} />
            </motion.div>
          ) : activeTab === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center will-change-transform"
            >
              <div className="order-2 lg:order-1">
                <h1 className="text-5xl md:text-7xl font-serif italic font-normal tracking-tighter leading-[1.1] mb-6">
                  Find your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                    perfect frequency.
                  </span>
                </h1>
                <p className="text-lg text-white/60 mb-8 max-w-md leading-relaxed">
                  Aura is a social wellness companion that listens to how you feel and recommends the perfect music to match your mood, while connecting you with a live community.
                </p>
                
                <div className="hidden lg:block">
                  <CommunityFeed />
                </div>
              </div>

              <div className="w-full order-1 lg:order-2">
                <Chatbot />
              </div>
              
              {/* Mobile Community Feed */}
              <div className="block lg:hidden mt-16 order-3">
                <CommunityFeed />
              </div>
            </motion.div>
          ) : null}
          
          {user && activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="will-change-transform"
            >
              <Dashboard />
            </motion.div>
          )}

          {user && activeTab === 'breathe' && (
            <motion.div
              key="breathe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-12 will-change-transform"
            >
              <Breathe />
            </motion.div>
          )}

          {user && activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-12 will-change-transform"
            >
              <Resources />
            </motion.div>
          )}

          {user && activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-12 will-change-transform"
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <MainContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
