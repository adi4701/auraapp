<div align="center">

<br />

<img width="90" height="90" src="https://github.com/adi4701/Aura/blob/main/public/logo.svg" alt="Aura Logo"/>

<br />
<br />

# ✨ Aura

### *Find your perfect frequency.*

**A social wellness companion that listens to how you feel, recommends music to match your mood, and connects you with a live community — all in one beautiful space.**

<br />

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-auraapp--blue.vercel.app-6366f1?style=for-the-badge)](https://auraapp-blue.vercel.app)
&nbsp;
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
&nbsp;
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br />

---

<br />

</div>

## 🌊 What is Aura?

Aura is a **social wellness app** built for moments when you need to be heard. Whether you're anxious, joyful, overwhelmed, or numb — Aura's AI companion listens without judgment, finds the perfect music for your mood, guides you through breathing exercises, and connects you with a real community going through the same things.

It's not just a chatbot. It's a full emotional wellness toolkit.

<br />

---

<br />

## 🎯 Features

<br />

### 🤖 &nbsp; Aura Chat — AI Wellness Companion
> *Powered by Google Gemini AI*

Tell Aura how you're really feeling. The AI responds with empathy, surfaces a YouTube music recommendation matched to your emotional frequency, and offers a personalized wellness tip — all in a beautifully designed chat interface.

```
You:   "I feel really anxious and overwhelmed today"
Aura:  "I hear you. Let's slow things down together.
        Here's something soft to ease into..."
        ▶ [Embedded YouTube Player]
        💚 Wellness Tip: Try the 4-7-8 breath...
```

<br />

### 📊 &nbsp; My Dashboard — Mood Journal
> *Your private emotional timeline*

Log how you're feeling each day with a mood label, a score from 1–10, and a journal entry. Watch your emotional patterns emerge over time through an interactive line chart. Every session opens with a rotating daily affirmation.

- 📈 Interactive mood trend chart
- 📝 Private journal entries stored securely
- 💬 Daily affirmations for positive reinforcement
- 🔒 Only you can see your data

<br />

### 🌬️ &nbsp; Breathe — Guided 4-7-8 Exercise
> *Find your center in under 2 minutes*

An animated, interactive breathing guide that walks you through the clinically-backed **4-7-8 technique** — shown to reduce anxiety and activate the body's rest response.

```
Inhale  ──── 4 seconds
Hold    ──────── 7 seconds  
Exhale  ──────────── 8 seconds
```

<br />

### 🫂 &nbsp; Community Feed — Anonymous Sharing
> *You are not alone*

Share your current vibe and the song you're listening to with the Aura community — anonymously. See in real time what other people around the world are feeling and listening to. A live counter shows how many people are currently present.

<br />

### 💙 &nbsp; Resources — Mental Health Support
> *Help is always one tap away*

Quick access to verified crisis support lines, available 24/7:

| Resource | Contact |
|---|---|
| 🆘 National Suicide Prevention Lifeline | Dial **988** |
| 💬 Crisis Text Line | Text **HOME** to 741741 |
| 🏳️‍🌈 The Trevor Project (LGBTQ+ Youth) | Text **START** to 678-678 |
| 🧠 NAMI HelpLine | **1-800-950-6264** |

<br />

---

<br />

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| ⚡ Framework | Next.js 15 (App Router) |
| ⚛️ UI | React 19 |
| 🔷 Language | TypeScript 5.9 |
| 🎨 Styling | Tailwind CSS v4 |
| 🎞️ Animation | Motion (Framer Motion) |
| 🤖 AI | Google Gemini (`@google/genai`) |
| 🔐 Auth | Firebase Google OAuth |
| 🗄️ Database | Cloud Firestore |
| 📊 Charts | Recharts |
| 🎵 Music | YouTube Embed API |
| 🔣 Icons | Lucide React |

</div>

<br />

---

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- A **Firebase** project with Firestore + Google Auth enabled
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/)

<br />

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/adi4701/Aura.git
cd Aura
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**4. Configure Firebase**

Update `firebase.ts` with your project credentials from the Firebase Console.

**5. Deploy Firestore security rules**
```bash
firebase deploy --only firestore:rules
```

**6. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

<br />

---

<br />

## 📁 Project Structure

```
Aura/
├── 📂 app/
│   ├── page.tsx              # Root — routing & app shell
│   ├── layout.tsx            # HTML shell, fonts, metadata
│   └── globals.css           # Global styles & theme tokens
│
├── 📂 components/
│   ├── 🤖 Chatbot.tsx        # Gemini AI chat interface
│   ├── 📊 Dashboard.tsx      # Mood journal & trend chart
│   ├── 🌬️ Breathe.tsx        # 4-7-8 breathing exercise
│   ├── 🫂 CommunityFeed.tsx  # Anonymous community moods
│   ├── 🏠 LandingPage.tsx    # Unauthenticated landing page
│   ├── 💙 Resources.tsx      # Crisis support resources
│   ├── ⚙️  Settings.tsx       # User profile settings
│   ├── 🟢 LiveCounter.tsx    # Real-time active users
│   ├── 🔥 FirebaseProvider.tsx # Auth context & state
│   └── 🛡️ ErrorBoundary.tsx  # Global error boundary
│
├── 📂 hooks/
│   └── use-mobile.ts         # Responsive breakpoint hook
│
├── 📂 lib/
│   ├── firebase-utils.ts     # Firestore helpers
│   └── utils.ts              # Utility functions
│
├── firebase.ts               # Firebase SDK init
├── firestore.rules           # Security rules
└── 📂 public/
    └── logo.svg              # Aura logo
```

<br />

---

<br />

## 🗃️ Firestore Data Model

```
📦 firestore
 ┣ 📂 journals/{journalId}
 ┃ ┣ userId        — string
 ┃ ┣ mood          — string (max 50 chars)
 ┃ ┣ moodScore     — number (1–10)
 ┃ ┣ entry         — string (max 2000 chars)
 ┃ ┗ createdAt     — timestamp
 ┃
 ┣ 📂 communityMoods/{moodId}
 ┃ ┣ mood          — string
 ┃ ┣ song          — string
 ┃ ┣ artist        — string
 ┃ ┗ createdAt     — timestamp
 ┃
 ┗ 📂 presence/{userId}
   ┗ lastActive    — timestamp
```

<br />

---

<br />

## ☁️ Deploying to Vercel

**1.** Push to GitHub, then import your repo on [vercel.com](https://vercel.com)

**2.** Add your environment variable in the Vercel dashboard:
```
GEMINI_API_KEY = your_key_here
```

**3.** Add your Vercel domain to Firebase Auth:
> Firebase Console → Authentication → Settings → Authorized domains → Add domain

**4.** Add OAuth origins in Google Cloud Console:
> APIs & Services → Credentials → OAuth Client → Add:
> - Authorized origin: `https://your-app.vercel.app`
> - Authorized redirect URI: `https://your-app.vercel.app/__/auth/handler`

<br />

---

<br />

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

<br />

---

<br />

## 📜 License

Distributed under the MIT License.

<br />

---

<br />

<div align="center">

**Built with 💜 to help people find their frequency**

*If you're struggling, please reach out. You are not alone.*

**988** &nbsp;·&nbsp; Text HOME to **741741** &nbsp;·&nbsp; [nami.org](https://nami.org)

<br />

⭐ **Star this repo if Aura resonated with you**

</div>
