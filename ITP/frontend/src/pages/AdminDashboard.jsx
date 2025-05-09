import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Typography, theme, Button, Row } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import UserManagement from "../components/admin/UserManagement";
import InventoryManagement from "../components/admin/InventoryManagement";
import FoodItemManagement from "../components/admin/FoodItemManagement";
import OrderManagement from "../components/admin/OrderManagement";
import BookingManagement from "../components/admin/BookingManagement";
import WorkingHourManagement from "../components/admin/WorkingHourManagement";
import ShoftManagement from "../components/admin/ShoftManagement";
import OrderAssigmentManagement from "../components/admin/OrderAssigmentManagement";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("1"); // Default active key

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Map menu keys to components
  const renderContent = () => {
    switch (activeKey) {
      case "1":
        return <UserManagement />;
      case "2":
        return <InventoryManagement />;
      case "3":
        return <FoodItemManagement />;
      case "4":
        return <OrderManagement />;
      case "5":
        return <BookingManagement />;
      case "6":
        return <WorkingHourManagement />;
      case "7":
        return <ShoftManagement />;
      case "8":
        return <OrderAssigmentManagement />;
      default:
        return <div>Welcome to Admin Dashboard</div>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[activeKey]}
          onClick={({ key }) => setActiveKey(key)}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            User Management
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>
            Inventory Management
          </Menu.Item>
          <Menu.Item key="3" icon={<ShoppingOutlined />}>
            Food Item Management
          </Menu.Item>
          <Menu.Item key="4" icon={<FileTextOutlined />}>
            Order Management
          </Menu.Item>
          <Menu.Item key="5" icon={<ProfileOutlined />}>
            Booking Management
          </Menu.Item>
          <Menu.Item key="6" icon={<ClockCircleOutlined />}>
            Working Hour Management
          </Menu.Item>
          <Menu.Item key="7" icon={<CalendarOutlined />}>
            Shift Management
          </Menu.Item>
          <Menu.Item key="8" icon={<OrderedListOutlined />}>
            Order Assignment Management
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row style={{ padding: 32 }} justify={"space-between"}>
            <Title level={4} style={{ marginLeft: "20px", color: "#000" }}>
              Admin Dashboard
            </Title>
            <Button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </Row>
        </Header>

        {/* Content Area */}
        <Content style={{ margin: "20px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>{renderBreadcrumb(activeKey)}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: "8px",
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

// Helper function to render breadcrumb text based on active key
const renderBreadcrumb = (key) => {
  switch (key) {
    case "1":
      return "User Management";
    case "2":
      return "Inventory Management";
    case "3":
      return "Food Item Management";
    case "4":
      return "Order Management";
    case "5":
      return "Booking Management";
    case "6":
      return "Working Hour Management";
    case "7":
      return "Shift Management";
    case "8":
      return "Order Assignment Management";
    default:
      return "Dashboard";
  }
};

export default AdminDashboard;
