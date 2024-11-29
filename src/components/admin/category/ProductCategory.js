import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal, Table, Upload, message } from 'antd';
import { RiImageAddFill } from "react-icons/ri";
import uploadFile from '../../../helpers/uploadFile';
import ModalProductSubCategory from './ModalProductSubCategory';
import { PlusOutlined } from '@ant-design/icons';
import { set } from 'lodash';

function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
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
                    <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => handleManageSubCategory(record.category_id)}>Danh mục con</Button>
                    <Button type="primary" style={{ marginLeft: '8px' }} danger loading={loading} onClick={() => handleDelete(record.category_id)}>Xóa</Button>
                </div>
            )
        }
    ];

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
            setCategories(res.data.categories);
            setFilteredCategories(res.data.categories);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter(category =>
            category.category_name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchKeyword, categories]);

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);

        setLoading(true);

        setTimeout(() => {
            if (!keyword) {
                setFilteredCategories(categories);
                setLoading(false);
                return;
            }

            const filtered = categories.filter(category =>
                category.category_name.toLowerCase().includes(keyword.toLowerCase())
            );

            setFilteredCategories(filtered);
            setLoading(false);
        }, 500);
    };

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
        }
        return null;
    };

    const handleAddOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            await handleAddCategory(values);
        } catch (error) {
            handleError(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleEditOk = async () => {
        try {
            const values = await form.validateFields();
            await handleUpdateCategory(values);
        } catch (error) {
            handleError(error);
        }
    };

    const addCategory = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-category`, values);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteCategory = async (category_id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-category/${category_id}`);
            if (response.data.success) {

                return response.data;
            }
        }
        catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || 'Có lỗi xảy ra trong quá trình xóa danh mục.');
            }
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const updateCategory = async (category_id, updatedData) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/update-category/${category_id}`, updatedData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Lỗi cập nhật danh mục.');
            }
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleEdit = (record) => {
        setCurrentCategoryId(record.category_id);
        form.setFieldsValue({ category_name: record.category_name });
        setThumbnail({ url: record.thumbnail });
        setIsEditModalVisible(true);
    };

    const confirmDelete = async (category_id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa danh mục này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                setLoading(true);
                try {
                    await deleteCategory(category_id);
                    message.success('Xóa danh mục thành công!', 2); // Để thời gian hiện thông báo là 2 giây
                    fetchCategories(); // Tải lại danh sách sau khi thông báo thành công
                } catch (error) {
                    console.error('Error deleting category:', error);
                    message.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xóa danh mục.');
                } finally {
                    setLoading(false);
                }
            },
            okButtonProps: {
                style: {
                    backgroundColor: 'red',
                    borderColor: 'red',
                    color: 'white',
                },
                loading: loading,
            },
        });
    };

    const handleDelete = (category_id) => {
        confirmDelete(category_id);
    };

    const handleError = (error) => {
        console.error(error);
        message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
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

    const handleManageSubCategory = (categoryId) => {
        setCurrentCategoryId(categoryId);
        setIsSubCategoryModalVisible(true);
    };

    return (
        <div>
            <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">Danh mục sản phẩm</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Input
                        placeholder="Tìm kiếm danh mục..."
                        value={searchKeyword}
                        onChange={handleSearch}
                        style={{ marginBottom: '16px', width: '300px' }}
                    />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalVisible(true)}
                    style={{ marginBottom: '16px' }}
                >
                    Thêm danh mục
                </Button>
            </div>
            <ModalProductSubCategory
                categoryId={currentCategoryId}
                visible={isSubCategoryModalVisible}
                onCancel={() => setIsSubCategoryModalVisible(false)}
            />
            <Modal title="Thêm danh mục" visible={isAddModalVisible} loading={loading} onOk={handleAddOk} onCancel={handleAddCancel}>
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
            <Modal title="Sửa danh mục" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="category_name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thumbnail">
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
            <Table
                loading={loading}
                columns={columns}
                dataSource={filteredCategories}
                pagination={{ pageSize: 5 }}
                rowKey="category_id"
            />
        </div>
    );
}

export default ProductCategory;
