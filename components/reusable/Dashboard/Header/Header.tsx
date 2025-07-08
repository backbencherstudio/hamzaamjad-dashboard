"use client"
import React, { useEffect, useState } from 'react'
import { HiMenuAlt2 } from 'react-icons/hi'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import greetingTime from "greeting-time";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function Header({ onMenuClick }: {
    onMenuClick: () => void,
}) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [greeting, setGreeting] = useState<string>("");

    // Debug: Log user data to console
    // console.log('Header - User data:', user);

    // real time greeting
    useEffect(() => {
        const updateGreeting = () => {
            const greetingText = greetingTime(new Date());
            setGreeting(greetingText);
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
        toast.success('Logged out successfully');
    };

    return (
        <nav className="bg-[#23293D] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]">
            <div className="px-4 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="text-gray-600 cursor-pointer hover:text-gray-800 md:hidden"
                    >
                        <HiMenuAlt2 className="h-6 w-6" />
                    </button>
                </div>

                {/* Right Side - Notifications and User Profile */}
                <div className="flex items-center gap-4">
                    {/* Notification Dropdown */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative cursor-pointer select-none border">
                                <Bell className="h-5 w-5 " />
                                {notificationCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                                    >
                                        {notificationCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                <div className="font-medium">New message received</div>
                                <div className="text-sm text-gray-500">You have a new message from John Doe</div>
                                <div className="text-xs text-gray-400">2 minutes ago</div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                <div className="font-medium">Booking confirmed</div>
                                <div className="text-sm text-gray-500">Your MOT booking has been confirmed</div>
                                <div className="text-xs text-gray-400">1 hour ago</div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                <div className="font-medium">Payment reminder</div>
                                <div className="text-sm text-gray-500">Your payment is due in 3 days</div>
                                <div className="text-xs text-gray-400">1 day ago</div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center text-[#19CA32] font-medium">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 cursor-pointer select-none hover:bg-transparent">
                                {user?.image ? (
                                    <div className="h-8 w-8 rounded-full overflow-hidden">
                                        <Image
                                            width={32}
                                            height={32}
                                            src={user.image}
                                            alt={`${user.name || 'User'} Avatar`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="select-none bg-[#3762E4] text-white">
                                            {user?.name?.charAt(0) || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="hidden md:flex flex-col items-start select-none">
                                    <span className="text-xs text-[#3762E4] select-none capitalize">{greeting}</span>
                                    <span className="text-sm font-medium text-white select-none">{user?.name || 'Admin'}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                router.push('/profile');
                            }}>
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600 cursor-pointer" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
