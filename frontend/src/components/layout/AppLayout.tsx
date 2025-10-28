import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <SidebarProvider>
            <div className='flex min-h-screen w-full'>
                <AppSidebar />
                <main className='flex flex-1 flex-col'>
                    <Header />
                    <div className='flex-1 p-6'>{children}</div>
                </main>
            </div>
        </SidebarProvider>
    );
};
