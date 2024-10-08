import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Menu } from 'antd';
import { BasicInformation } from './BasicInformation';
import SaleInformation from './SaleInformation';
import ShippingProductInformation from './ShippingProductInformation';
import uploadFile from '../../../helpers/uploadFile';

const items = [
    {
        key: '1',
        label: 'Thông tin cơ bản'
    },
    {
        key: '2',
        label: 'Thông tin bán hàng'
    },
    {
        key: '3',
        label: 'Vận chuyển'
    }
];

const initialState = {
    basicInfo: null,
    saleInfo: null,
    shippingInfo: null,
    basicinfo_enable_submit: false,
    saleinfo_enable_submit: false,
    shippinginfo_enable_submit: false,
    list_product_images: [],
    uploadComplete: false,
    enable_submit: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_BASIC_INFO':
            return { ...state, basicInfo: action.payload };
        case 'SET_SALE_INFO':
            return { ...state, saleInfo: action.payload };
        case 'SET_SHIPPING_INFO':
            return { ...state, shippingInfo: action.payload };
        case 'SET_BASIC_INFO_ENABLE_SUBMIT':
            return { ...state, basicinfo_enable_submit: action.payload };
        case 'SET_SALE_INFO_ENABLE_SUBMIT':
            return { ...state, saleinfo_enable_submit: action.payload };
        case 'SET_SHIPPING_INFO_ENABLE_SUBMIT':
            return { ...state, shippinginfo_enable_submit: action.payload };
        case 'SET_ENABLE_SUBMIT':
            return { ...state, enable_submit: action.payload };
        case 'SET_LIST_PRODUCT_IMAGES':
            return { ...state, list_product_images: action.payload };
        case 'SET_UPLOAD_COMPLETE':
            return { ...state, uploadComplete: action.payload };
        default:
            return state;
    }
};

const DetailProduct = () => {
    const basicInfoRef = useRef(null);
    const salesInfoRef = useRef(null);
    const shippingInfoRef = useRef(null);

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleBasicInfo = (data) => {
        dispatch({ type: 'SET_BASIC_INFO', payload: data });
    }

    const handleSaleInfo = (data) => {
        dispatch({ type: 'SET_SALE_INFO', payload: data });
    }

    const handleShippingInfo = (data) => {
        dispatch({ type: 'SET_SHIPPING_INFO', payload: data });
    }

    const handleFocusMenu = (e) => {
        const offset = 100;
        const scrollWithOffset = (element) => {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        };
        switch (e.key) {
            case '1':
                scrollWithOffset(basicInfoRef.current);
                break;
            case '2':
                scrollWithOffset(salesInfoRef.current);
                break;
            case '3':
                scrollWithOffset(shippingInfoRef.current);
                break;
            default:
                break;
        }
    };

    const handleUploadProductImages = async () => {
        console.log("List Image:", state.basicInfo.fileListProduct);
        const uploadPromises = state.basicInfo.fileListProduct.map(file =>uploadFile(file.originFileObj, 'seller-img'));
        try {
            const uploadResults = await Promise.all(uploadPromises);
            console.log("Upload: ", uploadResults);
            const uploadUrls = uploadResults.map(file => file.url);
            dispatch({ type: 'SET_LIST_PRODUCT_IMAGES', payload: uploadUrls });
            dispatch({ type: 'SET_UPLOAD_COMPLETE', payload: true });
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    }

    const handleSubmit = async () => {
        await handleUploadProductImages();
    }

    useEffect(() => {
        if (state.uploadComplete)
            console.log("Checkkk:", state.fileListProduct);
    }, [state.fileListProduct, state.uploadComplete]);


    useEffect(() => {
        dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: false });
        dispatch({ type: 'SET_SALE_INFO_ENABLE_SUBMIT', payload: false });
        dispatch({ type: 'SET_SHIPPING_INFO_ENABLE_SUBMIT', payload: false });
        const noErrorBasicInfo = state.basicInfo ? state.basicInfo.noErrorBasicInfo : false;
        const noErrorSaleInfo = state.saleInfo ? state.saleInfo.noErrorSaleInfo : false;
        const noErrorShippingInfo = state.shippingInfo ? state.shippingInfo.noErrorShippingInfo : false;
        // Basic Info
        if (noErrorBasicInfo) {
            dispatch({ type: 'SET_BASIC_INFO_ENABLE_SUBMIT', payload: true });
            console.log("Basic Info: ", state.basicInfo);
        }
        else {
            console.log("Basic Info: ", state.basicInfo);
        }
        // Sale Info
        if (noErrorSaleInfo) {
            dispatch({ type: 'SET_SALE_INFO_ENABLE_SUBMIT', payload: true });
            console.log("Sale Info: ", state.saleInfo);
        }
        else {

            console.log("Sale Info: ", state.saleInfo);
        }
        // Shipping Info
        if (noErrorShippingInfo) {
            dispatch({ type: 'SET_SHIPPING_INFO_ENABLE_SUBMIT', payload: true });
            console.log("Shipping Info: ", state.shippingInfo);
        }
        else {
            console.log("Shipping Info: ", state.shippingInfo);
        }

        if (noErrorBasicInfo && noErrorSaleInfo && noErrorShippingInfo) {
            console.log("Enable Submit", noErrorBasicInfo && noErrorSaleInfo && noErrorShippingInfo);
            dispatch({ type: 'SET_ENABLE_SUBMIT', payload: true });
        }
        else {
            dispatch({ type: 'SET_ENABLE_SUBMIT', payload: false });
        }

    }, [state.basicInfo, state.saleInfo, state.shippingInfo]);



    return (
        <div className='mb-32'>
            <Menu
                mode="horizontal"
                theme="light"
                items={items}
                className="custom-menu-seller-product bg-white sticky-menu"
                defaultSelectedKeys={['1']}
                onClick={handleFocusMenu}
            />
            <div ref={basicInfoRef} className="section bg-white mt-3 border rounded p-5">
                <BasicInformation onData={handleBasicInfo} />
            </div>
            <div ref={salesInfoRef} className="section bg-white mt-3 border rounded p-5">
                <SaleInformation onData={handleSaleInfo} />
            </div>
            <div ref={shippingInfoRef} className="section bg-white mt-3 border rounded p-5">
                <ShippingProductInformation onData={handleShippingInfo} />
            </div>
            <div className='flex gap-3 mt-5 justify-end'>
                <Button type="primary" >Hủy</Button>
                <Button
                    onClick={handleSubmit}
                    type="primary"
                    disabled={!state.enable_submit}
                >Lưu</Button>
            </div>
        </div>
    );
};

export default DetailProduct;