'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Loader2, MoreVertical } from 'lucide-react'
import CustomReusableModal from '@/components/reusable/Dashboard/Modal/CustomReusableModal'
import AddNewPodcasts from '../_components/Admin/AddNewPodcasts/AddNewPodcasts'
import { usePodcasts } from '@/hooks/usePodcasts'
import { useDebounce } from '@/hooks/useDebounce'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function PodcastsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPodcast, setEditingPodcast] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPodcast, setSelectedPodcast] = useState<any>(null);

    const {
        podcasts,
        loading,
        deletePodcast,
        fetchPodcasts,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        deletingId
    } = usePodcasts();

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchData = useCallback((page?: number, limit?: number, search?: string) => {
        fetchPodcasts(page || 1, limit || itemsPerPage, search);
    }, [fetchPodcasts, itemsPerPage]);

    useEffect(() => {
        if (!hasInitialized) {
            fetchData();
            setHasInitialized(true);
        }
    }, [fetchData, hasInitialized]);

    useEffect(() => {
        if (hasInitialized) {
            fetchData(1, itemsPerPage, debouncedSearchTerm || undefined);
        }
    }, [debouncedSearchTerm, hasInitialized]);

    const handlePageChange = (page: number) => {
        fetchData(page, itemsPerPage, debouncedSearchTerm);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        fetchData(1, newItemsPerPage, debouncedSearchTerm);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleEdit = (podcast: any) => {
        setEditingPodcast(podcast);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = (podcast: any) => {
        setSelectedPodcast(podcast);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedPodcast) {
            try {
                await deletePodcast(selectedPodcast.id || selectedPodcast._id);
                setDeleteDialogOpen(false);
                setSelectedPodcast(null);
            } catch (error) {
                console.error('Error deleting podcast:', error);
            }
        }
    };

    const cancelAction = () => {
        setDeleteDialogOpen(false);
        setSelectedPodcast(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPodcast(null);
        setIsEditMode(false);
    };

    const handleAddNew = () => {
        setEditingPodcast(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleFormSuccess = useCallback(() => {
        handleCloseModal();

    }, []);

    const columns = [
        {
            key: 'cover',
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
            key: 'mp3',
            label: 'Audio File',
            width: '20%',
            render: (value: string) => (
                value ? (
                    <audio controls className="w-full">
                        <source src={value} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                ) : (
                    <span>-</span>
                )
            ),
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
                        <Button
                            variant="ghost"
                            className="w-full justify-start cursor-pointer"
                            onClick={() => handleEdit(row)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 cursor-pointer"
                            onClick={() => handleDelete(row)}
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
                <h1 className='text-2xl font-semibold text-white'>Podcasts</h1>
                {/* Search on the right */}
                <div className='flex flex-col lg:flex-row items-center gap-4'>
                    <button
                        className="bg-blue-600 cursor-pointer transition-all duration-300 text-sm hover:bg-blue-700 text-white font-semibold py-2 px-4  rounded-lg shadow ml-auto sm:ml-0 mt-4 sm:mt-0"
                        onClick={handleAddNew}
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
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            <>
                <ReusableTable
                    data={podcasts}
                    columns={columns}
                    actions={actions}
                    loading={loading}
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
            </>

            {/* Add/Edit Podcast Modal */}
            <CustomReusableModal
                className='bg-[#1D1F2C] text-white border-none'
                isOpen={isModalOpen}
                onClose={handleFormSuccess}
                title={isEditMode ? "Edit Podcast" : "Add New Podcasts"}
            >
                <AddNewPodcasts
                    podcast={editingPodcast}
                    onClose={handleFormSuccess}
                    isEdit={isEditMode}
                />
            </CustomReusableModal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Delete Podcast?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to delete {selectedPodcast?.title}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deletingId === (selectedPodcast?.id || selectedPodcast?._id)} className='cursor-pointer'>
                            {deletingId === (selectedPodcast?.id || selectedPodcast?._id) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


