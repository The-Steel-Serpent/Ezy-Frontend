import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EditSubCategory from './EditSubCategory';
import AddSubCategory from './AddSubCategory';

function ModalProductSubCategory({ categoryId, visible, onCancel }) {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Added state for pagination
    const [addingSubCategory, setAddingSubCategory] = useState(false);

    useEffect(() => {
        if (visible && categoryId) {
            fetchSubCategories();
            setCurrentPage(1); // Reset to first page when opening the modal
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
            message.error("Lỗi khi lấy dữ liệu");
        } finally {
            setLoading(false);
        }
    };
    const confirmDelete = async (sub_category_id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa danh mục con này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                setLoading(true);
                try {
                    await handleDeleteSubCategory(sub_category_id);
                } catch (error) {
                    console.error('Error deleting sub category:', error);
                    message.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xóa danh mục con.');
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
        { title: 'Tên danh mục con', dataIndex: 'sub_category_name', key: 'name' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button onClick={() => setEditingSubCategory(record)} style={{ marginRight: '8px' }}>
                        Cập nhật
                    </Button>
                    <Button type="primary" danger onClick={() => confirmDelete(record.sub_category_id)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Modal
            title="Quản lý danh mục con"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            {addingSubCategory ? (
                <AddSubCategory
                    categoryId={categoryId}
                    onAdd={fetchSubCategories}
                    onCancel={() => setAddingSubCategory(false)}
                />
            ) : (
                <>
                    {/* Ẩn nút "Thêm danh mục con" khi đang chỉnh sửa danh mục con */}
                    {!editingSubCategory && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="primary"
                                style={{ marginBottom: '16px' }}
                                icon={<PlusOutlined />}
                                onClick={() => setAddingSubCategory(true)}
                            >
                                Thêm danh mục con
                            </Button>
                        </div>
                    )}
                    {editingSubCategory ? (
                        <EditSubCategory
                            subCategory={editingSubCategory}
                            onUpdate={fetchSubCategories}
                            onCancel={() => setEditingSubCategory(null)}
                        />
                    ) : (
                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={subCategories}
                            rowKey="sub_category_id"
                            pagination={{
                                current: currentPage,
                                pageSize: 5,
                                onChange: (page) => setCurrentPage(page),
                            }}
                        />
                    )}
                </>
            )}
        </Modal>
    );

}

export default ModalProductSubCategory;
