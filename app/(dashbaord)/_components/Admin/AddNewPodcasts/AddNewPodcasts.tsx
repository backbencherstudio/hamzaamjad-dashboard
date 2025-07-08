import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { usePodcasts } from '@/hooks/usePodcasts';
import Image from 'next/image';

interface AddNewPodcastsProps {
    podcast?: any;
    onClose?: () => void;
    isEdit?: boolean;
}

export default function AddNewPodcasts({ podcast, onClose, isEdit = false }: AddNewPodcastsProps) {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [mp3File, setMp3File] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [existingMp3, setExistingMp3] = useState<string>('');
    const [existingCover, setExistingCover] = useState<string>('');
    const mp3InputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const { createPodcast, updatePodcast, creating, updatingId } = usePodcasts();

    // Initialize form with podcast data if editing
    useEffect(() => {
        if (podcast && isEdit) {
            setValue('title', podcast.title);
            setValue('hostName', podcast.hostName);
            if (podcast.date) {
                const date = new Date(podcast.date);
                setSelectedDate(date);
                setValue('date', format(date, 'yyyy-MM-dd'));
            }
            // Set existing files for display
            if (podcast.mp3) {
                setExistingMp3(podcast.mp3);
            }
            if (podcast.cover) {
                setExistingCover(podcast.cover);
            }
        }
    }, [podcast, isEdit, setValue]);

    const onSubmit = async (formData: any) => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('hostName', formData.hostName);
        data.append('date', formData.date);
        
        if (mp3File) {
            data.append('mp3', mp3File);
        }
        if (coverFile) {
            data.append('cover', coverFile);
        }

        try {
            if (isEdit && (podcast?.id || podcast?._id)) {
                const podcastId = podcast.id || podcast._id;
                await updatePodcast(podcastId, data);
            } else {
                await createPodcast(data);
            }
            
            // Reset form and close modal
            reset();
            setSelectedDate(undefined);
            setMp3File(null);
            setCoverFile(null);
            setExistingMp3('');
            setExistingCover('');
            onClose?.();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const handleMp3Drop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setMp3File(e.dataTransfer.files[0]);
        }
    };
    const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setCoverFile(e.dataTransfer.files[0]);
        }
    };
    const handleMp3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMp3File(e.target.files[0]);
        }
    };
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverFile(e.target.files[0]);
        }
    };

    // Determine if button should be disabled and show loading
    const isButtonLoading = isEdit ? !!updatingId : creating;
    const isButtonDisabled = isButtonLoading;

    return (
        <form
            className="p-6 flex flex-col gap-4 bg-[#1D1F2C]"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="title">Podcasts</Label>
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
                <Label className="block text-sm text-white mb-1" htmlFor="hostName">Host Name</Label>
                <Input
                    id="hostName"
                    type="text"
                    placeholder="Enter host name"
                    className="w-full px-4 py-2 rounded bg-[#161721] text-white border border-[#23293D] focus:outline-none"
                    {...register('hostName', { required: 'Host name is required' })}
                />
                {errors.hostName && <span className="text-xs text-red-400">{errors.hostName.message as string}</span>}
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
                <Label className="block text-sm text-white mb-1">Upload mp3 file</Label>
                <div
                    className="border-2 border-dashed border-blue-500/40 rounded-lg p-4 text-center text-white bg-[#181F2A] cursor-pointer"
                    onDrop={handleMp3Drop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => mp3InputRef.current?.click()}
                >
                    {mp3File ? (
                        <span>{mp3File.name}</span>
                    ) : existingMp3 ? (
                        <div>
                            <span className="block mb-2">Current file: {existingMp3.split('/').pop()}</span>
                            <span className="text-sm text-gray-400">Click to upload new file</span>
                        </div>
                    ) : (
                        'Drag and drop files here or click to select'
                    )}
                    <input
                        type="file"
                        accept="audio/mp3,audio/mpeg"
                        ref={mp3InputRef}
                        style={{ display: 'none' }}
                        onChange={handleMp3Change}
                    />
                </div>
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
                        <Image
                            width={64}
                            height={64}
                            src={URL.createObjectURL(coverFile)}
                            alt="Cover Preview"
                            className="mx-auto h-16 w-16 object-cover rounded mb-2"
                        />
                    ) : existingCover ? (
                        <div>
                            <Image
                                width={64}
                                height={64}
                                src={existingCover}
                                alt="Current Cover"
                                className="mx-auto h-16 w-16 object-cover rounded mb-2"
                            />
                            <span className="text-sm text-gray-400">Click to upload new image</span>
                        </div>
                    ) : (
                        'Drag and drop files here or click to select'
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={coverInputRef}
                        style={{ display: 'none' }}
                        onChange={handleCoverChange}
                    />
                </div>
            </div>
            <Button
                type="submit"
                disabled={isButtonDisabled}
                className="w-full cursor-pointer transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white font-semibold py-2 px-4 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isButtonLoading ? 'Processing...' : (isEdit ? 'Update Podcast' : 'Add Podcast')}
            </Button>
        </form>
    )
}
