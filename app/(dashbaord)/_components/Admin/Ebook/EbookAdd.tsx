import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function EbookAdd() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [pdfError, setPdfError] = useState('');
    const [coverError, setCoverError] = useState('');

    const onSubmit = (formData: any) => {
        console.log(formData, pdfFile, coverFile);
    }

    const handlePdfDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.name.endsWith('.docx'))) {
                setPdfFile(file);
                setPdfError('');
            } else {
                setPdfError('Only PDF or DOC files are allowed');
            }
        }
    };
    const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')) {
                setCoverFile(file);
                setCoverError('');
            } else {
                setCoverError('Only image files up to 5MB are allowed');
            }
        }
    };
    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.name.endsWith('.docx'))) {
                setPdfFile(file);
                setPdfError('');
            } else {
                setPdfError('Only PDF or DOC files are allowed');
            }
        }
    };
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')) {
                setCoverFile(file);
                setCoverError('');
            } else {
                setCoverError('Only image files up to 5MB are allowed');
            }
        }
    };

    return (
        <form
            className="p-6 flex flex-col gap-4 bg-[#1D1F2C]"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="title">E-book Name</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Enter title"
                    className="w-full px-4 py-2 rounded bg-[#161721] text-white border border-[#23293D] focus:outline-none"
                    {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <span className="text-xs text-red-400">{errors.title.message as string}</span>}
            </div>
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="date">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={
                                `w-full justify-start text-left font-normal bg-[#161721] border-[#23293D] text-white ${!selectedDate ? 'text-muted-foreground' : ''}`
                            }
                        >
                            {selectedDate ? format(selectedDate, 'MM/dd/yyyy') : 'mm/dd/yyyy'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#23293D] border-[#23293D]">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                if (date) {
                                    setValue('date', format(date, 'yyyy-MM-dd'));
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.date && <span className="text-xs text-red-400">{errors.date.message as string}</span>}
            </div>
            <div>
                <Label className="block text-sm text-white mb-1">Upload PDF</Label>
                <div
                    className="border-2 border-dashed border-blue-500/40 rounded-lg p-4 text-center text-white bg-[#181F2A] cursor-pointer"
                    onDrop={handlePdfDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => pdfInputRef.current?.click()}
                >
                    {pdfFile ? (
                        <span>{pdfFile.name}</span>
                    ) : (
                        'Drag and drop files here'
                    )}
                    <input
                        type="file"
                        accept="application/pdf,application/msword,.doc,.docx"
                        ref={pdfInputRef}
                        style={{ display: 'none' }}
                        onChange={handlePdfChange}
                    />
                </div>
                {pdfError && <span className="text-xs text-red-400">{pdfError}</span>}
            </div>
            <div>
                <Label className="block text-sm text-white mb-1">Cover</Label>
                <div
                    className="border-2 border-dashed border-blue-500/40 rounded-lg p-4 text-center text-white bg-[#181F2A] cursor-pointer"
                    onDrop={handleCoverDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => coverInputRef.current?.click()}
                >
                    {coverFile ? (
                        <img
                            src={URL.createObjectURL(coverFile)}
                            alt="Cover Preview"
                            className="mx-auto h-16 w-16 object-cover rounded mb-2"
                        />
                    ) : (
                        <>
                            Drag and drop files here
                            <div className="text-xs text-gray-500 mt-1">Maximum file size is 5MB</div>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={coverInputRef}
                        style={{ display: 'none' }}
                        onChange={handleCoverChange}
                    />
                </div>
                {coverError && <span className="text-xs text-red-400">{coverError}</span>}
            </div>
            <Button
                type="submit"
                className="w-full cursor-pointer transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white font-semibold py-2 px-4 rounded-lg mt-2"
            >
                Add E-book
            </Button>
        </form>
    )
}
