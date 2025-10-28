import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, RefreshCw } from 'lucide-react';
import type { AnalyticsResult } from '@/types/analytics';

type ChartContainerProps = {
    data: AnalyticsResult;
    title: string;
    chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'table' | 'heatmap';
    onExport?: () => void;
    onRefresh?: () => void;
    isLoading?: boolean;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const ChartContainer = ({
    data,
    title,
    chartType,
    onExport,
    onRefresh,
    isLoading = false
}: ChartContainerProps) => {
    const formatValue = (value: any, key: string) => {
        if (typeof value === 'number') {
            if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')) {
                return `${(value * 100).toFixed(1)}%`;
            }
            if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('total')) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);
            }
            return value.toLocaleString();
        }
        return value;
    };

    const renderChart = () => {
        if (isLoading) {
            return (
                <div className='h-64 flex items-center justify-center'>
                    <div className='animate-pulse text-gray-500'>Loading chart...</div>
                </div>
            );
        }

        if (!data.data || data.data.length === 0) {
            return <div className='h-64 flex items-center justify-center text-gray-500'>No data available</div>;
        }

        const chartData = data.data;

        switch (chartType) {
            case 'line':
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={400}
                    >
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip formatter={(value: any, name: string) => [formatValue(value, name), name]} />
                            {Object.keys(chartData[0] || {}).map((key, index) =>
                                key !== 'date' ? (
                                    <Line
                                        key={key}
                                        type='monotone'
                                        dataKey={key}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                    />
                                ) : null
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={400}
                    >
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={Object.keys(chartData[0])[0]} />
                            <YAxis />
                            <Tooltip formatter={(value: any, name: string) => [formatValue(value, name), name]} />
                            {Object.keys(chartData[0] || {}).map((key, index) =>
                                index > 0 ? (
                                    <Bar
                                        key={key}
                                        dataKey={key}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ) : null
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'pie': {
                const pieData = chartData.map((item, index) => ({
                    name: item[Object.keys(item)[0]],
                    value: item[Object.keys(item)[1]],
                    fill: COLORS[index % COLORS.length]
                }));

                return (
                    <ResponsiveContainer
                        width='100%'
                        height={400}
                    >
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='value'
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => [formatValue(value, 'value'), 'Value']} />
                        </PieChart>
                    </ResponsiveContainer>
                );
            }

            case 'scatter': {
                const keys = Object.keys(chartData[0] || {});
                return (
                    <ResponsiveContainer
                        width='100%'
                        height={400}
                    >
                        <ScatterChart data={chartData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={keys[0]} />
                            <YAxis dataKey={keys[1]} />
                            <Tooltip formatter={(value: any, name: string) => [formatValue(value, name), name]} />
                            <Scatter fill='#8884d8' />
                        </ScatterChart>
                    </ResponsiveContainer>
                );
            }

            case 'table': {
                const columns = Object.keys(chartData[0] || {});
                return (
                    <div className='max-h-96 overflow-y-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableHead key={column}>
                                            {column.charAt(0).toUpperCase() +
                                                column.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chartData.map((row, index) => (
                                    <TableRow key={index}>
                                        {columns.map(column => (
                                            <TableCell key={column}>{formatValue(row[column], column)}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                );
            }

            case 'heatmap':
                // Simple heatmap representation using a grid
                return (
                    <div className='grid grid-cols-7 gap-1 p-4'>
                        {chartData.map((item, index) => {
                            const intensity = Math.max(
                                ...(Object.values(item).filter(v => typeof v === 'number') as number[])
                            );
                            const opacity = intensity / 100;
                            return (
                                <div
                                    key={index}
                                    className='w-8 h-8 rounded border'
                                    style={{
                                        backgroundColor: `rgba(239, 68, 68, ${opacity})`
                                    }}
                                    title={`Value: ${intensity}`}
                                />
                            );
                        })}
                    </div>
                );

            default:
                return <div className='h-64 flex items-center justify-center'>Unsupported chart type</div>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>{title}</CardTitle>
                    <div className='flex items-center gap-2'>
                        {onRefresh && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={onRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                        {onExport && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={onExport}
                                disabled={isLoading}
                            >
                                <Download className='h-4 w-4' />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {renderChart()}

                {/* Summary Stats */}
                {data.summary && Object.keys(data.summary).length > 0 && (
                    <div className='mt-6 pt-4 border-t'>
                        <h4 className='font-medium mb-3'>Summary Statistics</h4>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                            {Object.entries(data.summary).map(([key, value]) => (
                                <div
                                    key={key}
                                    className='text-center p-2 bg-gray-50 rounded'
                                >
                                    <div className='text-sm text-gray-600 capitalize'>
                                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </div>
                                    <div className='font-semibold'>{formatValue(value, key)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Metadata */}
                {data.metadata && (
                    <div className='mt-4 text-xs text-gray-500 border-t pt-2'>
                        <div>Rows: {data.metadata.totalRows.toLocaleString()}</div>
                        <div>Execution time: {data.metadata.executionTime}ms</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
