import React, { useState, useEffect } from "react";
import { Modal, Table, Tag, Spin, Empty, Button, Space, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getAllShifts, updateShift } from "../../api/shiftApi";

const ShiftsModal = ({ historyVisible, onClose }) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const currentUserId = localStorage.getItem("id");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (historyVisible) {
      fetchShifts();
    }
  }, [historyVisible]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await getAllShifts();

      if (response && Array.isArray(response)) {
        // Filter shifts for the current user
        const userShifts = response.filter(
          (shift) =>
            shift.user._id === currentUserId ||
            (typeof shift.user === "string" && shift.user === currentUserId)
        );
        setShifts(userShifts);
      } else {
        setShifts([]);
        messageApi.error("Failed to load shifts data");
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      messageApi.error("Failed to load shifts data");
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  const completeShift = async (shiftId) => {
    try {
      setActionLoading(true);
      const updateData = {
        status: "completed",
      };

      await updateShift(shiftId, updateData);

      // Update the local state
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift._id === shiftId ? { ...shift, status: "completed" } : shift
        )
      );

      messageApi.success("Shift marked as completed successfully!");
    } catch (error) {
      console.error("Error completing shift:", error);
      messageApi.error("Failed to complete shift. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not specified";

    const date = new Date(dateTimeString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "blue";
      case "completed":
        return "green";
      case "canceled":
        return "red";
      case "in progress":
        return "orange";
      default:
        return "default";
    }
  };

  const isShiftCompletable = (shift) => {
    return ["scheduled", "in-progress"].includes(shift.status?.toLowerCase());
  };

  const isCurrentShift = (shift) => {
    const now = new Date();
    const startTime = new Date(shift.startTime);
    const endTime = new Date(shift.endTime);

    return now >= startTime && now <= endTime;
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "startTime",
      key: "date",
      render: (startTime) => formatDateTime(startTime).split(",")[0],
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => {
        const time = new Date(startTime);
        return time.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) => {
        const time = new Date(endTime);
        return time.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => {
        const start = new Date(record.startTime);
        const end = new Date(record.endTime);
        const diffMs = end - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || "Unknown"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {isShiftCompletable(record) && (
            <Button
              type="dashed"
              icon={<CheckCircleOutlined />}
              onClick={() => completeShift(record._id)}
              loading={actionLoading}
              title={
                isCurrentShift(record)
                  ? "Complete this shift"
                  : "Can only complete shifts during their scheduled time"
              }
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="My Shifts"
      open={historyVisible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {contextHolder}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : shifts.length > 0 ? (
        <Table
          dataSource={shifts}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <Empty description="No shifts found" />
      )}
    </Modal>
  );
};

export default ShiftsModal;
