import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Initialize the client
// We add a safety check here. If process.env.API_KEY is missing (e.g. during build or misconfiguration),
// we avoid crashing the entire app immediately.
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
  }
}

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!ai) {
    throw new Error("API Key not configured");
  }

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai) {
    return "Demo Mode: API Key is missing. Please configure VITE_API_KEY in your environment to enable AI features.";
  }

  try {
    const chat = getChatSession();
    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble connecting to the SEO matrix right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection interrupted. Please try again later.";
  }
};