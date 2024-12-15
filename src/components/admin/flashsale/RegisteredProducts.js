import React, { useEffect, useState } from 'react';
import { Modal, Table, message } from 'antd';
import axios from 'axios';

const RegisteredProducts = ({ visible, onClose, flashSaleId }) => {
    const [timeFrames, setTimeFrames] = useState([]);
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
                setTimeFrames(response.data.data);
            } else {
                message.error('Không thể tải dữ liệu sản phẩm đã đăng ký');
                setTimeFrames([]);
            }
        } catch (error) {
            message.warning('Không có sản phẩm đăng ký nào');
            console.error("Error fetching registered products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setTimeFrames([]);
        onClose();
    };
    const productColumns = [
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
            render: (text) => text ? <img src={text} alt="Thumbnail" style={{ width: 50, height: 50 }} /> : 'N/A',
        },
        {
            title: 'Tên shop',
            dataIndex: ['shop', 'shop_name'],
            key: 'shop_name',
        },
        {
            title: 'Giá gốc',
            dataIndex: ['product', 'base_price'],
            key: 'base_price',
            render: (text) => (
                <span className="no-wrap">{text ? `${text.toLocaleString()} VND` : 'N/A'}</span>
            ),
        },
        {
            title: 'Giá sale',
            dataIndex: 'product',
            key: 'flash_sale_price',
            render: (_, record) => (
                <span className="no-wrap">
                    {record.product.flash_sale_price 
                        ? `${record.product.flash_sale_price.toLocaleString()} VND` 
                        : 'N/A'}
                </span>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Đã bán',
            dataIndex: 'product',
            key: 'sold',
            render: (_, record) => record.product.sold || 0,
        },
    ];

    const expandedRowRender = (timeFrame) => {
        return (
            <Table
                columns={productColumns}
                dataSource={timeFrame.registered_products}
                rowKey={(record) => `${record.product.product_id}-${record.shop.shop_id}`}
                pagination={false}
            />
        );
    };

    const parentColumns = [
        {
            title: 'Khung giờ',
            key: 'time_frame_id',
            render: (record) => (
                <div>
                    <p><b>ID:</b> {record.time_frame_id}</p>
                    <p><b>Bắt đầu:</b> {new Date(record.started_at).toLocaleString()}</p>
                    <p><b>Kết thúc:</b> {new Date(record.ended_at).toLocaleString()}</p>
                    <p><b>Trạng thái:</b> {record.status}</p>
                </div>
            ),
        },
    ];

    return (
        <Modal
            title="Danh sách sản phẩm đã đăng ký vào Flash Sale"
            visible={visible}
            onCancel={handleModalClose}
            footer={null}
            width={1250}
        >
            <Table
                columns={parentColumns}
                expandable={{
                    expandedRowRender,
                }}
                dataSource={timeFrames}
                rowKey={(record) => record.time_frame_id}
                loading={loading}
                pagination={false}
            />
        </Modal>
    );
};

export default RegisteredProducts;
