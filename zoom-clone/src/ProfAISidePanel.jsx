import React from "react";
// import googleDriveLogo from "./assets/drive.png";
// import canvasLogo from "./assets/canvas.png";

export default function ProfAISidePanel() {
  return (
    <div style={styles.panel}>
      <h1 style={styles.logo}>
        <span style={{ fontWeight: 700 }}>prof</span>
        <span style={{ fontWeight: 900 }}>AI</span>
      </h1>

      <div style={styles.toggleRow}>
        <div style={styles.toggleOuter}>
          <div style={styles.toggleInner}></div>
        </div>
        <span style={styles.toggleLabel}>
          Turn on live translation and note taking
        </span>
      </div>

      {/* Top box */}
      <div style={styles.box}></div>

      {/* Notes & Resources header */}
      <div style={styles.notesHeader}>
        <span style={styles.headerText}>Notes & Resources</span>
        {/* <img
          src={googleDriveLogo}
          alt="Drive"
          style={{ width: "28px", height: "28px" }}
        /> */}
      </div>

      {/* Notes box */}
      <div style={styles.box}></div>

      {/* Canvas footer */}
      <div style={styles.canvasFooter}>
        <span style={styles.footerText}>Connect to Canvas</span>
        {/* <img
          src={canvasLogo}
          alt="Canvas"
          style={{ width: "30px", height: "30px" }}
        /> */}
      </div>
    </div>
  );
}

/* ---------- Inline styles ---------- */
const styles = {
  panel: {
    position: "absolute",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    color: "black",  
    flexDirection: "column",
    gap: "16px",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },
  logo: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  toggleOuter: {
    width: "50px",
    height: "28px",
    borderRadius: "30px",
    border: "2px solid black",
    position: "relative",
  },
  toggleInner: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "black",
    position: "absolute",
    top: "1px",
    left: "1px",
  },
  toggleLabel: {
    fontSize: "14px",
    fontWeight: 600,
  },
  box: {
    flexShrink: 0,
    backgroundColor: "white",
    borderRadius: "20px",
    height: "160px",
    marginTop: "10px",
  },
  notesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: 700,
    marginTop: "8px",
    
  },
  headerText: {
    fontWeight: 700,
  },
  canvasFooter: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 700,
  },
  footerText: {
    fontWeight: 600,
  },
};
