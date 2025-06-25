'use client'
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable';
import { toast } from 'react-toastify';
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function LogbookDetailsPage() {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/logbook.json');
                const jsonData = await response.json();
                const found = jsonData.find((item) => item.id?.toString() === id?.toString());
                setEntry(found);
            } catch (error) {
                toast.error('Failed to load logbook data');
            }
        };
        fetchData();
    }, [id]);

    const summaryData = useMemo(() => {
        if (!entry || !entry.summary) return [];
        if (!searchTerm) return entry.summary;
        return entry.summary.filter((row) =>
            Object.values(row).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, entry]);

    const totalPages = Math.ceil(summaryData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = summaryData.slice(startIndex, startIndex + itemsPerPage);

    const columns = [
        { key: 'userName', label: 'User Name', width: '8%' },
        {
            key: 'instructorName', label: 'Instructor Name', width: '10.7%',
            render: (value, row) => (
                <span className="truncate block max-w-[120px]" title={value}>{value}</span>
            )
        },
        {
            key: 'day', label: 'Day', width: '5%',
            render: (value, row) => (
                <span className="truncate block max-w-[90px]" title={value}>{value}</span>
            )
        },
        { key: 'totalHours', label: 'Hours', width: '5%' },
        { key: 'pICHours', label: 'PIC Hours', width: '7.3%' },
        { key: 'dualHours', label: 'Day Hours', width: '7.8%' },
        { key: 'nightHours', label: 'Night Hours', width: '8.5%' },
        { key: 'ifrHours', label: 'IFR Hours', width: '7.5%' },
        { key: 'totalTakeoffs', label: 'Total Take Offs', width: '10.1%' },
        { key: 'totalLandings', label: 'Total Landings', width: '10%' },
        { key: 'crossCountry', label: 'Cross Country', width: '10%' }
    ];

    const actions = [
        {
            label: 'Action',
            width: '5%',
            render: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor" /><circle cx="12" cy="12" r="2" fill="currentColor" /><circle cx="19" cy="12" r="2" fill="currentColor" /></svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
                <h1 className='text-2xl font-semibold text-white'>Logbook Summary <span className="text-lg font-normal">› {entry?.userName || ''}</span></h1>
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
                totalItems={summaryData.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                className=""
            />
        </div>
    );
}
