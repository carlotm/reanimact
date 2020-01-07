import React from "react";
import "./Timer.css";

export default ({ progress }) => (
  <section className="Timer">
    <i className="Timer-bar" style={{ width: `${progress}%` }} />
  </section>
);
