export type AnalyticsMetric = {
    id: string;
    name: string;
    description: string;
    category: string;
    dataType: 'number' | 'percentage' | 'currency' | 'count';
    aggregationType: 'sum' | 'avg' | 'min' | 'max' | 'count';
};

export type ReportType = 'transaction' | 'fraud' | 'pattern' | 'customer' | 'merchant' | 'custom';

export type Report = {
    id: string;
    name: string;
    description: string;
    type: ReportType;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    isScheduled: boolean;
    schedule?: ReportSchedule;
    filters: Record<string, any>;
    metrics: string[];
    visualization: ReportVisualization;
    lastRunAt?: string;
    nextRunAt?: string;
};

export type ReportSchedule = {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    recipients: string[];
    format: 'pdf' | 'csv' | 'excel';
};

export type ReportVisualization = {
    chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'table' | 'heatmap';
    groupBy?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
};

export type AnalyticsQuery = {
    metrics: string[];
    dimensions: string[];
    filters: Record<string, any>;
    dateRange: {
        from: string;
        to: string;
    };
    groupBy?: string[];
    limit?: number;
    offset?: number;
};

export type AnalyticsResult = {
    data: any[];
    summary: Record<string, any>;
    metadata: {
        totalRows: number;
        executionTime: number;
        query: string;
    };
};

export type CreateReportInput = {
    name: string;
    description: string;
    type: ReportType;
    filters: Record<string, any>;
    metrics: string[];
    visualization: ReportVisualization;
    schedule?: ReportSchedule;
};

export type UpdateReportInput = Partial<CreateReportInput>;
