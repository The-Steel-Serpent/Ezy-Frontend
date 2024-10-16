import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal, Table, Upload } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RiImageAddFill } from "react-icons/ri";


function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
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
            render: (text, record) => <img src={record.thumbnail} alt={record.category_name}
                style={{ width: '100px', height: '100px' }} />
        },
        {
            key: '4',
            title: 'Thao tác',
            render: () => (
                <div>
                    <EditOutlined />
                    <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
                </div>
            )
        }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
                setCategories(res.data.categories);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newCategory = await addCategory(values);
            console.log('Added category:', newCategory);
            form.resetFields();
            setCategories([...categories, newCategory]);
            setIsModalVisible(false);
        } catch (error) {
            handleError(error);
        }
    };

    const addCategory = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-categories`, values);
            return response.data;
        } catch (error) {
            console.error("Error adding category: ", error);
            throw error;
        }
    };

    const handleError = (error) => {
        console.error(error);
    };

    const handleCancel = () => {
        setThumbnail([]);
        setIsModalVisible(false);
    };

    const handleUploadThumbnail = async () => {
    };

    return (
        <div>
            <Modal title="Add Category" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="category_name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="Thumbnail" rules={[{ required: true, message: 'Vui lòng tải thumbnail' }]}>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnail}
                            maxCount={1}>
                            {thumbnail.length < 1 && (
                                <div className='flex flex-col items-center '>
                                    <RiImageAddFill size={20} color='#66cce6' />
                                    <div className='text-[#66cce6]'>Thêm ảnh {thumbnail.length}/1</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Button onClick={() => setIsModalVisible(true)} type='primary'>Thêm danh mục</Button>
            <Table
                dataSource={categories}
                columns={columns}
            >
            </Table>
        </div>
    )
}

export default ProductCategory
