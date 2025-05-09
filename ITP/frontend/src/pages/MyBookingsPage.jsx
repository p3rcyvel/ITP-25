import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import {
  Table,
  Input,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  DatePicker,
} from "antd";
import { getAllBookings, updateBooking } from "../api/bookingApi";
import moment from "moment";
const MyBookingsPage = () => {
  const currentUserId = localStorage.getItem("id");

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
        const userBookings = response.data.filter(
          (booking) => booking.userId === currentUserId
        );
        setBookings(userBookings);
        setFilteredBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [currentUserId]);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = bookings.filter((booking) =>
      booking.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  // Handle status update for a booking
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBooking(bookingId, { status: newStatus });
      messageApi.success(`Booking status updated to ${newStatus}`);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      setFilteredBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      messageApi.error("Failed to update booking status");
    }
  };

  // Open modal for editing a booking
  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setIsModalVisible(true);
  };

  // Close modal
  const closeEditModal = () => {
    setIsModalVisible(false);
    setEditingBooking(null);
  };

  // Handle form submission for updating a booking
  const handleUpdateBooking = async (values) => {
    try {
      await updateBooking(editingBooking._id, values);
      messageApi.success("Booking updated successfully!");
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === editingBooking._id
            ? { ...booking, ...values }
            : booking
        )
      );
      setFilteredBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === editingBooking._id
            ? { ...booking, ...values }
            : booking
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating booking:", error);
      messageApi.error("Failed to update booking");
    }
  };

  // Define table columns
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
        <div>
          {status === "pending" ? (
            <>
              <Button
                type="primary"
                onClick={() => openEditModal(record)}
                style={{ marginRight: "10px" }}
              >
                Edit Booking
              </Button>
              <Popconfirm
                title="Are you sure you want to cancel this booking?"
                onConfirm={() => handleStatusChange(record._id, "cancelled")}
                okText="Yes"
                cancelText="No"
              >
                <Button type="dashed" danger>
                  Cancel Booking
                </Button>
              </Popconfirm>
            </>
          ) : (
            status
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
        <h2>My Bookings</h2>
        <Input.Search
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: "20px", width: "300px" }}
        />
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Edit Booking Modal */}
      <Modal
        title="Edit Booking"
        open={isModalVisible}
        onCancel={closeEditModal}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateBooking}
          initialValues={{
            name: editingBooking?.name,
            email: editingBooking?.email,
            checkinDate: editingBooking?.checkinDate
              ? moment(editingBooking.checkinDate)
              : null,
            checkoutDate: editingBooking?.checkoutDate
              ? moment(editingBooking.checkoutDate)
              : null,
            numberOfGuests: editingBooking?.numberOfGuests,
            nic: editingBooking?.nic,
            advance: editingBooking?.advance,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your name!" },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: "Name must contain only alphabets and spaces!",
              },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Check-in Date"
            name="checkinDate"
            rules={[
              { required: true, message: "Please select a check-in date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value > new Date()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Check-in date must be in the future!")
                  );
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Check-out Date"
            name="checkoutDate"
            rules={[
              { required: true, message: "Please select a check-out date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value > getFieldValue("checkinDate")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Check-out date must be after check-in date!")
                  );
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Number of Guests"
            name="numberOfGuests"
            rules={[
              { required: true, message: "Please enter number of guests!" },
              {
                validator: (_, value) => {
                  const num = parseInt(value, 10);
                  if (isNaN(num) || num < 1) {
                    return Promise.reject("At least one guest required!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" min="1" />
          </Form.Item>

          <Form.Item
            label="NIC (National Identity Card)"
            name="nic"
            rules={[
              { required: true, message: "Please enter your NIC!" },
              {
                pattern: /^(\d{12}|\d{11}[Vv])$/,
                message:
                  "NIC must be either 12 digits or 11 digits followed by 'V' or 'v'!",
              },
            ]}
          >
            <Input placeholder="200008501910 or 20000850191V" />
          </Form.Item>

          <Form.Item
            label="Advance Payment"
            name="advance"
            rules={[
              {
                validator: (_, value) => {
                  const num = parseFloat(value);
                  if (isNaN(num) || num < 0) {
                    return Promise.reject(
                      "Advance payment cannot be negative!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              min="0"
              placeholder="Optional advance payment"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
