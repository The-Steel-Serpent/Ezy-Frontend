import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Typography, Input, DatePicker, message, Table, Popconfirm } from 'antd';
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
            //message.error('Failed to load categories. Please try again later.');
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
                //message.error('Failed to fetch event categories.');
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
            //message.error('Failed to load event dates. Please try again later.');
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
                                voucher.discount_type === 'KHÔNG THEO PHẦN TRĂM' ? 'KHÔNG THEO PHẦN TRĂM' : 'unknown',
                        quantity: voucher.quantity,
                        usage: voucher.usage,
                        startedAt: voucher.started_at ? dayjs(voucher.started_at) : null,
                        endedAt: voucher.ended_at ? dayjs(voucher.ended_at) : null,
                    }));
                    setVouchers(formattedVouchers);
                    setOriginalVouchers(JSON.parse(JSON.stringify(formattedVouchers)));
                }
            } catch (error) {
                //message.error('Failed to load vouchers. Please try again later.');
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
                            discountType: value === "1" ? "KHÔNG THEO PHẦN TRĂM" : "THEO PHẦN TRĂM", // Default selection
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
            discountVoucherTypeId: null,
            discountValue: '',
            minOrderValue: '',
            discountType: null,
            quantity: '',
            usage: '',
            startedAt: null,
            endedAt: null,
            isNew: true,
        };
        setVouchers([...vouchers, newVoucher]);
    };

    const handleSettingModalOk = async () => {
        try {
            await settingForm.validateFields();
            for (const voucher of vouchers) {
                if (!voucher.code || !voucher.name || !voucher.discountVoucherTypeId || !voucher.discountType || !voucher.discountValue || !voucher.minOrderValue || !voucher.quantity || !voucher.usage || !voucher.startedAt || !voucher.endedAt) {
                    message.warning('Vui lòng nhập đầy đủ thông tin.');
                    return;
                }

            }
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
                    min_order_value: voucher.minOrderValue || 1,
                    discount_value: voucher.discountValue || 0,
                    discount_max_value: voucher.discountMaxValue || 0,
                    quantity: voucher.quantity || 1,
                    usage: voucher.usage || 0,
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
                    usage: voucher.usage || 0,
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
            message.error(error.response.data.message || 'Cài đặt thất bại. Vui lòng thử lại sau.');
            console.error('Error saving vouchers or categories:', error.response ? error.response.data : error.message);
        }


    };

    const handleDeleteVoucher = (voucherId) => {
        setVouchersToDelete(prev => [...prev, voucherId]);

        setVouchers(prevVouchers => prevVouchers.filter(voucher => voucher.key !== voucherId));
    };

    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'code',
            width: 140,
            render: (text, record) => (
                <Input
                    value={text}
                    maxLength={20} // Giới hạn tối đa 20 ký tự
                    onChange={e => {
                        const value = e.target.value.toUpperCase(); // Chuyển sang chữ in hoa
                        const regex = /^[A-Z]*$/; // Chỉ cho phép chữ cái in hoa
                        if (regex.test(value)) {
                            handleVoucherChange(record.key, 'code', value);
                        } else {
                            message.error('Mã voucher chỉ được chứa chữ in hoa.');
                        }
                    }}
                    placeholder="Nhập mã voucher"
                    required
                />
            )
        },

        {
            title: 'Tên Voucher',
            dataIndex: 'name',
            width: 160,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={e => handleVoucherChange(record.key, 'name', e.target.value)}
                    maxLength={50}
                    required
                    placeholder="Nhập tên voucher"
                />
            )


        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 200,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={e => handleVoucherChange(record.key, 'description', e.target.value)}
                    maxLength={255}
                    required
                    placeholder="Nhập mô tả"
                />
            )
        },
        {
            title: 'Loại Voucher',
            dataIndex: 'discountVoucherTypeId',
            width: 160,
            render: (value, record) => (
                <Select
                    value={value || undefined} // Giá trị mặc định là undefined (hiển thị trống)
                    onChange={val => handleVoucherChange(record.key, 'discountVoucherTypeId', val)}
                    style={{ width: '100%' }}
                    required
                    placeholder="Chọn loại voucher"
                >
                    <Option value="1">Giảm phí vận chuyển</Option>
                    <Option value="2">Giảm phí đơn hàng</Option>
                </Select>
            ),
        },
        {
            title: 'Loại giảm giá',
            dataIndex: 'discountType',
            width: 160,
            render: (value, record) => (
                <Select
                    value={value || undefined} // Giá trị mặc định là undefined (hiển thị trống)
                    onChange={val => handleVoucherChange(record.key, 'discountType', val)}
                    style={{ width: '100%' }}
                    required
                    placeholder="Chọn loại giảm giá"
                >

                    <Option value="THEO PHẦN TRĂM">Giảm theo phần trăm</Option>
                    <Option value="KHÔNG THEO PHẦN TRĂM">Giảm theo số tiền</Option>
                </Select>
            ),
        },
        {
            title: 'Giá trị giảm',
            dataIndex: 'discountValue',
            width: 160,
            render: (text, record) => (
                <Input
                    type="number"
                    value={text}
                    min={record.discountType === 'THEO PHẦN TRĂM' ? 1 : 0} // Giá trị tối thiểu cho "THEO PHẦN TRĂM" là 1
                    max={record.discountType === 'THEO PHẦN TRĂM' ? 100 : Infinity} // Giá trị tối đa cho "THEO PHẦN TRĂM" là 100
                    onChange={e => {
                        const value = parseInt(e.target.value, 10) || 0; // Chuyển giá trị sang số nguyên
                        if (
                            record.discountType === 'THEO PHẦN TRĂM' &&
                            (value < 1 || value > 100)
                        ) {
                            message.error('Giá trị giảm theo phần trăm phải nằm trong khoảng 1-100.');
                            return;
                        }
                        handleVoucherChange(record.key, 'discountValue', Math.max(0, value));
                    }}
                    placeholder="Nhập giá trị giảm"
                    required
                />
            )
        },
        { title: 'Giá trị đơn hàng tối thiểu', dataIndex: 'minOrderValue', width: 180, render: (text, record) => <Input type="number" value={text} onChange={e => handleVoucherChange(record.key, 'minOrderValue', e.target.value)} /> },
        {
            title: 'Giá trị giảm tối đa',
            dataIndex: 'discountMaxValue',
            width: 160,
            render: (text, record) => (
                <Input
                    type="number"
                    value={text}
                    min={0}
                    onChange={e => handleVoucherChange(record.key, 'discountMaxValue', e.target.value)}
                    disabled={record.discountType !== 'THEO PHẦN TRĂM'}
                    placeholder="Nhập giá trị đơn hàng tối thiểu"
                    required
                />
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 125,
            render: (text, record) => (
                <Input
                    type="number"
                    value={text}
                    min={1}
                    onChange={e => handleVoucherChange(record.key, 'quantity', Math.max(1, e.target.value))}
                    placeholder="Nhập số lượng"
                    required
                />
            ),
        },
        {
            title: 'Số lần sử dụng',
            dataIndex: 'usage',
            width: 125,
            render: (text, record) => (
                <Input
                    type="number"
                    value={text}
                    min={1}
                    onChange={e => handleVoucherChange(record.key, 'usage', e.target.value)}
                    required
                />
            ),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startedAt',
            width: 180,
            render: (value, record) => (
                <DatePicker
                    value={value}
                    onChange={date => handleVoucherChange(record.key, 'startedAt', date)}
                    disabledDate={current => current && (current < eventStart || current > eventEnd || (record.endedAt && current > record.endedAt))}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ format: 'HH:mm' }}
                    placeholder="Chọn ngày bắt đầu"
                    style={{ width: '100%' }}
                    required
                />
            ),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endedAt',
            width: 180,
            render: (value, record) => (
                <DatePicker
                    value={value}
                    onChange={date => handleVoucherChange(record.key, 'endedAt', date)}
                    disabledDate={current => {
                        if (!record.startedAt || !current) return true; // Ngăn chọn nếu ngày bắt đầu chưa được chọn
                        return (
                            current < record.startedAt.add(2, 'hour') || // Ngăn chọn trước ngày bắt đầu + 2 tiếng
                            current < eventStart || // Ngăn chọn trước ngày bắt đầu sự kiện
                            current > eventEnd     // Ngăn chọn sau ngày kết thúc sự kiện
                        );
                    }}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ format: 'HH:mm' }}
                    placeholder="Chọn ngày kết thúc"
                    style={{ width: '100%' }}
                    required
                />
            ),
        },

        {
            title: 'Hành động',
            dataIndex: 'actions',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa?"
                    onConfirm={() => handleDeleteVoucher(record.key)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button type="primary" danger>
                        Xóa
                    </Button>
                </Popconfirm>
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
