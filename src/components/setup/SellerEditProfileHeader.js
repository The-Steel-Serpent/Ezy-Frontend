import { Menu } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const items = [
    {
        key: '/seller/seller-edit-profile',
        label: 'Thông tin shop'
    },
    {
        key: '/seller/seller-edit-profile/tax-info',
        label: 'Thông tin thuế'
    }
];

const SellerEditProfileHeader = ({ status }) => {
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        if (e.key)
            navigate(e.key);
    }

    return (
        <div>
            <Menu
                defaultOpenKeys={['sub1', 'sub2']}
                defaultSelectedKeys={status}
                mode="horizontal"
                theme="light"
                items={items}
                className="custom-menu-seller-product font-[500] mt-6 bg-transparent bg-white"
                onClick={handleNavigate}
            />
        </div>
    )
}

export default SellerEditProfileHeader