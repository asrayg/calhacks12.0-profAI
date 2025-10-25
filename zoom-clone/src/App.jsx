import meetingScreenshot from "./assets/zoom.png";
import ProfAISidePanel from "./ProfAISidePanel";

export default function App() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
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
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "200px",
          left: "1246px",
          transform: "translate(-50%, -50%)",
          width: "370px",
          height: "400px",
          zIndex: 20,
        }}
      >
        <ProfAISidePanel />
      </div>

    </div>
  );
}
