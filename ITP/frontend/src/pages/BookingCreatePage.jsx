import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, message, Card } from "antd";
import { createBooking } from "../api/bookingApi";
import Navbar from "../components/common/Navbar";

const BookingCreatePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUser, setCurrentUser] = useState();
  const handleCreateBooking = async (values) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("id");
      if (!userId) throw new Error("User ID not found in localStorage");

      const bookingData = {
        ...values,
        userId,
        checkinDate: values.checkinDate.toISOString(),
        checkoutDate: values.checkoutDate.toISOString(),
      };

      await createBooking(bookingData);
      messageApi.success("Booking created successfully!");
      form.resetFields();
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating booking:", error);
      messageApi.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      messageApi.error("User ID not found in localStorage");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/users/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setCurrentUser(data);
        console.log(currentUser);
        form.setFieldsValue({
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        messageApi.error(error.message || "Failed to fetch user data");
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "40px 20px",
          background: "#f0f2f5", // Light gray Ant Design background
          minHeight: "100vh",
        }}
      >
        <Card
          title="Create a New Booking"
          bordered={false}
          style={{
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            background: "#ffffff", // White card
          }}
          headStyle={{ color: "#000", fontSize: "20px", fontWeight: 600 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateBooking}
            initialValues={{ numberOfGuests: 1, advance: 0 }}
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

            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Booking
            </Button>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default BookingCreatePage;
