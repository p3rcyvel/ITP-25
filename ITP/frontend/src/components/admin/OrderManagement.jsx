import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spin,
  Popconfirm,
  Modal,
  message,
  Descriptions,
  Select,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllOrders, updateOrder, deleteOrder } from "../../api/orderApi";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Start loading state
        const response = await getAllOrders();
        // Add null safety check for response
        setOrders(response?.data || []); // Set orders data with default empty array
      } catch (error) {
        console.error("Error fetching orders:", error);
        messageApi.error("Failed to load orders. Please try again.");
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchOrders();
  }, []);

  // Handle viewing order details in a modal
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Handle updating the status of an order
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!orderId) {
      messageApi.error("Invalid order ID");
      return;
    }

    try {
      setLoading(true); // Start loading state
      await updateOrder(orderId, { status: newStatus }); // Update status via API
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order?._id === orderId ? { ...order, status: newStatus } : order
        )
      ); // Update local state with null check
      messageApi.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      messageApi.error("Failed to update order status. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    if (!orderId) {
      messageApi.error("Invalid order ID");
      return;
    }

    try {
      setLoading(true); // Start loading state
      await deleteOrder(orderId); // Delete order via API
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order?._id !== orderId)
      ); // Remove deleted order from state with null check
      messageApi.success("Order deleted successfully.");
    } catch (error) {
      console.error("Error deleting order:", error);
      messageApi.error("Failed to delete order. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Define table columns for orders
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span>{id ? id.slice(0, 8) + "..." : "N/A"}</span>, // Show truncated ID with null check
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.name || "Unknown User", // Added null check with optional chaining
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `LKR ${price ? price.toLocaleString() : "0"}`, // Added null check
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          defaultValue={status || "pending"}
          style={{ width: 120 }}
          onChange={(value) =>
            record?._id && handleUpdateStatus(record._id, value)
          } // Added null check
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
      ),
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
            onClick={() => handleViewOrder(record)}
          />
          {/* Delete Button */}
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => record?._id && handleDeleteOrder(record._id)} // Added null check
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
      <h2>Order Management</h2>

      {/* Loading State */}
      {loading ? (
        <Spin
          size="large"
          tip="Loading orders..."
          style={{ display: "block", margin: "50px auto" }}
        />
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey={(record) => record?._id || Math.random().toString()} // Added null safety for rowKey
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Modal for Viewing Order Details */}
      <Modal
        title="Order Details"
        open={isModalVisible} // Updated 'visible' prop to 'open' for newer Ant Design versions
        onCancel={closeModal}
        footer={null}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">
              {selectedOrder._id || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="User">
              {selectedOrder.user?.name || "Unknown User"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedOrder.user?.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              LKR{" "}
              {selectedOrder.totalPrice
                ? selectedOrder.totalPrice.toLocaleString()
                : "0"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedOrder.status
                ? selectedOrder.status.toUpperCase()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Items">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ul>
                  {selectedOrder.items.map((item) => (
                    <li key={item?._id || Math.random().toString()}>
                      {item?.foodItem?.name || "Unknown Item"} x{" "}
                      {item?.quantity || 0}
                    </li>
                  ))}
                </ul>
              ) : (
                "No items found"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
