import React from 'react'
import ReturnOrderTable from '../../../components/seller/orders/ReturnOrderTable';
const OrdersReturn = () => {

  return (
    <div className='bg-white rouned'>
      <ReturnOrderTable
        return_type_id={2}
      />
    </div>
  )
}

export default OrdersReturn