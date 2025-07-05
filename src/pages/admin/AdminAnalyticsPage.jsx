import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, Users, Eye, DollarSign, TrendingUp, RefreshCw, Monitor, Smartphone, Tablet, Globe, Clock } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

const AdminAnalyticsPage = () => {
  const { analytics, historicalData, visitorSessions, refreshAnalytics } = useAnalytics(15000); // 15 seconds
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const chartCard = (title, icon, description, chartType = "bar", children) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
          {React.createElement(icon, { className: "h-6 w-6 text-green-600" })}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children || (
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart Placeholder</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-800">Real-Time Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last updated: {analytics.lastUpdated ? formatTime(analytics.lastUpdated) : 'Loading...'}</span>
          </div>
          <Button 
            onClick={refreshAnalytics} 
            variant="outline" 
            size="sm"
            disabled={analytics.loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${analytics.loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Real-time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.loading ? '...' : formatNumber(analytics.activeVisitors)}</div>
            <p className="text-sm opacity-80">Currently browsing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Page Views Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.loading ? '...' : formatNumber(analytics.totalPageViewsToday)}</div>
            <p className="text-sm opacity-80">Total views today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.loading ? '...' : formatNumber(analytics.uniqueVisitorsToday)}</div>
            <p className="text-sm opacity-80">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{visitorSessions.loading ? '...' : formatNumber(visitorSessions.data.length)}</div>
            <p className="text-sm opacity-80">All time</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Pages and Device Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Top Pages */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Top Pages Today</CardTitle>
            <CardDescription>Most viewed pages in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : analytics.pageViewsByPath.length > 0 ? (
              <div className="space-y-4">
                {analytics.pageViewsByPath.slice(0, 5).map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-gray-800 truncate">{page.title || page.path}</p>
                          <p className="text-sm text-gray-500">{page.path}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{page.count}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No page views recorded yet</p>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Device Breakdown</CardTitle>
            <CardDescription>Visitor devices in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : Object.keys(analytics.deviceBreakdown).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
                  const DeviceIcon = getDeviceIcon(device);
                  const total = Object.values(analytics.deviceBreakdown).reduce((a, b) => a + b, 0);
                  const percentage = ((count / total) * 100).toFixed(1);
                  
                  return (
                    <div key={device} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DeviceIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{device}</p>
                          <p className="text-sm text-gray-500">{percentage}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{count}</p>
                        <p className="text-xs text-gray-500">visitors</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No device data available</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Historical Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {chartCard(
          "Page Views Over Time", 
          LineChart, 
          `Track views for the last ${selectedPeriod} days.`,
          "line",
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            {historicalData.loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading historical data...</p>
              </div>
            ) : historicalData.data.length > 0 ? (
              <div className="w-full h-full p-4">
                <div className="flex justify-between items-center mb-4">
                  <select 
                    value={selectedPeriod} 
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                </div>
                <div className="space-y-2">
                  {historicalData.data.slice(-10).map((day, index) => (
                    <div key={day.date} className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-gray-500">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((day.pageViews / Math.max(...historicalData.data.map(d => d.pageViews))) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-xs text-gray-600 text-right">
                        {day.pageViews}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No historical data available</p>
            )}
          </div>
        )}

        {chartCard(
          "Recent Visitor Sessions", 
          Users, 
          "Latest visitor activity and engagement.",
          "bar",
          <div className="h-64 overflow-y-auto">
            {visitorSessions.loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading sessions...</p>
              </div>
            ) : visitorSessions.data.length > 0 ? (
              <div className="space-y-3">
                {visitorSessions.data.slice(0, 8).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Session {session.session_id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.last_visit_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{session.total_page_views}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No visitor sessions recorded</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Error Display */}
      {(analytics.error || historicalData.error || visitorSessions.error) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md"
        >
          <p className="font-bold">Analytics Error:</p>
          <p>{analytics.error || historicalData.error || visitorSessions.error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
