'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'

export default function LogbookPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/logbook.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                toast.error('Failed to load logbook data');
            }
        };
        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((row) =>
            Object.values(row).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, data]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const columns = [
        { key: 'userName', label: 'User Name', width: '7%' },
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
            render: () => (
                <button className="px-4 py-1 bg-[#333541] text-white cursor-pointer hover:bg-[#444654]/80 transition-all duration-300F text-sm rounded-md">Details</button>
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
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


