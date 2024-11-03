import { Menu } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ProductOutlined, ShopOutlined, BarChartOutlined, GiftOutlined, UserOutlined, KeyOutlined, TeamOutlined } from '@ant-design/icons';

const AdminSidebar = ({ role_id }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            key: '/admin',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
            roles: [3],
        },
        {
            key: '/admin/category-management/product-category/main-category',
            icon: <ProductOutlined />,
            label: 'Danh mục sản phẩm',
            roles: [3], 
        },
        {
            key: '3',
            icon: <ShopOutlined />,
            label: 'Quản lý cửa hàng',
            roles: [3, 5], 
            children: [
                { 
                    key: '/admin/shop-management/all-shop', 
                    icon: <ShopOutlined />, 
                    label: 'Tất cả cửa hàng', 
                    roles: [3, 5] 
                },
            ],
        },
        {
            key: '/admin/event-management/sale-event/event',
            icon: <GiftOutlined />,
            label: 'Quản lý sự kiện',
            roles: [3, 4],
        },
        {
            key: '4',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            roles: [3], 
            children: [
                { key: '/admin/user-management/all-user', icon: <TeamOutlined />, label: 'Tất cả', roles: [3] },
                { key: '/admin/user-management/roles', icon: <KeyOutlined />, label: 'Role', roles: [3] },
            ],
        },
        {
            key: '5',
            icon: <BarChartOutlined />,
            label: 'Thống kê',
            roles: [3, 4], 
        },
    ];

    const filteredItems = menuItems
        .filter(item => item.roles.includes(role_id))
        .map(item => ({
            ...item,
            children: item.children?.filter(child => child.roles.includes(role_id)),
        }));

    return (
        <Menu
            mode='inline'
            onClick={({ key }) => navigate(key)}
            className='menu-bar'
            items={filteredItems}
        />
    );
};

export default AdminSidebar;
