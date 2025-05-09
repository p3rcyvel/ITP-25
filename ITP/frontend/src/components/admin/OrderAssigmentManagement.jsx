import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Spin,
  Popconfirm,
  Modal,
  Form,
  Select,
  Descriptions,
  message,
} from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  createOrderAssignment,
  updateOrderAssignment,
  deleteOrderAssignment,
  getAllOrderAssignments,
} from "../../api/orderAssigmentApi";
import { getUsers } from "../../api/userApi";
import { getAllOrders } from "../../api/orderApi";

const OrderAssignmentManagement = () => {
  const [orderAssignments, setOrderAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all users, orders, and order assignments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersResponse = await getUsers();
        setUsers(usersResponse.filter((user) => user.role === "staff"));

        // Fetch orders
        const ordersResponse = await getAllOrders();
        setOrders(ordersResponse.data);

        // Fetch order assignments
        const assignmentsResponse = await getAllOrderAssignments();
        setOrderAssignments(assignmentsResponse);
        setFilteredAssignments(assignmentsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        messageApi.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = orderAssignments.filter((assignment) =>
      assignment.user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAssignments(filtered);
  };

  // Handle creating or updating an order assignment
  const handleSaveAssignment = async (values) => {
    try {
      setLoading(true);

      if (selectedAssignment) {
        // Update existing assignment
        await updateOrderAssignment(selectedAssignment._id, values);
        const assignmentsResponse = await getAllOrderAssignments();
        setOrderAssignments(assignmentsResponse);
        setFilteredAssignments(assignmentsResponse);
        messageApi.success("Order assignment updated successfully.");
      } else {
        // Create new assignment
        await createOrderAssignment(values);
        const assignmentsResponse = await getAllOrderAssignments();
        setOrderAssignments(assignmentsResponse);
        setFilteredAssignments(assignmentsResponse);
        messageApi.success("Order assignment created successfully.");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving order assignment:", error);
      messageApi.error("Failed to save order assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an order assignment
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      setLoading(true);
      await deleteOrderAssignment(assignmentId);
      setOrderAssignments((prevAssignments) =>
        prevAssignments.filter((assignment) => assignment._id !== assignmentId)
      );
      setFilteredAssignments((prevAssignments) =>
        prevAssignments.filter((assignment) => assignment._id !== assignmentId)
      );
      messageApi.success("Order assignment deleted successfully.");
    } catch (error) {
      console.error("Error deleting order assignment:", error);
      messageApi.error("Failed to delete order assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF of order assignments
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Order Assignment Report", 10, 10);
    const tableData = filteredAssignments.map((assignment) => [
      assignment.user.name,
      assignment.orderId.items[0]?.foodItem.name,
      assignment.status.toUpperCase(),
      new Date(assignment.dateAssigned).toLocaleDateString(),
    ]);
    doc.autoTable({
      head: [["User", "Order Item", "Status", "Date Assigned"]],
      body: tableData,
    });
    doc.save("order-assignments-report.pdf");
    messageApi.success("PDF generated successfully!");
  };

  // Handle updating status
  const handleUpdateStatus = async (assignmentId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderAssignment(assignmentId, { status: newStatus });
      const assignmentsResponse = await getAllOrderAssignments();
      setOrderAssignments(assignmentsResponse);
      setFilteredAssignments(assignmentsResponse);
      messageApi.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      messageApi.error("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Define table columns for order assignments
  const columns = [
    {
      title: "User",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Order Item",
      dataIndex: ["orderId", "items"],
      key: "orderItem",
      render: (items) => items[0]?.foodItem.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(value) => handleUpdateStatus(record._id, value)}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
      ),
    },
    {
      title: "Date Assigned",
      dataIndex: "dateAssigned",
      key: "dateAssigned",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div>
          {/* View Details Button */}
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAssignment(record);
              setIsDetailsModalVisible(true);
            }}
          />
          {/* Edit Button */}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedAssignment(record);
              form.setFieldsValue({
                user: record.user._id,
                orderId: record.orderId._id,
                status: record.status,
              });
              setIsModalVisible(true);
            }}
          />
          {/* Delete Button */}
          <Popconfirm
            title="Are you sure you want to delete this assignment?"
            onConfirm={() => handleDeleteAssignment(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <h2>Order Assignment Management</h2>

      {/* Search Bar */}
      <Input.Search
        placeholder="Search by user name"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {/* Generate PDF Button */}
      <Button
        type="primary"
        onClick={generatePDF}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        Generate PDF
      </Button>

      {/* Add New Assignment Button */}
      <Button
        type="primary"
        onClick={() => {
          setSelectedAssignment(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        Add New Assignment
      </Button>

      {/* Loading State */}
      {loading ? (
        <Spin
          size="large"
          tip="Loading data..."
          style={{ display: "block", margin: "50px auto" }}
        />
      ) : filteredAssignments.length === 0 ? (
        <p>No order assignments found.</p>
      ) : (
        <Table
          dataSource={filteredAssignments}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Modal for Creating/Updating Order Assignments */}
      <Modal
        title={
          selectedAssignment
            ? "Edit Order Assignment"
            : "Create Order Assignment"
        }
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedAssignment(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAssignment}>
          <Form.Item
            label="User"
            name="user"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select placeholder="Select a user">
              {users.map((user) => (
                <Select.Option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Order"
            name="orderId"
            rules={[{ required: true, message: "Please select an order!" }]}
          >
            <Select placeholder="Select an order">
              {orders.map((order) => (
                <Select.Option key={order._id} value={order._id}>
                  {order.items[0]?.foodItem.name} (LKR{" "}
                  {order.totalPrice.toLocaleString()})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select a status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Viewing Order Details */}
      <Modal
        title="Order Assignment Details"
        visible={isDetailsModalVisible}
        onCancel={() => {
          setIsDetailsModalVisible(false);
          setSelectedAssignment(null);
        }}
        footer={null}
      >
        {selectedAssignment && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="User">
              {selectedAssignment.user.name} ({selectedAssignment.user.email})
            </Descriptions.Item>
            <Descriptions.Item label="Order Item">
              {selectedAssignment.orderId.items[0]?.foodItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {selectedAssignment.orderId.items[0]?.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              LKR {selectedAssignment.orderId.totalPrice.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedAssignment.status.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Date Assigned">
              {new Date(selectedAssignment.dateAssigned).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrderAssignmentManagement;
