import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Pause, Volume2 } from 'lucide-react';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20"></div>
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/30 to-violet-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 10}px`,
            top: `${mousePosition.y / 10}px`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl flex items-center justify-center animate-spin-slow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AestheticUI</h1>
                <p className="text-gray-400 text-sm">Dynamic Experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white font-mono text-lg bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                {formatTime(currentTime)}
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            <div className="mb-8">
              <div className="inline-block">
                <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-gradient-x mb-6">
                  DYNAMIC
                </h2>
                <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient-x rounded-full"></div>
              </div>
            </div>

            <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed">
              Experience the future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-semibold"> interactive design</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <span>Explore Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg backdrop-blur-sm hover:border-white/50 hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Fluid Motion', desc: 'Smooth animations', color: 'from-red-500 to-orange-500' },
                { title: 'Responsive', desc: 'Adaptive layouts', color: 'from-blue-500 to-cyan-500' },
                { title: 'Interactive', desc: 'Engaging elements', color: 'from-green-500 to-emerald-500' }
              ].map((card, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl mb-4 flex items-center justify-center`}>
                      <Volume2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-gray-400">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <footer className="p-6">
          <div className="flex justify-center">
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              {['Home', 'About', 'Work', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    index === 0 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Cursor Follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
    </div>
  );
};

export default App;