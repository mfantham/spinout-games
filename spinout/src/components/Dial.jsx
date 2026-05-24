export default function Dial({
  position,
  isHorizontal,
  isMoveable,
  isHinted,
  onClick,
}) {
  return (
    <button
      type="button"
      className={[
        'dial',
        isHorizontal ? 'dial--horizontal' : 'dial--vertical',
        isMoveable ? 'dial--moveable' : 'dial--locked',
        isHinted ? 'dial--hinted' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={!isMoveable}
      aria-label={`Turn dial ${position}`}
      title={`Dial ${position}`}
    >
      <span className="dial__knob">
        <span className="dial__stripe" />
        <span className="dial__label">{position}</span>
      </span>
    </button>
  )
}
