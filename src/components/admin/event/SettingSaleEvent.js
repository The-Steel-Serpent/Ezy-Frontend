import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Typography, Input, Space, DatePicker } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;

const SettingSaleEvent = ({ visible, onCancel, eventId, onSetupComplete }) => {
    const [settingForm] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noCategoriesAvailable, setNoCategoriesAvailable] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchCategories();
            resetForm();
            fetchEventCategories();
            fetchEventVouchers();
        }
    }, [visible, eventId]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
            setCategories(res.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to load categories. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchEventCategories = async () => {
        if (eventId) {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-categories/${eventId}`);
                
                if (res.data.success === false) {
                    setNoCategoriesAvailable(true);
                    settingForm.setFieldsValue({ categories: [] });
                } else {
                    const categoryIds = res.data.data;
                    settingForm.setFieldsValue({ categories: categoryIds });
                    setNoCategoriesAvailable(false);
                }
            } catch (error) {
                console.error('Error fetching event categories:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setNoCategoriesAvailable(false);
            settingForm.setFieldsValue({ categories: [] });
        }
    };

    const fetchEventVouchers = async () => {
        if (eventId) {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-vouchers/${eventId}`);
                if (res.data.success) {
                    const formattedVouchers = res.data.vouchers.map(voucher => ({
                        id: voucher.discount_voucher_id,
                        code: voucher.discount_voucher_code,
                        discountValue: voucher.discount_value,
                        minOrderValue: voucher.min_order_value,
                        discountType: voucher.discount_type.includes('PHẦN TRĂM') ? 'percentage' : 'fixed',
                        quantity: voucher.quantity,
                        startedAt: voucher.started_at ? moment(voucher.started_at) : null,
                        endedAt: voucher.ended_at ? moment(voucher.ended_at) : null,
                    }));
                    setVouchers(formattedVouchers);
                }
            } catch (error) {
                console.error('Error fetching event vouchers:', error);
                message.error('Failed to load vouchers. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        settingForm.resetFields();
        setVouchers([]);
        setNoCategoriesAvailable(false);
    };

    const handleSettingModalOk = async (values) => {
        if (eventId) {
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/set-categories/${eventId}`, {
                    category_ids: values.categories,
                });

                await Promise.all(vouchers.map(voucher =>
                    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/add-voucher-by-event-id/${eventId}`, {
                        event_id: eventId,
                        voucher_code: voucher.code,
                        discount_value: voucher.discountValue,
                        min_order_value: voucher.minOrderValue,
                        discount_type: voucher.discountType,
                        quantity: voucher.quantity,
                        started_at: voucher.startedAt ? voucher.startedAt.toISOString() : null,
                        ended_at: voucher.endedAt ? voucher.endedAt.toISOString() : null,
                    })
                ));
                
                message.success('Cài đặt thành công');
                onSetupComplete(); 
                onCancel(); 
            } catch (error) {
                message.error('Lỗi khi cài đặt cho sự kiện.');
            }
        }
    };

    const addVoucher = () => {
        setVouchers([...vouchers, { id: Date.now(), code: '', discountValue: '', minOrderValue: '', discountType: 'fixed', quantity: '', startedAt: null, endedAt: null }]);
    };

    const handleVoucherChange = (index, field, value) => {
        const newVouchers = [...vouchers];
        if (field === 'startedAt' || field === 'endedAt') {
            newVouchers[index][field] = value ? moment(value) : null;
        } else {
            newVouchers[index][field] = value;
        }
        setVouchers(newVouchers);
    };

    return (
        <Modal
            title="Thiết lập danh mục cho sự kiện"
            visible={visible}
            onCancel={onCancel}
            width={1200}
            footer={null}
            confirmLoading={loading}
        >
            <Form form={settingForm} layout="vertical" onFinish={handleSettingModalOk}>
                <Form.Item
                    label="Chọn danh mục"
                    name="categories"
                    rules={[{ required: !noCategoriesAvailable, message: 'Vui lòng chọn ít nhất một danh mục!' }]}
                >
                    <Select mode="multiple" placeholder="Chọn danh mục" loading={loading} disabled={noCategoriesAvailable}>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <Option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>No categories available</Option>
                        )}
                    </Select>
                </Form.Item>
                {noCategoriesAvailable && (
                    <Text type="danger">Không có danh mục nào cho sự kiện này.</Text>
                )}
                <Form.Item label="Các Voucher đã có">
                    {vouchers.map((voucher, index) => (
                        <Space key={voucher.id} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Input 
                                placeholder="Mã Voucher" 
                                value={voucher.code} 
                                onChange={(e) => handleVoucherChange(index, 'code', e.target.value)} 
                            />
                            <Input 
                                placeholder="Giá trị giảm" 
                                type="number" 
                                value={voucher.discountValue} 
                                onChange={(e) => handleVoucherChange(index, 'discountValue', e.target.value)} 
                            />
                            <Input 
                                placeholder="Giá trị đơn hàng tối thiểu" 
                                type="number" 
                                value={voucher.minOrderValue} 
                                onChange={(e) => handleVoucherChange(index, 'minOrderValue', e.target.value)} 
                            />
                            <Select 
                                value={voucher.discountType} 
                                onChange={(value) => handleVoucherChange(index, 'discountType', value)} 
                                placeholder="Loại giảm giá"
                            >
                                <Option value="fixed">Giảm giá cố định</Option>
                                <Option value="percentage">Giảm theo phần trăm</Option>
                            </Select>
                            <Input 
                                placeholder="Số lượng" 
                                type="number" 
                                value={voucher.quantity} 
                                onChange={(e) => handleVoucherChange(index, 'quantity', e.target.value)} 
                            />
                            <DatePicker 
                                placeholder="Ngày bắt đầu" 
                                value={voucher.startedAt} 
                                onChange={(date) => handleVoucherChange(index, 'startedAt', date)} 
                                showTime={{ format: 'HH:mm' }} 
                                format="YYYY-MM-DD HH:mm" 
                            />
                            <DatePicker 
                                placeholder="Ngày kết thúc" 
                                value={voucher.endedAt} 
                                onChange={(date) => handleVoucherChange(index, 'endedAt', date)} 
                                showTime={{ format: 'HH:mm' }} 
                                format="YYYY-MM-DD HH:mm" 
                            />
                        </Space>
                    ))}
                    <Button type="dashed" onClick={addVoucher} style={{ width: '100%' }}>
                        Thêm Voucher
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu cài đặt
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SettingSaleEvent;
