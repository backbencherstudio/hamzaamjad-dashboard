"use client"
import React, { useState, useRef } from 'react'
import { useForm } from "react-hook-form"
import { Loader2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { updateUserApi } from '@/apis/authApis'
import { toast } from 'react-toastify'
import { LuImagePlus } from "react-icons/lu"
import ChangeEmail from './ChangeEmail'

// Types
interface ProfileFormData {
    name: string
}

interface EditableInputProps {
    id: string
    label: string
    type?: string
    placeholder: string
    editingField: string | null
    onEditClick: (fieldName: string) => void
    onBlur: () => void
    register: any
    errors: any
    validation: any
}

// Components
const ProfileImageUpload = ({
    profileImage,
    onImageClick,
    onImageChange,
    fileInputRef
}: {
    profileImage: string
    onImageClick: () => void
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    fileInputRef: React.RefObject<HTMLInputElement>
}) => (
    <div className="flex justify-center mb-8">
        <div className="relative">
            <div className="cursor-pointer" onClick={onImageClick}>
                <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-[#1D1F2C]/80 transition-colors">
                    <LuImagePlus />
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onImageChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    </div>
)

const EditableInput = ({
    id,
    label,
    type = "text",
    placeholder,
    editingField,
    onEditClick,
    onBlur,
    register,
    errors,
    validation
}: EditableInputProps) => (
    <div className="space-y-2">
        <Label className='text-white' htmlFor={id}>{label}</Label>
        <div className="relative">
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                disabled={editingField !== id}
                onBlur={onBlur}
                className={`text-white py-5 ${editingField !== id ? 'bg-[#161721] cursor-not-allowed' : 'bg-[#161721] text-white'}`}
                {...register(id, validation)}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditClick(id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            >
                <Edit2 className="h-4 w-4 text-gray-500 cursor-pointer" />
            </Button>
        </div>
        {errors[id] && (
            <p className="text-sm text-red-500">{errors[id].message}</p>
        )}
    </div>
)

export default function MyProfile() {
    // State
    const [editingField, setEditingField] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Auth user
    const { user, refreshUser } = useAuth()

    // Profile image state: default to user.image, fallback to placeholder
    const [profileImage, setProfileImage] = useState<string>(user?.image || "/api/placeholder/96/96")
    const [compressedImageBlob, setCompressedImageBlob] = useState<Blob | null>(null)

    // Forms
    const profileForm = useForm<ProfileFormData>({
        defaultValues: {
            name: user?.name || '',
        },
    })

    React.useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name || '',
            })
            setProfileImage(user.image || "/api/placeholder/96/96")
            setHasChanges(false)
        }
    }, [user])

    // Check for changes
    React.useEffect(() => {
        const currentName = profileForm.watch('name')
        const originalName = user?.name || ''
        const nameChanged = currentName !== originalName
        const imageChanged = !!compressedImageBlob

        setHasChanges(nameChanged || imageChanged)
    }, [profileForm.watch('name'), compressedImageBlob, user?.name])

    // Handlers
    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setCompressedImageBlob(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditClick = (fieldName: string) => {
        setEditingField(fieldName)
        setTimeout(() => {
            const element = document.getElementById(fieldName)
            if (element) {
                element.focus()
            }
        }, 100)
    }

    const handleFieldBlur = () => {
        setEditingField(null)
    }

    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsLoading(true)
        try {
            let payload: any = { name: data.name }
            let isMultipart = false
            let formData: FormData | null = null
            if (compressedImageBlob) {
                formData = new FormData()
                formData.append('name', data.name)
                formData.append('image', compressedImageBlob)
                isMultipart = true
            }
            if (isMultipart && formData) {
                await updateUserApi(formData)
            } else {
                await updateUserApi(payload)
            }
            await refreshUser()
            setCompressedImageBlob(null)
            setHasChanges(false)
            toast.success('Profile updated successfully!')
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    // Validation rules
    const profileValidation = {
        name: {
            required: "Name is required",
            minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
            }
        }
    }

    return (
        <>
            <Card className="shadow-sm border-none">
                <CardHeader className="bg-[#23293D] text-white rounded-t-lg p-5">
                    <CardTitle className="text-2xl">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-6 mt-[-25px] rounded-b-lg bg-[#1D1F2C] text-white">
                    {/* Image upload */}
                    <ProfileImageUpload
                        profileImage={profileImage}
                        onImageClick={handleImageClick}
                        onImageChange={handleImageChange}
                        fileInputRef={fileInputRef}
                    />
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <EditableInput
                            id="name"
                            label="Name"
                            placeholder="Enter your name"
                            editingField={editingField}
                            onEditClick={handleEditClick}
                            onBlur={handleFieldBlur}
                            register={profileForm.register}
                            errors={profileForm.formState.errors}
                            validation={profileValidation.name}
                        />
                        {/* Email Field with Edit Icon */}
                        <div className="space-y-2">
                            <Label className='text-white' htmlFor="email">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email || ''}
                                    disabled={true}
                                    className="text-white py-5 bg-[#161721] cursor-not-allowed opacity-60"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                                >
                                    <Edit2 className="h-4 w-4 text-gray-500 cursor-pointer" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-400">
                                Click the edit icon to change your email address
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className={`w-full py-5 transition-all duration-300 rounded-lg ${hasChanges
                                    ? 'bg-[#3762E4] hover:bg-[#3762E4]/80 text-white cursor-pointer'
                                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                }`}
                            disabled={isLoading || !hasChanges}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" /> Saving...
                                </span>
                            ) : (
                                hasChanges ? 'Save Changes' : 'No Changes to Save'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Email Change Modal */}
            <ChangeEmail
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
            />
        </>
    )
}
