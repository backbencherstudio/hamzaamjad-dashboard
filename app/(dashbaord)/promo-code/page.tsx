'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Loader2 } from 'lucide-react'
import CustomReusableModal from '@/components/reusable/Dashboard/Modal/CustomReusableModal'
import AddPromoCode from '../_components/Admin/AddPromoCode/AddPromoCode'
import { usePromoCodeContext, PromoCodeProvider } from '@/hooks/PromoCodeContext'
import type { PromoCode } from '@/hooks/PromoCodeContext'
import { useDebounce } from '@/hooks/useDebounce'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

function PromoCodeContent() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { promoCodes, loading, fetchPromoCodes, totalPages, totalItems, deletePromoCode, deletingId } = usePromoCodeContext();

    // Debounce search term
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch data when filters change
    useEffect(() => {
        const status = activeTab === 'all' ? '' : activeTab.toUpperCase();
        fetchPromoCodes(currentPage, itemsPerPage, status, debouncedSearchTerm);
    }, [currentPage, itemsPerPage, activeTab, debouncedSearchTerm, fetchPromoCodes]);

    // Initial data fetch
    useEffect(() => {
        fetchPromoCodes(1, 10, '', '');
    }, [fetchPromoCodes]);

    // Define tabs with counts
    const tabs = [
        {
            key: 'all',
            label: 'All',
            count: totalItems
        },
        {
            key: 'active',
            label: 'Active',
            count: promoCodes.filter(code => code.status === 'ACTIVE').length
        },
        {
            key: 'used',
            label: 'Used',
            count: promoCodes.filter(code => code.status === 'USED').length
        }
    ];

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

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handlePromoCreated = () => {
        setIsModalOpen(false);
    };

    const cancelDelete = () => {
        setDialogOpen(false);
        setSelectedId(null);
    };

    const confirmDelete = async () => {
        if (selectedId) {
            await deletePromoCode(selectedId);
            setDialogOpen(false);
            setSelectedId(null);
        }
    };

    const columns = [
        {
            key: 'code',
            label: 'Code List',
            width: '20%',
            render: (value: string) => <span className="font-mono font-bold text-blue-400">{value}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            width: '20%',
            render: (value: string) => (
                <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded text-xs font-medium border ${value === 'ACTIVE'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value === 'ACTIVE' ? 'Active' : 'Used'}
                </span>
            ),
        },
        {
            key: 'userName',
            label: 'User Name',
            width: '20%',
            render: (_: any, row: any) => (
                <span className="truncate block text-gray-300">
                    {row.user?.name || '-'}
                </span>
            ),
        },
        {
            key: 'userEmail',
            label: 'Email',
            width: '20%',
            render: (_: any, row: any) => (
                <span className="truncate block text-gray-300">
                    {row.user?.email || '-'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Created Date',
            width: '20%',
            render: (value: string) => <span className="text-sm text-gray-300">{new Date(value).toLocaleDateString()}</span>,
        },
    ];

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Promo code copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy promo code');
        }
    };

    const actions = [
        {
            label: 'Action',
            width: 'auto',
            render: (row: PromoCode) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start cursor-pointer"
                            onClick={() => copyToClipboard(row.code)}
                        >
                            Copy Code
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 cursor-pointer"
                            onClick={() => {
                                setSelectedId(row.id);
                                setDialogOpen(true);
                            }}
                            disabled={deletingId === row.id}
                        >
                            Delete
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <>
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-semibold text-white'>Promo Codes</h1>
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
                        + Create Promo Code
                    </button>
                    <div className="relative w-full sm:w-auto sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search promo codes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            <>
                <ReusableTable
                    data={promoCodes}
                    columns={columns}
                    actions={actions}
                    className="mt-4"
                    loading={loading}
                />

                {
                    loading ? (
                        <></>
                    ) : (
                        <ReusablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            className=""
                        />
                    )
                }
            </>

            {/* Add Promo Code Modal */}
            <CustomReusableModal
                className='bg-[#1D1F2C] text-white'
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title="Create Promo Code"
            >
                <AddPromoCode
                    onSuccess={handlePromoCreated}
                    page={currentPage}
                    limit={itemsPerPage}
                    status={activeTab === 'all' ? '' : activeTab.toUpperCase()}
                    search={debouncedSearchTerm}
                />
            </CustomReusableModal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Delete Promo Code?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this promo code? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete} className='text-black cursor-pointer'>
                            Cancel
                        </Button>
                        <Button className='cursor-pointer' variant="destructive" onClick={confirmDelete} disabled={deletingId === selectedId}>
                            {deletingId === selectedId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function PromoCode() {
    return (
        <PromoCodeProvider>
            <PromoCodeContent />
        </PromoCodeProvider>
    );
}


