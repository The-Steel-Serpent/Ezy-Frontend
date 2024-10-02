import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import AdminSidebar from '../../components/AdminSidebar';
import logo from '../../assets/image (1) (2).png'
import "../../styles/admin.css"
import AdminHeader from '../../components/AdminHeader';
import ProductCategory from '../../components/admin/category/ProductCategory';
const { Header, Sider, Content } = Layout;

const AdminAuthLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} className='sider'>
        <div style={{ backgroundColor: theme.primaryColor }}>
          <img src={logo} alt='logo' />
        </div>
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
            {/* {children} */}
            <ProductCategory />
            
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminAuthLayout