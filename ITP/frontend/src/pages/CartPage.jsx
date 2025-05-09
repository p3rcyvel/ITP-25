import React, { useState, useEffect } from "react";
import { Table, Button, Spin, Modal, Form, Input, message } from "antd";
import cartService from "../services/cartService";
import { createOrder } from "../api/orderApi";
import Navbar from "../components/common/Navbar";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const currentUserId = localStorage.getItem("id");
  const [messageApi, contextHolder] = message.useMessage();
  // Fetch cart items on component mount
  useEffect(() => {
    try {
      const items = cartService.getCart(); // Get cart items from cartService
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
      message.error("Failed to load cart. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  }, []);

  // Handle removing an item from the cart
  const handleRemoveItem = (itemId) => {
    cartService.removeItem(itemId); // Remove item using cartService
    setCartItems([...cartService.getCart()]); // Update state with a new array to trigger re-render
    message.success("Item removed from cart.");
  };

  // Handle increasing quantity of an item
  const handleIncreaseQuantity = (itemId) => {
    cartService.increaseQuantity(itemId); // Increase quantity using cartService
    setCartItems([...cartService.getCart()]); // Create a new array reference to ensure re-render
  };

  // Handle decreasing quantity of an item
  const handleDecreaseQuantity = (itemId) => {
    cartService.decreaseQuantity(itemId); // Decrease quantity using cartService
    setCartItems([...cartService.getCart()]); // Create a new array reference to ensure re-render
  };

  // Calculate total price of the cart
  const calculateTotalPrice = () => {
    return cartService.calculateTotalPrice();
  };

  // Open the checkout modal
  const openCheckoutModal = () => {
    setIsModalVisible(true);
  };

  // Close the checkout modal
  const closeCheckoutModal = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields
  };

  // Handle form submission for placing an order
  const handlePlaceOrder = async (values) => {
    console.log(values);
    setLoading(true); // Start loading state
    try {
      const orderData = {
        user: currentUserId,
        items: cartItems.map((item) => ({
          foodItem: item._id,
          quantity: item.quantity,
        })),
        totalPrice: calculateTotalPrice(),
        deliveryAddress: values.deliveryAddress,
        contactNumber: values.contactNumber,
      };

      // Create an order
      await createOrder(orderData);

      messageApi.success("Order placed successfully!");
      cartService.clearCart(); // Clear the cart after successful order
      setCartItems([]); // Reset cart state
      closeCheckoutModal(); // Close the modal
    } catch (error) {
      console.error("Error placing order:", error);
      messageApi.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Define table columns for cart items
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `LKR ${price.toLocaleString()}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => handleDecreaseQuantity(record._id)}
            disabled={record.quantity <= 1}
          >
            -
          </Button>
          <span style={{ margin: "0 10px" }}>{quantity}</span>
          <Button
            type="primary"
            size="small"
            onClick={() => handleIncreaseQuantity(record._id)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (record) =>
        `LKR ${(record.price * record.quantity).toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Button danger onClick={() => handleRemoveItem(record._id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Cart</h2>
        {contextHolder}
        {/* Loading State */}
        {loading ? (
          <Spin
            size="large"
            tip="Loading cart..."
            style={{ display: "block", margin: "50px auto" }}
          />
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {/* Cart Items Table */}
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey="_id"
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>
                      LKR {calculateTotalPrice().toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}></Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />

            {/* Checkout Button */}
            <Button
              type="primary"
              style={{ marginTop: "20px" }}
              onClick={openCheckoutModal}
            >
              Checkout
            </Button>
          </>
        )}

        {/* Checkout Modal */}
        <Modal
          title="Place Order"
          open={isModalVisible}
          onCancel={closeCheckoutModal}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
            <Form.Item
              label="Delivery Address"
              name="deliveryAddress"
              rules={[
                {
                  required: true,
                  message: "Please enter your delivery address!",
                },
              ]}
            >
              <Input placeholder="Enter your delivery address" />
            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter your contact number!",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Contact number must be 10 digits!",
                },
              ]}
            >
              <Input placeholder="Enter your 10-digit contact number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Place Order
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CartPage;
