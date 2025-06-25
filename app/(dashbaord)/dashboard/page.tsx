import React from 'react'
import OverviewCard from '../_components/Admin/OverviewCard'
import NewPilotUser from '../_components/Admin/NewPilotUser'
import NewMemberships from '../_components/Admin/NewMemberships'
import NewInstructor from '../_components/Admin/NewInstructor'

export default function AdminDashboard() {
    return (
        <div className='space-y-5'>
            <OverviewCard />
            <NewMemberships />
            <NewPilotUser />
            <NewInstructor />
        </div>
    )
}
