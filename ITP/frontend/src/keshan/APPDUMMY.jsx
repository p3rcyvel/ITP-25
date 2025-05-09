import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserWorkingHours from "./pages/UserWorkingHours";
import UserOrders from "./pages/UserOrders";
import ShiftSchedulePage from "./pages/ShiftSchedulePage";

// This component serves as a layout wrapper for the APPDUMMY section
const DummyLayout = () => {
  return <Outlet />;
};

const APPDUMMY = () => {
  return (
    <Routes>
      <Route element={<DummyLayout />}>
        {/* Main Routes */}
        <Route index element={<HomePage />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Working Hours Routes */}
        <Route path="working-hours" element={<UserWorkingHours />} />
        <Route path="clock-in" element={<div>Clock In Page</div>} />
        <Route path="clock-out" element={<div>Clock Out Page</div>} />
        <Route path="view-hours" element={<div>View Hours Page</div>} />

        {/* Order Management Routes */}
        <Route path="orders" element={<div>Order Management Page</div>} />
        <Route path="my-orders" element={<UserOrders />} />
        <Route path="orders/:id" element={<div>Order Details Page</div>} />

        {/* Shift Management Routes */}
        <Route path="shifts" element={<ShiftSchedulePage />} />
        <Route path="my-shifts" element={<div>My Shifts Page</div>} />
        <Route
          path="request-shift-change"
          element={<div>Request Shift Change Page</div>}
        />

        {/* Overtime Routes */}
        <Route path="overtime" element={<div>Overtime Tracking Page</div>} />
        <Route
          path="request-overtime"
          element={<div>Request Overtime Page</div>}
        />
        <Route
          path="overtime-history"
          element={<div>Overtime History Page</div>}
        />

        {/* Profile Routes */}
        <Route path="profile" element={<div>Profile Page</div>} />
        <Route path="edit-profile" element={<div>Edit Profile Page</div>} />

        {/* Fallback Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default APPDUMMY;
