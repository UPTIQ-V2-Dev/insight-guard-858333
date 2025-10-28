export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'suspicious' | 'flagged';

export type TransactionType = 'credit' | 'debit' | 'transfer' | 'payment' | 'withdrawal';

export type Transaction = {
    id: string;
    amount: number;
    currency: string;
    type: TransactionType;
    status: TransactionStatus;
    merchantId?: string;
    merchantName?: string;
    customerId: string;
    customerName?: string;
    timestamp: string;
    description?: string;
    category?: string;
    riskScore?: number;
    fraudProbability?: number;
    location?: string;
    ipAddress?: string;
    deviceId?: string;
    cardLast4?: string;
    authCode?: string;
    metadata?: Record<string, any>;
};

export type TransactionFilters = {
    dateRange?: {
        from: string;
        to: string;
    };
    amountRange?: {
        min?: number;
        max?: number;
    };
    status?: TransactionStatus[];
    type?: TransactionType[];
    merchantIds?: string[];
    customerIds?: string[];
    riskScoreRange?: {
        min?: number;
        max?: number;
    };
    search?: string;
};

export type BulkActionType = 'approve' | 'reject' | 'flag' | 'investigate';

export type BulkActionRequest = {
    transactionIds: string[];
    action: BulkActionType;
    reason?: string;
};

export type TransactionExportFormat = 'csv' | 'pdf' | 'excel';

export type TransactionExportRequest = {
    format: TransactionExportFormat;
    filters?: TransactionFilters;
    includeMetadata?: boolean;
};
