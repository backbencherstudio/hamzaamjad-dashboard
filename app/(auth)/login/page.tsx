
import React from 'react'
import AirIcon from '../_components/Icon/AirIcon'
import topImg from '@/public/Image/login/top.png'
import bottomImg from '@/public/Image/login/bottom.png'
import middleImg from '@/public/Image/login/middle.png'
import circleImg from '@/public/Image/login/circle.png'
import Image from 'next/image'
import LoginAuth from '../_components/Login/LoginAuth'

export default function LoginPage() {


    return (
        <div style={{ background: 'linear-gradient(180deg, #121A35 0%, #09090B 100%)', height: '100vh' }}>
            <div className='flex flex-col md:flex-row items-center  gap-10 justify-center h-screen p-5'>
                {/* left side  */}
                <div className='w-full h-full md:w-1/2 relative bg-[#070707] rounded-lg flex items-center justify-center p-10' style={{ border: '1px solid rgba(255, 255, 255, 0.09)' }}>
                    <Image src={topImg} alt='top' className='absolute top-0 left-0 rounded-lg ' />
                    <Image src={middleImg} alt='top' className='absolute top-0 left-0 rounded-lg ' />
                    <Image src={bottomImg} alt='top' className='absolute top-10 left-0 rounded-lg' />
                    <Image src={circleImg} alt='top' className='absolute bottom-0 right-0 rounded-lg' />
                    <AirIcon />
                </div>
                {/* right side  */}
                <div className='w-full md:w-1/2 flex items-center justify-center '>
                    <LoginAuth />
                </div>
            </div>
        </div>
    )
} 
