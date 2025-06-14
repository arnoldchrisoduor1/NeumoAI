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
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                {/* Animated background elements */}
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-[color:var(--color-primary)]"
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1,
                      animation: `float ${Math.random() * 20 + 10}s linear infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
    
            <AnimatePresence mode="wait">
              <Hero />
              <Features />
              <FAQ/>
              <CTA/>
            </AnimatePresence>
          </div>
        </AuthProvider>
  );
}
