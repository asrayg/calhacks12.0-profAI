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

  // Text from rubberDuck.py
  const duckText = `A rule tree proof, also known as a derivation tree, is a visual format for proving that a statement is true using a system of formal rules. You start by writing your goal statement at the very bottom of the tree (the root). You then work upward by finding an inference rule whose conclusion matches your goal. You write the premises of that rule above your goal, creating new branches. You repeat this process for each new premise, treating it as a new sub-goal. The proof is complete when every branch of the tree ends in an axiom, which is a special rule with no premises, serving as the "leaves" of the tree. This structure provides a clear, step-by-step logical argument showing how the final goal was derived from the system's foundational truths.`;

  const handleDuckClick = () => {
    const newDuckState = !showDuckChat;
    setShowDuckChat(newDuckState);

    if (newDuckState) {
      // Duck mode activated - pause video immediately
      if (videoRef.current) {
        videoRef.current.pause();
      }

      // Stop any ongoing speech
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }

      // Clear any pending speech timeout
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      // Wait 4 seconds before starting speech
      speechTimeoutRef.current = setTimeout(() => {
        // Use Web Speech API to read the text
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(duckText);
          utterance.rate = 0.9; // Slightly slower for clarity
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          utterance.onend = () => {
            console.log('🦆 Duck finished speaking!');
          };

          speechRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } else {
          console.error('Speech synthesis not supported in this browser');
        }
      }, 4000); // 4 second delay
    } else {
      // Duck mode deactivated - resume video and stop speech
      if (videoRef.current) {
        videoRef.current.play();
      }

      // Clear the timeout if speech hasn't started yet
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      // Stop the speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

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
          onClick={handleDuckClick}
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

  "::after": {
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
