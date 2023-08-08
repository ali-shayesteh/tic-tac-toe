import { useCallback, useEffect, useMemo, useState } from "react";
import Square from "./square";

const checker = (arr, target) =>
  target.some((win) => win.every((v) => arr.includes(v)));

const intersect = (array1, array2) =>
  array1.filter((value) => array2.includes(value));

const removeIntersect = (a, b) =>
  a.filter(function (item) {
    return b.indexOf(item) < 0; // Returns true for items not found in b.
  });

const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

const findNext = (value, xRes, oRes) => {
  let res = {value: value.findIndex((item) => item === ""), desc: "init"}

  if (value[4] === "") res = {value: 4, desc: "center" };
  
  let bigXInter = 1;
  for (let arr of win) {
    const xIntersects = intersect(xRes, arr);
    if (xIntersects.length >= bigXInter) {
      bigXInter = xIntersects.length;
      if (xIntersects.length >= bigXInter) {
        const x = removeIntersect(arr, xIntersects)[0];
        if (value[x] === "") res = {value: x, desc: "XX:" +  bigXInter};
      }
    }
  }
  let bigOInter = 2;
  for (let arr of win) {
    const oIntersects = intersect(oRes, arr);
    if (oIntersects.length >= bigOInter) {
      bigOInter = oIntersects.length;
      if (oIntersects.length >= bigOInter) {
        const o = removeIntersect(arr, oIntersects)[0];
        if (value[o] === "") res = {value: o, desc: "OO:" + bigOInter};
      }
    }
  }
  console.log(res);
  return res.value;
};

const init = Array(9).fill("");

export default function Main({mode}) {
  const [value, setValue] = useState(init);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [xRes, setXRes] = useState([]);
  const [oRes, setORes] = useState([]);

  const changeTurn = () => {
    setTurn((cur) => (cur === "X" ? "O" : "X"));
  };

  const finish = useMemo(() => xRes.length + oRes.length === 9, [xRes, oRes]);

  const play = useCallback(
    (index) => {
      setValue((cur) => {
        const res = [...cur];
        res[index] = turn;
        return res;
      });
      turn === "X"
        ? setXRes((cur) => [...cur, index])
        : setORes((cur) => [...cur, index]);
      changeTurn();
    },
    [turn]
  );

  const handleClick = (index) => {
    if (value[index] !== "" || winner || finish || ( mode === "s" && turn === "O")) return;
    play(index);
  };

  const playNext = useCallback(() => {
    if (mode === "m" || turn === "X" || winner || finish) return;
    const index = findNext(value, xRes, oRes);
    play(index);
  }, [play, value, turn, winner, finish, xRes, oRes, mode]);

  useEffect(() => {
    if (winner) return;
    if (checker(xRes, win)) {
      setWinner("X");
    } else if (checker(oRes, win)) {
      setWinner("O");
    }
  }, [xRes, oRes, value, winner]);

  useEffect(() => {
    if (finish || winner || mode === "m") return;
    const timeout = setTimeout(() => {
      playNext();
    }, 500);

    return () => clearInterval(timeout);
  }, [finish, winner, turn, playNext, mode]);

  const handleReset = () => {
    setWinner(null);
    setValue(init);
    setXRes([]);
    setORes([]);
    setTurn("X");
  };

  return (
    <div>
      <h1>
        {winner
          ? `${winner === "O" ? "PC wins!" : "You win!"}`
          : finish
          ? "it's a tie"
          : `${turn === "O" ? "PC" : "Your"} turn.`}{" "}
      </h1>

      <div className="board">
        {value.map((item, index) => {
          return (
            <Square key={index} val={item} onClick={() => handleClick(index)} />
          );
        })}
      </div>

      {<button onClick={handleReset}>Reset</button>}
    </div>
  );
}
