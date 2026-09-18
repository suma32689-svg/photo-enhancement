const History = require("../models/History");
const fs = require("fs");
const path = require("path");

// =========================
// GET HISTORY
// =========================

exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("History error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load history",
    });
  }
};

// =========================
// DELETE HISTORY
// =========================

exports.deleteHistory = async (req, res) => {
  try {
    // Find history belonging to logged-in user
    const history = await History.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History item not found",
      });
    }

    // =========================
    // DELETE ORIGINAL IMAGE
    // =========================

    try {
      const originalFileName =
        history.originalImage.split("/").pop();

      const originalPath = path.join(
        "uploads",
        originalFileName
      );

      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
        console.log(
          "Original image deleted:",
          originalPath
        );
      }
    } catch (error) {
      console.error(
        "Original image delete error:",
        error.message
      );
    }

    // =========================
    // DELETE ENHANCED IMAGE
    // =========================

    try {
      const enhancedFileName =
        history.enhancedImage.split("/").pop();

      const enhancedPath = path.join(
        "enhanced",
        enhancedFileName
      );

      if (fs.existsSync(enhancedPath)) {
        fs.unlinkSync(enhancedPath);
        console.log(
          "Enhanced image deleted:",
          enhancedPath
        );
      }
    } catch (error) {
      console.error(
        "Enhanced image delete error:",
        error.message
      );
    }

    // =========================
    // DELETE DATABASE RECORD
    // =========================

    await History.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message:
        "History and images deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete history error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete history",
    });
  }
};