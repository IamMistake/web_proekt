import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalDialog = ({ show, title, body, onConfirm, onClose, confirmLabel }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onClose}>
        Откажи
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        {confirmLabel || "Потврди"}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalDialog;
