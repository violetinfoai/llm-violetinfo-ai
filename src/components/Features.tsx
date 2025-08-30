import React from 'react';
import { Zap, Shield, Globe, Code, Brain, Cpu } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get responses in milliseconds with our optimized inference infrastructure.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with end-to-end encryption and privacy protection.'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Deploy worldwide with our distributed network of AI compute nodes.'
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Simple APIs, extensive documentation, and SDKs for popular languages.'
  },
  {
    icon: Brain,
    title: 'Multiple Models',
    description: 'Access various LLM architectures optimized for different use cases.'
  },
  {
    icon: Cpu,
    title: 'High Performance',
    description: 'State-of-the-art hardware acceleration for maximum throughput.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for developers, enterprises, and researchers who need reliable, 
            scalable access to cutting-edge language models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-lg w-fit mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;