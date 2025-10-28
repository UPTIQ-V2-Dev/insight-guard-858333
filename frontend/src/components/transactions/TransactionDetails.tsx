import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Shield, Clock, User, Building } from 'lucide-react';
import type { Transaction } from '@/types/transaction';

type TransactionDetailsProps = {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
};

export const TransactionDetails = ({ transaction, isOpen, onClose }: TransactionDetailsProps) => {
    if (!transaction) return null;

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

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

    const getRiskColor = (riskScore?: number) => {
        if (!riskScore) return 'text-gray-500';
        if (riskScore >= 75) return 'text-red-600';
        if (riskScore >= 50) return 'text-orange-500';
        if (riskScore >= 25) return 'text-yellow-500';
        return 'text-green-600';
    };

    const getRiskLevel = (riskScore?: number) => {
        if (!riskScore) return 'Unknown';
        if (riskScore >= 75) return 'High Risk';
        if (riskScore >= 50) return 'Medium Risk';
        if (riskScore >= 25) return 'Low Risk';
        return 'Very Low Risk';
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        Transaction Details
                        <Badge variant={getStatusBadgeColor(transaction.status)}>{transaction.status}</Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className='grid gap-6 md:grid-cols-2'>
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <CreditCard className='h-5 w-5' />
                                Transaction Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Transaction ID</p>
                                    <p className='font-mono text-sm'>{transaction.id}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Amount</p>
                                    <p className='font-semibold text-lg'>
                                        {formatAmount(transaction.amount, transaction.currency)}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Type</p>
                                    <p className='capitalize'>{transaction.type}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Category</p>
                                    <p className='capitalize'>{transaction.category || 'N/A'}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className='text-sm text-gray-600'>Description</p>
                                <p>{transaction.description || 'No description provided'}</p>
                            </div>

                            {transaction.authCode && (
                                <div>
                                    <p className='text-sm text-gray-600'>Authorization Code</p>
                                    <p className='font-mono'>{transaction.authCode}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Risk Assessment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Shield className='h-5 w-5' />
                                Risk Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Risk Score</p>
                                    <p className={`font-semibold text-lg ${getRiskColor(transaction.riskScore)}`}>
                                        {transaction.riskScore || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Risk Level</p>
                                    <p className={getRiskColor(transaction.riskScore)}>
                                        {getRiskLevel(transaction.riskScore)}
                                    </p>
                                </div>
                                <div className='col-span-2'>
                                    <p className='text-sm text-gray-600'>Fraud Probability</p>
                                    <p className='font-semibold'>
                                        {transaction.fraudProbability
                                            ? `${(transaction.fraudProbability * 100).toFixed(1)}%`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Merchant Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Building className='h-5 w-5' />
                                Merchant Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <p className='text-sm text-gray-600'>Merchant ID</p>
                                <p className='font-mono text-sm'>{transaction.merchantId || 'N/A'}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Merchant Name</p>
                                <p>{transaction.merchantName || 'N/A'}</p>
                            </div>
                            {transaction.location && (
                                <div className='flex items-start gap-2'>
                                    <MapPin className='h-4 w-4 mt-1 text-gray-600' />
                                    <div>
                                        <p className='text-sm text-gray-600'>Location</p>
                                        <p>{transaction.location}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <User className='h-5 w-5' />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <p className='text-sm text-gray-600'>Customer ID</p>
                                <p className='font-mono text-sm'>{transaction.customerId}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Customer Name</p>
                                <p>{transaction.customerName || 'N/A'}</p>
                            </div>
                            {transaction.cardLast4 && (
                                <div>
                                    <p className='text-sm text-gray-600'>Card (Last 4)</p>
                                    <p className='font-mono'>****{transaction.cardLast4}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timing Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Clock className='h-5 w-5' />
                                Timing Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <p className='text-sm text-gray-600'>Transaction Time</p>
                                <p>{formatDate(transaction.timestamp)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Details</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {transaction.ipAddress && (
                                <div>
                                    <p className='text-sm text-gray-600'>IP Address</p>
                                    <p className='font-mono'>{transaction.ipAddress}</p>
                                </div>
                            )}
                            {transaction.deviceId && (
                                <div>
                                    <p className='text-sm text-gray-600'>Device ID</p>
                                    <p className='font-mono text-sm'>{transaction.deviceId}</p>
                                </div>
                            )}
                            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                                <div>
                                    <p className='text-sm text-gray-600'>Metadata</p>
                                    <pre className='text-xs bg-gray-50 p-2 rounded overflow-x-auto'>
                                        {JSON.stringify(transaction.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
