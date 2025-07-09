'use client'
import React, { useEffect, useState } from 'react';
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable';
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination';

import { useDebounce } from '@/hooks/useDebounce';
import { usePilotUserContext } from '@/hooks/PilotUsers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function PilotUserPage() {
    const {
        users,
        loading,
        activatingId,
        deactivatingId,
        total,
        page,
        limit,
        setPage,
        setLimit,
        search,
        setSearch,
        status,
        setStatus,
        fetchUsers,
        activateUser,
        deactivateUser
    } = usePilotUserContext();

    const debouncedSearch = useDebounce(search, 400);

    // Confirmation dialog states
    const [activeDialogOpen, setActiveDialogOpen] = useState(false);
    const [deactiveDialogOpen, setDeactiveDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Single useEffect to handle all API calls
    useEffect(() => {
        fetchUsers(page, limit, debouncedSearch, status);
        // eslint-disable-next-line
    }, [page, limit, debouncedSearch, status]);

    // Confirmation handlers
    const handleActiveClick = (user: any) => {
        setSelectedUser(user);
        setActiveDialogOpen(true);
    };

    const handleDeactiveClick = (user: any) => {
        setSelectedUser(user);
        setDeactiveDialogOpen(true);
    };

    const confirmActive = async () => {
        if (selectedUser) {
            await activateUser(selectedUser.id);
            setActiveDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const confirmDeactive = async () => {
        if (selectedUser) {
            await deactivateUser(selectedUser.id);
            setDeactiveDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const cancelAction = () => {
        setActiveDialogOpen(false);
        setDeactiveDialogOpen(false);
        setSelectedUser(null);
    };

    const tabs = [
        { key: '', label: 'All' },
        { key: 'ACTIVE', label: 'Active' },
        { key: 'DEACTIVE', label: 'Deactivate' }
    ];

    const columns = [
        { key: 'name', label: 'User Name', width: '18%' },
        { key: 'license', label: 'Current License', width: '14%' },
        { key: 'homeBase', label: 'Home Base', width: '10%' },
        {
            key: 'favorites',
            label: 'Favorites',
            width: '18%',
            render: (value: any) => {
                if (Array.isArray(value) && value.length > 0) {
                    return value.slice(0, 2).join(', ');
                }
                return '-';
            }
        },
        { key: 'email', label: 'Email', width: '20%' },
        {
            key: 'status',
            label: 'Status',
            width: '10%',
            render: (value: string) => (
                <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded text-xs font-medium border ${value?.toLowerCase() === 'active'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '-'}
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
                        <Button
                            variant="ghost"
                            className="w-full justify-start cursor-pointer"
                            onClick={() => handleActiveClick(row)}
                            disabled={activatingId === row.id || deactivatingId === row.id}
                        >
                            {activatingId === row.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Activating...
                                </>
                            ) : (
                                'Active'
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 cursor-pointer"
                            onClick={() => handleDeactiveClick(row)}
                            disabled={activatingId === row.id || deactivatingId === row.id}
                        >
                            {deactivatingId === row.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deactivating...
                                </>
                            ) : (
                                'Deactivate'
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
                <h1 className='text-2xl font-semibold text-white'>All Pilot Users</h1>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4 mb-4">
                <nav className="flex flex-wrap gap-2 sm:gap-6 bg-[#181F2A] rounded-[10px] p-2 shadow-sm border-2 border-[#23293D]" style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setStatus(tab.key); setPage(1); }}
                            className={`px-4 py-1 rounded-[6px] cursor-pointer font-medium text-sm transition-all duration-200 ${status === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-300 hover:text-white hover:bg-blue-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="relative w-full lg:w-auto lg:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="block w-full lg:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                </div>

            </div>
            <ReusableTable
                data={users}
                columns={columns}
                className="mt-4"
                actions={actions}
                loading={loading}
            />
            <ReusablePagination
                currentPage={page}
                totalPages={Math.ceil(total / limit) || 1}
                itemsPerPage={limit}
                totalItems={total}
                onPageChange={setPage}
                onItemsPerPageChange={(n) => { setLimit(n); setPage(1); }}
                className=""
            />

            {/* Active Confirmation Dialog */}
            <Dialog open={activeDialogOpen} onOpenChange={setActiveDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Activate Pilot User?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to activate {selectedUser?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black ">
                            Cancel
                        </Button>
                        <Button onClick={confirmActive} disabled={activatingId === selectedUser?.id} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                            {activatingId === selectedUser?.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Activating...
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
                        <DialogTitle>Deactivate Pilot User?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to deactivate {selectedUser?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeactive} disabled={deactivatingId === selectedUser?.id} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                            {deactivatingId === selectedUser?.id ? (
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


