'use client'
import React, { useEffect, useState, useMemo } from 'react'
import ReusableTable from '@/components/reusable/Dashboard/Table/ReuseableTable'
import ReusablePagination from '@/components/reusable/Dashboard/Table/ReusablePagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import CustomReusableModal from '@/components/reusable/Dashboard/Modal/CustomReusableModal'
import EbookAdd from '../_components/Admin/Ebook/EbookAdd'
import { useEbook } from '@/hooks/useEbook'
import { Ebook } from '@/apis/ebookApis'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import Image from 'next/image'

export default function EbookPage() {
  const {
    ebooks,
    loading,
    totalPages,
    totalItems,
    currentPage,
    itemsPerPage,
    fetchEbooks,
    deleteEbook,
    updateEbook,
    setCurrentPage,
    setItemsPerPage
  } = useEbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }


    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchEbooks(1, itemsPerPage, value || undefined);
    }, 300);

    setSearchTimeout(timeoutId);
  };

  const paginatedData = ebooks;

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchEbooks(page, itemsPerPage, searchTerm || undefined);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
      fetchEbooks(1, newItemsPerPage, searchTerm || undefined);
    }
  };


  const columns = [
    {
      key: 'cover',
      label: 'E-book Image',
      width: '30%',
      render: (value: string) => (
        <Image
          width={100}
          height={100}
          src={value || '/Image/logo/logo.png'}
          alt="E-book"
          className="w-12 h-12 rounded object-cover"
        />
      ),
    },
    {
      key: 'title',
      label: 'Name',
      width: '30%',
      render: (value: string) => <span className="truncate block">{value}</span>,
    },
    {
      key: 'date',
      label: 'Day',
      width: '35%',
      render: (value: string) => {
        if (!value) return '-';
        const d = new Date(value);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'short' });
        return <span>{`${day} ${month}`}</span>;
      },
    },
  ];

  const handleDelete = async (id: string) => {
    await deleteEbook(id);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
      setDialogOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setDeleteId(null);
  };

  const handleEdit = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedEbook(null);
  };

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
              onClick={() => handleEdit(row)}
              disabled={loading}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 cursor-pointer"
              onClick={() => openDeleteDialog(row.id)}
              disabled={loading}
            >
              Delete
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <>
      <div className='mb-6 flex flex-col lg:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl font-semibold text-white'>E-book</h1>
        {/* Search on the right */}
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <button
            className="bg-blue-600 cursor-pointer transition-all duration-300 text-sm hover:bg-blue-700 text-white font-semibold py-2 px-4  rounded-lg shadow ml-auto sm:ml-0 mt-4 sm:mt-0"
            onClick={() => setIsModalOpen(true)}
          >
            + Add E-book
          </button>
          <div className="relative w-full sm:w-auto sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-[#181F2A] text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <ReusableTable
        data={paginatedData}
        columns={columns}
        actions={actions}
        className="mt-4"
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        className=""
      />

      {/* Add/Edit Ebook Modal */}
      <CustomReusableModal
        className='bg-[#1D1F2C] text-white border-none'
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Edit E-book" : "Add New E-book"}
      >
        <EbookAdd
          onClose={handleCloseModal}
          isEditMode={isEditMode}
          selectedEbook={selectedEbook}
          updateEbook={updateEbook}
        />
      </CustomReusableModal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1D1F2C] text-white border border-[#23293D]">
          <DialogHeader>
            <DialogTitle>Delete E-book?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this e-book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete} className='text-black'>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


