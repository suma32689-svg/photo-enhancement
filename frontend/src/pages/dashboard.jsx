import { useState } from "react";
import "./dashboard.css";

function Dashboard() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sliderPosition, setSliderPosition] = useState(50);

  const [selectedEnhancement, setSelectedEnhancement] =
    useState("AI Enhance");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage("❌ Image must be smaller than 10MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setEnhancedImage(null);
    setMessage("");
  };

  const enhancePhoto = async () => {
    if (!image) {
      setMessage("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setEnhancedImage(null);

      const formData = new FormData();

      formData.append("image", image);

      formData.append(
        "enhancementType",
        selectedEnhancement
      );

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/image/enhance",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Enhancement failed"
        );
      }

      setEnhancedImage(data.enhancedImage);

      setMessage(
        `✨ ${selectedEnhancement} completed successfully!`
      );
    } catch (error) {
      console.error(
        "Enhancement error:",
        error
      );

      setMessage(
        error.message ||
          "Image enhancement failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    window.location.href = "/dashboard";
  };

  const goHistory = () => {
    window.location.href = "/history";
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <nav className="top-navbar">

        <div className="logo">
          ✨ <span>PhotoEnhance</span>
          <small>AI</small>
        </div>

        <div className="nav-links">

          <span
            onClick={goHome}
            style={{ cursor: "pointer" }}
          >
            Home
          </span>

          <span
            onClick={goHome}
            style={{ cursor: "pointer" }}
          >
            Enhance
          </span>

          <span
            onClick={goHistory}
            style={{ cursor: "pointer" }}
          >
            History
          </span>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-badge">
          ✨ AI POWERED PHOTO ENHANCEMENT
        </div>

        <h1>
          Turn Your Photos Into
          <span> Stunning Images</span>
        </h1>

        <p>
          Restore, sharpen and enhance your photos
          using intelligent image processing
          technology.
        </p>

      </section>

      {/* ================= WORKSPACE ================= */}

      <section className="workspace">

        {/* ================= UPLOAD ================= */}

        <div className="upload-card">

          <div className="upload-icon">
            📸
          </div>

          <h2>
            Upload Your Photo
          </h2>

          <p>
            Select a photo from your device
            and choose an enhancement mode.
          </p>

          <label className="upload-button">

            📁 Choose Photo

            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
              hidden
            />

          </label>

          <small>
            JPG, JPEG or PNG • Maximum 10MB
          </small>

        </div>

        {/* ================= PREVIEW ================= */}

        {preview && (

          <div className="preview-card">

            <div className="section-title">

              <h2>
                Image Preview
              </h2>

              <span>
                {image?.name}
              </span>

            </div>

            <div className="image-container">

              <img
                src={preview}
                alt="Selected"
              />

            </div>

            {/* ================= ENHANCEMENT OPTIONS ================= */}

            <div className="enhancement-options">

              {/* AI ENHANCE */}

              <div
                className={`option ${
                  selectedEnhancement ===
                  "AI Enhance"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedEnhancement(
                    "AI Enhance"
                  )
                }
              >

                ✨

                <span>
                  <b>
                    AI Enhance
                  </b>

                  <small>
                    Improve overall quality
                  </small>
                </span>

              </div>

              {/* UPSCALE */}

              <div
                className={`option ${
                  selectedEnhancement ===
                  "Upscale"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedEnhancement(
                    "Upscale"
                  )
                }
              >

                🔍

                <span>
                  <b>
                    Upscale
                  </b>

                  <small>
                    Increase resolution
                  </small>
                </span>

              </div>

              {/* SHARPEN */}

              <div
                className={`option ${
                  selectedEnhancement ===
                  "Sharpen"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedEnhancement(
                    "Sharpen"
                  )
                }
              >

                💎

                <span>
                  <b>
                    Sharpen
                  </b>

                  <small>
                    Make details clearer
                  </small>
                </span>

              </div>

              {/* COLOR ENHANCE */}

              <div
                className={`option ${
                  selectedEnhancement ===
                  "Color Enhance"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedEnhancement(
                    "Color Enhance"
                  )
                }
              >

                🎨

                <span>
                  <b>
                    Color Enhance
                  </b>

                  <small>
                    Improve colors
                  </small>
                </span>

              </div>

            </div>

            {/* SELECTED MODE */}

            <div className="selected-mode">

              Selected:
              <strong>
                {" "}
                {selectedEnhancement}
              </strong>

            </div>

            {/* ================= ENHANCE BUTTON ================= */}

            <button
              className="enhance-button"
              onClick={enhancePhoto}
              disabled={loading}
            >

              {loading
                ? "⏳ Enhancing..."
                : `✨ Enhance with ${selectedEnhancement}`}

            </button>

            {/* MESSAGE */}

            {message && (

              <div className="message">
                {message}
              </div>

            )}

          </div>

        )}

  {/* ================= BEFORE / AFTER ================= */}

{enhancedImage && (
  <div className="result-card">

    <div className="section-title">
      <h2>Before & After</h2>

      <span className="success">
        ✓ Enhanced
      </span>
    </div>

    {/* BEFORE / AFTER SLIDER */}
    <div
      className="comparison-slider"
      style={{
        "--position": `${sliderPosition}%`,
      }}
    >
      {/* AFTER IMAGE */}
      <img
        src={enhancedImage}
        alt="After enhancement"
        className="comparison-image after-image"
      />

      {/* BEFORE IMAGE */}
      <img
        src={preview}
        alt="Before enhancement"
        className="comparison-image before-image"
      />

      {/* LABELS */}
      <span className="comparison-label before-label">
        BEFORE
      </span>

      <span className="comparison-label after-label">
        AFTER
      </span>

      {/* SLIDER LINE */}
      <div className="slider-line"></div>

      {/* SLIDER HANDLE */}
      <div className="slider-handle">
        ↔
      </div>

      {/* SLIDER CONTROL */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) =>
          setSliderPosition(Number(e.target.value))
        }
        className="slider-input"
        aria-label="Before and after comparison"
      />
    </div>

    {/* DOWNLOAD */}
    <a
      href={enhancedImage}
      download="enhanced-photo.jpg"
      className="download-button"
    >
      ⬇️ Download Enhanced Photo
    </a>

  </div>
)}

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="feature">

          <div>
            ⚡
          </div>

          <h3>
            Fast Enhancement
          </h3>

          <p>
            Enhance your images quickly
            using our image processing engine.
          </p>

        </div>

        <div className="feature">

          <div>
            🔍
          </div>

          <h3>
            High Resolution
          </h3>

          <p>
            Increase image resolution
            and improve clarity.
          </p>

        </div>

        <div className="feature">

          <div>
            🎨
          </div>

          <h3>
            Better Colors
          </h3>

          <p>
            Improve brightness,
            saturation and overall colors.
          </p>

        </div>

        <div className="feature">

          <div>
            🔒
          </div>

          <h3>
            Secure
          </h3>

          <p>
            Your enhancement history
            is connected to your account.
          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>
        © 2026 PhotoEnhance AI •
        AI Powered Image Enhancement
      </footer>

    </div>
  );
}

export default Dashboard;