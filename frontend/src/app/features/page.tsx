"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Zap, 
  Shield, 
  Cpu, 
  Database, 
  Code2, 
  Cloud, 
  Bell, 
  BarChart2,
  Smartphone,
  Server,
  Clock,
  Calendar,
  Users
} from "lucide-react";

const Features = () => {
  const currentFeatures = [
    {
      title: "Pneumonia Detection",
      description: "Advanced CNN model with 96% accuracy in detecting pneumonia from chest X-rays",
      icon: <Activity className="w-6 h-6 text-green-400" />
    },
    {
      title: "Real-time Analysis",
      description: "Process and analyze medical images in under 10 seconds",
      icon: <Zap className="w-6 h-6 text-yellow-400" />
    },
    {
      title: "Data Privacy Compliance",
      description: "HIPAA and GDPR compliant processing with automatic anonymization",
      icon: <Shield className="w-6 h-6 text-blue-400" />
    },
    {
      title: "AI Explainability",
      description: "Visual heatmaps showing the model's focus areas for transparent decision-making",
      icon: <Cpu className="w-6 h-6 text-purple-400" />
    },
    {
      title: "DICOM Support",
      description: "Native support for standard medical imaging formats including DICOM",
      icon: <Database className="w-6 h-6 text-red-400" />
    },
    {
      title: "Developer API",
      description: "RESTful API for custom integrations and automation workflows",
      icon: <Code2 className="w-6 h-6 text-pink-400" />
    }
  ];

  const upcomingFeatures = [
    {
      title: "Hospital System Integration",
      description: "Seamless integration with PACS and EHR systems (Coming Q3 2025)",
      icon: <Server className="w-6 h-6 text-indigo-400" />,
      status: "In Development"
    },
    {
      title: "Multi-Disease Detection",
      description: "Expanding to detect tuberculosis, lung cancer, and COVID-19 (Coming Q4 2025)",
      icon: <Users className="w-6 h-6 text-teal-400" />,
      status: "Research Phase"
    },
    {
      title: "Mobile App",
      description: "iOS and Android apps for point-of-care diagnostics (Coming Q1 2026)",
      icon: <Smartphone className="w-6 h-6 text-cyan-400" />,
      status: "Planned"
    },
    {
      title: "Predictive Analytics",
      description: "Disease progression tracking and risk prediction (Coming Q2 2026)",
      icon: <BarChart2 className="w-6 h-6 text-orange-400" />,
      status: "Research Phase"
    },
    {
      title: "Cloud Processing",
      description: "High-volume batch processing for large medical facilities (Coming Q3 2025)",
      icon: <Cloud className="w-6 h-6 text-blue-300" />,
      status: "Planned"
    },
    {
      title: "Alert System",
      description: "Critical findings notification system for urgent cases (Coming Q4 2025)",
      icon: <Bell className="w-6 h-6 text-red-300" />,
      status: "Planned"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0c29] to-[#2a0845] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300 mb-4">
            NeumoAI Features
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powerful AI diagnostics today, with more capabilities coming soon
          </p>
        </div>

        {/* Current Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-8 text-center">
            Current Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFeatures.map((feature, index) => (
              <motion.div
                key={`current-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-500/30 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="mb-20">
          <div className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 text-center">
              Coming Soon
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-10">
              We're constantly expanding NeumoAI's capabilities to serve more clinical needs. 
              Here's what our engineering and research teams are working on next.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={`upcoming-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[rgba(110,69,226,0.15)] to-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full bg-purple-900/50 text-purple-300">
                    {feature.status}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-500/30 mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-3">{feature.description}</p>
                  <div className="flex items-center text-sm text-purple-300 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{feature.title.includes("Coming") ? feature.title.match(/\(Coming (.*?)\)/)?.[1] : feature.description.match(/\(Coming (.*?)\)/)?.[1]}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Development Timeline */}
        <section className="mb-20">
          <div className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-8 text-center">
              Development Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 md:left-1/2 md:-ml-0.5"></div>
              
              {/* Timeline items */}
              <div className="space-y-8">
                {[
                  {
                    date: "Q3 2025",
                    title: "Hospital Integration Release",
                    description: "API integration with major PACS and EHR systems",
                    icon: <Server className="w-5 h-5 text-white" />
                  },
                  {
                    date: "Q4 2025",
                    title: "Multi-Disease Detection",
                    description: "Expanding beyond pneumonia to other pulmonary diseases",
                    icon: <Users className="w-5 h-5 text-white" />
                  },
                  {
                    date: "Q1 2026",
                    title: "Mobile Applications Launch",
                    description: "iOS and Android apps for field diagnostics",
                    icon: <Smartphone className="w-5 h-5 text-white" />
                  },
                  {
                    date: "Q2 2026",
                    title: "Predictive Analytics",
                    description: "Disease progression and treatment response tracking",
                    icon: <BarChart2 className="w-5 h-5 text-white" />
                  }
                ].map((item, index) => (
                  <motion.div
                    key={`timeline-${index}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}
                  >
                    <div className={`flex items-center ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {index % 2 === 0 && (
                        <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg mr-4">
                          {item.icon}
                        </div>
                      )}
                      <div className={`${index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'} order-1 md:w-5/12`}>
                        <div className="text-sm font-semibold text-purple-300">{item.date}</div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <p className="text-gray-300">{item.description}</p>
                      </div>
                      {index % 2 !== 0 && (
                        <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg ml-4">
                          {item.icon}
                        </div>
                      )}
                    </div>
                    {/* Mobile dot */}
                    <div className="absolute top-1 left-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg flex items-center justify-center md:hidden">
                      {item.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 mb-6">
            Want Early Access to New Features?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join our beta program to test upcoming capabilities before general release.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:cursor-pointer">
            Beta Access Coming Soon
          </button>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-400">
          {/* <p>© {new Date().getFullYear()} NeumoAI. Created by Arnold Oduor.</p> */}
          <p className="mt-2">Features and timeline subject to change based on development progress.</p>
        </footer>
      </div>
    </motion.div>
  );
};

export default Features;