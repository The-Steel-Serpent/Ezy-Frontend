import React, { useEffect, useReducer, useState } from 'react'
import logo from '../../assets/logo_ezy.png'
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { GoBook } from "react-icons/go";
import { VscBell } from "react-icons/vsc";
import { Divider, Menu, Button, theme, Layout, Dropdown, Space, message, Avatar } from 'antd';
import { TfiWallet } from "react-icons/tfi";
import { BsShopWindow } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import { SlLogout } from "react-icons/sl";
import { AiOutlineProfile } from "react-icons/ai";
import { logoutShop, setShop } from "../../redux/shopSlice";
import { logout, setUser, setToken } from "../../redux/userSlice";

import "../../styles/seller.css"

import {
    AppstoreOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';


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

const initialState = () => {
    return {
        user: {
            user_id: "",
            username: "",
            full_name: "",
            email: "",
            phone_number: "",
            setup: 0,
            avt_url: "",
        },
        authenticate: false,
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload }
        case 'SET_AUTHENTICATE':
            return { ...state, authenticate: action.payload }
        default:
            return state;
    }
}

const SellerAuthLayout = ({ children }) => {
    document.title = "Ezy - Seller";
    const [current, setCurrent] = useState('1');
    const [state, dispatchMain] = useReducer(reducer, initialState);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        // console.log('click ', e.key);
        setCurrent(e.key);
        if (e.key)
            navigate(e.key)
    };


    const dispatch = useDispatch();
    const dispatchShop = useDispatch();
    const user = useSelector((state) => state.user);
    const shop = useSelector((state) => state.shop);
    const token = localStorage.getItem("token");
    //
    const logOut = async () => {
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
            const res = await axios.post(
                URL,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                message.error("Tài khoản của bạn không phải là tài khoản cửa hàng");
                dispatch(logout());
                dispatch(logoutShop());
                localStorage.clear();
            }
        } catch (error) {
            if (error.response.data.code === "auth/id-token-expired") {
                message.error("Phiên Đăng nhập đã hết hạn");
            }
        }
    };

    const handleDropDownProfileClick = (e) => {
        console.log("key", e.key);
        if (e.key == 'logout') {
            logOut();
            message.success("Đăng xuất thành công");
            navigate("/seller/login");
        }
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
        console.log("Token: ", token);
        console.log("User: ", user);
        console.log("Shop: ", shop);

        const fetchUserData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/fetch_user_data`;
                const res = await axios.post(
                    url,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );

                if (res.status === 200) {
                    const user = res.data.user;
                    if (user.role_id === 2) {
                        dispatch(
                            setUser({
                                user_id: user.user_id,
                                username: user.username,
                                full_name: user.full_name,
                                email: user.email,
                                phone_number: user.phone_number,
                                gender: user.gender,
                                dob: user.dob,
                                avt_url: user.avt_url,
                                role_id: user.role_id,
                                setup: user.setup,
                                isVerified: user.isVerified,
                            })
                        );
                        dispatchMain({ type: 'SET_USER', payload: user });
                        dispatchMain({ type: 'SET_AUTHENTICATE', payload: true });
                        dispatch(setToken(token));
                    } else {
                        await logOut();
                    }
                } else {
                    console.log("Lỗi khi Fetch dữ liệu người dùng: ", res);
                }
            } catch (error) {
                console.log(
                    "Lỗi khi Fetch dữ liệu người dùng: ",
                    error.response.status
                );
                switch (error.response.status) {
                    case 500:
                        message.error("Phiên Đăng nhập đã hết hạn");
                        navigate("/seller/login");
                        break;
                    default:
                        break;
                }
                console.log("Lỗi khi Fetch dữ liệu người dùng: ", error);
            }
        };
        if (token && !user?.user_id) {
            fetchUserData();
            console.log("Fetch dữ liệu người dùng thành", user);

        } else {
            console.log("Token không tồn tại hoặc đã có dữ liệu");
            if (user.user_id == '') {
                navigate("/seller/login");
            }
        }
    }, [token]);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/get-shop`;
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { user_id: user.user_id },
                    withCredentials: true,
                });

                if (res.status === 200 && res.data.success) {
                    const shop = res.data.data;
                    console.log("Dữ liệu Shop: ", shop);
                    dispatchShop(setShop(shop));
                } else {
                    console.log("Lỗi khi Fetch dữ liệu Shop: ", res);
                }
            } catch (error) {
                console.log("Lỗi khi Fetch dữ liệu Shop: ", error);
            }
        };

        if (state.authenticate) {
            if (state.user.setup === 0) {
                navigate("/seller/seller-setup");
            } else {
                fetchShopData();
            }
        }
    }, [state.authenticate]);

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
                        <div className='flex h-full items-center text-slate-600 gap-3 hover:bg-[#8ad3e5] py-4'>
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
                                        {state.user ? <Avatar src={state.user.avt_url} size={20} /> : <Avatar size={20} icon={<FaUserCircle />} />}
                                        <span className='text-white text-[15px]'>{state.user ? state.user.email.split('@gmail.com') : ''}</span>
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