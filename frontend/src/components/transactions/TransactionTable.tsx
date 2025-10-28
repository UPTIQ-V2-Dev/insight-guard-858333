import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import type { Transaction } from '@/types/transaction';

type TransactionTableProps = {
    transactions: Transaction[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onViewTransaction: (transaction: Transaction) => void;
    onBulkSelect: (transactionIds: string[]) => void;
    selectedTransactions: string[];
    isLoading?: boolean;
};

type SortConfig = {
    key: keyof Transaction;
    direction: 'asc' | 'desc';
};

export const TransactionTable = ({
    transactions,
    totalPages,
    currentPage,
    onPageChange,
    onViewTransaction,
    onBulkSelect,
    selectedTransactions,
    isLoading = false
}: TransactionTableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'timestamp', direction: 'desc' });

    const getStatusBadgeColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'failed':
                return 'destructive';
            case 'suspicious':
                return 'outline';
            case 'flagged':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getTypeBadgeColor = (type: Transaction['type']) => {
        switch (type) {
            case 'credit':
                return 'default';
            case 'debit':
                return 'secondary';
            case 'transfer':
                return 'outline';
            case 'payment':
                return 'default';
            case 'withdrawal':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRiskColor = (riskScore?: number) => {
        if (!riskScore) return 'text-gray-500';
        if (riskScore >= 75) return 'text-red-600';
        if (riskScore >= 50) return 'text-orange-500';
        if (riskScore >= 25) return 'text-yellow-500';
        return 'text-green-600';
    };

    const handleSort = (key: keyof Transaction) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onBulkSelect(transactions.map(t => t.id));
        } else {
            onBulkSelect([]);
        }
    };

    const handleSelectTransaction = (transactionId: string, checked: boolean) => {
        if (checked) {
            onBulkSelect([...selectedTransactions, transactionId]);
        } else {
            onBulkSelect(selectedTransactions.filter(id => id !== transactionId));
        }
    };

    const isAllSelected = transactions.length > 0 && selectedTransactions.length === transactions.length;
    const isIndeterminate = selectedTransactions.length > 0 && selectedTransactions.length < transactions.length;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className='h-12 bg-gray-100 rounded animate-pulse'
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    Transactions
                    {selectedTransactions.length > 0 && (
                        <Badge variant='secondary'>{selectedTransactions.length} selected</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-12'>
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleSort('id')}
                                        className='flex items-center gap-1'
                                    >
                                        ID
                                        <ArrowUpDown className='h-4 w-4' />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleSort('amount')}
                                        className='flex items-center gap-1'
                                    >
                                        Amount
                                        <ArrowUpDown className='h-4 w-4' />
                                    </Button>
                                </TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Merchant</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleSort('timestamp')}
                                        className='flex items-center gap-1'
                                    >
                                        Date
                                        <ArrowUpDown className='h-4 w-4' />
                                    </Button>
                                </TableHead>
                                <TableHead>Risk Score</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(transaction => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTransactions.includes(transaction.id)}
                                            onCheckedChange={checked =>
                                                handleSelectTransaction(transaction.id, !!checked)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className='font-mono text-sm'>{transaction.id.slice(-8)}</TableCell>
                                    <TableCell className='font-semibold'>
                                        {formatAmount(transaction.amount, transaction.currency)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getTypeBadgeColor(transaction.type)}>{transaction.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeColor(transaction.status)}>
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='max-w-32 truncate'>{transaction.merchantName || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='max-w-32 truncate'>{transaction.customerName || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell className='text-sm text-gray-600'>
                                        {formatDate(transaction.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={getRiskColor(transaction.riskScore)}>
                                            {transaction.riskScore || 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => onViewTransaction(transaction)}
                                        >
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className='flex items-center justify-between mt-4'>
                    <div className='text-sm text-gray-600'>Showing {transactions.length} transactions</div>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className='h-4 w-4' />
                            Previous
                        </Button>
                        <div className='flex items-center gap-1 text-sm'>
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
