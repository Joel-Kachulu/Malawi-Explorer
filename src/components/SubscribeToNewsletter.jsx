import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/supabaseClient';

const SubscribeToNewsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    // Insert into Supabase
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error) {
      setStatus('error');
      setMessage('There was an error subscribing. Please try again.');
    } else {
      setStatus('success');
      setMessage('Thank you for subscribing! You will receive updates for every new upload.');
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-red-500 via-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <Bell className="h-10 w-10 text-white" />
          </motion.div>

          {/* Main Content Card with Gradient Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {/* Gradient Background for Card Only */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-green-700"></div>
            
            {/* Animated Background Elements for Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.5) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.4) 0%, transparent 70%)'
              }}
            />
            
            {/* Floating Elements for Card */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-10 left-10 w-20 h-20 bg-red-500/25 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-10 right-10 w-32 h-32 bg-green-500/35 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-400/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 3
              }}
              className="absolute top-1/3 right-1/4 w-16 h-16 bg-black/40 rounded-full blur-xl"
            />

            {/* Content */}
            <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-red-100 to-green-200 bg-clip-text text-transparent">
              Stay Updated with Tech News
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get exclusive access to the latest tech innovations, startup stories, and industry insights delivered straight to your inbox!
            </p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Weekly Updates</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Exclusive Content</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Instant Notifications</span>
              </div>
            </motion.div>

            {/* Subscription Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto"
            >
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-lg transition-all duration-300"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Status Messages */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex items-center justify-center space-x-2 text-green-300"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">{message}</span>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex items-center justify-center space-x-2 text-red-300"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">{message}</span>
              </motion.div>
            )}

            {/* Trust Indicators */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-white/60 text-sm mt-6"
            >
              🔒 We respect your privacy. Unsubscribe at any time.
            </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscribeToNewsletter; 