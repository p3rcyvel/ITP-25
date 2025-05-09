import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Spin,
  Popconfirm,
  Modal,
  message,
  Descriptions,
  Select,
} from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../../api/bookingApi";

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true); // Start loading state
        const response = await getAllBookings();
        setBookings(response.data); // Set bookings data
        setFilteredBookings(response.data); // Initialize filtered bookings
      } catch (error) {
        console.error("Error fetching bookings:", error);
        messageApi.error("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchBookings();
  }, []);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = bookings.filter((booking) =>
      booking.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  // Handle viewing booking details in a modal
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  // Handle updating the status of a booking
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true); // Start loading state
      await updateBooking(bookingId, { status: newStatus }); // Update status via API
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      ); // Update local state
      setFilteredBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      ); // Update filtered state
      messageApi.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      messageApi.error("Failed to update booking status. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = async (bookingId) => {
    try {
      setLoading(true); // Start loading state
      await deleteBooking(bookingId); // Delete booking via API
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      ); // Remove deleted booking from state
      setFilteredBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      ); // Remove from filtered state
      messageApi.success("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking:", error);
      messageApi.error("Failed to delete booking. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Generate PDF of bookings
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Booking Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Define the table columns
    const tableColumn = [
      "Name",
      "Email",
      "Check-in",
      "Check-out",
      "Guests",
      "Status",
    ];

    // Define the table data
    const tableRows = [];

    // Add data rows
    filteredBookings.forEach((booking) => {
      const bookingData = [
        booking.name,
        booking.email,
        new Date(booking.checkinDate).toLocaleDateString(),
        new Date(booking.checkoutDate).toLocaleDateString(),
        booking.numberOfGuests,
        booking.status,
      ];
      tableRows.push(bookingData);
    });

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
    });

    // Save the PDF
    doc.save("bookings-report.pdf");
    messageApi.success("PDF generated successfully!");
  };

  // Define table columns for bookings
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Check-in Date",
      dataIndex: "checkinDate",
      key: "checkinDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Check-out Date",
      dataIndex: "checkoutDate",
      key: "checkoutDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Number of Guests",
      dataIndex: "numberOfGuests",
      key: "numberOfGuests",
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
          <Select.Option value="confirmed">Confirmed</Select.Option>
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
            onClick={() => handleViewBooking(record)}
          />
          {/* Delete Button */}
          <Popconfirm
            title="Are you sure you want to delete this booking?"
            onConfirm={() => handleDeleteBooking(record._id)}
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
      <h2>Booking Management</h2>

      {/* Search Bar */}
      <Input.Search
        placeholder="Search by name"
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

      {/* Loading State */}
      {loading ? (
        <Spin
          size="large"
          tip="Loading bookings..."
          style={{ display: "block", margin: "50px auto" }}
        />
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Modal for Viewing Booking Details */}
      <Modal
        title="Booking Details"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedBooking && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {selectedBooking.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedBooking.email}
            </Descriptions.Item>
            <Descriptions.Item label="Check-in Date">
              {new Date(selectedBooking.checkinDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Check-out Date">
              {new Date(selectedBooking.checkoutDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Number of Guests">
              {selectedBooking.numberOfGuests}
            </Descriptions.Item>
            <Descriptions.Item label="NIC">
              {selectedBooking.nic}
            </Descriptions.Item>
            <Descriptions.Item label="Advance Payment">
              LKR {selectedBooking.advance.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedBooking.status.toUpperCase()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
