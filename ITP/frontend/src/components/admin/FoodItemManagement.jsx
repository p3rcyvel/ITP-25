import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Popconfirm,
  message,
  Form,
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  createFoodItem,
  getAllFoodItems,
  updateFoodItem,
  deleteFoodItem,
} from "../../api/foodApi";
import { uploadFile } from "../../services/firebaseService";

const FoodItemManagement = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all food items on component mount
  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await getAllFoodItems();
      setFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      messageApi.error("Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new food item
  const handleCreateFoodItem = async (values) => {
    setLoading(true);
    try {
      if (fileList.length === 0) {
        throw new Error("Please upload an image!");
      }

      const file = fileList[0].originFileObj;
      const imageUrl = await uploadFile(file);

      const newItem = { ...values, imageUrl };
      await createFoodItem(newItem);
      messageApi.success("Food item created successfully");
      fetchFoodItems(); // Refresh the food list
      setIsCreateModalVisible(false); // Close the modal
      setFileList([]); // Reset file list
    } catch (error) {
      console.error("Error creating food item:", error);
      messageApi.error(error.message || "Failed to create food item");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a food item
  const handleUpdateFoodItem = async (id, values) => {
    setLoading(true);
    try {
      let imageUrl = selectedItem.imageUrl;

      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        imageUrl = await uploadFile(file);
      }

      const updatedItem = { ...values, imageUrl };
      await updateFoodItem(id, updatedItem);
      messageApi.success("Food item updated successfully");
      fetchFoodItems(); // Refresh the food list
      setIsEditModalVisible(false); // Close the modal
      setFileList([]); // Reset file list
    } catch (error) {
      console.error("Error updating food item:", error);
      messageApi.error("Failed to update food item");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a food item
  const handleDeleteFoodItem = async (id) => {
    setLoading(true);
    try {
      await deleteFoodItem(id);
      messageApi.success("Food item deleted successfully");
      fetchFoodItems(); // Refresh the food list
    } catch (error) {
      console.error("Error deleting food item:", error);
      messageApi.error("Failed to delete food item");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF of food items
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Food Items List", 14, 10);
    autoTable(doc, {
      head: [["Name", "Description", "Price"]],
      body: foodItems.map((item) => [
        item.name,
        item.description,
        `$${item.price}`,
      ]),
    });
    doc.save("food-items.pdf");
  };

  // Filter food items based on search term
  const filteredItems = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search food items"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
        <div>
          <Button type="primary" onClick={generatePDF}>
            Generate PDF
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            style={{ marginLeft: "10px" }}
          >
            Add Food Item
          </Button>
        </div>
      </div>

      {/* Food Items Table */}
      <Table
        dataSource={filteredItems}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`,
          },
          {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (url) => (
              <img
                src={url}
                alt="Food Item"
                style={{ width: "50px", height: "50px" }}
              />
            ),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedItem(record);
                    setIsEditModalVisible(true);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this item?"
                  onConfirm={() => handleDeleteFoodItem(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Create Food Item Modal */}
      <Modal
        title="Add Food Item"
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setFileList([]);
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateFoodItem}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the food item name!" },
            ]}
          >
            <Input placeholder="Enter food item name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter the food item description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter food item description" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Food Item
          </Button>
        </Form>
      </Modal>

      {/* Edit Food Item Modal */}
      <Modal
        title="Edit Food Item"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setFileList([]);
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={selectedItem}
          onFinish={(values) => handleUpdateFoodItem(selectedItem?._id, values)}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the food item name!" },
            ]}
          >
            <Input placeholder="Enter food item name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter the food item description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter food item description" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: false }]} // Optional for updates
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Food Item
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodItemManagement;
