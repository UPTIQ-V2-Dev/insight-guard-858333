import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Target, RefreshCw, Eye } from 'lucide-react';
import { useState } from 'react';
import type { PatternInsight } from '@/types/pattern';

type AIInsightsProps = {
    insights: PatternInsight[];
    onRefresh: () => void;
    onViewDetails: (insight: PatternInsight) => void;
    isLoading?: boolean;
};

export const AIInsights = ({ insights, onRefresh, onViewDetails, isLoading = false }: AIInsightsProps) => {
    const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

    const getInsightIcon = (type: PatternInsight['type']) => {
        switch (type) {
            case 'anomaly':
                return <AlertTriangle className='h-5 w-5' />;
            case 'trend':
                return <TrendingUp className='h-5 w-5' />;
            case 'cluster':
                return <Target className='h-5 w-5' />;
            case 'prediction':
                return <Brain className='h-5 w-5' />;
            default:
                return <Brain className='h-5 w-5' />;
        }
    };

    const getImpactBadgeColor = (impact: PatternInsight['impact']) => {
        switch (impact) {
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

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-green-600';
        if (confidence >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpand = (insightId: string) => {
        const newExpanded = new Set(expandedInsights);
        if (newExpanded.has(insightId)) {
            newExpanded.delete(insightId);
        } else {
            newExpanded.add(insightId);
        }
        setExpandedInsights(newExpanded);
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                        <Brain className='h-5 w-5' />
                        AI-Powered Insights
                    </CardTitle>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={onRefresh}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className='space-y-4'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className='p-4 border rounded-lg'
                            >
                                <div className='animate-pulse'>
                                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : insights.length === 0 ? (
                    <div className='text-center py-8 text-gray-500'>
                        <Brain className='h-12 w-12 mx-auto mb-4 opacity-50' />
                        <p>No AI insights available yet.</p>
                        <p className='text-sm'>Click refresh to generate new insights.</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {insights.map(insight => (
                            <div
                                key={insight.id}
                                className='p-4 border rounded-lg space-y-3'
                            >
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-start gap-3 flex-1'>
                                        <div className='mt-0.5'>{getInsightIcon(insight.type)}</div>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-1'>
                                                <h3 className='font-semibold'>{insight.title}</h3>
                                                <Badge variant={getImpactBadgeColor(insight.impact)}>
                                                    {insight.impact} impact
                                                </Badge>
                                                <Badge variant='outline'>{insight.type}</Badge>
                                            </div>

                                            <p className='text-gray-600 mb-2'>{insight.description}</p>

                                            <div className='flex items-center gap-4 text-sm text-gray-500'>
                                                <span
                                                    className={`font-medium ${getConfidenceColor(insight.confidence)}`}
                                                >
                                                    {(insight.confidence * 100).toFixed(0)}% confidence
                                                </span>
                                                <span>Generated {formatDate(insight.generatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => toggleExpand(insight.id)}
                                        >
                                            {expandedInsights.has(insight.id) ? 'Less' : 'More'}
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => onViewDetails(insight)}
                                        >
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </div>

                                {expandedInsights.has(insight.id) && insight.data && (
                                    <div className='mt-3 p-3 bg-gray-50 rounded'>
                                        <h4 className='font-medium text-sm mb-2'>Additional Data:</h4>
                                        <pre className='text-xs overflow-x-auto'>
                                            {JSON.stringify(insight.data, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
