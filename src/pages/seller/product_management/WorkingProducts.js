import React, { useReducer } from 'react'
import ProductSellerHeader from '../../../components/seller/products/ProductSellerHeader'
import FilterProduct from '../../../components/seller/products/FilterProduct'
import ProductTable from '../../../components/seller/products/ProductTable'

const initialState = {
    selected_page: 1,
    search_products: [],
    search_product_name: null,
    search_sub_category: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SELECTED_PAGE':
            return { ...state, selected_page: action.payload }
        case 'SET_SEARCH_PRODUCTS':
            return { ...state, search_products: action.payload }
        case 'SET_SEARCH_PRODUCT_NAME':
            return { ...state, search_product_name: action.payload }
        case 'SET_SEARCH_SUB_CATEGORY':
            return { ...state, search_sub_category: action.payload }
        default:
            return state
    }
}
const WorkingProducts = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handlePageChange = (page) => {
        dispatch({ type: 'SET_SELECTED_PAGE', payload: page });
    }
    const handleSetSearchInfo = (product_name, sub_category_id) => {
        dispatch({ type: 'SET_SEARCH_PRODUCT_NAME', payload: product_name });
        dispatch({ type: 'SET_SEARCH_SUB_CATEGORY', payload: sub_category_id });
    }
    return (
        <div>
            <ProductSellerHeader status={'/seller/product-management/working-products'} />
            <div>
                <FilterProduct handleSetSearchInfo={handleSetSearchInfo} />
                <ProductTable
                    handlePageChange={handlePageChange}
                    search_products={state.search_products}
                    search_product_name={state.search_product_name}
                    search_sub_category={state.search_sub_category}
                    product_status={1}
                />
            </div>
        </div>
    )
}

export default WorkingProducts