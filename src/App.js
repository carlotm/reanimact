import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Animals } from "./animals/svg/sprite.symbol.svg";
import "./App.css";
import audioFile from "./ost.mp3";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Timer = ({ progress }) => (
  <section className="Timer">
    <i className="Timer-bar" style={{ width: `${progress}%` }} />
  </section>
);

const Cell = ({ val, current, active, index, arrows, explode }) => {
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

const Board = ({ board, current, active, arrows, toExplode }) => (
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

const Main = ({ children }) => <section className="Main">{children}</section>;

const OSD = ({ score, level, onplay, playing }) => (
  <section className="OSD">
    <p className="OSD-line">Level: {level}</p>
    <p className="OSD-line">Score: {score}</p>
    <p className="OSD-line--bottom">
      <button onClick={e => onplay()} className="OSD-audio">
        <svg viewBox="0 0 100 100">
          <use xlinkHref={playing ? "#mute" : "#play"} />
        </svg>
      </button>
    </p>
  </section>
);

const randomCell = () => Math.floor(Math.random() * 8 + 1);

const randomBoard = () => Array.from(new Array(64), randomCell);

export const arrayEquals = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) if (arr1[i] !== arr2[i]) return false;
  return true;
};

export const findSeq = arr => {
  if (arr.length !== 8 || arr.includes(undefined)) return [];

  let result = [];
  let i = 0;
  while (i < 8) {
    let count = 1;
    while (arr[i] === arr[i + count]) count++;
    if (count >= 3)
      result.push(
        Array(count)
          .fill(i)
          .map((i, idx) => i + idx)
      );
    i += count;
  }
  return result;
};

function App() {
  const [board, setBoard] = useState(randomBoard());
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(false);
  const [arrows, setArrows] = useState([]);
  const [toExplode, setToExplode] = useState([]);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(100);
  const [level, setLevel] = useState(1);
  const [audioPlaying, setPlay] = useState(false);
  const ost = useState(new Audio(audioFile))[0];

  const row = () => Math.floor(current / 8);

  const col = () => Math.floor(current % 8);

  const rowValues = r => [...Array(8).keys()].map(off => board[r + off]);

  const colValues = c => [...Array(8).keys()].map(off => board[c + off * 8]);

  const swapCell = delta => {
    const newBoard = [...board];
    newBoard[current] = board[current + delta];
    newBoard[current + delta] = board[current];
    return newBoard;
  };

  const getExplosiveCells = () => {
    if (board.includes(undefined)) return null;

    let result = [];
    for (let r = 0; r < 64; r += 8)
      result.push(
        findSeq(rowValues(r))
          .map(s => s.map(off => r + off))
          .flat()
      );
    for (let c = 0; c < 8; c++)
      result.push(
        findSeq(colValues(c))
          .map(s => s.map(off => c + off * 8))
          .flat()
      );
    return result.flat();
  };

  const showArrows = () => {
    let arr = [];
    if (current > 7) arr.push("n");
    if (current % 8 !== 7) arr.push("e");
    if (current < 56) arr.push("s");
    if (current % 8 !== 0) arr.push("w");
    setArrows(arr);
  };

  useInterval(() => {
    if (progress <= 0) {
      ost.pause();
      alert(`Game Over! Your score is: ${score}`);
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    } else setProgress(progress - 1);
  }, 1000 / level);

  const onPlay = () => {
    ost.loop = true;
    document.querySelector(".Reanimact").focus();
    setPlay(!audioPlaying);
  };

  useEffect(() => {
    if (audioPlaying) ost.play();
    else ost.pause();
  }, [audioPlaying, ost]);

  useEffect(() => {
    setToExplode(getExplosiveCells());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  useEffect(() => {
    if (score >= level * 100) {
      setLevel(level + 1);
      setProgress(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  useEffect(() => {
    if (toExplode.length === 0) return;

    setTimeout(() => {
      const newBoard = [...board];
      toExplode.forEach(cell => (newBoard[cell] = randomCell()));
      setBoard(newBoard);
      setScore(score + toExplode.length * 2);
      setProgress(Math.min(100, progress + level * 2));
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toExplode]);

  useEffect(() => {
    if (!active) return;
    showArrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const moveBy = delta => {
    if (active) {
      setBoard(swapCell(delta));
      setActive(false);
    }
    setCurrent(current + delta);
  };

  const onKey = event => {
    switch (event.keyCode) {
      case 32:
        setActive(!active);
        break;
      case 37:
        if (col() - 1 >= 0) moveBy(-1);
        break;
      case 38:
        if (row() - 1 >= 0) moveBy(-8);
        break;
      case 39:
        if (col() + 1 <= 7) moveBy(1);
        break;
      case 40:
        if (row() + 1 <= 7) moveBy(8);
        break;
      default:
        break;
    }
  };

  return (
    <section className="Reanimact" tabIndex="0" onKeyUp={onKey}>
      <div className="Canvas">
        <Main>
          <Timer progress={progress} />
          <Board
            board={board}
            current={current}
            active={active}
            arrows={arrows}
            toExplode={toExplode}
          />
        </Main>
        <OSD
          score={score}
          level={level}
          onplay={onPlay}
          playing={audioPlaying}
        />
      </div>
      <Animals style={{ display: "none" }} />
    </section>
  );
}

export default App;
