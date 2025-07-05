import { useState, useEffect, useCallback } from 'react';
import analyticsService from '@/lib/analyticsService';

export const useAnalytics = (updateInterval = 30000) => { // 30 seconds default
  const [analytics, setAnalytics] = useState({
    activeVisitors: 0,
    totalPageViewsToday: 0,
    uniqueVisitorsToday: 0,
    pageViewsByPath: [],
    deviceBreakdown: {},
    lastUpdated: null,
    loading: true,
    error: null
  });

  const [historicalData, setHistoricalData] = useState({
    data: [],
    loading: true,
    error: null
  });

  const [visitorSessions, setVisitorSessions] = useState({
    data: [],
    loading: true,
    error: null
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await analyticsService.getRealTimeAnalytics();
      setAnalytics(prev => ({
        ...data,
        loading: false,
        error: null
      }));
    } catch (error) {
      setAnalytics(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, []);

  const fetchHistoricalData = useCallback(async (days = 30) => {
    try {
      setHistoricalData(prev => ({ ...prev, loading: true }));
      const data = await analyticsService.getHistoricalAnalytics(days);
      setHistoricalData({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      setHistoricalData({
        data: [],
        loading: false,
        error: error.message
      });
    }
  }, []);

  const fetchVisitorSessions = useCallback(async () => {
    try {
      setVisitorSessions(prev => ({ ...prev, loading: true }));
      const data = await analyticsService.getVisitorSessions();
      setVisitorSessions({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      setVisitorSessions({
        data: [],
        loading: false,
        error: error.message
      });
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
    fetchHistoricalData();
    fetchVisitorSessions();
  }, [fetchAnalytics, fetchHistoricalData, fetchVisitorSessions]);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [fetchAnalytics, updateInterval]);

  // Manual refresh function
  const refreshAnalytics = useCallback(() => {
    fetchAnalytics();
    fetchHistoricalData();
    fetchVisitorSessions();
  }, [fetchAnalytics, fetchHistoricalData, fetchVisitorSessions]);

  return {
    analytics,
    historicalData,
    visitorSessions,
    refreshAnalytics,
    fetchHistoricalData
  };
};

export const usePageTracking = () => {
  const trackPageView = useCallback((pagePath, pageTitle = '') => {
    analyticsService.trackPageView(pagePath, pageTitle);
  }, []);

  return { trackPageView };
}; 