import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiConfigured: !!process.env.GEMINI_API_KEY 
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Generate chat title endpoint
app.post('/api/generate-title', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!genAI) {
      const fallbackTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
      return res.json({ title: fallbackTitle });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate a short, descriptive title (max 4 words) for a chat that starts with: "${message}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const title = response.text().replace(/['"]/g, '').trim();

    res.json({ title });
  } catch (error) {
    console.error('Error generating title:', error);
    const fallbackTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
    res.json({ title: fallbackTitle });
  }
});

app.listen(PORT, () => {
  console.log(`VioletAI Backend running on port ${PORT}`);
  console.log(`API configured: ${!!process.env.GEMINI_API_KEY}`);
});