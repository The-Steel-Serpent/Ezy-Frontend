import React from 'react';
import logo from '../../assets/image (1) (2).png';
import { Layout } from 'antd';
import "../../styles/admin.css";

import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const AuthenticationLayout = ({ children }) => {

    const navigate = useNavigate();

    return (
        <>
            <Layout>
                <header className='bg-primary w-full flex items-center lg:px-20 custom-header'>
                    <div className='flex py-2 items-center gap-2'>
                        <img
                            src={logo}
                            alt='logo'
                            className='w-24 lg:w-28'
                        />
                        <div className='text-sm lg:text-[26px] mt-2 text-white flex justify-center'>
                            <a 
                            className='hover:text-white flex mb-2'
                            href='/seller'>Kênh quản trị</a>
                        </div>
                    </div>
                </header>
                <Layout className='h-full'>
                    <Content className='min-h-64'>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default AuthenticationLayout;