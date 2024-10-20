import React from 'react'
import ProductSellerHeader from '../../../components/seller/products/ProductSellerHeader'
import FilterProduct from '../../../components/seller/products/FilterProduct'
import ProductTable from '../../../components/seller/products/ProductTable'

const NotWorkingProduct = () => {
  return (
    <div>
      <ProductSellerHeader status={'/seller/product-management/notworking-products'} />
      <div className='bg-white rounded p-5 mt-5'>
        <FilterProduct />
        <ProductTable product_status={0} key={3} />
      </div>
    </div>
  )
}

export default NotWorkingProduct