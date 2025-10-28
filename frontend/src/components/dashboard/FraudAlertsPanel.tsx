import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FraudAlert } from '../../types/dashboard';
import { formatDistanceToNow } from 'date-fns';

interface FraudAlertsPanelProps {
    alerts: FraudAlert[];
}

export const FraudAlertsPanel = ({ alerts }: FraudAlertsPanelProps) => {
    const getSeverityColor = (severity: FraudAlert['severity']) => {
        switch (severity) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getStatusIcon = (status: FraudAlert['status']) => {
        switch (status) {
            case 'new':
                return <AlertTriangle className='h-4 w-4' />;
            case 'investigating':
                return <Clock className='h-4 w-4' />;
            case 'resolved':
                return <CheckCircle className='h-4 w-4' />;
            case 'false_positive':
                return <XCircle className='h-4 w-4' />;
            default:
                return <AlertTriangle className='h-4 w-4' />;
        }
    };

    const getStatusColor = (status: FraudAlert['status']) => {
        switch (status) {
            case 'new':
                return 'text-destructive';
            case 'investigating':
                return 'text-yellow-500';
            case 'resolved':
                return 'text-green-500';
            case 'false_positive':
                return 'text-muted-foreground';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <AlertTriangle className='h-5 w-5' />
                    Recent Fraud Alerts
                </CardTitle>
                <CardDescription>Latest fraud detection alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className='flex items-start justify-between rounded-lg border p-4'
                        >
                            <div className='flex-1 space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Badge variant={getSeverityColor(alert.severity)}>
                                        {alert.severity.toUpperCase()}
                                    </Badge>
                                    <Badge
                                        variant='outline'
                                        className='text-xs'
                                    >
                                        {alert.type}
                                    </Badge>
                                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                        <span className={getStatusColor(alert.status)}>
                                            {getStatusIcon(alert.status)}
                                        </span>
                                        <span className='capitalize'>{alert.status.replace('_', ' ')}</span>
                                    </div>
                                </div>

                                <p className='text-sm font-medium'>{alert.description}</p>

                                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                                    <span>Transaction ID: {alert.transactionId}</span>
                                    <span>Risk Score: {alert.riskScore}%</span>
                                    <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                                </div>
                            </div>

                            <div className='flex gap-2'>
                                {alert.status === 'new' && (
                                    <>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                        >
                                            Investigate
                                        </Button>
                                        <Button size='sm'>Resolve</Button>
                                    </>
                                )}
                                {alert.status === 'investigating' && <Button size='sm'>Update Status</Button>}
                            </div>
                        </div>
                    ))}

                    {alerts.length === 0 && (
                        <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
                            <CheckCircle className='h-8 w-8 mb-2' />
                            <p>No active fraud alerts</p>
                        </div>
                    )}
                </div>

                {alerts.length > 0 && (
                    <div className='mt-4 pt-4 border-t'>
                        <Button
                            variant='outline'
                            className='w-full'
                        >
                            View All Alerts
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
