import React, { useState } from "react";
import driveLogo from "./assets/drive.png";
import canvasLogo from "./assets/canvas.png";
import youtubeLogo from "./assets/youtube.png";

export default function ProfAISidePanel() {
  const [enabled, setEnabled] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiNotes, setAiNotes] = useState([
    "AI notes will appear here once transcription starts.",
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleSaveToDrive = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.panel}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h1 style={styles.logo}>
            <span style={{ fontWeight: 700 }}>prof</span>
            <span style={{ fontWeight: 900 }}>AI</span>
          </h1>

          <div
            style={{
              ...styles.toggleOuter,
              backgroundColor: enabled ? "#4ADE80" : "#f1f1f1",
              borderColor: enabled ? "#4ADE80" : "#ccc",
              boxShadow: enabled
                ? "0 0 6px rgba(74, 222, 128, 0.6)"
                : "0 0 4px rgba(0,0,0,0.1)",
            }}
            onClick={() => setEnabled(!enabled)}
          >
            <div
              style={{
                ...styles.toggleInner,
                left: enabled ? "27px" : "3px",
                backgroundColor: enabled ? "#fff" : "#999",
              }}
            />
          </div>
        </div>
        <span style={styles.toggleText}>
          {enabled
            ? "AI is transcribing & taking notes..."
            : "Live transcription off"}
        </span>
      </div>

      {/* LIVE TRANSCRIPT */}
      <div style={styles.card}>
        <h3 style={styles.cardHeader}>Live Transcript</h3>
        <div style={styles.transcriptBox}>
          <p style={styles.placeholderText}>
            {enabled
              ? transcript || "Listening... voice input is being processed."
              : "Toggle on to start live transcription."}
          </p>
        </div>
      </div>

      {/* AI NOTES */}
      <div style={styles.card}>
        <div style={styles.cardHeaderRow}>
          <h3 style={styles.cardHeader1}>AI Notes</h3>

          {/* Download to Drive button */}
          <button style={styles.driveButton} onClick={handleSaveToDrive}>
            <img
              src={driveLogo}
              alt="Drive"
              style={{ width: "18px", height: "18px", marginRight: "6px" }}
            />
            Save to Drive
          </button>
        </div>

        <div style={styles.transcriptBox}>
          {enabled ? (
            aiNotes.map((note, idx) => (
              <p key={idx} style={styles.noteLine}>
                • {note}
              </p>
            ))
          ) : (
            <p style={styles.placeholderText}>
              Turn on transcription to generate notes.
            </p>
          )}
        </div>
      </div>

      {/* --- Confirmation Modal --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeader}>Save to Google Drive</h3>
            <p style={styles.modalText}>
              The following items will be saved to your Drive folder:
            </p>
            <ul style={styles.modalList}>
              <li>Transcript</li>
              <li>AI Meeting Notes</li>
              <li>YouTube Resource Links</li>
              <li>Canvas Material Links</li>
            </ul>
            <div style={styles.modalButtons}>
              <button
                onClick={() => {
                  handleCloseModal();
                }}
                style={styles.confirmButton}
              >
                Confirm Save
              </button>
              <button onClick={handleCloseModal} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Inline Styles ---------- */
const styles = {
  panel: {
    position: "absolute",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.95) 100%, rgba(250,250,250,0.85) 100%)",
    borderRadius: "24px",
    padding: "26px 20px",
    display: "flex",
    flexDirection: "column",
    width: "350px",
    height: "90%",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    fontFamily: "Inter, sans-serif",
    color: "#111",
    backdropFilter: "blur(8px)",
  },
  header: {
    marginBottom: "22px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "30px",
    margin: 0,
  },
  toggleOuter: {
    width: "56px",
    height: "30px",
    borderRadius: "30px",
    border: "2px solid #ccc",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  toggleInner: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    position: "absolute",
    top: "2px",
    transition: "all 0.3s ease",
  },
  toggleText: {
    fontSize: "13px",
    color: "#444",
    fontWeight: 500,
    marginTop: "6px",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fefefe",
    borderRadius: "16px",
    padding: "18px",
    height: "300px",
    border: "1px solid rgba(0,0,0,0.05)",
    marginBottom: "22px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
  },
  cardHeader: {
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "10px",
    color: "#111",
    marginTop: "-5px",
  },
  cardHeader1: {
    fontSize: "15px",
    marginTop: "4px",
    fontWeight: 700,
    marginBottom: "10px",
    color: "#111",
  },
  cardHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  driveButton: {
    display: "flex",
    marginTop: "-10px",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e2e2e2",
    borderRadius: "8px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#333",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  transcriptBox: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "12px 14px",
    height: "200px",
    overflowY: "auto",
    border: "1px solid #e5e5e5",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
  },
  placeholderText: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  noteLine: {
    fontSize: "13px",
    color: "#333",
    margin: "5px 0",
  },

  /* --- Modal Styles --- */
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "26px 24px",
    width: "310px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    textAlign: "left",
  },
  modalHeader: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  modalText: {
    fontSize: "13px",
    color: "#555",
  },
  modalList: {
    marginTop: "10px",
    marginBottom: "18px",
    paddingLeft: "18px",
    fontSize: "13px",
    color: "#333",
    lineHeight: "1.6",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "#4ADE80",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cancelButton: {
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    color: "#333",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
