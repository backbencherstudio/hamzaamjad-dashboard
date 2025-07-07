"use client"
import React, { useState, useRef } from 'react'
import { useForm } from "react-hook-form"
import { Edit2, User, Lock, ImageDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UpdatePassword from '../_components/Admin/Profile/UpdatePassword'
import { useAuth } from '@/hooks/useAuth'
import { updateUserApi } from '@/apis/authApis'

// Types
interface ProfileFormData {
    name: string
    email: string
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
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#1D1F2C] rounded-full flex items-center justify-center text-white hover:bg-[#1D1F2C]/80 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6 6M9 13l-6 6m6-6l6-6" /></svg>
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
                <Edit2 className="h-4 w-4 text-gray-500" />
            </Button>
        </div>
        {errors[id] && (
            <p className="text-sm text-red-500">{errors[id].message}</p>
        )}
    </div>
)



const TabButton = ({
    isActive,
    onClick,
    icon: Icon,
    children
}: {
    isActive: boolean
    onClick: () => void
    icon: React.ComponentType<any>
    children: React.ReactNode
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 text-sm lg:text-base cursor-pointer p-3 rounded-lg text-left transition-all ${isActive
            ? 'bg-[#3762E4] text-white'
            : 'text-white hover:bg-[#3762E4]/80'
            }`}
    >
        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-white'
            }`} />
        {children}
    </button>
)

// Main Component
export default function AdminProfile() {
    // State
    const [activeTab, setActiveTab] = useState('profile')
    const [editingField, setEditingField] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Auth user
    const { user, refreshUser } = useAuth();

    // Profile image state: default to user.image, fallback to placeholder
    const [profileImage, setProfileImage] = useState<string>(user?.image || "/api/placeholder/96/96");
    const [compressedImageBlob, setCompressedImageBlob] = useState<Blob | null>(null);

    // Forms
    const profileForm = useForm<ProfileFormData>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    // Update form values if user changes (e.g. after login)
    React.useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name || '',
                email: user.email || '',
            });
            setProfileImage(user.image || "/api/placeholder/96/96");
        }
    }, [user]);

    // Handlers
    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCompressedImageBlob(file); // store the original file
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string); // preview
            };
            reader.readAsDataURL(file);
        }
    };

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
        try {
            let payload: any = { name: data.name };
            let isMultipart = false;
            let formData: FormData | null = null;
            if (compressedImageBlob) {
                formData = new FormData();
                formData.append('name', data.name);
                formData.append('image', compressedImageBlob);
                isMultipart = true;
            }
            if (isMultipart && formData) {
                await updateUserApi(formData);
            } else {
                await updateUserApi(payload);
            }
            await refreshUser();
            setCompressedImageBlob(null);
            alert('Profile updated successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to update profile');
        }
    };



    // Validation rules
    const profileValidation = {
        name: {
            required: "Name is required",
            minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
            }
        },
        email: {
            required: "Email is required",
            pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address"
            }
        }
    }



    return (
        <div className="">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64">
                    <Card className="shadow-sm border-none">
                        <CardContent className="p-4 bg-[#1D1F2C] text-white rounded-lg">
                            <div className="space-y-2 flex flex-row lg:flex-col gap-2">
                                <TabButton
                                    isActive={activeTab === 'profile'}
                                    onClick={() => setActiveTab('profile')}
                                    icon={User}
                                >
                                    My Profile
                                </TabButton>
                                <TabButton
                                    isActive={activeTab === 'password'}
                                    onClick={() => setActiveTab('password')}
                                    icon={Lock}
                                >
                                    Password
                                </TabButton>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <Card className="shadow-sm border-none">
                            <CardHeader className="bg-[#23293D] text-white rounded-t-lg p-5">
                                <CardTitle className="text-2xl">My Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 mt-[-25px] rounded-b-lg bg-[#1D1F2C] text-white">
                                {/* Image upload (optional, keep for preview) */}
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
                                    {/* Read-only Email Field */}
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
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                                Read Only
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full cursor-pointer py-5 transition-all duration-300 bg-[#3762E4] hover:bg-[#3762E4]/80 text-white rounded-lg"
                                    >
                                        Save Change
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'password' && (
                        <UpdatePassword />
                    )}
                </div>
            </div>
        </div>
    )
}
