import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const BudgetSetting = ({ showModal, handleClose, handleBudgetLimitSubmit }) => {
  const [budgetLimit, setBudgetLimit] = useState(0);

  const handleSubmit = () => {
    handleBudgetLimitSubmit(budgetLimit);
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Set Budget Limit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="budgetLimit">
          <Form.Label>Enter Budget Limit</Form.Label>
          <Form.Control
            type="number"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BudgetSetting;
