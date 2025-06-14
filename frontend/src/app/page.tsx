"use client";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  return (
    <AuthProvider>
      {/* Background container that spans the entire page */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a061f] to-[#3a00c8] opacity-90"></div>
        
        {/* Large floating circles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={`large-${i}`}
              className="absolute rounded-full bg-[#6a00ff]"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                animation: `float ${Math.random() * 30 + 20}s linear infinite`,
                filter: 'blur(10px)',
              }}
            />
          ))}
        </div>
        
        {/* Medium particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(10)].map((_, i) => (
            <div
              key={`medium-${i}`}
              className="absolute rounded-full bg-[#8a2be2]"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `float ${Math.random() * 25 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Small fast-moving particles */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={`small-${i}`}
              className="absolute rounded-full bg-[#9370db]"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.1,
                animation: `float ${Math.random() * 15 + 5}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        
        {/* Sparkles */}
        <div className="absolute inset-0 opacity-70">
          {[...Array(10)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute bg-white"
              style={{
                width: '2px',
                height: '2px',
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `sparkle ${Math.random() * 3 + 1}s ease-in-out infinite alternate`,
                boxShadow: '0 0 5px 1px white',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content container that scrolls over the fixed background */}
      <div className="relative z-10">
        <AnimatePresence>
          <Hero />
          <Features />
          <FAQ />
          <CTA />
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}