import Dial from "./Dial.tsx";
import { canMove, isSolved } from "../lib/grayCode.ts";

interface DialBarProps {
  dials: boolean[];
  hintDial: number | null;
  /** Which dial (1–7) is currently at the base position (the interaction window). */
  sliderDial: number;
  onTurn: (dial: number) => void;
  onSlide: (dial: number) => void;
}

export default function DialBar(
  { dials, hintDial, sliderDial, onTurn, onSlide }: DialBarProps,
) {
  const isWon = isSolved(dials);
  const positions = Array.from(
    { length: dials.length },
    (_, index) => dials.length - index,
  );

  // The slider bar is locked (cannot move) while the dial at the base position
  // is vertical. It can only slide once that dial is horizontal.
  const canSlide = isWon || dials[sliderDial - 1] === true;

  const handleDialClick = (position: number) => {
    if (position === sliderDial) {
      onTurn(position);
    } else if (canSlide) {
      onSlide(position);
    }
  };

  return (
    <section class="dial-bar-wrap" aria-label="Spinout puzzle board">
      <div class={`dial-bar ${isWon ? "dial-bar--won" : ""}`}>
        <div class="dial-bar__tray">
          {positions.map((position) => (
            <div
              key={position}
              class={`dial-bar__slot ${
                position === sliderDial ? "dial-bar__slot--active" : ""
              }`}
            >
              <Dial
                position={position}
                isHorizontal={dials[position - 1]}
                isAtBase={position === sliderDial}
                canRotate={!isWon && canMove(dials, position)}
                canSlide={canSlide}
                isHinted={!isWon && hintDial === position}
                onClick={() => handleDialClick(position)}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        class={`dial-bar__controls ${
          !canSlide ? "dial-bar__controls--locked" : ""
        }`}
        aria-label="Slide controls"
      >
        <button
          type="button"
          class="slide-button"
          onClick={() => onSlide(Math.min(dials.length, sliderDial + 1))}
          disabled={!canSlide || sliderDial >= dials.length}
          aria-label="Slide bar left"
        >
          &#8592;
        </button>
        <span class="dial-bar__base-label">
          {canSlide
            ? `Base position: Dial ${sliderDial}`
            : `🔒 Rotate dial ${sliderDial} to unlock`}
        </span>
        <button
          type="button"
          class="slide-button"
          onClick={() => onSlide(Math.max(1, sliderDial - 1))}
          disabled={!canSlide || sliderDial <= 1}
          aria-label="Slide bar right"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
