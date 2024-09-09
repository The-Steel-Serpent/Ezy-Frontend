import React from 'react'
import { Input, Space } from 'antd';
import { CiSearch } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";

const FilterProduct = () => {
  return (
    <div className='flex items-center gap-3 p-5 w-full'>
      <Input
        placeholder="Tìm tên sản phẩm, SKU sản phẩm, Mã sản phẩm"
        prefix={<CiSearch />}
        className=''
      />
      <Input
        placeholder="default size"
        suffix={<BsPencil />}
        className=''
      />
      <button
        className='text-primary border rounded border-primary px-4 py-2 font-[500] hover:bg-orange-50'>
        Áp dụng
      </button>
      <button className='border rounded px-4 py-2 font-[500] hover:bg-slate-100'>
        Đặt lại
      </button>

    </div>
  )
}

export default FilterProduct