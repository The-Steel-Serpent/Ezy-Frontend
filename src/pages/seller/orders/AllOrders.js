import React from 'react'
import { Select, Space } from 'antd';
import OrderStatus from '../../../components/seller/OrderStatus';
import OrderFilter from '../../../components/seller/OrderFilter';
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const AllOrders = () => {
  return (
    <div className='bg-white rouned'>
      <OrderStatus status={'/seller/order/all'} />
      <OrderFilter />
    </div>
  )
}

export default AllOrders