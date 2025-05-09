import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Form,
  Select,
  DatePicker,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { orderAssignmentApi } from "../api/orderAssignmentApi";
import { userApi } from "../api/userApi";
import moment from "moment";
import { getAllOrders } from "../../api/orderApi";

const { Title } = Typography;
const { Option } = Select;

const AdminOrderTracking = () => {
  const [customerOrders, setCustomerOrders] = useState([  ])
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Order ID validation regex (alphanumeric with optional hyphens/underscores)
  const ORDER_ID_REGEX = /^[a-zA-Z0-9-_]+$/;

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAssignmentApi.getAll();
      const customerData = await getAllOrders()
      setOrders(data);
      setCustomerOrders(customerData.data)
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data.filter((user) => user.role === "staff")); // Only show staff members
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch users");
    }
  };

  const handleAdd = () => {
    setCurrentOrder(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentOrder(record);
    form.setFieldsValue({
      ...record,
      user: record.user._id,
      dateAssigned: moment(record.dateAssigned),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await orderAssignmentApi.delete(id);
      messageApi.success("Order assignment deleted successfully");
      fetchOrders();
    } catch (error) {
      messageApi.error(error.message || "Failed to delete order assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const orderData = {
        ...values,
        dateAssigned: values.dateAssigned.toISOString(),
      };

      if (currentOrder) {
        await orderAssignmentApi.update(currentOrder._id, orderData);
        messageApi.success("Order assignment updated successfully");
      } else {
        await orderAssignmentApi.create(orderData);
        messageApi.success("Order assignment created successfully");
      }

      setModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    
    },
    {
      title: "Staff Member",
      dataIndex: ["user", "name"],
      key: "user",
      render: (_, record) => (
        <div>
          <div>{record.user?.name || "Unassigned"}</div>
          <Tag color="blue">{record.user?.email || ""}</Tag>
        </div>
      ),
      sorter: (a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""),
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
      render: (status) => {
        let color = "";
        switch (status) {
          case "completed":
            color = "green";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "orange";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
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
            title="Are you sure to delete this order assignment?"
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Title level={4}>Order Tracking</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Assign Order
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={currentOrder ? "Edit Order Assignment" : "Assign New Order"}
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          confirmLoading={loading}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="orderId"
              label="Order ID"
              rules={[
                { required: true, message: "Please select an order!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select an order"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {customerOrders.map((order) => (
                  <Option key={order._id} value={order._id}>
                    {order._id} - {order.customer?.name || 'Unknown customer'} (${order.totalAmount?.toFixed(2) || '0.00'})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="user"
              label="Assign to Staff"
              rules={[
                { required: true, message: "Please select a staff member!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select staff member"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateAssigned"
              label="Date Assigned"
              initialValue={moment()}
              rules={[
                { required: true, message: "Please select assignment date!" },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              initialValue="pending"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select>
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AdminOrderTracking;
