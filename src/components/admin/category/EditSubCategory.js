import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const EditSubCategory = ({ subCategory, onUpdate, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (subCategory) {
            form.setFieldsValue({
                sub_category_name: subCategory.sub_category_name,
            });
        }
    }, [subCategory, form]);

    const handleUpdateSubCategory = async (values) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/update-sub-category/${subCategory.sub_category_id}`, values);
            message.success('Cập nhật thành công');
            onUpdate();
            form.resetFields();
            onCancel();
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleUpdateSubCategory}>
            <Form.Item
                name="sub_category_name"
                label="Tên danh mục con"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                Cập nhật
            </Button>
            <Button onClick={onCancel}>
                Hủy
            </Button>
        </Form>
    );
};

export default EditSubCategory;
