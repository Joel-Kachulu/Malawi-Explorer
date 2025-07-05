import { supabase } from '@/supabaseClient';

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.isTracking = false;
  }

  // Generate or retrieve session ID
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('malawi_explorer_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('malawi_explorer_session_id', sessionId);
    }
    return sessionId;
  }

  // Detect device type
  getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/iPad|Android/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  // Detect browser
  getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  // Detect OS
  getOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Track page view
  async trackPageView(pagePath, pageTitle = '') {
    if (this.isTracking) return; // Prevent duplicate tracking
    
    this.isTracking = true;
    
    try {
      const pageViewData = {
        page_path: pagePath,
        page_title: pageTitle,
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || '',
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('page_views')
        .insert([pageViewData]);

      if (error) {
        console.error('Error tracking page view:', error);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    } finally {
      this.isTracking = false;
    }
  }

  // Get real-time analytics data
  async getRealTimeAnalytics() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get current active visitors (last 5 minutes)
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const { data: activeVisitors, error: activeError } = await supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', fiveMinutesAgo.toISOString())
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;

      // Get total page views today
      const { data: todayViews, error: todayError } = await supabase
        .from('page_views')
        .select('id')
        .gte('created_at', oneDayAgo.toISOString());

      if (todayError) throw todayError;

      // Get unique visitors today
      const { data: todayVisitors, error: visitorsError } = await supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', oneDayAgo.toISOString());

      if (visitorsError) throw visitorsError;

      // Get page views by path (last 24 hours)
      const { data: pageViewsByPath, error: pathError } = await supabase
        .from('page_views')
        .select('page_path, page_title')
        .gte('created_at', oneDayAgo.toISOString())
        .order('created_at', { ascending: false });

      if (pathError) throw pathError;

      // Get device breakdown
      const { data: deviceBreakdown, error: deviceError } = await supabase
        .from('page_views')
        .select('device_type')
        .gte('created_at', oneDayAgo.toISOString());

      if (deviceError) throw deviceError;

      // Process data
      const uniqueVisitorsToday = new Set(todayVisitors.map(v => v.session_id)).size;
      const activeVisitorsCount = new Set(activeVisitors.map(v => v.session_id)).size;

      // Count page views by path
      const pageViewsCount = {};
      pageViewsByPath.forEach(view => {
        const path = view.page_path;
        pageViewsCount[path] = (pageViewsCount[path] || 0) + 1;
      });

      // Count devices
      const deviceCount = {};
      deviceBreakdown.forEach(device => {
        const type = device.device_type;
        deviceCount[type] = (deviceCount[type] || 0) + 1;
      });

      return {
        activeVisitors: activeVisitorsCount,
        totalPageViewsToday: todayViews.length,
        uniqueVisitorsToday,
        pageViewsByPath: Object.entries(pageViewsCount)
          .map(([path, count]) => ({ path, count, title: pageViewsByPath.find(p => p.page_path === path)?.page_title || path }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10), // Top 10 pages
        deviceBreakdown: deviceCount,
        lastUpdated: now.toISOString()
      };
    } catch (error) {
      console.error('Error getting real-time analytics:', error);
      return {
        activeVisitors: 0,
        totalPageViewsToday: 0,
        uniqueVisitorsToday: 0,
        pageViewsByPath: [],
        deviceBreakdown: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Get historical analytics
  async getHistoricalAnalytics(days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('page_views')
        .select('created_at, page_path, session_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const dailyData = {};
      data.forEach(view => {
        const date = new Date(view.created_at).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            pageViews: 0,
            uniqueVisitors: new Set()
          };
        }
        dailyData[date].pageViews++;
        dailyData[date].uniqueVisitors.add(view.session_id);
      });

      // Convert to array format
      const chartData = Object.values(dailyData).map(day => ({
        date: day.date,
        pageViews: day.pageViews,
        uniqueVisitors: day.uniqueVisitors.size
      }));

      return chartData;
    } catch (error) {
      console.error('Error getting historical analytics:', error);
      return [];
    }
  }

  // Get visitor sessions data
  async getVisitorSessions() {
    try {
      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('last_visit_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting visitor sessions:', error);
      return [];
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService; 