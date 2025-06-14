"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  BrainCircuit
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Custom animated icon component
  const LogoIcon = () => (
    <motion.div 
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 2 
      }}
      className="relative w-10 h-10 flex items-center justify-center"
    >
      {/* Base circle */}
      <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-purple-600 opacity-20" />
      
      {/* Pulsing rings */}
      <motion.div 
        animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeOut"
        }}
        className="absolute w-10 h-10 rounded-full border-2 border-[color:var(--color-primary)]"
      />
      
      {/* Inner icon */}
      <BrainCircuit className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500" />
    </motion.div>
  );

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Prediction", href: "/prediction" },
        { name: "White Paper", href: "/whitepaper" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact", href: "/contact" },
        { name: "Documentation", href: "/docs" },
        { name: "FAQ", href: "/faq" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/yourusername",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com/yourusername",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/in/yourusername",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:contact@neumoai.com",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative z-10 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(15,12,41,0.98)] backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <LogoIcon />
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500"
              >
                NeumoAI
              </motion.span>
            </Link>
            <p className="mt-4 text-gray-300 text-sm">
              Advanced AI for pneumonia detection from X-ray scans. Fast, accurate, and accessible healthcare technology.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((column, index) => (
            <div key={index} className="mt-4 md:mt-0">
              <h3 className="text-white font-medium text-lg mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500 mr-2" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            whileHover={{ scale: 1.02 }}
            className="text-gray-400 text-sm flex items-center"
          >
            <Heart className="w-4 h-4 text-pink-500 mr-1" fill="currentColor" />
            Crafted with care by Arnold Oduor
          </motion.p>
          
          <motion.p 
            whileHover={{ scale: 1.02 }}
            className="text-gray-400 text-sm mt-4 md:mt-0"
          >
            © {currentYear} NeumoAI. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[color:var(--color-primary)] to-transparent opacity-20"
        />
        <motion.div
          animate={{
            x: ["100%", "-100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
            delay: 5,
          }}
          className="absolute top-4 left-0 h-0.5 w-1/2 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"
        />
      </div>
    </motion.footer>
  );
};

export default Footer;