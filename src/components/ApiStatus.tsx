import React from 'react';
import { AlertCircle, Server } from 'lucide-react';

const ApiStatus = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-amber-800 font-semibold mb-2">Backend API Configuration Required</h3>
          <p className="text-amber-700 text-sm mb-4">
            To use VioletAI with real AI responses, the backend server needs to be configured with your Gemini API key.
          </p>
          
          <div className="bg-amber-100 rounded-lg p-4 mb-4">
            <h4 className="text-amber-800 font-medium mb-2 flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Backend Setup Instructions:
            </h4>
            <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
              <li>Get your Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
              <li>Open the <code className="bg-amber-200 px-1 rounded">.env</code> file in the project root</li>
              <li>Replace <code className="bg-amber-200 px-1 rounded">your_gemini_api_key_here</code> with your actual API key</li>
              <li>Start the backend server by running <code className="bg-amber-200 px-1 rounded">node server/index.js</code> in a new terminal</li>
              <li>Refresh this page to connect to the backend</li>
            </ol>
          </div>
          
          <div className="text-xs text-amber-600">
            <strong>Note:</strong> The API key will be stored securely on the backend server and never exposed to the frontend.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus;