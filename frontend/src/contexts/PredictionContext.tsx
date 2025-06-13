// contexts/PredictionContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PredictionData {
  image_filename: string;
  prediction_class: string;
  confidence_score: number;
  inference_time_ms: number;
  patient_age?: number;
  patient_gender?: string;
  patient_symptoms?: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  reviewed_by_doctor: boolean;
  status: string;
}

interface PredictionContextType {
  prediction: PredictionData | null;
  isLoading: boolean;
  error: string | null;
  makePrediction: (
    file: File,
    patientAge?: number,
    patientGender?: string,
    patientSymptoms?: string
  ) => Promise<void>;
  clearPrediction: () => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const makePrediction = async (
    file: File,
    patientAge?: number,
    patientGender?: string,
    patientSymptoms?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (patientAge) formData.append('patient_age', patientAge.toString());
      if (patientGender) formData.append('patient_gender', patientGender);
      if (patientSymptoms) formData.append('patient_symptoms', patientSymptoms);

      const response = await fetch('http://127.0.0.1:8000/api/v1/prediction/predict', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data = await response.json();
      setPrediction(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearPrediction = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <PredictionContext.Provider
      value={{
        prediction,
        isLoading,
        error,
        makePrediction,
        clearPrediction,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};