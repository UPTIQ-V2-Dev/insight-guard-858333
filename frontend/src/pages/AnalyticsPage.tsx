import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportBuilder } from '@/components/analytics/ReportBuilder';
import { ChartContainer } from '@/components/analytics/ChartContainer';
import { analyticsService } from '@/services/analytics';
import {
    BarChart3,
    Download,
    Edit,
    Trash2,
    Play,
    Calendar,
    FileText,
    TrendingUp,
    DollarSign,
    Users
} from 'lucide-react';
import type { CreateReportInput, AnalyticsQuery, Report, AnalyticsResult } from '@/types/analytics';

export const AnalyticsPage = () => {
    const [,] = useState<Report | null>(null);
    const [previewData, setPreviewData] = useState<AnalyticsResult | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const queryClient = useQueryClient();

    // Fetch metrics
    const { data: metrics } = useQuery({
        queryKey: ['analytics-metrics'],
        queryFn: analyticsService.getMetrics
    });

    // Fetch reports
    const { data: reportsData, isLoading: reportsLoading } = useQuery({
        queryKey: ['analytics-reports'],
        queryFn: () => analyticsService.getReports(1, 50)
    });

    // Sample analytics data for dashboard
    const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
        queryKey: ['analytics-dashboard'],
        queryFn: () =>
            analyticsService.executeQuery({
                metrics: ['total_transactions', 'total_amount', 'fraud_rate'],
                dimensions: ['date'],
                filters: {},
                dateRange: {
                    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    to: new Date().toISOString()
                }
            })
    });

    // Mutations
    const createReportMutation = useMutation({
        mutationFn: analyticsService.createReport,
        onSuccess: () => {
            toast.success('Report created successfully');
            queryClient.invalidateQueries({ queryKey: ['analytics-reports'] });
        },
        onError: error => {
            toast.error('Failed to create report');
            console.error('Create report error:', error);
        }
    });

    const executeQueryMutation = useMutation({
        mutationFn: analyticsService.executeQuery,
        onSuccess: data => {
            setPreviewData(data);
            setIsPreviewOpen(true);
        },
        onError: error => {
            toast.error('Failed to execute query');
            console.error('Execute query error:', error);
        }
    });

    const exportReportMutation = useMutation({
        mutationFn: ({ reportId, format }: { reportId: string; format: 'pdf' | 'csv' | 'excel' }) =>
            analyticsService.exportReport(reportId, format),
        onSuccess: result => {
            window.open(result.downloadUrl, '_blank');
            toast.success('Export started. Download will begin shortly.');
        },
        onError: error => {
            toast.error('Failed to export report');
            console.error('Export error:', error);
        }
    });

    const handleCreateReport = (input: CreateReportInput) => {
        createReportMutation.mutate(input);
    };

    const handlePreviewReport = (input: CreateReportInput) => {
        const query: AnalyticsQuery = {
            metrics: input.metrics,
            dimensions: ['date'],
            filters: input.filters,
            dateRange: {
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                to: new Date().toISOString()
            }
        };

        executeQueryMutation.mutate(query);
    };

    const handleExportReport = (reportId: string, format: 'pdf' | 'csv' | 'excel' = 'csv') => {
        exportReportMutation.mutate({ reportId, format });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const reports = reportsData?.results || [];

    const getDashboardStats = () => {
        if (!dashboardData) return { transactions: 0, revenue: 0, fraudRate: 0, users: 0 };

        return {
            transactions: dashboardData.summary.totalTransactions || 0,
            revenue: dashboardData.summary.totalAmount || 0,
            fraudRate: dashboardData.summary.avgFraudRate || 0,
            users: 1250 // Mock data
        };
    };

    const stats = getDashboardStats();

    return (
        <div className='p-6 space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Analytics & Reports</h1>
                <p className='text-gray-600'>
                    Comprehensive analytics, custom reports, and data insights for fraud detection.
                </p>
            </div>

            {/* Overview Stats */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Total Transactions</div>
                        <TrendingUp className='h-4 w-4 text-blue-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.transactions.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>Last 30 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Total Revenue</div>
                        <DollarSign className='h-4 w-4 text-green-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0
                            }).format(stats.revenue)}
                        </div>
                        <p className='text-xs text-muted-foreground'>Last 30 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Fraud Rate</div>
                        <BarChart3 className='h-4 w-4 text-red-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-red-600'>{(stats.fraudRate * 100).toFixed(1)}%</div>
                        <p className='text-xs text-muted-foreground'>Average rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Active Reports</div>
                        <FileText className='h-4 w-4 text-purple-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{reports.length}</div>
                        <p className='text-xs text-muted-foreground'>
                            {reports.filter(r => r.isScheduled).length} scheduled
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs
                defaultValue='dashboard'
                className='space-y-6'
            >
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
                    <TabsTrigger value='reports'>Reports</TabsTrigger>
                    <TabsTrigger value='builder'>Report Builder</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='dashboard'
                    className='space-y-6'
                >
                    {dashboardData ? (
                        <div className='grid gap-6 md:grid-cols-2'>
                            <ChartContainer
                                data={dashboardData}
                                title='Transaction Volume Trend'
                                chartType='line'
                                onRefresh={() => queryClient.invalidateQueries({ queryKey: ['analytics-dashboard'] })}
                                isLoading={dashboardLoading}
                            />

                            <ChartContainer
                                data={dashboardData}
                                title='Revenue Analysis'
                                chartType='bar'
                                onExport={() => toast.info('Export functionality would be implemented here')}
                                isLoading={dashboardLoading}
                            />
                        </div>
                    ) : (
                        <Card>
                            <CardContent className='flex items-center justify-center h-64'>
                                <div className='text-center'>
                                    {dashboardLoading ? (
                                        <div>Loading dashboard data...</div>
                                    ) : (
                                        <div>No dashboard data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent
                    value='reports'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Saved Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reportsLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : reports.length === 0 ? (
                                <div className='text-center py-8 text-gray-500'>
                                    <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                                    <p>No reports created yet.</p>
                                    <p className='text-sm'>Use the Report Builder to create your first report.</p>
                                </div>
                            ) : (
                                <div className='rounded-md border'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Scheduled</TableHead>
                                                <TableHead>Last Run</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className='text-right'>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.map(report => (
                                                <TableRow key={report.id}>
                                                    <TableCell>
                                                        <div className='font-medium'>{report.name}</div>
                                                        <div className='text-sm text-gray-600 max-w-64 truncate'>
                                                            {report.description}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant='outline'>{report.type}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {report.isScheduled ? (
                                                            <div className='flex items-center gap-1'>
                                                                <Calendar className='h-4 w-4' />
                                                                <span className='text-sm'>
                                                                    {report.schedule?.frequency}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Badge variant='secondary'>Manual</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className='text-sm text-gray-600'>
                                                        {report.lastRunAt ? formatDate(report.lastRunAt) : 'Never'}
                                                    </TableCell>
                                                    <TableCell className='text-sm text-gray-600'>
                                                        {formatDate(report.createdAt)}
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        <div className='flex items-center gap-2 justify-end'>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                onClick={() =>
                                                                    toast.info(
                                                                        'Run report functionality would be implemented'
                                                                    )
                                                                }
                                                            >
                                                                <Play className='h-4 w-4' />
                                                            </Button>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                onClick={() => handleExportReport(report.id)}
                                                            >
                                                                <Download className='h-4 w-4' />
                                                            </Button>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                onClick={() =>
                                                                    toast.info(
                                                                        'Edit functionality would be implemented'
                                                                    )
                                                                }
                                                            >
                                                                <Edit className='h-4 w-4' />
                                                            </Button>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                onClick={() =>
                                                                    toast.info(
                                                                        'Delete functionality would be implemented'
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className='h-4 w-4' />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent
                    value='builder'
                    className='space-y-6'
                >
                    <div className='flex justify-between items-center'>
                        <div>
                            <h2 className='text-2xl font-bold'>Report Builder</h2>
                            <p className='text-gray-600'>Create custom reports with advanced analytics</p>
                        </div>
                        <ReportBuilder
                            metrics={metrics || []}
                            onCreateReport={handleCreateReport}
                            onPreviewReport={handlePreviewReport}
                            isLoading={createReportMutation.isPending || executeQueryMutation.isPending}
                        />
                    </div>

                    {isPreviewOpen && previewData && (
                        <ChartContainer
                            data={previewData}
                            title='Report Preview'
                            chartType='table'
                            onExport={() => toast.info('Export preview functionality would be implemented')}
                            isLoading={false}
                        />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                <Button
                                    variant='outline'
                                    className='h-auto p-4 flex-col'
                                    onClick={() => toast.info('Quick report functionality would be implemented')}
                                >
                                    <TrendingUp className='h-8 w-8 mb-2' />
                                    <span className='font-medium'>Transaction Trends</span>
                                    <span className='text-sm text-gray-600'>Last 30 days</span>
                                </Button>

                                <Button
                                    variant='outline'
                                    className='h-auto p-4 flex-col'
                                    onClick={() => toast.info('Quick report functionality would be implemented')}
                                >
                                    <BarChart3 className='h-8 w-8 mb-2' />
                                    <span className='font-medium'>Fraud Analysis</span>
                                    <span className='text-sm text-gray-600'>Risk patterns</span>
                                </Button>

                                <Button
                                    variant='outline'
                                    className='h-auto p-4 flex-col'
                                    onClick={() => toast.info('Quick report functionality would be implemented')}
                                >
                                    <Users className='h-8 w-8 mb-2' />
                                    <span className='font-medium'>Customer Insights</span>
                                    <span className='text-sm text-gray-600'>Behavioral data</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
