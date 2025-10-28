import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Search, TrendingUp, Shield, BarChart3, Settings } from 'lucide-react';
import { QueryProvider } from './components/providers/QueryProvider';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ComingSoonPage } from './pages/ComingSoonPage';

export const App = () => {
    return (
        <QueryProvider>
            <Router>
                <AppLayout>
                    <Routes>
                        <Route
                            path='/'
                            element={
                                <Navigate
                                    to='/dashboard'
                                    replace
                                />
                            }
                        />
                        <Route
                            path='/dashboard'
                            element={<DashboardPage />}
                        />
                        <Route
                            path='/transactions'
                            element={
                                <ComingSoonPage
                                    title='Transaction Analysis'
                                    description='Advanced transaction analysis with filtering and pattern detection'
                                    icon={<Search className='h-8 w-8' />}
                                />
                            }
                        />
                        <Route
                            path='/patterns'
                            element={
                                <ComingSoonPage
                                    title='Pattern Detection'
                                    description='AI-powered pattern recognition and behavioral analysis'
                                    icon={<TrendingUp className='h-8 w-8' />}
                                />
                            }
                        />
                        <Route
                            path='/fraud-monitoring'
                            element={
                                <ComingSoonPage
                                    title='Fraud Monitoring'
                                    description='Real-time fraud detection and alert management'
                                    icon={<Shield className='h-8 w-8' />}
                                />
                            }
                        />
                        <Route
                            path='/analytics'
                            element={
                                <ComingSoonPage
                                    title='Analytics & Reports'
                                    description='Comprehensive analytics and custom report generation'
                                    icon={<BarChart3 className='h-8 w-8' />}
                                />
                            }
                        />
                        <Route
                            path='/settings'
                            element={
                                <ComingSoonPage
                                    title='Settings'
                                    description='System configuration and user preferences'
                                    icon={<Settings className='h-8 w-8' />}
                                />
                            }
                        />
                    </Routes>
                </AppLayout>
            </Router>
        </QueryProvider>
    );
};
