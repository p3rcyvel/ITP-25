import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tag,
  Typography,
  Radio,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { userApi } from "../api/userApi";
import jsPDF from "jspdf";
import {autoTable} from "jspdf-autotable";

const { Title } = Typography;
const { Option } = Select;

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentUser(record);
    form.setFieldsValue({
      ...record,
      password: "", // Don't show password when editing
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await userApi.deleteUser(id);
      messageApi.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      messageApi.error(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (currentUser) {
        // For update, only send password if it was changed
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password;
        }
        await userApi.updateUser(currentUser._id, updateData);
        messageApi.success("User updated successfully");
      } else {
        await userApi.register(values);
        messageApi.success("User created successfully");
      }

      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text("User List", 14, 15);

    // Table
    autoTable(doc,{
      head: [["Name", "Email", "Role", "Hourly Rate", "Created At"]],
      body: users.map((user) => [
        user.name,
        user.email,
        user.role,
        `$${user.hourlyRate.toFixed(2)}`,
        new Date(user.createdAt).toLocaleDateString(),
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

    doc.save("users-list.pdf");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "gold" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      render: (rate) => `$${rate.toFixed(2)}`,
      sorter: (a, b) => a.hourlyRate - b.hourlyRate,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={4}>User Management</Title>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add User
              </Button>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={generatePDF}
              >
                Export PDF
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={currentUser ? "Edit User" : "Add New User"}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please input the name!" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input placeholder="example@domain.com" />
          </Form.Item>

          {!currentUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input the password!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          )}

          {currentUser && (
            <Form.Item
              name="password"
              label="New Password (leave blank to keep current)"
              rules={[
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Radio.Group>
              <Radio.Button value="admin">Admin</Radio.Button>
              <Radio.Button value="staff">Staff</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="hourlyRate"
            label="Hourly Rate ($)"
            rules={[
              { required: true, message: "Please input the hourly rate!" },
              {
                type: "number",
                min: 0,
                message: "Please enter a valid amount",
              },
            ]}
          >
            <InputNumber
              min={0}
              step={0.5}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllUsersPage;
