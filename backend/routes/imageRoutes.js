const express = require("express");

const {
  uploadMiddleware,
  enhanceImage,
} = require("../controllers/imageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/enhance",
  authMiddleware,
  uploadMiddleware,
  enhanceImage
);

module.exports = router;