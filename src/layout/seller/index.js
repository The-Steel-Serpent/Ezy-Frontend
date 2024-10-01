import React, { useEffect, useState } from 'react'
import logo from '../../assets/image (1) (2).png'
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GoBook } from "react-icons/go";
import { VscBell } from "react-icons/vsc";
import { Divider, Menu, Button, theme, Layout, Dropdown, Space, message } from 'antd';
import { TfiWallet } from "react-icons/tfi";
import { BsShopWindow } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { authFirebase } from '../../firebase/firebase';
import { CiShop } from "react-icons/ci";
import { SlLogout } from "react-icons/sl"; 
import { AiOutlineProfile } from "react-icons/ai";
import "../../styles/seller.css"

import {
    AppstoreOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';


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

const items_info = [
    {
        key: 'profile_shop',
        label: 'Hồ sơ Shop',
        icon: <AiOutlineProfile size={20} className='mr-3' />,
    },
    {
        key: 'setting_shop',
        label: 'Thiết lập Shop',
        icon: <CiShop size={20} className='mr-3' />,
    },
    {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <SlLogout size={18} className='mr-3' />,
    }
];
const SellerAuthLayout = ({ children }) => {
    const [current, setCurrent] = useState('1');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const location = useLocation();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        // console.log('click ', e.key);
        setCurrent(e.key);
        if (e.key)
            navigate(e.key)
    };



    const handleLogout = () => {
        signOut(authFirebase)
        .then(() => {
            setUser(null);
            message.success("Đăng xuất thành công");
        })
        .catch((error) => {
            message.error('Error signing out:',error)
        })
    }

    const handleDropDownProfileClick = (e) => {
        console.log("key", e.key);
        if (e.key == 'logout')
            handleLogout();
    }


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
    }, [windowWidth])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authFirebase, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                console.log(currentUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const isSellerSetupPath = location.pathname === '/seller/seller-setup';
    const isSellerSetupOnBoardingPath = location.pathname === '/seller/seller-setup-onboarding';

    return (
        <>
            <Layout>
                <header className='bg-primary w-full h-[60px] flex justify-between items-center custom-header sticky-header'>
                    <div className='flex px-4 py-2 items-center gap-2'>
                        <img
                            src={logo}
                            alt='logo'
                            width={100}
                        />
                        <div className='text-lg mt-2 text-white'>
                            <a href='/seller' className='hover:text-slate-200'>Kênh người bán</a>
                        </div>
                    </div>
                    <div className='flex mx-10 items-center h-full'>
                        <div className='text-slate-600 hover:bg-[#8ad3e5] py-4 px-3 hidden lg:block'>
                            <HiOutlineSquares2X2
                                color='white'
                                size={25}
                            />
                        </div>
                        <div className='text-slate-600 hover:bg-[#8ad3e5] py-4 px-3 hidden lg:block'>
                            <GoBook
                                color='white'
                                size={25}
                            />
                        </div>
                        <div className='text-slate-600 hover:bg-[#8ad3e5] py-4 px-3 hidden lg:block'>
                            <VscBell
                                color='white'
                                size={25}
                            />
                        </div>
                        <Divider type="vertical" variant="dotted" style={{ height: 30 }} />
                        <div className='flex h-full items-center text-slate-600 gap-3 hover:bg-[#8ad3e5] py-4 px-3'>
                            <Dropdown
                                menu={
                                    {
                                        items: items_info,
                                        onClick: handleDropDownProfileClick
                                    }
                                }

                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space className='bg-transparent'>
                                        <FaUserCircle size={20} className='text-white' />
                                        <span className='text-white text-[15px]'>{user ? user.email.split("@gmail.com") : "dit me m"}</span>
                                        <DownOutlined size={20} className='text-white' />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <Layout className='h-full'>
                    {!isSellerSetupPath && !isSellerSetupOnBoardingPath && (
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
                    )}
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