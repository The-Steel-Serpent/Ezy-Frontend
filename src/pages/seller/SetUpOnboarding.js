import React, { useState } from 'react'
import logo from '../../assets/onboarding-setup.png'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const SetUpOnboarding = () => {
    const navigate = useNavigate();
    const handleStart = () => {
        navigate('/seller/seller-setup');
    }

    
    return (
        <div className='mx-auto w-[80%] h-[500px] bg-white pt-[35px] flex flex-col gap-3'>
            <img
                src={logo}
                alt='logo'
                className='w-[200px] h-[200px] mx-auto' />
            <div className='flex items-center'>
                <h5 className='text-lg mx-auto'>Chào mừng đến với Ezy!</h5>
            </div>
            <div className='flex items-center'>
                <p className='text-sm mx-auto'>Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Ezy</p>
            </div>
            <div className='flex items-center'>
                <Button
                    onClick={handleStart}
                    className='text-lg mx-auto bg-primary text-white'
                >Bắt đầu đăng ký</Button>
            </div>
        </div>
    )
}

export default SetUpOnboarding