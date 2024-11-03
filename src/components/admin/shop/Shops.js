import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import ShopDetail from '../shop/ShopDetail';

const Shops = () => {
    const [shopData, setShopData] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search-shop`);
            if (response.data.success) {
                setShopData(response.data.shops);
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showShopDetail = (shop) => {
        setSelectedShop(shop);
    };

    const columns = [
        { 
            title: 'ID',
            dataIndex: 'shop_id', 
            key: 'shop_id' 
        },
        { 
            title: 'Tên cửa hàng', 
            dataIndex: 'shop_name', 
            key: 'shop_name' 
        },
        { 
            title: 'Địa chỉ', 
            dataIndex: 'shop_address', 
            key: 'shop_address' 
        },
        { 
            title: 'Số điện thoại', 
            dataIndex: 'citizen_number', 
            key: 'citizen_number' 
        },
        { 
            title: 'Email', 
            dataIndex: 'business_email', 
            key: 'business_email' 
        },
        { 
            title: 'Ngày tạo', 
            dataIndex: 'created_at', 
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: 'Trạng thái',
            dataIndex: 'shop_status',
            key: 'shop_status',
            render: (status) => (status === 1 ? 'Hoạt động' : 'Tạm dừng'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => showShopDetail(record)} style={{ marginRight: '8px' }}>
                    Chi tiết
                </Button>
            ),
        }
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={shopData}
                rowKey={'shop_id'}
                pagination={{ pageSize: 5 }}
            />
            {selectedShop && (
                <ShopDetail
                    shop={selectedShop}
                    onClose={() => setSelectedShop(null)}
                />
            )}
        </>
    );
};

export default Shops;
