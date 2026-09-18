import { useEffect, useState } from "react";
import "./history.css";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchHistory();
  }, []);

  // =========================
  // FETCH HISTORY
  // =========================
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load history"
        );
      }

      setHistory(data.history || []);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE HISTORY
  // =========================
  const deleteHistory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enhanced photo?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/history/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete history"
        );
      }

      setHistory((previousHistory) =>
        previousHistory.filter(
          (item) => item._id !== id
        )
      );

      setMessage("🗑️ Photo deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // =========================
  // FILTER HISTORY
  // =========================
  const filteredHistory =
    filter === "All"
      ? history
      : history.filter(
          (item) =>
            (item.enhancementType || "AI Enhance") ===
            filter
        );

  return (
    <div className="history-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="history-navbar">

        <div className="history-logo">
          ✨ PhotoEnhance <span>AI</span>
        </div>

        <div className="history-nav-links">

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Home
          </button>

          <button className="active">
            History
          </button>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          HEADER
      ========================= */}

      <section className="history-header">

        <div className="history-badge">
          🕘 YOUR ENHANCEMENT HISTORY
        </div>

        <h1>Your Photo History</h1>

        <p>
          View and download your previously enhanced photos.
        </p>

      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="history-container">

        {/* LOADING */}

        {loading && (
          <div className="history-message">
            ⏳ Loading your history...
          </div>
        )}

        {/* ERROR / SUCCESS MESSAGE */}

        {!loading && message && (
          <div className="history-message">
            {message}
          </div>
        )}

        {/* EMPTY DATABASE */}

        {!loading && history.length === 0 && (
          <div className="empty-history">

            <div className="empty-icon">
              📸
            </div>

            <h2>
              No Enhanced Photos Yet
            </h2>

            <p>
              Upload your first photo and enhance it
              to see it here.
            </p>

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              ✨ Enhance Your First Photo
            </button>

          </div>
        )}

        {/* =========================
            FILTER BUTTONS
        ========================= */}

        {!loading && history.length > 0 && (
          <div className="history-filters">

            <button
              className={
                filter === "All" ? "active" : ""
              }
              onClick={() => setFilter("All")}
            >
              All
            </button>

            <button
              className={
                filter === "AI Enhance" ? "active" : ""
              }
              onClick={() =>
                setFilter("AI Enhance")
              }
            >
              ✨ AI Enhance
            </button>

            <button
              className={
                filter === "Upscale" ? "active" : ""
              }
              onClick={() =>
                setFilter("Upscale")
              }
            >
              🔍 Upscale
            </button>

            <button
              className={
                filter === "Sharpen" ? "active" : ""
              }
              onClick={() =>
                setFilter("Sharpen")
              }
            >
              💎 Sharpen
            </button>

            <button
              className={
                filter === "Color Enhance"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("Color Enhance")
              }
            >
              🎨 Color Enhance
            </button>

          </div>
        )}

        {/* =========================
            NO RESULTS FOR FILTER
        ========================= */}

        {!loading &&
          history.length > 0 &&
          filteredHistory.length === 0 && (
            <div className="history-message">
              📭 No photos found for{" "}
              <strong>{filter}</strong>.
            </div>
          )}

        {/* =========================
            HISTORY GRID
        ========================= */}

        {!loading &&
          filteredHistory.length > 0 && (
            <div className="history-grid">

              {filteredHistory.map((item) => (

                <div
                  className="history-card"
                  key={item._id}
                >

                  {/* BEFORE / AFTER */}

                  <div className="history-images">

                    <div className="history-image">

                      <span>
                        BEFORE
                      </span>

                      <img
                        src={item.originalImage}
                        alt="Original"
                      />

                    </div>

                    <div className="history-image">

                      <span>
                        AFTER
                      </span>

                      <img
                        src={item.enhancedImage}
                        alt="Enhanced"
                      />

                    </div>

                  </div>

                  {/* CARD FOOTER */}

                  <div className="history-card-footer">

                    <div className="history-info">

                      <strong>

                        {item.enhancementType ===
                          "Upscale" && "🔍 "}

                        {item.enhancementType ===
                          "Sharpen" && "💎 "}

                        {item.enhancementType ===
                          "Color Enhance" && "🎨 "}

                        {item.enhancementType ===
                          "AI Enhance" && "✨ "}

                        {item.enhancementType ||
                          "AI Enhance"}

                      </strong>

                      <small>
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </small>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="history-actions">
<button
  className="download-history-btn"
  onClick={async () => {
    try {
      const response = await fetch(item.enhancedImage);

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "enhanced-photo.jpg";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error:", error);
      setMessage("❌ Failed to download image.");
    }
  }}
>
  ⬇️ Download
</button>
                      {/* SHARE */}

                      <button
                        className="share-history-btn"
                        onClick={async () => {
                          try {
                            if (navigator.share) {
                              await navigator.share({
                                title:
                                  "PhotoEnhance AI",
                                text:
                                  "Check out my enhanced photo!",
                                url:
                                  item.enhancedImage,
                              });
                            } else {
                              await navigator.clipboard.writeText(
                                item.enhancedImage
                              );

                              setMessage(
                                "🔗 Image link copied!"
                              );
                            }
                          } catch (error) {
                            console.log(
                              "Share cancelled"
                            );
                          }
                        }}
                      >
                        📤 Share
                      </button>

                      {/* DELETE */}

                      <button
                        className="delete-history-btn"
                        onClick={() =>
                          deleteHistory(item._id)
                        }
                        disabled={
                          deletingId === item._id
                        }
                      >
                        {deletingId === item._id
                          ? "⏳ Deleting..."
                          : "🗑️ Delete"}
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="history-footer">
        © 2026 PhotoEnhance AI
      </footer>

    </div>
  );
}

export default History;