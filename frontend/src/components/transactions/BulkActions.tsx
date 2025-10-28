import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Shield, Check, X, Flag } from 'lucide-react';
import type { BulkActionType, TransactionExportFormat } from '@/types/transaction';

type BulkActionsProps = {
    selectedCount: number;
    onBulkAction: (action: BulkActionType, reason?: string) => void;
    onExport: (format: TransactionExportFormat) => void;
    onClearSelection: () => void;
    isLoading?: boolean;
};

export const BulkActions = ({
    selectedCount,
    onBulkAction,
    onExport,
    onClearSelection,
    isLoading = false
}: BulkActionsProps) => {
    const [reason, setReason] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<BulkActionType | null>(null);

    const handleBulkAction = (action: BulkActionType) => {
        if (action === 'reject' || action === 'flag') {
            setPendingAction(action);
            setIsDialogOpen(true);
        } else {
            onBulkAction(action);
        }
    };

    const confirmAction = () => {
        if (pendingAction) {
            onBulkAction(pendingAction, reason);
            setIsDialogOpen(false);
            setPendingAction(null);
            setReason('');
        }
    };

    const getActionIcon = (action: BulkActionType) => {
        switch (action) {
            case 'approve':
                return <Check className='h-4 w-4' />;
            case 'reject':
                return <X className='h-4 w-4' />;
            case 'flag':
                return <Flag className='h-4 w-4' />;
            case 'investigate':
                return <Shield className='h-4 w-4' />;
            default:
                return null;
        }
    };

    const getActionLabel = (action: BulkActionType) => {
        switch (action) {
            case 'approve':
                return 'Approve';
            case 'reject':
                return 'Reject';
            case 'flag':
                return 'Flag as Suspicious';
            case 'investigate':
                return 'Start Investigation';
            default:
                return action;
        }
    };

    if (selectedCount === 0) {
        return null;
    }

    return (
        <>
            <Card className='mb-6'>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                        Bulk Actions
                        <span className='text-sm font-normal text-gray-600'>
                            {selectedCount} transaction{selectedCount !== 1 ? 's' : ''} selected
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-wrap gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleBulkAction('approve')}
                            disabled={isLoading}
                            className='flex items-center gap-2'
                        >
                            {getActionIcon('approve')}
                            {getActionLabel('approve')}
                        </Button>

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleBulkAction('reject')}
                            disabled={isLoading}
                            className='flex items-center gap-2'
                        >
                            {getActionIcon('reject')}
                            {getActionLabel('reject')}
                        </Button>

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleBulkAction('flag')}
                            disabled={isLoading}
                            className='flex items-center gap-2'
                        >
                            {getActionIcon('flag')}
                            {getActionLabel('flag')}
                        </Button>

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleBulkAction('investigate')}
                            disabled={isLoading}
                            className='flex items-center gap-2'
                        >
                            {getActionIcon('investigate')}
                            {getActionLabel('investigate')}
                        </Button>

                        <div className='flex items-center gap-2 ml-auto'>
                            <Select onValueChange={format => onExport(format as TransactionExportFormat)}>
                                <SelectTrigger className='w-32'>
                                    <SelectValue placeholder='Export' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='csv'>CSV</SelectItem>
                                    <SelectItem value='pdf'>PDF</SelectItem>
                                    <SelectItem value='excel'>Excel</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={onClearSelection}
                                disabled={isLoading}
                            >
                                Clear Selection
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm {pendingAction === 'reject' ? 'Rejection' : 'Flag Action'}</DialogTitle>
                        <DialogDescription>
                            You are about to {pendingAction === 'reject' ? 'reject' : 'flag'} {selectedCount}{' '}
                            transaction{selectedCount !== 1 ? 's' : ''}. Please provide a reason for this action.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='space-y-2'>
                        <Label htmlFor='reason'>Reason</Label>
                        <Textarea
                            id='reason'
                            placeholder={`Enter reason for ${pendingAction === 'reject' ? 'rejecting' : 'flagging'} these transactions...`}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setIsDialogOpen(false);
                                setPendingAction(null);
                                setReason('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmAction}
                            disabled={!reason.trim()}
                        >
                            Confirm {pendingAction === 'reject' ? 'Rejection' : 'Flag Action'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
