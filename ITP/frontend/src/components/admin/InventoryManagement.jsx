import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Popconfirm,
  message,
  Form,
  Select,
  Alert,
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
  addOrUpdateInventoryItem,
  getAllInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../api/inventoryApi";

const { Option } = Select;

// Suitable categories for a hotel food inventory
const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Bakery",
  "Beverages",
  "Spices",
  "Other",
];

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all inventory items on component mount
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    setLoading(true);
    try {
      const response = await getAllInventoryItems();
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      messageApi.error("Failed to fetch inventory items");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding or updating an inventory item
  const handleAddOrUpdateItem = async (values) => {
    setLoading(true);
    try {
      var data = await addOrUpdateInventoryItem(values);

      //error 
      if (data.status == false || data.status == "false") {
        console.log(data.message)
        messageApi.error(data.message);
      } else {
        messageApi.success(data.message);
        fetchInventoryItems(); // Refresh the inventory list
        setIsCreateModalVisible(false); // Close the modal
      }


    } catch (error) {
      console.error("Error adding/updating inventory item:", error);
      messageApi.error(error.message || "Failed to add/update inventory item");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating an inventory item
  const handleUpdateItem = async (id, values) => {
    setLoading(true);
    try {
      await updateInventoryItem(id, values);
      messageApi.success("Inventory item updated successfully");
      fetchInventoryItems(); // Refresh the inventory list
      setIsEditModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error updating inventory item:", error);
      messageApi.error("Failed to update inventory item");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an inventory item
  const handleDeleteItem = async (id) => {
    setLoading(true);
    try {
      await deleteInventoryItem(id);
      messageApi.success("Inventory item deleted successfully");
      fetchInventoryItems(); // Refresh the inventory list
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      messageApi.error("Failed to delete inventory item");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF of inventory items categorized
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory List", 14, 10);

    // Group items by category
    const groupedItems = {};
    inventoryItems.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });

    let yPos = 20;
    Object.keys(groupedItems).forEach((category) => {
      doc.text(
        `${category} (${groupedItems[category].length} items)`,
        14,
        yPos
      );
      yPos += 10;

      autoTable(doc, {
        head: [["ID", "Name", "Supplier", "Quantity", "Price", "Expire Date"]],
        body: groupedItems[category].map((item) => [
          item.inventoryId,
          item.name,
          item.supplier,
          item.quantity,
          `$${item.price}`,
          new Date(item.expireDate).toLocaleDateString(),
        ]),
        startY: yPos,
      });
      yPos = doc.lastAutoTable.finalY + 10; // Adjust position for next category
    });

    doc.save("inventory.pdf");
  };

  // Filter and sort inventory items
  const filteredAndSortedItems = inventoryItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.inventoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (item) => filterCategory === "All" || item.category === filterCategory
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else if (sortOrder === "desc") {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
      return 0;
    });

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
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search inventory items"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "300px" }}
          />
          <Select
            placeholder="Filter by category"
            value={filterCategory}
            onChange={(value) => setFilterCategory(value)}
            style={{ width: "200px" }}
          >
            <Option value="All">All</Option>
            {CATEGORIES.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
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
            Add Inventory Item
          </Button>
        </div>
      </div>

      {/* Sorting Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <Button
          onClick={() => {
            setSortField("name");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          Sort by Name ({sortField === "name" && sortOrder})
        </Button>
        <Button
          onClick={() => {
            setSortField("quantity");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
          style={{ marginLeft: "10px" }}
        >
          Sort by Quantity ({sortField === "quantity" && sortOrder})
        </Button>
        <Button
          onClick={() => {
            setSortField("price");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
          style={{ marginLeft: "10px" }}
        >
          Sort by Price ({sortField === "price" && sortOrder})
        </Button>
      </div>

      {/* Inventory Table */}
      <Table
        dataSource={filteredAndSortedItems}
        columns={[
          {
            title: "ID",
            dataIndex: "inventoryId",
            key: "inventoryId",
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Category",
            dataIndex: "category",
            key: "category",
          },
          {
            title: "Supplier",
            dataIndex: "supplier",
            key: "supplier",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`,
          },
          {
            title: "Expire Date",
            dataIndex: "expireDate",
            key: "expireDate",
            render: (date) => new Date(date).toLocaleDateString(),
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
                ></Button>
                <Popconfirm
                  title="Are you sure to delete this item?"
                  onConfirm={() => handleDeleteItem(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Create Inventory Item Modal */}
      <Modal
        title="Add Inventory Item"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddOrUpdateItem}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Inventory ID"
              name="inventoryId"
            >
              <Input placeholder="Enter inventory ID" />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
            >
              <Input placeholder="Enter item name" />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
            >
              <Select placeholder="Select category">
                {CATEGORIES.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Supplier"
              name="supplier"
            >
              <Input placeholder="Enter supplier name" />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
            >
              <Input type="number" placeholder="Enter quantity" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
            >
              <Input type="number" placeholder="Enter price" />
            </Form.Item>
          </div>
          <Form.Item
            label="Expire Date"
            name="expireDate"
          >
            <Input type="date" placeholder="Select expire date" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Inventory Item
          </Button>
        </Form>
      </Modal>

      {/* Edit Inventory Item Modal */}
      <Modal
        title="Edit Inventory Item"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={selectedItem}
          onFinish={(values) => handleUpdateItem(selectedItem?._id, values)}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Inventory ID"
              name="inventoryId"
              rules={[
                { required: true, message: "Please enter the inventory ID!" },
                {
                  pattern: /^[A-Za-z0-9-]+$/,
                  message:
                    "Inventory ID must be alphanumeric with optional hyphens!",
                },
              ]}
            >
              <Input placeholder="Enter inventory ID" />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the item name!" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Name must contain only alphabets and spaces!",
                },
              ]}
            >
              <Input placeholder="Enter item name" />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[
                { required: true, message: "Please select the category!" },
              ]}
            >
              <Select placeholder="Select category">
                {CATEGORIES.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Supplier"
              name="supplier"
              rules={[
                { required: true, message: "Please enter the supplier name!" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message:
                    "Supplier name must contain only alphabets and spaces!",
                },
              ]}
            >
              <Input placeholder="Enter supplier name" />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please enter the quantity!" },
              ]}
            >
              <Input type="number" placeholder="Enter quantity" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter the price!" }]}
            >
              <Input type="number" placeholder="Enter price" />
            </Form.Item>
          </div>
          <Form.Item
            label="Expire Date"
            name="expireDate"
            rules={[
              { required: true, message: "Please select the expire date!" },
            ]}
          >
            <Input type="date" placeholder="Select expire date" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Inventory Item
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;
