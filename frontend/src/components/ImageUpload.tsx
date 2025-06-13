// components/prediction/ImageUpload.tsx
"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
// import InputComponent from '../InputComponent';
// import Button from '../Button';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  file: File | null;
  isUploading: boolean;
  uploadProgress: number;
  isUploaded: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  onRemoveFile,
  file,
  isUploading,
  uploadProgress,
  isUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.type.startsWith('image/')) {
          onFileSelect(droppedFile);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-[#ffffff10] to-[#ffffff05] backdrop-blur-lg rounded-xl shadow-neuro border border-[#ffffff15] overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500">
            Upload X-ray Image
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Drag & drop your chest X-ray image here or click to browse
          </p>

          <motion.div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10'
                : 'border-gray-600 hover:border-[color:var(--color-primary)]'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Upload className="text-3xl text-[color:var(--color-primary)]" />
                <p className="text-sm text-gray-300">
                  {isDragging ? 'Drop your image here' : 'Click to select or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">Supports: JPG, PNG (Max 10MB)</p>
              </div>
            </label>
          </motion.div>

          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between bg-[#ffffff10] rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="text-[color:var(--color-primary)]" />
                    <div className="truncate max-w-xs">
                      <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onRemoveFile}
                    className="text-gray-400 hover:text-[color:var(--color-primary)] transition-colors"
                  >
                    <X />
                  </button>
                </div>

                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-[color:var(--color-primary)] h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {uploadProgress}%
                    </p>
                  </motion.div>
                )}

                {isUploaded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-green-900/20 text-green-400 rounded-lg flex items-center justify-center space-x-2 border border-green-900/30"
                  >
                    <Check className="text-green-400" />
                    <span>Upload complete!</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageUpload;