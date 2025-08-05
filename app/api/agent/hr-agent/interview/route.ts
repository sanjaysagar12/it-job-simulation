import { NextRequest, NextResponse } from 'next/server';
import { GeminiAI } from '../../../../global/agent';

// In-memory storage for conversation history (in production, use a database)
const conversationMemory = new Map<string, Array<{ role: string; content: string }>>();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userMessage, sessionId = 'default', candidateName, position } = body;

        if (!userMessage) {
            return NextResponse.json({ error: 'User message is required' }, { status: 400 });
        }

        // Get or initialize conversation history
        let conversationHistory = conversationMemory.get(sessionId) || [];

        // System prompt for HR interview agent
        const systemPrompt = `You are Rohith, an experienced HR interviewer from Velsy Media conducting a professional job interview for a Software Developer position. 

Your identity and company:
- Name: Rohith
- Company: Velsy Media
- Role: HR Interviewer/Technical Recruiter
- You represent a dynamic media company that values innovation, technical excellence, and creative problem-solving

Your role in this interview:
- Ask thoughtful, relevant questions about the candidate's software development experience and technical skills
- Focus on programming languages, frameworks, problem-solving abilities, and software development methodologies
- Be professional, friendly, and encouraging while maintaining technical depth
- Assess both technical competencies and cultural fit for Velsy Media
- Follow up on answers with clarifying questions when appropriate
- Remember the conversation context and build upon previous answers
- Keep questions conversational and natural

${candidateName ? `Candidate Name: ${candidateName}` : ''}
Position: Software Developer at Velsy Media

Key areas to explore:
- Programming languages and technical skills (JavaScript, Python, React, Node.js, databases, etc.)
- Software development experience and project examples
- Problem-solving and debugging approaches
- Experience with version control, testing, and deployment
- Understanding of software development lifecycle and methodologies
- Experience with media/web technologies (bonus)
- Cultural fit with a collaborative, innovative team environment

Guidelines:
- Start with a warm greeting introducing yourself as Rohith from Velsy Media
- Ask one question at a time focusing on software development competencies
- Show genuine interest in their technical experience and projects
- Provide encouraging feedback when appropriate
- Explore specific coding examples and technical challenges they've faced
- Ask about their preferred technologies and development practices
- If the conversation seems to be ending, provide next steps about Velsy Media's hiring process

Previous conversation context will be provided to maintain continuity.`;

        // Build conversation context
        let contextPrompt = systemPrompt;
        if (conversationHistory.length > 0) {
            contextPrompt += "\n\nPrevious conversation:\n";
            conversationHistory.forEach(msg => {
                contextPrompt += `${msg.role}: ${msg.content}\n`;
            });
        }
        contextPrompt += `\nCandidate: ${userMessage}\n\nPlease respond as the HR interviewer:`;

        // Get AI response
        const aiResponse = await GeminiAI(contextPrompt, "");

        // Update conversation history
        conversationHistory.push({ role: "Candidate", content: userMessage });
        conversationHistory.push({ role: "HR Interviewer", content: aiResponse });

        // Keep only last 20 messages to prevent memory overflow
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        // Store updated conversation
        conversationMemory.set(sessionId, conversationHistory);

        return NextResponse.json({ 
            response: aiResponse,
            sessionId: sessionId,
            conversationLength: conversationHistory.length
        });

    } catch (error: any) {
        console.error('Interview agent error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Optional: Add GET endpoint to retrieve conversation history
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId') || 'default';
        
        const conversationHistory = conversationMemory.get(sessionId) || [];
        
        return NextResponse.json({ 
            conversationHistory,
            sessionId 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Optional: Add DELETE endpoint to clear conversation history
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId') || 'default';
        
        conversationMemory.delete(sessionId);
        
        return NextResponse.json({ 
            message: 'Conversation history cleared',
            sessionId 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}