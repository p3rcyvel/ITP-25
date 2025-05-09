import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ShiftSchedulePage from "./ShiftSchedulePage";
import AllUsersPage from "./AllUsersPage";
import AdminWorkingHours from "./AdminWorkingHours";
import AdminOrderTracking from "./AdminOrderTracking";

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "User Management",
    },
    {
      key: "shifts",
      icon: <ScheduleOutlined />,
      label: "Shift Management",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Order Tracking",
    },
    {
      key: "working-hours",
      icon: <ClockCircleOutlined />,
      label: "Working Hours",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          background: colorBgContainer,
          boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <h2>{collapsed ? "AD" : "ADMIN DASHBOARD"}</h2>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[activeKey]}
          selectedKeys={[activeKey]}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setActiveKey(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "all 0.2s",
        }}
      >
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: "auto",
          }}
        >
          {/* Content will be rendered here based on activeKey */}
          <div style={{ minHeight: "calc(100vh - 180px)" }}>
            {activeKey === "dashboard" && <div>Dashboard Content</div>}
            {activeKey === "users" && <AllUsersPage />}
            {activeKey === "shifts" && <ShiftSchedulePage />}
            {activeKey === "orders" && <AdminOrderTracking />}
            {activeKey === "working-hours" && <AdminWorkingHours />}
            {activeKey === "payroll" && <div>Payroll Content</div>}
            {activeKey === "staff" && <div>Staff Management Content</div>}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
