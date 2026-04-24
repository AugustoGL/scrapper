import { useState } from 'react';
import { RobotOutlined, TableOutlined } from '@ant-design/icons';
import { Layout, Menu, Grid } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon) {
  return { key, icon, label };
}

const items = [
  getItem('Configuración', '/configuracion', <RobotOutlined />),
  getItem('Tablas',        '/tablas',        <TableOutlined />),
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const currentYear = new Date().getFullYear();
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();

  const margin =
    screens.xxl ? 100 :
    screens.xl  ? 64  :
    screens.lg  ? 40  :
    screens.md  ? 32  :
    screens.sm  ? 24  : 16;

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider theme="light">
        <div style={{ padding: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px' }}>
          logo version algo
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
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