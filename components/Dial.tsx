interface DialProps {
  position: number;
  isHorizontal: boolean;
  isMoveable: boolean;
  isHinted: boolean;
  onClick: () => void;
}

export default function Dial({
  position,
  isHorizontal,
  isMoveable,
  isHinted,
  onClick,
}: DialProps) {
  return (
    <button
      type="button"
      class={[
        "dial",
        isHorizontal ? "dial--horizontal" : "dial--vertical",
        isMoveable ? "dial--moveable" : "dial--locked",
        isHinted ? "dial--hinted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={!isMoveable}
      aria-label={`Turn dial ${position}`}
      title={`Dial ${position}`}
    >
      <span class="dial__knob">
        <span class="dial__stripe" />
        <span class="dial__label">{position}</span>
      </span>
    </button>
  );
}
