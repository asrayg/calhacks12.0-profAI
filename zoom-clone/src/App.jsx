import meetingScreenshot from "./assets/zoom.png";
import ProfAISidePanel from "./ProfAISidePanel";
import duckImage from "./assets/ducks.png";
import React, { useState } from "react";

export default function App() {
  const [showDuckChat, setShowDuckChat] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Zoom-like Background */}
      <img
        src={meetingScreenshot}
        alt="Meeting Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Main video */}
      <video
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: "65px",
          left: "15px",
          width: "1038px",
          height: "585px",
          objectFit: "cover",
          zIndex: 10,
          borderRadius: "12px",
        }}
      />

      {/* ProfAI Panel */}
      <div
        style={{
          position: "absolute",
          top: "400px",
          left: "1260px",
          transform: "translate(-50%, -50%)",
          width: "30%",
          height: "100%",
          zIndex: 20,
        }}
      >
        <ProfAISidePanel />
      </div>

      {/* 🦆 Duck Assistant */}
      <div style={styles.duckContainer}>
        {/* Speech bubble (to the left) */}
        {showDuckChat && (
          <div style={styles.duckBubble}>
            <div style={styles.waveContainer}>
              <div style={styles.wave}></div>
              <div style={{ ...styles.wave, animationDelay: "0.2s" }}></div>
              <div style={{ ...styles.wave, animationDelay: "0.4s" }}></div>
            </div>
            <p style={styles.duckText}>Listening...</p>
          </div>
        )}

        {/* Duck icon (static) */}
        <img
          src={duckImage}
          alt="Duck"
          onClick={() => setShowDuckChat(!showDuckChat)}
          style={{
            width: "120px",
            height: "120px",
            cursor: "pointer",
            borderRadius: "50%",
            padding: "8px",
          }}
        />
      </div>
    </div>
  );
}
const styles = {
  duckContainer: {
    position: "fixed",
    zIndex: 9999,
    bottom: "120px",
    left: "900px",
    display: "flex",
    flexDirection: "column", // 🧠 Stack vertically
    alignItems: "center", // centers bubble horizontally
    gap: "10px",
  },

  duckBubble: {
    background: "linear-gradient(135deg, #fffbe8 0%, #fff7cc 100%)",
    borderRadius: "16px 16px 8px 16px",
    padding: "12px 18px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    border: "1px solid rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    position: "absolute",
    right: "110px",
    bottom: "90px", 
    animation: "popIn 0.25s ease-out",
  },

  waveContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: "4px",
    height: "16px",
  },

  wave: {
    width: "5px",
    height: "5px",
    backgroundColor: "#ffca28",
    borderRadius: "50%",
    animation: "bounce 1s infinite ease-in-out",
  },

  duckText: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: "13px",
    color: "#444",
  },

  '::after': {
  content: '""',
  position: "absolute",
  bottom: "-6px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "0",
  height: "0",
  borderLeft: "6px solid transparent",
  borderRight: "6px solid transparent",
  borderTop: "6px solid #fff6cc",
},

};
