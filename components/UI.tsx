import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

// -----------------------------------------------------------------------------
// BLASTER SUCCESS ANIMATION (FIXED UI)
// -----------------------------------------------------------------------------
const BlasterSuccess = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      
      <div className="relative flex flex-col items-center justify-center text-center">
        {/* Shockwave Rings */}
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full border-4 border-yellow-500/50"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full border-2 border-blue-500/50"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
        />

        {/* Particles Explosion */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-16 bg-gradient-to-t from-yellow-400 to-transparent"
            initial={{ height: 0, y: 0, opacity: 0 }}
            animate={{ 
              height: [0, 100, 0], 
              y: [0, -200], 
              opacity: [1, 1, 0],
              rotate: i * 30 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}

        {/* Success Icon & Text */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1.5, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="relative z-10 text-yellow-400 mb-8"
        >
          <CheckCircle className="w-24 h-24 fill-current text-black" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          // Explicitly solid colors with drop-shadow to fix "No font give correctly" issue
          className="relative z-10 text-4xl md:text-6xl font-black text-yellow-400 tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}
        >
          THANK YOU FOR<br/>YOUR FEEDBACK!
        </motion.h2>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const scrollToSection = (index: number) => {
    // Dispatch a custom event that the Scene component will listen to
    const event = new CustomEvent('navigate-to-section', { detail: index });
    window.dispatchEvent(event);
  };

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-auto"
    >
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl flex justify-between items-center px-6">
        {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
          <button
            key={item}
            onClick={() => scrollToSection(index)}
            className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-all"
          >
            {item}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export const UI: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleFeedbackSuccess = () => setShowSuccess(true);
    window.addEventListener('feedback-success', handleFeedbackSuccess);
    return () => window.removeEventListener('feedback-success', handleFeedbackSuccess);
  }, []);

  return (
    <>
      <Navbar />
      <ChatWidget />
      <AnimatePresence>
        {showSuccess && <BlasterSuccess onComplete={() => setShowSuccess(false)} />}
      </AnimatePresence>
    </>
  );
};