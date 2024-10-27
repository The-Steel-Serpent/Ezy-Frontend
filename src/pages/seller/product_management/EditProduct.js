import React, { useEffect, useReducer } from 'react'
import EditBasicInformation from '../../../components/seller/products/EditBasicInformation'
import { useParams } from 'react-router-dom'
import { getProductByID } from '../../../services/productService'

const initialState = {
    product_edit: null,
    basicInfo: null,
    saleInfo: null,
    shippingInfo: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_EDIT':
            return { ...state, product_edit: action.payload }
        case 'SET_EDIT_BASIC_INFO':
            return { ...state, basicInfo: action.payload }
        case 'SET_EDIT_SALE_INFO':
            return { ...state, saleInfo: action.payload }
        case 'SET_SHIPPING_INFO':
            return { ...state, shippingInfo: action.payload }
        default:
            return state
    }
}

const EditProduct = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { product_id } = useParams();
    // handle OnData 

    const handleBasicinfo = (data) => {
        dispatch({ type: 'SET_EDIT_BASIC_INFO', payload: data })
    }

    useEffect(() => {
        const noErrorBasicInfo = state.basicInfo ? state.basicInfo.noErrorBasicInfo : false;
        if (noErrorBasicInfo) {
            // dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: true });
            console.log("Basic Info: ", state.basicInfo);
        }
        else {
            console.log("Basic Info: ", state.basicInfo);
        }
    },[
        state.basicInfo,
        state.saleInfo,
        state.shippingInfo
    ])

    useEffect(() => {
        if (product_id) {
            const fetchProduct = async () => {
                try {
                    const res = await getProductByID(product_id);
                    dispatch({ type: 'SET_PRODUCT_EDIT', payload: res.data });
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };
            fetchProduct();
        }
    }, [product_id])

    return (
        <div>
            <div className='bg-white border rounded p-5 mt-5'>
                <EditBasicInformation product={state.product_edit} onData={handleBasicinfo}/>
            </div>
        </div>
    )
}

export default EditProduct