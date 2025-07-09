'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllInstructorApi, addInstructorApi, deleteInstructorApi, activeInstructorApi, deactiveInstructorApi } from '@/apis/instructorApis';
import { toast } from 'react-toastify';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  [key: string]: any;
}

interface InstructorContextType {
  instructors: Instructor[];
  loading: boolean;
  creating: boolean;
  deletingId: string | null;
  activatingId: string | null;
  deactivatingId: string | null;
  error: string | null;
  fetchInstructors: (page?: number, limit?: number, search?: string, type?: string) => Promise<void>;
  addInstructor: (data: Omit<Instructor, '_id' | 'status'>) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
  activeInstructor: (id: string) => Promise<void>;
  deactiveInstructor: (id: string) => Promise<void>;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  search: string;
  setSearch: (search: string) => void;
  type: string;
  setType: (type: string) => void;
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined);

export const useInstructorContext = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error('useInstructorContext must be used within InstructorProvider');
  }
  return context;
};

export const InstructorProvider = ({ children }: { children: ReactNode }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const fetchInstructors = async (pg = page, lim = limit, srch = search, typ = type) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllInstructorApi(pg, lim, srch, typ);
      const mapped = (res.data || []).map((item: any) => ({
        ...item,
        _id: item.id,
        status: item.status?.toLowerCase() || '',
        student: item.users || [],
      }));
      setInstructors(mapped);
      setTotal(res.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch instructors');
      toast.error(err.message || 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  const addInstructor = async (data: Omit<Instructor, '_id' | 'status'>) => {
    setCreating(true);
    setError(null);
    try {
      await addInstructorApi(data);
      toast.success('Instructor added successfully');
      await fetchInstructors(1, limit, search, type); 
      setPage(1);
    } catch (err: any) {
      setError(err.message || 'Failed to add instructor');
      toast.error(err.message || 'Failed to add instructor');
    } finally {
      setCreating(false);
    }
  };

  const deleteInstructor = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteInstructorApi(id);
      toast.success('Instructor deleted successfully');
      // Update local state instead of refetching
      setInstructors(prev => prev.filter(instructor => instructor._id !== id));
      setTotal(prev => prev - 1);
    } catch (err: any) {
      setError(err.message || 'Failed to delete instructor');
      toast.error(err.message || 'Failed to delete instructor');
    } finally {
      setDeletingId(null);
    }
  };

  const activeInstructor = async (id: string) => {
    setActivatingId(id);
    setError(null);
    try {
      await activeInstructorApi(id);
      toast.success('Instructor activated successfully');
      // Update local state
      setInstructors(prev => prev.map(instructor =>
        instructor._id === id
          ? { ...instructor, status: 'active' }
          : instructor
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to activate instructor');
      toast.error(err.message || 'Failed to activate instructor');
    } finally {
      setActivatingId(null);
    }
  };

  const deactiveInstructor = async (id: string) => {
    setDeactivatingId(id);
    setError(null);
    try {
      await deactiveInstructorApi(id);
      toast.success('Instructor deactivated successfully');
      // Update local state
      setInstructors(prev => prev.map(instructor =>
        instructor._id === id
          ? { ...instructor, status: 'deactive' }
          : instructor
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate instructor');
      toast.error(err.message || 'Failed to deactivate instructor');
    } finally {
      setDeactivatingId(null);
    }
  };

  useEffect(() => {
    fetchInstructors();
    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <InstructorContext.Provider
      value={{
        instructors,
        loading,
        creating,
        deletingId,
        activatingId,
        deactivatingId,
        error,
        fetchInstructors,
        addInstructor,
        deleteInstructor,
        activeInstructor,
        deactiveInstructor,
        total,
        page,
        limit,
        setPage,
        setLimit,
        search,
        setSearch,
        type,
        setType,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}; 