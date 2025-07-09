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

export default function NewInstructor() {
    const { 
        dashboardData, 
        activatingInstructorId, 
        deactivatingInstructorId,
        activateInstructor, 
        deactivateInstructor 
    } = useDashboardContext();

    const [activeDialogOpen, setActiveDialogOpen] = useState(false);
    const [deactiveDialogOpen, setDeactiveDialogOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<any>(null);

    // Get first 3 instructors
    const data = dashboardData?.newInstructors?.slice(0, 3) || [];

    // Confirmation handlers
    const handleActiveClick = (instructor: any) => {
        setSelectedInstructor(instructor);
        setActiveDialogOpen(true);
    };

    const handleDeactiveClick = (instructor: any) => {
        setSelectedInstructor(instructor);
        setDeactiveDialogOpen(true);
    };

    const confirmActive = async () => {
        if (selectedInstructor) {
            await activateInstructor(selectedInstructor.id);
            setActiveDialogOpen(false);
            setSelectedInstructor(null);
        }
    };

    const confirmDeactive = async () => {
        if (selectedInstructor) {
            await deactivateInstructor(selectedInstructor.id);
            setDeactiveDialogOpen(false);
            setSelectedInstructor(null);
        }
    };

    const cancelAction = () => {
        setActiveDialogOpen(false);
        setDeactiveDialogOpen(false);
        setSelectedInstructor(null);
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
            key: 'users',
            label: 'Student',
            width: '20%',
            render: (value: any, row: any) => {
                if (!row.users || row.users.length === 0) return <span>-</span>;
                const studentNames = row.users.map((user: any) => user.name).join(', ');
                // Truncate if too long
                if (studentNames.length > 30) {
                    return <span className="truncate block">{studentNames.slice(0, 27) + '...'}</span>;
                }
                return <span className="truncate block">{studentNames}</span>;
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
            width: '20%',
            render: (value: string) => (
                <span className="truncate block lowercase">{value}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: '20%',
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
                            disabled={activatingInstructorId === row.id || deactivatingInstructorId === row.id}
                        >
                            {activatingInstructorId === row.id ? (
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
                            disabled={activatingInstructorId === row.id || deactivatingInstructorId === row.id}
                        >
                            {deactivatingInstructorId === row.id ? (
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
                <h1 className='text-2xl font-semibold text-white'>New Instructor</h1>
                <div>
                    <Link href="/instructor" className='underline text-[#3762E4] cursor-pointer transition-all duration-300 hover:text-[#3762E4]/50'>View Instructor</Link>
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
                        <DialogTitle>Activate Instructor?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to activate {selectedInstructor?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black ">
                            Cancel
                        </Button>
                        <Button onClick={confirmActive} disabled={activatingInstructorId === selectedInstructor?.id} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                            {activatingInstructorId === selectedInstructor?.id ? (
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
                        <DialogTitle>Deactivate Instructor?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to deactivate {selectedInstructor?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeactive} disabled={deactivatingInstructorId === selectedInstructor?.id} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                            {deactivatingInstructorId === selectedInstructor?.id ? (
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
