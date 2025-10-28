import { api } from '@/lib/api';
import type {
    UserSettings,
    SystemConfiguration,
    Integration,
    ApiKey,
    CreateApiKeyInput,
    CreateIntegrationInput,
    UpdateIntegrationInput
} from '@/types/settings';

const SETTINGS_BASE_URL = '/api/settings';

export const settingsService = {
    getUserSettings: async (): Promise<UserSettings> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: 'settings_1',
                userId: 'user_123',
                preferences: {
                    theme: 'light',
                    language: 'en',
                    timezone: 'UTC',
                    dateFormat: 'MM/DD/YYYY',
                    numberFormat: 'en-US',
                    dashboardLayout: 'default'
                },
                notifications: {
                    channels: ['email', 'push'],
                    fraudAlerts: true,
                    patternDetection: true,
                    systemUpdates: false,
                    reportGeneration: true,
                    thresholds: {
                        highRisk: true,
                        mediumRisk: true,
                        lowRisk: false
                    }
                },
                security: {
                    twoFactorEnabled: true,
                    sessionTimeout: 30,
                    ipWhitelist: []
                }
            };
        }

        return api.get(`${SETTINGS_BASE_URL}/user`);
    },

    updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: 'settings_1',
                userId: 'user_123',
                preferences: {
                    theme: 'light',
                    language: 'en',
                    timezone: 'UTC',
                    dateFormat: 'MM/DD/YYYY',
                    numberFormat: 'en-US',
                    dashboardLayout: 'default',
                    ...settings.preferences
                },
                notifications: {
                    channels: ['email', 'push'],
                    fraudAlerts: true,
                    patternDetection: true,
                    systemUpdates: false,
                    reportGeneration: true,
                    thresholds: {
                        highRisk: true,
                        mediumRisk: true,
                        lowRisk: false
                    },
                    ...settings.notifications
                },
                security: {
                    twoFactorEnabled: true,
                    sessionTimeout: 30,
                    ipWhitelist: [],
                    ...settings.security
                }
            };
        }

        return api.put(`${SETTINGS_BASE_URL}/user`, settings);
    },

    getSystemConfiguration: async (): Promise<SystemConfiguration> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                riskThresholds: {
                    low: 25,
                    medium: 50,
                    high: 75
                },
                fraudDetection: {
                    enabled: true,
                    sensitivity: 'medium',
                    autoBlock: false,
                    reviewThreshold: 70
                },
                patternAnalysis: {
                    enabled: true,
                    aiInsights: true,
                    historicalDays: 90,
                    confidenceThreshold: 0.7
                },
                dataRetention: {
                    transactionDays: 365,
                    alertDays: 180,
                    reportDays: 90
                }
            };
        }

        return api.get(`${SETTINGS_BASE_URL}/system`);
    },

    updateSystemConfiguration: async (config: Partial<SystemConfiguration>): Promise<SystemConfiguration> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                riskThresholds: {
                    low: 25,
                    medium: 50,
                    high: 75,
                    ...config.riskThresholds
                },
                fraudDetection: {
                    enabled: true,
                    sensitivity: 'medium',
                    autoBlock: false,
                    reviewThreshold: 70,
                    ...config.fraudDetection
                },
                patternAnalysis: {
                    enabled: true,
                    aiInsights: true,
                    historicalDays: 90,
                    confidenceThreshold: 0.7,
                    ...config.patternAnalysis
                },
                dataRetention: {
                    transactionDays: 365,
                    alertDays: 180,
                    reportDays: 90,
                    ...config.dataRetention
                }
            };
        }

        return api.put(`${SETTINGS_BASE_URL}/system`, config);
    },

    getIntegrations: async (): Promise<Integration[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return [
                {
                    id: 'integration_1',
                    name: 'Webhook Alerts',
                    type: 'webhook',
                    status: 'active',
                    config: {
                        url: 'https://example.com/webhook',
                        secret: '***'
                    },
                    lastSync: new Date().toISOString()
                },
                {
                    id: 'integration_2',
                    name: 'External API',
                    type: 'api',
                    status: 'inactive',
                    config: {
                        baseUrl: 'https://api.example.com',
                        apiKey: '***'
                    }
                }
            ];
        }

        return api.get(`${SETTINGS_BASE_URL}/integrations`);
    },

    createIntegration: async (input: CreateIntegrationInput): Promise<Integration> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id: `integration_${Date.now()}`,
                name: input.name,
                type: input.type,
                status: 'inactive',
                config: input.config
            };
        }

        return api.post(`${SETTINGS_BASE_URL}/integrations`, input);
    },

    updateIntegration: async (id: string, input: UpdateIntegrationInput): Promise<Integration> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id,
                name: input.name || 'Updated Integration',
                type: input.type || 'webhook',
                status: 'active',
                config: input.config || {},
                lastSync: new Date().toISOString()
            };
        }

        return api.put(`${SETTINGS_BASE_URL}/integrations/${id}`, input);
    },

    deleteIntegration: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return;
        }

        return api.delete(`${SETTINGS_BASE_URL}/integrations/${id}`);
    },

    getApiKeys: async (): Promise<ApiKey[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return [
                {
                    id: 'key_1',
                    name: 'Production API Key',
                    keyPreview: 'ak_live_1234****',
                    permissions: ['read:transactions', 'read:fraud'],
                    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    isActive: true
                },
                {
                    id: 'key_2',
                    name: 'Development Key',
                    keyPreview: 'ak_test_5678****',
                    permissions: ['read:transactions'],
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    isActive: true
                }
            ];
        }

        return api.get(`${SETTINGS_BASE_URL}/api-keys`);
    },

    createApiKey: async (input: CreateApiKeyInput): Promise<{ apiKey: ApiKey; secretKey: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                apiKey: {
                    id: `key_${Date.now()}`,
                    name: input.name,
                    keyPreview: 'ak_live_****',
                    permissions: input.permissions,
                    createdAt: new Date().toISOString(),
                    isActive: true,
                    expiresAt: input.expiresAt
                },
                secretKey: 'ak_live_1234567890abcdef'
            };
        }

        return api.post(`${SETTINGS_BASE_URL}/api-keys`, input);
    },

    deleteApiKey: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return;
        }

        return api.delete(`${SETTINGS_BASE_URL}/api-keys/${id}`);
    }
};
