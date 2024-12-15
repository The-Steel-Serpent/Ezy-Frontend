import React, { useEffect, useState } from 'react';
import { Modal, Table, message } from 'antd';
import axios from 'axios';

const RegisteredProducts = ({ visible, onClose, flashSaleId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && flashSaleId) {
            fetchRegisteredProducts(flashSaleId);
        }
    }, [visible, flashSaleId]);

    const fetchRegisteredProducts = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/get-shop-registered-products/${id}`);
            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                message.error('Không thể tải dữ liệu sản phẩm đã đăng ký');
                setProducts([]);
            }
        } catch (error) {
            message.warning('Không có sản phẩm đăng ký nào');
            console.error("Error fetching registered products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setProducts([]); // Reset danh sách sản phẩm để tránh hiển thị dữ liệu cũ
        onClose(); // Đóng modal
    };

    const columns = [
        {
            title: 'Mã sản phẩm',
            dataIndex: ['product', 'product_id'],
            key: 'product_id',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: ['product', 'product_name'],
            key: 'product_name',
        },
        {
            title: 'Ảnh sản phẩm',
            dataIndex: ['product', 'thumbnail'],
            key: 'thumbnail',
            render: (text) => <img src={text} alt="Product Thumbnail" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Tên shop',
            dataIndex: ['shop', 'shop_name'],
            key: 'shop_name',
        },
        {
            title: 'Giá gốc',
            dataIndex: ['flash_sale_details', 'original_price'],
            key: 'original_price',
            render: (text) => `${text.toLocaleString()} VND`,
        },
        {
            title: 'Giá sale',
            dataIndex: ['flash_sale_details', 'flash_sale_price'],
            key: 'flash_sale_price',
            render: (text) => `${text.toLocaleString()} VND`,
        },
        {
            title: 'Số lượng',
            dataIndex: ['flash_sale_details', 'quantity'],
            key: 'quantity',
        },
        {
            title: 'Đã bán',
            dataIndex: ['flash_sale_details', 'sold'],
            key: 'sold',
        },
    ];

    return (
        <Modal
            title="Danh sách sản phẩm đã đăng ký vào Flash Sale"
            visible={visible}
            onCancel={handleModalClose}
            footer={null}
            width={1200}
        >
            <Table
                columns={columns}
                dataSource={products}
                rowKey={(record) => `${record.product.product_id}-${record.shop.shop_id}`}
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
};

export default RegisteredProducts;
