import React from 'react'
import ReturnOrderTable from '../../../components/seller/orders/ReturnOrderTable';
const OrdersReturn = () => {

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90%] mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Yêu cầu trả hàng / hoàn tiền</h1>
        <ReturnOrderTable
          return_type_id={2}
        />
      </div>
    </div>
  )
}

export default OrdersReturn