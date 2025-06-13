// components/prediction/PatientForm.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, HeartPulse } from 'lucide-react';
import InputComponent from './InputComponent';
import Button from './Button';

interface PatientFormProps {
  onSubmit: (age: number, gender: string, symptoms: string) => void;
  isLoading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, isLoading }) => {
  const [age, setAge] = useState<number | undefined>();
  const [gender, setGender] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && gender) {
      onSubmit(age, gender, symptoms);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-full"
    >
      <div className="bg-gradient-to-br from-[#ffffff10] to-[#ffffff05] backdrop-blur-lg rounded-xl shadow-neuro border border-[#ffffff15] p-6">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500">
          Patient Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputComponent
              type="number"
              placeholder="Age"
              value={age?.toString() || ''}
              onChange={(e) => setAge(parseInt(e.target.value))}
              Icon={Calendar}
              name="age"
            />

            <div className="relative">
              <div className="flex items-center gap-3 border border-slate-500 p-2 rounded-lg">
                <User className="text-slate-500" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-transparent outline-none w-full text-gray-300"
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <InputComponent
            type="text"
            placeholder="Symptoms (optional)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            Icon={HeartPulse}
            name="symptoms"
          />

          <Button
            title={isLoading ? "Processing..." : "Submit for Analysis"}
            type="submit"
            disabled={isLoading || !age || !gender}
            className="w-full py-3 rounded-lg mt-4"
          />
        </form>
      </div>
    </motion.div>
  );
};

export default PatientForm;