import React, { useRef } from 'react';
import { Menu } from 'antd';
import { BasicInformation } from './BasicInformation';
import SaleInformation from './SaleInformation';

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
    },
    {
        key: '4',
        label: 'Thông tin khác'
    },
];

const DetailProduct = () => {
    const basicInfoRef = useRef(null);
    const salesInfoRef = useRef(null);
    const shippingInfoRef = useRef(null);
    const otherInfoRef = useRef(null);

    const handleFocusMenu = (e) => {
        switch (e.key) {
            case '1':
                basicInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '2':
                salesInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '3':
                shippingInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '4':
                otherInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Menu
                mode="horizontal"
                theme="light"
                items={items}
                defaultSelectedKeys={['1']}
                className="custom-menu-seller-product bg-white sticky-menu"
                onClick={handleFocusMenu}
            />
            <div ref={basicInfoRef} className="section bg-white mt-3 border rounded p-5">
                <BasicInformation />
            </div>
            <div ref={salesInfoRef} className="section bg-white mt-3 border rounded p-5">
                <SaleInformation />
            </div>
            <div ref={shippingInfoRef} className="section bg-white mt-3 border rounded p-5">
                <h2>Vận chuyển</h2>
            </div>
            <div ref={otherInfoRef} className="section bg-white mt-3 border rounded p-5">
                <h2>Thông tin khác</h2>
            </div>
          
        </div>
    );
};

export default DetailProduct;