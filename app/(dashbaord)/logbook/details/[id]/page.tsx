'use client'
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable';
import { toast } from 'react-toastify';
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { deleteLogbookApi, getSingleLogbookApi } from '@/apis/logbookApis';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function LogbookDetailsPage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchData = async (page: number, limit: number, search?: string) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await getSingleLogbookApi(id as string, page, limit, search);
            if (response.success) {
                setUserInfo(response.data.userInfo);
                setLogs(response.data.logs);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalLogs);
            } else {
                toast.error(response.message || 'Failed to load logbook details');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to load logbook details');
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
    }, [id]);


    const handleDelete = async (id: string) => {
        try {
            await deleteLogbookApi(id);
            toast.success('Logbook deleted successfully');
            fetchData(currentPage, itemsPerPage, searchTerm);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete logbook');
        }
    };

    const openDeleteDialog = (id: string) => {
        setDeleteId(id);
        setDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await handleDelete(deleteId);
            setDialogOpen(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setDialogOpen(false);
        setDeleteId(null);
    };

    // Transform API data to match table structure
    const transformedData = useMemo(() => {
        return logs.map(log => ({
            id: log.id,
            userName: userInfo?.name || '',
            instructorName: log.dualrcv === 'Yes' ? 'Instructor' : 'Solo',
            day: new Date(log.date).toLocaleDateString(),
            totalHours: log.flightTime,
            pICHours: log.pictime,
            dualHours: log.daytime,
            nightHours: log.nightime,
            ifrHours: log.ifrtime,
            totalTakeoffs: log.takeoffs,
            totalLandings: log.landings,
            crossCountry: log.crossCountry,
            status: log.status,
            from: log.from,
            to: log.to,
            aircrafttype: log.aircrafttype,
            tailNumber: log.tailNumber
        }));
    }, [logs, userInfo]);

    const columns = [
        { key: 'userName', label: 'User Name', width: '7.8%' },
        {
            key: 'instructorName', label: 'Instructor Name', width: '12%',
            render: (value, row) => (
                <span className="truncate block max-w-[120px]" title={value}>{value}</span>
            )
        },
        {
            key: 'day', label: 'Day', width: '5%',
            render: (value, row) => (
                <span className="truncate block max-w-[9px]" title={value}>{value}</span>
            )
        },
        { key: 'totalHours', label: 'Hours', width: '5%' },
        { key: 'pICHours', label: 'PIC Hours', width: '7.5%' },
        { key: 'dualHours', label: 'Day Hours', width: '8%' },
        { key: 'nightHours', label: 'Night Hours', width: '8%' },
        { key: 'ifrHours', label: 'IFR Hours', width: '8%' },
        { key: 'totalTakeoffs', label: 'Total Take Offs', width: '9%' },
        { key: 'totalLandings', label: 'Total Landings', width: '9%' },
        { key: 'crossCountry', label: 'Cross Country', width: '9%' },
        { key: 'status', label: 'Status', width: '5%' }
    ];

    const actions = [
        {
            label: 'Action',
            width: '2%',
            render: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor" /><circle cx="12" cy="12" r="2" fill="currentColor" /><circle cx="19" cy="12" r="2" fill="currentColor" /></svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className='text-red-500 cursor-pointer' onClick={() => openDeleteDialog(row.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Logbook Entry?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this logbook entry? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-4">
                <h1 className='text-2xl font-semibold text-white'>Logbook Summary <span className="text-lg font-normal">› {userInfo?.name || ''}</span></h1>
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
            <ReusableTable
                data={transformedData}
                columns={columns}
                actions={actions}
                className="mt-4"
            />
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
