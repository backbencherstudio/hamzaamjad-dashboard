'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { toast } from 'react-toastify';
import { LayoutGrid, Building2, Truck, Calendar } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
 
}

export default function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [

        { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard', role: 'admin' },
        { icon: Building2, label: 'Manage Garages', href: '/manage-garages', role: 'admin' },
        { icon: Truck, label: 'Manage Drivers', href: '/manage-drivers', role: 'admin' },
        { icon: Calendar, label: 'Manage Bookings', href: '/manage-bookings', role: 'admin' },

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
        <div className="w-64 h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center mt-2">
                <div>
                    <h1 className='text-2xl font-bold text-[#19CA32]'>simplymot.co.uk</h1>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full cursor-pointer hover:bg-gray-100 md:hidden"
                >
                    <IoClose className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation Menu - Takes up available space */}
            <div className="flex-1 overflow-y-auto">
                <nav className="mt-4 px-3">
                    <ul className="space-y-3">
                        {menuItems
                            .filter(item => item.role === user.role)
                            .map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link href={item.href}>
                                            <span
                                                className={`flex items-center px-4 py-2 transition-colors duration-200
                                            ${isActive
                                                        ? 'bg-[#DDF7E0] text-[#19CA32] font-[400] rounded-[8px]'
                                                        : 'text-gray-800 hover:bg-gray-100 hover:text-gray-700 rounded-[8px]'
                                                    }`}
                                            >
                                                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white]' : ''}`} />
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
                        className="flex items-center cursor-pointer w-full px-4 py-2 text-[#19CA32] hover:bg-[#19CA32] hover:text-white rounded-md transition-colors duration-300 group"
                    >
                        <HiArrowRightOnRectangle className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
