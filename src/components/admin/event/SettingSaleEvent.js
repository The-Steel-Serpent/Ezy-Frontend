import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Typography, Input, DatePicker, message, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

const SettingSaleEvent = ({ visible, onCancel, eventId, onSetupComplete }) => {
    const [settingForm] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noCategoriesAvailable, setNoCategoriesAvailable] = useState(false);
    const [eventStart, setEventStart] = useState(null);
    const [eventEnd, setEventEnd] = useState(null);
    const [originalVouchers, setOriginalVouchers] = useState([]);
    const [vouchersToDelete, setVouchersToDelete] = useState([]);

    useEffect(() => {
        if (visible) {
            initializeForm();
        }
    }, [visible, eventId]);

    const initializeForm = () => {
        fetchCategories();
        resetForm();
        fetchEventCategories();
        fetchEventVouchers();
        fetchEventDates();
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
            setCategories(res.data.categories || []);
        } catch (error) {
            message.error('Failed to load categories. Please try again later.');
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventCategories = async () => {
        if (eventId) {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-categories/${eventId}`);
                if (res.data.success) {
                    settingForm.setFieldsValue({ categories: res.data.data });
                } else {
                    setNoCategoriesAvailable(true);
                    settingForm.setFieldsValue({ categories: [] });
                }
            } catch (error) {
                message.error('Failed to fetch event categories.');
                console.error('Error fetching event categories:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchEventDates = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-event-by-id/${eventId}`);
            if (res.data.success) {
                setEventStart(dayjs(res.data.data.started_at));
                setEventEnd(dayjs(res.data.data.ended_at));
            }
        } catch (error) {
            message.error('Failed to load event dates. Please try again later.');
            console.error('Error fetching event dates:', error);
        }
    };

    const fetchEventVouchers = async () => {
        if (eventId) {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-vouchers/${eventId}`);
                if (res.data.success) {
                    const formattedVouchers = res.data.vouchers.map(voucher => ({
                        key: voucher.discount_voucher_id,
                        code: voucher.discount_voucher_code,
                        name: voucher.discount_voucher_name,
                        description: voucher.description || '',
                        discountVoucherTypeId: String(voucher.discount_voucher_type_id) || '',
                        discountValue: voucher.discount_value,
                        minOrderValue: voucher.min_order_value,
                        discountMaxValue: voucher.discount_max_value,
                        discountType:
                        voucher.discount_type === 'THEO PHẦN TRĂM' ? 'THEO PHẦN TRĂM' :
                        voucher.discount_type === 'KHÔNG THEO PHẦN TRĂM' ? 'KHÔNG THEO PHẦN TRĂM' :
                        voucher.discount_type === 'MIỄN PHÍ VẬN CHUYỂN' ? 'MIỄN PHÍ VẬN CHUYỂN' : 'unknown',
                        quantity: voucher.quantity,
                        startedAt: voucher.started_at ? dayjs(voucher.started_at) : null,
                        endedAt: voucher.ended_at ? dayjs(voucher.ended_at) : null,
                    }));
                    setVouchers(formattedVouchers);
                    setOriginalVouchers(JSON.parse(JSON.stringify(formattedVouchers)));
                }
            } catch (error) {
                message.error('Failed to load vouchers. Please try again later.');
                console.error('Error fetching event vouchers:', error);
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

    const handleVoucherChange = (key, field, value) => {
        if (['discountValue', 'minOrderValue', 'quantity'].includes(field) && value < 0) {
            value = 0;
        }
        setVouchers(prevVouchers =>
            prevVouchers.map(voucher =>
                voucher.key === key ? { ...voucher, [field]: value } : voucher
            )
        );
        if (field === 'discountVoucherTypeId') {
            setVouchers(prevVouchers =>
                prevVouchers.map(voucher =>
                    voucher.key === key
                        ? {
                              ...voucher,
                              discountType: value === "1" ? "MIỄN PHÍ VẬN CHUYỂN" : "THEO PHẦN TRĂM", // Default selection
                          }
                        : voucher
                )
            );
        }
    };

    const addVoucher = () => {
        const newVoucher = {
            key: Date.now(),
            code: '',
            name: '',
            description: '',
            discountVoucherTypeId: '',
            discountValue: '',
            minOrderValue: '',
            discountType: 'MIỄN PHÍ VẬN CHUYỂN',
            quantity: '',
            startedAt: null,
            endedAt: null,
            isNew: true,
        };
        setVouchers([...vouchers, newVoucher]);
    };

    const handleSettingModalOk = async () => {
        try {
            await settingForm.validateFields();
            const selectedCategories = settingForm.getFieldValue('categories');
    
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/set-categories/${eventId}`, {
                category_ids: selectedCategories,
            });
    
            const newVouchers = vouchers.filter(voucher => voucher.isNew);
            const modifiedVouchers = vouchers.filter(voucher => {
                const original = originalVouchers.find(orig => orig.key === voucher.key);
                return original && JSON.stringify(voucher) !== JSON.stringify(original);
            });

            const newVoucherPromises = newVouchers.map(voucher => axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/voucher/add-voucher-by-event-id/${eventId}`,
                {
                    sale_events_id: eventId,
                    discount_voucher_type_id: voucher.discountVoucherTypeId || '',
                    discount_voucher_code: voucher.code || '',
                    discount_voucher_name: voucher.name || '',
                    description: voucher.description || '',
                    discount_type: voucher.discountType,  
                    min_order_value: voucher.minOrderValue || 0,
                    discount_value: voucher.discountValue || 0,
                    discount_max_value: voucher.discountMaxValue || 0,
                    quantity: voucher.quantity || 1,
                    started_at: voucher.startedAt ? voucher.startedAt.format('YYYY-MM-DD HH:mm:ss') : null,
                    ended_at: voucher.endedAt ? voucher.endedAt.format('YYYY-MM-DD HH:mm:ss') : null,
                }
            ));

            const updateVoucherPromises = modifiedVouchers.map(voucher => {
                const updatedFields = {
                    sale_events_id: eventId,
                    discount_voucher_type_id: voucher.discountVoucherTypeId || '',
                    discount_voucher_code: voucher.code || '',
                    discount_voucher_name: voucher.name || '',
                    description: voucher.description || '',
                    discount_type: voucher.discountType,
                    min_order_value: voucher.minOrderValue || 0,
                    discount_value: voucher.discountValue || 0,
                    discount_max_value: voucher.discountMaxValue || 0,
                    quantity: voucher.quantity || 1,
                    started_at: voucher.startedAt ? voucher.startedAt.format('YYYY-MM-DD HH:mm:ss') : null,
                    ended_at: voucher.endedAt ? voucher.endedAt.format('YYYY-MM-DD HH:mm:ss') : null,
                };

                return axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/voucher/update-voucher/${voucher.key}`,
                    updatedFields
                );
            });
            const deleteVoucherPromises = vouchersToDelete.map(voucherId => 
                axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/delete-voucher/${voucherId}`)
            );

            await Promise.all([...newVoucherPromises, ...updateVoucherPromises, ...deleteVoucherPromises]);
    
            message.success('Cài đặt thành công');
            onSetupComplete();
            onCancel();
    
            fetchEventVouchers();
        } catch (error) {
            message.error('Lỗi khi cài đặt cho sự kiện.');
            console.error('Error saving vouchers or categories:', error.response ? error.response.data : error.message);
        }

        
    };

    const handleDeleteVoucher = (voucherId) => {
        setVouchersToDelete(prev => [...prev, voucherId]);
    
        setVouchers(prevVouchers => prevVouchers.filter(voucher => voucher.key !== voucherId));
    };
    
    const columns = [
        { title: 'Mã Voucher', dataIndex: 'code', width: 140, render: (text, record) => <Input value={text} onChange={e => handleVoucherChange(record.key, 'code', e.target.value)} /> },
        { title: 'Tên Voucher', dataIndex: 'name', width: 160, render: (text, record) => <Input value={text} onChange={e => handleVoucherChange(record.key, 'name', e.target.value)} /> },
        { title: 'Mô tả', dataIndex: 'description', width: 200, render: (text, record) => <Input value={text} onChange={e => handleVoucherChange(record.key, 'description', e.target.value)} /> },
        {
            title: 'Loại Voucher', dataIndex: 'discountVoucherTypeId', width: 160,
            render: (value, record) => (
                <Select value={value} onChange={val => handleVoucherChange(record.key, 'discountVoucherTypeId', val)} style={{ width: '100%' }}>
                    <Option value="1">Miễn phí vận chuyển</Option>
                    <Option value="2">Giảm giá đơn hàng</Option>
                </Select>
            ),
        },
        {
            title: 'Loại giảm giá', dataIndex: 'discountType', width: 160,
            render: (value, record) => (
                <Select
                    value={value}
                    onChange={val => handleVoucherChange(record.key, 'discountType', val)}
                    style={{ width: '100%' }}
                >
                    {record.discountVoucherTypeId === "1" && <Option value="MIỄN PHÍ VẬN CHUYỂN">Free Ship</Option>}
                    <Option value="THEO PHẦN TRĂM">Giảm theo phần trăm</Option>
                    <Option value="KHÔNG THEO PHẦN TRĂM">Giảm theo số tiền</Option>
                </Select>
            ),
        },
        { title: 'Giá trị giảm', dataIndex: 'discountValue', width: 160, render: (text, record) => <Input type="number" value={text} onChange={e => handleVoucherChange(record.key, 'discountValue', e.target.value)} /> },
        { title: 'Giá trị đơn hàng tối thiểu', dataIndex: 'minOrderValue', width: 180, render: (text, record) => <Input type="number" value={text} onChange={e => handleVoucherChange(record.key, 'minOrderValue', e.target.value)} /> },
        {
            title: 'Giá trị giảm tối đa',
            dataIndex: 'discountMaxValue',
            width: 160,
            render: (text, record) => (
                <Input
                    type="number"
                    value={text}
                    onChange={e => handleVoucherChange(record.key, 'discountMaxValue', e.target.value)}
                    disabled={record.discountType !== 'THEO PHẦN TRĂM'} // Khóa nếu không phải giảm "Theo Phần Trăm"
                />
            ),
        },
        { title: 'Số lượng', dataIndex: 'quantity', width: 125, render: (text, record) => <Input type="number" value={text} onChange={e => handleVoucherChange(record.key, 'quantity', e.target.value)} /> },
        {
            title: 'Ngày bắt đầu', dataIndex: 'startedAt', width: 180,
            render: (value, record) => (
                <DatePicker
                    value={value}
                    onChange={date => handleVoucherChange(record.key, 'startedAt', date)}
                    disabledDate={current => current && (current < eventStart || current > eventEnd)}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ format: 'HH:mm' }}
                />
            ),
        },
        {
            title: 'Ngày kết thúc', dataIndex: 'endedAt', width: 180,
            render: (value, record) => (
                <DatePicker
                    value={value}
                    onChange={date => handleVoucherChange(record.key, 'endedAt', date)}
                    disabledDate={current => current && (current < eventStart || current > eventEnd)}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ format: 'HH:mm' }}
                />
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            width: 100,
            render: (_, record) => (
                <Button type="primary" danger onClick={() => handleDeleteVoucher(record.key)}>
                    Xóa
                </Button>
            ),
        },
    ];
    

    return (
        <Modal title="Thiết lập cho sự kiện" visible={visible} onCancel={onCancel} width={1400} footer={null} confirmLoading={loading}>
            <Form form={settingForm} layout="vertical" onFinish={handleSettingModalOk}>
                <Form.Item label="Chọn danh mục" name="categories" rules={[{ required: !noCategoriesAvailable, message: 'Vui lòng chọn ít nhất một danh mục!' }]}>
                    <Select mode="multiple" placeholder="Chọn danh mục" loading={loading} disabled={noCategoriesAvailable}>
                        {categories.map(category => (
                            <Option key={category.category_id} value={category.category_id}>{category.category_name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                {noCategoriesAvailable && <Text type="danger">Không có danh mục nào cho sự kiện này.</Text>}
                <Form.Item label="Danh sách Voucher">
                    <Table columns={columns} dataSource={vouchers} pagination={false} scroll={{ x: 'max-content', y: 400 }} />
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Button type="dashed" onClick={addVoucher} style={{ width: '200px' }}>Thêm Voucher</Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>Lưu cài đặt</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SettingSaleEvent;
