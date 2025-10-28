import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Pattern, CreatePatternRuleInput, PatternRule, PatternType } from '@/types/pattern';

type PatternRulesProps = {
    patterns: Pattern[];
    onCreateRule: (rule: CreatePatternRuleInput) => void;
    onUpdateRule: (id: string, rule: Partial<CreatePatternRuleInput>) => void;
    onDeleteRule: (id: string) => void;
    isLoading?: boolean;
};

export const PatternRules = ({
    patterns,
    onCreateRule,
    onUpdateRule,
    onDeleteRule,
    isLoading = false
}: PatternRulesProps) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPattern, setEditingPattern] = useState<Pattern | null>(null);
    const [formData, setFormData] = useState<CreatePatternRuleInput>({
        name: '',
        description: '',
        type: 'frequency',
        rules: [
            {
                field: '',
                operator: 'equals',
                value: ''
            }
        ],
        isActive: true
    });

    const patternTypes: PatternType[] = [
        'frequency',
        'amount',
        'location',
        'time',
        'merchant',
        'velocity',
        'behavioral'
    ];
    const operators = ['equals', 'greater_than', 'less_than', 'contains', 'in', 'between'];
    const fields = ['amount', 'merchant_id', 'customer_id', 'location', 'time_hour', 'transaction_count', 'velocity'];

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: 'frequency',
            rules: [
                {
                    field: '',
                    operator: 'equals',
                    value: ''
                }
            ],
            isActive: true
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPattern) {
            onUpdateRule(editingPattern.id, formData);
            setEditingPattern(null);
        } else {
            onCreateRule(formData);
        }

        resetForm();
        setIsCreateOpen(false);
    };

    const handleEdit = (pattern: Pattern) => {
        setEditingPattern(pattern);
        setFormData({
            name: pattern.name,
            description: pattern.description,
            type: pattern.type,
            rules: pattern.rules.map(rule => ({
                field: rule.field,
                operator: rule.operator,
                value: rule.value,
                threshold: rule.threshold
            })),
            isActive: pattern.status === 'active'
        });
        setIsCreateOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this pattern rule?')) {
            onDeleteRule(id);
        }
    };

    const addRule = () => {
        setFormData({
            ...formData,
            rules: [...formData.rules, { field: '', operator: 'equals', value: '' }]
        });
    };

    const updateRule = (index: number, rule: Partial<Omit<PatternRule, 'id'>>) => {
        const newRules = [...formData.rules];
        newRules[index] = { ...newRules[index], ...rule };
        setFormData({ ...formData, rules: newRules });
    };

    const removeRule = (index: number) => {
        const newRules = formData.rules.filter((_, i) => i !== index);
        setFormData({ ...formData, rules: newRules });
    };

    const getStatusBadgeColor = (status: Pattern['status']) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'inactive':
                return 'secondary';
            case 'monitoring':
                return 'outline';
            case 'resolved':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getConfidenceBadgeColor = (confidence: Pattern['confidence']) => {
        switch (confidence) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>Pattern Rules</CardTitle>
                    <Dialog
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                    >
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <Plus className='h-4 w-4 mr-2' />
                                Create Pattern Rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingPattern ? 'Edit Pattern Rule' : 'Create Pattern Rule'}
                                </DialogTitle>
                            </DialogHeader>

                            <form
                                onSubmit={handleSubmit}
                                className='space-y-4'
                            >
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='name'>Name</Label>
                                        <Input
                                            id='name'
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='type'>Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={value =>
                                                setFormData({ ...formData, type: value as PatternType })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {patternTypes.map(type => (
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

                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <Label>Rules</Label>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={addRule}
                                        >
                                            <Plus className='h-4 w-4 mr-1' />
                                            Add Rule
                                        </Button>
                                    </div>

                                    {formData.rules.map((rule, index) => (
                                        <div
                                            key={index}
                                            className='p-4 border rounded-lg space-y-2'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span className='text-sm font-medium'>Rule {index + 1}</span>
                                                {formData.rules.length > 1 && (
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => removeRule(index)}
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-3 gap-2'>
                                                <Select
                                                    value={rule.field}
                                                    onValueChange={value => updateRule(index, { field: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Field' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fields.map(field => (
                                                            <SelectItem
                                                                key={field}
                                                                value={field}
                                                            >
                                                                {field.replace('_', ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={rule.operator}
                                                    onValueChange={value =>
                                                        updateRule(index, { operator: value as any })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {operators.map(op => (
                                                            <SelectItem
                                                                key={op}
                                                                value={op}
                                                            >
                                                                {op.replace('_', ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Input
                                                    placeholder='Value'
                                                    value={rule.value}
                                                    onChange={e => updateRule(index, { value: e.target.value })}
                                                />
                                            </div>

                                            {rule.operator === 'greater_than' || rule.operator === 'less_than' ? (
                                                <Input
                                                    type='number'
                                                    placeholder='Threshold'
                                                    value={rule.threshold || ''}
                                                    onChange={e =>
                                                        updateRule(index, {
                                                            threshold: e.target.value
                                                                ? parseFloat(e.target.value)
                                                                : undefined
                                                        })
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>

                                <div className='flex justify-end gap-2 pt-4'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => {
                                            setIsCreateOpen(false);
                                            setEditingPattern(null);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isLoading}
                                    >
                                        {editingPattern ? 'Update' : 'Create'} Pattern Rule
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead>Detections</TableHead>
                                <TableHead>Risk Level</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patterns.map(pattern => (
                                <TableRow key={pattern.id}>
                                    <TableCell className='font-medium'>{pattern.name}</TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>{pattern.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeColor(pattern.status)}>{pattern.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getConfidenceBadgeColor(pattern.confidence)}>
                                            {pattern.confidence}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{pattern.detectionCount.toLocaleString()}</TableCell>
                                    <TableCell>{pattern.riskLevel}%</TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex items-center gap-2 justify-end'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleEdit(pattern)}
                                            >
                                                <Edit className='h-4 w-4' />
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleDelete(pattern.id)}
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
