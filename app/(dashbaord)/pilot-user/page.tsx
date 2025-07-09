import React from 'react'
import PilotUserPage from '../_components/Admin/PilotUser/PilotUser'
import { PilotUsersProvider } from '@/hooks/PilotUsers'

export default function PilotUser() {
    return (
        <PilotUsersProvider>
            <PilotUserPage />
        </PilotUsersProvider>
    )
}
