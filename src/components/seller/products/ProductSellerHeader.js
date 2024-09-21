import React from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Menu } from 'antd';
import { GoPlus } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

const items = [
  {
    key: '/seller/product-management/all',
    label: 'Tất cả'
  },
  {
    key: '/seller/product-management/working-products',
    label: 'Đăng hoạt động (0)'
  },
  {
    key: '/seller/product-management/infringing-products',
    label: 'Vi phạm (0)'
  },
  {
    key: '/seller/product-management/pending-products',
    label: 'Chờ duyệt bởi Shopee (0)'
  }
];

const ProductSellerHeader = ({ status }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (e) => {
    if(e.key)
      navigate(e.key);
  }
  return (
    <div>
      <div className='flex justify-between'>
        <div className='text-lg'>Sản phẩm</div>
        <div className='flex gap-3 items-center'>
          <Dropdown
            menu={{
              items,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Cài đặt sản phẩm
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <Button
            type="primary"
            icon={<GoPlus />}
            className='bg-primary px-3 py-4 text-sm'
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
        className="custom-menu-seller-product font-[500] mt-6 bg-transparent"
        onClick={handleNavigate}
      />
    </div>
  )
}
export default ProductSellerHeader