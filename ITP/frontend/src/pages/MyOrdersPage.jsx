import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import { Table, Button, Spin, Popconfirm, message } from "antd";
import { getAllOrders, deleteOrder } from "../api/orderApi";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Start loading state
        const response = await getAllOrders();
        setOrders(response.data); // Set orders data
      } catch (error) {
        console.error("Error fetching orders:", error);
        messageApi.error("Failed to load orders. Please try again.");
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchOrders();
  }, []);

  // Handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    try {
      setLoading(true); // Start loading state
      await deleteOrder(orderId); // Call API to delete the order
      messageApi.success("Order deleted successfully.");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      ); // Remove deleted order from state
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
      render: (id) => <span>{id.slice(0, 8)}...</span>, // Show truncated ID
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              {item.foodItem.name} x {item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `LKR ${price.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => status.toUpperCase(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div>
          {record.status === "pending" ? (
            <Popconfirm
              title="Are you sure you want to delete this order?"
              onConfirm={() => handleDeleteOrder(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" danger>
                Delete Order
              </Button>
            </Popconfirm>
          ) : (
            <span>-</span> // No action available for non-pending orders
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>My Orders</h2>

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
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
