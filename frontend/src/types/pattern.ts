export type PatternType = 'frequency' | 'amount' | 'location' | 'time' | 'merchant' | 'velocity' | 'behavioral';

export type PatternStatus = 'active' | 'inactive' | 'monitoring' | 'resolved';

export type PatternConfidence = 'low' | 'medium' | 'high' | 'critical';

export type Pattern = {
    id: string;
    type: PatternType;
    name: string;
    description: string;
    status: PatternStatus;
    confidence: PatternConfidence;
    riskLevel: number;
    detectionCount: number;
    firstDetected: string;
    lastDetected: string;
    affectedTransactions: number;
    affectedCustomers: number;
    rules: PatternRule[];
    metadata?: Record<string, any>;
};

export type PatternRule = {
    id: string;
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
    value: any;
    threshold?: number;
};

export type CreatePatternRuleInput = {
    name: string;
    description: string;
    type: PatternType;
    rules: Omit<PatternRule, 'id'>[];
    isActive?: boolean;
};

export type UpdatePatternRuleInput = Partial<CreatePatternRuleInput>;

export type PatternInsight = {
    id: string;
    type: 'anomaly' | 'trend' | 'cluster' | 'prediction';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    confidence: number;
    generatedAt: string;
    data: any;
};

export type PatternVisualization = {
    chartType: 'line' | 'bar' | 'scatter' | 'heatmap' | 'network';
    data: any[];
    config: Record<string, any>;
};
