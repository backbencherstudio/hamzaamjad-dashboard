"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { passwordUpdateApi } from '@/apis/authApis'

interface PasswordFormData {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

const PasswordInput = ({
    id,
    label,
    placeholder,
    showPassword,
    onTogglePassword,
    register,
    errors,
    validation
}: {
    id: string
    label: string
    placeholder: string
    showPassword: boolean
    onTogglePassword: () => void
    register: any
    errors: any
    validation: any
}) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-white">{label}</Label>
        <div className="relative">
            <Input
                id={id}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="text-white py-5 bg-[#161721]"
                {...register(id, validation)}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={onTogglePassword}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                )}
            </Button>
        </div>
        {errors[id] && (
            <p className="text-sm text-red-500">{errors[id].message}</p>
        )}
    </div>
)

export default function UpdatePassword() {
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const passwordForm = useForm<PasswordFormData>({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const passwordValidation = {
        required: "This field is required"
    }

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setApiError(null)
        setSuccessMessage(null)

        if (data.newPassword !== data.confirmPassword) {
            passwordForm.setError("confirmPassword", {
                type: "manual",
                message: "Passwords don't match"
            })
            return
        }

        setIsLoading(true)

        try {
            const apiData = {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            }
            const response = await passwordUpdateApi(apiData)

            setSuccessMessage("Password updated successfully!")
            passwordForm.reset()

            setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)

        } catch (error: any) {
            setApiError(error.message || "Failed to update password. Please try again.")

            setTimeout(() => {
                setApiError(null)
            }, 1000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="shadow-sm border-none">
            <CardHeader className="bg-[#23293D] text-white rounded-t-lg p-5">
                <CardTitle className="text-2xl">Password</CardTitle>
            </CardHeader>
            <CardContent className="p-6 mt-[-25px] rounded-b-lg bg-[#1D1F2C] text-white">
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 text-sm">{successMessage}</p>
                    </div>
                )}

                {apiError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{apiError}</p>
                    </div>
                )}

                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <PasswordInput
                        id="oldPassword"
                        label="Old Password"
                        placeholder="Enter your old password"
                        showPassword={showOldPassword}
                        onTogglePassword={() => setShowOldPassword(!showOldPassword)}
                        register={passwordForm.register}
                        errors={passwordForm.formState.errors}
                        validation={passwordValidation}
                    />

                    <PasswordInput
                        id="newPassword"
                        label="New Password"
                        placeholder="New Password"
                        showPassword={showNewPassword}
                        onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                        register={passwordForm.register}
                        errors={passwordForm.formState.errors}
                        validation={passwordValidation}
                    />

                    <PasswordInput
                        id="confirmPassword"
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        showPassword={showConfirmPassword}
                        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        register={passwordForm.register}
                        errors={passwordForm.formState.errors}
                        validation={passwordValidation}
                    />

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer py-5 transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Updating Password..." : "Save Change"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
