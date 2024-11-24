import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import axios from "axios";
import { signUpWithEmailPassword } from "../../../firebase/AuthenticationFirebase";
import { checkNumberPhone } from "../../../helpers/formatPhoneNumber";

const { Option } = Select;

const RegisterModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [roleData, setRoleData] = useState([]);

  // Fetch danh sách vai trò
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-role`);
      if (response.data.success) {
        setRoleData(response.data.data);
      } else {
        message.error("Không thể tải danh sách vai trò");
      }
    } catch (error) {
      console.error("Lỗi khi tải vai trò:", error);
      message.error("Có lỗi xảy ra khi tải danh sách vai trò");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRoles();
    }
  }, [visible]);

  // Xử lý đăng ký tài khoản
  const handleSubmit = async (values) => {
    try {
      // Kiểm tra số điện thoại
      if (values.phone_number && !checkNumberPhone(values.phone_number)) {
        return message.error("Số điện thoại không hợp lệ!");
      }

      // Định dạng dữ liệu
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      // Tạo tài khoản trên Firebase
      const firebaseUser = await signUpWithEmailPassword(
        formattedValues.email,
        formattedValues.password
      );

      if (firebaseUser) {
        // Gửi dữ liệu lên backend
        const apiResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/create-user`,
          {
            ...formattedValues,
            user_id: firebaseUser.uid, // Firebase UID
          }
        );

        if (apiResponse.data.success) {
          message.success("Tài khoản được tạo thành công! Email xác thực đã được gửi.");
          form.resetFields();
          onClose();
        } else {
          throw new Error(apiResponse.data.message || "Không thể tạo tài khoản.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      message.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản.");
    }
  };

  return (
    <Modal title="Đăng Ký" visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên Đăng Nhập"
          name="username"
          rules={[{ required: true, message: "Tên đăng nhập không được để trống!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ và Tên"
          name="fullname"
          rules={[{ required: true, message: "Họ và tên không được để trống!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được để trống!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số Điện Thoại"
          name="phone_number"
          rules={[
            { required: true, message: "Số điện thoại không được để trống!" },
            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại phải từ 10-11 chữ số!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Vai trò" name="role_id" rules={[{ required: true, message: "Vai trò không được để trống!" }]}>
          <Select placeholder="Chọn vai trò">
            {roleData.map((role) => (
              <Option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Ngày Sinh" name="dob">
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Mật khẩu không được để trống!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirm_password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Nhập lại mật khẩu không được để trống!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng Ký
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
