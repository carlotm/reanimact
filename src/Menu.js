import React from "react";
import "./Menu.css";

export default ({ sound, onNewGame, onSetSound }) => (
  <section className="Menu">
    <header className="Menu-header">
      <svg viewBox="0 0 100 100" className="Menu-logo">
        <use xlinkHref="#7" />
      </svg>
      <h1 className="Menu-title">Reanimact</h1>
      <h2 className="Menu-subtitle">A silly game made in React</h2>
    </header>
    <button className="Menu-item is-cta" onClick={onNewGame}>
      New Game
    </button>
    <button className="Menu-item" onClick={onSetSound}>
      Sound
      <svg viewBox="0 0 100 100">
        <use xlinkHref={sound ? "#play" : "#mute"} />
      </svg>
    </button>
  </section>
);
