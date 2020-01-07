import React from "react";
import Cell from "./Cell.js";
import "./Board.css";

export default ({ board, current, active, arrows, toExplode }) => (
  <section className="Board">
    {board.map((c, i) => (
      <Cell
        val={c}
        key={i}
        current={current === i}
        active={active}
        index={i}
        arrows={arrows}
        explode={toExplode.includes(i)}
      />
    ))}
  </section>
);
