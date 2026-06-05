interface DialProps {
  position: number;
  isHorizontal: boolean;
  isAtWindow: boolean;
  canRotate: boolean;
  isHinted: boolean;
  onClick: () => void;
}

export default function Dial({
  position,
  isHorizontal,
  isAtWindow,
  canRotate,
  isHinted,
  onClick,
}: DialProps) {
  const rotatable = isAtWindow && canRotate;

  return (
    <button
      type="button"
      class={[
        "dial",
        isHorizontal ? "dial--horizontal" : "dial--vertical",
        isAtWindow ? "dial--in-window" : "dial--outside-window",
        rotatable ? "dial--rotatable" : "",
        isHinted ? "dial--hinted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={false}
      aria-label={isAtWindow
        ? `Dial ${position} — ${rotatable ? "click to rotate" : "locked"}`
        : `Dial ${position} — click to slide into window`}
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
