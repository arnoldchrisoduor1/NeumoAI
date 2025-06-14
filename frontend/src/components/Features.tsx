"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Zap, ShieldCheck, Activity, BarChart2, Cpu, Sparkles } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "96% Diagnostic Accuracy",
      description: "Industry-leading precision in pneumonia detection, validated against clinical datasets",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Real-Time Analysis",
      description: "Get results in under 10 seconds, critical for emergency situations",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-500 to-amber-500"
    },
    {
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and patient data protection",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Continuous Learning",
      description: "Our models improve automatically with each new case analyzed",
      icon: <Activity className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Actionable Insights",
      description: "Detailed reports with confidence scores and clinical recommendations",
      icon: <BarChart2 className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Seamless Integration",
      description: "Works with your existing PACS and EHR systems",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/2 w-64 h-64 bg-pink-600/20 rounded-full filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>
      
      {/* Grid background pattern */}
      <div className="absolute inset-0 -z-20 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:60px_60px] bg-center"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-200 mb-4"
          >
            Why Choose NeumoAI?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Transforming medical imaging with cutting-edge AI that delivers both speed and accuracy
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                // backgroundImage: `linear-gradient(to right, ${feature.color.replace('from-', '').replace('to-', '').split(' ').map(c => `var(--tw-${c})`).join(', ')})`
              }}></div>
              
              <div className="relative h-full backdrop-blur-sm bg-[rgba(15,12,41,0.6)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 overflow-hidden group-hover:border-[rgba(255,255,255,0.2)] transition-all duration-300">
                {/* Floating gradient dot */}
                <div className={`absolute -top-4 -right-4 w-32 h-32 rounded-full bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-gradient-to-br ${feature.color} shadow-md`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300 mb-2">10K+</div>
              <div className="text-gray-300">Images Analyzed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300 mb-2">96%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300 mb-2">10s</div>
              <div className="text-gray-300">Average Analysis Time</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300 mb-2">24/7</div>
              <div className="text-gray-300">Availability</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;