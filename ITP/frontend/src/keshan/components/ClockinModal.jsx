import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { workingHoursApi } from "../api/workingHourApi";

const ClockInModal = ({ visible, onCancel, onSuccess, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log(userId);
      const values = await form.validateFields();
      const record = await workingHoursApi.create({
        user: userId,
        clockIn: new Date(),
        ...values,
        date: new Date(),
      });
      onSuccess(record);
    } catch (error) {
      message.error(error.message || "Failed to clock in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Clock In"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="notes" label="Notes (Optional)">
          <Input.TextArea placeholder="Enter any notes about your shift" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClockInModal;
