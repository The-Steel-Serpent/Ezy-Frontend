import React from 'react'
import ProductSellerHeader from '../../../components/seller/products/ProductSellerHeader'
import FilterProduct from '../../../components/seller/products/FilterProduct'
import ProductTable from '../../../components/seller/products/ProductTable'

const WorkingProducts = () => {
    return (
        <div>
            <ProductSellerHeader status={'/seller/product-management/working-products'} />
            <div className='bg-white rounded p-5 mt-5'>
                <FilterProduct key={2} />
                <ProductTable product_status={1} key={2} />
            </div>
        </div>
    )
}

export default WorkingProducts