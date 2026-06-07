import { useCallback, useMemo, useState } from "preact/hooks";
import {
  canMove as canTurnDial,
  isSolved as areAllSolved,
  nextHintMove,
} from "./grayCode.ts";

const INITIAL_DIALS = new Array(7).fill(false);

/** One entry in the undo stack: dial state plus which dial was at the base. */
interface HistoryEntry {
  dials: boolean[];
  sliderDial: number;
}

export function useSpinout() {
  const [dials, setDials] = useState<boolean[]>(INITIAL_DIALS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  /**
   * sliderDial: which dial (1–7) is currently positioned at the base position
   * (the single interaction window on the fixed base of the puzzle).
   * Starts at 1 — the home/right-most position.
   */
  const [sliderDial, setSliderDial] = useState<number>(1);

  const isWon = useMemo(() => areAllSolved(dials), [dials]);

  const canMove = useCallback(
    (dial: number) => canTurnDial(dials, dial),
    [dials],
  );

  /**
   * canSlide: true when the slider bar is free to move.
   * The bar is locked in place by a vertical dial at the base position;
   * it can only slide once that dial has been rotated horizontal.
   */
  const canSlide = isWon || dials[sliderDial - 1] === true;

  /**
   * slide: move the slider so that `targetDial` sits at the base position.
   * Only allowed when the bar is currently unlocked (canSlide).
   */
  const slide = useCallback(
    (targetDial: number) => {
      if (
        targetDial < 1 || targetDial > dials.length ||
        targetDial === sliderDial
      ) {
        return;
      }
      // The bar is locked while the dial at the base is still vertical.
      if (!dials[sliderDial - 1] && !isWon) {
        return;
      }
      setSliderDial(targetDial);
    },
    [dials, sliderDial, isWon],
  );

  const turn = useCallback(
    (dial: number) => {
      if (isWon || dial !== sliderDial || !canTurnDial(dials, dial)) {
        return;
      }

      setHistory((previousHistory) => [
        ...previousHistory,
        { dials, sliderDial },
      ]);
      setDials((previousDials) =>
        previousDials.map((value, index) => index === dial - 1 ? !value : value)
      );
      setMoveCount((previousCount) => previousCount + 1);
    },
    [dials, isWon, sliderDial],
  );

  const undo = useCallback(() => {
    if (isWon || history.length === 0) {
      return;
    }

    const previous = history[history.length - 1];
    setHistory((previousHistory) => previousHistory.slice(0, -1));
    setDials(previous.dials);
    setSliderDial(previous.sliderDial);
    setMoveCount((previousCount) => Math.max(0, previousCount - 1));
  }, [history, isWon]);

  const reset = useCallback(() => {
    setDials(INITIAL_DIALS);
    setHistory([]);
    setMoveCount(0);
    setSliderDial(1);
  }, []);

  const hint = useCallback(() => nextHintMove(dials), [dials]);

  return {
    dials,
    moveCount,
    isWon,
    canMove,
    sliderDial,
    canSlide,
    slide,
    turn,
    undo,
    reset,
    hint,
    canUndo: history.length > 0,
  };
}
