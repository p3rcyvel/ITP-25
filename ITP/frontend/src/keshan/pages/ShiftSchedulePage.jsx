import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Tag,
  Typography,
  Card,
  Divider,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { shiftApi } from "../api/shiftApi";
import moment from "moment";
import { userApi } from "../api/userApi";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const { Title, Text } = Typography;
const { Option } = Select;

const ShiftSchedulePage = () => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  // Fetch shifts on component mount
  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const data = await shiftApi.getAll();
      const users = await userApi.getAllUsers();
      setShifts(data);
      setFilteredShifts(data);
      setUsers(users);
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentShift(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentShift(record);
    form.setFieldsValue({
      user: record?.user?._id,
      startTime: record?.startTime ? moment(record.startTime) : null,
      endTime: record?.endTime ? moment(record.endTime) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await shiftApi.delete(id);
      messageApi.success("Shift deleted successfully");
      fetchShifts();
    } catch (error) {
      messageApi.error(error.message || "Failed to delete shift");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const shiftData = {
        ...values,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
      };

      if (currentShift) {
        await shiftApi.update(currentShift._id, shiftData);
        messageApi.success("Shift updated successfully");
      } else {
        await shiftApi.create(shiftData);
        messageApi.success("Shift created successfully");
      }

      setModalVisible(false);
      fetchShifts();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Shift Schedule", 14, 10);

    const tableColumn = [
      "Staff Member",
      "Email",
      "Start Time",
      "End Time",
      "Status",
    ];
    const tableRows = [];

    filteredShifts.forEach((shift) => {
      const shiftData = [
        shift?.user?.name || "N/A",
        shift?.user?.email || "N/A",
        shift?.startTime ? moment(shift.startTime).format("YYYY-MM-DD HH:mm") : "N/A",
        shift?.endTime ? moment(shift.endTime).format("YYYY-MM-DD HH:mm") : "N/A",
        shift?.status || "N/A",
      ];
      tableRows.push(shiftData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("ShiftSchedule.pdf");
  };
  useEffect(() => {
    filterShifts();
  }, [searchTerm, shifts]);
  const filterShifts = () => {
    const filtered = shifts.filter(
      (shift) =>
        shift?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredShifts(filtered);
  };
  const columns = [
    {
      title: "Staff Member",
      dataIndex: ["user", "name"],
      key: "user",
      render: (text, record) => `${record?.user?.name || "N/A"} (${record?.user?.email || "N/A"})`,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (!status) return <Tag color="gray">N/A</Tag>;
        
        let color = "";
        switch (status) {
          case "scheduled":
            color = "blue";
            break;
          case "in-progress":
            color = "orange";
            break;
          case "completed":
            color = "green";
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
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
            disabled={record.status !== "scheduled"}
          />
          <Popconfirm
            title="Are you sure to delete this shift?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            disabled={record.status !== "scheduled"}
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              disabled={record.status !== "scheduled"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="shift-schedule-container" style={{ padding: '24px', backgroundColor: '#f5f7fa' }}>
      {contextHolder}
      <Card 
        className="header-card"
        style={{ 
          marginBottom: 24, 
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center">
              <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Title level={3} style={{ margin: 0 }}>Shift Schedule</Title>
            </Space>
            <Text type="secondary" style={{ marginLeft: 32 }}>
              Manage staff shifts and schedules
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Input
                placeholder="Search by Staff Name or Email"
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: 280,
                  borderRadius: 6,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              />
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={generatePDF}
                style={{ 
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  background: '#52c41a',
                  borderColor: '#52c41a'
                }}
              >
                Export PDF
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
                style={{ 
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Add Shift
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card 
        className="table-card"
        style={{ 
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredShifts}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} shifts`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          style={{ marginTop: 8 }}
          bordered={false}
          rowClassName={() => 'table-row'}
        />
      </Card>

      <Modal
        title={
          <Space>
            {currentShift ? <EditOutlined /> : <PlusOutlined />}
            <span>{currentShift ? "Edit Shift" : "Add New Shift"}</span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        width={700}
        centered
        bodyStyle={{ padding: '24px' }}
        okText={currentShift ? "Update" : "Create"}
        okButtonProps={{ 
          style: { borderRadius: 6 } 
        }}
        cancelButtonProps={{ 
          style: { borderRadius: 6 } 
        }}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="user"
                label={
                  <Space>
                    <TeamOutlined />
                    <span>Staff Member</span>
                  </Space>
                }
                rules={[
                  { required: true, message: "Please select a staff member" },
                ]}
              >
                <Select 
                  placeholder="Select staff member"
                  showSearch
                  optionFilterProp="children"
                  style={{ borderRadius: 6 }}
                >
                  {users && users.map((user) => (
                    <Option key={user?._id} value={user?._id}>
                      {`${user?.name || "N/A"} (${user?.email || "N/A"})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label={
                  <Space>
                    <ClockCircleOutlined />
                    <span>Start Time</span>
                  </Space>
                }
                rules={[{ required: true, message: "Please select start time" }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: "100%", borderRadius: 6 }}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label={
                  <Space>
                    <ClockCircleOutlined />
                    <span>End Time</span>
                  </Space>
                }
                rules={[
                  { required: true, message: "Please select end time" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        !getFieldValue("startTime") ||
                        value > getFieldValue("startTime")
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("End time must be after start time");
                    },
                  }),
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: "100%", borderRadius: 6 }}
                  disabledDate={(current) => {
                    const startTime = form.getFieldValue("startTime");
                    return (
                      current &&
                      startTime &&
                      current < moment(startTime).startOf("day")
                    );
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      <style jsx>{`
        .table-row:hover {
          background-color: #f0f7ff;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ShiftSchedulePage;
