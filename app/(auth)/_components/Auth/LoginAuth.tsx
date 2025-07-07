'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginAuth() {
    const [showPassword, setShowPassword] = React.useState(false)
    const { login, isLoading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onTouched',
    })

    // Check for error parameter in URL
    React.useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'access_denied') {
            toast.error('Access denied. Admin privileges required.')
        }
    }, [searchParams])

    const onSubmit = async (data: any) => {
        const result = await login(data.email, data.password)
        
        if (result.success) {
            toast.success(result.message)
            router.push('/dashboard')
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="w-full md:max-w-lg bg-[#1D1F2C] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-8 text-white">Admin Login</h2>
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
                    <FormField
                        control={form.control}
                        name="password"
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Password</FormLabel>
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
                    <div className="flex justify-end -mt-2">
                        <Link href="/forgot-password" className="text-xs text-gray-300 underline">Forgot Password ?</Link>
                    </div>

                    <Button type="submit" className="w-full py-6 px-4 cursor-pointer bg-[#3762E4] text-white text-base font-semibold rounded-lg shadow-none hover:bg-[#2C47C7]" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="animate-spin" /> Loading...</> : 'Continue'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
