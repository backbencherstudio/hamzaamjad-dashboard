"use client"
import React, { useState } from 'react'
import CardLayerImg from '@/public/Image/CardLayer.png'
import Image from 'next/image';

export default function OverviewCard() {
    const data = [
        {
            title: 'Total Pilot User',
            value: 0,
        },
        {
            title: 'Total Instructor ',
            value: 0,
        },
        {
            title: 'Total Membership ',
            value: 0,
        }
    ]
    const [filter, setFilter] = useState('Month');
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className='text-2xl font-semibold mb-5 text-white'>Overview</h1>
                {/* dropd down filter  month and 7 days and 15 days */}
                <select
                    className="bg-[#181E34] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="Month">Month</option>
                    <option value="7 days">7 days</option>
                    <option value="15 days">15 days</option>
                </select>
            </div>
            {/* card */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {data.map((item, index) => (
                    <div key={index} className='bg-[#23293D] relative text-white px-6 py-6 rounded-lg shadow-sm flex flex-col gap-3' style={{ boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.25)' }}>
                        <div className='absolute top-0 right-0 w-48 h-full'>
                            <Image width={100} height={100} src={CardLayerImg} alt='card layer' className='w-full h-full rounded-lg' />
                        </div>
                        <h3 className='text-md '>{item.title}</h3>
                        <p className='text-2xl font-bold mt-5 '>{item.value}</p>
                    </div>
                ))}
            </div>
        </>
    )
}
