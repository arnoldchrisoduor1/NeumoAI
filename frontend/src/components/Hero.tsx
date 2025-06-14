"use client";

import { motion, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { 
  BrainCircuit, 
  Pause, 
  ScanEye, 
  Activity,
  ArrowRight,
  ChevronsDown
} from 'lucide-react';
import { cn } from "@/lib/utils";

const Hero = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => {
    return pos === 1 ? "relative" : "fixed";
  });

  const particles = Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 5 + 2;
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2
    };
  });

  return (
    <section 
      ref={targetRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#2a0845] to-[#4a00e0]"
      style={{ height: '100dvh' }} // Use dynamic viewport height
    >
      {/* Background elements (same as before) */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [0, -100],
              x: [0, (Math.random() - 0.5) * 50]
            }}
            transition={{
              delay: particle.delay,
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-300"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
          />
        ))}
      </div>

      {/* Pulsing grid background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:100px_100px]">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.2 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:100px_100px] opacity-50"
          />
        </div>
      </div>

      {/* Floating neural network nodes */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => {
          const size = Math.random() * 40 + 20;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const delay = Math.random() * 2;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [0.5, 1.2]
              }}
              transition={{
                delay,
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
              className="absolute rounded-full border border-purple-400/30"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`,
                boxShadow: `0 0 20px ${size / 10}px rgba(110, 69, 226, 0.2)`
              }}
            />
          );
        })}
      </div>

      {/* X-ray scan animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('/lung-scan.png')] bg-contain bg-center bg-no-repeat mix-blend-lighten"
      />

      {/* Scrollable content container */}
      <div className="h-full overflow-y-auto">
        <motion.div 
          style={{ opacity, scale, position }}
          className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 py-10"
          >
            {/* Animated tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-500/30 border border-purple-400/20 backdrop-blur-sm">
                <Pause className="w-5 h-5 text-purple-300 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-purple-100">
                  Medical AI Revolution
                </span>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-purple-400">
                AI-Powered Pneumonia
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Detection System
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            >
              Leveraging deep learning to analyze chest X-rays with <span className="font-semibold text-purple-300">96% accuracy</span>, 
              helping clinicians detect pneumonia faster and more accurately.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <button className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold overflow-hidden group">
                <a href="/prediction" className="relative z-10 flex items-center">
                  Try Live Demo <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <motion.span
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 400, opacity: 0.4 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-0 left-0 w-20 h-full bg-white/30 skew-x-12"
                />
              </button>

              <a href="/whitepaper" className="px-8 py-3.5 rounded-xl border-2 border-purple-400/30 bg-purple-900/20 text-purple-100 font-semibold backdrop-blur-sm hover:border-purple-400/50 transition-all">
                Read White Paper
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16"
            >
              {[
                { value: "96%", label: "Accuracy", icon: <Activity className="w-5 h-5" /> },
                { value: "<1s", label: "Analysis Time", icon: <ScanEye className="w-5 h-5" /> },
                { value: "12-Layer", label: "CNN Model", icon: <BrainCircuit className="w-5 h-5" /> },
                { value: "24/7", label: "Availability", icon: <Pause className="w-5 h-5" /> }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "p-4 rounded-xl border border-purple-400/20 bg-gradient-to-b from-purple-900/30 to-transparent backdrop-blur-sm",
                    i % 2 === 0 ? "text-blue-300" : "text-purple-300"
                  )}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-500/30 mr-2">
                      {stat.icon}
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <span className="text-sm text-gray-300">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center">
              <ChevronsDown className="w-6 h-6 text-purple-300 animate-bounce" />
              <span className="text-sm text-purple-200 mt-1">Scroll to explore</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;