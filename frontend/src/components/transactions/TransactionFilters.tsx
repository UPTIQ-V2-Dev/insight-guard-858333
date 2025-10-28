import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import type { TransactionFilters as TFilters } from '@/types/transaction';

type TransactionFiltersProps = {
    onFiltersChange: (filters: TFilters) => void;
    onClearFilters: () => void;
    activeFilters?: TFilters;
};

export const TransactionFilters = ({ onFiltersChange, onClearFilters, activeFilters }: TransactionFiltersProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<TFilters>(activeFilters || {});

    const handleFilterChange = (key: keyof TFilters, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        onClearFilters();
    };

    const getActiveFilterCount = () => {
        return Object.values(activeFilters || {}).filter(
            value => value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)
        ).length;
    };

    return (
        <Card className='mb-6'>
            <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                        <Filter className='h-5 w-5' />
                        Filters
                        {getActiveFilterCount() > 0 && <Badge variant='secondary'>{getActiveFilterCount()}</Badge>}
                    </CardTitle>
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? 'Hide' : 'Show'} Filters
                        </Button>
                        {getActiveFilterCount() > 0 && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={clearFilters}
                            >
                                <X className='h-4 w-4 mr-1' />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            {isOpen && (
                <CardContent className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <div className='space-y-2'>
                        <Label htmlFor='search'>Search</Label>
                        <Input
                            id='search'
                            placeholder='Search transactions...'
                            value={filters.search || ''}
                            onChange={e => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='status'>Status</Label>
                        <Select
                            value={filters.status?.[0] || ''}
                            onValueChange={value => handleFilterChange('status', value ? [value] : undefined)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='All statuses' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All statuses</SelectItem>
                                <SelectItem value='pending'>Pending</SelectItem>
                                <SelectItem value='completed'>Completed</SelectItem>
                                <SelectItem value='failed'>Failed</SelectItem>
                                <SelectItem value='suspicious'>Suspicious</SelectItem>
                                <SelectItem value='flagged'>Flagged</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='type'>Type</Label>
                        <Select
                            value={filters.type?.[0] || ''}
                            onValueChange={value => handleFilterChange('type', value ? [value] : undefined)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='All types' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All types</SelectItem>
                                <SelectItem value='credit'>Credit</SelectItem>
                                <SelectItem value='debit'>Debit</SelectItem>
                                <SelectItem value='transfer'>Transfer</SelectItem>
                                <SelectItem value='payment'>Payment</SelectItem>
                                <SelectItem value='withdrawal'>Withdrawal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='date-from'>Date From</Label>
                        <Input
                            id='date-from'
                            type='date'
                            value={filters.dateRange?.from || ''}
                            onChange={e =>
                                handleFilterChange('dateRange', {
                                    ...filters.dateRange,
                                    from: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='date-to'>Date To</Label>
                        <Input
                            id='date-to'
                            type='date'
                            value={filters.dateRange?.to || ''}
                            onChange={e =>
                                handleFilterChange('dateRange', {
                                    ...filters.dateRange,
                                    to: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='min-amount'>Min Amount</Label>
                        <Input
                            id='min-amount'
                            type='number'
                            placeholder='0.00'
                            value={filters.amountRange?.min || ''}
                            onChange={e =>
                                handleFilterChange('amountRange', {
                                    ...filters.amountRange,
                                    min: e.target.value ? parseFloat(e.target.value) : undefined
                                })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='max-amount'>Max Amount</Label>
                        <Input
                            id='max-amount'
                            type='number'
                            placeholder='999999.99'
                            value={filters.amountRange?.max || ''}
                            onChange={e =>
                                handleFilterChange('amountRange', {
                                    ...filters.amountRange,
                                    max: e.target.value ? parseFloat(e.target.value) : undefined
                                })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='risk-min'>Min Risk Score</Label>
                        <Input
                            id='risk-min'
                            type='number'
                            min='0'
                            max='100'
                            placeholder='0'
                            value={filters.riskScoreRange?.min || ''}
                            onChange={e =>
                                handleFilterChange('riskScoreRange', {
                                    ...filters.riskScoreRange,
                                    min: e.target.value ? parseInt(e.target.value) : undefined
                                })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='risk-max'>Max Risk Score</Label>
                        <Input
                            id='risk-max'
                            type='number'
                            min='0'
                            max='100'
                            placeholder='100'
                            value={filters.riskScoreRange?.max || ''}
                            onChange={e =>
                                handleFilterChange('riskScoreRange', {
                                    ...filters.riskScoreRange,
                                    max: e.target.value ? parseInt(e.target.value) : undefined
                                })
                            }
                        />
                    </div>
                </CardContent>
            )}
        </Card>
    );
};
