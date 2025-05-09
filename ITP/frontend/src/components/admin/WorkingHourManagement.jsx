import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Space,
  Button,
  Input,
  DatePicker,
  Tag,
  Spin,
  Row,
  Col,
  Statistic,
  Divider,
  Select,
  Empty,
  Tooltip,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { getAllWorkingHours } from "../../api/workingHoursApi";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const WorkingHourManagement = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  const fetchWorkingHours = async () => {
    try {
      setLoading(true);
      const data = await getAllWorkingHours();
      // Add null safety check for the API response
      setWorkingHours(Array.isArray(data) ? data : []);
    } catch (error) {
      messageApi.error("Failed to fetch working hours data");
      console.error("Error fetching working hours:", error);
      setWorkingHours([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Calculate duration between clock in and clock out
  const calculateDuration = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return { hours: 0, minutes: 0, totalMinutes: 0 };

    try {
      const start = moment(clockIn);
      const end = moment(clockOut);

      // Make sure both dates are valid
      if (!start.isValid() || !end.isValid()) {
        return { hours: 0, minutes: 0, totalMinutes: 0 };
      }

      const duration = moment.duration(end.diff(start));

      const hours = Math.floor(duration.asHours());
      const minutes = Math.floor(duration.asMinutes() % 60);
      const totalMinutes = Math.floor(duration.asMinutes());

      return { hours, minutes, totalMinutes };
    } catch (error) {
      console.error("Error calculating duration:", error);
      return { hours: 0, minutes: 0, totalMinutes: 0 };
    }
  };

  // Format duration for display
  const formatDuration = (clockIn, clockOut) => {
    const { hours, minutes } = calculateDuration(clockIn, clockOut);

    if (hours === 0 && minutes === 0) return "N/A";
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;

    return `${hours}h ${minutes}m`;
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time) return "Not clocked out";
    try {
      const timeObj = moment(time);
      return timeObj.isValid() ? timeObj.format("HH:mm:ss") : "Invalid time";
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const dateObj = moment(date);
      return dateObj.isValid() ? dateObj.format("YYYY-MM-DD") : "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Filter data based on search, date range and selected staff
  const filteredData = workingHours.filter((record) => {
    // First, validate that record and its properties exist
    if (!record) return false;

    // Null safety for user object and its properties
    const userName = record.user?.name?.toLowerCase() || "";
    const userEmail = record.user?.email?.toLowerCase() || "";
    const recordDate = record.date ? formatDate(record.date) : "";

    // Search text filter
    const searchCondition =
      !searchText ||
      userName.includes(searchText.toLowerCase()) ||
      userEmail.includes(searchText.toLowerCase()) ||
      recordDate.includes(searchText);

    // Date range filter with null safety
    const dateCondition =
      !dateRange[0] ||
      !dateRange[1] ||
      !record.date ||
      (moment(record.date).isValid() &&
        dateRange[0] &&
        moment(dateRange[0]).isValid() &&
        dateRange[1] &&
        moment(dateRange[1]).isValid() &&
        moment(record.date).isSameOrAfter(dateRange[0], "day") &&
        moment(record.date).isSameOrBefore(dateRange[1], "day"));

    // Staff filter with null safety
    const staffCondition =
      !selectedStaff || (record.user && record.user._id === selectedStaff);

    return searchCondition && dateCondition && staffCondition;
  });

  // Get unique staff members for filter dropdown with null safety
  const staffMembers = Array.from(
    new Map(
      workingHours
        .filter((item) => item && item.user && item.user._id) // Filter out null/undefined values
        .map((item) => [item.user._id, item.user])
    ).values()
  );

  // Generate PDF report
  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Add title and date
      doc.setFontSize(18);
      doc.text("Working Hours Report", 14, 22);

      doc.setFontSize(11);
      const reportDate = moment().format("YYYY-MM-DD HH:mm:ss");
      doc.text(`Generated on: ${reportDate}`, 14, 30);

      // Add filters information if any
      let currentY = 38;
      if (searchText) {
        doc.text(`Search filter: ${searchText}`, 14, currentY);
        currentY += 7;
      }

      if (
        dateRange[0] &&
        dateRange[1] &&
        moment(dateRange[0]).isValid() &&
        moment(dateRange[1]).isValid()
      ) {
        doc.text(
          `Date range: ${dateRange[0].format(
            "YYYY-MM-DD"
          )} to ${dateRange[1].format("YYYY-MM-DD")}`,
          14,
          currentY
        );
        currentY += 7;
      }

      if (selectedStaff) {
        const staffMember = staffMembers.find(
          (s) => s && s._id === selectedStaff
        );
        const staffName = staffMember?.name || "Unknown";
        doc.text(`Staff: ${staffName}`, 14, currentY);
        currentY += 7;
      }

      // Add summary statistics with null safety
      const totalHours =
        filteredData.reduce((acc, record) => {
          if (!record || !record.clockIn) return acc;
          const { totalMinutes } = calculateDuration(
            record.clockIn,
            record.clockOut
          );
          return acc + totalMinutes;
        }, 0) / 60;

      doc.text(`Total Records: ${filteredData.length}`, 14, currentY);
      currentY += 7;
      doc.text(`Total Hours: ${totalHours.toFixed(2)}h`, 14, currentY);
      currentY += 10;

      // Create table data with null safety
      const tableColumn = [
        "Staff",
        "Date",
        "Clock In",
        "Clock Out",
        "Duration",
      ];
      const tableRows = filteredData.map((record) => [
        record?.user?.name || "Unknown",
        formatDate(record?.date),
        formatTime(record?.clockIn),
        formatTime(record?.clockOut),
        formatDuration(record?.clockIn, record?.clockOut),
      ]);

      // Add the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
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

      doc.save("working-hours-report.pdf");
      messageApi.success("PDF report generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      messageApi.error("Failed to generate PDF report");
    }
  };

  // Calculate summary statistics with null safety
  const totalWorkingTime = filteredData.reduce((acc, record) => {
    if (!record || !record.clockIn) return acc;
    const { totalMinutes } = calculateDuration(record.clockIn, record.clockOut);
    return acc + totalMinutes;
  }, 0);

  const totalHours = Math.floor(totalWorkingTime / 60);
  const totalMinutes = totalWorkingTime % 60;

  const averageWorkingTime =
    filteredData.length > 0 ? totalWorkingTime / filteredData.length : 0;

  const averageHours = Math.floor(averageWorkingTime / 60);
  const averageMinutes = Math.floor(averageWorkingTime % 60);

  // Define table columns with null safety
  const columns = [
    {
      title: "Staff",
      dataIndex: ["user", "name"],
      key: "name",
      render: (text, record) => (
        <Tooltip title={record?.user?.email || "No email"}>
          <Space>
            <UserOutlined />
            {text || "Unknown"}
          </Space>
        </Tooltip>
      ),
      sorter: (a, b) => {
        const nameA = a?.user?.name || "";
        const nameB = b?.user?.name || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => formatDate(text),
      sorter: (a, b) => {
        if (!a?.date) return -1;
        if (!b?.date) return 1;
        return moment(a.date).isValid() && moment(b.date).isValid()
          ? moment(a.date).diff(moment(b.date))
          : 0;
      },
    },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (text) => formatTime(text),
      sorter: (a, b) => {
        if (!a?.clockIn) return -1;
        if (!b?.clockIn) return 1;
        return moment(a.clockIn).isValid() && moment(b.clockIn).isValid()
          ? moment(a.clockIn).diff(moment(b.clockIn))
          : 0;
      },
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      render: (text) => {
        if (!text) {
          return <Tag color="processing">Currently Working</Tag>;
        }
        return formatTime(text);
      },
      sorter: (a, b) => {
        if (!a?.clockOut) return 1;
        if (!b?.clockOut) return -1;
        return moment(a.clockOut).isValid() && moment(b.clockOut).isValid()
          ? moment(a.clockOut).diff(moment(b.clockOut))
          : 0;
      },
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => {
        if (!record || !record.clockIn) {
          return <Tag color="error">Invalid data</Tag>;
        }

        const duration = formatDuration(record.clockIn, record.clockOut);
        if (duration === "N/A") {
          return <Tag color="warning">Incomplete</Tag>;
        }

        const { totalMinutes } = calculateDuration(
          record.clockIn,
          record.clockOut
        );
        const color =
          totalMinutes < 60 ? "red" : totalMinutes > 480 ? "green" : "blue";

        return <Tag color={color}>{duration}</Tag>;
      },
      sorter: (a, b) => {
        if (!a?.clockIn) return -1;
        if (!b?.clockIn) return 1;

        const durationA = calculateDuration(a.clockIn, a.clockOut).totalMinutes;
        const durationB = calculateDuration(b.clockIn, b.clockOut).totalMinutes;
        return durationA - durationB;
      },
    },
  ];

  const resetFilters = () => {
    setSearchText("");
    setDateRange([null, null]);
    setSelectedStaff(null);
  };

  return (
    <div>
      {contextHolder}
      <Card>
        <Title level={3}>
          <ClockCircleOutlined /> Working Hours Management
        </Title>
        <Divider />

        {/* Stats Summary */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Statistic
              title="Total Records"
              value={filteredData.length}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Working Time"
              value={`${totalHours}h ${totalMinutes}m`}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Staff Members"
              value={
                new Set(
                  filteredData
                    .filter((item) => item && item.user && item.user._id)
                    .map((item) => item.user._id)
                ).size
              }
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Average Working Time"
              value={
                filteredData.length
                  ? `${averageHours}h ${averageMinutes}m`
                  : "N/A"
              }
              prefix={<ClockCircleOutlined />}
            />
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Row gutter={16} className="mb-4" align="middle">
          <Col xs={24} sm={8} md={6} lg={5}>
            <Input
              placeholder="Search staff or date..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={10} md={8} lg={7}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: "100%" }}
              placeholder={["Start date", "End date"]}
            />
          </Col>
          <Col xs={24} sm={6} md={5} lg={4}>
            <Select
              placeholder="Select staff"
              style={{ width: "100%" }}
              value={selectedStaff}
              onChange={setSelectedStaff}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {staffMembers.map((staff) => (
                <Select.Option key={staff?._id || "unknown"} value={staff?._id}>
                  {staff?.name || "Unknown"}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={5} lg={8}>
            <Space>
              <Button
                icon={<FilePdfOutlined />}
                type="primary"
                onClick={generatePDF}
                disabled={filteredData.length === 0}
              >
                Export PDF
              </Button>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </Space>
          </Col>
        </Row>

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spin size="large" tip="Loading working hours..." />
          </div>
        ) : filteredData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record?._id || Math.random().toString()} // Added null safety for rowKey
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <Empty description="No working hours data found" />
        )}
      </Card>
    </div>
  );
};

export default WorkingHourManagement;
