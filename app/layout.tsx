import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura - Social Wellness & Music',
  description: 'A social wellness chatbot that recommends music based on your mood and connects you with a live community.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-serif: 'Instrument Serif', serif;
            --font-mono: 'DM Mono', monospace;
          }
        `}</style>
      </head>
      <body className="font-mono bg-[#0a0502] text-white" suppressHydrationWarning>{children}</body>
    </html>
  );
}
