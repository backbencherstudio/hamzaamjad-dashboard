"use client"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react';
import React from 'react'
import { usePromoCodeContext } from '@/hooks/PromoCodeContext'

interface AddPromoCodeProps {
    onSuccess?: () => void;
    page: number;
    limit: number;
    status: string;
    search: string;
}

export default function AddPromoCode({ onSuccess, page, limit, status, search }: AddPromoCodeProps) {
    const { createPromoCode, creating } = usePromoCodeContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPromoCode(page, limit, status, search);
            onSuccess?.();
        } catch (error) {
            console.error('Error creating promo code:', error);
        }
    };

    return (
        <div className='p-6 flex flex-col gap-4 bg-[#1D1F2C]'>
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Create New Promo Code</h3>
                <p className="text-gray-400 text-sm">
                    Click the button below to generate a new promo code. The backend will automatically create a unique code for you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Button
                    type="submit"
                    disabled={creating}
                    className="w-full cursor-pointer transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white font-semibold py-3 px-4 rounded-lg"
                >
                    {creating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Creating Promo Code...
                        </>
                    ) : (
                        "Generate Promo Code"
                    )}
                </Button>
            </form>
        </div>
    )
}
