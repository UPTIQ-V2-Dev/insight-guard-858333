import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type { Transaction, TransactionFilters, BulkActionRequest, TransactionExportRequest } from '@/types/transaction';

const TRANSACTIONS_BASE_URL = '/api/transactions';

export const transactionsService = {
    getTransactions: async (
        page = 1,
        limit = 20,
        filters?: TransactionFilters
    ): Promise<PaginatedResponse<Transaction>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            // Return mock data for development
            const mockTransactions: Transaction[] = Array.from({ length: limit }, (_, i) => ({
                id: `txn_${page}_${i + 1}`,
                amount: Math.floor(Math.random() * 10000) + 100,
                currency: 'USD',
                type: ['credit', 'debit', 'transfer', 'payment'][Math.floor(Math.random() * 4)] as Transaction['type'],
                status: ['pending', 'completed', 'failed', 'suspicious'][
                    Math.floor(Math.random() * 4)
                ] as Transaction['status'],
                merchantId: `merchant_${Math.floor(Math.random() * 100)}`,
                merchantName: `Merchant ${Math.floor(Math.random() * 100)}`,
                customerId: `customer_${Math.floor(Math.random() * 500)}`,
                customerName: `Customer ${Math.floor(Math.random() * 500)}`,
                timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                description: `Transaction ${i + 1}`,
                category: ['retail', 'online', 'grocery', 'gas'][Math.floor(Math.random() * 4)],
                riskScore: Math.floor(Math.random() * 100),
                fraudProbability: Math.random(),
                location: `City ${Math.floor(Math.random() * 50)}`,
                cardLast4: `${Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, '0')}`
            }));

            return {
                results: mockTransactions,
                page,
                limit,
                totalPages: 10,
                totalResults: 200
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        params.append(key, JSON.stringify(value));
                    } else if (Array.isArray(value)) {
                        value.forEach(v => params.append(`${key}[]`, v.toString()));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });
        }

        return api.get(`${TRANSACTIONS_BASE_URL}?${params.toString()}`);
    },

    getTransaction: async (id: string): Promise<Transaction> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                id,
                amount: 1234.56,
                currency: 'USD',
                type: 'payment',
                status: 'completed',
                merchantId: 'merchant_123',
                merchantName: 'Test Merchant',
                customerId: 'customer_456',
                customerName: 'John Doe',
                timestamp: new Date().toISOString(),
                description: 'Test transaction',
                category: 'retail',
                riskScore: 25,
                fraudProbability: 0.1,
                location: 'New York, NY',
                cardLast4: '1234',
                authCode: 'AUTH123',
                metadata: { source: 'mobile_app' }
            };
        }

        return api.get(`${TRANSACTIONS_BASE_URL}/${id}`);
    },

    bulkAction: async (request: BulkActionRequest): Promise<{ success: boolean; processed: number }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                success: true,
                processed: request.transactionIds.length
            };
        }

        return api.post(`${TRANSACTIONS_BASE_URL}/bulk-action`, request);
    },

    exportTransactions: async (request: TransactionExportRequest): Promise<{ downloadUrl: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            return {
                downloadUrl: 'https://example.com/mock-export.csv'
            };
        }

        return api.post(`${TRANSACTIONS_BASE_URL}/export`, request);
    }
};
