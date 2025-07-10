'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { toast } from 'react-toastify';
import Image from 'next/image';
import MenuIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/MenuIcon';
import UserIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/UserIcon';
import EditableIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/EditableIcon';
import AirplaneIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/AirplaneIcon';
import MicIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/MicIcon';
import BookIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/BookIcon';
import FilesIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/FilesIcon';
import PromoCodeIcon from '@/app/(dashbaord)/_components/Admin/Icon/Sidebar/PromoCodeIcon';
import LogoImage from '@/public/Image/logo/logo.png'

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;

}

export default function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [

        { icon: MenuIcon, label: 'Dashboard', href: '/dashboard' },
        { icon: UserIcon, label: 'Pilot User', href: '/pilot-user' },
        { icon: EditableIcon, label: 'Instructor', href: '/instructor' },
        { icon: AirplaneIcon, label: 'Logbook', href: '/logbook' },
        { icon: MicIcon, label: 'Podcasts', href: '/podcasts' },
        { icon: BookIcon, label: 'E-book', href: '/e-book' },
        { icon: FilesIcon, label: 'Membership', href: '/membership' },
        { icon: PromoCodeIcon, label: 'Promo Code ', href: '/promo-code' },

    ];

    const handleLogout = () => {
        router.push('/');
        toast.success('Logged out successfully');
    };


    return (
        <div className="w-64 h-screen bg-[#23293D] flex flex-col relative" >
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center mt-2">
                <div className='flex flex-col md:flex-row items-center gap-2'>
                    <div className='w-8 h-8'>
                        <Image src={LogoImage} alt="logo" width={200} height={200} className='w-full h-full object-contain' />
                    </div>
                    <p className='text-white text-lg  uppercase'>Left seat lessons</p>

                </div>
                <div className='absolute  right-0 '>
                    <button
                        onClick={onClose}
                        className="p-1 cursor-pointer text-white hover:bg-gray-100 md:hidden border border-gray-600 rounded"
                    >
                        <IoClose className="text-lg text-white" />
                    </button>
                </div>
            </div>

            {/* Navigation Menu - Takes up available space */}
            <div className="flex-1 overflow-y-auto">
                <nav className="mt-4 px-3">
                    <ul className="space-y-6">
                        {menuItems
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
