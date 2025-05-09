import {
  Modal,
  Avatar,
  Descriptions,
  Card,
  Spin,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Statistic,
  Button,
  Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
import { getUser } from "../../api/userApi";
import {
  UserOutlined,
  MailOutlined,
  DollarOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const StaffProfile = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && userId) {
      fetchUserData();
    }
  }, [userId, open]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<Typography.Title level={4}>Staff Profile</Typography.Title>}
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spin size="large" />
        </div>
      ) : user ? (
        <div className="p-4">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card bordered={false} className="text-center">
                <Avatar size={120} icon={<UserOutlined />} className="mb-4" />
                <Typography.Title level={3}>{user.name}</Typography.Title>
                <Tag color="blue" className="mb-2">
                  {user.role.toUpperCase()}
                </Tag>
                <Typography.Text type="secondary">
                  <MailOutlined className="mr-2" />
                  {user.email}
                </Typography.Text>
              </Card>
            </Col>

            <Col xs={24} md={16}>
              <Card title="Staff Information" bordered={false}>
                <Descriptions layout="vertical" column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="ID">{user._id}</Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Role">
                    <Tag color="blue">{user.role}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Member Since">
                    {formatDate(user.createdAt)}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Hourly Rate"
                      value={user.hourlyRate}
                      prefix="$"
                      suffix="/ hr"
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Member Duration"
                      value={Math.floor(
                        (new Date() - new Date(user.createdAt)) /
                          (1000 * 60 * 60 * 24)
                      )}
                      suffix="days"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Additional information section */}
          <Card className="mt-6" bordered={false}>
            <Typography.Title level={5}>Account Activity</Typography.Title>
            <Row gutter={16} className="mt-4">
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Projects"
                    value={12}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Hours Logged"
                    value={164}
                    valueStyle={{ fontSize: "24px" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Completion Rate"
                    value={96}
                    suffix="%"
                    valueStyle={{ fontSize: "24px", color: "#3f8600" }}
                  />
                </Card>
              </Col>
            </Row>
            <Popconfirm
              title="Logout"
              description="Are you sure you want to logout?"
              onConfirm={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                type="default"
                danger
                icon={<LogoutOutlined />}
                style={{ marginTop: 12 }}
              >
                Logout
              </Button>
            </Popconfirm>
          </Card>
        </div>
      ) : (
        <div className="p-8 text-center">
          <Typography.Text type="danger">
            Failed to load user profile
          </Typography.Text>
        </div>
      )}
    </Modal>
  );
};

export default StaffProfile;
