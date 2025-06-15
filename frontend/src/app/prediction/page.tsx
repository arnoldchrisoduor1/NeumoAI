// app/predict/page.tsx - UPDATED
"use client";

import { useState, useEffect } from 'react';
import { PredictionData, usePrediction } from '@/contexts/PredictionContext';
import { useAuth } from '@/contexts/AuthContext';
import { PredictionHeader } from '@/components/PredictionHeader';
import { PredictionMainContent } from '@/components/PredictionMainContent';
import { PredictionSidebar } from '@/components/PredictionSidebar';


const PredictPage = () => {
  const { 
    prediction, 
    isLoading, 
    error, 
    uploadProgress, 
    makePrediction, 
    clearPrediction,
    getUserPredictions,
    getPrediction
  } = usePrediction();
  
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [predictionsHistory, setPredictionsHistory] = useState<PredictionData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionData | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploaded(false);
    clearPrediction();
    setSelectedPrediction(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsUploaded(false);
    clearPrediction();
  };

  const handleSubmitPatientInfo = async (age: number, gender: string, symptoms: string) => {
    if (!file) return;

    try {
      await makePrediction(file, age, gender, symptoms);
      setIsUploaded(true);
      if (isAuthenticated) {
        fetchPredictionsHistory();
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      setIsUploaded(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setIsUploaded(false);
    clearPrediction();
    setSelectedPrediction(null);
  };

  const fetchPredictionsHistory = async () => {
    if (!isAuthenticated) return;
    
    setLoadingHistory(true);
    try {
      const predictions = await getUserPredictions(true);
      setPredictionsHistory(predictions);
    } catch (err) {
      console.error('Failed to fetch predictions history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadPredictionDetails = async (id: number) => {
    try {
      const prediction = await getPrediction(id);
      if (prediction) {
        setSelectedPrediction(prediction);
        setShowHistory(false);
      }
    } catch (err) {
      console.error('Failed to load prediction details:', err);
    }
  };

  const handleLoginClick = () => {
    // Implement your login navigation here
    console.log('Navigate to login');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPredictionsHistory();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-10">
        <PredictionHeader error={error} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload/Prediction Section */}
          <div className="lg:col-span-2">
            <PredictionMainContent
              file={file}
              isLoading={isLoading}
              uploadProgress={uploadProgress}
              isUploaded={isUploaded}
              prediction={prediction}
              selectedPrediction={selectedPrediction}
              error={error}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onSubmitPatientInfo={handleSubmitPatientInfo}
              onReset={handleReset}
            />
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <PredictionSidebar
              isAuthenticated={isAuthenticated}
              loadingHistory={loadingHistory}
              predictionsHistory={predictionsHistory}
              selectedPredictionId={selectedPrediction?.id || null}
              currentPredictionId={prediction?.id || null}
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              onSelectPrediction={loadPredictionDetails}
              onLoginClick={handleLoginClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictPage;