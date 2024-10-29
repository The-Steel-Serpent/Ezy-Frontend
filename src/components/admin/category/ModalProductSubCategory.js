import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Input, Table, message } from 'antd';

function ModalProductSubCategory({ categoryId, visible, onCancel }) {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [editingSubCategory, setEditingSubCategory] = useState(null);

    useEffect(() => {
        if (visible && categoryId) {
            fetchSubCategories();
        }
    }, [visible, categoryId]);

    const fetchSubCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sub-categories/${categoryId}`);
            const sortedSubCategories = res.data.subCategories.sort((a, b) => a.sub_category_id - b.sub_category_id);
            setSubCategories(sortedSubCategories);
        } catch (error) {
            console.error(error);
            message.error("Lổi khi lấy dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubCategory = async (values) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-sub-category/${categoryId}`, values);
            message.success('Thêm mới thành công');
            await fetchSubCategories();
            form.resetFields();
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubCategory = (subCategory) => {
        setEditingSubCategory(subCategory);
        form.setFieldsValue({ sub_category_name: subCategory.sub_category_name });
    };

    const handleUpdateSubCategory = async (values) => {
        if (!editingSubCategory) return;

        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/update-sub-category/${editingSubCategory.sub_category_id}`, values);
            message.success('Cập nhật thành công');
            await fetchSubCategories();
            form.resetFields();
            setEditingSubCategory(null);
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubCategory = async (sub_category_id) => {
        setLoading(true);
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-sub-category/${sub_category_id}`);
            message.success('Xóa thành công');
            await fetchSubCategories();
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'sub_category_id', key: 'id' },
        { title: 'Subcategory Name', dataIndex: 'sub_category_name', key: 'name' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEditSubCategory(record)} style={{ marginRight: '8px' }}>
                        Cập nhật
                    </Button>
                    <Button type="primary" style={{ marginLeft: '8px' }} danger onClick={() => handleDeleteSubCategory(record.sub_category_id)}>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Modal
            title="Manage Subcategories"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={editingSubCategory ? handleUpdateSubCategory : handleAddSubCategory}>
                <Form.Item
                    name="sub_category_name"
                    label="Subcategory Name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginBottom: '16px' }} loading={loading}>
                    {editingSubCategory ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </Form>
            <Table
                loading={loading}
                columns={columns}
                dataSource={subCategories}
                rowKey="sub_category_id"
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
}

export default ModalProductSubCategory;
