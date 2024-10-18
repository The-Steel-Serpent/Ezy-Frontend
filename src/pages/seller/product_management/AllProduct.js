import React from 'react'
import ProductSellerHeader from '../../../components/seller/products/ProductSellerHeader'
import FilterProduct from '../../../components/seller/products/FilterProduct'
import ProductTable from '../../../components/seller/products/ProductTable'

const AllProduct = () => {
  return (
    <div>
      <ProductSellerHeader status={'/seller/product-management/all'} />
      <div className='bg-white rounded p-5 mt-5'>
        <FilterProduct />
        <ProductTable product_status={1}/>
      </div>
    </div>
  )
}

export default AllProduct