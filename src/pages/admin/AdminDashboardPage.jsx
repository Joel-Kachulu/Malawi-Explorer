import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Eye, DollarSign, Users, BarChartBig, TrendingUp, 
  Clock, Globe, Smartphone, Monitor, RefreshCw, Plus, 
  Calendar, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState([
    { title: 'Published Articles', value: '0', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300', change: '+0%' },
    { title: 'Total Views', value: '0', icon: Eye, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30 dark:text-green-300', change: '+0%' },
    { title: 'Active Visitors', value: '0', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300', change: '+0%' },
    { title: 'Unique Visitors', value: '0', icon: Globe, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300', change: '+0%' },
  ]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { analytics, refreshAnalytics } = useAnalytics(30000); // 30 seconds

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({ title: "Supabase Error", description: "Supabase client not available.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // Fetch articles count
      const { count: articleCount, error: articleError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      if (articleError) throw articleError;

      // Fetch recent articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, created_at, categories(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (articlesError) throw articlesError;

      // Fetch recent page views for activity
      const { data: recentViews, error: viewsError } = await supabase
        .from('page_views')
        .select('page_path, page_title, created_at, device_type')
        .order('created_at', { ascending: false })
        .limit(10);

      if (viewsError) console.warn("Error fetching recent views:", viewsError);

      // Update stats with real analytics data
      setStats(prevStats => prevStats.map(stat => {
        switch (stat.title) {
          case 'Published Articles':
            return { ...stat, value: articleCount?.toString() || '0' };
          case 'Total Views':
            return { ...stat, value: analytics.totalPageViewsToday?.toString() || '0' };
          case 'Active Visitors':
            return { ...stat, value: analytics.activeVisitors?.toString() || '0' };
          case 'Unique Visitors':
            return { ...stat, value: analytics.uniqueVisitorsToday?.toString() || '0' };
          default:
            return stat;
        }
      }));

      // Set recent articles
      setRecentArticles(articlesData?.map(article => ({
        id: article.id,
        title: article.title,
        category: article.categories?.name || 'Uncategorized',
        created_at: new Date(article.created_at).toLocaleDateString()
      })) || []);

      // Set recent activity
      setRecentActivity(recentViews?.map(view => ({
        type: 'page_view',
        title: view.page_title || view.page_path,
        path: view.page_path,
        device: view.device_type,
        time: new Date(view.created_at).toLocaleTimeString()
      })) || []);

    } catch (error) {
      toast({ title: "Error Fetching Dashboard Data", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast, analytics]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your site.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Last updated: {analytics.lastUpdated ? new Date(analytics.lastUpdated).toLocaleTimeString() : 'Loading...'}</span>
          </div>
          <Button 
            onClick={() => { fetchDashboardData(); refreshAnalytics(); }} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
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
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {formatNumber(parseInt(stat.value))}
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Articles */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
                <FileText className="h-6 w-6 mr-2 text-blue-500 dark:text-blue-400" />
                Recent Articles
              </CardTitle>
              <CardDescription>Latest published content</CardDescription>
            </CardHeader>
            <CardContent>
              {recentArticles.length > 0 ? (
                <div className="space-y-3">
                  {recentArticles.map((article, index) => (
                    <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                          {article.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {article.created_at}
                          </span>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link to={`/admin/content`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No articles published yet</p>
              )}
              <Button asChild className="w-full mt-4">
                <Link to="/admin/content">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Article
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
                <Activity className="h-6 w-6 mr-2 text-green-500 dark:text-green-400" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest visitor activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 6).map((activity, index) => {
                    const DeviceIcon = getDeviceIcon(activity.device);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <DeviceIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
              )}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/admin/analytics">
                  View Full Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
                <BarChartBig className="h-6 w-6 mr-2 text-purple-500 dark:text-purple-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Link to="/admin/content">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Article
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Link to="/admin/analytics">
                  <BarChartBig className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <FileText className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
              <Button variant="outline" className="w-full justify-start dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
              <TrendingUp className="h-6 w-6 mr-2 text-indigo-500 dark:text-indigo-400" />
              Analytics Overview
            </CardTitle>
            <CardDescription>Key metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Device Usage</h4>
                {Object.keys(analytics.deviceBreakdown || {}).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
                      const DeviceIcon = getDeviceIcon(device);
                      const total = Object.values(analytics.deviceBreakdown).reduce((a, b) => a + b, 0);
                      const percentage = ((count / total) * 100).toFixed(1);
                      
                      return (
                        <div key={device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DeviceIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{device}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No device data available</p>
                )}
              </div>

              {/* Top Pages */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Top Pages Today</h4>
                {analytics.pageViewsByPath && analytics.pageViewsByPath.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.pageViewsByPath.slice(0, 3).map((page, index) => (
                      <div key={page.path} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                          {page.title || page.path}
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-2">
                          {page.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No page data available</p>
                )}
              </div>

              {/* Quick Stats */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Now</span>
                    <span className="text-sm font-medium text-green-600">{analytics.activeVisitors || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Views Today</span>
                    <span className="text-sm font-medium text-blue-600">{analytics.totalPageViewsToday || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Unique Today</span>
                    <span className="text-sm font-medium text-purple-600">{analytics.uniqueVisitorsToday || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
