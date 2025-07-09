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

export default function NewMemberships() {
    const { 
        dashboardData, 
        activatingMemberId, 
        deactivatingMemberId,
        activateMember, 
        deactivateMember 
    } = useDashboardContext();

    const [activeDialogOpen, setActiveDialogOpen] = useState(false);
    const [deactiveDialogOpen, setDeactiveDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    // Get first 3 memberships
    const data = dashboardData?.newMemberships?.slice(0, 3) || [];

    // Helper function to get subscription status text
    const getSubscriptionStatusText = (membership: any) => {
        if (membership.status === 'ACTIVE') return 'Subscribed';
        if (membership.status === 'DEACTIVE') return 'Expired';
        return 'Non Subscribed';
    };

    // Helper function to get subscription status color
    const getSubscriptionStatusColor = (membership: any) => {
        const status = getSubscriptionStatusText(membership);
        switch (status) {
            case 'Subscribed':
                return 'bg-green-900/10 text-green-400 border-green-700';
            case 'Expired':
                return 'bg-orange-900/10 text-orange-400 border-orange-700';
            case 'Non Subscribed':
            default:
                return 'bg-red-900/10 text-red-400 border-red-700';
        }
    };

    // Confirmation handlers
    const handleActiveClick = (membership: any) => {
        setSelectedMember(membership);
        setActiveDialogOpen(true);
    };

    const handleDeactiveClick = (membership: any) => {
        setSelectedMember(membership);
        setDeactiveDialogOpen(true);
    };

    const confirmActive = async () => {
        if (selectedMember) {
            await activateMember(selectedMember.user.id);
            setActiveDialogOpen(false);
            setSelectedMember(null);
        }
    };

    const confirmDeactive = async () => {
        if (selectedMember) {
            await deactivateMember(selectedMember.user.id);
            setDeactiveDialogOpen(false);
            setSelectedMember(null);
        }
    };

    const cancelAction = () => {
        setActiveDialogOpen(false);
        setDeactiveDialogOpen(false);
        setSelectedMember(null);
    };

    const columns = [
        {
            key: 'name',
            label: 'User Name',
            width: '20%',
            render: (value: any, row: any) => (
                <span className="truncate block">{row.user.name}</span>
            )
        },
        {
            key: 'subscription',
            label: 'Subscription',
            width: '20%',
            render: (value: any, row: any) => {
                const statusText = getSubscriptionStatusText(row);
                const statusColor = getSubscriptionStatusColor(row);
                return (
                    <span className={`inline-flex items-center justify-center w-28 px-3 py-1 rounded text-xs font-medium border ${statusColor}`}>
                        {statusText}
                    </span>
                );
            }
        },
        {
            key: 'email',
            label: 'Email',
            width: '20%',
            render: (value: any, row: any) => (
                <span className="truncate block lowercase">{row.user.email}</span>
            )
        },
        {
            key: 'subscription_date',
            label: 'Subscription Date',
            width: '20%',
            render: (value: any, row: any) => {
                if (!row.startDate) return <span>-</span>;
                const d = new Date(row.startDate);
                const formatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                return <span>{formatted}</span>;
            }
        },
        {
            key: 'status',
            label: 'Status',
            width: '20%',
            render: (value: any, row: any) => (
                <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded text-xs font-medium border ${row.user.status?.toLowerCase() === 'active'
                    ? 'bg-green-900/10 text-green-400 border-green-700'
                    : 'bg-red-900/10 text-red-400 border-red-700'
                    }`}>
                    {row.user.status?.toLowerCase() === 'active' ? 'Active' : 'Deactivate'}
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
                            disabled={activatingMemberId === row.user.id || deactivatingMemberId === row.user.id}
                        >
                            {activatingMemberId === row.user.id ? (
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
                            disabled={activatingMemberId === row.user.id || deactivatingMemberId === row.user.id}
                        >
                            {deactivatingMemberId === row.user.id ? (
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
                <h1 className='text-2xl font-semibold text-white'>New Memberships</h1>
                <div>
                    <Link href="/membership" className='underline text-[#3762E4] cursor-pointer transition-all duration-300 hover:text-[#3762E4]/50'>View Memberships</Link>
                </div>
            </div>

            <ReusableTable
                data={data}
                columns={columns}
                actions={actions}
                className="mt-4 "
            />

            {/* Active Confirmation Dialog */}
            <Dialog open={activeDialogOpen} onOpenChange={setActiveDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Activate Member?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to activate {selectedMember?.user?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black ">
                            Cancel
                        </Button>
                        <Button onClick={confirmActive} disabled={activatingMemberId === selectedMember?.user?.id} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                            {activatingMemberId === selectedMember?.user?.id ? (
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
                        <DialogTitle>Deactivate Member?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to deactivate {selectedMember?.user?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeactive} disabled={deactivatingMemberId === selectedMember?.user?.id} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                            {deactivatingMemberId === selectedMember?.user?.id ? (
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
