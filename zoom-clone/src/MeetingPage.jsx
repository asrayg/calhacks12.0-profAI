import React from "react";
import "./MeetingPage.css";
import meetingScreenshot from "./assets/zoom.png"; 

export default function MeetingPage() {
  return (
    <div className="fullscreen-container">
      <img src={meetingScreenshot} alt="Meeting" className="fullscreen-image" />
    </div>
  );
}
