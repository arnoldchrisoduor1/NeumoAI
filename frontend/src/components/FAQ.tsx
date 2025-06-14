"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How accurate is NeumoAI's pneumonia detection?",
      answer: "Our current model achieves 96% accuracy on test data, validated against a diverse dataset of chest X-rays. We continuously improve the model through ongoing training with new data."
    },
    {
      question: "What types of medical images does NeumoAI support?",
      answer: "Currently, we specialize in analyzing chest X-rays (CXR) for pneumonia detection. We're expanding to support CT scans and other imaging modalities in future updates."
    },
    {
      question: "How does NeumoAI handle patient data privacy?",
      answer: "We adhere to HIPAA and GDPR compliance standards. All medical images are anonymized before processing, and we never store personally identifiable information without explicit consent."
    },
    {
      question: "Can NeumoAI integrate with existing hospital systems?",
      answer: "Yes, we offer API integration with most major PACS (Picture Archiving and Communication Systems) and EHR (Electronic Health Record) platforms. Our team can assist with implementation."
    },
    {
      question: "What's the typical processing time for an image analysis?",
      answer: "Our AI typically processes and returns results in under 10 seconds per image, depending on server load and image resolution. Batch processing is available for large datasets."
    },
    {
      question: "Do you offer customization for specific clinical needs?",
      answer: "Absolutely. We can fine-tune our models for specific patient populations or clinical requirements. Contact our team to discuss custom implementation options."
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center mb-6"
        >
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300 mb-4"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Everything you need to know about NeumoAI. Can't find an answer? Contact our team.
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-purple-300" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-300">
                      <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Additional CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-gray-300 mb-6">Still have questions?</p>
        <a
          href="#contact"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          Contact Our Team <ArrowRight className="w-5 h-5 ml-2" />
        </a>
      </motion.div>
    </motion.section>
  );
};

export default FAQ;