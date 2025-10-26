import meetingScreenshot from "./assets/zoom.png";
import ProfAISidePanel from "./ProfAISidePanel";
import duckImage from "./assets/ducks.png";
import React, { useState, useRef } from "react";
import coolVideo from "./assets/Untitled design (1).mp4";

export default function App() {
  const [showDuckChat, setShowDuckChat] = useState(false);
  const videoRef = useRef(null);
  const speechRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  const duckText = `A rule tree proof, also known as a derivation tree, is a visual format for proving that a statement is true`;

  const handleDuckClick = () => {
    const newDuckState = !showDuckChat;
    setShowDuckChat(newDuckState);

    if (newDuckState) {
      // 🔇 Pause and mute video
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
      }

      if (speechRef.current) window.speechSynthesis.cancel();
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

      // Start duck speaking after 4 sec
      speechTimeoutRef.current = setTimeout(() => {
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(duckText);
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.onend = () => console.log("🦆 Duck finished speaking!");
          speechRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }
      }, 4000);
    } else {
      // 🔊 Resume and unmute video
      if (videoRef.current) {
        videoRef.current.play();
        videoRef.current.muted = false;
      }

      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
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

      {/* 🌫️ Blur overlay when Duck is active */}
      {showDuckChat && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 15,
            transition: "backdrop-filter 0.3s ease, background 0.3s ease",
          }}
        />
      )}

      {/* Main video */}
      <video
        ref={videoRef}
        src={coolVideo}
        autoPlay
        loop
        muted={false}
        playsInline
        controls
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

        <img
          src={duckImage}
          alt="Duck"
          onClick={handleDuckClick}
          style={{
            width: "120px",
            height: "120px",
            cursor: "pointer",
            borderRadius: "50%",
            padding: "8px",
            zIndex: 9999,
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
    flexDirection: "column",
    alignItems: "center",
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
};
