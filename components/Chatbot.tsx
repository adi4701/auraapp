'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { useFirebase } from './FirebaseProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';

interface Message {
  role: 'user' | 'model';
  content: string;
  youtubeId?: string;
  wellnessTip?: string;
}

const ChatMessage = memo(({ msg }: { msg: Message }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} will-change-transform`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          msg.role === 'user'
            ? 'bg-indigo-600 text-white rounded-br-sm font-mono text-sm'
            : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5 font-serif italic font-normal text-lg'
        }`}
      >
        <div className={`prose prose-invert max-w-none ${msg.role === 'user' ? 'prose-sm prose-p:font-mono' : 'prose-lg prose-p:font-serif prose-p:italic prose-p:font-normal'}`}>
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
        
        {msg.youtubeId && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            <iframe
              width="100%"
              height="160"
              src={`https://www.youtube.com/embed/${msg.youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {msg.wellnessTip && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">Wellness Tip</p>
            <p className="text-emerald-100/80 text-sm">{msg.wellnessTip}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});
ChatMessage.displayName = 'ChatMessage';

export function Chatbot() {
  const { user, isAuthReady } = useFirebase();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi there. I'm Aura. How are you feeling right now? I can recommend some music to match your mood, and give you a wellness tip." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatRef = useRef<any>(null);

  const initChat = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });
    return ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Aura, an empathetic social wellness chatbot. Your goal is to listen to the user's feelings, offer a brief, comforting, and empathetic response, recommend exactly ONE song that fits their mood, and provide a short wellness tip or activity. You MUST format your response as JSON with the following structure: { \"message\": \"Your empathetic response here\", \"song\": \"Song Name\", \"artist\": \"Artist Name\", \"mood\": \"A single word describing their mood\", \"moodScore\": 5, \"wellnessTip\": \"A short wellness activity\" }. The moodScore should be a number from 1 (very negative) to 10 (very positive).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "Empathetic response to the user" },
            song: { type: Type.STRING, description: "Recommended song name" },
            artist: { type: Type.STRING, description: "Recommended artist name" },
            mood: { type: Type.STRING, description: "A single word summarizing the user's mood" },
            moodScore: { type: Type.NUMBER, description: "A score from 1 to 10 representing the mood" },
            wellnessTip: { type: Type.STRING, description: "A short wellness activity or tip" }
          },
          required: ["message", "song", "artist", "mood", "moodScore", "wellnessTip"]
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = initChat();
      }

      if (!chatRef.current) throw new Error("Could not initialize chat");

      const response = await chatRef.current.sendMessage({ message: userMessage });
      
      if (response.text) {
        const data = JSON.parse(response.text);
        
        const modelMessage = `${data.message}\n\n**Recommendation:** *${data.song}* by ${data.artist}`;
        
        // Fetch YouTube video ID
        let youtubeId = '';
        const ytApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (ytApiKey) {
          try {
            const query = encodeURIComponent(`${data.song} ${data.artist} official audio`);
            const ytResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${ytApiKey}`);
            const ytData = await ytResponse.json();
            if (ytData.items && ytData.items.length > 0) {
              youtubeId = ytData.items[0].id.videoId;
            }
          } catch (err) {
            console.error("Failed to fetch YouTube video:", err);
          }
        }

        setMessages(prev => [...prev, { 
          role: 'model', 
          content: modelMessage,
          youtubeId: youtubeId,
          wellnessTip: data.wellnessTip
        }]);

        // If user is logged in, save to community feed and personal journal
        if (user && isAuthReady) {
          try {
            await addDoc(collection(db, 'communityMoods'), {
              mood: data.mood.substring(0, 50),
              song: data.song.substring(0, 100),
              artist: data.artist.substring(0, 100),
              createdAt: serverTimestamp()
            });

            await addDoc(collection(db, 'journals'), {
              userId: user.uid,
              mood: data.mood.substring(0, 50),
              moodScore: data.moodScore,
              entry: userMessage.substring(0, 2000),
              createdAt: serverTimestamp()
            });
          } catch (err) {
            console.error("Failed to save data:", err);
          }
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-full flex items-center justify-center">
          <Image src="/logo.svg" alt="Aura Logo" width={20} height={20} className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white font-medium">Aura</h2>
          <p className="text-white/50 text-xs">Your wellness companion</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}
        {isLoading && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start will-change-transform"
          >
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-5 py-4 border border-white/5 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-white/50 text-sm">Aura is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/20 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white placeholder:font-serif placeholder:italic placeholder:font-normal placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-full transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        {!user && (
          <p className="text-center text-white/40 text-xs mt-3">
            Sign in to share your mood with the community.
          </p>
        )}
      </div>
    </div>
  );
}
