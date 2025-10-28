import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { FraudAlert } from '@/types/fraud';

type FraudAlertsTableProps = {
    alerts: FraudAlert[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onViewAlert: (alert: FraudAlert) => void;
    onStatusChange: (alertId: string, status: FraudAlert['status']) => void;
    onFilterChange: (filters: { status?: string; severity?: string }) => void;
    isLoading?: boolean;
};

export const FraudAlertsTable = ({
    alerts,
    totalPages,
    currentPage,
    onPageChange,
    onViewAlert,
    onStatusChange,
    onFilterChange,
    isLoading = false
}: FraudAlertsTableProps) => {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [severityFilter, setSeverityFilter] = useState<string>('');

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        onFilterChange({ status: value || undefined, severity: severityFilter || undefined });
    };

    const handleSeverityFilterChange = (value: string) => {
        setSeverityFilter(value);
        onFilterChange({ status: statusFilter || undefined, severity: value || undefined });
    };

    const getStatusIcon = (status: FraudAlert['status']) => {
        switch (status) {
            case 'open':
                return <AlertTriangle className='h-4 w-4 text-red-500' />;
            case 'investigating':
                return <Clock className='h-4 w-4 text-yellow-500' />;
            case 'resolved':
                return <CheckCircle className='h-4 w-4 text-green-500' />;
            case 'false_positive':
                return <CheckCircle className='h-4 w-4 text-gray-500' />;
            default:
                return null;
        }
    };

    const getStatusBadgeColor = (status: FraudAlert['status']) => {
        switch (status) {
            case 'open':
                return 'destructive';
            case 'investigating':
                return 'default';
            case 'resolved':
                return 'secondary';
            case 'false_positive':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getSeverityBadgeColor = (severity: FraudAlert['severity']) => {
        switch (severity) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRiskColor = (riskScore: number) => {
        if (riskScore >= 75) return 'text-red-600 font-semibold';
        if (riskScore >= 50) return 'text-orange-500 font-semibold';
        if (riskScore >= 25) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Fraud Alerts</CardTitle>
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
                <div className='flex items-center justify-between'>
                    <CardTitle>Fraud Alerts</CardTitle>
                    <div className='flex gap-2'>
                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusFilterChange}
                        >
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='All statuses' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All statuses</SelectItem>
                                <SelectItem value='open'>Open</SelectItem>
                                <SelectItem value='investigating'>Investigating</SelectItem>
                                <SelectItem value='resolved'>Resolved</SelectItem>
                                <SelectItem value='false_positive'>False Positive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={severityFilter}
                            onValueChange={handleSeverityFilterChange}
                        >
                            <SelectTrigger className='w-40'>
                                <SelectValue placeholder='All severities' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All severities</SelectItem>
                                <SelectItem value='critical'>Critical</SelectItem>
                                <SelectItem value='high'>High</SelectItem>
                                <SelectItem value='medium'>Medium</SelectItem>
                                <SelectItem value='low'>Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Alert ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Risk Score</TableHead>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alerts.map(alert => (
                                <TableRow
                                    key={alert.id}
                                    className='hover:bg-gray-50'
                                >
                                    <TableCell className='font-mono text-sm'>{alert.id.slice(-8)}</TableCell>
                                    <TableCell>
                                        <div className='max-w-48 truncate font-medium'>{alert.title}</div>
                                        <div className='text-sm text-gray-600 max-w-48 truncate'>
                                            {alert.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getSeverityBadgeColor(alert.severity)}>{alert.severity}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            {getStatusIcon(alert.status)}
                                            <Badge variant={getStatusBadgeColor(alert.status)}>
                                                {alert.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={getRiskColor(alert.riskScore)}>{alert.riskScore}</span>
                                    </TableCell>
                                    <TableCell className='font-mono text-sm'>{alert.transactionId.slice(-8)}</TableCell>
                                    <TableCell className='text-sm text-gray-600'>
                                        {formatDate(alert.createdAt)}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex items-center gap-2 justify-end'>
                                            <Select
                                                value={alert.status}
                                                onValueChange={value =>
                                                    onStatusChange(alert.id, value as FraudAlert['status'])
                                                }
                                            >
                                                <SelectTrigger className='w-32 h-8'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='open'>Open</SelectItem>
                                                    <SelectItem value='investigating'>Investigating</SelectItem>
                                                    <SelectItem value='resolved'>Resolved</SelectItem>
                                                    <SelectItem value='false_positive'>False Positive</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => onViewAlert(alert)}
                                            >
                                                <Eye className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className='flex items-center justify-between mt-4'>
                    <div className='text-sm text-gray-600'>Showing {alerts.length} alerts</div>
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
