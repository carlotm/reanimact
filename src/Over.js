import React from "react";
import "./Over.css";

export default ({ score, onTryAgain }) => (
  <section className="Over">
    <p className="Over-message">Game Over</p>
    <p className="Over-message">Your Score: {score}</p>
    <button className="Over-tryagain" onClick={onTryAgain}>
      Try Again
    </button>
  </section>
);
