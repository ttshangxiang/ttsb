import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import Menus from './Menus'
import './style.css';

const { Header, Content, Footer, Sider } = Layout;

class Frame extends Component {

  render() {
    return (
      <Layout id="components-layout-demo-top-side">
        <Header className="header">
          <div className="logo">tts</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menus />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>{this.props.children}</Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

export default Frame;