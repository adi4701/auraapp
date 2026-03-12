import { NextResponse } from 'next/server';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiKeyPublic = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  return NextResponse.json({
    GEMINI_API_KEY: geminiKey ? `set (starts with: ${geminiKey.substring(0, 8)}...)` : 'NOT SET',
    NEXT_PUBLIC_GEMINI_API_KEY: geminiKeyPublic ? `set (starts with: ${geminiKeyPublic.substring(0, 8)}...)` : 'NOT SET',
    node_env: process.env.NODE_ENV,
  });
}
