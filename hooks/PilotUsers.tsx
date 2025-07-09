'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getPolotUserApi, pilotUserActive, pilotUserDeactive } from '@/apis/pilotUser';
import { toast } from 'react-toastify';

interface PilotUser {
  id: string;
  name: string;
  email: string;
  license: string;
  status: string;
  createdAt: string;
  homeBase: string;
  favorites: string[] | null;
  [key: string]: any;
}

interface PilotUserContextType {
  users: PilotUser[];
  loading: boolean;
  activatingId: string | null;
  deactivatingId: string | null;
  error: string | null;
  fetchUsers: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
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

const PilotUserContext = createContext<PilotUserContextType | undefined>(undefined);

export const usePilotUserContext = () => {
  const context = useContext(PilotUserContext);
  if (!context) {
    throw new Error('usePilotUserContext must be used within PilotUserProvider');
  }
  return context;
};

export const PilotUsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<PilotUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); 

  const fetchUsers = useCallback(async (pg = page, lim = limit, srch = search, stat = status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPolotUserApi(pg, lim, srch, stat);
      setUsers(res.users || []);
      setTotal(res.totalUsers || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pilot users');
      toast.error(err.message || 'Failed to fetch pilot users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  const activateUser = useCallback(async (id: string) => {
    setActivatingId(id);
    setError(null);
    try {
      await pilotUserActive(id);
      toast.success('Pilot user activated successfully');
      setUsers(prev => prev.map(user =>
        user.id === id
          ? { ...user, status: 'ACTIVE' }
          : user
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to activate pilot user');
      toast.error(err.message || 'Failed to activate pilot user');
    } finally {
      setActivatingId(null);
    }
  }, []);

  const deactivateUser = useCallback(async (id: string) => {
    setDeactivatingId(id);
    setError(null);
    try {
      await pilotUserDeactive(id);
      toast.success('Pilot user deactivated successfully');
      setUsers(prev => prev.map(user =>
        user.id === id
          ? { ...user, status: 'DEACTIVE' }
          : user
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate pilot user');
      toast.error(err.message || 'Failed to deactivate pilot user');
    } finally {
      setDeactivatingId(null);
    }
  }, []);


  useEffect(() => {
    fetchUsers();
  }, []); 

  return (
    <PilotUserContext.Provider
      value={{
        users,
        loading,
        activatingId,
        deactivatingId,
        error,
        fetchUsers,
        activateUser,
        deactivateUser,
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
    </PilotUserContext.Provider>
  );
};
