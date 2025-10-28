import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';

type PatternHistoryProps = {
    data: any[];
    patternId: string;
    onPeriodChange: (days: number) => void;
    isLoading?: boolean;
};

export const PatternHistory = ({ data, patternId, onPeriodChange, isLoading = false }: PatternHistoryProps) => {
    const [selectedPeriod, setSelectedPeriod] = useState('30');

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        onPeriodChange(parseInt(period));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getTrendInfo = () => {
        if (data.length < 2) return null;

        const firstValue = data[data.length - 1]?.detections || 0;
        const lastValue = data[0]?.detections || 0;
        const change = ((lastValue - firstValue) / firstValue) * 100;

        return {
            change,
            isPositive: change > 0,
            isSignificant: Math.abs(change) > 10
        };
    };

    const trend = getTrendInfo();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pattern History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-80 bg-gray-100 rounded animate-pulse'></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <CardTitle className='flex items-center gap-2'>
                            <Calendar className='h-5 w-5' />
                            Pattern History
                        </CardTitle>
                        {trend && (
                            <div
                                className={`flex items-center gap-1 text-sm ${
                                    trend.isPositive ? 'text-red-600' : 'text-green-600'
                                }`}
                            >
                                <TrendingUp className={`h-4 w-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
                                {Math.abs(trend.change).toFixed(1)}%
                                {trend.isSignificant && <span className='text-xs'>(significant)</span>}
                            </div>
                        )}
                    </div>

                    <Select
                        value={selectedPeriod}
                        onValueChange={handlePeriodChange}
                    >
                        <SelectTrigger className='w-32'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='7'>Last 7 days</SelectItem>
                            <SelectItem value='30'>Last 30 days</SelectItem>
                            <SelectItem value='90'>Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className='flex items-center justify-center h-80 text-gray-500'>
                        <div className='text-center'>
                            <Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
                            <p>No historical data available</p>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {/* Detection Count Chart */}
                        <div>
                            <h3 className='text-sm font-medium mb-3'>Detection Count Over Time</h3>
                            <ResponsiveContainer
                                width='100%'
                                height={200}
                            >
                                <LineChart data={data.slice().reverse()}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis
                                        dataKey='date'
                                        tickFormatter={formatDate}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        labelFormatter={value => formatDate(value as string)}
                                        formatter={(value: any) => [value, 'Detections']}
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='detections'
                                        stroke='#8884d8'
                                        strokeWidth={2}
                                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk Score Chart */}
                        {data.some(d => d.riskScore !== undefined) && (
                            <div>
                                <h3 className='text-sm font-medium mb-3'>Risk Score Trend</h3>
                                <ResponsiveContainer
                                    width='100%'
                                    height={200}
                                >
                                    <BarChart data={data.slice().reverse()}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis
                                            dataKey='date'
                                            tickFormatter={formatDate}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip
                                            labelFormatter={value => formatDate(value as string)}
                                            formatter={(value: any) => [value, 'Risk Score']}
                                        />
                                        <Bar
                                            dataKey='riskScore'
                                            fill='#ff6b6b'
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Summary Stats */}
                        <div className='grid grid-cols-3 gap-4 pt-4 border-t'>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-blue-600'>
                                    {data.reduce((sum, d) => sum + (d.detections || 0), 0).toLocaleString()}
                                </div>
                                <div className='text-sm text-gray-600'>Total Detections</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-orange-600'>
                                    {data.length > 0
                                        ? Math.round(data.reduce((sum, d) => sum + (d.riskScore || 0), 0) / data.length)
                                        : 0}
                                </div>
                                <div className='text-sm text-gray-600'>Avg Risk Score</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-green-600'>
                                    {Math.max(...data.map(d => d.detections || 0))}
                                </div>
                                <div className='text-sm text-gray-600'>Peak Detections</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
