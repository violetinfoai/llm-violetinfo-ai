import React from 'react';
import { CheckCircle, Cpu, Zap, Globe } from 'lucide-react';

const models = [
  {
    name: 'GPT-4 Turbo',
    category: 'General Purpose',
    features: ['128k context', 'Multimodal', 'Function calling'],
    performance: '95%',
    icon: Cpu
  },
  {
    name: 'Claude-3 Sonnet',
    category: 'Reasoning',
    features: ['200k context', 'Code generation', 'Analysis'],
    performance: '92%',
    icon: Zap
  },
  {
    name: 'Llama 2 70B',
    category: 'Open Source',
    features: ['4k context', 'Fine-tunable', 'Commercial use'],
    performance: '88%',
    icon: Globe
  }
];

const ModelShowcase = () => {
  return (
    <section id="models" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Supported AI Models
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from a variety of state-of-the-art language models, 
            each optimized for different use cases and performance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <div 
              key={index}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-lg">
                  <model.icon className="h-6 w-6 text-white" />
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {model.performance} accuracy
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {model.name}
              </h3>
              <p className="text-green-600 font-medium mb-4">
                {model.category}
              </p>

              <div className="space-y-3 mb-6">
                {model.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
                Try {model.name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need a Custom Model?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              We can fine-tune models for your specific use case or deploy custom architectures 
              to meet your unique requirements.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelShowcase;