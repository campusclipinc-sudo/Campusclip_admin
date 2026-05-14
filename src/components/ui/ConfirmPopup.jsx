import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const ConfirmPopup = ({
  open,
  title = "Confirm",
  children,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  confirmVariant = "primary",
  loading = false,
}) => {
  return (
    <Modal show={open} onHide={onCancel} centered>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size="sm" className="me-2" />} {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmPopup;
