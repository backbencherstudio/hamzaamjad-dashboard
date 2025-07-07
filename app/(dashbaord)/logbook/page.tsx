'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { getLogbookApi } from '@/apis/logbookApis'

export default function LogbookPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const fetchData = async (page: number, limit: number, search?: string) => {
        setLoading(true);
        try {
            const response = await getLogbookApi(page, limit, search);
            if (response.success) {
                setData(response.data.users);
                setTotalPages(response.data.totalPages);
                setTotalItems(response.data.totalUsers);
            } else {
                toast.error(response.message || 'Failed to load logbook data');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to load logbook data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            fetchData(1, itemsPerPage, value || undefined);
        }, 300);
        
        setSearchTimeout(timeoutId);
    };

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            fetchData(page, itemsPerPage, searchTerm || undefined);
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        if (newItemsPerPage !== itemsPerPage) {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
            fetchData(1, newItemsPerPage, searchTerm || undefined);
        }
    };

    useEffect(() => {
        fetchData(currentPage, itemsPerPage, searchTerm);
    }, []);

    // Transform API data to match table structure
    const transformedData = useMemo(() => {
        return data.map(user => ({
            id: user.userId,
            userName: user.userName,
            totalFlights: user.logSummary.totalFlights,
            totalHours: user.logSummary.totalHours,
            pICHours: user.logSummary.picHours,
            dualHours: user.logSummary.dayHours,
            nightHours: user.logSummary.nightHours,
            ifrHours: user.logSummary.ifrHours,
            totalTakeoffs: user.logSummary.totalTakeoffs,
            totalLandings: user.logSummary.totalLandings,
            crossCountry: user.logSummary.crossCountry
        }));
    }, [data]);

    const columns = [
        { key: 'userName', label: 'User Name', width: '8%' },
        { key: 'totalFlights', label: 'Total Flights', width: '9.4%' },
        { key: 'totalHours', label: 'Total Hours', width: '9%' },
        { key: 'pICHours', label: 'PIC Hours', width: '9%' },
        { key: 'dualHours', label: 'Day Hours', width: '9%' },
        { key: 'nightHours', label: 'Night Hours', width: '9%' },
        { key: 'ifrHours', label: 'IFR Hours', width: '8%' },
        { key: 'totalTakeoffs', label: 'Total Take Offs', width: '10.5%' },
        { key: 'totalLandings', label: 'Total Landings', width: '10.2%' },
        { key: 'crossCountry', label: 'Cross Country', width: '10.2%' }
    ];

    const actions = [
        {
            label: 'Action',
            width: '5%',
            render: (row) => (
                <button
                    className="px-4 py-1 bg-[#333541] text-white cursor-pointer hover:bg-[#444654]/80 transition-all duration-300 text-sm rounded-md"
                    onClick={() => router.push(`/logbook/details/${row.id}`)}
                >
                    Details
                </button>
            )
        }
    ];

    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
                <h1 className='text-2xl font-semibold text-white'>Logbook</h1>

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
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                </div>
            </div>
            {loading ? (
                <div className="mt-4 text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="mt-2 text-white">Loading logbook data...</p>
                </div>
            ) : (
                <ReusableTable
                    data={transformedData}
                    columns={columns}
                    actions={actions}
                    className="mt-4"
                />
            )}
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className=""
            />
        </div>
    );
}


