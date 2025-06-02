
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, AlertTriangle } from 'lucide-react';

const AdminLoginPage = ({ setIsAdminAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!supabase) {
        setError("Supabase client is not initialized. Please check the connection.");
        toast({
            title: "Login Error",
            description: "Supabase client is not initialized.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      if (data.user) {
        setIsAdminAuthenticated(true);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        navigate('/admin/dashboard');
      } else {
         setError("Login failed. Please check your credentials.");
         toast({
            title: "Login Failed",
            description: "Incorrect email or password.",
            variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.9 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4"
    >
      <Card className="w-full max-w-md shadow-2xl border-green-200">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mb-4 p-3 bg-green-600 rounded-full inline-block"
          >
            <LogIn className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-gray-800">Admin Login</CardTitle>
          <CardDescription className="text-gray-600">Access the Malawi History Explorer Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md flex items-center"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : null}
              {isLoading ? 'Logging In...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-sm text-gray-600">
             Ensure you are using authorized credentials.
           </p>
           <Link to="/" className="text-sm text-green-600 hover:text-green-700 hover:underline">
            ← Back to Homepage
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminLoginPage;
