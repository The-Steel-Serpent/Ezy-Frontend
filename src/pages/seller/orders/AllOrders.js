import React from 'react'
import OrderStatus from '../../../components/seller/orders/OrderStatus';
import OrderFilter from '../../../components/seller/orders/OrderFilter';

const AllOrders = () => {
  return (
    <div className='bg-white rouned'>
      <OrderStatus status={'/seller/order/all'} />
      <OrderFilter />
    </div>
  )
}

export default AllOrders