import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import axios from 'axios';
import ShopDetail from '../shop/ShopDetail';

const Shops = () => {
    const [shopData, setShopData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false); 

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search-shop`);
            if (response.data.success) {
                setShopData(response.data.shops);
                setFilteredData(response.data.shops); 
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        setLoading(true);

        setTimeout(() => {
            setFilteredData(
                shopData.filter((shop) => {
                    const keyword = searchKeyword.toLowerCase();
                    return (
                        shop.shop_name.toLowerCase().includes(keyword) ||
                        shop.citizen_number.includes(keyword) ||
                        shop.business_email.toLowerCase().includes(keyword) ||
                        (keyword === 'hoạt động' && shop.shop_status === 1) ||
                        (keyword === 'tạm dừng' && shop.shop_status === 0)
                    );
                })
            );
            setLoading(false);
        }, 500);
    };

    const showShopDetail = (shop) => {
        setSelectedShop(shop);
    };

    const columns = [
        { title: 'ID', dataIndex: 'shop_id', key: 'shop_id' },
        { title: 'Tên cửa hàng', dataIndex: 'shop_name', key: 'shop_name' },
        { title: 'Địa chỉ', dataIndex: 'shop_address', key: 'shop_address' },
        { title: 'Số điện thoại', dataIndex: 'citizen_number', key: 'citizen_number' },
        { title: 'Email', dataIndex: 'business_email', key: 'business_email' },
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
            <h1 style={{ marginBottom: 20, fontSize: 20 }}>Quản lý cửa hàng</h1>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Input
                    placeholder="Tìm kiếm theo tên, SĐT, email, trạng thái..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ width: '300px' }}
                />
                <Button type="primary" onClick={handleSearch}>
                    Tìm
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
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
