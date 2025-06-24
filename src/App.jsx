
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import HistoryPage from '@/pages/HistoryPage';
import PlacesPage from '@/pages/PlacesPage';
import PlaceDetailPage from '@/pages/PlaceDetailPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminContentPage from '@/pages/admin/AdminContentPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import AdminLayout from '@/components/admin/AdminLayout';
import BuyMeACoffeeButton from '@/components/BuyMeACoffeeButton';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentCancelPage from '@/pages/PaymentCancelPage';


const AppContent = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();
  const { theme } = useTheme(); // Access theme for any AppContent specific logic if needed

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAdminAuthenticated(!!session);
        setAuthLoading(false);
        
        const authChangeEvent = new CustomEvent('adminAuthChanged', { detail: { session } });
        window.dispatchEvent(authChangeEvent);

        if (event === 'SIGNED_IN') {
          localStorage.setItem('adminUser', JSON.stringify(session.user));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('adminUser');
        }
      }
    );

    return () => {
      authSubscription?.data?.subscription?.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminAuthenticated(!!session);
      if (session) {
        localStorage.setItem('adminUser', JSON.stringify(session.user));
      } else {
        localStorage.removeItem('adminUser');
      }
      setAuthLoading(false);
    };
    checkInitialSession();
  }, []);


  const ProtectedAdminRoute = ({ children }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    }
    if (!isAdminAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin area.",
        variant: "destructive",
      });
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/*" element={<MainAppLayout />} />
            <Route path="/admin/login" element={<AdminLoginPage setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
            <Route path="/admin/*" element={
              <ProtectedAdminRoute>
                <AdminRoutes />
              </ProtectedAdminRoute>
            } />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </div>
    </Router>
  );
};

const MainAppLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<PlaceDetailPage />} />
      </Routes>
    </main>
    <div className="fixed bottom-6 right-6 z-50">
      {/*<BuyMeACoffeeButton />*/}
    </div>
    <Footer />
  </>
);

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route index element={<AdminDashboardPage />} />  {/* Handles /admin */}
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="content" element={<AdminContentPage />} />
      <Route path="analytics" element={<AdminAnalyticsPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </AdminLayout>
);

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
