import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env.local file');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const generateResponse = async (prompt: string): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

export const generateChatTitle = async (firstMessage: string): Promise<string> => {
  if (!genAI) {
    return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate a short, descriptive title (max 4 words) for a chat that starts with: "${firstMessage}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().replace(/['"]/g, '').trim();
  } catch (error) {
    console.error('Error generating title:', error);
    return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
  }
};