import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal, Table, Upload, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RiImageAddFill } from "react-icons/ri";
import uploadFile from '../../../helpers/uploadFile';

function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { key: '1', title: 'ID', dataIndex: 'category_id' },
        { key: '2', title: 'Tên danh mục', dataIndex: 'category_name' },
        {
            key: '3', title: 'Thumbnail', dataIndex: 'thumbnail', render: (text, record) => (
                <img src={record.thumbnail} alt={record.category_name} style={{ width: '100px', height: '100px' }} />
            )
        },
        {
            key: '4', title: 'Thao tác', render: (text, record) => (
                <div>
                    <EditOutlined style={{ marginRight: 12 }} onClick={() => handleEdit(record)} />
                    <DeleteOutlined style={{ color: "red" }} onClick={() => handleDelete(record.category_id)} />
                </div>
            )
        }
    ];

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
            setCategories(res.data.categories);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (values) => {
        try {
            const uploadResponse = await handleThumbnailUpload();
            if (uploadResponse) {
                values.thumbnail = uploadResponse.secure_url;
            }
            await addCategory(values);
            await fetchCategories();
            message.success('Thêm danh mục thành công!');
            resetAddForm();
        } catch (error) {
            handleError(error);
        }
    };

    const handleUpdateCategory = async (values) => {
        try {
            const existingCategory = categories.find(cat => cat.category_id === currentCategoryId);
            if (!existingCategory) throw new Error('Danh mục không tồn tại.');

            if (thumbnail && thumbnail.originFileObj) {
                const uploadResponse = await handleThumbnailUpload();
                values.thumbnail = uploadResponse ? uploadResponse.secure_url : existingCategory.thumbnail;
            } else {
                values.thumbnail = existingCategory.thumbnail;
            }

            await updateCategory(currentCategoryId, values);
            await fetchCategories();
            message.success('Cập nhật danh mục thành công!');
            resetEditForm();
        } catch (error) {
            console.error('Error during category update:', error);
            handleError(error);
        }
    };

    const handleThumbnailUpload = async () => {
        if (thumbnail && thumbnail.originFileObj) {
            const file = thumbnail.originFileObj;
            const uploadPath = 'ezy-app-file';

            try {
                const uploadResponse = await uploadFile(file, uploadPath);
                if (uploadResponse && uploadResponse.secure_url) {
                    return uploadResponse;
                } else {
                    throw new Error('Không nhận được URL.');
                }
            } catch (error) {
                console.error('Lỗi khi tải lên ảnh:', error);
                throw new Error('Tải ảnh lên không thành công. Vui lòng thử lại.');
            }
        } else {
            console.warn('Không có tệp ảnh để tải lên.');
        }
        return null;
    };

    const handleAddOk = async () => {
        try {
            const values = await form.validateFields();
            await handleAddCategory(values);
        } catch (error) {
            console.error('Form validation error:', error);
            handleError(error);
        }
    };

    const handleEditOk = async () => {
        try {
            const values = await form.validateFields();
            await handleUpdateCategory(values);
        } catch (error) {
            console.error('Form validation error:', error);
            handleError(error);
        }
    };

    const addCategory = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-category`, values);
            return response.data;
        } catch (error) {
            console.error("Error adding category: ", error);
            throw error;
        }
    };

    const deleteCategory = async (category_id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-category/${category_id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || 'Có lỗi xảy ra trong quá trình xóa danh mục.');
            }
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const updateCategory = async (category_id, updatedData) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/update-category/${category_id}`, updatedData);
            console.log('Category updated:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Lổi cập nhật danh mục.');
            } else if (error.request) {
                console.error('No response received:', error.request);
                throw new Error('No response received from the server.');
            } else {
                console.error('Error message:', error.message);
                throw new Error('Error in request setup.');
            }
        }
    };

    const handleEdit = (record) => {
        setCurrentCategoryId(record.category_id);
        form.setFieldsValue({ category_name: record.category_name });
        setThumbnail({ url: record.thumbnail });
        setIsEditModalVisible(true);
    };

    const confirmDelete = async (category_id) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa danh mục này?');
        if (confirm) {
            try {
                await deleteCategory(category_id);
                message.success('Xóa danh mục thành công!');
                fetchCategories();
            } catch (error) {
                message.error(error.message);
            }
        }
    };

    const handleDelete = (category_id) => {
        confirmDelete(category_id);
    };

    const handleError = (error) => {
        console.error(error);
        if (error.response) {
            message.error(error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } else {
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const resetAddForm = () => {
        form.resetFields();
        setThumbnail(null);
        setIsAddModalVisible(false);
    };

    const resetEditForm = () => {
        form.resetFields();
        setThumbnail(null);
        setIsEditModalVisible(false);
        setCurrentCategoryId(null);
    };

    const handleAddCancel = () => {
        resetAddForm();
    };

    const handleEditCancel = () => {
        resetEditForm();
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ có thể upload file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = ({ file }) => {
        if (file.status === 'removed') {
            setThumbnail(null);
        } else {
            setThumbnail(file);
        }
    };

    return (
        <div>
            <Modal title="Thêm danh mục" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="category_name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="Thumbnail" rules={[{ required: true, message: 'Vui lòng tải thumbnail!' }]}>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnail ? [thumbnail] : []}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {!thumbnail && <div><RiImageAddFill size={25} /><p>Tải ảnh lên</p></div>}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Cập nhật danh mục" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="category_name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="Thumbnail">
                        <Upload
                            listType="picture-card"
                            fileList={thumbnail ? [thumbnail] : []}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {!thumbnail && <div><RiImageAddFill size={25} /><p>Tải ảnh lên</p></div>}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                    Thêm danh mục
                </Button>
            </div>
            <Table columns={columns} dataSource={categories} rowKey="category_id" loading={loading} />
        </div>
    );
}

export default ProductCategory;