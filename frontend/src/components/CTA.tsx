"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket, Zap } from "lucide-react";

const CTA = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative overflow-hidden my-20"
    >
      {/* Background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div> */}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-gradient-to-br from-[rgba(15,12,41,0.7)] to-[rgba(42,8,69,0.7)] border border-[rgba(255,255,255,0.1)] rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 pointer-events-none"></div>
          
          <div className="px-8 py-12 sm:p-16">
            <div className="text-center">
              {/* Animated icon */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center justify-center mb-6"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 shadow-lg shadow-purple-500/30">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-200 mb-6"
              >
                Ready to Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">AI-Powered</span> Diagnostics?
              </motion.h2>
              
              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
              >
                Join the future of medical imaging analysis with NeumoAI. Our platform delivers accurate, fast, and reliable pneumonia detection at scale.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <a
                  href="/authentication"
                  className="relative group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center text-white font-medium">
                    Get Started for Free <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                
                <a
                  href="/prediction"
                  className="relative group flex items-center justify-center px-8 py-4 bg-transparent border border-[rgba(255,255,255,0.2)] rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 border border-transparent group-hover:border-[rgba(255,255,255,0.1)] transition-all duration-300"></span>
                  <span className="relative z-10 flex items-center text-white font-medium">
                    <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                    Request Demo
                  </span>
                </a>
              </motion.div>
              
              {/* Small text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-gray-400 mt-8"
              >
                No credit card required. 14-day free trial.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTA;