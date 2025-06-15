"use client";

import { PredictionHistory } from './PredictionHistory';
import { LogIn } from 'lucide-react';
import  Button  from './Button';
import { PredictionData } from '@/contexts/PredictionContext';

interface PredictionSidebarProps {
  isAuthenticated: boolean;
  loadingHistory: boolean;
  predictionsHistory: PredictionData[];
  selectedPredictionId: number | null;
  currentPredictionId: number | null;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onSelectPrediction: (id: number) => void;
  onLoginClick: () => void;
}

export const PredictionSidebar = ({
  isAuthenticated,
  loadingHistory,
  predictionsHistory,
  selectedPredictionId,
  currentPredictionId,
  showHistory,
  setShowHistory,
  onSelectPrediction,
  onLoginClick,
}: PredictionSidebarProps) => {
  return (
    <div className="bg-gradient-to-br from-[#ffffff10] to-[#ffffff05] backdrop-blur-lg rounded-xl shadow-neuro border border-[#ffffff15] p-6 h-full">
      {isAuthenticated ? (
        <PredictionHistory
          isAuthenticated={isAuthenticated}
          loadingHistory={loadingHistory}
          predictionsHistory={predictionsHistory}
          selectedPredictionId={selectedPredictionId}
          currentPredictionId={currentPredictionId}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          onSelectPrediction={onSelectPrediction}
        />
      ) : (
        <div className="text-center py-8">
          <LogIn className="mx-auto h-10 w-10 text-gray-500 mb-3" />
          <p className="text-gray-400 mb-4">Sign in to view your prediction history</p>
          <Button 
            title="Log in"
            variant="outline" 
            onClick={onLoginClick}
            className="bg-transparent border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10"
          />
        </div>
      )}
    </div>
  );
};