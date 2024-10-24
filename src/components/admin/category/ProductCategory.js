import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal, Table, Upload, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RiImageAddFill } from "react-icons/ri";
import uploadFile from '../../../helpers/uploadFile';

function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            key: '1',
            title: 'ID',
            dataIndex: 'category_id',
        },
        {
            key: '2',
            title: 'Tên danh mục',
            dataIndex: 'category_name',
        },
        {
            key: '3',
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            render: (text, record) => (
                <img src={record.thumbnail} alt={record.category_name} style={{ width: '100px', height: '100px' }} />
            ),
        },
        {
            key: '4',
            title: 'Thao tác',
            render: (text, record) => (
                <div>
                    <EditOutlined
                        style={{ marginRight: 12 }}
                        onClick={() => handleEdit(record)}
                    />
                    <DeleteOutlined
                        style={{ color: "red" }}
                        onClick={() => handleDelete(record.category_id)}
                    />
                </div>
            ),
        },
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
            resetForm();
        } catch (error) {
            handleError(error);
        }
    };

    const handleUpdateCategory = async (values) => {
        try {
            const uploadResponse = await handleThumbnailUpload();
            if (uploadResponse) {
                values.thumbnail = uploadResponse.secure_url;
            } else {
                const existingCategory = categories.find(cat => cat.category_id === currentCategoryId);
                values.thumbnail = existingCategory.thumbnail;
            }
            await updateCategory(currentCategoryId, values);
            await fetchCategories();
            message.success('Cập nhật danh mục thành công!');
            resetForm();
        } catch (error) {
            handleError(error);
        }
    };

    const handleThumbnailUpload = async () => {
        if (thumbnail.length > 0) {
            const file = thumbnail[0].originFileObj;
            const uploadPath = 'ezy-app-file';
            const uploadResponse = await uploadFile(file, uploadPath);
            if (uploadResponse.secure_url) {
                return uploadResponse;
            } else {
                throw new Error('Failed to upload image');
            }
        }
        return null;
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (isEditMode) {
                await handleUpdateCategory(values);
            } else {
                await handleAddCategory(values);
            }
        } catch (error) {
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
                throw new Error(error.response.data.message || 'Error updating category');
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
        setIsEditMode(true);
        setCurrentCategoryId(record.category_id);
        form.setFieldsValue({
            category_name: record.category_name,
            thumbnail: record.thumbnail,
        });
        setThumbnail([{ url: record.thumbnail }]);
        setIsModalVisible(true);
    };

    const handleDelete = async (category_id) => {
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

    const handleError = (error) => {
        console.error(error);
        if (error.response) {
            message.error(error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } else {
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const resetForm = () => {
        form.resetFields();
        setThumbnail([]);
        setIsModalVisible(false);
        setIsEditMode(false);
        setCurrentCategoryId(null);
    };

    const handleCancel = () => {
        resetForm();
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

    const handleChange = ({ fileList }) => {
        setThumbnail(fileList.length > 0 ? fileList : []);
    };

    return (
        <div>
            <Modal title={isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="category_name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="Thumbnail" rules={[{ required: true, message: 'Vui lòng tải thumbnail' }]}>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnail}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            customRequest={({ file, onSuccess }) => {
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                        >
                            {thumbnail.length < 1 && (
                                <div className='flex flex-col items-center'>
                                    <RiImageAddFill size={20} color='#66cce6' />
                                    <div className='text-[#66cce6]'>Thêm ảnh {thumbnail.length}/1</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Button onClick={() => setIsModalVisible(true)} type='primary'>Thêm danh mục</Button>
            <Table dataSource={categories} columns={columns} loading={loading} />
        </div>
    );
}

export default ProductCategory;