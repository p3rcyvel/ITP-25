import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Space,
  Typography,
  Tag,
  Layout,
  Menu,
  message,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  HomeOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { workingHoursApi } from "../api/workingHourApi";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const UserWorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ totalHours: 0, completedShifts: 0 });
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchUserWorkingHours();
  }, [userId]);

  const fetchUserWorkingHours = async () => {
    try {
      setLoading(true);
      const data = await workingHoursApi.getAll();
      setWorkingHours(data.filter((wh) => wh.user?._id === userId));

      // Calculate summary
      const completed = data.filter((wh) => wh.clockOut);
      const totalHrs = completed.reduce(
        (sum, wh) => sum + (wh.totalHours || 0),
        0
      );

      setSummary({
        totalHours: totalHrs,
        completedShifts: completed.length,
      });
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch working hours");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text(`${userName}'s Working Hours Report`, 14, 15);

    // Summary
    doc.text(`Total Hours Worked: ${summary.totalHours.toFixed(2)}`, 14, 25);
    doc.text(`Completed Shifts: ${summary.completedShifts}`, 14, 35);

    // Table
    autoTable(doc, {
      head: [["Date", "Clock In", "Clock Out", "Hours Worked"]],
      body: workingHours.map((record) => [
        moment(record.date).format("YYYY-MM-DD"),
        moment(record.clockIn).format("HH:mm:ss"),
        record.clockOut
          ? moment(record.clockOut).format("HH:mm:ss")
          : "In Progress",
        record.totalHours ? record.totalHours.toFixed(2) + " hrs" : "N/A",
      ]),
      startY: 45,
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

    doc.save(`${userName}-working-hours.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (clockIn) => moment(clockIn).format("HH:mm:ss"),
      sorter: (a, b) => new Date(a.clockIn) - new Date(b.clockIn),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      render: (clockOut) =>
        clockOut ? (
          moment(clockOut).format("HH:mm:ss")
        ) : (
          <Tag color="orange">In Progress</Tag>
        ),
      sorter: (a, b) => {
        if (!a.clockOut) return -1;
        if (!b.clockOut) return 1;
        return new Date(a.clockOut) - new Date(b.clockOut);
      },
    },
    {
      title: "Hours Worked",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (totalHours) =>
        totalHours ? (
          <Tag color={totalHours >= 8 ? "green" : "blue"}>
            {totalHours.toFixed(2)} hrs
          </Tag>
        ) : (
          <Tag color="red">N/A</Tag>
        ),
      sorter: (a, b) => (a.totalHours || 0) - (b.totalHours || 0),
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
      onClick: () => navigate("/keshan/my-orders"),
    },
    {
      key: "working-hours",
      icon: <ClockCircleOutlined />,
      label: "Working Hours",
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
          defaultSelectedKeys={["working-hours"]}
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
                style={{ marginBottom: 24 }}
              >
                <Col>
                  <Title level={4}>My Working Hours</Title>
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

              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Total Hours Worked"
                      value={summary.totalHours.toFixed(2)}
                      precision={2}
                      suffix="hours"
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Completed Shifts"
                      value={summary.completedShifts}
                    />
                  </Card>
                </Col>
              </Row>

              <Table
                columns={columns}
                dataSource={workingHours}
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

export default UserWorkingHours;
