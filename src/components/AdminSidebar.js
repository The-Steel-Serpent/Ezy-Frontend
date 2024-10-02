import { Flex, Menu } from 'antd'
import React from 'react'
import { HomeOutlined, 
        OrderedListOutlined, 
        ProductOutlined, 
        UserOutlined, 
        LogoutOutlined, } 
from '@ant-design/icons';
const AdminSidebar = () => {
  return (
    <>
        
        <Menu 
            mode='inline' 
            defaultSelectedKeys={['1']} 
            className='menu-bar'
            items={[
                {
                    key: '1',
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
                            label: 'Nhóm người dùng',
                        },
                        {
                            key: '2.3',
                            icon: <ProductOutlined />,
                            label: 'Phân quyền',
                        },
                        {
                            key: 'category',
                            icon: <ProductOutlined />,
                            label: 'Danh mục sản phẩm',
                            children: [
                                {
                                    key: '2.4.1',
                                    icon: <ProductOutlined />,
                                    label: 'Danh mục chính',
                                },
                                {
                                    key: '2.4.2',
                                    icon: <ProductOutlined />, 
                                    label: 'Danh mục phụ',
                                },
                            ],
                        },
                    ],
                },
                {
                    key: '3',
                    icon: <OrderedListOutlined />,
                    label: 'Đơn hàng',
                    children: [
                        {
                            key: '3.1',
                            icon: <ProductOutlined />,
                            label: 'option 4',
                        },
                        {
                            key: '3.2',
                            icon: <ProductOutlined />,
                            label: 'option 5',
                        },
                        {
                            key: '3.3',
                            icon: <ProductOutlined />,
                            label: 'option 6',
                        },
                    ],
                },
                {
                    key: '4',
                    icon: <UserOutlined />,
                    label: 'Tài khoản',
                    children: [
                        {
                            key: '4.1',
                            icon: <ProductOutlined />,
                            label: 'option 7',
                        },
                        {
                            key: '4.2',
                            icon: <ProductOutlined />,
                            label: 'option 8',
                        },
                        {
                            key: '4.3',
                            icon: <ProductOutlined />,
                            label: 'option 9',
                        },
                    ],
                },
                {
                    key: '5',
                    icon: <LogoutOutlined />,
                    label: 'Đăng xuất',
                },
            ]}
        />
    </>
  )
}

export default AdminSidebar