import React, { useEffect, useState } from 'react';
import { Table, message, Button, Modal, Form, Input, DatePicker, TimePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Mở rộng dayjs với các plugin
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DiscountVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/get-all-voucher`);
      if (response.data.success) {
        setVouchers(response.data.vouchers);
        setFilteredVouchers(response.data.vouchers);
      } else {
        message.error('Failed to load vouchers');
      }
    } catch (error) {
      message.error('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredVouchers(vouchers);
      return;
    }

    const filtered = vouchers.filter((voucher) => {
      const voucherStartDate = dayjs(voucher.started_at);
      const voucherEndDate = dayjs(voucher.ended_at);

      const isDateInRange =
        (!startDate || voucherStartDate.isSameOrAfter(startDate, 'day')) &&
        (!endDate || voucherEndDate.isSameOrBefore(endDate, 'day'));

      return isDateInRange;
    });

    setFilteredVouchers(filtered);
  };

  const handleAddVoucher = async (values) => {
    try {
      const startedAt = dayjs(`${values.started_at.format('YYYY-MM-DD')} ${values.started_at_time.format('HH:mm:ss')}`);
      const endedAt = dayjs(`${values.ended_at.format('YYYY-MM-DD')} ${values.ended_at_time.format('HH:mm:ss')}`);

      const formattedValues = {
        ...values,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/add-voucher`, formattedValues);
      if (response.data.success) {
        message.success('Voucher added successfully');
        fetchVouchers();
        setIsModalVisible(false);
      } else {
        message.error('Failed to add voucher: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error adding voucher:', error);
      message.error('Failed to add voucher: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Mã voucher', dataIndex: 'discount_voucher_code', key: 'discount_voucher_code' },
    { title: 'Tên voucher', dataIndex: 'discount_voucher_name', key: 'discount_voucher_name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Loại', dataIndex: 'discount_type', key: 'discount_type' },
    {
      title: 'Giá trị tối thiểu',
      dataIndex: 'min_order_value',
      key: 'min_order_value',
      render: (value) => `${value.toLocaleString()} đ`,
    },
    {
      title: 'Giá trị tối đa',
      dataIndex: 'discount_max_value',
      key: 'discount_max_value',
      render: (value) => `${value.toLocaleString()} đ`,
    },
    {
      title: 'Giá trị giảm',
      dataIndex: 'discount_value',
      key: 'discount_value',
      render: (value) => `${value.toLocaleString()} đ`,
    },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Bắt đầu', dataIndex: 'started_at', key: 'started_at', render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss') },
    { title: 'Kết thúc', dataIndex: 'ended_at', key: 'ended_at', render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <DatePicker
            placeholder="Ngày bắt đầu"
            onChange={(date) => setStartDate(date ? dayjs(date) : null)}
            format="YYYY-MM-DD"
          />
          <DatePicker
            placeholder="Ngày kết thúc"
            onChange={(date) => setEndDate(date ? dayjs(date) : null)}
            format="YYYY-MM-DD"
          />
          <Button 
            type="primary" 
            onClick={handleFilter}
          >
            Lọc
          </Button>

        </div>
        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)} 
          style={{ marginBottom: '20px' }}
          icon={<PlusOutlined />}
        >
          Thêm Voucher
        </Button>
      </div>


      <Table
        columns={columns}
        dataSource={filteredVouchers}
        loading={loading}
        rowKey="discount_voucher_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="Thêm Voucher"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddVoucher}>
          <Form.Item name="discount_voucher_code" label="Mã voucher" rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="discount_voucher_name" label="Tên voucher" rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Thời gian áp dụng" required>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Item name="started_at" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}>
                <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày bắt đầu" />
              </Form.Item>
              <Form.Item name="started_at_time" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Vui lòng nhập giờ bắt đầu!' }]}>
                <TimePicker format="HH:mm:ss" placeholder="Chọn giờ bắt đầu" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="Thời gian kết thúc" required>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Item name="ended_at" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc!' }]}>
                <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày kết thúc" />
              </Form.Item>
              <Form.Item name="ended_at_time" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Vui lòng nhập giờ kết thúc!' }]}>
                <TimePicker format="HH:mm:ss" placeholder="Chọn giờ kết thúc" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountVoucher;
