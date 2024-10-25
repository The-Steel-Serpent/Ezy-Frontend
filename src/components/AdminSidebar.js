import { Menu } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, 
        ProductOutlined, 
        LogoutOutlined,
        ShopOutlined,
        BarChartOutlined,
        GiftOutlined,  } 
from '@ant-design/icons';
const AdminSidebar = () => {
    const navigate = useNavigate();
  return (
    <>
        
        <Menu 
            mode='inline' 
            onClick={({ key }) =>{
                if(key === 'signout'){
                    // signout
                }
                else{
                    navigate(key);
                }
            }}
            className='menu-bar'
            items={[
                {
                    key: '/admin',
                    icon: <HomeOutlined />,
                    label: 'Trang chủ',
                },
                {
                    key: '2',
                    icon: <ProductOutlined />,
                    label: 'Danh mục',
                    children: [
                        {
                            key: '2.1',
                            icon: <ProductOutlined />,
                            label: 'Người dùng',
                        },
                        {
                            key: '2.2',
                            icon: <ProductOutlined />,
                            label: 'Phân quyền',
                        },
                        {
                            key: 'category',
                            icon: <ProductOutlined />,
                            label: 'Danh mục sản phẩm',
                            children: [
                                {
                                    key: '/admin/category-management/product-category/main-category',
                                    icon: <ProductOutlined />,
                                    label: 'Danh mục chính',
                                },
                                {
                                    key: '/admin/category-management/product-category/sub-category',
                                    icon: <ProductOutlined />, 
                                    label: 'Danh mục phụ',
                                },
                            ],
                        },
                    ],
                },
                {
                    key: '3',
                    icon: <ShopOutlined />,
                    label: 'Quản lý cửa hàng hàng',
                    children: [
                        {
                            key: '3.1',
                            icon: <ShopOutlined />,
                            label: 'option 4',
                        },
                        {
                            key: '3.2',
                            icon: <ShopOutlined />,
                            label: 'option 5',
                        },
                        {
                            key: '3.3',
                            icon: <ShopOutlined />,
                            label: 'option 6',
                        },
                    ],
                },
                {
                    key: '4',
                    icon: <GiftOutlined />,
                    label: 'Quản lý sự kiện',
                    children: [
                        {
                            key: '/admin/event-management/sale-event/event',
                            icon: <ProductOutlined />,
                            label: 'Sự kiện',
                        },
                        {
                            key: '4.2',
                            icon: <ProductOutlined />,
                            label: 'Voucher',
                        },
                    ],
                },
                {
                    key: '5',
                    icon: <BarChartOutlined />,
                    label: 'Thống kê',
                },
                {
                    key: '6',
                    icon: <LogoutOutlined />,
                    label: 'Đăng xuất',
                },
            ]}
        />
    </>
  )
}

export default AdminSidebar