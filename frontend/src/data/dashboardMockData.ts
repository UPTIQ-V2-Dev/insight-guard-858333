import { DashboardData, DashboardMetrics, TransactionTrend, FraudAlert, PatternInsight } from '../types/dashboard';

export const mockDashboardMetrics: DashboardMetrics = {
    totalTransactions: 45632,
    totalVolume: 2847563.89,
    fraudAlerts: 127,
    patternDetections: 43,
    successRate: 98.7,
    averageTransactionValue: 62.43
};

export const mockTransactionTrends: TransactionTrend[] = [
    { date: '2024-01-01', volume: 234567.89, transactions: 3456, fraudCount: 12 },
    { date: '2024-01-02', volume: 245678.9, transactions: 3678, fraudCount: 8 },
    { date: '2024-01-03', volume: 256789.01, transactions: 3890, fraudCount: 15 },
    { date: '2024-01-04', volume: 267890.12, transactions: 4012, fraudCount: 6 },
    { date: '2024-01-05', volume: 278901.23, transactions: 4234, fraudCount: 19 },
    { date: '2024-01-06', volume: 289012.34, transactions: 4456, fraudCount: 11 },
    { date: '2024-01-07', volume: 300123.45, transactions: 4678, fraudCount: 7 }
];

export const mockFraudAlerts: FraudAlert[] = [
    {
        id: 'alert-001',
        transactionId: 'txn-12345',
        type: 'velocity',
        severity: 'high',
        description: 'Unusual transaction velocity detected - 15 transactions in 2 minutes',
        timestamp: '2024-01-07T14:30:00Z',
        status: 'new',
        riskScore: 85
    },
    {
        id: 'alert-002',
        transactionId: 'txn-12346',
        type: 'amount',
        severity: 'critical',
        description: "Transaction amount significantly exceeds user's typical spending pattern",
        timestamp: '2024-01-07T14:15:00Z',
        status: 'investigating',
        riskScore: 95
    },
    {
        id: 'alert-003',
        transactionId: 'txn-12347',
        type: 'location',
        severity: 'medium',
        description: 'Transaction from unusual geographic location',
        timestamp: '2024-01-07T13:45:00Z',
        status: 'new',
        riskScore: 72
    },
    {
        id: 'alert-004',
        transactionId: 'txn-12348',
        type: 'merchant',
        severity: 'low',
        description: 'First-time merchant interaction with high-risk category',
        timestamp: '2024-01-07T13:20:00Z',
        status: 'resolved',
        riskScore: 58
    }
];

export const mockPatternInsights: PatternInsight[] = [
    {
        id: 'pattern-001',
        type: 'recurring',
        description: 'Recurring transaction pattern identified for merchant "Coffee Shop Chain"',
        confidence: 0.94,
        affectedTransactions: 156,
        timestamp: '2024-01-07T12:00:00Z',
        metadata: { merchantId: 'merch-789', frequency: 'daily' }
    },
    {
        id: 'pattern-002',
        type: 'anomaly',
        description: 'Anomalous spending pattern detected during late-night hours',
        confidence: 0.87,
        affectedTransactions: 23,
        timestamp: '2024-01-07T11:30:00Z',
        metadata: { timeRange: '23:00-03:00', avgAmount: '245.67' }
    },
    {
        id: 'pattern-003',
        type: 'cluster',
        description: 'Geographic clustering of transactions suggesting coordinated activity',
        confidence: 0.91,
        affectedTransactions: 89,
        timestamp: '2024-01-07T10:15:00Z',
        metadata: { location: 'Downtown District', radius: '2km' }
    }
];

export const mockDashboardData: DashboardData = {
    metrics: mockDashboardMetrics,
    trends: mockTransactionTrends,
    recentAlerts: mockFraudAlerts,
    patternInsights: mockPatternInsights
};
