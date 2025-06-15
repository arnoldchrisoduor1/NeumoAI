// contexts/PredictionContext.tsx - UPDATED
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface PredictionData {
  id: number;
  user_id: number;
  image_filename: string;
  image_url?: string; // Presigned URL for viewing
  prediction_class: string;
  confidence_score: number;
  inference_time_ms: number;
  patient_age?: number;
  patient_gender?: string;
  patient_symptoms?: string;
  created_at: string;
  updated_at: string;
  reviewed_by_doctor: boolean;
  status: string;
  is_flagged: boolean;
  doctor_notes?: string;
  doctor_diagnosis?: string;
}

export interface PredictionResponse {
  success: boolean;
  message: string;
  data: PredictionData;
}

export interface PredictionContextType {
  prediction: PredictionData | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  makePrediction: (
    file: File,
    patientAge?: number,
    patientGender?: string,
    patientSymptoms?: string
  ) => Promise<void>;
  clearPrediction: () => void;
  getPrediction: (id: number) => Promise<PredictionData | null>;
  getUserPredictions: (includeImages?: boolean) => Promise<PredictionData[]>;
  deletePrediction: (id: number) => Promise<boolean>;
  flagPrediction: (id: number) => Promise<boolean>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

  const makePrediction = async (
    file: File,
    patientAge?: number,
    patientGender?: string,
    patientSymptoms?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (patientAge) formData.append('patient_age', patientAge.toString());
      if (patientGender) formData.append('patient_gender', patientGender);
      if (patientSymptoms) formData.append('patient_symptoms', patientSymptoms);

      // Create XMLHttpRequest for upload progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      // Create promise to handle the request
      const response = await new Promise<Response>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(new Response(xhr.response, {
              status: xhr.status,
              headers: { 'Content-Type': 'application/json' }
            }));
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        
        xhr.open('POST', `${API_BASE_URL}/api/v1/prediction/predict`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data.data);
      setUploadProgress(100);
      
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrediction = async (id: number): Promise<PredictionData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/prediction/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data: PredictionResponse = await response.json();
      return data.data;
    } catch (err) {
      console.error('Error fetching prediction:', err);
      return null;
    }
  };

  const getUserPredictions = async (includeImages: boolean = false): Promise<PredictionData[]> => {
    try {
      const params = new URLSearchParams();
      if (includeImages) params.append('include_images', 'true');

      const response = await fetch(`${API_BASE_URL}/api/v1/prediction/?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error('Error fetching predictions:', err);
      return [];
    }
  };

  const deletePrediction = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/prediction/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete prediction');
      }

      // Clear current prediction if it was deleted
      if (prediction && prediction.id === id) {
        setPrediction(null);
      }

      return true;
    } catch (err) {
      console.error('Error deleting prediction:', err);
      return false;
    }
  };

  const flagPrediction = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/prediction/${id}/flag`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to flag prediction');
      }

      return true;
    } catch (err) {
      console.error('Error flagging prediction:', err);
      return false;
    }
  };

  const clearPrediction = () => {
    setPrediction(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <PredictionContext.Provider
      value={{
        prediction,
        isLoading,
        error,
        uploadProgress,
        makePrediction,
        clearPrediction,
        getPrediction,
        getUserPredictions,
        deletePrediction,
        flagPrediction,
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