'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import { MessageSquare, LayoutDashboard, Wind, HeartHandshake, ArrowRight, Activity, Shield, Zap, Github, Twitter, Instagram } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

interface LandingPageProps {
  onSignIn: () => void;
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 50, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Companion",
      description: "Chat with an intelligent, empathetic assistant that listens to your feelings and recommends music to match your frequency."
    },
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: "Mood Journaling",
      description: "Track your emotional well-being over time with a private dashboard, daily affirmations, and mood history."
    },
    {
      icon: <Wind className="w-6 h-6" />,
      title: "Guided Breathing",
      description: "Find your center instantly with interactive 4-7-8 breathing exercises designed to reduce anxiety and promote calm."
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Community & Support",
      description: "Share your current vibe anonymously with the community, and access critical mental health resources whenever you need them."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Check In",
      description: "Tell Aura how you're feeling. Our AI analyzes your emotional state with deep empathy."
    },
    {
      number: "02",
      title: "Find Balance",
      description: "Receive personalized breathing exercises and music recommendations tailored to your exact mood."
    },
    {
      number: "03",
      title: "Track Progress",
      description: "Watch your emotional landscape evolve over time through beautiful, private data visualizations."
    }
  ];

  return (
    <div className="flex flex-col w-full relative">
      {/* Live Background Effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] will-change-transform"
          style={{
            x: smoothX,
            y: smoothY,
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] will-change-transform"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        {/* Live Hero Section */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center pt-12 pb-24 relative">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md text-zinc-300 text-xs font-medium tracking-widest uppercase mb-8 shadow-2xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Aura is Live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-serif italic font-normal tracking-tighter text-zinc-100 leading-[1.05] mb-8 relative z-10">
            Clarity in the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">noise of life.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Aura is a minimalist sanctuary for your mind. Track your mood, find your center, and connect with a supportive community.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onSignIn}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-100 text-zinc-950 rounded-full font-medium text-lg hover:bg-white transition-all hover:scale-105 active:scale-95 w-full sm:w-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start your journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <a href="#features" className="px-8 py-4 rounded-full font-medium text-lg text-zinc-400 hover:text-zinc-100 transition-colors">
              Learn more
            </a>
          </motion.div>

          {/* Floating UI Elements (Mockup) */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 relative w-full max-w-4xl mx-auto h-64 md:h-96 perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent z-20" />
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-t-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-zinc-800/50 pb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Image src="/logo.svg" alt="Aura Logo" width={20} height={20} className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">Aura AI</div>
                  <div className="text-xs text-emerald-400">Online</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 rounded-2xl rounded-tl-sm p-4 max-w-[80%] text-lg font-serif italic font-normal text-zinc-300">
                  Welcome back. How are you feeling today? Take a deep breath before you answer.
                </div>
                <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-2xl rounded-tr-sm p-4 max-w-[80%] ml-auto text-sm text-indigo-100">
                  I&apos;m feeling a bit overwhelmed with work, honestly.
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-t border-zinc-900">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif italic font-normal text-zinc-100 mb-4">Everything you need.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Purpose-built tools to help you navigate your daily emotional landscape.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/80 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-300 mb-6 group-hover:scale-110 group-hover:bg-zinc-100 group-hover:text-zinc-900 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-serif italic font-normal text-zinc-100 mb-6">How Aura works</h2>
                <p className="text-zinc-400 text-lg mb-12">A simple, effective loop designed to bring you back to your baseline.</p>
                
                <div className="space-y-12">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-6 relative">
                      {index !== steps.length - 1 && (
                        <div className="absolute left-6 top-14 bottom-[-3rem] w-px bg-zinc-800" />
                      )}
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-sm shrink-0 z-10">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-200 mb-2">{step.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[600px] rounded-3xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 rounded-full border border-zinc-800 border-dashed flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border border-zinc-700 border-dashed flex items-center justify-center"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 blur-xl animate-pulse" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials / Stats */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif italic font-normal text-zinc-100 mb-16">Built for peace of mind.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Activity className="w-6 h-6" />, stat: "10k+", label: "Daily Check-ins" },
                { icon: <Wind className="w-6 h-6" />, stat: "50k", label: "Breaths Taken" },
                { icon: <Shield className="w-6 h-6" />, stat: "100%", label: "Private & Secure" },
                { icon: <Zap className="w-6 h-6" />, stat: "<1s", label: "AI Response Time" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-bold text-zinc-100 mb-1">{item.stat}</div>
                  <div className="text-sm text-zinc-500 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10 pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif italic font-normal text-zinc-100 mb-6">Ready to find your center?</h2>
            <p className="text-xl text-zinc-400 mb-10">Join the community and start your wellness journey today. It&apos;s completely free.</p>
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-100 text-zinc-950 rounded-full font-medium text-lg hover:bg-white transition-all hover:scale-105 active:scale-95"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-900 pt-16 pb-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Image src="/logo.svg" alt="Aura Logo" width={20} height={20} className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xl tracking-tight text-zinc-100">Aura</span>
                </div>
                <p className="text-zinc-500 max-w-sm leading-relaxed">
                  Aura is a minimalist sanctuary for your mind. Track your mood, find your center, and connect with a supportive community.
                </p>
              </div>
              
              <div>
                <h4 className="text-zinc-100 font-medium mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-zinc-500">
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">How it works</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Changelog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-zinc-100 font-medium mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-zinc-500">
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-900 text-sm text-zinc-600">
              <p>© {new Date().getFullYear()} Aura Wellness. All rights reserved.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-zinc-300 transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="hover:text-zinc-300 transition-colors"><Github className="w-4 h-4" /></a>
                <a href="#" className="hover:text-zinc-300 transition-colors"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
