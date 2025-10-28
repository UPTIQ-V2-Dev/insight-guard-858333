import { TrendingUp, Target, AlertCircle, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { PatternInsight } from '../../types/dashboard';
import { formatDistanceToNow } from 'date-fns';

interface PatternInsightsProps {
    insights: PatternInsight[];
}

export const PatternInsights = ({ insights }: PatternInsightsProps) => {
    const getPatternIcon = (type: PatternInsight['type']) => {
        switch (type) {
            case 'recurring':
                return <TrendingUp className='h-4 w-4' />;
            case 'anomaly':
                return <AlertCircle className='h-4 w-4' />;
            case 'cluster':
                return <Layers className='h-4 w-4' />;
            case 'velocity':
                return <Target className='h-4 w-4' />;
            default:
                return <TrendingUp className='h-4 w-4' />;
        }
    };

    const getPatternColor = (type: PatternInsight['type']) => {
        switch (type) {
            case 'recurring':
                return 'text-blue-500';
            case 'anomaly':
                return 'text-orange-500';
            case 'cluster':
                return 'text-purple-500';
            case 'velocity':
                return 'text-green-500';
            default:
                return 'text-muted-foreground';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.9) return 'text-green-500';
        if (confidence >= 0.7) return 'text-yellow-500';
        return 'text-orange-500';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Target className='h-5 w-5' />
                    Pattern Insights
                </CardTitle>
                <CardDescription>AI-driven pattern detection and behavioral analysis</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {insights.map(insight => (
                        <div
                            key={insight.id}
                            className='space-y-3 rounded-lg border p-4'
                        >
                            <div className='flex items-start justify-between'>
                                <div className='flex items-center gap-2'>
                                    <span className={getPatternColor(insight.type)}>
                                        {getPatternIcon(insight.type)}
                                    </span>
                                    <Badge
                                        variant='outline'
                                        className='text-xs capitalize'
                                    >
                                        {insight.type}
                                    </Badge>
                                    <span className='text-xs text-muted-foreground'>
                                        {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className='text-right'>
                                    <div className='flex items-center gap-2 text-sm'>
                                        <span className='text-muted-foreground'>Confidence:</span>
                                        <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                                            {(insight.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className='text-sm font-medium'>{insight.description}</p>

                            <div className='space-y-2'>
                                <div className='flex justify-between text-xs text-muted-foreground'>
                                    <span>Confidence Level</span>
                                    <span>{(insight.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <Progress
                                    value={insight.confidence * 100}
                                    className='h-1'
                                />
                            </div>

                            <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                <span>Affected Transactions: {insight.affectedTransactions.toLocaleString()}</span>
                                {insight.metadata && (
                                    <div className='flex gap-2'>
                                        {Object.entries(insight.metadata)
                                            .slice(0, 2)
                                            .map(([key, value]) => (
                                                <Badge
                                                    key={key}
                                                    variant='secondary'
                                                    className='text-xs'
                                                >
                                                    {key}: {String(value)}
                                                </Badge>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {insights.length === 0 && (
                        <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
                            <Target className='h-8 w-8 mb-2' />
                            <p>No pattern insights available</p>
                        </div>
                    )}
                </div>

                {insights.length > 0 && (
                    <div className='mt-4 pt-4 border-t'>
                        <div className='grid grid-cols-2 gap-4 text-center text-sm'>
                            <div>
                                <div className='text-2xl font-bold text-blue-500'>
                                    {insights.filter(i => i.type === 'recurring').length}
                                </div>
                                <div className='text-muted-foreground'>Recurring Patterns</div>
                            </div>
                            <div>
                                <div className='text-2xl font-bold text-orange-500'>
                                    {insights.filter(i => i.type === 'anomaly').length}
                                </div>
                                <div className='text-muted-foreground'>Anomalies Detected</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
