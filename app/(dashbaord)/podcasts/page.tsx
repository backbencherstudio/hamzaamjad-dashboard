'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import CustomReusableModal from '@/components/reusable/Dashboard/Modal/CustomReusableModal'
import AddNewPodcasts from '../_components/Admin/AddNewPodcasts/AddNewPodcasts'

export default function PodcastsPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data from JSON file
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/podcasts.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load podcasts data');
            }
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(podcast =>
                Object.values(podcast).some(value =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        return filtered;
    }, [searchTerm, data]);

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


    const columns = [
        {
            key: 'image',
            label: 'Podcast Image',
            width: '15%',
            render: (value: string) => (
                <img
                    src={value || '/Image/logo/logo.png'}
                    alt="Podcast"
                    className="w-12 h-12 rounded object-cover"
                />
            ),
        },
        {
            key: 'title',
            label: 'Podcasts',
            width: '25%',
            render: (value: string) => <span className="truncate block">{value}</span>,
        },
        {
            key: 'hostName',
            label: 'Host Name',
            width: '20%',
            render: (value: string) => <span className="truncate block">{value}</span>,
        },
        {
            key: 'time',
            label: 'Time',
            width: '20%',
            render: (value: string) => <span>{value}</span>,
        },
        {
            key: 'date',
            label: 'Day',
            width: '15%',
            render: (value: string) => {
                // Format date as "5 May"
                if (!value) return '-';
                const d = new Date(value);
                const day = d.getDate();
                const month = d.toLocaleString('default', { month: 'short' });
                return <span>{`${day} ${month}`}</span>;
            },
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
                        <Button variant="ghost" className="w-full justify-start cursor-pointer">Delete</Button>
                        <Button variant="ghost" className="w-full justify-start text-red-500 cursor-pointer">Edit</Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <>
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-semibold text-white'>Podcasts</h1>
                {/* Search on the right */}
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <button
                        className="bg-blue-600 cursor-pointer transition-all duration-300 text-sm hover:bg-blue-700 text-white font-semibold py-2 px-4  rounded-lg shadow ml-auto sm:ml-0 mt-4 sm:mt-0"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Podcasts
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

            {/* Add Podcast Modal */}
            <CustomReusableModal
                className='bg-[#1D1F2C] text-white border-none'
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Podcasts"
            >
                <AddNewPodcasts />
            </CustomReusableModal>
        </>
    )
}


