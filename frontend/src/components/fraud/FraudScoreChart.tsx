import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Shield, AlertTriangle } from 'lucide-react';

type FraudScoreData = {
    timestamp: string;
    riskScore: number;
    fraudProbability: number;
    alertCount: number;
};

type FraudScoreChartProps = {
    data: FraudScoreData[];
    currentRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    averageScore: number;
    isLoading?: boolean;
};

export const FraudScoreChart = ({ data, currentRiskLevel, averageScore, isLoading = false }: FraudScoreChartProps) => {
    const getRiskLevelColor = (level: string) => {
        switch (level) {
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

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'critical':
            case 'high':
                return <AlertTriangle className='h-4 w-4' />;
            case 'medium':
                return <Shield className='h-4 w-4' />;
            case 'low':
                return <Shield className='h-4 w-4' />;
            default:
                return <Shield className='h-4 w-4' />;
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTrendInfo = () => {
        if (data.length < 2) return null;

        const firstValue = data[0]?.riskScore || 0;
        const lastValue = data[data.length - 1]?.riskScore || 0;
        const change = lastValue - firstValue;

        return {
            change,
            isIncreasing: change > 0,
            isSignificant: Math.abs(change) > 10
        };
    };

    const trend = getTrendInfo();

    if (isLoading) {
        return (
            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Risk Score Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='h-64 bg-gray-100 rounded animate-pulse'></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Risk Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='h-12 bg-gray-100 rounded animate-pulse'></div>
                            <div className='h-8 bg-gray-100 rounded animate-pulse'></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='grid gap-4 md:grid-cols-2'>
            {/* Risk Score Trend Chart */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='flex items-center gap-2'>
                            Risk Score Trend
                            {trend && (
                                <div
                                    className={`flex items-center gap-1 text-sm ${
                                        trend.isIncreasing ? 'text-red-600' : 'text-green-600'
                                    }`}
                                >
                                    <TrendingUp className={`h-4 w-4 ${trend.isIncreasing ? '' : 'rotate-180'}`} />
                                    {Math.abs(trend.change).toFixed(0)}
                                    {trend.isSignificant && <span className='text-xs'>(significant)</span>}
                                </div>
                            )}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {data.length === 0 ? (
                        <div className='flex items-center justify-center h-64 text-gray-500'>
                            No risk score data available
                        </div>
                    ) : (
                        <ResponsiveContainer
                            width='100%'
                            height={250}
                        >
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient
                                        id='riskGradient'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'
                                    >
                                        <stop
                                            offset='5%'
                                            stopColor='#ef4444'
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset='95%'
                                            stopColor='#ef4444'
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis
                                    dataKey='timestamp'
                                    tickFormatter={formatTime}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    labelFormatter={value => `Time: ${formatTime(value as string)}`}
                                    formatter={(value: any, name: string) => {
                                        if (name === 'riskScore') return [value, 'Risk Score'];
                                        if (name === 'fraudProbability')
                                            return [`${(value * 100).toFixed(1)}%`, 'Fraud Probability'];
                                        return [value, name];
                                    }}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='riskScore'
                                    stroke='#ef4444'
                                    fillOpacity={1}
                                    fill='url(#riskGradient)'
                                />
                                <Line
                                    type='monotone'
                                    dataKey='fraudProbability'
                                    stroke='#f97316'
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Current Risk Level */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {/* Risk Level Display */}
                    <div className='text-center space-y-2'>
                        <div className='flex items-center justify-center gap-2'>
                            {getRiskIcon(currentRiskLevel)}
                            <Badge
                                variant={getRiskLevelColor(currentRiskLevel)}
                                className='text-lg px-4 py-2'
                            >
                                {currentRiskLevel.toUpperCase()} RISK
                            </Badge>
                        </div>
                        <div className='text-3xl font-bold'>{averageScore.toFixed(0)}</div>
                        <div className='text-sm text-gray-600'>Average Risk Score</div>
                    </div>

                    {/* Risk Score Breakdown */}
                    <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium'>Low Risk (0-25)</span>
                            <span className='text-sm text-green-600'>Safe</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className='bg-green-600 h-2 rounded-full'
                                style={{ width: `${(Math.min(averageScore, 25) / 25) * 100}%` }}
                            ></div>
                        </div>

                        <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium'>Medium Risk (26-50)</span>
                            <span className='text-sm text-yellow-600'>Caution</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className='bg-yellow-600 h-2 rounded-full'
                                style={{
                                    width: averageScore > 25 ? `${(Math.min(averageScore - 25, 25) / 25) * 100}%` : '0%'
                                }}
                            ></div>
                        </div>

                        <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium'>High Risk (51-75)</span>
                            <span className='text-sm text-orange-600'>Warning</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className='bg-orange-600 h-2 rounded-full'
                                style={{
                                    width: averageScore > 50 ? `${(Math.min(averageScore - 50, 25) / 25) * 100}%` : '0%'
                                }}
                            ></div>
                        </div>

                        <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium'>Critical Risk (76-100)</span>
                            <span className='text-sm text-red-600'>Danger</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className='bg-red-600 h-2 rounded-full'
                                style={{
                                    width: averageScore > 75 ? `${(Math.min(averageScore - 75, 25) / 25) * 100}%` : '0%'
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Alert Count */}
                    <div className='pt-4 border-t'>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-red-600'>
                                {data.reduce((sum, item) => sum + item.alertCount, 0)}
                            </div>
                            <div className='text-sm text-gray-600'>Total Alerts (Last 24h)</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
