import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: "You are Aura, an empathetic social wellness chatbot. Your goal is to listen to the user's feelings, offer a brief, comforting, and empathetic response, recommend exactly ONE song that fits their mood, and provide a short wellness tip or activity. You MUST format your response as JSON with the following structure: { \"message\": \"Your empathetic response here\", \"song\": \"Song Name\", \"artist\": \"Artist Name\", \"mood\": \"A single word describing their mood\", \"moodScore\": 5, \"wellnessTip\": \"A short wellness activity\" }. The moodScore should be a number from 1 (very negative) to 10 (very positive).",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            song: { type: Type.STRING },
            artist: { type: Type.STRING },
            mood: { type: Type.STRING },
            moodScore: { type: Type.NUMBER },
            wellnessTip: { type: Type.STRING },
          },
          required: ['message', 'song', 'artist', 'mood', 'moodScore', 'wellnessTip'],
        },
      },
      history: history || [],
    });

    const response = await chat.sendMessage({ message });
    const data = JSON.parse(response.text ?? "{}");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
