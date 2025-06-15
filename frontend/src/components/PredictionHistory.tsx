"use client";

import { PredictionData } from '@/contexts/PredictionContext';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import  Button  from './Button';
import Skeleton from './Skeleton';

interface PredictionHistoryProps {
  isAuthenticated: boolean;
  loadingHistory: boolean;
  predictionsHistory: PredictionData[];
  selectedPredictionId: number | null;
  currentPredictionId: number | null;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onSelectPrediction: (id: number) => void;
}

export const PredictionHistory = ({
  isAuthenticated,
  loadingHistory,
  predictionsHistory,
  selectedPredictionId,
  currentPredictionId,
  showHistory,
  setShowHistory,
  onSelectPrediction,
}: PredictionHistoryProps) => {
  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Sign in to view your prediction history</p>
      </div>
    );
  }

  if (!showHistory) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">History is hidden</p>
        <Button 
            title="Show History"
          variant="outline" 
          onClick={() => setShowHistory(true)}
          className="mt-3 bg-transparent border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500 flex items-center gap-2">
          <History className="w-5 h-5" />
          Prediction History
        </h2>
        <Button 
          title="Hide"
          variant="outline" 
          onClick={() => setShowHistory(false)}
          className="text-gray-400 hover:text-[color:var(--color-primary)]"
        />
      </div>

      {loadingHistory ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 bg-gray-700/50 rounded-lg" />
        ))
      ) : predictionsHistory.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {predictionsHistory.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPrediction(item.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                (selectedPredictionId === item.id || currentPredictionId === item.id)
                  ? 'bg-[color:var(--color-primary)]/20 border border-[color:var(--color-primary)]/30'
                  : 'bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-200">
                    {item.prediction_class}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.prediction_class === 'NORMAL'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {item.prediction_class}
                  </span>
                  <p className="text-xs mt-1 text-gray-400">
                    {(item.confidence_score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No predictions yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Upload your first X-ray to see results here
          </p>
        </div>
      )}
    </div>
  );
};