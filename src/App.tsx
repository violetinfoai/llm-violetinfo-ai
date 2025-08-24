import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ChatDemo from './components/ChatDemo';
import ModelShowcase from './components/ModelShowcase';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100">
      <Header />
      <Hero />
      <Features />
      <ChatDemo />
      <ModelShowcase />
      <Footer />
    </div>
  );
}

export default App;