import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";

const HotelsPage = () => {
  const navigate = useNavigate();
  const [rooms] = useState([
    {
      id: 1,
      name: "Standard Room",
      imageUrl:
        "https://granbellhotel.lk/wp-content/uploads/2022/09/Standard-Room-1200x630-1.jpg",
      description: "A cozy standard room with all basic amenities.",
      price: "$50/night",
    },
    {
      id: 2,
      name: "Deluxe Room",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/382378993.jpg?k=ed7f1af4eec2ca9b6e4dec7ab31b1b0f271f1165fb5094697e852ca4b3d0dac7&o=&hp=1",
      description: "A luxurious room with stunning views and extra space.",
      price: "$100/night",
    },
    {
      id: 3,
      name: "Queen Room",
      imageUrl:
        "https://www.redrockresort.com/wp-content/uploads/2020/12/RR-Standard-2-Queen.jpg",
      description: "Spacious room with two queen-sized beds.",
      price: "$80/night",
    },
    {
      id: 4,
      name: "Executive Suite",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/612342620.jpg?k=cc6ae8ff60a7bd414a013a742006cfd1d75f000cad3f657996dd7f3281fd99a7&o=&hp=1",
      description: "An executive suite with premium amenities.",
      price: "$150/night",
    },
    {
      id: 5,
      name: "Family Room",
      imageUrl:
        "https://granbellhotel.lk/wp-content/uploads/2022/09/Standard-Room-1200x630-1.jpg",
      description: "Perfect for families with kids.",
      price: "$120/night",
    },
    {
      id: 6,
      name: "Ocean View Room",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/382378993.jpg?k=ed7f1af4eec2ca9b6e4dec7ab31b1b0f271f1165fb5094697e852ca4b3d0dac7&o=&hp=1",
      description: "Room with a breathtaking ocean view.",
      price: "$200/night",
    },
    {
      id: 7,
      name: "Mountain View Room",
      imageUrl:
        "https://www.redrockresort.com/wp-content/uploads/2020/12/RR-Standard-2-Queen.jpg",
      description: "Room with a serene mountain view.",
      price: "$90/night",
    },
    {
      id: 8,
      name: "Luxury Suite",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/612342620.jpg?k=cc6ae8ff60a7bd414a013a742006cfd1d75f000cad3f657996dd7f3281fd99a7&o=&hp=1",
      description: "A lavish suite for a memorable stay.",
      price: "$250/night",
    },
    {
      id: 9,
      name: "Single Room",
      imageUrl:
        "https://granbellhotel.lk/wp-content/uploads/2022/09/Standard-Room-1200x630-1.jpg",
      description: "Compact and affordable single room.",
      price: "$40/night",
    },
    {
      id: 10,
      name: "Presidential Suite",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/382378993.jpg?k=ed7f1af4eec2ca9b6e4dec7ab31b1b0f271f1165fb5094697e852ca4b3d0dac7&o=&hp=1",
      description: "The ultimate luxury experience.",
      price: "$500/night",
    },
  ]);

  // State for search/filter
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rooms based on search term
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* Rooms Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Room Image */}
              <img
                src={room.imageUrl}
                alt={room.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
              />

              {/* Room Details */}
              <div style={{ padding: "10px" }}>
                <h3 style={{ margin: "0", fontSize: "18px" }}>{room.name}</h3>
                <p style={{ margin: "5px 0", color: "#555" }}>
                  {room.description}
                </p>
                <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                  {room.price}
                </p>

                {/* Book Now Button */}
                <button
                  style={{
                    background: "#1890ff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#40a9ff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#1890ff")
                  }
                  onClick={() => {
                    navigate(`/book`);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
