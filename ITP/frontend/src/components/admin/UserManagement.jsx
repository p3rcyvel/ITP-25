import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  Input,
  Popconfirm,
  message,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  updateUser,
  deleteUser,
  createUser,
  getUsers,
} from "../../api/userApi";

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      messageApi.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Handle user creation
  const handleCreateUser = async (values) => {
    setLoading(true);
    try {
      await createUser(values);
      messageApi.success("User created successfully");
      fetchUsers(); // Refresh the user list
      setIsCreateModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error creating user:", error);
      messageApi.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Handle user update
  const handleUpdateUser = async (userId, values) => {
    setLoading(true);
    try {
      await updateUser(userId, values);
      messageApi.success("User updated successfully");
      fetchUsers(); // Refresh the user list
      setIsEditModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error updating user:", error);
      messageApi.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      messageApi.success("User deleted successfully");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      messageApi.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF of users
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10);
    doc.autoTable({
      head: [["Name", "Email", "Role", "Hourly Rate"]],
      body: users.map((user) => [
        user.name,
        user.email,
        user.role,
        `$${user.hourlyRate}`,
      ]),
    });
    doc.save("users.pdf");
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search users"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
        <div>
          <Button type="primary" onClick={generatePDF}>
            Generate PDF
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            style={{ marginLeft: "10px" }}
          >
            Create User
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Table
        dataSource={filteredUsers}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
          },
          {
            title: "Hourly Rate",
            dataIndex: "hourlyRate",
            key: "hourlyRate",
            render: (hourlyRate) => `$${hourlyRate}`,
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedUser(record);
                    setIsEditModalVisible(true);
                  }}
                ></Button>
                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => handleDeleteUser(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateUser}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the user's name!" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the user's email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter the user's password!" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              { required: true, message: "Please select the user's role!" },
            ]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="staff">Staff</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Hourly Rate"
            name="hourlyRate"
            rules={[
              {
                required: true,
                message: "Please enter the user's hourly rate!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter hourly rate" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create User
          </Button>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={selectedUser}
          onFinish={(values) => handleUpdateUser(selectedUser?._id, values)}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the user's name!" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the user's email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: false, message: "Please enter the user's password!" },
            ]}
          >
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              { required: true, message: "Please select the user's role!" },
            ]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="staff">Staff</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Hourly Rate"
            name="hourlyRate"
            rules={[
              {
                required: true,
                message: "Please enter the user's hourly rate!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter hourly rate" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update User
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
