'use client'
import React, { useState } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import { MoreVertical, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useDashboardContext } from '@/hooks/useDashboard'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function NewPilotUser() {
    const { 
        dashboardData, 
        activatingMemberId, 
        deactivatingMemberId,
        activateMember, 
        deactivateMember 
    } = useDashboardContext();

    const [activeDialogOpen, setActiveDialogOpen] = useState(false);
    const [deactiveDialogOpen, setDeactiveDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Get first 3 pilot users
    const data = dashboardData?.newPilotUsers?.slice(0, 3) || [];

    // Helper function to get home base from Weather array
    const getHomeBase = (weather: any[]) => {
        if (!weather || weather.length === 0) return '-';
        const homeBase = weather.find(w => w.status === 'HOMEBASE');
        return homeBase ? homeBase.location : '-';
    };

    // Helper function to get favorites from Weather array
    const getFavorites = (weather: any[]) => {
        if (!weather || weather.length === 0) return '-';
        const favorites = weather.filter(w => w.status === 'FAVURATE');
        if (favorites.length === 0) return '-';
        return favorites.map(f => f.location).join(', ');
    };

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
            await activateMember(selectedUser.id);
            setActiveDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const confirmDeactive = async () => {
        if (selectedUser) {
            await deactivateMember(selectedUser.id);
            setDeactiveDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const cancelAction = () => {
        setActiveDialogOpen(false);
        setDeactiveDialogOpen(false);
        setSelectedUser(null);
    };

    const columns = [
        {
            key: 'name',
            label: 'User Name',
            width: '16.6%',
            render: (value: string) => (
                <span className="truncate block">{value}</span>
            )
        },
        {
            key: 'license',
            label: 'Current License',
            width: '16.6%',
            render: (value: string) => (
                <span className="truncate block">{value}</span>
            )
        },
        {
            key: 'homeBase',
            label: 'Home Base',
            width: '16.6%',
            render: (value: any, row: any) => (
                <span className="truncate block">{getHomeBase(row.Weather)}</span>
            )
        },
        {
            key: 'favorites',
            label: 'Favorites',
            width: '16.6%',
            render: (value: any, row: any) => {
                const favorites = getFavorites(row.Weather);
                return <span className="truncate block">{favorites}</span>;
            }
        },
        {
            key: 'email',
            label: 'Email',
            width: '16.6%',
            render: (value: string) => (
                <span className="truncate block lowercase">{value}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: '16.6%',
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
            width: '16.6%',
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
                            disabled={activatingMemberId === row.id || deactivatingMemberId === row.id}
                        >
                            {activatingMemberId === row.id ? (
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
                            disabled={activatingMemberId === row.id || deactivatingMemberId === row.id}
                        >
                            {deactivatingMemberId === row.id ? (
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
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold text-white'>New Pilot User</h1>
                <div>
                    <Link href="/pilot-user" className='underline text-[#3762E4] cursor-pointer transition-all duration-300 hover:text-[#3762E4]/50'>View Pilot User</Link>
                </div>
            </div>

            <ReusableTable
                data={data}
                columns={columns}
                actions={actions}
                className="mt-4"
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
                        <Button onClick={confirmActive} disabled={activatingMemberId === selectedUser?.id} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                            {activatingMemberId === selectedUser?.id ? (
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
                        <Button onClick={confirmDeactive} disabled={deactivatingMemberId === selectedUser?.id} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                            {deactivatingMemberId === selectedUser?.id ? (
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
    )
}
