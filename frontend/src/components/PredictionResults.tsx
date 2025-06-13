// components/prediction/PredictionResults.tsx
"use client";

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface PredictionResultsProps {
  prediction: {
    image_filename: string;
    prediction_class: string;
    confidence_score: number;
    inference_time_ms: number;
    patient_age?: number;
    patient_gender?: string;
    patient_symptoms?: string;
  };
  onReset: () => void;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ prediction, onReset }) => {
  const isNormal = prediction.prediction_class === 'NORMAL';
  const confidencePercentage = (prediction.confidence_score * 100).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="w-full"
    >
      <div className="bg-gradient-to-br from-[#ffffff10] to-[#ffffff05] backdrop-blur-lg rounded-xl shadow-neuro border border-[#ffffff15] p-6">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500">
          Analysis Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                isNormal
                  ? 'border-green-500/30 bg-green-900/10'
                  : 'border-red-500/30 bg-red-900/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {isNormal ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <XCircle className="text-red-500" size={24} />
                )}
                <h3 className="text-lg font-semibold">
                  {isNormal ? 'Normal' : 'Pneumonia Detected'}
                </h3>
              </div>
              <p className="text-sm text-gray-300">
                {isNormal
                  ? 'No signs of pneumonia detected in the X-ray image.'
                  : 'Potential signs of pneumonia detected in the X-ray image. Please consult with a healthcare professional.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#ffffff05] p-4 rounded-lg border border-[#ffffff15]">
                <p className="text-sm text-gray-400">Confidence</p>
                <p className="text-xl font-bold text-[color:var(--color-primary)]">
                  {confidencePercentage}%
                </p>
              </div>
              <div className="bg-[#ffffff05] p-4 rounded-lg border border-[#ffffff15]">
                <p className="text-sm text-gray-400">Processing Time</p>
                <p className="text-xl font-bold text-[color:var(--color-primary)]">
                  {(prediction.inference_time_ms / 1000).toFixed(2)}s
                </p>
              </div>
            </div>

            <div className="bg-[#ffffff05] p-4 rounded-lg border border-[#ffffff15]">
              <p className="text-sm text-gray-400 mb-2">Patient Information</p>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-400">Age: </span>
                  <span className="text-gray-200">{prediction.patient_age || 'Not provided'}</span>
                </p>
                <p>
                  <span className="text-gray-400">Gender: </span>
                  <span className="text-gray-200">{prediction.patient_gender || 'Not provided'}</span>
                </p>
                <p>
                  <span className="text-gray-400">Symptoms: </span>
                  <span className="text-gray-200">
                    {prediction.patient_symptoms || 'Not provided'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex-1 bg-black/30 rounded-lg overflow-hidden border border-[#ffffff15]">
              <img
                src={prediction.image_filename}
                alt="X-ray analysis"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                title="Analyze Another Image"
                onClick={onReset}
                variant="outline"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {!isNormal && (
          <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/30 flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-400">Important Notice</h4>
              <p className="text-sm text-yellow-300">
                This result is generated by AI and should not be considered a definitive diagnosis.
                Please consult with a qualified healthcare professional for medical advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PredictionResults;