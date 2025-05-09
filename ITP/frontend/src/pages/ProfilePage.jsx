import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Popconfirm, Card, Layout } from "antd";
import { getUser, updateUser, deleteUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const { Content } = Layout;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
        const response = await getUser(userId);
        setUserDetails(response);
        form.setFieldsValue(response.data); // Populate form with user data
      } catch (error) {
        console.error("Error fetching user details:", error);
        messageApi.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [form]);

  // Handle updating user details
  const handleUpdateUser = async (values) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      await updateUser(userId, values);
      messageApi.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      messageApi.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting the user account
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      await deleteUser(userId);
      localStorage.clear(); // Clear localStorage
      message.success("Account deleted successfully");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/login"); // Redirect to login page
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      {contextHolder}
      <Navbar />
      <Content style={{ padding: "20px", minHeight: "100vh" }}>
        <Card
          title="Profile"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateUser}
            initialValues={userDetails}
          >
            {/* Name Field */}
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your name!" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Name must contain only alphabets and spaces!",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            {/* Role Field (Read-only) */}
            <Form.Item label="Role" name="role">
              <Input disabled />
            </Form.Item>

            {/* Update Button */}
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ marginBottom: "10px" }}
            >
              Update Profile
            </Button>
          </Form>

          {/* Delete Account Button */}
          <Popconfirm
            title="Are you sure you want to delete your account?"
            onConfirm={handleDeleteUser}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              block
              loading={loading}
              style={{ marginBottom: "10px" }}
            >
              Delete Account
            </Button>
          </Popconfirm>

          {/* Logout Button */}
          <Button onClick={handleLogout} block>
            Logout
          </Button>
        </Card>
      </Content>
    </Layout>
  );
};

export default ProfilePage;
