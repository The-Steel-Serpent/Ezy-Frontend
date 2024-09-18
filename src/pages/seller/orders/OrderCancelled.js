import React from 'react'
import OrderStatus from '../../../components/OrderStatus'

const OrderCancelled = () => {
  return (
    <div className='bg-white rouned'>
      <OrderStatus status={'/seller/order/ordercancelled'} />
    </div>
  )
}

export default OrderCancelled