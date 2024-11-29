import React from 'react'
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
const AddSubCategory = ({ categoryId, onAdd, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleAddSubCategory = async (values) => {
        setLoading(true);
        try {
            //console.log("Payload gửi lên:", values);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-sub-category/${categoryId}`, values);
            //console.log("API Response:", response.data);
            message.success('Thêm danh mục con thành công!');
            onAdd(); 
            form.resetFields(); 
            onCancel();
        } catch (error) {
            console.error("Error response:", error.response);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục con.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Form form={form} layout="vertical" onFinish={handleAddSubCategory}>
            <Form.Item
                name="sub_category_name"
                label="Tên danh mục con"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục con!' }]}
            >
                <Input />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onCancel} style={{ marginRight: '8px' }}>
                    Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Thêm danh mục con
                </Button>
            </div>
        </Form>
    );
};
export default AddSubCategory