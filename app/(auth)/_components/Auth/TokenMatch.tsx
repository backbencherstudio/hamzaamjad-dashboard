'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Key, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { verifyTokenApi, resendTokenApi } from '@/apis/authApis'
import NewPassword from './NewPassword'

interface TokenMatchProps {
  email: string;
  initialOtpExpiry?: string;
}

export default function TokenMatch({ email, initialOtpExpiry }: TokenMatchProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [verifiedToken, setVerifiedToken] = React.useState('')
  const [otpExpiry, setOtpExpiry] = React.useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = React.useState<string>('')
  const [canResend, setCanResend] = React.useState(false)

  // Countdown timer effect
  React.useEffect(() => {
    if (!otpExpiry) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiryTime = new Date(otpExpiry).getTime()
      const difference = expiryTime - now

      if (difference <= 0) {
        setTimeLeft('Expired')
        setCanResend(true)
        clearInterval(timer)
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
        setCanResend(false)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [otpExpiry])

  const form = useForm({
    defaultValues: {
      otp: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
    //   console.log('Sending OTP verification:', { email, otp: data.otp })
      
      const response = await verifyTokenApi({ 
        email: email,
        otp: data.otp 
      })
      
    //   console.log('OTP verification response:', response)
      
      // If no error is thrown, the OTP is verified successfully
      setVerifiedToken(data.otp)
      setShowNewPassword(true)
      toast.success(response.message || 'OTP verified successfully!')
    } catch (error: any) {
    //   console.error('OTP verification error:', error)
      toast.error(error.message || 'Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      setIsResending(true)
      const response = await resendTokenApi({ email: email })
      
      if (response.success) {
        // Set new expiry time
        if (response.otpExpiry) {
          setOtpExpiry(new Date(response.otpExpiry))
        }
        setCanResend(false)
        toast.success(response.message || 'OTP resent successfully!')
      } else {
        toast.error(response.message || 'Failed to resend OTP')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

  // Set initial expiry time when component mounts
  React.useEffect(() => {
    if (initialOtpExpiry) {
      setOtpExpiry(new Date(initialOtpExpiry))
    } else {
      // Set a default expiry time of 5 minutes from now
      const defaultExpiry = new Date(Date.now() + 5 * 60 * 1000)
      setOtpExpiry(defaultExpiry)
    }
  }, [initialOtpExpiry])

  console.log('TokenMatch render - showNewPassword:', showNewPassword, 'verifiedToken:', verifiedToken)
  
  if (showNewPassword) {
    return <NewPassword email={email} token={verifiedToken} />
  }

  return (
    <div className="w-full md:max-w-lg bg-[#1D1F2C] rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-2">Verify OTP</h2>
      <p className='text-gray-300 mb-8 text-sm'>Enter the verification code sent to <span className="text-white font-medium">{email}</span></p>
      
      {/* OTP Expiry Timer */}
      {otpExpiry && (
        <div className="mb-6 p-3 bg-[#161721] rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-sm">OTP expires in:</span>
            </div>
            <span className={`text-sm font-mono ${timeLeft === 'Expired' ? 'text-red-400' : 'text-green-400'}`}>
              {timeLeft}
            </span>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            rules={{ required: 'OTP is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">OTP Code</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="bg-[#161721] border-none text-white pl-4 pr-10 h-12 placeholder:text-gray-400"
                      maxLength={6}
                    />
                  </FormControl>
                  <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-white" size={20} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-6 px-4 cursor-pointer bg-[#3762E4] text-white text-base font-semibold rounded-lg shadow-none hover:bg-[#2C47C7]" disabled={isLoading}>
            {isLoading ? <><Loader2 className="animate-spin" /> Loading...</> : 'Verify OTP'}
          </Button>

          <div className='flex flex-col gap-4 items-center'>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || !canResend}
              className={`text-sm underline flex items-center gap-1 ${
                canResend 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-gray-500 cursor-not-allowed'
              } disabled:opacity-50`}
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Resending...
                </>
              ) : (
                'Resend OTP'
              )}
            </button>
            <Link href="/login" className='text-gray-300 text-sm underline flex items-center gap-1'>
              <ArrowLeft size={16} />
              Return to login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
