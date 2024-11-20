import React, { useEffect, useState } from 'react'
import logo from '../assets/image (1) (2).png'
import { Layout } from 'antd';
import "../styles/seller.css"

import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';


const { Content } = Layout;

const AuthenticationLayout = ({ children }) => {

    const navigate = useNavigate();

    return (
        <>
            <Layout className='h-full'>
                <header className='bg-primary w-full flex items-center lg:px-20 custom-header'>
                    <div className='flex py-2 items-center gap-2'>
                        <a href='/seller'>
                            <img
                                src={logo}
                                alt='logo'
                                className='w-24 lg:w-28'
                            />
                        </a>
                        <div className='text-sm lg:text-[26px] mt-2 text-white flex justify-center'>
                            <a
                                className='hover:text-white flex mb-2'
                                href='/seller'>Kênh người bán</a>
                        </div>
                    </div>
                </header>
                <Layout className='h-full'>
                    <Content className='min-h-64'>
                        {children}
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </>
    )
}

export default AuthenticationLayout