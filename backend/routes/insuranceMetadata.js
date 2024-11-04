// backend/routes/insuranceMetadata.js

const express = require('express');
const router = express.Router();
const insuranceMetadata = require('../config/insuranceMetadata');

// GET /api/insurance-metadata/:type - Retrieve metadata for a specific insurance type
router.get('/:type', (req, res) => {
  const { type } = req.params;
  const metadata = insuranceMetadata[type];

  if (!metadata) {
    return res.status(404).json({ message: 'Insurance type not found' });
  }

  res.status(200).json(metadata);
});

module.exports = router;
