export type NotificationChannel = 'email' | 'sms' | 'push' | 'webhook';

export type NotificationSettings = {
    channels: NotificationChannel[];
    fraudAlerts: boolean;
    patternDetection: boolean;
    systemUpdates: boolean;
    reportGeneration: boolean;
    thresholds: {
        highRisk: boolean;
        mediumRisk: boolean;
        lowRisk: boolean;
    };
};

export type UserPreferences = {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    dashboardLayout: 'default' | 'compact' | 'detailed';
};

export type SystemConfiguration = {
    riskThresholds: {
        low: number;
        medium: number;
        high: number;
    };
    fraudDetection: {
        enabled: boolean;
        sensitivity: 'low' | 'medium' | 'high';
        autoBlock: boolean;
        reviewThreshold: number;
    };
    patternAnalysis: {
        enabled: boolean;
        aiInsights: boolean;
        historicalDays: number;
        confidenceThreshold: number;
    };
    dataRetention: {
        transactionDays: number;
        alertDays: number;
        reportDays: number;
    };
};

export type Integration = {
    id: string;
    name: string;
    type: 'webhook' | 'api' | 'database' | 'message_queue';
    status: 'active' | 'inactive' | 'error';
    config: Record<string, any>;
    lastSync?: string;
    errorMessage?: string;
};

export type ApiKey = {
    id: string;
    name: string;
    keyPreview: string;
    permissions: string[];
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
    isActive: boolean;
};

export type UserSettings = {
    id: string;
    userId: string;
    preferences: UserPreferences;
    notifications: NotificationSettings;
    security: {
        twoFactorEnabled: boolean;
        sessionTimeout: number;
        ipWhitelist: string[];
    };
};

export type CreateApiKeyInput = {
    name: string;
    permissions: string[];
    expiresAt?: string;
};

export type CreateIntegrationInput = {
    name: string;
    type: Integration['type'];
    config: Record<string, any>;
};

export type UpdateIntegrationInput = Partial<CreateIntegrationInput>;
