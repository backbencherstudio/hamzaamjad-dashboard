'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewPassword() {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const form = useForm({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onTouched',
    })

    const onSubmit = (data: any) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
        console.log(data)
    }
    return (
        <div className="w-full md:max-w-lg bg-[#1D1F2C] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-8 text-white">Enter your new password</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="newPassword"
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">New Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="***************"
                                            className="bg-[#161721] border-none text-white pl-4 pr-10 h-12 placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="***************"
                                            className="bg-[#161721] border-none text-white pl-4 pr-10 h-12 placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full py-6 px-4 cursor-pointer bg-[#3762E4] text-white text-base font-semibold rounded-lg shadow-none hover:bg-[#2C47C7]" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="animate-spin" /> Loading...</> : 'Reset Password'}
                    </Button>

                    <div className='flex justify-center items-center'>
                        <Link href="/login" className='text-gray-300 text-sm underline'>Return to login</Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}
