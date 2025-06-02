
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, DollarSign, Users, BarChartBig } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState([
    { title: 'Published Articles', value: '0', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' },
    { title: 'Total Views', value: '0', icon: Eye, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
    { title: 'Donations (Placeholder)', value: '0', icon: DollarSign, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { title: 'Registered Users', value: '0', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({ title: "Supabase Error", description: "Supabase client not available.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const { count: articleCount, error: articleError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      if (articleError) throw articleError;

      // Placeholder for other stats - you'd fetch these similarly
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) console.warn("Error fetching users (requires admin privileges):", usersError.message);


      setStats(prevStats => prevStats.map(stat => {
        if (stat.title === 'Published Articles') return { ...stat, value: articleCount?.toString() || '0' };
        if (stat.title === 'Registered Users') return { ...stat, value: usersData?.users?.length.toString() || '0' };
        // Add logic for 'Total Views' and 'Donations' when available
        return stat;
      }));

    } catch (error) {
      toast({ title: "Error Fetching Dashboard Data", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 dark:text-gray-100"
      >
        Admin Dashboard
      </motion.h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
             <Card key={i} className="shadow-lg dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</div>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+0% from last month (placeholder)</p> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
                <BarChartBig className="h-6 w-6 mr-2 text-indigo-500 dark:text-indigo-400" />
                Recent Activity (Placeholder)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">This section will display recent admin activities or site updates.</p>
              <div className="mt-4 h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Chart/Activity Log Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
                <FileText className="h-6 w-6 mr-2 text-teal-500 dark:text-teal-400" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Link to="/admin/content">Add New Article</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Manage Categories (Soon)</Button>
              <Button asChild variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                 <Link to="/admin/analytics">View Site Analytics</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">User Management (Soon)</Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
    </div>
  );
};

export default AdminDashboardPage;
