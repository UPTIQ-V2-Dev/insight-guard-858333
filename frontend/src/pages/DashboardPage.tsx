import { useQuery } from '@tanstack/react-query';
import { MetricsCards } from '../components/dashboard/MetricsCards';
import { TransactionVolumeChart } from '../components/dashboard/TransactionVolumeChart';
import { FraudAlertsPanel } from '../components/dashboard/FraudAlertsPanel';
import { PatternInsights } from '../components/dashboard/PatternInsights';
import { getDashboardData } from '../services/dashboard';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

export const DashboardPage = () => {
    const {
        data: dashboardData,
        isLoading,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
        refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
    });

    if (isLoading) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
                    <p className='text-muted-foreground'>
                        Real-time transaction monitoring and fraud detection overview
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className='space-y-2'
                        >
                            <Skeleton className='h-4 w-20' />
                            <Skeleton className='h-8 w-16' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2'>
                        <Skeleton className='h-[400px]' />
                    </div>
                    <div>
                        <Skeleton className='h-[400px]' />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
                    <p className='text-muted-foreground'>
                        Real-time transaction monitoring and fraud detection overview
                    </p>
                </div>

                <Alert variant='destructive'>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertTitle>Error loading dashboard data</AlertTitle>
                    <AlertDescription className='flex items-center justify-between'>
                        <span>Failed to load dashboard metrics. Please try again.</span>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => refetch()}
                            disabled={isRefetching}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!dashboardData) {
        return null;
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
                    <p className='text-muted-foreground'>
                        Real-time transaction monitoring and fraud detection overview
                    </p>
                </div>
                <Button
                    variant='outline'
                    onClick={() => refetch()}
                    disabled={isRefetching}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <MetricsCards metrics={dashboardData.metrics} />

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <TransactionVolumeChart data={dashboardData.trends} />
                <FraudAlertsPanel alerts={dashboardData.recentAlerts} />
            </div>

            <PatternInsights insights={dashboardData.patternInsights} />
        </div>
    );
};
