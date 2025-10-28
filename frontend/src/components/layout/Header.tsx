import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export const Header = () => {
    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='flex h-16 items-center px-6'>
                <div className='flex flex-1 items-center gap-4'>
                    <div className='relative max-w-sm'>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Search transactions, patterns...'
                            className='pl-8'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='relative'
                    >
                        <Bell className='h-4 w-4' />
                        <Badge className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'>3</Badge>
                    </Button>

                    <Button
                        variant='ghost'
                        size='icon'
                    >
                        <Settings className='h-4 w-4' />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                className='relative h-8 w-8 rounded-full'
                            >
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage
                                        src='/avatars/01.png'
                                        alt='@user'
                                    />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-56'
                            align='end'
                            forceMount
                        >
                            <DropdownMenuLabel className='font-normal'>
                                <div className='flex flex-col gap-1'>
                                    <p className='text-sm font-medium leading-none'>John Doe</p>
                                    <p className='text-xs leading-none text-muted-foreground'>john.doe@company.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className='mr-2 h-4 w-4' />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className='mr-2 h-4 w-4' />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
