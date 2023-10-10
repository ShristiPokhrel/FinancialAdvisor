import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const Prediction = ({ show, onClose, predictionAmount }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Expense Prediction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Predicted Average Expense Amount for Next Month:</p>
        <h3>{predictionAmount} Rs.</h3>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Prediction;
 // Import Prediction component
import Prediction from "./Prediction"; // Adjust the path as needed

// Inside HomePage component
const [showPredictionModal, setShowPredictionModal] = useState(false);
const [predictedAmount, setPredictedAmount] = useState(0); // Initialize with 0

// Function to handle prediction button click
const handlePredictClick = () => {
  // Calculate the prediction here (you'll need to implement this)
  const prediction = calculatePrediction(); // Implement this function
  setPredictedAmount(prediction);
  setShowPredictionModal(true);
};

// ...

// Inside your render function
<div>
  {/* Other components and content */}
  <button
    className="btn btn-primary"
    onClick={handlePredictClick}
  >
    Predict Expenses
  </button>
</div>

{/* Render the Prediction component */}
<Prediction
  show={showPredictionModal}
  onClose={() => setShowPredictionModal(false)}
  predictionAmount={predictedAmount}
/>
