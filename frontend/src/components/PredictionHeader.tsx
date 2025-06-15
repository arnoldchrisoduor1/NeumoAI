"use client";

import { motion } from 'framer-motion';

interface PredictionHeaderProps {
  error: string | null;
}

export const PredictionHeader = ({ error }: PredictionHeaderProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500 mb-2">
          Neumo AI
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Upload a chest X-ray image to detect potential signs of pneumonia with our AI-powered analysis.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-red-900/20 border-red-900/30 text-red-400 p-3 rounded-lg flex items-center gap-2">
            <div className="h-4 w-4" />
            <p>{error}</p>
          </div>
        </motion.div>
      )}
    </>
  );
};