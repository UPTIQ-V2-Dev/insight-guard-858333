import { TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DashboardMetrics } from '../../types/dashboard';

interface MetricsCardsProps {
    metrics: DashboardMetrics;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Transactions</CardTitle>
                    <Activity className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{formatNumber(metrics.totalTransactions)}</div>
                    <p className='text-xs text-muted-foreground'>
                        <TrendingUp className='inline h-3 w-3 mr-1' />
                        +12.5% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Volume</CardTitle>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{formatCurrency(metrics.totalVolume)}</div>
                    <p className='text-xs text-muted-foreground'>
                        <TrendingUp className='inline h-3 w-3 mr-1' />
                        +8.3% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Fraud Alerts</CardTitle>
                    <AlertTriangle className='h-4 w-4 text-destructive' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold text-destructive'>{formatNumber(metrics.fraudAlerts)}</div>
                    <p className='text-xs text-muted-foreground'>
                        <TrendingDown className='inline h-3 w-3 mr-1' />
                        -5.2% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Pattern Detections</CardTitle>
                    <Target className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{formatNumber(metrics.patternDetections)}</div>
                    <p className='text-xs text-muted-foreground'>
                        <TrendingUp className='inline h-3 w-3 mr-1' />
                        +15.1% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Success Rate</CardTitle>
                    <TrendingUp className='h-4 w-4 text-green-500' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold text-green-500'>{metrics.successRate}%</div>
                    <p className='text-xs text-muted-foreground'>
                        <TrendingUp className='inline h-3 w-3 mr-1' />
                        +0.3% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Avg Transaction</CardTitle>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{formatCurrency(metrics.averageTransactionValue)}</div>
                    <p className='text-xs text-muted-foreground'>
                        <TrendingUp className='inline h-3 w-3 mr-1' />
                        +2.1% from last month
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
