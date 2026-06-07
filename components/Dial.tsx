interface DialProps {
  position: number;
  isHorizontal: boolean;
  isAtBase: boolean;
  canRotate: boolean;
  canSlide: boolean;
  isHinted: boolean;
  onClick: () => void;
}

export default function Dial({
  position,
  isHorizontal,
  isAtBase,
  canRotate,
  canSlide,
  isHinted,
  onClick,
}: DialProps) {
  const rotatable = isAtBase && canRotate;

  let ariaLabel: string;
  if (isAtBase) {
    ariaLabel = `Dial ${position} — ${
      rotatable ? "click to rotate" : "locked"
    }`;
  } else if (canSlide) {
    ariaLabel = `Dial ${position} — click to slide into base position`;
  } else {
    ariaLabel =
      `Dial ${position} — slider locked, rotate dial ${position} first`;
  }

  return (
    <button
      type="button"
      class={[
        "dial",
        isHorizontal ? "dial--horizontal" : "dial--vertical",
        isAtBase ? "dial--at-base" : "dial--on-slider",
        rotatable ? "dial--rotatable" : "",
        !isAtBase && !canSlide ? "dial--slider-locked" : "",
        isHinted ? "dial--hinted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      aria-label={ariaLabel}
      title={`Dial ${position}`}
    >
      <span class="dial__bezel">
        <span class="dial__knob">
          <span class="dial__stripe" />
          <span class="dial__label">{position}</span>
        </span>
      </span>
    </button>
  );
}
