// components/auth/Login.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import InputComponent from '@/components/InputComponent';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

const Login = ({ switchToRegister }: { switchToRegister: () => void }) => {

  const router = useRouter();

  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    router.push('/prediction');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-md"
    >
      <div className="bg-gradient-to-br from-[#ffffff10] to-[#ffffff05] backdrop-blur-lg p-8 rounded-2xl shadow-neuro border border-[#ffffff15]">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500">
          Welcome Back
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputComponent
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            Icon={Mail}
          />
          
          <InputComponent
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isPassword
            Icon={Lock}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-[color:var(--color-primary)] hover:underline hover:cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <Button
            title={isLoading ? "Signing in..." : "Sign In"}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg"
          />
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={switchToRegister}
            className="text-[color:var(--color-primary)] font-medium hover:underline hover:cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;