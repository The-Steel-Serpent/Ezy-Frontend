import React, { useState } from 'react'
import logo from '../../assets/orange-logo.png'
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GoBook } from "react-icons/go";
import { VscBell } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Layout } from 'antd';
import { Divider, Menu, Button, theme } from 'antd';

import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const { Header, Content, Sider } = Layout;

const items = [
    {
        key: 'sub1',
        label: 'Quản lý đơn hàng',
        icon: <MailOutlined />,
        children: [
            {
                key: '/seller/order/all',
                label: 'Tất cả',
            },
            {
                key: '/seller/order/ordercancelled',
                label: 'Đơn hủy',
            },
        ],
    },
    {
        key: 'sub2',
        label: 'Quản lý sản phẩm',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: '5',
                label: 'Option 5',
            },
            {
                key: '6',
                label: 'Option 6',
            },
            {
                key: 'sub3',
                label: 'Submenu',
                children: [
                    {
                        key: '7',
                        label: 'Option 7',
                    },
                    {
                        key: '8',
                        label: 'Option 8',
                    },
                ],
            },
        ],
    },
    {
        key: 'sub3',
        label: 'Navigation Three',
        icon: <SettingOutlined />,
        children: [
            {
                key: '9',
                label: 'Option 9',
            },
            {
                key: '10',
                label: 'Option 10',
            },
            {
                key: '11',
                label: 'Option 11',
            },
            {
                key: '12',
                label: 'Option 12',
            },
        ],
    },
];
const SellerAuthLayout = ({ children }) => {
    const [current, setCurrent] = useState('1');
    const navigate = useNavigate();
    const handleNavigation = (e) => {
        console.log('click ', e.key);
        setCurrent(e.key);
        if(e.key)
            navigate(e.key)
    };
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <>
            <Layout>
                <header className='bg-white w-full flex justify-between items-center'>
                    <div className='flex px-4 py-2 items-center gap-2'>
                        <img
                            src={logo}
                            alt='logo'
                            width={100}
                        />
                        <div className='text-lg mt-2'>
                            <a href='/seller'>Kênh người bán</a>
                        </div>
                    </div>
                    <div className='flex mx-10 items-center h-full'>
                        <div className='text-slate-600 hover:bg-slate-300 py-4 px-3 hidden lg:block'>
                            <HiOutlineSquares2X2
                                size={25}
                            />
                        </div>
                        <div className='text-slate-600 hover:bg-slate-300 py-4 px-3 hidden lg:block'>
                            <GoBook
                                size={25}
                            />
                        </div>
                        <div className='text-slate-600 hover:bg-slate-300 py-4 px-3 hidden lg:block'>
                            <VscBell
                                size={25}
                            />
                        </div>
                        <Divider type="vertical" variant="dotted" style={{ height: 30 }} />
                        <div className='flex h-full items-center text-slate-600 gap-3 hover:bg-slate-300 py-4 px-3'>
                            <FaUserCircle size={25} />
                            <div className='text-[15px]'>boquangdieu2003</div>
                            <FaChevronDown size={12} />
                        </div>
                    </div>
                </header>
                <Layout className='h-full'>
                    <Sider trigger={null} collapsible collapsed={collapsed} className='bg-white w-fit h-fit shadow-xl'>
                        <div className="demo-logo-vertical" />
                        <Menu
                            defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                            mode="inline"
                            theme="light"
                            items={items}
                            onClick={handleNavigation}
                            className='text-slate-500 lg:w-48'

                        />
                    </Sider>
                    <Layout className='h-full'>
                        <Header
                            style={{
                                padding: 0,
                                background: colorBgContainer,
                            }}
                            className='lg:hidden w-fit bg-opacity-100 rounded'
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Header>
                        <Content className='min-h-72 ml-8 mt-3'>
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default SellerAuthLayout