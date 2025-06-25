'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { toast } from 'react-toastify';
import { LayoutGrid, Building2, Truck, Calendar } from 'lucide-react';
import Image from 'next/image';
import MenuIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/MenuIcon';
import UserIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/UserIcon';
import EditableIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/EditableIcon';
import AirplaneIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/AirplaneIcon';
import MicIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/MicIcon';
import BookIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/BookIcon';
import FilesIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/FilesIcon';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;

}

export default function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [

        { icon: MenuIcon, label: 'Dashboard', href: '/dashboard', role: 'admin' },
        { icon: UserIcon, label: 'Pilot User', href: '/manage-garages', role: 'admin' },
        { icon: EditableIcon, label: 'Instructor', href: '/manage-drivers', role: 'admin' },
        { icon: AirplaneIcon, label: 'Logbook', href: '/manage-bookings', role: 'admin' },
        { icon: MicIcon, label: 'Podcasts', href: '/manage-bookings', role: 'admin' },
        { icon: BookIcon, label: 'E-book', href: '/manage-bookings', role: 'admin' },
        { icon: FilesIcon, label: 'Membership', href: '/manage-bookings', role: 'admin' },

    ];

    const handleLogout = () => {
        router.push('/');
        toast.success('Logout successful');
    };

    const user = {
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin',
    }


    return (
        <div className="w-64 h-screen bg-[#23293D] flex flex-col shadow-[0px_4px_40px_0px_rgba(0,0,0,0.25)]" >
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center mt-2">
                <div className='flex items-center gap-2'>
                    <div className='w-7 h-7'>
                        <Image src='/image/logo/logo.png' alt="logo" width={100} height={100} className='w-full h-full object-contain' />
                    </div>
                    <p className='text-white text-lg  uppercase'>Left seat lessons</p>

                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full cursor-pointer text-white hover:bg-gray-100 md:hidden"
                >
                    <IoClose className="h-6 w-6 text-white" />
                </button>
            </div>

            {/* Navigation Menu - Takes up available space */}
            <div className="flex-1 overflow-y-auto">
                <nav className="mt-4 px-3">
                    <ul className="space-y-6">
                        {menuItems
                            .filter(item => item.role === user.role)
                            .map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link href={item.href}>
                                            <span
                                                className={`flex items-center border border-[#262A41] gap-5 px-4 py-2 transition-colors duration-200
                                            ${isActive
                                                        ? 'bg-[#3762E4] text-white font-[400] rounded-[8px] border border-[#4E75FF]'
                                                        : 'text-white hover:bg-gray-700 hover:text-white rounded-[8px]'
                                                    }`}
                                            >
                                                <item.icon />
                                                {item.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                </nav>
            </div>

            {/* Bottom Section - Always at bottom */}
            <div className="mt-auto">


                {/* Logout button */}
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer w-full px-4 py-2 text-white bg-[#1D1F2C] border border-[#262A41] hover:text-white rounded-md transition-colors duration-300 group"
                    >
                        <HiArrowRightOnRectangle className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
