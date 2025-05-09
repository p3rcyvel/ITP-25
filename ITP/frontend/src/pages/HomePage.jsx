import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import { getAllFoodItems } from "../api/foodApi";
import { Card, Spin, Button, Empty, Typography, Image, message } from "antd";
import styled from "styled-components";
import cartService from "../services/cartService";

const { Title, Text } = Typography;

// Styled Components for Grid and Loading State
const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const HomePage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await getAllFoodItems();

        setFoodItems(response.data);
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Format price to LKR
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}`;
  };

  return (
    <div>
      <Navbar />
      {contextHolder}
      <div style={{ padding: "20px" }}>
        <Title level={3}>Food Menu</Title>

        {/* Loading State */}
        {loading && (
          <LoadingContainer>
            <Spin size="large" tip="Loading food items..." />
          </LoadingContainer>
        )}

        {/* Error State */}
        {error && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>Failed to load food items.</span>}
          />
        )}

        {/* Food Items Grid */}
        {!loading && !error && (
          <FoodGrid>
            {foodItems.length > 0 ? (
              foodItems.map((item) => (
                <Card
                  key={item._id}
                  hoverable
                  cover={
                    <Image
                      alt={item.name}
                      src={item.imageUrl}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  }
                >
                  <Title level={5}>{item.name}</Title>
                  <Text type="secondary">{item.description}</Text>
                  <div style={{ marginTop: "10px" }}>
                    <Text strong>{formatPrice(item.price)}</Text>
                  </div>
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      cartService.addItem(item);
                      messageApi.success(
                        `${item.name} has been added to your cart!`
                      );
                    }}
                  >
                    Add to Cart
                  </Button>
                </Card>
              ))
            ) : (
              <Empty description={<span>No food items available.</span>} />
            )}
          </FoodGrid>
        )}
      </div>
    </div>
  );
};

export default HomePage;
