"use client"
import React, { useState, useRef } from 'react'
import { useForm } from "react-hook-form"
import { Loader2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from '@/hooks/useAuth'
import { sendChangeEmailOtpApi, verifyChangeEmailOtpApi } from '@/apis/authApis'
import { toast } from 'react-toastify'

// Types
interface EmailChangeFormData {
    email: string
}

interface OtpFormData {
    email: string
    otp: string
}

const OtpInput = ({ 
    value, 
    onChange, 
    error 
}: { 
    value: string
    onChange: (value: string) => void
    error?: string 
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    
    const handleChange = (index: number, digit: string) => {
        if (digit.length > 1) return 
        
        const newValue = value.split('')
        newValue[index] = digit
        const newOtp = newValue.join('')
        onChange(newOtp)
        if (digit && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }
    
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }
    
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 4)
        if (/^\d{4}$/.test(pastedData)) {
            onChange(pastedData)
        }
    }
    
    return (
        <div className="space-y-2">
            <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3].map((index) => (
                    <Input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el
                        }}
                        type="text"
                        maxLength={1}
                        value={value[index] || ''}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-14 h-14 text-center text-xl font-semibold bg-[#161721] text-white border-2 focus:border-[#3762E4] focus:ring-0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                ))}
            </div>
            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    )
}

const EmailChangeModal = ({ 
    isOpen, 
    onClose, 
    currentEmail,
    refreshUser
}: { 
    isOpen: boolean
    onClose: () => void
    currentEmail: string
    refreshUser: () => Promise<void>
}) => {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const emailForm = useForm<EmailChangeFormData>()
    const otpForm = useForm<OtpFormData>({
        defaultValues: {
            email: '',
            otp: ''
        }
    })
    
    const handleSendOtp = async (data: EmailChangeFormData) => {
        setIsLoading(true)
        try {
            await sendChangeEmailOtpApi({ email: data.email })
            setEmail(data.email)
            setStep('otp')
            toast.success('OTP sent to your email!')
        } catch (err: any) {
            toast.error(err.message || 'Failed to send OTP')
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleVerifyOtp = async (data: OtpFormData) => {
        setIsLoading(true)
        try {
            const res = await verifyChangeEmailOtpApi({ email: email, otp: data.otp })
            toast.success(res.message)
            await refreshUser()
            onClose()
            setStep('email')
            setEmail('')
            emailForm.reset()
            otpForm.reset()
        } catch (err: any) {
            toast.error(err.message || 'Failed to verify OTP')
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleClose = () => {
        onClose()
        setStep('email')
        setEmail('')
        emailForm.reset()
        otpForm.reset()
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#1D1F2C] text-white border-[#23293D]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {step === 'email' ? 'Change Email Address' : 'Verify OTP'}
                    </DialogTitle>
                </DialogHeader>
                
                {step === 'email' ? (
                    <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-white">Current Email</Label>
                            <Input 
                                value={currentEmail} 
                                disabled 
                                className="bg-[#161721] text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">New Email Address</Label>
                            <Input
                                {...emailForm.register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                placeholder="Enter new email address"
                                className="bg-[#161721] text-white"
                            />
                            {emailForm.formState.errors.email && (
                                <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClose}
                                className="flex-1 border cursor-pointer transition-all duration-300 "
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-[#3762E4] hover:bg-[#3762E4]/80 cursor-pointer transition-all duration-300"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Sending...
                                    </span>
                                ) : (
                                    'Send OTP'
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const otpValue = otpForm.watch('otp')
                        if (!otpValue || otpValue.length !== 4) {
                            otpForm.setError('otp', { message: 'Please enter a 4-digit OTP' })
                            return
                        }
                        handleVerifyOtp({ email: email, otp: otpValue })
                    }} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-white">OTP Code</Label>
                            <OtpInput
                                value={otpForm.watch('otp') || ''}
                                onChange={(value) => otpForm.setValue('otp', value)}
                                error={otpForm.formState.errors.otp?.message}
                            />
                        </div>
                        <p className="text-sm text-gray-400">
                            We've sent a verification code to <span className="text-white">{email}</span>
                        </p>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep('email')}
                                className="flex-1 border cursor-pointer transition-all duration-300"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-[#3762E4] hover:bg-[#3762E4]/80 cursor-pointer transition-all duration-300"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify OTP'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

interface ChangeEmailProps {
    isOpen: boolean
    onClose: () => void
}

export default function ChangeEmail({ isOpen, onClose }: ChangeEmailProps) {
    const { user, refreshUser } = useAuth()

    return (
        <EmailChangeModal 
            isOpen={isOpen}
            onClose={onClose}
            currentEmail={user?.email || ''}
            refreshUser={refreshUser}
        />
    )
}
