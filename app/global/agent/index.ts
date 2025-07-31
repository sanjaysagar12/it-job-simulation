import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiApiKey = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key not found in environment variables. Please set GEMINI_API_KEY.');
    }
    return apiKey;
};

export const GeminiAI = async (
    systemPrompt: string,
    userPrompt: string
): Promise<string> => {
    try {
        const apiKey = getGeminiApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Combine system prompt and user prompt
        const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Error getting AI response:", error);
        throw new Error("Sorry, I couldn't process your request. Please make sure your API key is set correctly in the environment variable GEMINI_API_KEY.");
    }
};

