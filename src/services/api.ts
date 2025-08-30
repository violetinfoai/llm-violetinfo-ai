const API_BASE_URL = 'http://localhost:3001/api';

export interface ChatResponse {
  response: string;
}

export interface TitleResponse {
  title: string;
}

export interface HealthResponse {
  status: string;
  apiConfigured: boolean;
}

export const generateResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate response');
    }

    const data: ChatResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling chat API:', error);
    throw error;
  }
};

export const generateChatTitle = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-title`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate title');
    }

    const data: TitleResponse = await response.json();
    return data.title;
  } catch (error) {
    console.error('Error generating title:', error);
    return message.slice(0, 30) + (message.length > 30 ? '...' : '');
  }
};

export const checkApiHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    return { status: 'error', apiConfigured: false };
  }
};