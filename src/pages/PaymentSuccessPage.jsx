
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 hero-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="bg-green-600 text-primary-foreground p-8 rounded-t-lg">
            <div className="flex flex-col items-center text-center">
              <CheckCircle size={64} className="mb-4" />
              <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-700 mb-8">
              Thank you for your generous support! Your contribution helps us continue sharing the rich history of Malawi.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Return to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
