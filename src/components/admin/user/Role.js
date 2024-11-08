import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddRole from './AddRole';
import EditRole from './EditRole';

const Role = () => {
  const [roleData, setRoleData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-role`);
      if (response.data.success) {
        setRoleData(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const handleAddRole = (newRole) => {
    setRoleData((prevData) => [...prevData, newRole]);
    message.success('Role đã được thêm thành công!');
    handleCloseModal();
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const showDeleteConfirm = (role) => {
    setRoleToDelete(role);
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa vai trò này?',
      content: `Vai trò: ${role.role_name}`,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk: () => handleDeleteRole(role.role_id),
      okButtonProps: {
        style: {
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white',
        },
      },
    });
  };

  const handleDeleteRole = async (roleId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-role/${roleId}`);
      if (response.data.success) {
        setRoleData((prevData) => prevData.filter(role => role.role_id !== roleId));
        message.success('Role đã được xóa thành công!');
      } else {
        message.error('Không thể xóa vai trò này!');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEditRole = (role) => {
    setRoleToEdit(role);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setRoleToEdit(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'role_id',
      key: 'role_id',
    },
    {
      title: 'Tên quyền',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEditRole(record)}>
            Cập nhật
          </Button>
          <Button type="primary" danger onClick={() => showDeleteConfirm(record)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          style={{ marginBottom: 16, float: 'right' }}
        >
          Thêm Role
        </Button>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={roleData}
          rowKey="role_id"
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal for Adding Role */}
      <Modal
        title="Thêm Role"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <AddRole onAdd={handleAddRole} />
      </Modal>

      <EditRole
        role={roleToEdit}
        isVisible={isEditModalVisible}
        onClose={handleCloseEditModal}
        onUpdate={(updatedRole) => {
          setRoleData((prevData) => prevData.map((role) =>
            role.role_id === updatedRole.role_id ? updatedRole : role
          ));
        }}
      />
    </div>
  );
};

export default Role;
