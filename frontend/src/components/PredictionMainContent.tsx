"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { PredictionData } from '@/contexts/PredictionContext';
import  PatientForm  from './PatientForm';
import ImageUpload from './ImageUpload';
import PredictionResults from './PredictionResults';

interface PredictionMainContentProps {
  file: File | null;
  isLoading: boolean;
  uploadProgress: number;
  isUploaded: boolean;
  prediction: PredictionData | null;
  selectedPrediction: PredictionData | null;
  error: string | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onSubmitPatientInfo: (age: number, gender: string, symptoms: string) => Promise<void>;
  onReset: () => void;
}

export const PredictionMainContent = ({
  file,
  isLoading,
  uploadProgress,
  isUploaded,
  prediction,
  selectedPrediction,
  error,
  onFileSelect,
  onRemoveFile,
  onSubmitPatientInfo,
  onReset,
}: PredictionMainContentProps) => {
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {selectedPrediction ? (
          <PredictionResults 
            prediction={selectedPrediction} 
            onReset={onReset} 
          />
        ) : prediction ? (
          <PredictionResults 
            prediction={prediction} 
            onReset={onReset} 
          />
        ) : (
          <motion.div
            key="upload-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ImageUpload
              onFileSelect={onFileSelect}
              onRemoveFile={onRemoveFile}
              file={file}
              isUploading={isLoading}
              uploadProgress={uploadProgress}
              isUploaded={isUploaded && !isLoading}
            />

            {file && (
              <PatientForm
                onSubmit={onSubmitPatientInfo}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};