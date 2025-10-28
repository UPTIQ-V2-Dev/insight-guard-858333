import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, Save, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateReportInput, AnalyticsMetric, ReportType, ReportVisualization } from '@/types/analytics';

type ReportBuilderProps = {
    metrics: AnalyticsMetric[];
    onCreateReport: (report: CreateReportInput) => void;
    onPreviewReport: (report: CreateReportInput) => void;
    isLoading?: boolean;
};

export const ReportBuilder = ({ metrics, onCreateReport, onPreviewReport, isLoading = false }: ReportBuilderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<CreateReportInput>({
        name: '',
        description: '',
        type: 'custom',
        filters: {},
        metrics: [],
        visualization: {
            chartType: 'table',
            groupBy: [],
            sortBy: '',
            sortOrder: 'asc'
        }
    });

    const reportTypes: ReportType[] = ['transaction', 'fraud', 'pattern', 'customer', 'merchant', 'custom'];
    const chartTypes = ['line', 'bar', 'pie', 'scatter', 'table', 'heatmap'];
    const timeRanges = ['last_hour', 'last_24h', 'last_7d', 'last_30d', 'last_90d', 'custom'];
    const frequencies = ['daily', 'weekly', 'monthly', 'quarterly'];
    const exportFormats = ['pdf', 'csv', 'excel'];

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: 'custom',
            filters: {},
            metrics: [],
            visualization: {
                chartType: 'table',
                groupBy: [],
                sortBy: '',
                sortOrder: 'asc'
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.metrics.length === 0) {
            toast.error('Please select at least one metric');
            return;
        }

        onCreateReport(formData);
        resetForm();
        setIsOpen(false);
    };

    const handlePreview = () => {
        if (formData.metrics.length === 0) {
            toast.error('Please select at least one metric to preview');
            return;
        }

        onPreviewReport(formData);
    };

    const handleMetricToggle = (metricId: string, checked: boolean) => {
        const newMetrics = checked ? [...formData.metrics, metricId] : formData.metrics.filter(id => id !== metricId);

        setFormData({ ...formData, metrics: newMetrics });
    };

    const handleFilterChange = (key: string, value: any) => {
        setFormData({
            ...formData,
            filters: { ...formData.filters, [key]: value }
        });
    };

    const removeFilter = (key: string) => {
        const newFilters = { ...formData.filters };
        delete newFilters[key];
        setFormData({ ...formData, filters: newFilters });
    };

    const addCustomFilter = () => {
        const key = prompt('Enter filter key:');
        const value = prompt('Enter filter value:');
        if (key && value) {
            handleFilterChange(key, value);
        }
    };

    const handleVisualizationChange = (key: keyof ReportVisualization, value: any) => {
        setFormData({
            ...formData,
            visualization: { ...formData.visualization, [key]: value }
        });
    };

    const handleScheduleToggle = (enabled: boolean) => {
        if (enabled) {
            setFormData({
                ...formData,
                schedule: {
                    frequency: 'weekly',
                    time: '09:00',
                    recipients: [],
                    format: 'pdf'
                }
            });
        } else {
            const { schedule, ...rest } = formData;
            void schedule; // Mark as used
            setFormData(rest);
        }
    };

    const metricsByCategory = metrics.reduce(
        (acc, metric) => {
            if (!acc[metric.category]) {
                acc[metric.category] = [];
            }
            acc[metric.category].push(metric);
            return acc;
        },
        {} as Record<string, AnalyticsMetric[]>
    );

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={resetForm}
                    className='flex items-center gap-2'
                >
                    <Plus className='h-4 w-4' />
                    Create Report
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <BarChart3 className='h-5 w-5' />
                        Create Custom Report
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className='space-y-6'
                >
                    {/* Basic Information */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='name'>Report Name</Label>
                            <Input
                                id='name'
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='type'>Report Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={value => setFormData({ ...formData, type: value as ReportType })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportTypes.map(type => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    {/* Metrics Selection */}
                    <div className='space-y-4'>
                        <Label className='text-base font-semibold'>Select Metrics</Label>
                        <div className='max-h-64 overflow-y-auto border rounded-lg p-4'>
                            {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => (
                                <div
                                    key={category}
                                    className='space-y-2 mb-4'
                                >
                                    <h4 className='font-medium text-sm text-gray-700 uppercase tracking-wide'>
                                        {category}
                                    </h4>
                                    {categoryMetrics.map(metric => (
                                        <div
                                            key={metric.id}
                                            className='flex items-center space-x-2'
                                        >
                                            <Checkbox
                                                id={metric.id}
                                                checked={formData.metrics.includes(metric.id)}
                                                onCheckedChange={checked => handleMetricToggle(metric.id, !!checked)}
                                            />
                                            <div className='flex-1'>
                                                <Label
                                                    htmlFor={metric.id}
                                                    className='font-medium'
                                                >
                                                    {metric.name}
                                                </Label>
                                                <p className='text-sm text-gray-600'>{metric.description}</p>
                                            </div>
                                            <Badge variant='outline'>{metric.dataType}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <Label className='text-base font-semibold'>Filters</Label>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={addCustomFilter}
                            >
                                <Plus className='h-4 w-4 mr-1' />
                                Add Filter
                            </Button>
                        </div>

                        {/* Common Filters */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label>Time Range</Label>
                                <Select
                                    value={formData.filters.timeRange || ''}
                                    onValueChange={value => handleFilterChange('timeRange', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select time range' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeRanges.map(range => (
                                            <SelectItem
                                                key={range}
                                                value={range}
                                            >
                                                {range.replace('_', ' ').toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='space-y-2'>
                                <Label>Transaction Status</Label>
                                <Select
                                    value={formData.filters.status || ''}
                                    onValueChange={value => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='All statuses' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=''>All statuses</SelectItem>
                                        <SelectItem value='completed'>Completed</SelectItem>
                                        <SelectItem value='pending'>Pending</SelectItem>
                                        <SelectItem value='failed'>Failed</SelectItem>
                                        <SelectItem value='suspicious'>Suspicious</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Custom Filters Display */}
                        {Object.entries(formData.filters).length > 0 && (
                            <div className='space-y-2'>
                                <Label className='text-sm font-medium'>Active Filters:</Label>
                                <div className='flex flex-wrap gap-2'>
                                    {Object.entries(formData.filters).map(([key, value]) => (
                                        <Badge
                                            key={key}
                                            variant='secondary'
                                            className='flex items-center gap-1'
                                        >
                                            {key}: {String(value)}
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                className='h-4 w-4 p-0'
                                                onClick={() => removeFilter(key)}
                                            >
                                                <X className='h-3 w-3' />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Visualization Settings */}
                    <div className='space-y-4'>
                        <Label className='text-base font-semibold'>Visualization</Label>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label>Chart Type</Label>
                                <Select
                                    value={formData.visualization.chartType}
                                    onValueChange={value => handleVisualizationChange('chartType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chartTypes.map(type => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='space-y-2'>
                                <Label>Sort By</Label>
                                <Select
                                    value={formData.visualization.sortBy || ''}
                                    onValueChange={value => handleVisualizationChange('sortBy', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select sort field' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formData.metrics.map(metricId => {
                                            const metric = metrics.find(m => m.id === metricId);
                                            return metric ? (
                                                <SelectItem
                                                    key={metric.id}
                                                    value={metric.id}
                                                >
                                                    {metric.name}
                                                </SelectItem>
                                            ) : null;
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <Switch
                                checked={!!formData.schedule}
                                onCheckedChange={handleScheduleToggle}
                            />
                            <Label>Schedule this report</Label>
                        </div>

                        {formData.schedule && (
                            <div className='grid grid-cols-3 gap-4 p-4 border rounded-lg'>
                                <div className='space-y-2'>
                                    <Label>Frequency</Label>
                                    <Select
                                        value={formData.schedule.frequency}
                                        onValueChange={value =>
                                            setFormData({
                                                ...formData,
                                                schedule: { ...formData.schedule!, frequency: value as any }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {frequencies.map(freq => (
                                                <SelectItem
                                                    key={freq}
                                                    value={freq}
                                                >
                                                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label>Time</Label>
                                    <Input
                                        type='time'
                                        value={formData.schedule.time}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                schedule: { ...formData.schedule!, time: e.target.value }
                                            })
                                        }
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label>Format</Label>
                                    <Select
                                        value={formData.schedule.format}
                                        onValueChange={value =>
                                            setFormData({
                                                ...formData,
                                                schedule: { ...formData.schedule!, format: value as any }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {exportFormats.map(format => (
                                                <SelectItem
                                                    key={format}
                                                    value={format}
                                                >
                                                    {format.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex justify-between gap-2 pt-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handlePreview}
                            disabled={isLoading || formData.metrics.length === 0}
                        >
                            Preview
                        </Button>

                        <div className='flex gap-2'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => {
                                    setIsOpen(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={isLoading}
                            >
                                <Save className='h-4 w-4 mr-2' />
                                Create Report
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
