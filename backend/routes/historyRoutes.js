const express = require("express");

const {
  getHistory,
  deleteHistory,
} = require("../controllers/historyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's enhancement history
router.get(
  "/",
  authMiddleware,
  getHistory
);

// Delete a history item
router.delete(
  "/:id",
  authMiddleware,
  deleteHistory
);

module.exports = router;