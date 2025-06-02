
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';

const BuyMeACoffeeButton = () => {
  const { toast } = useToast();

  const handleDonate = async () => {
    toast({
      title: "Stripe Not Configured",
      description: "Please provide Stripe Publishable Key and Price ID to enable donations.",
      variant: "destructive",
    });
    
  };

  return (
    <Button
      onClick={handleDonate}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-lg transform transition-transform hover:scale-105"
      size="lg"
    >
      <Coffee className="mr-2 h-5 w-5" />
      Buy Me a Coffee
    </Button>
  );
};

export default BuyMeACoffeeButton;
