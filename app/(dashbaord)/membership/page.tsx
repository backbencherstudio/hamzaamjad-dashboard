import { MembershipProvider } from '@/hooks/useMembership'
import React from 'react'
import MembershipPage from '../_components/Admin/MemeberShip/MemberShip'

export default function Membership() {
    return (
        <MembershipProvider>
            <MembershipPage />
        </MembershipProvider>
    )
}
