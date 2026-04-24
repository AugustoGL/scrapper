import { useState } from 'react';
import {
  RobotOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Grid } from 'antd';
const { useBreakpoint } = Grid;

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem('Configuración', '1', <RobotOutlined size={50} />),
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const currentYear = new Date().getFullYear();
  const screens = useBreakpoint();

  const margin =
    screens.xxl ? 100 :
    screens.xl  ? 64  :
    screens.lg  ? 40  :
    screens.md  ? 32  :
    screens.sm  ? 24  : 16;

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '30px',
          }}
        >
          logo version algo
        </div>
        <Breadcrumb style={{ margin: '0 16px' }} items={[{ title: 'Menu' }]} />
        <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>

      <Layout style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Content style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ marginInline: `${margin}px`, marginTop: 50, minHeight: 360 }}>
            {children}
          </div>
                  <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
          Ant Design ©{currentYear} Created by Ant UED
        </Footer>
        </Content>

      </Layout>
    </Layout>
  );
}