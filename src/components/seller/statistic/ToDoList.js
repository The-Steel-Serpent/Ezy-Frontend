import React, { useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOrderStatistics } from '../../../services/statisticService';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Text, Title } = Typography;

const ToDoList = () => {
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_ORDER_STATISTICS':
                    return { ...state, order_statistics: action.payload };
                default:
                    return state;
            }
        },
        {
            order_statistics: null,
        }
    );

    const shop = useSelector((state) => state.shop);
    const navigate = useNavigate();

    const handleGetOrderStatistics = async (shop_id) => {
        try {
            const response = await getOrderStatistics(shop_id);
            console.log('To do:', response);
            if (response.success) return response.data;
        } catch (error) {
            console.log('Error getting best seller shop: ', error);
            return [];
        }
    };

    useEffect(() => {
        if (shop) {
            const fetchData = async () => {
                const orderStatistics = await handleGetOrderStatistics(shop.shop_id);
                setLocalState({ type: 'SET_ORDER_STATISTICS', payload: orderStatistics });
            };
            fetchData();
        }
    }, [shop]);

    const stats = [
        { label: 'Chờ xác nhận', value: localState?.order_statistics?.status_2, key: 2 },
        { label: 'Chờ lấy hàng', value: localState?.order_statistics?.status_3, key: 3 },
        { label: 'Chờ giao hàng', value: localState?.order_statistics?.status_4, key: 4 },
        { label: 'Hoàn thành', value: localState?.order_statistics?.status_5, key: 5 },
        { label: 'Đã hủy', value: localState?.order_statistics?.status_6, key: 6 },
        { label: 'Trả hàng / hoàn tiền', value: localState?.order_statistics?.status_7, key: 7 },
        { label: 'Sản phẩm hết hàng', value: localState?.order_statistics?.product_sold_out, key: 0 },
        { label: 'Sản phẩm đang hoạt động', value: localState?.order_statistics?.product_active, key: 1 },
    ];

    const handleNavigate = (stat) => {
        if (stat.label === 'Sản phẩm hết hàng' || stat.label === 'Sản phẩm đang hoạt động') {
            navigate('/seller/product-management/all');
        }
        else {
            navigate('/seller/order/shop-orders?status-id=' + stat.key);
        }
    }

    if (!localState.order_statistics) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }} className="mt-2">
            <Row gutter={[16, 16]}>
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            onClick={() => handleNavigate(stat)}
                            style={{ textAlign: 'center', borderRadius: '8px' }}>
                            <Title level={4} className='text-blue-600'>{stat.value ?? 0}</Title>
                            <Text type="secondary">{stat.label}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ToDoList;
