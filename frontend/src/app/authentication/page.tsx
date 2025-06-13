// app/auth/page.tsx
"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Register from '@/components/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            {/* Animated background elements */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[color:var(--color-primary)]"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  animation: `float ${Math.random() * 20 + 10}s linear infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <Login switchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register switchToLogin={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
};

export default AuthPage;