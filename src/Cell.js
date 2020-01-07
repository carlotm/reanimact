import React from "react";
import "./Cell.css";

export default ({ val, current, active, index, arrows, explode }) => {
  const currentClass = current ? "is-current" : "";
  const activeClass = active && current ? "is-active" : "";
  const explodeClass = explode ? "is-boom" : "";
  const stateClasses = `${currentClass} ${activeClass} ${explodeClass}`;
  const arrowsEl =
    active && current
      ? arrows.map(dir => <i key={dir} className={`Arrow Arrow--${dir}`} />)
      : null;

  return (
    <div className={`Cell Cell--${val} ${stateClasses}`}>
      <svg viewBox="0 0 100 100">
        <use xlinkHref={`#${val}`} />
      </svg>
      {arrowsEl}
    </div>
  );
};
