import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Select,
  Space,
  Typography,
  Tag,
  Layout,
  Menu,
  message,
  Row,
  Col,
} from "antd";
import {
  HomeOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { orderAssignmentApi } from "../api/orderAssignmentApi";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchUserOrders();
  }, [userId]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAssignmentApi.getAll();

      setOrders(data.filter((order) => order.user?._id === userId));
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch your orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await orderAssignmentApi.update(orderId, { status: newStatus });
      messageApi.success("Order status updated successfully");
      fetchUserOrders();
    } catch (error) {
      messageApi.error(error.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text(`${userName}'s Order Report`, 14, 15);

    // Table
    autoTable(doc, {
      head: [["Order ID", "Date Assigned", "Status", "Last Updated"]],
      body: orders.map((order) => [
        order._id,
        moment(order.dateAssigned).format("YYYY-MM-DD HH:mm"),
        order.status.toUpperCase(),
        order.updatedAt
          ? moment(order.updatedAt).format("YYYY-MM-DD HH:mm")
          : "N/A",
      ]),
      startY: 25,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save(`${userName}-orders-report.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "orderId",
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: "Date Assigned",
      dataIndex: "dateAssigned",
      key: "dateAssigned",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
      sorter: (a, b) => new Date(a.dateAssigned) - new Date(b.dateAssigned),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">
            <Tag color="orange">PENDING</Tag>
          </Option>
          <Option value="completed">
            <Tag color="green">COMPLETED</Tag>
          </Option>
          <Option value="cancelled">
            <Tag color="red">CANCELLED</Tag>
          </Option>
        </Select>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) =>
        date ? moment(date).format("YYYY-MM-DD HH:mm") : "N/A",
      sorter: (a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0),
    },
  ];

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/keshan"),
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: "My Orders",
    },
    {
      key: "working-hours",
      icon: <ClockCircleOutlined />,
      label: "Working Hours",
      onClick: () => navigate("/keshan/working-hours"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Sider collapsible>
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Title level={4} style={{ color: "white", marginBottom: 0 }}>
            {userName || "User"}
          </Title>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["orders"]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            <Card>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 16 }}
              >
                <Col>
                  <Title level={4}>My Orders</Title>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={generatePDF}
                  >
                    Export PDF
                  </Button>
                </Col>
              </Row>

              <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserOrders;
