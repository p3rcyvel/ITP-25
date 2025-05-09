import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography, Space, message } from "antd";
import {
  ClockCircleOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../styles/HomePage.css";
import { workingHoursApi } from "../api/workingHourApi";
import ClockInModal from "../components/ClockinModal";
import ClockOutModal from "../components/ClockloutModal";

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const user = JSON.parse(localStorage.getItem("user"));
  const [clockInModalVisible, setClockInModalVisible] = useState(false);
  const [clockOutModalVisible, setClockOutModalVisible] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user has already clocked in/out today
  useEffect(() => {
    const checkTodayRecord = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const today = new Date().toISOString().split("T")[0];
          const response = await workingHoursApi.getUserRecordForDate(
            user.id,
            today
          );
          setTodayRecord(response);
        } catch (error) {
          console.error("Error fetching today's record:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    checkTodayRecord();
  }, [user?.id]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    messageApi.success("Logged out successfully");
    navigate("/keshan/login");
  };
  const handleClockInSuccess = (record) => {
    setTodayRecord(record);
    setClockInModalVisible(false);
    messageApi.success("Clocked in successfully!");
  };

  const handleClockOutSuccess = (record) => {
    setTodayRecord(record);
    setClockOutModalVisible(false);
    messageApi.success("Clocked out successfully!");
  };

  const features = [
    {
      key: "working-hours",
      title: "Working Hours",
      description: "Clock in/out and view your working hours",
      icon: <ClockCircleOutlined style={{ fontSize: "24px" }} />,
      action: () => navigate("/keshan/working-hours"),
    },
    {
      key: "orders",
      title: "Order Management",
      description: "View and manage your assigned orders",
      icon: <OrderedListOutlined style={{ fontSize: "24px" }} />,
      action: () => navigate("/keshan/my-orders"),
    },
    {
      key: "shifts",
      title: "Shift Schedule",
      description: "Check your upcoming shifts and availability",
      icon: <ScheduleOutlined style={{ fontSize: "24px" }} />,
      action: () => navigate("/keshan/shifts"),
    },
    {
      key: "overtime",
      title: "Overtime Tracking",
      description: "View your overtime hours and extra pay",
      icon: <DollarOutlined style={{ fontSize: "24px" }} />,
      action: () => navigate("/keshan/overtime"),
    },
  ];

  if (loading) return <div>Loading</div>;

  return (
    <div className="home-container">
      {contextHolder}
      <div className="home-header">
        <Title level={3}>Welcome, {user?.name || "Staff Member"}</Title>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          danger
        >
          Logout
        </Button>
      </div>

      <Row gutter={[16, 16]} className="features-row">
        {features.map((feature) => (
          <Col xs={24} sm={12} md={12} lg={6} key={feature.key}>
            <Card hoverable onClick={feature.action} className="feature-card">
              <Space direction="vertical" align="center">
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4} className="feature-title">
                  {feature.title}
                </Title>
                <Text type="secondary" className="feature-description">
                  {feature.description}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="quick-actions">
        <Title level={4} className="section-title">
          Quick Actions
        </Title>
        <Space size="middle">
          <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            onClick={() =>
              todayRecord?.clockIn
                ? setClockOutModalVisible(true)
                : setClockInModalVisible(true)
            }
            disabled={todayRecord?.clockIn && todayRecord?.clockOut}
          >
            {todayRecord?.clockIn
              ? todayRecord?.clockOut
                ? "Already Clocked Out"
                : "Clock Out"
              : "Clock In"}
          </Button>
          <Button
            type="primary"
            icon={<OrderedListOutlined />}
            onClick={() => navigate("/keshan/my-orders")}
          >
            View My Orders
          </Button>
          <Button
            type="primary"
            icon={<DollarOutlined />}
            onClick={() => navigate("/keshan/request-overtime")}
          >
            Request Overtime
          </Button>
        </Space>
      </div>
      <ClockInModal
        visible={clockInModalVisible}
        onCancel={() => setClockInModalVisible(false)}
        onSuccess={handleClockInSuccess}
        userId={user?.id}
      />

      <ClockOutModal
        visible={clockOutModalVisible}
        onCancel={() => setClockOutModalVisible(false)}
        onSuccess={handleClockOutSuccess}
        recordId={todayRecord?._id}
      />
    </div>
  );
};

export default HomePage;
