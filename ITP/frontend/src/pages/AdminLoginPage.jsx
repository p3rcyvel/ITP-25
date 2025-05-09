import React, { useState } from "react";
import { loginUser } from "../api/userApi";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  // Handle form submission
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      messageApi.success("Login Successful");
      console.log("Login Response:", response);
      localStorage.clear();
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("id", response.user.id);
      if (response.user.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else if (response.user.role === "staff") {
        window.location.href = "/staff-dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login Error:", error);
      messageApi.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("https://images.wsj.net/im-65599456?size=1.5")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {" "}
      {contextHolder}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "30px",
          borderRadius: "8px",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        <Form
          form={form}
          name="admin_login"
          onFinish={handleLogin}
          layout="vertical"
          autoComplete="off"
        >
          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
