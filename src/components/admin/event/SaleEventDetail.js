import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Table, Spin } from 'antd';

const SaleEventDetail = ({ eventId, visible, onClose }) => {
    const [vouchers, setVouchers] = useState([]);
    const [shops, setShops] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [showVouchersTable, setShowVouchersTable] = useState(false); 
    const [showShopsTable, setShowShopsTable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const vouchersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-vouchers/${eventId}`);
                const shopsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-shops/${eventId}`); // Fetch shops

                if (vouchersResponse.data.success) {
                    setVouchers(vouchersResponse.data.vouchers);
                } else {
                    setVouchers([]);
                }

                if (shopsResponse.data.success) {
                    setShops(shopsResponse.data.shops);
                } else {
                    setShops([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setVouchers([]);
                setShops([]);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchData();
        }
    }, [eventId]);

    if (loading) {
        //return <Spin tip="Loading..." />;
    }

    const voucherColumns = [
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Mã Voucher</div>,
            dataIndex: 'discount_voucher_code',
            key: 'discount_voucher_code',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Tên Voucher</div>,
            dataIndex: 'discount_voucher_name',
            key: 'discount_voucher_name',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Mô tả</div>,
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Loại giảm giá</div>,
            dataIndex: 'discount_type',
            key: 'discount_type',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Giá trị tối thiểu</div>,
            dataIndex: 'min_order_value',
            key: 'min_order_value',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Giá trị giảm giá</div>,
            dataIndex: 'discount_value',
            key: 'discount_value',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Số lượng</div>,
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: <div style={{ whiteSpace: 'nowrap' }}>Thời gian hiệu lực</div>,
            dataIndex: 'validity',
            key: 'validity',
            render: (text, record) => (
                `${new Date(record.started_at).toLocaleString()} - ${new Date(record.ended_at).toLocaleString()}`
            ),
        },
    ];
    

    const shopColumns = [
        {
            title: 'Shop ID',
            dataIndex: 'shop_id',
            key: 'shop_id',
        },
        {
            title: 'Shop Name',
            dataIndex: 'shop_name',
            key: 'shop_name',
        },
        {
            title: 'Shop Address',
            dataIndex: 'shop_address',
            key: 'shop_address',
        },
    ];

    const voucherDataSource = vouchers.map((voucher, index) => ({
        key: index + 1,
        ...voucher,
    }));

    const shopDataSource = shops.map((shop, index) => ({
        key: index + 1,
        ...shop,
    }));

    return (
        <Modal
            title={`Chi tiết sự kiện ID: ${eventId}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1300}
        >
            {vouchers.length === 0 ? (
                <div>Không có voucher nào áp dụng cho sự kiện này.</div>
            ) : (
                <>
                    <span
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                        onClick={() => setShowVouchersTable(!showVouchersTable)}
                    >
                        {showVouchersTable ? 'Ẩn danh sách voucher' : 'Xem danh sách voucher'}
                    </span>
                    {showVouchersTable && (
                        <Table dataSource={voucherDataSource} columns={voucherColumns} pagination={false} />
                    )}
                </>
            )}

            <hr />

            {shops.length === 0 ? (
                <div>Không có shop nào đăng ký cho sự kiện này.</div>
            ) : (
                <>
                    <span
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                        onClick={() => setShowShopsTable(!showShopsTable)}
                    >
                        {showShopsTable ? 'Ẩn danh sách shop' : 'Xem danh sách shop'}
                    </span>
                    {showShopsTable && (
                        <Table dataSource={shopDataSource} columns={shopColumns} pagination={false} />
                    )}
                </>
            )}
        </Modal>
    );
};

export default SaleEventDetail;
