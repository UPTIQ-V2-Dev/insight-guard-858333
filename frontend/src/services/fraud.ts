import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type {
    FraudAlert,
    FraudRule,
    InvestigationCase,
    CreateFraudRuleInput,
    UpdateFraudRuleInput
} from '@/types/fraud';

const FRAUD_BASE_URL = '/api/fraud';

export const fraudService = {
    getFraudAlerts: async (
        page = 1,
        limit = 20,
        status?: string,
        severity?: string
    ): Promise<PaginatedResponse<FraudAlert>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const mockAlerts: FraudAlert[] = Array.from({ length: limit }, (_, i) => ({
                id: `alert_${page}_${i + 1}`,
                transactionId: `txn_${Math.floor(Math.random() * 1000)}`,
                customerId: `customer_${Math.floor(Math.random() * 500)}`,
                title: `Fraud Alert ${i + 1}`,
                description: `Suspicious activity detected for transaction ${i + 1}`,
                severity: ['low', 'medium', 'high', 'critical'][
                    Math.floor(Math.random() * 4)
                ] as FraudAlert['severity'],
                status: ['open', 'investigating', 'resolved', 'false_positive'][
                    Math.floor(Math.random() * 4)
                ] as FraudAlert['status'],
                riskScore: Math.floor(Math.random() * 100),
                fraudProbability: Math.random(),
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                triggers: ['velocity_check', 'amount_threshold', 'location_anomaly']
            }));

            return {
                results: mockAlerts,
                page,
                limit,
                totalPages: 8,
                totalResults: 160
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (status) params.append('status', status);
        if (severity) params.append('severity', severity);

        return api.get(`${FRAUD_BASE_URL}/alerts?${params.toString()}`);
    },

    updateAlertStatus: async (
        alertId: string,
        status: FraudAlert['status'],
        resolution?: string
    ): Promise<FraudAlert> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: alertId,
                transactionId: 'txn_123',
                customerId: 'customer_456',
                title: 'Updated Alert',
                description: 'Alert status updated',
                severity: 'medium',
                status,
                riskScore: 75,
                fraudProbability: 0.75,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                resolution,
                triggers: ['velocity_check']
            };
        }

        return api.put(`${FRAUD_BASE_URL}/alerts/${alertId}/status`, { status, resolution });
    },

    startInvestigation: async (alertId: string): Promise<InvestigationCase> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: `case_${Date.now()}`,
                alertId,
                investigatorId: 'user_123',
                status: 'open',
                priority: 'medium',
                findings: '',
                evidence: [],
                createdAt: new Date().toISOString()
            };
        }

        return api.post(`${FRAUD_BASE_URL}/investigate`, { alertId });
    },

    getFraudRules: async (page = 1, limit = 20): Promise<PaginatedResponse<FraudRule>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const mockRules: FraudRule[] = Array.from({ length: limit }, (_, i) => ({
                id: `rule_${i + 1}`,
                name: `Fraud Rule ${i + 1}`,
                description: `Description for fraud rule ${i + 1}`,
                isActive: Math.random() > 0.3,
                conditions: [
                    {
                        field: 'amount',
                        operator: 'greater_than',
                        value: 1000
                    }
                ],
                actions: [
                    {
                        type: 'alert',
                        severity: 'high',
                        message: 'High-value transaction detected'
                    }
                ],
                priority: Math.floor(Math.random() * 10) + 1,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                triggeredCount: Math.floor(Math.random() * 100),
                falsePositiveRate: Math.random() * 0.3
            }));

            return {
                results: mockRules,
                page,
                limit,
                totalPages: 3,
                totalResults: 25
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        return api.get(`${FRAUD_BASE_URL}/rules?${params.toString()}`);
    },

    createFraudRule: async (input: CreateFraudRuleInput): Promise<FraudRule> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: `rule_new_${Date.now()}`,
                name: input.name,
                description: input.description,
                isActive: input.isActive ?? true,
                conditions: input.conditions,
                actions: input.actions,
                priority: input.priority,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                triggeredCount: 0,
                falsePositiveRate: 0
            };
        }

        return api.post(`${FRAUD_BASE_URL}/rules`, input);
    },

    updateFraudRule: async (id: string, input: UpdateFraudRuleInput): Promise<FraudRule> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id,
                name: input.name || 'Updated Rule',
                description: input.description || 'Updated description',
                isActive: input.isActive ?? true,
                conditions: input.conditions || [],
                actions: input.actions || [],
                priority: input.priority || 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                triggeredCount: 5,
                falsePositiveRate: 0.1
            };
        }

        return api.put(`${FRAUD_BASE_URL}/rules/${id}`, input);
    },

    deleteFraudRule: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return;
        }

        return api.delete(`${FRAUD_BASE_URL}/rules/${id}`);
    }
};
