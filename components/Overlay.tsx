import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HERO_TEXT, PROFILE_BIO, SERVICES } from '../constants';
import { LucideIcon, Search, Target, Code, Link as LinkIcon, MapPin, Mail, Phone, ChevronDown, Star, MessageSquare, RotateCcw, ArrowLeft } from 'lucide-react';

// Icon mapping
const IconMap: Record<string, LucideIcon> = {
  search: Search,
  target: Target,
  code: Code,
  link: LinkIcon
};

// Section now takes a 'page' index to position itself absolutely
const Section = ({ children, page, className = "" }: { children?: React.ReactNode; page: number; className?: string }) => (
  <section 
    className={`absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center p-8 overflow-hidden ${className}`}
    style={{ top: `${page * 100}vh` }}
  >
    {children}
  </section>
);

interface ContactCardProps {
  onFeedbackSuccess?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  
  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${contactForm.name}! Your audit request has been sent to the SEO Matrix.`);
    setContactForm({ name: '', email: '', message: '' });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch global event for the Fixed UI to pick up
    window.dispatchEvent(new Event('feedback-success'));
    setFeedbackRating(0);
    setFeedbackText('');
    setIsFlipped(false);
  };

  return (
    <div className="perspective-1000 w-full max-w-4xl h-[600px] relative group pointer-events-auto">
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT FACE: Contact Details */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'none' : 'auto'
          }}
        >
          <div className="w-full h-full bg-black/80 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-white/10 flex flex-col justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-4xl font-bold text-white tracking-tight">Start Your Ascent</h2>
              <button 
                onClick={() => setIsFlipped(true)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-500/30 hover:bg-blue-900/50"
              >
                <MessageSquare className="w-4 h-4" /> Give Feedback
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-blue-300">Contact Details</h3>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Headquarters</p>
                    <p className="text-gray-400">123 Algorithm Ave, Tech Valley, CA</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-gray-400">audit@seomaster.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                   <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500 backdrop-blur-sm" 
                    placeholder="Name" 
                    required 
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500 backdrop-blur-sm" 
                    placeholder="Email" 
                    required 
                  />
                </div>
                <div>
                  <textarea 
                    rows={3} 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500 backdrop-blur-sm" 
                    placeholder="Message"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02]">
                  Request Audit
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BACK FACE: Feedback Form */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            transform: 'rotateY(180deg)', 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'auto' : 'none'
          }}
        >
          <div className="w-full h-full bg-black/95 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-yellow-500/20 flex flex-col justify-center items-center text-center shadow-[0_0_50px_rgba(255,215,0,0.1)]">
            <div className="absolute top-8 right-8">
              <button 
                onClick={() => setIsFlipped(false)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Back
              </button>
            </div>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              <Star className="w-16 h-16 text-yellow-400 mb-6 fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-4 text-white">We Value Your Feedback</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              How was your experience exploring our cosmic portfolio? Your insights help us improve our trajectory.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="w-full max-w-md space-y-4">
               <div className="flex justify-center gap-4 mb-4">
                 {[1,2,3,4,5].map(star => (
                   <button 
                    key={star} 
                    type="button" 
                    onClick={() => setFeedbackRating(star)}
                    className="hover:scale-110 transition-transform focus:outline-none group"
                   >
                     <Star 
                      className={`w-8 h-8 transition-colors ${star <= feedbackRating ? 'text-yellow-400 fill-current' : 'text-gray-700 group-hover:text-yellow-400/50'}`} 
                     />
                   </button>
                 ))}
               </div>
               <textarea 
                  rows={4} 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none placeholder-gray-600 backdrop-blur-sm" 
                  placeholder="Share your thoughts..."
                  required
               ></textarea>
               
               <div className="flex gap-4">
                 <button 
                    type="button" 
                    onClick={() => setIsFlipped(false)}
                    className="flex-1 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg border border-gray-600 transition-colors flex items-center justify-center gap-2"
                 >
                    <ArrowLeft className="w-4 h-4" /> Back
                 </button>
                 <button type="submit" className="flex-[2] bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-500/20">
                    Submit Feedback
                 </button>
               </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Overlay: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      {/* Hero Section (Page 0) */}
      <Section page={0} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-purple-600 mb-6 drop-shadow-2xl">
            {HERO_TEXT.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
            {HERO_TEXT.subtitle}
          </p>
          <div className="mt-12 animate-bounce">
            <ChevronDown className="w-10 h-10 text-blue-400 mx-auto opacity-70" />
          </div>
        </motion.div>
      </Section>

      {/* Profile Section (Page 1) */}
      <Section page={1}>
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-black/40 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            {/* Image Holder for SEO Profile */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              <img 
                src="https://picsum.photos/800/800?grayscale" 
                alt="SEO Expert Profile" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-xl opacity-60"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-purple-500 rounded-br-xl opacity-60"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-blue-400">About The Expert</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {PROFILE_BIO}
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-sm text-blue-300">
                Google Certified
              </div>
              <div className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                Tech SEO Pro
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Services Section (Page 2) */}
      <Section page={2}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl"
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Core Competencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = IconMap[service.icon];
              return (
                <div key={index} className="p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl hover:border-blue-500 transition-colors duration-300 group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{service.title}</h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Section>

      {/* Contact Section (Page 3) */}
      <Section page={3} className="pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-center"
        >
          <ContactCard />
        </motion.div>
      </Section>
    </div>
  );
};