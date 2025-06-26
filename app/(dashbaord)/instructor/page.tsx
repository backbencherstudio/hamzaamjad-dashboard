'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import CustomReusableModal from '@/components/reusable/Dashboard/Modal/CustomReusableModal'
import AddInstructor from '../_components/Admin/AddInstructor/AddInstructor'

export default function ManageBookings() {
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data from JSON file
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/Instructor.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load bookings data');
            }
        };

        fetchData();
    }, []);

    // Define tabs with counts
    const tabs = [
        {
            key: 'all',
            label: 'All',
            count: data.length
        },
        {
            key: 'active',
            label: 'Active',
            count: data.filter(booking => booking.status.toLowerCase() === 'active').length
        },
        {
            key: 'deactivate',
            label: 'Deactivate',
            count: data.filter(booking => booking.status.toLowerCase() !== 'active').length
        }
    ];

    // Filter data based on active tab and search
    const filteredData = useMemo(() => {
        let filtered = data;

        // Filter by tab
        if (activeTab !== 'all') {
            if (activeTab === 'active') {
                filtered = filtered.filter(booking => booking.status.toLowerCase() === 'active');
            } else if (activeTab === 'deactivate') {
                filtered = filtered.filter(booking => booking.status.toLowerCase() !== 'active');
            }
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                Object.values(booking).some(value =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        return filtered;
    }, [activeTab, searchTerm, data]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        setCurrentPage(1);
    };

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
            width: '23%',
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
            width: '22%',
            render: (value: string) => (
                <span className="truncate block">{value}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: '10%',
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
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-semibold text-white'>All Instructor</h1>
            </div>

            {/* Tabs and Search */}
            <div className="flex flex-col gap-4 xl:flex-row justify-between items-center mb-4">
                {/* Tabs on the left */}
                <nav className="flex flex-wrap gap-2 sm:gap-6 bg-[#181F2A] rounded-[10px] p-2 shadow-sm border-2 border-[#23293D]" style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`px-4 py-1 rounded-[6px] cursor-pointer font-medium text-sm transition-all duration-200 ${activeTab === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-300 hover:text-white hover:bg-blue-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Search on the right */}
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <button
                        className="bg-blue-600 cursor-pointer transition-all duration-300 text-sm hover:bg-blue-700 text-white font-semibold py-2 px-4  rounded-lg shadow ml-auto sm:ml-0 mt-4 sm:mt-0"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Instructor
                    </button>
                    <div className="relative w-full sm:w-auto sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                        />
                    </div>
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
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className=""
            />

            {/* Add Instructor Modal */}
            <CustomReusableModal
                className='bg-[#1D1F2C] text-white'
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Instructor"
            >
                <AddInstructor />
            </CustomReusableModal>

        </>
    )
}


