import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { settingsService } from '@/services/settings';
import { User, Shield, Bell, Key, Link, Trash2, Plus, Copy, Eye, EyeOff } from 'lucide-react';
import type { UserSettings, SystemConfiguration, CreateApiKeyInput, NotificationChannel } from '@/types/settings';

export const SettingsPage = () => {
    const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
    const [,] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [newApiKeyData, setNewApiKeyData] = useState<{ apiKey: any; secretKey: string } | null>(null);

    const queryClient = useQueryClient();

    // Helper function to provide defaults for user preferences
    const getDefaultPreferences = () => ({
        theme: 'light' as const,
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
        dashboardLayout: 'default' as const
    });

    const getDefaultNotifications = () => ({
        channels: ['email'] as NotificationChannel[],
        fraudAlerts: true,
        patternDetection: true,
        systemUpdates: false,
        reportGeneration: true,
        thresholds: {
            highRisk: true,
            mediumRisk: true,
            lowRisk: false
        }
    });

    const getDefaultSecurity = () => ({
        twoFactorEnabled: false,
        sessionTimeout: 30,
        ipWhitelist: [] as string[]
    });

    const getDefaultRiskThresholds = () => ({
        low: 25,
        medium: 50,
        high: 75
    });

    const getDefaultFraudDetection = () => ({
        enabled: true,
        sensitivity: 'medium' as const,
        autoBlock: false,
        reviewThreshold: 70
    });

    // Fetch user settings
    const { data: userSettings, isLoading: userSettingsLoading } = useQuery({
        queryKey: ['user-settings'],
        queryFn: settingsService.getUserSettings
    });

    // Fetch system configuration
    const { data: systemConfig, isLoading: systemConfigLoading } = useQuery({
        queryKey: ['system-config'],
        queryFn: settingsService.getSystemConfiguration
    });

    // Fetch integrations
    const { data: integrations, isLoading: integrationsLoading } = useQuery({
        queryKey: ['integrations'],
        queryFn: settingsService.getIntegrations
    });

    // Fetch API keys
    const { data: apiKeys, isLoading: apiKeysLoading } = useQuery({
        queryKey: ['api-keys'],
        queryFn: settingsService.getApiKeys
    });

    // Mutations
    const updateUserSettingsMutation = useMutation({
        mutationFn: (settings: Partial<UserSettings>) => settingsService.updateUserSettings(settings),
        onSuccess: () => {
            toast.success('Settings updated successfully');
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
        },
        onError: () => toast.error('Failed to update settings')
    });

    const updateSystemConfigMutation = useMutation({
        mutationFn: (config: Partial<SystemConfiguration>) => settingsService.updateSystemConfiguration(config),
        onSuccess: () => {
            toast.success('System configuration updated');
            queryClient.invalidateQueries({ queryKey: ['system-config'] });
        },
        onError: () => toast.error('Failed to update system configuration')
    });

    const createApiKeyMutation = useMutation({
        mutationFn: settingsService.createApiKey,
        onSuccess: data => {
            setNewApiKeyData(data);
            toast.success('API key created successfully');
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
        },
        onError: () => toast.error('Failed to create API key')
    });

    const deleteApiKeyMutation = useMutation({
        mutationFn: settingsService.deleteApiKey,
        onSuccess: () => {
            toast.success('API key deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
        },
        onError: () => toast.error('Failed to delete API key')
    });

    const handleUserSettingsUpdate = (updates: Partial<UserSettings>) => {
        updateUserSettingsMutation.mutate(updates);
    };

    const handleSystemConfigUpdate = (updates: Partial<SystemConfiguration>) => {
        updateSystemConfigMutation.mutate(updates);
    };

    const handleCreateApiKey = (input: CreateApiKeyInput) => {
        createApiKeyMutation.mutate(input);
        setIsApiKeyDialogOpen(false);
    };

    const handleDeleteApiKey = (id: string) => {
        if (confirm('Are you sure you want to delete this API key?')) {
            deleteApiKeyMutation.mutate(id);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='p-6 space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
                <p className='text-gray-600'>
                    Manage your account preferences, system configuration, and integrations.
                </p>
            </div>

            <Tabs
                defaultValue='profile'
                className='space-y-6'
            >
                <TabsList className='grid w-full grid-cols-5'>
                    <TabsTrigger value='profile'>Profile</TabsTrigger>
                    <TabsTrigger value='notifications'>Notifications</TabsTrigger>
                    <TabsTrigger value='security'>Security</TabsTrigger>
                    <TabsTrigger value='system'>System</TabsTrigger>
                    <TabsTrigger value='integrations'>Integrations</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='profile'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <User className='h-5 w-5' />
                                User Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {userSettingsLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label>Theme</Label>
                                        <Select
                                            value={userSettings?.preferences.theme || 'light'}
                                            onValueChange={value =>
                                                handleUserSettingsUpdate({
                                                    preferences: {
                                                        ...getDefaultPreferences(),
                                                        ...userSettings?.preferences,
                                                        theme: value as any
                                                    }
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='light'>Light</SelectItem>
                                                <SelectItem value='dark'>Dark</SelectItem>
                                                <SelectItem value='system'>System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>Language</Label>
                                        <Select
                                            value={userSettings?.preferences.language || 'en'}
                                            onValueChange={value =>
                                                handleUserSettingsUpdate({
                                                    preferences: {
                                                        ...getDefaultPreferences(),
                                                        ...userSettings?.preferences,
                                                        language: value
                                                    }
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='en'>English</SelectItem>
                                                <SelectItem value='es'>Spanish</SelectItem>
                                                <SelectItem value='fr'>French</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>Timezone</Label>
                                        <Select
                                            value={userSettings?.preferences.timezone || 'UTC'}
                                            onValueChange={value =>
                                                handleUserSettingsUpdate({
                                                    preferences: {
                                                        ...getDefaultPreferences(),
                                                        ...userSettings?.preferences,
                                                        timezone: value
                                                    }
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='UTC'>UTC</SelectItem>
                                                <SelectItem value='America/New_York'>Eastern Time</SelectItem>
                                                <SelectItem value='America/Los_Angeles'>Pacific Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label>Dashboard Layout</Label>
                                        <Select
                                            value={userSettings?.preferences.dashboardLayout || 'default'}
                                            onValueChange={value =>
                                                handleUserSettingsUpdate({
                                                    preferences: {
                                                        ...getDefaultPreferences(),
                                                        ...userSettings?.preferences,
                                                        dashboardLayout: value as any
                                                    }
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='default'>Default</SelectItem>
                                                <SelectItem value='compact'>Compact</SelectItem>
                                                <SelectItem value='detailed'>Detailed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent
                    value='notifications'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Bell className='h-5 w-5' />
                                Notification Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {userSettingsLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <Label>Fraud Alerts</Label>
                                            <p className='text-sm text-gray-600'>Get notified about fraud detections</p>
                                        </div>
                                        <Switch
                                            checked={userSettings?.notifications.fraudAlerts || false}
                                            onCheckedChange={checked =>
                                                handleUserSettingsUpdate({
                                                    notifications: {
                                                        ...getDefaultNotifications(),
                                                        ...userSettings?.notifications,
                                                        fraudAlerts: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <Label>Pattern Detection</Label>
                                            <p className='text-sm text-gray-600'>Alerts for new pattern discoveries</p>
                                        </div>
                                        <Switch
                                            checked={userSettings?.notifications.patternDetection || false}
                                            onCheckedChange={checked =>
                                                handleUserSettingsUpdate({
                                                    notifications: {
                                                        ...getDefaultNotifications(),
                                                        ...userSettings?.notifications,
                                                        patternDetection: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <Label>System Updates</Label>
                                            <p className='text-sm text-gray-600'>Notifications about system changes</p>
                                        </div>
                                        <Switch
                                            checked={userSettings?.notifications.systemUpdates || false}
                                            onCheckedChange={checked =>
                                                handleUserSettingsUpdate({
                                                    notifications: {
                                                        ...getDefaultNotifications(),
                                                        ...userSettings?.notifications,
                                                        systemUpdates: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <Label>Report Generation</Label>
                                            <p className='text-sm text-gray-600'>
                                                Alerts when scheduled reports are ready
                                            </p>
                                        </div>
                                        <Switch
                                            checked={userSettings?.notifications.reportGeneration || false}
                                            onCheckedChange={checked =>
                                                handleUserSettingsUpdate({
                                                    notifications: {
                                                        ...getDefaultNotifications(),
                                                        ...userSettings?.notifications,
                                                        reportGeneration: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent
                    value='security'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Shield className='h-5 w-5' />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {userSettingsLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <Label>Two-Factor Authentication</Label>
                                            <p className='text-sm text-gray-600'>Add an extra layer of security</p>
                                        </div>
                                        <Switch
                                            checked={userSettings?.security.twoFactorEnabled || false}
                                            onCheckedChange={checked =>
                                                handleUserSettingsUpdate({
                                                    security: {
                                                        ...getDefaultSecurity(),
                                                        ...userSettings?.security,
                                                        twoFactorEnabled: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label>Session Timeout (minutes)</Label>
                                            <Input
                                                type='number'
                                                value={userSettings?.security.sessionTimeout || 30}
                                                onChange={e =>
                                                    handleUserSettingsUpdate({
                                                        security: {
                                                            ...getDefaultSecurity(),
                                                            ...userSettings?.security,
                                                            sessionTimeout: parseInt(e.target.value)
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* API Keys Section */}
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle className='flex items-center gap-2'>
                                    <Key className='h-5 w-5' />
                                    API Keys
                                </CardTitle>
                                <Dialog
                                    open={isApiKeyDialogOpen}
                                    onOpenChange={setIsApiKeyDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className='h-4 w-4 mr-2' />
                                            Create API Key
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create API Key</DialogTitle>
                                        </DialogHeader>
                                        <form
                                            onSubmit={e => {
                                                e.preventDefault();
                                                const formData = new FormData(e.target as HTMLFormElement);
                                                const input: CreateApiKeyInput = {
                                                    name: formData.get('name') as string,
                                                    permissions: ['read:transactions', 'read:fraud']
                                                };
                                                handleCreateApiKey(input);
                                            }}
                                            className='space-y-4'
                                        >
                                            <div className='space-y-2'>
                                                <Label htmlFor='name'>Key Name</Label>
                                                <Input
                                                    id='name'
                                                    name='name'
                                                    required
                                                />
                                            </div>
                                            <div className='flex justify-end gap-2'>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={() => setIsApiKeyDialogOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type='submit'>Create Key</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {newApiKeyData && (
                                <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded'>
                                    <div className='font-medium text-green-800 mb-2'>API Key Created Successfully</div>
                                    <div className='space-y-2'>
                                        <div>
                                            <Label className='text-sm text-green-700'>
                                                Secret Key (copy now, it won't be shown again):
                                            </Label>
                                            <div className='flex items-center gap-2 mt-1'>
                                                <Input
                                                    value={showApiKey ? newApiKeyData.secretKey : '•'.repeat(32)}
                                                    readOnly
                                                    className='font-mono text-sm'
                                                />
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() => setShowApiKey(!showApiKey)}
                                                >
                                                    {showApiKey ? (
                                                        <EyeOff className='h-4 w-4' />
                                                    ) : (
                                                        <Eye className='h-4 w-4' />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() => copyToClipboard(newApiKeyData.secretKey)}
                                                >
                                                    <Copy className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => setNewApiKeyData(null)}
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {apiKeysLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='rounded-md border'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Key</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Last Used</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className='text-right'>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {apiKeys?.map(key => (
                                                <TableRow key={key.id}>
                                                    <TableCell className='font-medium'>{key.name}</TableCell>
                                                    <TableCell className='font-mono text-sm'>
                                                        {key.keyPreview}
                                                    </TableCell>
                                                    <TableCell className='text-sm text-gray-600'>
                                                        {formatDate(key.createdAt)}
                                                    </TableCell>
                                                    <TableCell className='text-sm text-gray-600'>
                                                        {key.lastUsed ? formatDate(key.lastUsed) : 'Never'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={key.isActive ? 'default' : 'secondary'}>
                                                            {key.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() => handleDeleteApiKey(key.id)}
                                                        >
                                                            <Trash2 className='h-4 w-4' />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent
                    value='system'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>System Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {systemConfigLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-lg font-medium mb-4'>Risk Thresholds</h3>
                                        <div className='grid grid-cols-3 gap-4'>
                                            <div className='space-y-2'>
                                                <Label>Low Risk (%)</Label>
                                                <Input
                                                    type='number'
                                                    value={systemConfig?.riskThresholds.low || 25}
                                                    onChange={e =>
                                                        handleSystemConfigUpdate({
                                                            riskThresholds: {
                                                                ...getDefaultRiskThresholds(),
                                                                ...systemConfig?.riskThresholds,
                                                                low: parseInt(e.target.value)
                                                            }
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Medium Risk (%)</Label>
                                                <Input
                                                    type='number'
                                                    value={systemConfig?.riskThresholds.medium || 50}
                                                    onChange={e =>
                                                        handleSystemConfigUpdate({
                                                            riskThresholds: {
                                                                ...getDefaultRiskThresholds(),
                                                                ...systemConfig?.riskThresholds,
                                                                medium: parseInt(e.target.value)
                                                            }
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>High Risk (%)</Label>
                                                <Input
                                                    type='number'
                                                    value={systemConfig?.riskThresholds.high || 75}
                                                    onChange={e =>
                                                        handleSystemConfigUpdate({
                                                            riskThresholds: {
                                                                ...getDefaultRiskThresholds(),
                                                                ...systemConfig?.riskThresholds,
                                                                high: parseInt(e.target.value)
                                                            }
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className='text-lg font-medium mb-4'>Fraud Detection</h3>
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <Label>Enable Fraud Detection</Label>
                                                    <p className='text-sm text-gray-600'>
                                                        Automatically detect fraudulent transactions
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={systemConfig?.fraudDetection.enabled || false}
                                                    onCheckedChange={checked =>
                                                        handleSystemConfigUpdate({
                                                            fraudDetection: {
                                                                ...getDefaultFraudDetection(),
                                                                ...systemConfig?.fraudDetection,
                                                                enabled: checked
                                                            }
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='space-y-2'>
                                                    <Label>Sensitivity</Label>
                                                    <Select
                                                        value={systemConfig?.fraudDetection.sensitivity || 'medium'}
                                                        onValueChange={value =>
                                                            handleSystemConfigUpdate({
                                                                fraudDetection: {
                                                                    ...getDefaultFraudDetection(),
                                                                    ...systemConfig?.fraudDetection,
                                                                    sensitivity: value as any
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value='low'>Low</SelectItem>
                                                            <SelectItem value='medium'>Medium</SelectItem>
                                                            <SelectItem value='high'>High</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className='space-y-2'>
                                                    <Label>Review Threshold</Label>
                                                    <Input
                                                        type='number'
                                                        value={systemConfig?.fraudDetection.reviewThreshold || 70}
                                                        onChange={e =>
                                                            handleSystemConfigUpdate({
                                                                fraudDetection: {
                                                                    ...getDefaultFraudDetection(),
                                                                    ...systemConfig?.fraudDetection,
                                                                    reviewThreshold: parseInt(e.target.value)
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent
                    value='integrations'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle className='flex items-center gap-2'>
                                    <Link className='h-5 w-5' />
                                    Integrations
                                </CardTitle>
                                <Button onClick={() => toast.info('Integration creation would be implemented')}>
                                    <Plus className='h-4 w-4 mr-2' />
                                    Add Integration
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {integrationsLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='h-12 bg-gray-100 rounded animate-pulse'
                                        />
                                    ))}
                                </div>
                            ) : integrations && integrations.length > 0 ? (
                                <div className='space-y-4'>
                                    {integrations.map(integration => (
                                        <div
                                            key={integration.id}
                                            className='flex items-center justify-between p-4 border rounded-lg'
                                        >
                                            <div>
                                                <div className='font-medium'>{integration.name}</div>
                                                <div className='text-sm text-gray-600 capitalize'>
                                                    {integration.type}
                                                </div>
                                                {integration.lastSync && (
                                                    <div className='text-xs text-gray-500'>
                                                        Last sync: {formatDate(integration.lastSync)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Badge
                                                    variant={integration.status === 'active' ? 'default' : 'secondary'}
                                                >
                                                    {integration.status}
                                                </Badge>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-8 text-gray-500'>
                                    <Link className='h-12 w-12 mx-auto mb-4 opacity-50' />
                                    <p>No integrations configured yet.</p>
                                    <p className='text-sm'>Add integrations to connect with external services.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
