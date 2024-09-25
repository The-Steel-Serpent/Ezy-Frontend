import React, { useState } from 'react'
import { Select, Space, Input } from 'antd';


const items = [
  {
    label: 'Mã đơn hàng',
    value: 'Mã đơn hàng',
    placeholder: 'Nhập mã đơn hàng'
  },
  {
    value: 'Tên người mua',
    label: 'Tên người mua',
    placeholder: 'Nhập tên người mua'

  },
  {
    value: 'Sản phẩm',
    label: 'Sản phẩm',
    placeholder: 'Nhập tên/ mã sản phẩm'

  },
];

const OrderFilter = () => {
  const [placeholder, setPlaceHolder] = useState(items[0].placeholder);
  const handleChange = (placeholder) => {
    setPlaceHolder(placeholder)
  };

  return (
    <div className='w-full'>
      <div className='flex items-center gap-3 p-5 w-full'>
        <div className='flex'>
          <Select
            defaultValue="Mã đơn hàng"
            className='min-w-36 custom-select-radius-left'
            onChange={handleChange}
            options={items}
          />
          <Input placeholder={placeholder} className='min-w-52 custom-input' />
        </div>

        <div className='flex border rounded hover:border-slate-500'>
          <div className='flex justify-center p-2'>Đơn vị vận chuyển</div>
          <Select
            defaultValue="Mã đơn hàng"
            className='min-w-64 custom-none-border'
            onChange={handleChange}
            options={items}
          />
        </div>

        <button className='text-primary border rounded border-primary px-4 py-2 font-[500] hover:bg-orange-50'>Áp dụng</button>
        <button className='border rounded px-4 py-2 font-[500] hover:bg-slate-100'>Đặt lại</button>
      </div>
      <div className='pl-5'>
        <span className='min-w-96 font-semibold text-lg'>0 Đơn hàng</span>
      </div>
    </div>
  )
}

export default OrderFilter