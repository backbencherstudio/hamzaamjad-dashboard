import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form';
import { useInstructorContext } from '@/hooks/InstructorContext';

interface AddInstructorProps {
    onSuccess?: () => void;
}

export default function AddInstructor({ onSuccess }: AddInstructorProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { addInstructor, loading } = useInstructorContext();

    const onSubmit = async (data: any) => {
        await addInstructor(data);
        reset();
        if (onSuccess) onSuccess();
    }
    return (
        <form
            className="p-6 flex flex-col gap-4 bg-[#1D1F2C]"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter instructor name"
                    className="w-full px-4 py-2 rounded bg-[#161721] text-white border border-[#23293D] focus:outline-none"
                    {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <span className="text-xs text-red-400">{errors.name.message as string}</span>}
            </div>
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter instructor email"
                    className="w-full px-4 py-2 rounded bg-[#161721] text-white border border-[#23293D] focus:outline-none"
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <span className="text-xs text-red-400">{errors.email.message as string}</span>}
            </div>
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    type="text"
                    placeholder="Enter instructor phone"
                    className="w-full px-4 py-2 rounded bg-[#161721] text-white border border-[#23293D] focus:outline-none"
                    {...register('phone', { required: 'Phone is required' })}
                />
                {errors.phone && <span className="text-xs text-red-400">{errors.phone.message as string}</span>}
            </div>
            <Button
                type="submit"
                className="w-full cursor-pointer transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white font-semibold py-2 px-4 rounded-lg mt-2"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Instructor'}
            </Button>
        </form >
    )
}
