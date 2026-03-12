import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not set' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Say hello in one word',
    });
    return NextResponse.json({ 
      success: true, 
      response: response.text,
      keyPrefix: apiKey.substring(0, 8)
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message,
      errorCode: error.status,
      keyPrefix: apiKey.substring(0, 8)
    });
  }
}
