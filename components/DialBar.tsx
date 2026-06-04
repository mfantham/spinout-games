import Dial from "./Dial.tsx";
import { canMove, isSolved } from "../lib/grayCode.ts";

interface DialBarProps {
  dials: boolean[];
  hintDial: number | null;
  onTurn: (dial: number) => void;
}

export default function DialBar({ dials, hintDial, onTurn }: DialBarProps) {
  const isWon = isSolved(dials);
  const positions = Array.from(
    { length: dials.length },
    (_, index) => dials.length - index,
  );

  return (
    <section class="dial-bar-wrap" aria-label="Spinout puzzle board">
      <div class={`dial-bar ${isWon ? "dial-bar--won" : ""}`}>
        <div class="dial-bar__rail" />
        <div class="dial-bar__slots">
          {positions.map((position) => (
            <div key={position} class="dial-bar__slot">
              <Dial
                position={position}
                isHorizontal={dials[position - 1]}
                isMoveable={!isWon && canMove(dials, position)}
                isHinted={!isWon && hintDial === position}
                onClick={() => onTurn(position)}
              />
            </div>
          ))}
        </div>
        <div class="dial-bar__handle dial-bar__handle--left" />
        <div class="dial-bar__handle dial-bar__handle--right" />
      </div>
      <div class="dial-bar__legend">
        <span>Dial 7</span>
        <span>Dial 1</span>
      </div>
    </section>
  );
}
