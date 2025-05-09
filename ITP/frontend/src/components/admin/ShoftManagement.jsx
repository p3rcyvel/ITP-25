import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  DatePicker,
  Select,
  Popconfirm,
  message,
  Input,
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Tooltip,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  createShift,
  getAllShifts,
  updateShift,
  deleteShift,
} from "../../api/shiftApi";
import { getUsers } from "../../api/userApi";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const searchInputRef = useRef(null);

  // Fetch all shifts and users on component mount
  useEffect(() => {
    fetchShifts();
    fetchUsers();
  }, []);

  // Fetch shifts from API
  const fetchShifts = async () => {
    try {
      setLoading(true);
      const data = await getAllShifts();
      setShifts(data);
    } catch (error) {
      messageApi.error("Failed to fetch shifts");
      console.error("Error fetching shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.filter((user) => user.role === "staff"));
    } catch (error) {
      messageApi.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    }
  };

  // Handle form submission for create/edit
  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      const shiftData = {
        user: values.user,
        startTime: values.timeRange[0].toDate(),
        endTime: values.timeRange[1].toDate(),
        status: values.status,
      };

      if (editingShift) {
        await updateShift(editingShift._id, shiftData);
        messageApi.success("Shift updated successfully");
      } else {
        await createShift(shiftData);
        messageApi.success("Shift created successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingShift(null);
      fetchShifts();
    } catch (error) {
      messageApi.error(
        editingShift ? "Failed to update shift" : "Failed to create shift"
      );
      console.error("Error handling form submit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle shift deletion
  const handleDeleteShift = async (id) => {
    try {
      setLoading(true);
      await deleteShift(id);
      messageApi.success("Shift deleted successfully");
      fetchShifts();
    } catch (error) {
      messageApi.error("Failed to delete shift");
      console.error("Error deleting shift:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with existing shift data
  const handleEditShift = (shift) => {
    setEditingShift(shift);
    form.setFieldsValue({
      user: shift.user?._id,
      timeRange: [moment(shift.startTime), moment(shift.endTime)],
      status: shift.status,
    });
    setModalVisible(true);
  };

  // Generate PDF report of shifts
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Shifts Report", 14, 22);
    doc.setFontSize(11);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      14,
      30
    );

    // Apply filters to the data if search text exists
    const filteredShifts = shifts.filter(filterShifts);

    // Prepare data for PDF table
    const tableColumn = [
      "Staff Name",
      "Start Time",
      "End Time",
      "Hours",
      "Status",
    ];
    const tableRows = filteredShifts.map((shift) => [
      shift.user?.name,
      formatDate(shift.startTime),
      formatDate(shift.endTime),
      calculateHours(shift.startTime, shift.endTime),
      shift.status.toUpperCase(),
    ]);

    // Add the table to the PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.5,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Add summary
    const totalHours = filteredShifts.reduce((acc, shift) => {
      return acc + calculateHoursNumeric(shift.startTime, shift.endTime);
    }, 0);

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Shifts: ${filteredShifts.length}`, 14, finalY);
    doc.text(`Total Hours: ${totalHours.toFixed(2)}`, 14, finalY + 7);

    // Save the PDF
    doc.save("shifts-report.pdf");
    messageApi.success("PDF generated successfully");
  };

  // Format date for display
  const formatDate = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD HH:mm");
  };

  // Calculate hours between start and end time
  const calculateHours = (startTime, endTime) => {
    const hours = moment(endTime).diff(moment(startTime), "hours", true);
    return hours.toFixed(2);
  };

  // Calculate hours as numeric value
  const calculateHoursNumeric = (startTime, endTime) => {
    return moment(endTime).diff(moment(startTime), "hours", true);
  };

  // Filter shifts based on search input
  const filterShifts = (shift) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      shift.user?.name.toLowerCase().includes(searchLower) ||
      shift.status.toLowerCase().includes(searchLower) ||
      formatDate(shift.startTime).toLowerCase().includes(searchLower) ||
      formatDate(shift.endTime).toLowerCase().includes(searchLower)
    );
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "blue";
      case "in-progress":
        return "orange";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Staff Name",
      dataIndex: ["user", "name"],
      key: "name",
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => formatDate(text),
      sorter: (a, b) => moment(a.startTime).diff(moment(b.startTime)),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => formatDate(text),
      sorter: (a, b) => moment(a.endTime).diff(moment(b.endTime)),
    },
    {
      title: "Hours",
      key: "hours",
      render: (_, record) => calculateHours(record.startTime, record.endTime),
      sorter: (a, b) =>
        calculateHoursNumeric(a.startTime, a.endTime) -
        calculateHoursNumeric(b.startTime, b.endTime),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditShift(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this shift?"
              description="This action cannot be undone."
              onConfirm={() => handleDeleteShift(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filtered shifts based on search text
  const filteredShifts = shifts.filter(filterShifts);

  // Calculate statistics
  const totalHours = filteredShifts.reduce((acc, shift) => {
    return acc + calculateHoursNumeric(shift.startTime, shift.endTime);
  }, 0);

  const statusCounts = {
    scheduled: filteredShifts.filter((s) => s.status === "scheduled").length,
    inProgress: filteredShifts.filter((s) => s.status === "in-progress").length,
    completed: filteredShifts.filter((s) => s.status === "completed").length,
    cancelled: filteredShifts.filter((s) => s.status === "cancelled").length,
  };

  return (
    <div>
      {contextHolder}
      <Card>
        <Title level={3}>
          <CalendarOutlined /> Shift Management
        </Title>
        <Divider />

        {/* Summary Statistics */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Statistic
              title="Total Shifts"
              value={filteredShifts.length}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Hours"
              value={totalHours.toFixed(2)}
              precision={2}
              prefix={<ClockCircleOutlined />}
              suffix="hrs"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Active Staff"
              value={new Set(filteredShifts.map((s) => s.user?._id)).size}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Tag color="blue">Scheduled: {statusCounts.scheduled}</Tag>
              <Tag color="orange">In Progress: {statusCounts.inProgress}</Tag>
              <Tag color="green">Completed: {statusCounts.completed}</Tag>
              <Tag color="red">Cancelled: {statusCounts.cancelled}</Tag>
            </Space>
          </Col>
        </Row>

        {/* Action Buttons and Search */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingShift(null);
                  form.resetFields();
                  setModalVisible(true);
                }}
              >
                Add Shift
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={generatePDF}
              >
                Export PDF
              </Button>
            </Space>
          </Col>
          <Col>
            <Input
              placeholder="Search shifts..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
              ref={searchInputRef}
            />
          </Col>
        </Row>

        {/* Shifts Table */}
        <Table
          columns={columns}
          dataSource={filteredShifts}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingShift ? "Edit Shift" : "Create New Shift"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingShift(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="user"
            label="Staff Member"
            rules={[
              { required: true, message: "Please select a staff member" },
            ]}
          >
            <Select
              placeholder="Select staff member"
              loading={loading}
              showSearch
              optionFilterProp="children"
            >
              {users.map((user) => (
                <Select.Option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Shift Time Range"
            rules={[
              { required: true, message: "Please select shift time range" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !value[0] || !value[1])
                    return Promise.resolve();

                  const startTime = value[0];
                  const endTime = value[1];

                  if (endTime.isBefore(startTime)) {
                    return Promise.reject(
                      new Error("End time must be after start time")
                    );
                  }

                  if (endTime.diff(startTime, "hours") > 24) {
                    return Promise.reject(
                      new Error("Shift cannot exceed 24 hours")
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={["Start time", "End time"]}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
            initialValue="scheduled"
          >
            <Select placeholder="Select status">
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Row justify="end">
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingShift(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingShift ? "Update" : "Create"}
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShiftManagement;
