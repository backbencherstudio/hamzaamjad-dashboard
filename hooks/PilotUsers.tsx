'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPolotUserApi } from '@/apis/pilotUser';
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
  error: string | null;
  fetchUsers: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); 

  const fetchUsers = async (pg = page, lim = limit, srch = search, stat = status) => {
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
  };

  // Removed automatic fetch to prevent conflicts with page component

  return (
    <PilotUserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
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
