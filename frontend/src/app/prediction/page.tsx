// app/predict/page.tsx
"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrediction } from '@/contexts/PredictionContext';
import ImageUpload from '@/components/ImageUpload';
import PatientForm from '@/components/PatientForm';
import PredictionResults from '@/components/PredictionResults';

const PredictPage = () => {
  const { prediction, isLoading, makePrediction, clearPrediction } = usePrediction();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploaded(false);
    setUploadProgress(0);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsUploaded(false);
    setUploadProgress(0);
  };

  const handleSubmitPatientInfo = async (age: number, gender: string, symptoms: string) => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload progress (in a real app, you'd track actual upload progress)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await makePrediction(file, age, gender, symptoms);
    } finally {
      clearInterval(interval);
      setIsUploading(false);
      setIsUploaded(true);
    }
  };

  const handleReset = () => {
    setFile(null);
    setIsUploaded(false);
    setUploadProgress(0);
    clearPrediction();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500 mb-2">
            Neumo AI
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Upload a chest X-ray image to detect potential signs of pneumonia with our AI-powered analysis.
          </p>
        </motion.div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {!prediction ? (
              <motion.div
                key="upload-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <ImageUpload
                  onFileSelect={handleFileSelect}
                  onRemoveFile={handleRemoveFile}
                  file={file}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  isUploaded={isUploaded}
                />

                {file && (
                  <PatientForm
                    onSubmit={handleSubmitPatientInfo}
                    isLoading={isLoading || isUploading}
                  />
                )}
              </motion.div>
            ) : (
              <PredictionResults prediction={prediction} onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PredictPage;