import React from 'react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Outlet } from 'react-router-dom';
import '@/App.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-300">
          <Header />
          <Navbar />
          
          <main className="flex-grow">
            <Outlet />
          </main>
          <Toaster />
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
