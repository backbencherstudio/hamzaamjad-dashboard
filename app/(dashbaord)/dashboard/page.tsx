import React from 'react'
import OverviewCard from '../_components/Admin/OverviewCard'
import NewPilotUser from '../_components/Admin/NewPilotUser'
import NewMemberships from '../_components/Admin/NewMemberships'
import NewInstructor from '../_components/Admin/NewInstructor'
import { DashboardProvider } from '@/hooks/useDashboard'


export default function AdminDashboard() {
    return (
        <DashboardProvider>
        <div className='space-y-5'>
            <OverviewCard />
            <NewMemberships />
                <NewPilotUser />
                <NewInstructor />
            </div>
        </DashboardProvider>

    )
}
