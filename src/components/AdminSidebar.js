import { Menu } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    HomeOutlined, 
    ProductOutlined, 
    ShopOutlined, 
    BarChartOutlined, 
    GiftOutlined, 
    UserOutlined, 
    KeyOutlined, 
    TeamOutlined ,
    ThunderboltOutlined,
    TagOutlined,
    WarningOutlined,
    SolutionOutlined
} from '@ant-design/icons';

const AdminSidebar = ({ role_id }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            key: '/admin/dashboard',
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
                {
                    key: '/admin/shop-management/all-shop-violation',
                    icon: <WarningOutlined />,
                    label: 'Cửa hàng vi phạm',
                    roles: [3, 5] 
                }
            ],
        },
        {
            key: '4',
            icon: <GiftOutlined />,
            label: 'Quản lý sự kiện',
            roles: [3, 4],
            children: [
                { 
                    key: '/admin/event-management/sale-event/event', 
                    icon: <GiftOutlined />, 
                    label: 'Sự kiện khuyến mãi', roles: [3, 4] 
                },
                {
                    key: '/admin/event-management/sale-event/discount-voucher',
                    icon: <TagOutlined />,
                    label: 'Voucher',
                    roles: [3, 4],
                }
                
            ],
        },
        {
            key: '/admin/flash-sale/all-flash-sale',
            icon: <ThunderboltOutlined />,
            label: 'Quản lý Flash Sale',
            roles: [3,4],
        },
        {
            key: '6',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            roles: [3], 
            children: [
                { key: '/admin/user-management/all-user', icon: <TeamOutlined />, label: 'Tất cả', roles: [3] },
                { key: '/admin/user-management/roles', icon: <KeyOutlined />, label: 'Role', roles: [3] },
                { key: '/admin/user-management/violation', icon:<WarningOutlined /> ,label: 'Xử lý vi phạm', roles: [3] },
            ],
        },
        {
            key: '/admin/support/all',
            icon: <SolutionOutlined />,
            label: 'Yêu cầu hổ trợ',
            roles: [3, 4],
        },
        {
            key: '/admin/statistic/revenue',
            icon: <BarChartOutlined />,
            label: 'Thống kê doanh thu',
            roles: [3], 
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
            className='menu-bar h-full'
            items={filteredItems}
            

        />
    );
};

export default AdminSidebar;
