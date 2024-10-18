import React from 'react'
import { Button, Input, Space } from 'antd';
import { CiSearch } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";

const FilterProduct = () => {
  return (
    <div className='flex items-center gap-3 w-full'>
      <Input
        placeholder="Tìm tên sản phẩm"
        prefix={<CiSearch />}
        className=''
      />
      <Input
        placeholder="Tìm theo ngành hàng"
        suffix={<BsPencil />}
        className=''
      />
      <Button
        className='text-primary border rounded border-primary px-4 py-2 font-[500] hover:text-white'>
        Áp dụng
      </Button>
      <Button
        className='text-primary border rounded border-primary px-4 py-2 font-[500] hover:text-white'>
        Đặt lại
      </Button>

    </div>
  )
}

export default FilterProduct