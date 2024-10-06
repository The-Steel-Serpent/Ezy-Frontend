import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Menu } from 'antd';
import { BasicInformation } from './BasicInformation';
import SaleInformation from './SaleInformation';
import ShippingProductInformation from './ShippingProductInformation';

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
    enable_submit: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_basic_info':
            return { ...state, basicInfo: action.payload };
        case 'set_sale_info':
            return { ...state, saleInfo: action.payload };
        case 'set_shipping_info':
            return { ...state, shippingInfo: action.payload };
        case 'enable_submit':
            return { ...state, enable_submit: action.payload };
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
        dispatch({ type: 'set_basic_info', payload: data });
    }

    const handleSaleInfo = (data) => {
        dispatch({ type: 'set_sale_info', payload: data });
    }

    const handleShippingInfo = (data) => {
        dispatch({ type: 'set_shipping_info', payload: data });
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

    useEffect(() => {
        dispatch({ type: 'enable_submit', payload: false });
        console.log("Basic info:",state.basicInfo);
        const noErrorBasicInfo = state.basicInfo ? state.basicInfo.noErrorBasicInfo : false;
        if (noErrorBasicInfo) {
            dispatch({ type: 'enable_submit', payload: true });
            console.log("Basic Info: ", state.basicInfo);
        }
        else {
            console.log("Basic Info: ", state.basicInfo);
        }
    },[state.basicInfo]);

 

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
                <Button type="primary" disabled={!state.enable_submit}>Lưu</Button>
            </div>
        </div>
    );
};

export default DetailProduct;