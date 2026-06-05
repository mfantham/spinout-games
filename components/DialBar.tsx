import Dial from "./Dial.tsx";
import { canMove, isSolved } from "../lib/grayCode.ts";

interface DialBarProps {
  dials: boolean[];
  hintDial: number | null;
  windowDial: number;
  onTurn: (dial: number) => void;
  onSlide: (dial: number) => void;
}

export default function DialBar(
  { dials, hintDial, windowDial, onTurn, onSlide }: DialBarProps,
) {
  const isWon = isSolved(dials);
  const positions = Array.from(
    { length: dials.length },
    (_, index) => dials.length - index,
  );

  const handleDialClick = (position: number) => {
    if (position === windowDial) {
      onTurn(position);
    } else {
      onSlide(position);
    }
  };

  const slideLeft = () => onSlide(Math.min(dials.length, windowDial + 1));
  const slideRight = () => onSlide(Math.max(1, windowDial - 1));

  return (
    <section class="dial-bar-wrap" aria-label="Spinout puzzle board">
      <div class={`dial-bar ${isWon ? "dial-bar--won" : ""}`}>
        <div class="dial-bar__tray">
          {positions.map((position) => (
            <div
              key={position}
              class={`dial-bar__slot ${
                position === windowDial ? "dial-bar__slot--active" : ""
              }`}
            >
              <Dial
                position={position}
                isHorizontal={dials[position - 1]}
                isAtWindow={position === windowDial}
                canRotate={!isWon && canMove(dials, position)}
                isHinted={!isWon && hintDial === position}
                onClick={() => handleDialClick(position)}
              />
            </div>
          ))}
        </div>
      </div>

      <div class="dial-bar__controls" aria-label="Slide controls">
        <button
          type="button"
          class="slide-button"
          onClick={slideLeft}
          disabled={windowDial >= dials.length}
          aria-label="Slide bar left"
        >
          &#8592;
        </button>
        <span class="dial-bar__window-label">
          Window: Dial {windowDial}
        </span>
        <button
          type="button"
          class="slide-button"
          onClick={slideRight}
          disabled={windowDial <= 1}
          aria-label="Slide bar right"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
