import { useEffect, useMemo, useState } from "preact/hooks";
import Controls from "../components/Controls.tsx";
import DialBar from "../components/DialBar.tsx";
import Leaderboard from "../components/Leaderboard.tsx";
import { useSpinout } from "../lib/useSpinout.ts";
import { solutionLength } from "../lib/grayCode.ts";

export default function SpinoutGame() {
  const {
    dials,
    moveCount,
    isWon,
    sliderDial,
    slide,
    turn,
    undo,
    reset,
    hint,
    canUndo,
  } = useSpinout();
  const [hintDial, setHintDial] = useState<number | null>(null);
  const par = useMemo(() => solutionLength(dials.length), [dials.length]);

  useEffect(() => {
    if (isWon) {
      setHintDial(null);
    }
  }, [isWon]);

  const handleTurn = (dial: number) => {
    setHintDial(null);
    turn(dial);
  };

  const handleUndo = () => {
    setHintDial(null);
    undo();
  };

  const handleReset = () => {
    setHintDial(null);
    reset();
  };

  const handleHint = () => {
    setHintDial(hint());
  };

  return (
    <main class="app-shell">
      <section class="app-card">
        <header class="app-header">
          <h1>Spinout</h1>
          <p>
            Slide the bar so a dial is at the base position, then rotate it.
            Turn all seven dials horizontal to slide the bar free.
          </p>
        </header>

        <div class={`status-banner ${isWon ? "status-banner--won" : ""}`}>
          {isWon
            ? `Solved in ${moveCount} moves${
              moveCount <= par ? " — under par!" : ""
            }`
            : "Rotate the dial at the base position, then slide to the next."}
        </div>

        <div class="game-grid">
          <DialBar
            dials={dials}
            hintDial={hintDial}
            sliderDial={sliderDial}
            onTurn={handleTurn}
            onSlide={slide}
          />
          <Controls
            moveCount={moveCount}
            onReset={handleReset}
            onUndo={handleUndo}
            onHint={handleHint}
            canUndo={canUndo}
            isWon={isWon}
          />
          <Leaderboard isWon={isWon} moveCount={moveCount} />
        </div>
      </section>
    </main>
  );
}
