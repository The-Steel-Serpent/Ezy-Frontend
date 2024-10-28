import React, { useEffect, useState } from 'react';
import { Table, message, Button, Modal, Form, Input, Select, DatePicker, TimePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const DiscountVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedVoucherTypeId, setSelectedVoucherTypeId] = useState(null);

  useEffect(() => {
    fetchVouchers();
    fetchEvents();
    fetchVoucherTypes();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/get-all-voucher`);
      if (response.data.success) {
        setVouchers(response.data.vouchers);
      } else {
        message.error('Failed to load vouchers');
      }
    } catch (error) {
      message.error('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-event`);
      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        message.error('Failed to load events');
      }
    } catch (error) {
      message.error('Failed to fetch events');
    }
  };

  const fetchVoucherTypes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/types`);
      if (response.data.success) {
        setVoucherTypes(response.data.voucherTypes || []);
      } else {
        message.error('Failed to load voucher types');
      }
    } catch (error) {
      message.error('Failed to fetch voucher types');
    }
  };

  const handleAddVoucher = async (values) => {
    try {
      const startedAt = moment(`${values.started_at.format('YYYY-MM-DD')} ${values.started_at_time.format('HH:mm:ss')}`);
      const endedAt = moment(`${values.ended_at.format('YYYY-MM-DD')} ${values.ended_at_time.format('HH:mm:ss')}`);

      const formattedValues = {
        ...values,
        sale_events_id: selectedEventId,
        discount_voucher_type_id: selectedVoucherTypeId,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/voucher/add-voucher`, formattedValues);
      if (response.data.success) {
        message.success('Voucher added successfully');
        form.resetFields();
        setIsModalVisible(false);
        fetchVouchers(); // Refresh voucher list
      } else {
        message.error('Failed to add voucher: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error adding voucher:', error);
      message.error('Failed to add voucher: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const columns = [
    {
      title: 'Mã voucher',
      dataIndex: 'discount_voucher_code',
      key: 'discount_voucher_code',
    },
    {
      title: 'Tên voucher',
      dataIndex: 'discount_voucher_name',
      key: 'discount_voucher_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Loại',
      dataIndex: 'discount_type',
      key: 'discount_type',
    },
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
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'started_at',
      key: 'started_at',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'ended_at',
      key: 'ended_at',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: '20px' }}>
        Thêm Voucher
      </Button>
      <Table
        columns={columns}
        dataSource={vouchers}
        loading={loading}
        rowKey="discount_voucher_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />
      
      <Modal
        title="Thêm Voucher"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddVoucher}>
          <Form.Item
            name="discount_voucher_code"
            label="Mã voucher"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount_voucher_name"
            label="Tên voucher"
            rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount_type"
            label="Loại"
            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
          >
            <Select placeholder="Chọn loại" onChange={setSelectedVoucherTypeId}>
              {Array.isArray(voucherTypes) && voucherTypes.length > 0 ? (
                voucherTypes.map(type => (
                  <Option key={type.discount_voucher_type_id} value={type.discount_voucher_type_id}>
                    {type.discount_voucher_type_name}
                  </Option>
                ))
              ) : (
                <Option disabled>Không có loại nào</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="sale_events_id"
            label="Sự kiện áp dụng"
            rules={[{ required: true, message: 'Vui lòng chọn sự kiện!' }]}
          >
            <Select placeholder="Chọn sự kiện" onChange={setSelectedEventId}>
              {Array.isArray(events) && events.length > 0 ? (
                events.map(event => (
                  <Option key={event.sale_events_id} value={event.sale_events_id}>
                    {event.sale_events_name}
                  </Option>
                ))
              ) : (
                <Option disabled>Không có sự kiện nào</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="min_order_value"
            label="Giá trị tối thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị tối thiểu!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="discount_value"
            label="Giá trị giảm"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="discount_max_value"
            label="Giá trị tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị tối đa!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Thời gian áp dụng"
            required
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Item
                name="started_at"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}
              >
                <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày bắt đầu" />
              </Form.Item>
              <Form.Item
                name="started_at_time"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: 'Vui lòng nhập giờ bắt đầu!' }]}
              >
                <TimePicker format="HH:mm:ss" placeholder="Chọn giờ bắt đầu" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label="Thời gian kết thúc"
            required
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Item
                name="ended_at"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc!' }]}
              >
                <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày kết thúc" />
              </Form.Item>
              <Form.Item
                name="ended_at_time"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: 'Vui lòng nhập giờ kết thúc!' }]}
              >
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
