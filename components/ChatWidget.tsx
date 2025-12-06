import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Linkedin, Instagram, Share2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, LoadingState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

// Custom WhatsApp Icon Component for brand accuracy
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const SocialButton = ({ href, icon: Icon, delay, color }: { href: string; icon: any; delay: number; color?: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20, scale: 0.5 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.5 }}
    transition={{ delay, duration: 0.2 }}
    className={`w-10 h-10 rounded-full bg-black border border-[#FFD700] text-[#FFD700] flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors shadow-lg shadow-[#FFD700]/20 ${color}`}
  >
    <Icon className="w-5 h-5" />
  </motion.a>
);

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSocialHovered, setIsSocialHovered] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm Astra. Ask me anything about SEO!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading === LoadingState.LOADING) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(LoadingState.LOADING);

    const responseText = await sendMessageToGemini(input);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(LoadingState.IDLE);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-4 pointer-events-auto">
      
      {/* Container for Social Hub and AI Toggle */}
      <div className="flex items-end gap-4">
        
        {/* Call Button */}
        <motion.a
          href="tel:+15551234567"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-black border-2 border-[#FFD700] text-[#FFD700] flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)] z-10 cursor-pointer"
        >
          <Phone className="w-5 h-5" />
        </motion.a>

        {/* Social Media Hub */}
        <div 
          className="relative flex flex-col items-center gap-2"
          onMouseEnter={() => setIsSocialHovered(true)}
          onMouseLeave={() => setIsSocialHovered(false)}
        >
          {/* Expanded Buttons */}
          <AnimatePresence>
            {isSocialHovered && (
              <div className="absolute bottom-full mb-3 flex flex-col gap-3">
                <SocialButton href="https://linkedin.com" icon={Linkedin} delay={0.2} />
                <SocialButton href="https://instagram.com" icon={Instagram} delay={0.1} />
                {/* WhatsApp Button with Custom Icon */}
                <SocialButton href="https://wa.me/15551234567" icon={WhatsAppIcon} delay={0} />
              </div>
            )}
          </AnimatePresence>

          {/* Main Social Trigger Button */}
          <motion.div
            className="w-12 h-12 rounded-full bg-black border-2 border-[#FFD700] text-[#FFD700] flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)] z-10 cursor-pointer"
            animate={{ scale: isSocialHovered ? 1.1 : 1 }}
          >
            <Share2 className="w-5 h-5" />
          </motion.div>
        </div>

        {/* AI Chat Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors border-2 ${
            isOpen 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-blue-600 border-blue-400 text-white shadow-blue-500/30'
          }`}
          title="AI Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 mb-2 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            style={{ height: '500px' }}
          >
            {/* Header - Label Text Removed as requested */}
            <div className="bg-gradient-to-r from-blue-700 to-purple-800 p-3 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {/* Hidden Label to prevent obstruction */}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/80 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading === LoadingState.LOADING && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Astra..."
                className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading === LoadingState.LOADING || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};