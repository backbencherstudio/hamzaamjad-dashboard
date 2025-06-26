import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function AddPromoCode() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: any) => {
        console.log(data);
    }
    return (
        <form
            className="p-6 flex flex-col gap-4 bg-[#1D1F2C]"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <Label className="block text-sm text-white mb-1" htmlFor="name">Promo Code</Label>
                <Input
                    id="name"
                    type="number"
                    placeholder="Enter promo code"
                    className="w-full px-4 py-2 rounded bg-[#161721] text-white border border-[#23293D] focus:outline-none"
                    {...register('name', { required: 'Promo code is required' })}
                />
                {errors.name && <span className="text-xs text-red-400">{errors.name.message as string}</span>}
            </div>

            <Button
                type="submit"
                className="w-full cursor-pointer transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white font-semibold py-2 px-4 rounded-lg mt-2"
            >
                Create Promo Code
            </Button>
        </form>
    )
}
