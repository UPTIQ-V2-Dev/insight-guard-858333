import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatternVisualization } from '@/components/patterns/PatternVisualization';
import { PatternRules } from '@/components/patterns/PatternRules';
import { PatternHistory } from '@/components/patterns/PatternHistory';
import { AIInsights } from '@/components/patterns/AIInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { patternsService } from '@/services/patterns';
import { TrendingUp, Brain, History, BarChart3 } from 'lucide-react';
import type { CreatePatternRuleInput, PatternInsight } from '@/types/pattern';

export const PatternDetectionPage = () => {
    const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
    const [historyPeriod, setHistoryPeriod] = useState(30);

    const queryClient = useQueryClient();

    // Fetch patterns
    const { data: patternsData } = useQuery({
        queryKey: ['patterns'],
        queryFn: () => patternsService.getPatterns(1, 50)
    });

    // Fetch AI insights
    const {
        data: insights,
        isLoading: insightsLoading,
        refetch: refetchInsights
    } = useQuery({
        queryKey: ['pattern-insights'],
        queryFn: patternsService.getAIInsights
    });

    // Fetch pattern history
    const { data: historyData, isLoading: historyLoading } = useQuery({
        queryKey: ['pattern-history', selectedPatternId, historyPeriod],
        queryFn: () =>
            selectedPatternId
                ? patternsService.getPatternHistory(selectedPatternId, historyPeriod)
                : Promise.resolve([]),
        enabled: !!selectedPatternId
    });

    // Fetch pattern visualization
    const { data: visualizationData, isLoading: visualizationLoading } = useQuery({
        queryKey: ['pattern-visualization', selectedPatternId],
        queryFn: () =>
            selectedPatternId ? patternsService.getPatternVisualization(selectedPatternId) : Promise.resolve(null),
        enabled: !!selectedPatternId
    });

    // Mutations
    const createRuleMutation = useMutation({
        mutationFn: patternsService.createPatternRule,
        onSuccess: () => {
            toast.success('Pattern rule created successfully');
            queryClient.invalidateQueries({ queryKey: ['patterns'] });
        },
        onError: error => {
            toast.error('Failed to create pattern rule');
            console.error('Create rule error:', error);
        }
    });

    const updateRuleMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreatePatternRuleInput> }) =>
            patternsService.updatePatternRule(id, input),
        onSuccess: () => {
            toast.success('Pattern rule updated successfully');
            queryClient.invalidateQueries({ queryKey: ['patterns'] });
        },
        onError: error => {
            toast.error('Failed to update pattern rule');
            console.error('Update rule error:', error);
        }
    });

    const deleteRuleMutation = useMutation({
        mutationFn: patternsService.deletePatternRule,
        onSuccess: () => {
            toast.success('Pattern rule deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['patterns'] });
        },
        onError: error => {
            toast.error('Failed to delete pattern rule');
            console.error('Delete rule error:', error);
        }
    });

    const patterns = patternsData?.results || [];
    const selectedPattern = patterns.find(p => p.id === selectedPatternId);

    const handleCreateRule = (input: CreatePatternRuleInput) => {
        createRuleMutation.mutate(input);
    };

    const handleUpdateRule = (id: string, input: Partial<CreatePatternRuleInput>) => {
        updateRuleMutation.mutate({ id, input });
    };

    const handleDeleteRule = (id: string) => {
        deleteRuleMutation.mutate(id);
    };

    const handleRefreshInsights = () => {
        refetchInsights();
    };

    const handleViewInsightDetails = (insight: PatternInsight) => {
        console.log('View insight details:', insight);
        toast.info(`Viewing details for: ${insight.title}`);
    };

    const handleHistoryPeriodChange = (days: number) => {
        setHistoryPeriod(days);
    };

    const getOverallStats = () => {
        return {
            totalPatterns: patterns.length,
            activePatterns: patterns.filter(p => p.status === 'active').length,
            highRiskPatterns: patterns.filter(p => p.riskLevel >= 70).length,
            totalDetections: patterns.reduce((sum, p) => sum + p.detectionCount, 0)
        };
    };

    const stats = getOverallStats();

    return (
        <div className='p-6 space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Pattern Detection</h1>
                <p className='text-gray-600'>
                    AI-powered pattern recognition and behavioral analysis for fraud detection.
                </p>
            </div>

            {/* Overview Stats */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Total Patterns</div>
                        <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.totalPatterns}</div>
                        <p className='text-xs text-muted-foreground'>{stats.activePatterns} active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>High Risk Patterns</div>
                        <TrendingUp className='h-4 w-4 text-red-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-red-600'>{stats.highRiskPatterns}</div>
                        <p className='text-xs text-muted-foreground'>Require attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>Total Detections</div>
                        <Brain className='h-4 w-4 text-blue-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{stats.totalDetections.toLocaleString()}</div>
                        <p className='text-xs text-muted-foreground'>All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='text-sm font-medium'>AI Insights</div>
                        <Brain className='h-4 w-4 text-purple-600' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{insights?.length || 0}</div>
                        <p className='text-xs text-muted-foreground'>New insights available</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs
                defaultValue='overview'
                className='space-y-6'
            >
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='rules'>Rules</TabsTrigger>
                    <TabsTrigger value='insights'>AI Insights</TabsTrigger>
                    <TabsTrigger value='history'>History</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='overview'
                    className='space-y-6'
                >
                    <div className='grid gap-6 md:grid-cols-2'>
                        {/* Pattern Visualization */}
                        <div className='space-y-4'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Select Pattern for Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-2'>
                                        {patterns.slice(0, 5).map(pattern => (
                                            <div
                                                key={pattern.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    selectedPatternId === pattern.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => setSelectedPatternId(pattern.id)}
                                            >
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <div className='font-medium'>{pattern.name}</div>
                                                        <div className='text-sm text-gray-600'>{pattern.type}</div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <Badge
                                                            variant={
                                                                pattern.confidence === 'high'
                                                                    ? 'destructive'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {pattern.confidence}
                                                        </Badge>
                                                        <span className='text-sm text-gray-600'>
                                                            {pattern.detectionCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Visualization */}
                        <div>
                            {visualizationData ? (
                                <PatternVisualization
                                    data={visualizationData}
                                    title={`${selectedPattern?.name} - Detection Trend`}
                                />
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pattern Visualization</CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex items-center justify-center h-64 text-gray-500'>
                                        {selectedPatternId ? (
                                            visualizationLoading ? (
                                                <div>Loading visualization...</div>
                                            ) : (
                                                <div>No visualization data available</div>
                                            )
                                        ) : (
                                            <div>Select a pattern to view visualization</div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent
                    value='rules'
                    className='space-y-6'
                >
                    <PatternRules
                        patterns={patterns}
                        onCreateRule={handleCreateRule}
                        onUpdateRule={handleUpdateRule}
                        onDeleteRule={handleDeleteRule}
                        isLoading={
                            createRuleMutation.isPending || updateRuleMutation.isPending || deleteRuleMutation.isPending
                        }
                    />
                </TabsContent>

                <TabsContent
                    value='insights'
                    className='space-y-6'
                >
                    <AIInsights
                        insights={insights || []}
                        onRefresh={handleRefreshInsights}
                        onViewDetails={handleViewInsightDetails}
                        isLoading={insightsLoading}
                    />
                </TabsContent>

                <TabsContent
                    value='history'
                    className='space-y-6'
                >
                    {selectedPatternId ? (
                        <PatternHistory
                            data={historyData || []}
                            patternId={selectedPatternId}
                            onPeriodChange={handleHistoryPeriodChange}
                            isLoading={historyLoading}
                        />
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Pattern History</CardTitle>
                            </CardHeader>
                            <CardContent className='flex items-center justify-center h-64 text-gray-500'>
                                <div className='text-center'>
                                    <History className='h-12 w-12 mx-auto mb-4 opacity-50' />
                                    <p>Select a pattern from the Overview tab to view its history</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};
