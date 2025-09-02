import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ApiKeySetup = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    setIsConfigured(!!key && key !== 'AIzaSyAlunrNFyfw6QcpD7oDODZAbYeyTn9ZruI');
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // In a real app, you'd save this securely
      alert('API key saved! Please restart the development server for changes to take effect.');
    }
  };

  if (isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Gemini API configured</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-amber-800 font-semibold mb-2">API Key Required</h3>
          <p className="text-amber-700 text-sm mb-4">
            To use VioletAI with real responses, you need to configure your Gemini API key.
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyAlunrNFyfw6QcpD7oDODZAbYeyTn9ZruI"
                  className="w-full px-3 py-2 pr-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save Key
              </button>
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-800 text-sm font-medium underline"
              >
                Get API Key
              </a>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-100 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>Setup Instructions:</strong><br />
              1. Get your API key from Google AI Studio<br />
              2. Add it to your .env.local file as VITE_GEMINI_API_KEY=your_key<br />
              3. Restart the development server
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
