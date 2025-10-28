import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type {
    Pattern,
    CreatePatternRuleInput,
    UpdatePatternRuleInput,
    PatternInsight,
    PatternVisualization
} from '@/types/pattern';

const PATTERNS_BASE_URL = '/api/patterns';

export const patternsService = {
    getPatterns: async (page = 1, limit = 20): Promise<PaginatedResponse<Pattern>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const mockPatterns: Pattern[] = Array.from({ length: limit }, (_, i) => ({
                id: `pattern_${i + 1}`,
                type: ['frequency', 'amount', 'location', 'time'][Math.floor(Math.random() * 4)] as Pattern['type'],
                name: `Pattern ${i + 1}`,
                description: `Description for pattern ${i + 1}`,
                status: ['active', 'inactive', 'monitoring'][Math.floor(Math.random() * 3)] as Pattern['status'],
                confidence: ['low', 'medium', 'high', 'critical'][
                    Math.floor(Math.random() * 4)
                ] as Pattern['confidence'],
                riskLevel: Math.floor(Math.random() * 100),
                detectionCount: Math.floor(Math.random() * 1000),
                firstDetected: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                lastDetected: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                affectedTransactions: Math.floor(Math.random() * 500),
                affectedCustomers: Math.floor(Math.random() * 100),
                rules: [
                    {
                        id: `rule_${i + 1}`,
                        field: 'amount',
                        operator: 'greater_than',
                        value: 1000
                    }
                ]
            }));

            return {
                results: mockPatterns,
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

        return api.get(`${PATTERNS_BASE_URL}?${params.toString()}`);
    },

    createPatternRule: async (input: CreatePatternRuleInput): Promise<Pattern> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: `pattern_new_${Date.now()}`,
                type: input.type,
                name: input.name,
                description: input.description,
                status: 'active',
                confidence: 'medium',
                riskLevel: 50,
                detectionCount: 0,
                firstDetected: new Date().toISOString(),
                lastDetected: new Date().toISOString(),
                affectedTransactions: 0,
                affectedCustomers: 0,
                rules: input.rules.map((rule, index) => ({
                    ...rule,
                    id: `rule_${index + 1}`
                }))
            };
        }

        return api.post(`${PATTERNS_BASE_URL}/rules`, input);
    },

    updatePatternRule: async (id: string, input: UpdatePatternRuleInput): Promise<Pattern> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id,
                type: input.type || 'frequency',
                name: input.name || 'Updated Pattern',
                description: input.description || 'Updated description',
                status: 'active',
                confidence: 'medium',
                riskLevel: 50,
                detectionCount: 10,
                firstDetected: new Date().toISOString(),
                lastDetected: new Date().toISOString(),
                affectedTransactions: 5,
                affectedCustomers: 2,
                rules: [
                    {
                        id: 'rule_1',
                        field: 'amount',
                        operator: 'greater_than',
                        value: 1000
                    }
                ]
            };
        }

        return api.put(`${PATTERNS_BASE_URL}/rules/${id}`, input);
    },

    deletePatternRule: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return;
        }

        return api.delete(`${PATTERNS_BASE_URL}/rules/${id}`);
    },

    getAIInsights: async (): Promise<PatternInsight[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return [
                {
                    id: 'insight_1',
                    type: 'anomaly',
                    title: 'Unusual Transaction Volume',
                    description: 'Detected 300% increase in transaction volume for merchant_123',
                    impact: 'high',
                    confidence: 0.85,
                    generatedAt: new Date().toISOString(),
                    data: { merchantId: 'merchant_123', increase: 3.0 }
                },
                {
                    id: 'insight_2',
                    type: 'trend',
                    title: 'Emerging Fraud Pattern',
                    description: 'New pattern detected: Multiple small transactions from same IP',
                    impact: 'medium',
                    confidence: 0.72,
                    generatedAt: new Date().toISOString(),
                    data: { ipAddress: '192.168.1.1', transactionCount: 15 }
                }
            ];
        }

        return api.get(`${PATTERNS_BASE_URL}/ai-insights`);
    },

    getPatternHistory: async (patternId: string, days = 30): Promise<any[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return Array.from({ length: days }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                detections: Math.floor(Math.random() * 50),
                riskScore: Math.floor(Math.random() * 100)
            }));
        }

        const params = new URLSearchParams({
            days: days.toString()
        });

        return api.get(`${PATTERNS_BASE_URL}/${patternId}/history?${params.toString()}`);
    },

    getPatternVisualization: async (patternId: string): Promise<PatternVisualization> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                chartType: 'line',
                data: Array.from({ length: 30 }, (_, i) => ({
                    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 100)
                })),
                config: {
                    xAxis: 'date',
                    yAxis: 'value',
                    title: 'Pattern Detection Trend'
                }
            };
        }

        return api.get(`${PATTERNS_BASE_URL}/${patternId}/visualization`);
    }
};
