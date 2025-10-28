import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TransactionTrend } from '../../types/dashboard';
import { format } from 'date-fns';

interface TransactionVolumeChartProps {
    data: TransactionTrend[];
}

export const TransactionVolumeChart = ({ data }: TransactionVolumeChartProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return format(new Date(dateStr), 'MMM dd');
    };

    const chartData = data.map(item => ({
        ...item,
        date: formatDate(item.date)
    }));

    return (
        <Card className='col-span-1 lg:col-span-2'>
            <CardHeader>
                <CardTitle>Transaction Volume Trends</CardTitle>
                <CardDescription>Daily transaction volume and fraud detection patterns</CardDescription>
            </CardHeader>
            <CardContent className='pt-2'>
                <ResponsiveContainer
                    width='100%'
                    height={300}
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient
                                id='volumeGradient'
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'
                            >
                                <stop
                                    offset='5%'
                                    stopColor='hsl(var(--primary))'
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='hsl(var(--primary))'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id='fraudGradient'
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'
                            >
                                <stop
                                    offset='5%'
                                    stopColor='hsl(var(--destructive))'
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='hsl(var(--destructive))'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey='date'
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatCurrency}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className='rounded-lg border bg-background p-2 shadow-sm'>
                                            <div className='grid grid-cols-2 gap-2'>
                                                <div className='flex flex-col'>
                                                    <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                                        Date
                                                    </span>
                                                    <span className='font-bold text-muted-foreground'>{label}</span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                                        Volume
                                                    </span>
                                                    <span className='font-bold'>
                                                        {formatCurrency(payload[0]?.value as number)}
                                                    </span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                                        Transactions
                                                    </span>
                                                    <span className='font-bold'>{payload[1]?.value}</span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                                        Fraud Count
                                                    </span>
                                                    <span className='font-bold text-destructive'>
                                                        {payload[2]?.value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Area
                            type='monotone'
                            dataKey='volume'
                            stackId='1'
                            stroke='hsl(var(--primary))'
                            fill='url(#volumeGradient)'
                            name='Volume'
                        />
                        <Area
                            type='monotone'
                            dataKey='fraudCount'
                            stackId='2'
                            stroke='hsl(var(--destructive))'
                            fill='url(#fraudGradient)'
                            name='Fraud Alerts'
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
