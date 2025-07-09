import React from 'react'
import InstructorPage from '../_components/Admin/Instructor/InstructorPage'
import { InstructorProvider } from '@/hooks/InstructorContext'

export default function Instructor() {
    return (
        <InstructorProvider>
            <InstructorPage />
        </InstructorProvider>
    )
}
