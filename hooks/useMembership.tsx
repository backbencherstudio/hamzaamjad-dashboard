import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAllMembership, membersActiveAndDeactive, membersDeactive } from '@/apis/membershipApis';
import { toast } from 'react-toastify';

interface Subscription {
  startDate: string;
  status: string;
}

interface Membership {
  id: string;
  name: string;
  email: string;
  premium: boolean;
  status: string;
  subscription: Subscription[];
  [key: string]: any;
}

interface MembershipContextType {
  memberships: Membership[];
  loading: boolean;
  activatingId: string | null;
  deactivatingId: string | null;
  error: string | null;
  fetchMemberships: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>;
  activateMember: (id: string) => Promise<void>;
  deactivateMember: (id: string) => Promise<void>;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  search: string;
  setSearch: (search: string) => void;
  status: string;
  setStatus: (status: string) => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const useMembershipContext = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembershipContext must be used within MembershipProvider');
  }
  return context;
};

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchMemberships = useCallback(async (pg = page, lim = limit, srch = search, stat = status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllMembership(pg, lim, srch, stat);
      const mapped = (res.data || []).map((item: any) => ({
        ...item,
        subscription: item.subscription || [],
        premium: item.premium || false,
        status: item.status?.toLowerCase() || '',
      }));
      setMemberships(mapped);
      setTotal(res.totalUsers || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch memberships');
      toast.error(err.message || 'Failed to fetch memberships');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  const activateMember = useCallback(async (id: string) => {
    setActivatingId(id);
    setError(null);
    try {
      await membersActiveAndDeactive(id);
      toast.success('Member activated successfully');
      // Update local state - find member by id
      setMemberships(prev => prev.map(member => 
        member.id === id 
          ? { ...member, status: 'active' }
          : member
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to activate member');
      toast.error(err.message || 'Failed to activate member');
    } finally {
      setActivatingId(null);
    }
  }, []);

  const deactivateMember = useCallback(async (id: string) => {
    setDeactivatingId(id);
    setError(null);
    try {
      await membersDeactive(id);
      toast.success('Member deactivated successfully');
      // Update local state - find member by id
      setMemberships(prev => prev.map(member => 
        member.id === id 
          ? { ...member, status: 'deactive' }
          : member
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate member');
      toast.error(err.message || 'Failed to deactivate member');
    } finally {
      setDeactivatingId(null);
    }
  }, []);

  // Only fetch on initial mount
  useEffect(() => {
    fetchMemberships();
  }, []); // Empty dependency array - only run once on mount

  return (
    <MembershipContext.Provider
      value={{
        memberships,
        loading,
        activatingId,
        deactivatingId,
        error,
        fetchMemberships,
        activateMember,
        deactivateMember,
        total,
        page,
        limit,
        setPage,
        setLimit,
        search,
        setSearch,
        status,
        setStatus,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};
