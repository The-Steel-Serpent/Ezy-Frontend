import React, { useEffect, useState } from 'react'
import logo from '../../assets/orange-logo.png'
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GoBook } from "react-icons/go";
import { VscBell } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Layout } from 'antd';
import { Divider, Menu, Button, theme } from 'antd';
import { TfiWallet } from "react-icons/tfi";
import { BsShopWindow } from "react-icons/bs";

import "../../styles/seller.css"

import {
    AppstoreOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const { Header, Content, Sider } = Layout;

const items = [
    {
        key: 'sub1',
        label: 'Quản Lý Đơn Hàng',
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
        label: 'Quản Lý Sản Phẩm',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: '/seller/product-management/all',
                label: 'Tất cả sản phẩm',
            },
            {
                key: '/seller/product-management/add-product',
                label: 'Thêm sản phẩm',
            },
        ],
    },
    {
        key: 'sub3',
        label: 'Tài Chính',
        icon: <TfiWallet />,
        children: [
            {
                key: '9',
                label: 'Doanh thu',
            },
            {
                key: '10',
                label: 'Số dư TK Shopee',
            },
            {
                key: '11',
                label: 'Tài khoản ngân hàng',
            },
        ],
    },
    {
        key: 'sub4',
        label: 'Quản Lý Shop',
        icon: <BsShopWindow />,
        children: [
            {
                key: '9',
                label: 'Doanh thu',
            },
            {
                key: '10',
                label: 'Số dư TK Shopee',
            },
            {
                key: '11',
                label: 'Tài khoản ngân hàng',
            },
        ],
    },
];
const SellerAuthLayout = ({ children }) => {
    const [current, setCurrent] = useState('1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const navigate = useNavigate();
    const handleNavigate = (e) => {
        // console.log('click ', e.key);
        setCurrent(e.key);
        if (e.key)
            navigate(e.key)
    };
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    useEffect(() => {
        // update window width
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        // listen event when window width change
        window.addEventListener('resize', handleResize);
        // Cleanup when component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        setCollapsed(false)
        // console.log(windowWidth)
    }, [windowWidth])
    return (
        <>
            <Layout>
                <header className='bg-white w-full h-[60px] flex justify-between items-center custom-header sticky-header'>
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
                    <Sider trigger={null} collapsible collapsed={collapsed} className='bg-white w-fit h-full shadow-xl sticky-sider'>
                        <div className="demo-logo-vertical" />
                        <Menu
                            defaultOpenKeys={['sub1', 'sub2', 'sub3', 'sub4']}
                            mode="inline"
                            theme="light"
                            items={items}
                            onClick={handleNavigate}
                            className='custom-menu text-slate-500 font-[400] lg:w-48 '
                        />
                    </Sider>
                    <Layout className='layout-full-height'>
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
                        <Content className='min-h-72 mx-8 mt-3'>
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default SellerAuthLayout