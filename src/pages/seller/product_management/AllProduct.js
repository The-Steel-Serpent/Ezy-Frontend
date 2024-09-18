import React from 'react'
import ProductSellerHeader from '../../../components/seller/ProductSellerHeader'
import FilterProduct from '../../../components/seller/FilterProduct'

const AllProduct = () => {
  return (
    <div>
      <ProductSellerHeader status={'/seller/product-management/all'} />
      <div className='bg-white rounded p-5'>
        <FilterProduct />

      </div>
    </div>
  )
}

export default AllProduct