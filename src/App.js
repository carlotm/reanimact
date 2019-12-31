import React, { useState, useEffect } from "react";
import { ReactComponent as Animals } from "./animals/svg/sprite.symbol.svg";
import "./App.css";

const Timer = () => <section className="Timer">timer</section>;

const Cell = ({ val, current, active, index }) => {
  const currentClass = current ? "is-current" : "";
  const activeClass = active ? "is-active" : "";
  return (
    <div className={`Cell Cell--${val} ${currentClass} ${activeClass}`}>
      <svg viewBox="0 0 100 100">
        <use xlinkHref={`#${val}`} />
      </svg>
    </div>
  );
};

const Board = ({ board, current, active }) => (
  <section className="Board">
    {board.map((c, i) => (
      <Cell val={c} key={i} current={current === i} active={active} index={i} />
    ))}
  </section>
);

const Main = ({ children }) => <section className="Main">{children}</section>;

const OSD = () => <section className="OSD">OSD</section>;

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

  useEffect(() => {}, []);

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

  const updateBoard = () => {
    if (board.includes(undefined)) return null;

    const newBoard = [...board];
    for (let r = 0; r < 64; r += 8)
      findSeq(rowValues(r))
        .map(s => s.map(off => r + off))
        .forEach(s => s.forEach(i => (newBoard[i] = randomCell())));
    for (let c = 0; c < 8; c++)
      findSeq(colValues(c))
        .map(s => s.map(off => c + off * 8))
        .forEach(s => s.forEach(i => (newBoard[i] = randomCell())));
    return arrayEquals(board, newBoard) ? null : newBoard;
  };

  useEffect(() => {
    const newBoard = updateBoard();
    if (newBoard) setBoard(newBoard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

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
      <Main>
        <Timer />
        <Board board={board} current={current} active={active} />
      </Main>
      <OSD />
      <Animals style={{ display: "none" }} />
    </section>
  );
}

export default App;
