"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BrainCircuit, 
  FileText, 
  User, 
  Rocket,
  Menu,
  X,
  LogOut,
  LogIn
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, logout, isLoading, error } = useAuth();

  
  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Predict', 
      path: '/prediction', 
      icon: <BrainCircuit className="w-5 h-5" /> 
    },
    { 
      name: 'Features', 
      path: '/features', 
      icon: <Rocket className="w-5 h-5" /> 
    },
    { 
      name: 'White Paper', 
      path: '/whitepaper', 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      name: 'Account', 
      path: '/account', 
      icon: <User className="w-5 h-5" /> 
    },
  ];

  const LogoIcon = () => (
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 2 
        }}
        className="relative w-10 h-10 flex items-center justify-center"
      >
        {/* Base circle */}
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-purple-600 opacity-20" />
        
        {/* Pulsing rings */}
        <motion.div 
          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeOut"
          }}
          className="absolute w-10 h-10 rounded-full border-2 border-[color:var(--color-primary)]"
        />
        
        {/* Inner icon */}
        <BrainCircuit className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500" />
      </motion.div>
    );

  const handleLogout = async() => {
    await logout();
    console.log('User logged out');
  };

  const goToSignIn = () => {
    router.push('/authentication');
  }

  useEffect(() => (
    isAuthenticated ? console.log("User is Authenticated ") : console.log("User not authenticated")
  ), [isAuthenticated])

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[rgba(15,12,41,0.7)] border-b border-[rgba(255,255,255,0.1)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <LogoIcon />
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500"
              >
                NeumoAI
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  className="relative px-3 py-2 rounded-lg transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 ${pathname === item.path ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </motion.div>
                  
                  {pathname === item.path && (
                    <motion.div 
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}

              {
                isAuthenticated ? 
                <Button
                title={isLoading ? "Logging out ..." : "Log Out"}
                onClick={handleLogout}
                // variant="outline"
                type='submit'
                disabled={isLoading}
                className="ml-4 flex items-center space-x-2"
              />:
              <Button
                title="Sign In"
                onClick={goToSignIn}
                variant="outline"
                className="ml-4 flex items-center space-x-2"
              />
              }
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {
                isAuthenticated ? 
                <Button
                title="Logout"
                onClick={handleLogout}
                variant="outline"
                className="ml-4 flex items-center space-x-2"
              /> :
              <Button
                title="Sign In"
                onClick={goToSignIn}
                variant="outline"
                className="ml-4 flex items-center space-x-2"
              />
              }
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 right-0 z-50 w-64 h-full bg-[#0f0c29] shadow-lg md:hidden border-l border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.1)]">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <BrainCircuit className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-purple-500">
                    NeumoAI
                  </span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === item.path ? 'bg-[rgba(255,255,255,0.1)] text-white' : 'text-gray-300 hover:bg-[rgba(255,255,255,0.05)]'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}

                <Button
                  title="Logout"
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 mt-6"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;