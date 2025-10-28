export interface DashboardMetrics {
    totalTransactions: number;
    totalVolume: number;
    fraudAlerts: number;
    patternDetections: number;
    successRate: number;
    averageTransactionValue: number;
}

export interface TransactionTrend {
    date: string;
    volume: number;
    transactions: number;
    fraudCount: number;
}

export interface FraudAlert {
    id: string;
    transactionId: string;
    type: 'velocity' | 'amount' | 'location' | 'merchant' | 'pattern';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: string;
    status: 'new' | 'investigating' | 'resolved' | 'false_positive';
    riskScore: number;
}

export interface PatternInsight {
    id: string;
    type: 'recurring' | 'anomaly' | 'cluster' | 'velocity';
    description: string;
    confidence: number;
    affectedTransactions: number;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

export interface DashboardData {
    metrics: DashboardMetrics;
    trends: TransactionTrend[];
    recentAlerts: FraudAlert[];
    patternInsights: PatternInsight[];
}
