import "antd/dist/reset.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import StaffDashboard from "./pages/StaffDashboard";
import ProfilePage from "./pages/ProfilePage";
import HotelsPage from "./pages/HotelsPage";
import BookingCreatePage from "./pages/BookingCreatePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import APPDUMMY from "./keshan/APPDUMMY";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/book" element={<BookingCreatePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/keshan/*" element={<APPDUMMY />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
