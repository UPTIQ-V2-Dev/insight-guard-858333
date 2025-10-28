import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FraudAlertsTable } from '@/components/fraud/FraudAlertsTable';
import { FraudScoreChart } from '@/components/fraud/FraudScoreChart';
import { FraudRules } from '@/components/fraud/FraudRules';
import { fraudService } from '@/services/fraud';
import { Shield, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import type { FraudAlert, CreateFraudRuleInput } from '@/types/fraud';

export const FraudMonitoringPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [alertFilters, setAlertFilters] = useState<{ status?: string; severity?: string }>({});
    const [,] = useState<FraudAlert | null>(null);

    const queryClient = useQueryClient();
    const pageSize = 20;

    // Fetch fraud alerts
    const { data: alertsData, isLoading: alertsLoading } = useQuery({
        queryKey: ['fraud-alerts', currentPage, pageSize, alertFilters],
        queryFn: () => fraudService.getFraudAlerts(currentPage, pageSize, alertFilters.status, alertFilters.severity)
    });

    // Fetch fraud rules
    const { data: rulesData } = useQuery({
        queryKey: ['fraud-rules'],
        queryFn: () => fraudService.getFraudRules(1, 50)
    });

    // Mock risk score data - in real app this would come from an API
    const riskScoreData = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        riskScore: Math.floor(Math.random() * 100),
        fraudProbability: Math.random(),
        alertCount: Math.floor(Math.random() * 10)
    }));

    // Mutations
    const updateAlertMutation = useMutation({
        mutationFn: ({
            alertId,
            status,
            resolution
        }: {
            alertId: string;
            status: FraudAlert['status'];
            resolution?: string;
        }) => fraudService.updateAlertStatus(alertId, status, resolution),
        onSuccess: () => {
            toast.success('Alert status updated successfully');
            queryClient.invalidateQueries({ queryKey: ['fraud-alerts'] });
        },
        onError: error => {
            toast.error('Failed to update alert status');
            console.error('Update alert error:', error);
        }
    });

    const createRuleMutation = useMutation({
        mutationFn: fraudService.createFraudRule,
        onSuccess: () => {
            toast.success('Fraud rule created successfully');
            queryClient.invalidateQueries({ queryKey: ['fraud-rules'] });
        },
        onError: error => {
            toast.error('Failed to create fraud rule');
            console.error('Create rule error:', error);
        }
    });

    const updateRuleMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateFraudRuleInput> }) =>
            fraudService.updateFraudRule(id, input),
        onSuccess: () => {
            toast.success('Fraud rule updated successfully');
            queryClient.invalidateQueries({ queryKey: ['fraud-rules'] });
        },
        onError: error => {
            toast.error('Failed to update fraud rule');
            console.error('Update rule error:', error);
        }
    });

    const deleteRuleMutation = useMutation({
        mutationFn: fraudService.deleteFraudRule,
        onSuccess: () => {
            toast.success('Fraud rule deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['fraud-rules'] });
        },
        onError: error => {
            toast.error('Failed to delete fraud rule');
            console.error('Delete rule error:', error);
        }
    });

    const alerts = alertsData?.results || [];
    const rules = rulesData?.results || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewAlert = (alert: FraudAlert) => {
        console.log('View alert details:', alert);
        // Could be used to open a detailed view modal
    };

    const handleStatusChange = (alertId: string, status: FraudAlert['status']) => {
        updateAlertMutation.mutate({ alertId, status });
    };

    const handleFilterChange = (filters: { status?: string; severity?: string }) => {
        setAlertFilters(filters);
        setCurrentPage(1);
    };

    const handleCreateRule = (input: CreateFraudRuleInput) => {
        createRuleMutation.mutate(input);
    };

    const handleUpdateRule = (id: string, input: Partial<CreateFraudRuleInput>) => {
        updateRuleMutation.mutate({ id, input });
    };

    const handleDeleteRule = (id: string) => {
        deleteRuleMutation.mutate(id);
    };

    const getOverallStats = () => {
        const openAlerts = alerts.filter(a => a.status === 'open').length;
        const investigatingAlerts = alerts.filter(a => a.status === 'investigating').length;
        const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
        const averageRiskScore =
            riskScoreData.length > 0
                ? riskScoreData.reduce((sum, item) => sum + item.riskScore, 0) / riskScoreData.length
                : 0;

        return {
            openAlerts,
            investigatingAlerts,
            criticalAlerts,
            averageRiskScore
        };
    };

    const getCurrentRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
        if (score >= 76) return 'critical';
        if (score >= 51) return 'high';
        if (score >= 26) return 'medium';
        return 'low';
    };

    const stats = getOverallStats();
    const currentRiskLevel = getCurrentRiskLevel(stats.averageRiskScore);

    return (
        <div className='p-6 space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Fraud Monitoring</h1>
                <p className='text-gray-600'>Real-time fraud detection, alert management, and investigation tools.</p>
            </div>

            {/* Overview Stats */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Open Alerts</div>
                        <AlertTriangle className='h-4 w-4 text-red-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-red-600'>{stats.openAlerts}</div>
                        <p className='text-xs text-muted-foreground'>Require attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Under Investigation</div>
                        <Clock className='h-4 w-4 text-yellow-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-yellow-600'>{stats.investigatingAlerts}</div>
                        <p className='text-xs text-muted-foreground'>Being reviewed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Critical Alerts</div>
                        <Shield className='h-4 w-4 text-red-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-red-600'>{stats.criticalAlerts}</div>
                        <p className='text-xs text-muted-foreground'>High priority</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Risk Level</div>
                        <TrendingUp className='h-4 w-4 text-blue-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-center gap-2'>
                            <Badge
                                variant={
                                    currentRiskLevel === 'critical'
                                        ? 'destructive'
                                        : currentRiskLevel === 'high'
                                          ? 'destructive'
                                          : currentRiskLevel === 'medium'
                                            ? 'default'
                                            : 'secondary'
                                }
                            >
                                {currentRiskLevel.toUpperCase()}
                            </Badge>
                            <span className='text-lg font-bold'>{Math.round(stats.averageRiskScore)}</span>
                        </div>
                        <p className='text-xs text-muted-foreground'>Average score</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs
                defaultValue='alerts'
                className='space-y-6'
            >
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='alerts'>Alerts</TabsTrigger>
                    <TabsTrigger value='dashboard'>Risk Dashboard</TabsTrigger>
                    <TabsTrigger value='rules'>Rules</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='alerts'
                    className='space-y-6'
                >
                    <FraudAlertsTable
                        alerts={alerts}
                        totalPages={alertsData?.totalPages || 1}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onViewAlert={handleViewAlert}
                        onStatusChange={handleStatusChange}
                        onFilterChange={handleFilterChange}
                        isLoading={alertsLoading}
                    />
                </TabsContent>

                <TabsContent
                    value='dashboard'
                    className='space-y-6'
                >
                    <FraudScoreChart
                        data={riskScoreData}
                        currentRiskLevel={currentRiskLevel}
                        averageScore={stats.averageRiskScore}
                        isLoading={false}
                    />
                </TabsContent>

                <TabsContent
                    value='rules'
                    className='space-y-6'
                >
                    <FraudRules
                        rules={rules}
                        onCreateRule={handleCreateRule}
                        onUpdateRule={handleUpdateRule}
                        onDeleteRule={handleDeleteRule}
                        isLoading={
                            createRuleMutation.isPending || updateRuleMutation.isPending || deleteRuleMutation.isPending
                        }
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
