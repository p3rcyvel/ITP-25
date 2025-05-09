import {
  Modal,
  Table,
  Tag,
  Spin,
  Typography,
  Empty,
  Space,
  Badge,
  Card,
  Alert,
  Tooltip,
} from "antd";
import React, { useState, useEffect } from "react";
import { getAllOrderAssignments } from "../../api/orderAssigmentApi";
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const StaffOrderAssignmentModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [orderAssignments, setOrderAssignments] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchOrderAssignments = async () => {
      try {
        setLoading(true);
        const response = await getAllOrderAssignments();

        // Filter assignments by user ID
        const filteredAssignments = response.filter(
          (assignment) => assignment.user?._id === userId
        );

        setOrderAssignments(filteredAssignments);
      } catch (error) {
        console.error("Error fetching order assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchOrderAssignments();
    }
  }, [userId, open]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "processing":
        return "processing";
      case "cancelled":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircleOutlined />;
      case "processing":
        return <ClockCircleOutlined />;
      case "cancelled":
        return <CloseCircleOutlined />;
      case "pending":
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  // Format price in currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100); // Assuming price is in cents
  };

  const columns = [
    {
      title: "Assignment ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      render: (id) => (
        <Typography.Text copyable={{ text: id }}>
          {id.substring(0, 8)}...
        </Typography.Text>
      ),
    },
    {
      title: "Order ID",
      dataIndex: ["orderId", "_id"],
      key: "orderId",
      ellipsis: true,
      render: (id) => (
        <Typography.Text copyable={{ text: id }}>
          {id.substring(0, 8)}...
        </Typography.Text>
      ),
    },
    {
      title: "Items",
      dataIndex: ["orderId", "items"],
      key: "items",
      render: (items) => (
        <Tooltip
          title={
            <ul className="m-0 pl-4">
              {items.map((item, index) => (
                <li key={index}>
                  {item.foodItem.name} x {item.quantity} -{" "}
                  {formatPrice(item.foodItem.price * item.quantity)}
                </li>
              ))}
            </ul>
          }
        >
          <Badge count={items.length} showZero>
            <ShoppingCartOutlined className="text-xl" />
          </Badge>
        </Tooltip>
      ),
    },
    {
      title: "Total Price",
      dataIndex: ["orderId", "totalPrice"],
      key: "totalPrice",
      render: (price) => formatPrice(price),
    },
    {
      title: "Order Status",
      dataIndex: ["orderId", "status"],
      key: "orderStatus",
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date Assigned",
      dataIndex: "dateAssigned",
      key: "dateAssigned",
      render: (date) => formatDate(date),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={
        <Typography.Title level={4}>My Order Assignments</Typography.Title>
      }
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spin size="large" tip="Loading assignments..." />
        </div>
      ) : (
        <div>
          {orderAssignments.length > 0 ? (
            <>
              <Card className="mb-4">
                <Space direction="horizontal">
                  <Typography.Text strong>
                    Total Assignments: {orderAssignments.length}
                  </Typography.Text>
                  <Tooltip title="Active orders">
                    <Badge
                      count={
                        orderAssignments.filter(
                          (a) => a.status.toLowerCase() === "processing"
                        ).length
                      }
                      color="blue"
                      showZero
                    />
                  </Tooltip>
                  <Tooltip title="Completed orders">
                    <Badge
                      count={
                        orderAssignments.filter(
                          (a) => a.status.toLowerCase() === "completed"
                        ).length
                      }
                      color="green"
                      showZero
                    />
                  </Tooltip>
                  <Tooltip title="Cancelled orders">
                    <Badge
                      count={
                        orderAssignments.filter(
                          (a) => a.status.toLowerCase() === "cancelled"
                        ).length
                      }
                      color="red"
                      showZero
                    />
                  </Tooltip>
                </Space>
              </Card>
              <Table
                dataSource={orderAssignments}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: "max-content" }}
              />
            </>
          ) : (
            <Empty
              description="No order assignments found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default StaffOrderAssignmentModal;
