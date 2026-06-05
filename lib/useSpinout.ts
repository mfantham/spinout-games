import { useCallback, useMemo, useState } from "preact/hooks";
import {
  canMove as canTurnDial,
  isSolved as areAllSolved,
  nextHintMove,
} from "./grayCode.ts";

const INITIAL_DIALS = new Array(7).fill(false);

export function useSpinout() {
  const [dials, setDials] = useState<boolean[]>(INITIAL_DIALS);
  const [history, setHistory] = useState<boolean[][]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [windowDial, setWindowDial] = useState<number>(1);

  const isWon = useMemo(() => areAllSolved(dials), [dials]);

  const canMove = useCallback(
    (dial: number) => canTurnDial(dials, dial),
    [dials],
  );

  const slideToWindow = useCallback(
    (dial: number) => {
      if (dial >= 1 && dial <= dials.length) {
        setWindowDial(dial);
      }
    },
    [dials.length],
  );

  const turn = useCallback(
    (dial: number) => {
      if (isWon || dial !== windowDial || !canTurnDial(dials, dial)) {
        return;
      }

      setHistory((previousHistory) => [...previousHistory, dials]);
      setDials((previousDials) =>
        previousDials.map((value, index) => index === dial - 1 ? !value : value)
      );
      setMoveCount((previousCount) => previousCount + 1);
    },
    [dials, isWon, windowDial],
  );

  const undo = useCallback(() => {
    if (isWon || history.length === 0) {
      return;
    }

    setHistory((previousHistory) => previousHistory.slice(0, -1));
    setDials(history[history.length - 1]);
    setMoveCount((previousCount) => Math.max(0, previousCount - 1));
  }, [history, isWon]);

  const reset = useCallback(() => {
    setDials(INITIAL_DIALS);
    setHistory([]);
    setMoveCount(0);
    setWindowDial(1);
  }, []);

  const hint = useCallback(() => nextHintMove(dials), [dials]);

  return {
    dials,
    moveCount,
    isWon,
    canMove,
    windowDial,
    slideToWindow,
    turn,
    undo,
    reset,
    hint,
    canUndo: history.length > 0,
  };
}
