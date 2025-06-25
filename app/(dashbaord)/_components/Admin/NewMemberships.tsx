'use client'
import React, { useEffect, useState } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import { MoreVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import Link from 'next/link'



export default function NewMemberships() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/NewMembers.json');
                const jsonData = await response.json();
                setData(jsonData.slice(0, 3));
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load membership data');
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            key: 'name',
            label: 'User Name',
            width: '20%',
            render: (value: string) => (
                <span className="truncate block">{value}</span>
            )
        },
        {
            key: 'subscription',
            label: 'Subscription',
            width: '20%',
            render: (value: string) => (
                <span className={`inline-flex items-center justify-center w-28 px-3 py-1 rounded text-xs font-medium border ${value.toLowerCase() === 'subscribed'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value.toLowerCase() === 'subscribed' ? 'Subscribed' : 'Non Subscribed'}
                </span>
            )
        },
        {
            key: 'email',
            label: 'Email',
            width: '20%',
            render: (value: string) => (
                <span className="truncate block">{value}</span>
            )
        },
        {
            key: 'subscription_date',
            label: 'Subscription Date',
            width: '20%',
            render: (value: string) => {
                // Format date as DD/MM/YYYY
                const d = new Date(value);
                const formatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                return <span>{formatted}</span>;
            }
        },
        {
            key: 'status',
            label: 'Status',
            width: '20%',
            render: (value: string) => (
                <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded text-xs font-medium border ${value.toLowerCase() === 'active'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value.toLowerCase() === 'active' ? 'Active' : 'Deactivate'}
                </span>
            )
        },
    ];

    const actions = [
        {
            label: 'Action',
            width: 'auto',
            render: (row: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 p-2">
                        <Button variant="ghost" className="w-full justify-start cursor-pointer">Active</Button>
                        <Button variant="ghost" className="w-full justify-start text-red-500 cursor-pointer">Deactivate</Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];


    return (
        <>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold text-white'>New Memberships</h1>
                <div>
                    <Link href="/membership" className='underline text-[#3762E4] cursor-pointer transition-all duration-300 hover:text-[#3762E4]/50'>View Memberships</Link>
                </div>
            </div>

            <ReusableTable
                data={data}
                columns={columns}
                actions={actions}
                className="mt-4 "
            />

        </>
    )
}
