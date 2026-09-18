const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const History = require("../models/History");

// ==========================================
// UPLOAD CONFIGURATION
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

exports.uploadMiddleware = upload.single("image");

// ==========================================
// RUN PYTHON AI
// ==========================================

function runPythonAI(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const aiFolder = path.join(
      __dirname,
      "../../ai"
    );

    const pythonScript = path.join(
      aiFolder,
      "enhance_image.py"
    );

    // Windows Python inside our AI virtual environment
    const pythonExecutable = path.join(
      aiFolder,
      "venv",
      "Scripts",
      "python.exe"
    );

    if (!fs.existsSync(pythonExecutable)) {
      return reject(
        new Error(
          "Python virtual environment was not found."
        )
      );
    }

    if (!fs.existsSync(pythonScript)) {
      return reject(
        new Error(
          "enhance_image.py was not found inside the ai folder."
        )
      );
    }

    console.log("=================================");
    console.log("Starting Python AI...");
    console.log("Input:", inputPath);
    console.log("Output:", outputPath);
    console.log("=================================");

    const pythonProcess = spawn(
      pythonExecutable,
      [
        pythonScript,
        inputPath,
        outputPath,
      ],
      {
        cwd: aiFolder,
      }
    );

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on(
      "data",
      (data) => {
        const text = data.toString();

        pythonOutput += text;

        console.log(
          "[Python]:",
          text.trim()
        );
      }
    );

    pythonProcess.stderr.on(
      "data",
      (data) => {
        const text = data.toString();

        pythonError += text;

        console.error(
          "[Python Error]:",
          text.trim()
        );
      }
    );

    pythonProcess.on(
      "close",
      (code) => {
        if (code !== 0) {
          return reject(
            new Error(
              `Python AI failed with code ${code}. ${pythonError}`
            )
          );
        }

        if (!fs.existsSync(outputPath)) {
          return reject(
            new Error(
              "Python finished, but the enhanced image was not created."
            )
          );
        }

        console.log(
          "Python AI completed successfully."
        );

        resolve({
          output: pythonOutput,
          error: pythonError,
        });
      }
    );

    pythonProcess.on(
      "error",
      (error) => {
        reject(error);
      }
    );
  });
}

// ==========================================
// ENHANCE IMAGE
// ==========================================

exports.enhanceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    const enhancementType =
      req.body.enhancementType ||
      "AI Enhance";

    const inputPath = path.resolve(
      req.file.path
    );

    // ======================================
    // CREATE ENHANCED FOLDER
    // ======================================

    if (!fs.existsSync("enhanced")) {
      fs.mkdirSync("enhanced", {
        recursive: true,
      });
    }

    const outputName =
      "enhanced-" +
      Date.now() +
      ".jpg";

    const outputPath = path.resolve(
      "enhanced",
      outputName
    );

    // ======================================
    // AI ENHANCE
    // ======================================

    if (
      enhancementType ===
      "AI Enhance"
    ) {
      console.log(
        "AI Enhance selected."
      );

      // Run Python:
      // OpenCV crack removal
      // +
      // GFPGAN face restoration
      await runPythonAI(
        inputPath,
        outputPath
      );
    }

    // ======================================
    // UPSCALE
    // ======================================

    else if (
      enhancementType ===
      "Upscale"
    ) {
      await sharp(inputPath)
        .resize({
          width: 2000,
          height: 2000,
          fit: "inside",
          withoutEnlargement: false,
          kernel:
            sharp.kernel.lanczos3,
        })
        .sharpen({
          sigma: 2,
        })
        .modulate({
          brightness: 1.05,
          saturation: 1.12,
        })
        .jpeg({
          quality: 90,
          mozjpeg: true,
        })
        .toFile(outputPath);
    }

    // ======================================
    // SHARPEN
    // ======================================

    else if (
      enhancementType ===
      "Sharpen"
    ) {
      await sharp(inputPath)
        .resize({
          width: 1600,
          withoutEnlargement: true,
        })
        .sharpen({
          sigma: 2,
          m1: 1.5,
          m2: 2,
        })
        .normalize()
        .jpeg({
          quality: 90,
          mozjpeg: true,
        })
        .toFile(outputPath);
    }

    // ======================================
    // COLOR ENHANCE
    // ======================================

    else if (
      enhancementType ===
      "Color Enhance"
    ) {
      await sharp(inputPath)
        .resize({
          width: 1600,
          withoutEnlargement: true,
        })
        .normalize()
        .modulate({
          brightness: 1.08,
          saturation: 1.25,
          hue: 2,
        })
        .sharpen({
          sigma: 1.5,
        })
        .jpeg({
          quality: 90,
          mozjpeg: true,
        })
        .toFile(outputPath);
    }

    // ======================================
    // IMAGE URLS
    // ======================================

    const originalImage =
      `http://localhost:5000/uploads/${req.file.filename}`;

    const enhancedImage =
      `http://localhost:5000/enhanced/${outputName}`;

    // ======================================
    // SAVE HISTORY
    // ======================================

    const history =
      await History.create({
        user: req.user.id,
        originalImage,
        enhancedImage,
        enhancementType,
      });

    // ======================================
    // RESPONSE
    // ======================================

    res.json({
      message:
        `${enhancementType} completed successfully`,

      enhancementType,

      originalImage,

      enhancedImage,

      historyId: history._id,
    });

  } catch (error) {
    console.error(
      "Image enhancement error:",
      error
    );

    res.status(500).json({
      message:
        "Image enhancement failed",

      error: error.message,
    });
  }
};