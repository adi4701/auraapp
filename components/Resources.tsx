'use client';

import { Phone, Globe, HeartHandshake, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export function Resources() {
  const resources = [
    {
      title: "National Suicide Prevention Lifeline",
      description: "Free, confidential support for people in distress, prevention and crisis resources.",
      contact: "Dial 988",
      link: "https://988lifeline.org/",
      icon: <Phone className="w-5 h-5" />,
      color: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    {
      title: "Crisis Text Line",
      description: "Text HOME to 741741 to connect with a volunteer Crisis Counselor 24/7.",
      contact: "Text HOME to 741741",
      link: "https://www.crisistextline.org/",
      icon: <ShieldAlert className="w-5 h-5" />,
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    },
    {
      title: "The Trevor Project",
      description: "Crisis intervention and suicide prevention for LGBTQ youth.",
      contact: "Text START to 678-678",
      link: "https://www.thetrevorproject.org/",
      icon: <HeartHandshake className="w-5 h-5" />,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    {
      title: "NAMI HelpLine",
      description: "Information, resource referrals and support to people living with a mental health condition.",
      contact: "1-800-950-NAMI (6264)",
      link: "https://nami.org/help",
      icon: <Globe className="w-5 h-5" />,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Help is available</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          If you or someone you know is struggling or in crisis, you are not alone. Please reach out to these free, confidential resources.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col h-full"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${resource.color}`}>
              {resource.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
            <p className="text-white/60 text-sm mb-6 flex-1">{resource.description}</p>
            
            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="font-mono text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg text-sm">
                {resource.contact}
              </span>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                Visit Website
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
