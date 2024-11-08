import { Menu } from 'antd'
import React from 'react'

const OrdersReturn = () => {
  const items = [
    {
      key: "sub1",
      label: "Tất cả",
    },
    {
      key: "sub2",
      label: "Đơn trả hàng hoàn tiền",
    },
    {
      key: "sub3",
      label: "Đơn hủy",
    },
    {
      key: "sub4",
      label: "Đơn giao hàng không thành công",
    },
  ];
  return (
    <div className='bg-white rouned'>
      <Menu mode='horizontal' className='border-b-0'
        items={items}
        defaultSelectedKeys={['sub1']}
      />
    </div>
  )
}

export default OrdersReturn