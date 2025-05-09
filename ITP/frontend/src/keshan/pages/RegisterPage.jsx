import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { userApi } from "../api/userApi";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Regex patterns for validation
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await userApi.register(values);
      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">
          Create Account
        </Title>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                pattern: EMAIL_REGEX,
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input placeholder="example@domain.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: PASSWORD_REGEX,
                message:
                  "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
              },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            name="hourlyRate"
            label="Hourly Rate ($)"
            rules={[
              { required: true, message: "Please input your hourly rate!" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid amount (e.g. 15 or 15.50)",
              },
            ]}
          >
            <Input type="number" step="0.01" min="0" placeholder="15.00" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Text>Already have an account?</Text>
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
