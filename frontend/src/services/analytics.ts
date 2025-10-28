import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type {
    AnalyticsMetric,
    Report,
    AnalyticsQuery,
    AnalyticsResult,
    CreateReportInput,
    UpdateReportInput
} from '@/types/analytics';

const ANALYTICS_BASE_URL = '/api/analytics';

export const analyticsService = {
    getMetrics: async (): Promise<AnalyticsMetric[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return [
                {
                    id: 'total_transactions',
                    name: 'Total Transactions',
                    description: 'Total number of transactions',
                    category: 'transactions',
                    dataType: 'count',
                    aggregationType: 'sum'
                },
                {
                    id: 'total_amount',
                    name: 'Total Amount',
                    description: 'Total transaction amount',
                    category: 'transactions',
                    dataType: 'currency',
                    aggregationType: 'sum'
                },
                {
                    id: 'fraud_rate',
                    name: 'Fraud Rate',
                    description: 'Percentage of fraudulent transactions',
                    category: 'fraud',
                    dataType: 'percentage',
                    aggregationType: 'avg'
                },
                {
                    id: 'avg_transaction_amount',
                    name: 'Average Transaction Amount',
                    description: 'Average amount per transaction',
                    category: 'transactions',
                    dataType: 'currency',
                    aggregationType: 'avg'
                }
            ];
        }

        return api.get(`${ANALYTICS_BASE_URL}/metrics`);
    },

    executeQuery: async (query: AnalyticsQuery): Promise<AnalyticsResult> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const mockData = Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                transactions: Math.floor(Math.random() * 1000) + 100,
                amount: Math.floor(Math.random() * 100000) + 10000,
                fraudRate: Math.random() * 0.05
            }));

            return {
                data: mockData,
                summary: {
                    totalTransactions: mockData.reduce((sum, row) => sum + row.transactions, 0),
                    totalAmount: mockData.reduce((sum, row) => sum + row.amount, 0),
                    avgFraudRate: mockData.reduce((sum, row) => sum + row.fraudRate, 0) / mockData.length
                },
                metadata: {
                    totalRows: mockData.length,
                    executionTime: 150,
                    query: JSON.stringify(query)
                }
            };
        }

        return api.post(`${ANALYTICS_BASE_URL}/query`, query);
    },

    getReports: async (page = 1, limit = 20): Promise<PaginatedResponse<Report>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const mockReports: Report[] = Array.from({ length: limit }, (_, i) => ({
                id: `report_${i + 1}`,
                name: `Report ${i + 1}`,
                description: `Description for report ${i + 1}`,
                type: ['transaction', 'fraud', 'pattern', 'customer'][Math.floor(Math.random() * 4)] as Report['type'],
                createdBy: `user_${Math.floor(Math.random() * 10)}`,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                isScheduled: Math.random() > 0.5,
                filters: {},
                metrics: ['total_transactions', 'total_amount'],
                visualization: {
                    chartType: 'line',
                    groupBy: ['date'],
                    sortBy: 'date',
                    sortOrder: 'asc'
                },
                lastRunAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            }));

            return {
                results: mockReports,
                page,
                limit,
                totalPages: 5,
                totalResults: 50
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        return api.get(`${ANALYTICS_BASE_URL}/reports?${params.toString()}`);
    },

    createReport: async (input: CreateReportInput): Promise<Report> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: `report_new_${Date.now()}`,
                name: input.name,
                description: input.description,
                type: input.type,
                createdBy: 'current_user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isScheduled: !!input.schedule,
                schedule: input.schedule,
                filters: input.filters,
                metrics: input.metrics,
                visualization: input.visualization
            };
        }

        return api.post(`${ANALYTICS_BASE_URL}/reports`, input);
    },

    updateReport: async (id: string, input: UpdateReportInput): Promise<Report> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id,
                name: input.name || 'Updated Report',
                description: input.description || 'Updated description',
                type: input.type || 'custom',
                createdBy: 'current_user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isScheduled: !!input.schedule,
                schedule: input.schedule,
                filters: input.filters || {},
                metrics: input.metrics || [],
                visualization: input.visualization || { chartType: 'table' }
            };
        }

        return api.put(`${ANALYTICS_BASE_URL}/reports/${id}`, input);
    },

    deleteReport: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return;
        }

        return api.delete(`${ANALYTICS_BASE_URL}/reports/${id}`);
    },

    exportReport: async (
        reportId: string,
        format: 'pdf' | 'csv' | 'excel' = 'csv'
    ): Promise<{ downloadUrl: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                downloadUrl: `https://example.com/mock-report.${format}`
            };
        }

        return api.post(`${ANALYTICS_BASE_URL}/reports/${reportId}/export`, { format });
    }
};
