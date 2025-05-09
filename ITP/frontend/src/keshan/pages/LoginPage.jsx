import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Divider } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { userApi } from "../api/userApi";
import "../styles/auth.css"; // Make sure to create this CSS file

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  // Email regex pattern for validation
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.login(values);
      messageApi.success("Login successful!");

      // Store user data and token
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("userId", response.user.id);
      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/keshan/admin-dashboard");
      } else {
        navigate("/keshan");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {contextHolder}
      <Card 
        className="auth-card" 
        style={{ 
          width: 420, 
          borderRadius: 8, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '20px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={2} style={{ fontSize: 28, marginBottom: 8 }}>
            Welcome Back
          </Title>
          <Text type="secondary">
            Please sign in to continue to your account
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                pattern: EMAIL_REGEX,
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Email" 
              style={{ borderRadius: 6, height: 45 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              type="password"
              placeholder="Password"
              style={{ borderRadius: 6, height: 45 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ 
                height: 45, 
                borderRadius: 6, 
                fontWeight: 500,
                fontSize: 16
              }}
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>

          

          
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
