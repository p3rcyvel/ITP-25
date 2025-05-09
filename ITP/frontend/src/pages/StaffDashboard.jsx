import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  List,
  Typography,
  Spin,
  Tabs,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  createWorkingHours,
  updateWorkingHours,
  getUserWorkingHours,
  getUserRecordForDate,
} from "../api/workingHoursApi";
import { getUser } from "../api/userApi";
import StaffProfile from "../components/staff/StaffProfile";
import StaffOrderAssigmentModal from "../components/staff/StaffOrderAssigmentModal";
import ShiftsModal from "../components/staff/ShiftsModal";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EmployeeTimeTracking = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [checkedIn, setCheckedIn] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [workingHistory, setWorkingHistory] = useState([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [profileModalOpened, setProfileModalOpened] = useState(false);
  const [orderAssignmentModalOpened, setOrderAssignmentModalOpened] =
    useState(false);

  const userId = localStorage.getItem("id");

  // Check if user is already checked in today
  useEffect(() => {
    try {
      getUser(userId)
        .then((response) => {
          if (response) {
            setUser(response);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          messageApi.error("Failed to load user data");
        });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    const checkUserStatus = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // Check local storage first for today's status
        const today = new Date().toISOString().split("T")[0];
        const storedStatus = localStorage.getItem(
          `timeTracking_${userId}_${today}`
        );

        if (storedStatus) {
          const parsedStatus = JSON.parse(storedStatus);
          console.log(parsedStatus);
          setCheckedIn(parsedStatus.checkedIn);
          setCurrentRecord(parsedStatus.record);
        } else {
          // If not in localStorage, check with API
          const todayDate = new Date().toISOString().split("T")[0];
          const response = await getUserRecordForDate(userId, todayDate);

          if (response) {
            setCheckedIn(true);
            setCurrentRecord(response);

            // Store in localStorage
            localStorage.setItem(
              `timeTracking_${userId}_${today}`,
              JSON.stringify({
                checkedIn: true,
                record: response,
              })
            );
          }
        }

        // Fetch history
        fetchWorkingHistory();
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [userId]);

  const fetchWorkingHistory = async () => {
    if (!userId) return;

    try {
      const response = await getUserWorkingHours(userId);
      if (response) {
        setWorkingHistory(response);
      }
    } catch (error) {
      console.error("Error fetching working history:", error);
      messageApi.error("Failed to load working hours history");
    }
  };

  const handleCheckIn = async () => {
    if (!userId) {
      messageApi.error("User not logged in");
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const workingHoursData = {
        user: userId,
        date: today,
        clockIn: now,
      };

      const response = await createWorkingHours(workingHoursData);

      if (response) {
        setCheckedIn(true);
        setCurrentRecord(response);

        // Store in localStorage
        localStorage.setItem(
          `timeTracking_${userId}_${today}`,
          JSON.stringify({
            checkedIn: true,
            record: response,
          })
        );

        messageApi.success("Successfully checked in!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      messageApi.error("Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!userId || !currentRecord) {
      messageApi.error("No active check-in found");
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const updateData = {
        clockOut: now,
      };

      const response = await updateWorkingHours(currentRecord._id, updateData);

      if (response) {
        setCheckedIn(false);
        setCurrentRecord(null);

        // Update localStorage
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem(
          `timeTracking_${userId}_${today}`,
          JSON.stringify({
            checkedIn: false,
            record: null,
          })
        );

        // Refresh history
        fetchWorkingHistory();

        messageApi.success("Successfully checked out!");
      }
    } catch (error) {
      console.error("Error during check-out:", error);
      messageApi.error("Failed to check out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    console.log("Formatting date:", dateString);
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return "In progress";

    const diffMs = new Date(clockOut) - new Date(clockIn);
    const hours = diffMs / (1000 * 60 * 60);
    return `${hours.toFixed(2)} hours`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {contextHolder}
      <Card style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={2}>Employee Time Tracking. Welcome {user?.name}</Title>

        {loading ? (
          <Spin size="large" />
        ) : (
          <div style={{ marginTop: "30px", marginBottom: "30px" }}>
            {checkedIn ? (
              <>
                <Text
                  type="success"
                  style={{
                    display: "block",
                    fontSize: "18px",
                    marginBottom: "15px",
                  }}
                >
                  You're currently checked in since{" "}
                  {formatDate(currentRecord?.clockIn)}
                </Text>
                <Button
                  type="primary"
                  danger
                  size="large"
                  icon={<ClockCircleOutlined />}
                  onClick={handleCheckOut}
                  style={{ height: "60px", width: "200px", fontSize: "18px" }}
                >
                  Check Out
                </Button>
              </>
            ) : (
              <>
                <Text
                  style={{
                    display: "block",
                    fontSize: "18px",
                    marginBottom: "15px",
                  }}
                >
                  You're not checked in today
                </Text>
                <Button
                  type="primary"
                  size="large"
                  icon={<ClockCircleOutlined />}
                  onClick={handleCheckIn}
                  style={{ height: "60px", width: "200px", fontSize: "18px" }}
                >
                  Check In
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button
          type="default"
          size="large"
          icon={<CalendarOutlined />}
          onClick={() => setHistoryVisible(true)}
          style={{
            height: "120px",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: "10px", fontSize: "16px" }}>Shifts</div>
        </Button>

        <Button
          type="default"
          size="large"
          icon={<FileTextOutlined />}
          onClick={() => setOrderAssignmentModalOpened(true)}
          style={{
            height: "120px",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: "10px", fontSize: "16px" }}>
            Order Assignments
          </div>
        </Button>

        <Button
          type="default"
          size="large"
          icon={<UserOutlined />}
          onClick={() => setProfileModalOpened(true)}
          style={{
            height: "120px",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: "10px", fontSize: "16px" }}>Profile</div>
        </Button>
      </div>
      <ShiftsModal
        historyVisible={historyVisible}
        onClose={() => {
          setHistoryVisible(false);
        }}
      />
      <StaffProfile
        open={profileModalOpened}
        onClose={() => {
          setProfileModalOpened(false);
        }}
      />
      <StaffOrderAssigmentModal
        open={orderAssignmentModalOpened}
        onClose={() => setOrderAssignmentModalOpened(false)}
      />{" "}
      <List
        loading={loading}
        dataSource={workingHistory}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`Date: ${new Date(item.date).toLocaleDateString()}`}
              description={
                <>
                  <p>Checked in: {formatDate(item.clockIn)}</p>
                  <p>
                    Checked out:{" "}
                    {item.clockOut
                      ? formatDate(item.clockOut)
                      : "Not checked out yet"}
                  </p>
                  <p>
                    Total hours:{" "}
                    {item.totalHours
                      ? `${item.totalHours.toFixed(2)} hours`
                      : calculateHours(item.clockIn, item.clockOut)}
                  </p>
                </>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: "No working hours records found" }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default EmployeeTimeTracking;
