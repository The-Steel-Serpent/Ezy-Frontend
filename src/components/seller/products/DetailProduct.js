import React, { useRef } from 'react';
import { Menu } from 'antd';
import { BasicInformation } from './BasicInformation';

const items = [
    {
        key: '1',
        label: 'Thông tin cơ bản'
    },
    {
        key: '2',
        label: 'Thông tin chi tiết'
    },
    {
        key: '3',
        label: 'Thông tin bán hàng'
    },
    {
        key: '4',
        label: 'Vận chuyển'
    },
    {
        key: '5',
        label: 'Thông tin khác'
    },
];

const DetailProduct = () => {
    const basicInfoRef = useRef(null);
    const detailedInfoRef = useRef(null);
    const salesInfoRef = useRef(null);
    const shippingInfoRef = useRef(null);
    const otherInfoRef = useRef(null);

    const handleClick = (e) => {
        switch (e.key) {
            case '1':
                basicInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '2':
                detailedInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '3':
                salesInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '4':
                shippingInfoRef.current.scrollIntoView({ behavior: 'smooth' });
                break;
            case '5':
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
                className="custom-menu-seller-product bg-transparent sticky-menu"
                onClick={handleClick}
            />
            <div ref={basicInfoRef} className="section bg-white mt-3 border rounded p-5">
                <BasicInformation />
            </div>
            <div ref={detailedInfoRef} className="section">
                <h2>Thông tin chi tiết</h2>
            </div>
            <div ref={salesInfoRef} className="section">
                <h2>Thông tin bán hàng</h2>
            </div>
            <div ref={shippingInfoRef} className="section">
                <h2>Vận chuyển</h2>
            </div>
            <div ref={otherInfoRef} className="section">
                <h2>Thông tin khác</h2>
            </div>
        </div>
    );
};

export default DetailProduct;