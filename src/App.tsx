import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Settings, User, Bot, Menu, X, Trash2, Key, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const App = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Welcome to VioletAI',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m VioletAI, your intelligent assistant. How can I help you today?',
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date()
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    if (apiKey) {
      testApiKey(apiKey);
    }
  }, []);

  const testApiKey = async (key: string) => {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      await model.generateContent('Hello');
      setApiKeyStatus('valid');
    } catch (error) {
      setApiKeyStatus('invalid');
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      testApiKey(apiKey);
      setShowAdminPanel(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastUpdated: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    if (chats.length === 1) return;
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats.find(chat => chat.id !== chatId)?.id || '');
    }
  };

  const generateChatTitle = async (message: string): Promise<string> => {
    if (!apiKey || apiKeyStatus !== 'valid') {
      return message.slice(0, 30) + (message.length > 30 ? '...' : '');
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Generate a short, descriptive title (max 4 words) for a chat that starts with: "${message}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().replace(/['"]/g, '').trim();
    } catch (error) {
      return message.slice(0, 30) + (message.length > 30 ? '...' : '');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const isFirstMessage = currentChat?.messages.length === 0;
    const messageContent = input;

    // Update current chat with user message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            title: isFirstMessage ? 'New Chat' : chat.title,
            lastUpdated: new Date()
          }
        : chat
    ));

    setInput('');
    setIsLoading(true);

    try {
      let aiResponse = '';
      
      if (apiKey && apiKeyStatus === 'valid') {
        // Use real Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(messageContent);
        const response = await result.response;
        aiResponse = response.text();
      } else {
        // Fallback response when no API key
        aiResponse = "I'm currently running in demo mode. Please configure your Gemini API key in the admin panel to get real AI responses.";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      // Generate title for first message
      let chatTitle = '';
      if (isFirstMessage) {
        chatTitle = await generateChatTitle(messageContent);
      }

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, assistantMessage],
              title: isFirstMessage ? chatTitle : chat.title,
              lastUpdated: new Date()
            }
          : chat
      ));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please check your API key configuration and try again.',
        timestamp: new Date()
      };

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, errorMessage],
              lastUpdated: new Date()
            }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              </div>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  apiKeyStatus === 'valid' ? 'bg-green-500' : 
                  apiKeyStatus === 'invalid' ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-sm text-gray-400">
                  {apiKeyStatus === 'valid' ? 'API Key Valid' : 
                   apiKeyStatus === 'invalid' ? 'API Key Invalid' : 'No API Key'}
                </span>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveApiKey}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Key</span>
                </button>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors text-sm font-medium"
                >
                  Get API Key
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900 border-r border-amber-500/20 text-white flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-amber-500/20">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-4 py-3 rounded-lg transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentChatId === chat.id ? 'bg-amber-900/30 border border-amber-500/30' : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4 text-amber-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-400">{formatTime(chat.lastUpdated)}</p>
                </div>
              </div>
              
              {chats.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-amber-600/20 rounded transition-all"
                >
                  <Trash2 className="h-3 w-3 text-amber-400" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-amber-500/20 space-y-2">
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Key className="h-4 w-4 text-amber-400" />
            <span>Admin Panel</span>
            <div className={`ml-auto w-2 h-2 rounded-full ${
              apiKeyStatus === 'valid' ? 'bg-green-500' : 'bg-amber-500'
            }`}></div>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <Settings className="h-4 w-4 text-amber-400" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <User className="h-4 w-4 text-amber-400" />
            <span>Account</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-amber-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                VioletAI
              </h1>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {currentChat?.title}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {currentChat?.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to VioletAI</h2>
                <p className="text-gray-400 mb-6">
                  Start a conversation with our advanced AI assistant. Ask questions, get help with tasks, or just chat!
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setInput("What can you help me with?")}
                    className="block w-full text-left p-3 bg-gray-800 hover:bg-gray-700 border border-amber-500/20 rounded-lg transition-colors text-sm text-white"
                  >
                    "What can you help me with?"
                  </button>
                  <button
                    onClick={() => setInput("Explain machine learning in simple terms")}
                    className="block w-full text-left p-3 bg-gray-800 hover:bg-gray-700 border border-amber-500/20 rounded-lg transition-colors text-sm text-white"
                  >
                    "Explain machine learning in simple terms"
                  </button>
                  <button
                    onClick={() => setInput("Help me write a professional email")}
                    className="block w-full text-left p-3 bg-gray-800 hover:bg-gray-700 border border-amber-500/20 rounded-lg transition-colors text-sm text-white"
                  >
                    "Help me write a professional email"
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {currentChat?.messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600' 
                        : 'bg-gray-700 border border-amber-500/20'
                    }`}>
                      {message.role === 'user' ? 
                        <User className="h-4 w-4 text-white" /> : 
                        <Bot className="h-4 w-4 text-amber-400" />
                      }
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' 
                        : 'bg-gray-800 border border-amber-500/20 text-gray-100'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-amber-200' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gray-700 border border-amber-500/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-800 border border-amber-500/20">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-amber-500/20 bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Message VioletAI..."
                  className="w-full px-4 py-3 pr-12 bg-black border border-amber-500/30 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none max-h-32 min-h-[48px] text-white placeholder-gray-500"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-2 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              VioletAI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;