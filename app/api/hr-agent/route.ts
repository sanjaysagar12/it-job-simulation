// filepath: /home/sagar/it-job-simulation/pages/api/gemini-test.ts
import { NextRequest, NextResponse } from 'next/server';
import { GeminiAI } from '../../global/agent';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const systemPrompt = "You are a helpful assistant.";
        const userPrompt = body?.userPrompt || "What is the capital of France?";
        const response = await GeminiAI(systemPrompt, userPrompt);
        return NextResponse.json({ response });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}