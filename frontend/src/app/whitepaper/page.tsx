"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Code, FlaskConical, LineChart, Layers } from "lucide-react";

const WhitePaper = () => {
  const phases = [
    {
      title: "Phase 1: Baseline Model (64% Accuracy)",
      description: "Started with a simple CNN architecture—just convolutional, pooling, and dense layers. While it learned, the accuracy plateaued at 64%, showing clear underfitting.",
      link: "https://lnkd.in/d2su33FA",
      icon: <Code className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Phase 2: Image Augmentation (76% Accuracy)",
      description: "Introduced image augmentation (rotations, flips, zooms) in the data loader. This boosted accuracy to 76% by creating more varied training samples.",
      link: "https://lnkd.in/dJsAfu_S",
      icon: <Layers className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Phase 3: Batch Normalization (90% Accuracy)",
      description: "Integrated batch normalization between layers, stabilizing gradients and speeding up training. The result was a massive jump to 90% accuracy!",
      link: "https://lnkd.in/dQFdX8F5",
      icon: <LineChart className="w-5 h-5 text-green-400" />
    },
    {
      title: "Phase 4: Regularization (96% Accuracy)",
      description: "Added L2 regularization and Dropout layers to reduce overfitting. The model now achieves an impressive 96% accuracy on test data!",
      link: "https://lnkd.in/diyQrp8h",
      icon: <FlaskConical className="w-5 h-5 text-pink-400" />
    }
  ];

  const networkBlocks = [
    {
      name: "Input Block",
      layers: [
        "Conv2d(3, 8, kernel_size=3, padding=0)",
        "ReLU()",
        "BatchNorm2d(8)",
        "MaxPool2d(2, 2)"
      ]
    },
    {
      name: "Convolution Block 1",
      layers: [
        "Conv2d(8, 16, kernel_size=3, padding=0)",
        "ReLU()",
        "BatchNorm2d(16)",
        "MaxPool2d(2, 2)"
      ]
    },
    {
      name: "Transition Block",
      layers: [
        "Conv2d(16, 10, kernel_size=1, padding=0)",
        "ReLU()",
        "MaxPool2d(2, 2)"
      ]
    },
    {
      name: "Feature Extraction Blocks",
      layers: [
        "Multiple Conv Blocks with channel manipulation",
        "1x1 convolutions for dimensionality reduction",
        "BatchNorm and ReLU after each conv"
      ]
    },
    {
      name: "Output Block",
      layers: [
        "Global Average Pooling",
        "Final Conv2d(16, 2, kernel_size=4)",
        "LogSoftmax output"
      ]
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
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300 mb-4">
            NeumoAI Architecture White Paper
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From 64% to 96%: The Evolution of Our Pneumonia Detection CNN
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-20">
          <div className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6">
              Introduction
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Detecting pneumonia early can save lives—and with the power of deep learning, we can automate this process! This document details the architecture and iterative improvements of our Convolutional Neural Network (CNN) that classifies lung X-rays as "normal" or "pneumonia-positive" with 96% accuracy.
              </p>
              <p>
                The model evolved through four major phases, each introducing key architectural improvements that significantly boosted performance. Below we break down both the development journey and the final network architecture.
              </p>
            </div>
          </div>
        </section>

        {/* Development Phases */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-8 text-center">
            Development Phases
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-500/30 mr-4">
                    {phase.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{phase.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{phase.description}</p>
                <a
                  href={phase.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-300 hover:text-purple-100 transition-colors"
                >
                  View notebook <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Network Architecture */}
        <section className="mb-20">
          <div className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6">
              Final Network Architecture
            </h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Key Characteristics:</h3>
              <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-purple-400 mr-2 mt-0.5">•</div>
                  <span>12 convolutional blocks with ReLU activation</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-purple-400 mr-2 mt-0.5">•</div>
                  <span>Batch normalization after each convolutional layer</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-purple-400 mr-2 mt-0.5">•</div>
                  <span>Strategic use of 1x1 convolutions for dimensionality reduction</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-purple-400 mr-2 mt-0.5">•</div>
                  <span>Global average pooling before final classification</span>
                </li>
              </ul>
            </div>

            {/* Architecture Visualization */}
            <div className="space-y-6">
              {networkBlocks.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-purple-500/50 pl-4"
                >
                  <h3 className="text-lg font-medium text-white mb-2">{block.name}</h3>
                  <div className="bg-[rgba(110,69,226,0.1)] rounded-lg p-4">
                    {block.layers.map((layer, layerIndex) => (
                      <div key={layerIndex} className="py-1 px-3 font-mono text-sm text-gray-300">
                        {layer}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="backdrop-blur-md bg-[rgba(15,12,41,0.7)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6">
            Key Takeaways
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[rgba(110,69,226,0.2)] to-[rgba(136,211,206,0.2)] p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Data Augmentation</h3>
              <p className="text-gray-300">Creating more varied training samples leads to more robust learning and better generalization.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[rgba(255,126,95,0.2)] to-[rgba(110,69,226,0.2)] p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Batch Normalization</h3>
              <p className="text-gray-300">Stabilizes gradients and enables faster convergence during training.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[rgba(136,211,206,0.2)] to-[rgba(255,126,95,0.2)] p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Regularization</h3>
              <p className="text-gray-300">Reduces overfitting and improves model generalization to unseen data.</p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-400">
          <p>© {new Date().getFullYear()} NeumoAI. Created by Arnold Oduor.</p>
          <p className="mt-2">This architecture continues to evolve with ongoing research.</p>
        </footer>
      </div>
    </motion.div>
  );
};

export default WhitePaper;