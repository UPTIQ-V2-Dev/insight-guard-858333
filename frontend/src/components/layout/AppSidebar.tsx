import { BarChart3, Home, Search, Settings, Shield, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '../ui/sidebar';

const menuItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home
    },
    {
        title: 'Transaction Analysis',
        url: '/transactions',
        icon: Search
    },
    {
        title: 'Pattern Detection',
        url: '/patterns',
        icon: TrendingUp
    },
    {
        title: 'Fraud Monitoring',
        url: '/fraud-monitoring',
        icon: Shield
    },
    {
        title: 'Analytics & Reports',
        url: '/analytics',
        icon: BarChart3
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings
    }
];

export const AppSidebar = () => {
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarHeader className='border-b px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <Shield className='h-6 w-6 text-primary' />
                    <div className='flex flex-col'>
                        <span className='text-lg font-semibold'>FraudGuard</span>
                        <span className='text-xs text-muted-foreground'>Pattern Analysis</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map(item => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                        >
                                            <Link to={item.url}>
                                                <item.icon className='h-4 w-4' />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className='border-t p-4'>
                <div className='text-xs text-muted-foreground'>© 2024 FraudGuard Analytics</div>
            </SidebarFooter>
        </Sidebar>
    );
};
