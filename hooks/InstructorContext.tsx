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
    setLoading(true);
    setError(null);
    try {
      await addInstructorApi(data);
      toast.success('Instructor added successfully');
      await fetchInstructors(1, limit, search, type); // refresh first page
      setPage(1);
    } catch (err: any) {
      setError(err.message || 'Failed to add instructor');
      toast.error(err.message || 'Failed to add instructor');
    } finally {
      setLoading(false);
    }
  };

  const deleteInstructor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInstructorApi(id);
      toast.success('Instructor deleted successfully');
      await fetchInstructors(page, limit, search, type);
    } catch (err: any) {
      setError(err.message || 'Failed to delete instructor');
      toast.error(err.message || 'Failed to delete instructor');
    } finally {
      setLoading(false);
    }
  };

  const activeInstructor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await activeInstructorApi(id);
      toast.success('Instructor activated successfully');
      await fetchInstructors(page, limit, search, type);
    } catch (err: any) {
      setError(err.message || 'Failed to activate instructor');
      toast.error(err.message || 'Failed to activate instructor');
    } finally {
      setLoading(false);
    }
  };

  const deactiveInstructor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deactiveInstructorApi(id);
      toast.success('Instructor deactivated successfully');
      await fetchInstructors(page, limit, search, type);
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate instructor');
      toast.error(err.message || 'Failed to deactivate instructor');
    } finally {
      setLoading(false);
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