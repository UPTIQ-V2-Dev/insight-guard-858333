import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface ComingSoonPageProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export const ComingSoonPage = ({ title, description, icon }: ComingSoonPageProps) => {
    return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <Card className='w-full max-w-md text-center'>
                <CardHeader>
                    <div className='flex justify-center mb-4'>
                        <div className='p-4 rounded-full bg-muted'>{icon}</div>
                    </div>
                    <CardTitle className='text-2xl'>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>
                        This feature is currently under development and will be available soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
