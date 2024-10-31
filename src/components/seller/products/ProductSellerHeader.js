import React from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Menu } from 'antd';
import { GoPlus } from "react-icons/go";
import { useNavigate } from 'react-router-dom';


const ProductSellerHeader = ({ status }) => {
  const navigate = useNavigate();
  const items = [
    {
      key: '/seller/product-management/all',
      label: 'Tất cả'
    },
    {
      key: '/seller/product-management/working-products',
      label: 'Đang hoạt động'
    },
    {
      key: '/seller/product-management/notworking-products',
      label: 'Dừng hoạt động'
    },
  ];

  const handleNavigate = (e) => {
    if (e.key)
      navigate(e.key);
  }
  return (
    <div>
      <div className='flex justify-between items-center rounded-lg'>
      <div className='text-lg font-semibold'>Sản phẩm</div>
        <div className='flex gap-3 items-center'>
          <Button
            onClick={() => navigate('/seller/product-management/add-product')}
            type="primary"
            icon={<GoPlus />}
            className='bg-[#3188CA] px-3 py-4 text-sm'
          >
            Thêm 1 sản phẩm mới
          </Button>
        </div>
      </div>
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
export default ProductSellerHeader