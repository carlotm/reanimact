import React, { useState, useEffect } from "react";
import { ReactComponent as Animals } from "./animals/svg/sprite.symbol.svg";
import { useInterval } from "./hooks.js";
import "./App.css";
import audioFile from "./ost.mp3";
import Timer from "./Timer.js";
import Board from "./Board.js";
import Main from "./Main.js";
import OSD from "./OSD.js";
import Menu from "./Menu.js";
import Over from "./Over.js";

const randomCell = () => Math.floor(Math.random() * 8 + 1);

const randomBoard = () => Array.from(new Array(64), randomCell);

export const findSeq = (arr) => {
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
  ost.loop = true;
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [over, setOver] = useState(false);

  const row = () => Math.floor(current / 8);

  const col = () => Math.floor(current % 8);

  const rowValues = (r) => [...Array(8).keys()].map((off) => board[r + off]);

  const colValues = (c) =>
    [...Array(8).keys()].map((off) => board[c + off * 8]);

  const swapCell = (delta) => {
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
          .map((s) => s.map((off) => r + off))
          .flat()
      );
    for (let c = 0; c < 8; c++)
      result.push(
        findSeq(colValues(c))
          .map((s) => s.map((off) => c + off * 8))
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

  useInterval(
    () => {
      if (progress <= 0) {
        ost.pause();
        setOver(true);
      } else setProgress(progress - 1);
    },
    playing && !over ? 1000 / level : null
  );

  const onPlay = () => {
    document.querySelector(".Reanimact").focus();
    setPlay(!audioPlaying);
  };

  const onNewGame = () => {
    document.querySelector(".Reanimact").focus();
    setPlaying(true);
    setOver(false);
    setProgress(100);
    setLevel(1);
    setCurrent(0);
    setBoard(randomBoard());
    setScore(0);
    setPlay(sound);
  };

  const onSetSound = () => {
    setSound(!sound);
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
      toExplode.forEach((cell) => (newBoard[cell] = randomCell()));
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

  const moveBy = (delta) => {
    if (active) {
      setBoard(swapCell(delta));
      setActive(false);
    }
    setCurrent(current + delta);
  };

  const onKey = (event) => {
    switch (event.keyCode) {
      case 32:
        setActive(!active);
        break;
      case 37:
      case 72:
        if (col() - 1 >= 0) moveBy(-1);
        break;
      case 38:
      case 75:
        if (row() - 1 >= 0) moveBy(-8);
        break;
      case 39:
      case 76:
        if (col() + 1 <= 7) moveBy(1);
        break;
      case 40:
      case 74:
        if (row() + 1 <= 7) moveBy(8);
        break;
      default:
        break;
    }
  };

  const GameOver = over ? <Over score={score} onTryAgain={onNewGame} /> : null;

  const Canvas = playing ? (
    <>
      <Main>
        {GameOver}
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
        audioPlaying={audioPlaying}
      />
    </>
  ) : (
    <Menu sound={sound} onNewGame={onNewGame} onSetSound={onSetSound} />
  );

  return (
    <section className="Reanimact" tabIndex="0" onKeyUp={onKey}>
      <div className="Canvas">{Canvas}</div>
      <Animals style={{ display: "none" }} />
    </section>
  );
}

export default App;
