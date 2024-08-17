import React from 'react'
import { Select, Space } from 'antd';
import OrderStatus from '../../components/OrderStatus';
import OrderFilter from '../../components/OrderFilter';
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const AllOrders = () => {
  return (
    <div className='bg-white rouned'>
      <OrderStatus status={'sub1'}/>
      <OrderFilter />
    </div>
  )
}

export default AllOrders