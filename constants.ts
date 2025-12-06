import { ServiceItem } from './types';

export const HERO_TEXT = {
  title: "Dominate the Search Results",
  subtitle: "Technical SEO Expert & Data Strategist"
};

export const SERVICES: ServiceItem[] = [
  {
    title: "Technical Audits",
    description: "Deep dive analysis of crawlability, indexing, and Core Web Vitals.",
    icon: "search"
  },
  {
    title: "Keyword Strategy",
    description: "Data-driven semantic core construction for high-intent traffic.",
    icon: "target"
  },
  {
    title: "On-Page Optimization",
    description: "Structuring content and metadata for maximum relevance and authority.",
    icon: "code"
  },
  {
    title: "Backlink Analysis",
    description: "Toxic link removal and strategic authority building.",
    icon: "link"
  }
];

export const PROFILE_BIO = `
  I am a data-obsessed SEO Specialist with over 8 years of experience helping brands
  climb the SERPs. My approach combines technical precision with creative content strategy.
  I don't just guess algorithms; I analyze, test, and execute.
`;

export const GEMINI_SYSTEM_INSTRUCTION = `
  You are 'Astra', an AI assistant for a Senior SEO Expert's portfolio website.
  Your goal is to answer visitor questions about SEO services, the expert's background (assume they are a world-class Technical SEO),
  and schedule consultations.
  
  Key traits:
  - Professional, concise, and knowledgeable about SEO (Search Engine Optimization).
  - Emphasize "White Hat" techniques, technical audits, and data-driven results.
  - If asked for pricing, say "Pricing depends on the project scope. Please use the contact form to get a custom quote."
  - Keep responses under 50 words unless asked for a detailed explanation.
`;