import React from "react";
import "./OSD.css";

export default ({ score, level, onplay, audioPlaying }) => (
  <section className="OSD">
    <p className="OSD-line">Level: {level}</p>
    <p className="OSD-line">Score: {score}</p>
    <p className="OSD-line--help">
      Arrow keys to move, spacebar and arrow keys to swap hippo in any
      direction. Align 3 or more hippos of the same colors to make them
      disappear.
    </p>
    <p className="OSD-line--bottom">
      <button onClick={() => onplay()} className="OSD-audio">
        <svg viewBox="0 0 100 100">
          <use xlinkHref={audioPlaying ? "#mute" : "#play"} />
        </svg>
      </button>
    </p>
  </section>
);
