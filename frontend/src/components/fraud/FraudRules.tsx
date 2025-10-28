import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import type { FraudRule, CreateFraudRuleInput } from '@/types/fraud';

type FraudRulesProps = {
    rules: FraudRule[];
    onCreateRule: (rule: CreateFraudRuleInput) => void;
    onUpdateRule: (id: string, rule: Partial<CreateFraudRuleInput>) => void;
    onDeleteRule: (id: string) => void;
    isLoading?: boolean;
};

export const FraudRules = ({ rules, onCreateRule, onUpdateRule, onDeleteRule, isLoading = false }: FraudRulesProps) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<FraudRule | null>(null);
    const [formData, setFormData] = useState<CreateFraudRuleInput>({
        name: '',
        description: '',
        conditions: [
            {
                field: '',
                operator: 'equals',
                value: ''
            }
        ],
        actions: [
            {
                type: 'alert',
                severity: 'medium'
            }
        ],
        priority: 1,
        isActive: true
    });

    const operators = ['equals', 'greater_than', 'less_than', 'contains', 'in', 'between'];
    const fields = ['amount', 'merchant_id', 'customer_id', 'location', 'ip_address', 'velocity', 'time_hour'];
    const actionTypes = ['flag', 'block', 'alert', 'review'];
    const severityLevels = ['low', 'medium', 'high', 'critical'];

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            conditions: [
                {
                    field: '',
                    operator: 'equals',
                    value: ''
                }
            ],
            actions: [
                {
                    type: 'alert',
                    severity: 'medium'
                }
            ],
            priority: 1,
            isActive: true
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRule) {
            onUpdateRule(editingRule.id, formData);
            setEditingRule(null);
        } else {
            onCreateRule(formData);
        }

        resetForm();
        setIsCreateOpen(false);
    };

    const handleEdit = (rule: FraudRule) => {
        setEditingRule(rule);
        setFormData({
            name: rule.name,
            description: rule.description,
            conditions: rule.conditions,
            actions: rule.actions,
            priority: rule.priority,
            isActive: rule.isActive
        });
        setIsCreateOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this fraud rule?')) {
            onDeleteRule(id);
        }
    };

    const handleToggleActive = (rule: FraudRule) => {
        onUpdateRule(rule.id, { isActive: !rule.isActive });
    };

    const addCondition = () => {
        setFormData({
            ...formData,
            conditions: [...formData.conditions, { field: '', operator: 'equals', value: '' }]
        });
    };

    const updateCondition = (index: number, condition: Partial<(typeof formData.conditions)[0]>) => {
        const newConditions = [...formData.conditions];
        newConditions[index] = { ...newConditions[index], ...condition };
        setFormData({ ...formData, conditions: newConditions });
    };

    const removeCondition = (index: number) => {
        const newConditions = formData.conditions.filter((_, i) => i !== index);
        setFormData({ ...formData, conditions: newConditions });
    };

    const addAction = () => {
        setFormData({
            ...formData,
            actions: [...formData.actions, { type: 'alert', severity: 'medium' }]
        });
    };

    const updateAction = (index: number, action: Partial<(typeof formData.actions)[0]>) => {
        const newActions = [...formData.actions];
        newActions[index] = { ...newActions[index], ...action };
        setFormData({ ...formData, actions: newActions });
    };

    const removeAction = (index: number) => {
        const newActions = formData.actions.filter((_, i) => i !== index);
        setFormData({ ...formData, actions: newActions });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>Fraud Detection Rules</CardTitle>
                    <Dialog
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                    >
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <Plus className='h-4 w-4 mr-2' />
                                Create Rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                            <DialogHeader>
                                <DialogTitle>{editingRule ? 'Edit Fraud Rule' : 'Create Fraud Rule'}</DialogTitle>
                            </DialogHeader>

                            <form
                                onSubmit={handleSubmit}
                                className='space-y-6'
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
                                        <Label htmlFor='priority'>Priority</Label>
                                        <Input
                                            id='priority'
                                            type='number'
                                            min='1'
                                            max='10'
                                            value={formData.priority}
                                            onChange={e =>
                                                setFormData({ ...formData, priority: parseInt(e.target.value) })
                                            }
                                            required
                                        />
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

                                <div className='flex items-center space-x-2'>
                                    <Switch
                                        id='isActive'
                                        checked={formData.isActive}
                                        onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                                    />
                                    <Label htmlFor='isActive'>Rule is active</Label>
                                </div>

                                {/* Conditions Section */}
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <Label className='text-base font-semibold'>Conditions</Label>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={addCondition}
                                        >
                                            <Plus className='h-4 w-4 mr-1' />
                                            Add Condition
                                        </Button>
                                    </div>

                                    {formData.conditions.map((condition, index) => (
                                        <div
                                            key={index}
                                            className='p-4 border rounded-lg space-y-2'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span className='text-sm font-medium'>Condition {index + 1}</span>
                                                {formData.conditions.length > 1 && (
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => removeCondition(index)}
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-3 gap-2'>
                                                <Select
                                                    value={condition.field}
                                                    onValueChange={value => updateCondition(index, { field: value })}
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
                                                    value={condition.operator}
                                                    onValueChange={value =>
                                                        updateCondition(index, { operator: value as any })
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
                                                    value={condition.value}
                                                    onChange={e => updateCondition(index, { value: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions Section */}
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <Label className='text-base font-semibold'>Actions</Label>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={addAction}
                                        >
                                            <Plus className='h-4 w-4 mr-1' />
                                            Add Action
                                        </Button>
                                    </div>

                                    {formData.actions.map((action, index) => (
                                        <div
                                            key={index}
                                            className='p-4 border rounded-lg space-y-2'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span className='text-sm font-medium'>Action {index + 1}</span>
                                                {formData.actions.length > 1 && (
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => removeAction(index)}
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-2 gap-2'>
                                                <Select
                                                    value={action.type}
                                                    onValueChange={value => updateAction(index, { type: value as any })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Action Type' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {actionTypes.map(type => (
                                                            <SelectItem
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={action.severity}
                                                    onValueChange={value =>
                                                        updateAction(index, { severity: value as any })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Severity' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {severityLevels.map(severity => (
                                                            <SelectItem
                                                                key={severity}
                                                                value={severity}
                                                            >
                                                                {severity}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Input
                                                placeholder='Optional message'
                                                value={action.message || ''}
                                                onChange={e => updateAction(index, { message: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className='flex justify-end gap-2 pt-4'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => {
                                            setIsCreateOpen(false);
                                            setEditingRule(null);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isLoading}
                                    >
                                        {editingRule ? 'Update' : 'Create'} Rule
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
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Triggered</TableHead>
                                <TableHead>False Positive Rate</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map(rule => (
                                <TableRow key={rule.id}>
                                    <TableCell>
                                        <div className='font-medium'>{rule.name}</div>
                                        <div className='text-sm text-gray-600 max-w-64 truncate'>
                                            {rule.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                                            {rule.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>{rule.priority}</Badge>
                                    </TableCell>
                                    <TableCell>{rule.triggeredCount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={rule.falsePositiveRate > 0.2 ? 'text-red-600' : 'text-green-600'}
                                        >
                                            {(rule.falsePositiveRate * 100).toFixed(1)}%
                                        </span>
                                    </TableCell>
                                    <TableCell className='text-sm text-gray-600'>
                                        {formatDate(rule.createdAt)}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex items-center gap-2 justify-end'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleToggleActive(rule)}
                                                title={rule.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {rule.isActive ? (
                                                    <Pause className='h-4 w-4' />
                                                ) : (
                                                    <Play className='h-4 w-4' />
                                                )}
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleEdit(rule)}
                                            >
                                                <Edit className='h-4 w-4' />
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleDelete(rule.id)}
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
