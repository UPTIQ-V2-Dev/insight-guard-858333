import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionDetails } from '@/components/transactions/TransactionDetails';
import { BulkActions } from '@/components/transactions/BulkActions';
import { transactionsService } from '@/services/transactions';
import type {
    Transaction,
    TransactionFilters as TFilters,
    BulkActionType,
    TransactionExportFormat
} from '@/types/transaction';

export const TransactionAnalysisPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<TFilters>({});
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const queryClient = useQueryClient();
    const pageSize = 20;

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', currentPage, pageSize, filters],
        queryFn: () => transactionsService.getTransactions(currentPage, pageSize, filters)
    });

    const bulkActionMutation = useMutation({
        mutationFn: ({ action, reason }: { action: BulkActionType; reason?: string }) =>
            transactionsService.bulkAction({
                transactionIds: selectedTransactions,
                action,
                reason
            }),
        onSuccess: result => {
            toast.success(`Successfully processed ${result.processed} transactions`);
            setSelectedTransactions([]);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: error => {
            toast.error('Failed to process bulk action');
            console.error('Bulk action error:', error);
        }
    });

    const exportMutation = useMutation({
        mutationFn: (format: TransactionExportFormat) =>
            transactionsService.exportTransactions({
                format,
                filters,
                includeMetadata: true
            }),
        onSuccess: result => {
            window.open(result.downloadUrl, '_blank');
            toast.success(`Export started. Download will begin shortly.`);
        },
        onError: error => {
            toast.error('Failed to export transactions');
            console.error('Export error:', error);
        }
    });

    const handleFiltersChange = (newFilters: TFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        setSelectedTransactions([]);
    };

    const handleClearFilters = () => {
        setFilters({});
        setCurrentPage(1);
        setSelectedTransactions([]);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedTransactions([]);
    };

    const handleViewTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailsOpen(true);
    };

    const handleBulkAction = (action: BulkActionType, reason?: string) => {
        bulkActionMutation.mutate({ action, reason });
    };

    const handleExport = (format: TransactionExportFormat) => {
        exportMutation.mutate(format);
    };

    const handleBulkSelect = (transactionIds: string[]) => {
        setSelectedTransactions(transactionIds);
    };

    const handleClearSelection = () => {
        setSelectedTransactions([]);
    };

    if (error) {
        return (
            <div className='p-6'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-4'>Error Loading Transactions</h2>
                    <p className='text-gray-600'>
                        There was an error loading the transaction data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6 space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Transaction Analysis</h1>
                <p className='text-gray-600'>
                    Monitor and analyze transaction patterns with advanced filtering and fraud detection.
                </p>
            </div>

            <TransactionFilters
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                activeFilters={filters}
            />

            <BulkActions
                selectedCount={selectedTransactions.length}
                onBulkAction={handleBulkAction}
                onExport={handleExport}
                onClearSelection={handleClearSelection}
                isLoading={bulkActionMutation.isPending || exportMutation.isPending}
            />

            <TransactionTable
                transactions={data?.results || []}
                totalPages={data?.totalPages || 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onViewTransaction={handleViewTransaction}
                onBulkSelect={handleBulkSelect}
                selectedTransactions={selectedTransactions}
                isLoading={isLoading}
            />

            <TransactionDetails
                transaction={selectedTransaction}
                isOpen={isDetailsOpen}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setSelectedTransaction(null);
                }}
            />
        </div>
    );
};
