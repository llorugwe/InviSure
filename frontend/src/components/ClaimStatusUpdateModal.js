// src/components/ClaimStatusUpdateModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ClaimStatusUpdateModal = ({ show, onClose, claimId, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState('');

  const handleStatusChange = (status) => {
    setNewStatus(status);
  };

  const handleSubmit = () => {
    if (newStatus) {
      onUpdateStatus(claimId, newStatus);
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Claim Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Choose a new status for the claim:</p>
        <div className="d-flex justify-content-around">
          <Button
            variant="success"
            onClick={() => handleStatusChange('Approved')}
            active={newStatus === 'Approved'}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() => handleStatusChange('Rejected')}
            active={newStatus === 'Rejected'}
          >
            Reject
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!newStatus}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClaimStatusUpdateModal;
