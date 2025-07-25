'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { forgotPasswordApi } from '@/apis/authApis'
import TokenMatch from './TokenMatch'

export default function ForgotPage() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [showOtpForm, setShowOtpForm] = React.useState(false)
    const [userEmail, setUserEmail] = React.useState('')
    const [otpExpiry, setOtpExpiry] = React.useState<string>('')

    const form = useForm({
        defaultValues: {
            email: '',
        },
        mode: 'onTouched',
    })

    const onSubmit = async (data: any) => {
        try {
            setIsLoading(true)
            const response = await forgotPasswordApi({ email: data.email })

            if (response.success) {
                setUserEmail(data.email)
                setOtpExpiry(response.otpExpiry || '')
                setShowOtpForm(true)
                toast.success(response.message || 'OTP sent to your email successfully!')
            } else {
                toast.error(response.message || 'Failed to send OTP')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to send OTP')
        } finally {
            setIsLoading(false)
        }
    }

    if (showOtpForm) {
        return <TokenMatch email={userEmail} initialOtpExpiry={otpExpiry} />
    }

    return (
        <div className="w-full md:max-w-lg bg-[#1D1F2C] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-2">Forgot your password?</h2>
            <p className='text-gray-300 mb-8 text-sm'>No worries, just enter your email and we'll send you a reset OTP.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        rules={{ required: 'Email is required' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="example @gmail.com"
                                            className="bg-[#161721] border-none text-white pl-4 pr-10 h-12 placeholder:text-gray-400 "
                                        />
                                    </FormControl>
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-white" size={20} />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full py-6 px-4 cursor-pointer bg-[#3762E4] text-white text-base font-semibold rounded-lg shadow-none hover:bg-[#2C47C7]" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="animate-spin" /> Loading...</> : 'Send OTP'}
                    </Button>

                    <div className='flex justify-center items-center'>
                        <Link href="/login" className='text-gray-300 text-sm underline'>Return to login</Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}
