import React, { useEffect, useState } from 'react';
import { Modal, Table, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const RegisteredProducts = ({ visible, onClose, flashSaleId }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (visible && flashSaleId) {
            fetchRegisteredProducts();
        }
    }, [visible, flashSaleId]);

    const fetchRegisteredProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/get-shop-registered-products/${flashSaleId}`);
            console.log("API response:", response.data); 
            if (response.data.success) {
                setProducts(response.data.data);
                console.log("Products set:", response.data.data);
            } else {
                message.error('Không thể tải dữ liệu sản phẩm đã đăng ký');
            }
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu sản phẩm đã đăng ký');
            console.error("Error fetching registered products:", error);
        }
    };


    useEffect(() => {
        console.log("Products data in render:", products); 
    }, [products]);


    const columns = [
        {
            title: 'Mã sản phẩm',
            dataIndex: ['Product', 'product_id'],
            key: 'product_id',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: ['Product', 'product_name'],
            key: 'product_name',
        },
        {
            title: 'Ảnh sản phẩm',
            dataIndex: ['Product', 'thumbnail'],
            key: 'thumbnail',
            render: (text) => <img src={text} alt="Product Thumbnail" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Tên shop',
            dataIndex: ['Shop', 'shop_name'],
            key: 'shop_name',
        },
        {
            title: 'Giá gốc',
            dataIndex: 'original_price',
            key: 'original_price',
            render: (text) => `${text.toLocaleString()} VND`,
        },
        {
            title: 'Giá sale',
            dataIndex: 'flash_sale_price',
            key: 'flash_sale_price',
            render: (text) => `${text.toLocaleString()} VND`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
        },
        {
            title: 'Khung giờ đăng ký',
            key: 'time_frame',
            render: (_, record) => {
                const startTime = dayjs(record.FlashSaleTimeFrame.started_at).format('HH:mm DD/MM/YYYY');
                const endTime = dayjs(record.FlashSaleTimeFrame.ended_at).format('HH:mm DD/MM/YYYY');
                return `${startTime} -> ${endTime}`;
            },
        },
    ];

    return (
        <Modal
            title="Danh sách sản phẩm đã đăng ký vào Flash Sale"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <Table
                columns={columns}
                dataSource={products}
                rowKey={(record) => `${record.Product.product_id}-${record.FlashSaleTimeFrame.flash_sale_time_frame_id}`}
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
};

export default RegisteredProducts;
