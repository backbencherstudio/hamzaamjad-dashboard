'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { toast } from 'react-toastify'
import { MoreVertical, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MembershipProvider, useMembershipContext } from '@/hooks/useMembership'
import { useDebounce } from '@/hooks/useDebounce'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

function MembershipPageContent() {
    const {
        memberships,
        loading,
        activatingId,
        deactivatingId,
        page,
        setPage,
        limit,
        setLimit,
        total,
        search,
        setSearch,
        status,
        setStatus,
        activateMember,
        deactivateMember,
        fetchMemberships,
    } = useMembershipContext();
    
    const [activeTab, setActiveTab] = useState('all');
    const [hasInitialized, setHasInitialized] = useState(false);
    
    // Confirmation dialog states
    const [activeDialogOpen, setActiveDialogOpen] = useState(false);
    const [deactiveDialogOpen, setDeactiveDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(search, 300);

    // Fetch data only once when component mounts
    useEffect(() => {
        if (!hasInitialized) {
            fetchMemberships(page, limit, search, status);
            setHasInitialized(true);
        }
    }, [fetchMemberships, page, limit, search, status, hasInitialized]);

    // Fetch data when debounced search term changes
    useEffect(() => {
        if (hasInitialized) {
            setPage(1);
            fetchMemberships(1, limit, debouncedSearchTerm || undefined, status);
        }
    }, [debouncedSearchTerm, hasInitialized]);

    // Direct search handler (no debouncing here, useDebounce handles it)
    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Confirmation handlers
    const handleActiveClick = (member: any) => {
        setSelectedMember(member);
        setActiveDialogOpen(true);
    };

    const handleDeactiveClick = (member: any) => {
        setSelectedMember(member);
        setDeactiveDialogOpen(true);
    };

    const confirmActive = async () => {
        if (selectedMember) {
            await activateMember(selectedMember.id); 
            setActiveDialogOpen(false);
            setSelectedMember(null);
        }
    };

    const confirmDeactive = async () => {
        if (selectedMember) {
            await deactivateMember(selectedMember.id); 
            setDeactiveDialogOpen(false);
            setSelectedMember(null);
        }
    };

    const cancelAction = () => {
        setActiveDialogOpen(false);
        setDeactiveDialogOpen(false);
        setSelectedMember(null);
    };

    // Helper function to check if member has active subscription
    const hasActiveSubscription = (member: any) => {
        if (member.subscription && member.subscription.length > 0) {
            return member.subscription.some((sub: any) => sub.status === 'ACTIVE');
        }
        return false;
    };

    // Helper function to get subscription status text
    const getSubscriptionStatusText = (member: any) => {
        if (member.subscription && member.subscription.length > 0) {
            const hasActive = member.subscription.some((sub: any) => sub.status === 'ACTIVE');
            if (hasActive) return 'Subscribed';
            
            const hasDeactive = member.subscription.some((sub: any) => sub.status === 'DEACTIVE');
            if (hasDeactive) return 'Expired';
        }
        return 'Non Subscribed';
    };

    // Helper function to get subscription status color
    const getSubscriptionStatusColor = (member: any) => {
        const status = getSubscriptionStatusText(member);
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

    // Helper function to get subscription date
    const getSubscriptionDate = (member: any) => {
        if (member.subscription && member.subscription.length > 0) {
            const activeSub = member.subscription.find((sub: any) => sub.status === 'ACTIVE');
            if (activeSub) return activeSub.startDate;
            
            const latestSub = member.subscription[member.subscription.length - 1];
            return latestSub.startDate;
        }
        return null;
    };

    // Tabs with counts - based on subscription status
    const tabs = [
        {
            key: 'all',
            label: 'All',
            count: total
        },
        {
            key: 'subscribed',
            label: 'Subscribed',
            count: memberships.filter(member => hasActiveSubscription(member)).length
        },
        {
            key: 'non-subscribed',
            label: 'Non Subscribed',
            count: memberships.filter(member => !hasActiveSubscription(member)).length
        }
    ];

    // Filtered data for tab - based on subscription status
    const filteredData = useMemo(() => {
        let filtered = memberships;
        if (activeTab !== 'all') {
            if (activeTab === 'subscribed') {
                filtered = filtered.filter(member => hasActiveSubscription(member));
            } else if (activeTab === 'non-subscribed') {
                filtered = filtered.filter(member => !hasActiveSubscription(member));
            }
        }
        return filtered;
    }, [activeTab, memberships]);

    // Pagination logic
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    const handlePageChange = (p: number) => {
        setPage(p);
        fetchMemberships(p, limit, debouncedSearchTerm || undefined, status);
    };
    
    const handleItemsPerPageChange = (l: number) => { 
        setLimit(l); 
        setPage(1);
        fetchMemberships(1, l, debouncedSearchTerm || undefined, status);
    };
    
    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
        setPage(1);
        // Note: We're not filtering by status in the API call for subscription tabs
        // The filtering is done client-side based on subscription array
        fetchMemberships(1, limit, debouncedSearchTerm || undefined, status);
    };

    const columns = [
        {
            key: 'name',
            label: 'User Name',
            width: '20%',
            render: (value: string) => <span className="truncate block">{value}</span>
        },
        {
            key: 'subscription_status',
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
            render: (value: string) => <span className="truncate block lowercase">{value}</span>
        },
        {
            key: 'subscription_date',
            label: 'Subscription Date',
            width: '20%',
            render: (value: any, row: any) => {
                const subscriptionDate = getSubscriptionDate(row);
                if (!subscriptionDate) return <span>-</span>;
                const d = new Date(subscriptionDate);
                const formatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                return <span>{formatted}</span>;
            }
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
                <h1 className='text-2xl font-semibold text-white'>All Membership</h1>
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

            {/* Active Confirmation Dialog */}
            <Dialog open={activeDialogOpen} onOpenChange={setActiveDialogOpen}>
                <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
                    <DialogHeader>
                        <DialogTitle>Activate Member?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Are you sure you want to activate {selectedMember?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black ">
                            Cancel
                        </Button>
                        <Button onClick={confirmActive} disabled={activatingId === selectedMember?.id} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                            {activatingId === selectedMember?.id ? (
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
                            Are you sure you want to deactivate {selectedMember?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAction} className="border-[#23293D] cursor-pointer text-black">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeactive} disabled={deactivatingId === selectedMember?.id} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                            {deactivatingId === selectedMember?.id ? (
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

export default function MembershipPage() {
    return (
        <MembershipProvider>
            <MembershipPageContent />
        </MembershipProvider>
    );
}


