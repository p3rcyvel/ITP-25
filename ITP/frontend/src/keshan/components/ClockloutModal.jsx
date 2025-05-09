import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { workingHoursApi } from "../api/workingHourApi";

const ClockOutModal = ({ visible, onCancel, onSuccess, recordId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const updatedRecord = await workingHoursApi.update(recordId, {
        clockOut: new Date(),
        ...values,
      });
      onSuccess(updatedRecord);
    } catch (error) {
      message.error(error.message || "Failed to clock out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Clock Out"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="notes" label="Notes (Optional)">
          <Input.TextArea placeholder="Enter any notes about your shift completion" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClockOutModal;
