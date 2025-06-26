'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { MoreVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

export default function MembershipPage() {
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/NewMembers.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                toast.error('Failed to load membership data');
            }
        };
        fetchData();
    }, []);

    const tabs = [
        { key: 'all', label: 'All', count: data.length },
        { key: 'active', label: 'Active', count: data.filter(user => user.status?.toLowerCase() === 'active').length },
        { key: 'deactivate', label: 'Deactivate', count: data.filter(user => user.status?.toLowerCase() !== 'active').length }
    ];

    const filteredData = useMemo(() => {
        let filtered = data;
        if (activeTab !== 'all') {
            if (activeTab === 'active') {
                filtered = filtered.filter(user => user.status?.toLowerCase() === 'active');
            } else if (activeTab === 'deactivate') {
                filtered = filtered.filter(user => user.status?.toLowerCase() !== 'active');
            }
        }
        if (searchTerm) {
            filtered = filtered.filter((user) =>
                Object.values(user).some(value =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        return filtered;
    }, [activeTab, searchTerm, data]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const columns = [
        {
            key: 'name',
            label: 'User Name',
            width: '20%',
            render: (value) => <span className="truncate block">{value}</span>
        },
        {
            key: 'subscription',
            label: 'Subscription',
            width: '20%',
            render: (value) => (
                <span className={`inline-flex items-center justify-center w-28 px-3 py-1 rounded text-xs font-medium border ${value?.toLowerCase() === 'subscribed'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value?.toLowerCase() === 'subscribed' ? 'Subscribed' : 'Non Subscribed'}
                </span>
            )
        },
        {
            key: 'email',
            label: 'Email',
            width: '20%',
            render: (value) => <span className="truncate block">{value}</span>
        },
        {
            key: 'subscription_date',
            label: 'Subscription Date',
            width: '20%',
            render: (value) => {
                const d = new Date(value);
                const formatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                return <span>{formatted}</span>;
            }
        },
        {
            key: 'status',
            label: 'Status',
            width: '20%',
            render: (value) => (
                <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded text-xs font-medium border ${value?.toLowerCase() === 'active'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value?.toLowerCase() === 'active' ? 'Active' : 'Deactivate'}
                </span>
            )
        }
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
        <div>
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-semibold text-white'>All Membership</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <nav className="flex flex-wrap gap-2 sm:gap-6 bg-[#181F2A] rounded-[10px] p-2 shadow-sm border-2 border-[#23293D]" style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                            className={`px-4 py-1 rounded-[6px] cursor-pointer font-medium text-sm transition-all duration-200 ${activeTab === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-300 hover:text-white hover:bg-blue-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                </div>
            </div>
            <ReusableTable
                data={paginatedData}
                columns={columns}
                actions={actions}
                className="mt-4"
            />
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                className=""
            />
        </div>
    );
}


