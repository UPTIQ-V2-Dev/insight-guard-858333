import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './components/providers/QueryProvider';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionAnalysisPage } from './pages/TransactionAnalysisPage';
import { PatternDetectionPage } from './pages/PatternDetectionPage';
import { FraudMonitoringPage } from './pages/FraudMonitoringPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

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
                            element={<TransactionAnalysisPage />}
                        />
                        <Route
                            path='/patterns'
                            element={<PatternDetectionPage />}
                        />
                        <Route
                            path='/fraud-monitoring'
                            element={<FraudMonitoringPage />}
                        />
                        <Route
                            path='/analytics'
                            element={<AnalyticsPage />}
                        />
                        <Route
                            path='/settings'
                            element={<SettingsPage />}
                        />
                    </Routes>
                </AppLayout>
            </Router>
        </QueryProvider>
    );
};
