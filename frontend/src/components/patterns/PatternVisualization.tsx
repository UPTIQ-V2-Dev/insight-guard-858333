import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PatternVisualization as PatternVisualizationData } from '@/types/pattern';

type PatternVisualizationProps = {
    data: PatternVisualizationData;
    title?: string;
    className?: string;
};

export const PatternVisualization = ({ data, title, className }: PatternVisualizationProps) => {
    const renderChart = () => {
        switch (data.chartType) {
            case 'line':
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={300}
                    >
                        <LineChart data={data.data}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={data.config.xAxis} />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type='monotone'
                                dataKey={data.config.yAxis}
                                stroke='#8884d8'
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={300}
                    >
                        <BarChart data={data.data}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={data.config.xAxis} />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey={data.config.yAxis}
                                fill='#8884d8'
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'scatter':
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={300}
                    >
                        <ScatterChart data={data.data}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={data.config.xAxis} />
                            <YAxis dataKey={data.config.yAxis} />
                            <Tooltip />
                            <Scatter fill='#8884d8' />
                        </ScatterChart>
                    </ResponsiveContainer>
                );

            case 'heatmap':
                // Simple heatmap representation using bars with different colors
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={300}
                    >
                        <BarChart data={data.data}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={data.config.xAxis} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey={data.config.yAxis}>
                                {data.data.map((entry: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.value > 50 ? '#ff4444' : entry.value > 25 ? '#ffaa00' : '#44ff44'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );

            default:
                return (
                    <div className='flex items-center justify-center h-64 text-gray-500'>
                        Unsupported chart type: {data.chartType}
                    </div>
                );
        }
    };

    const getTrendIcon = () => {
        if (data.data.length < 2) return <Minus className='h-4 w-4' />;

        const firstValue = data.data[0][data.config.yAxis];
        const lastValue = data.data[data.data.length - 1][data.config.yAxis];

        if (lastValue > firstValue) {
            return <TrendingUp className='h-4 w-4 text-green-600' />;
        } else if (lastValue < firstValue) {
            return <TrendingDown className='h-4 w-4 text-red-600' />;
        } else {
            return <Minus className='h-4 w-4 text-gray-600' />;
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    {title || data.config.title}
                    {getTrendIcon()}
                </CardTitle>
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
        </Card>
    );
};
