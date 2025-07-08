'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Loader2 } from 'lucide-react'
import CustomReusableModal from '@/components/reusable/Dashboard/Modal/CustomReusableModal'
import AddInstructor from '../_components/Admin/AddInstructor/AddInstructor'
import { InstructorProvider, useInstructorContext } from '@/hooks/InstructorContext'
import { useDebounce } from '@/hooks/useDebounce'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

function InstructorPageContent() {
    const {
        instructors,
        loading,
        creating,
        deletingId,
        activatingId,
        deactivatingId,
        page,
        setPage,
        limit,
        setLimit,
        total,
        search,
        setSearch,
        type,
        setType,
        deleteInstructor,
        activeInstructor,
        deactiveInstructor,
        fetchInstructors,
    } = useInstructorContext();
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    
    // Confirmation dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeDialogOpen, setActiveDialogOpen] = useState(false);
    const [deactiveDialogOpen, setDeactiveDialogOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<any>(null);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(search, 300);

    // Fetch data only once when component mounts
    useEffect(() => {
        if (!hasInitialized) {
            fetchInstructors(page, limit, search, type);
            setHasInitialized(true);
        }
    }, [fetchInstructors, page, limit, search, type, hasInitialized]);

    // Fetch data when debounced search term changes
    useEffect(() => {
        if (hasInitialized) {
            setPage(1);
            fetchInstructors(1, limit, debouncedSearchTerm || undefined, type);
        }
    }, [debouncedSearchTerm, hasInitialized]);

    // Direct search handler (no debouncing here, useDebounce handles it)
    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Confirmation handlers
    const handleDeleteClick = (instructor: any) => {
        setSelectedInstructor(instructor);
        setDeleteDialogOpen(true);
    };

    const handleActiveClick = (instructor: any) => {
        setSelectedInstructor(instructor);
        setActiveDialogOpen(true);
    };

    const handleDeactiveClick = (instructor: any) => {
        setSelectedInstructor(instructor);
        setDeactiveDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedInstructor) {
            await deleteInstructor(selectedInstructor._id);
            setDeleteDialogOpen(false);
            setSelectedInstructor(null);
        }
    };

    const confirmActive = async () => {
        if (selectedInstructor) {
            await activeInstructor(selectedInstructor._id);
            setActiveDialogOpen(false);
            setSelectedInstructor(null);
        }
    };

    const confirmDeactive = async () => {
        if (selectedInstructor) {
            await deactiveInstructor(selectedInstructor._id);
            setDeactiveDialogOpen(false);
            setSelectedInstructor(null);
        }
    };

    const cancelAction = () => {
        setDeleteDialogOpen(false);
        setActiveDialogOpen(false);
        setDeactiveDialogOpen(false);
        setSelectedInstructor(null);
    };

    // Tabs with counts
    const tabs = [
        {
            key: 'all',
            label: 'All',
            count: total
        },
        {
            key: 'active',
            label: 'Active',
            count: instructors.filter(booking => booking.status?.toLowerCase() === 'active').length
        },
        {
            key: 'deactivate',
            label: 'Deactivate',
            count: instructors.filter(booking => booking.status?.toLowerCase() !== 'active').length
        }
    ];

    // Filtered data for tab
    const filteredData = useMemo(() => {
        let filtered = instructors;
        if (activeTab !== 'all') {
            if (activeTab === 'active') {
                filtered = filtered.filter(booking => booking.status?.toLowerCase() === 'active');
            } else if (activeTab === 'deactivate') {
                filtered = filtered.filter(booking => booking.status?.toLowerCase() !== 'active');
            }
        }
        return filtered;
    }, [activeTab, instructors]);

    // Pagination logic
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    const handlePageChange = (p: number) => {
        setPage(p);
        fetchInstructors(p, limit, debouncedSearchTerm || undefined, type);
    };
    
    const handleItemsPerPageChange = (l: number) => { 
        setLimit(l); 
        setPage(1);
        fetchInstructors(1, l, debouncedSearchTerm || undefined, type);
    };
    
    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        setPage(1);
        let newType = '';
        if (tabKey === 'active') newType = 'ACTIVE';
        else if (tabKey === 'deactivate') newType = 'DEACTIVE';
        
        setType(newType);
        fetchInstructors(1, limit, debouncedSearchTerm || undefined, newType);
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
            render: (value: any) => {
                if (Array.isArray(value)) {
                    // Show names, or fallback to email/license
                    const names = value.map((v: any) => v.name || v.email || '').filter(Boolean).join(', ');
                    return <span className="truncate block">{names || '-'}</span>;
                }
                return <span className="truncate block">{value || '-'}</span>;
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
              
                <span className="truncate block lowercase">{value}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: '10%',
            render: (value: string) => (
                <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded text-xs font-medium border ${value?.toLowerCase() === 'active'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value?.toLowerCase() === 'active' ? 'Active' : 'Deactivate'}
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
                        <Button
                            variant="ghost"
                            className="w-full justify-start cursor-pointer"
                            onClick={() => handleActiveClick(row)}
                            disabled={activatingId === row._id || deactivatingId === row._id || deletingId === row._id}
                        >
                            {activatingId === row._id ? (
                                <>
                                  
                                    Activating...
                                </>
                            ) : (
                                'Active'
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-blue-500 cursor-pointer"
                            onClick={() => handleDeactiveClick(row)}
                            disabled={activatingId === row._id || deactivatingId === row._id || deletingId === row._id}
                        >
                            {deactivatingId === row._id ? (
                                <>
                                  
                                    Deactivating...
                                </>
                            ) : (
                                'Deactivate'
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 cursor-pointer"
                            onClick={() => handleDeleteClick(row)}
                            disabled={activatingId === row._id || deactivatingId === row._id || deletingId === row._id}
                        >
                            {deletingId === row._id ? (
                                <>
                                  
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
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
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>
            <ReusableTable
                data={paginatedData}
                columns={columns}
                actions={actions}
                loading={loading}
                className="mt-4"
            />
            <ReusablePagination
                currentPage={page}
                totalPages={totalPages}
                itemsPerPage={limit}
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
                <AddInstructor onSuccess={() => setIsModalOpen(false)} />
            </CustomReusableModal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Delete Instructor?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to delete {selectedInstructor?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black ">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deletingId === selectedInstructor?._id} className='cursor-pointer'>
                            {deletingId === selectedInstructor?._id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                   
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Active Confirmation Dialog */}
            <Dialog open={activeDialogOpen} onOpenChange={setActiveDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Activate Instructor?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to activate {selectedInstructor?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black ">
                            Cancel
                        </Button>
                        <Button onClick={confirmActive} disabled={activatingId === selectedInstructor?._id} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                            {activatingId === selectedInstructor?._id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  
                                </>
                            ) : (
                                'Activate'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Deactive Confirmation Dialog */}
            <Dialog open={deactiveDialogOpen} onOpenChange={setDeactiveDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Deactivate Instructor?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to deactivate {selectedInstructor?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeactive} disabled={deactivatingId === selectedInstructor?._id} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                            {deactivatingId === selectedInstructor?._id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deactivating...
                                </>
                            ) : (
                                'Deactivate'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function InstructorPage() {
    return (
        <InstructorProvider>
            <InstructorPageContent />
        </InstructorProvider>
    );
}



