import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import AdminSidebar from '../../components/AdminSidebar';
import "../../styles/admin.css"
import AdminHeader from '../../components/AdminHeader';
const { Header, Sider, Content } = Layout;

const AdminAuthLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} className='sider'>
        <AdminSidebar />
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className='trigger-btn'
        />
      </Sider>
      <Layout>
        <Header className='header'>
          <AdminHeader />
        </Header>
        <Content className='content'>
          <div className='site-layout-background' style={{ padding: 16, minHeight: 360, backgroundColor: "white" }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminAuthLayout