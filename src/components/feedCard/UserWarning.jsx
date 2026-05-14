import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const UserWarning = ({ show, onHide, onConfirm, loading }) => {
  const [warningType, setWarningType] = useState("moderate");
  const [warningReason, setWarningReason] = useState("");

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      setWarningType("moderate");
      setWarningReason("");
    }
  }, [show]);

  const handleConfirm = () => {
    if (!warningReason.trim()) {
      alert("Please enter a reason for the warning");
      return;
    }
    onConfirm({
      warning_type: warningType,
      reason: warningReason.trim(),
    });
  };

  const handleClose = () => {
    setWarningType("moderate");
    setWarningReason("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Warn User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">A warning will be recorded in the user's account.</p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Warning Type <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={warningType}
              onChange={(e) => setWarningType(e.target.value)}
              required
            >
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Select the severity level of the warning
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reason <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={warningReason}
              onChange={(e) => setWarningReason(e.target.value)}
              placeholder="Enter the reason for warning this user..."
              required
            />
            <Form.Text className="text-muted">
              Please provide a clear reason for the warning
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="warning"
          onClick={handleConfirm}
          disabled={loading || !warningReason.trim()}
        >
          {loading && <Spinner size="sm" className="me-2" />}
          Warn User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserWarning;

