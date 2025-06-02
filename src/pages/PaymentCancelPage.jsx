
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4 hero-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="bg-red-600 text-destructive-foreground p-8 rounded-t-lg">
            <div className="flex flex-col items-center text-center">
              <XCircle size={64} className="mb-4" />
              <CardTitle className="text-3xl font-bold">Payment Cancelled</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Your payment process was cancelled. You have not been charged.
            </p>
            <p className="text-gray-600 mb-8">
              If you faced any issues or have questions, please feel free to contact us.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Return to Homepage
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Try Again
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
