import { api } from '../lib/api';
import { DashboardData, DashboardMetrics, TransactionTrend, FraudAlert, PatternInsight } from '../types/dashboard';
import { mockDashboardData } from '../data/dashboardMockData';

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockDashboardData.metrics;
    }

    const response = await api.get<DashboardMetrics>('/api/dashboard/metrics');
    return response.data;
};

export const getDashboardTrends = async (): Promise<TransactionTrend[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockDashboardData.trends;
    }

    const response = await api.get<TransactionTrend[]>('/api/dashboard/trends');
    return response.data;
};

export const getRecentFraudAlerts = async (): Promise<FraudAlert[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockDashboardData.recentAlerts;
    }

    const response = await api.get<FraudAlert[]>('/api/dashboard/alerts/recent');
    return response.data;
};

export const getPatternInsights = async (): Promise<PatternInsight[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockDashboardData.patternInsights;
    }

    const response = await api.get<PatternInsight[]>('/api/dashboard/patterns');
    return response.data;
};

export const getDashboardData = async (): Promise<DashboardData> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockDashboardData;
    }

    const [metrics, trends, recentAlerts, patternInsights] = await Promise.all([
        getDashboardMetrics(),
        getDashboardTrends(),
        getRecentFraudAlerts(),
        getPatternInsights()
    ]);

    return {
        metrics,
        trends,
        recentAlerts,
        patternInsights
    };
};
