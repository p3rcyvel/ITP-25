import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components (Dark Theme)
const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  background: #1f1f1f;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const BrandName = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #40a9ff;
  cursor: pointer;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #40a9ff;
  }
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LoginButton = styled.button`
  background: #40a9ff;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #69c0ff;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background: #2a2a2a;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  overflow: hidden;
  z-index: 100;
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #e0e0e0;
  padding: 10px 20px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #3a3a3a;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("id");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <StyledHeader>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        <BrandName onClick={() => navigate("/")}>
          Kingsburry Hotel Management System
        </BrandName>

        <div style={{ display: "flex", gap: 16 }}>
          <NavMenu>
            <NavLink onClick={() => navigate("/hotels")}>Hotels</NavLink>
          </NavMenu>
          <NavMenu>
            <NavLink onClick={() => navigate("/cart")}>Cart</NavLink>
          </NavMenu>

          {isLoggedIn ? (
            <>
              <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                Profile
              </ProfileButton>
              {isDropdownOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate("/my-bookings")}>
                    My Bookings
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate("/my-orders")}>
                    My Orders
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              )}
            </>
          ) : (
            <LoginButton onClick={() => navigate("/login")}>Login</LoginButton>
          )}
        </div>
      </div>
    </StyledHeader>
  );
};

export default Navbar;
