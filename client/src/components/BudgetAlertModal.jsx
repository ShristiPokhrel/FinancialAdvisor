import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const BudgetAlertModal = ({ open, onClose }) => {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Budget Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <p style={{ color: 'red', fontWeight: 'bold' }}>You have exceeded your budget limit.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BudgetAlertModal;
