import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Input,
  Space,
  Typography,
  Tag,
  DatePicker,
  Row,
  Col,
  message,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { workingHoursApi } from "../api/workingHourApi";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminWorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  const fetchWorkingHours = async () => {
    try {
      setLoading(true);
      const data = await workingHoursApi.getAll();
      setWorkingHours(data);
    } catch (error) {
      messageApi.error(error.message || "Failed to fetch working hours");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text("Working Hours Report", 14, 15);

    // Table
    doc.autoTable({
      head: [["Staff", "Date", "Clock In", "Clock Out", "Hours Worked"]],
      body: filteredHours.map((record) => [
        record.user?.name || "N/A",
        moment(record.date).format("YYYY-MM-DD"),
        moment(record.clockIn).format("HH:mm:ss"),
        record.clockOut ? moment(record.clockOut).format("HH:mm:ss") : "N/A",
        record.totalHours ? record.totalHours.toFixed(2) + " hrs" : "N/A",
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

    doc.save("working-hours-report.pdf");
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const filteredHours = workingHours.filter((record) => {
    // Search by user name or email
    const matchesSearch =
      record.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by date range if selected
    const matchesDate =
      dateRange.length === 0 ||
      (moment(record.date).isSameOrAfter(dateRange[0], "day") &&
        moment(record.date).isSameOrBefore(dateRange[1], "day"));

    return matchesSearch && matchesDate;
  });

  const columns = [
    {
      title: "Staff Member",
      dataIndex: ["user", "name"],
      key: "user",
      render: (_, record) => (
        <div>
          <div>{record.user?.name || "N/A"}</div>
          <Text type="secondary">{record.user?.email || ""}</Text>
        </div>
      ),
      sorter: (a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (clockIn) => moment(clockIn).format("HH:mm:ss"),
      sorter: (a, b) => new Date(a.clockIn) - new Date(b.clockIn),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      render: (clockOut) =>
        clockOut ? (
          moment(clockOut).format("HH:mm:ss")
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
      sorter: (a, b) => {
        if (!a.clockOut) return -1;
        if (!b.clockOut) return 1;
        return new Date(a.clockOut) - new Date(b.clockOut);
      },
    },
    {
      title: "Hours Worked",
      dataIndex: "totalHours",
      key: "totalHours",
      render: (totalHours) =>
        totalHours ? (
          <Tag color={totalHours >= 8 ? "green" : "orange"}>
            {totalHours.toFixed(2)} hrs
          </Tag>
        ) : (
          <Tag color="red">N/A</Tag>
        ),
      sorter: (a, b) => (a.totalHours || 0) - (b.totalHours || 0),
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
            <Title level={4}>Working Hours Management</Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={generatePDF}
              >
                Export PDF
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Input
              placeholder="Search by staff name or email"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={12}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={handleDateChange}
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
              ranges={{
                Today: [moment(), moment()],
                "This Week": [moment().startOf("week"), moment().endOf("week")],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredHours}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default AdminWorkingHours;
