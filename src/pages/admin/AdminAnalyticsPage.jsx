
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Users, Eye, DollarSign, TrendingUp } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const chartCard = (title, icon, description, chartType = "bar") => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
          {React.createElement(icon, { className: "h-6 w-6 text-green-600" })}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
          <p className="text-gray-500">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart Placeholder</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800"
      >
        Site Analytics
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
            <p className="text-sm opacity-80">Across all articles</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$0.00</div>
            <p className="text-sm opacity-80">From 0 supporters</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Published Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
            <p className="text-sm opacity-80">Live on the site</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {chartCard("Article Views Over Time", LineChart, "Track views for articles daily, weekly, or monthly.", "line")}
        {chartCard("Most Popular Articles", BarChart, "Identify which articles are attracting the most attention.", "bar")}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {chartCard("User Demographics (Placeholder)", Users, "Understand your audience (requires user data).", "pie")}
        {chartCard("Donation Trends", TrendingUp, "Analyze donation patterns and amounts over time.", "line")}
        {chartCard("Content Categories Performance", PieChart, "See which content categories are most viewed.", "pie")}
      </motion.div>
      <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
        <p className="font-bold">Note:</p>
        <p>Analytics data is currently placeholder. Real data will be populated after Supabase integration and tracking implementation.</p>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
