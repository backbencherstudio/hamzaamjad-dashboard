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



export default function NewInstructor() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/Instructor.json');
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
            label: 'Instructor Name',
            width: '20%',
            render: (value: string) => (
                <span className="truncate block">{value}</span>
            )
        },
        {
            key: 'student',
            label: 'Student',
            width: '20%',
            render: (value: string[] | string) => {
                let students = Array.isArray(value) ? value.join(', ') : value;
                // Truncate if too long
                if (students && students.length > 30) {
                    students = students.slice(0, 27) + '...';
                }
                return <span className="truncate block">{students}</span>;
            }
        },
        {
            key: 'phone',
            label: 'Phone Number',
            width: '20%',
            render: (value: string) => (
                <span className="truncate block">{value ? value.replace('+', '0') : '-'}</span>
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
                <h1 className='text-2xl font-semibold text-white'>New Instructor</h1>
                <div>
                    <Link href="/instructor" className='underline text-[#3762E4] cursor-pointer transition-all duration-300 hover:text-[#3762E4]/50'>View Instructor</Link>
                </div>
            </div>

            <ReusableTable
                data={data}
                columns={columns}
                actions={actions}
                className="mt-4"
            />

        </>
    )
}
