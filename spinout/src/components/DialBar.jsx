import Dial from './Dial'
import { canMove, isSolved } from '../utils/grayCode'

export default function DialBar({ dials, hintDial, onTurn }) {
  const isWon = isSolved(dials)
  const positions = Array.from({ length: dials.length }, (_, index) => dials.length - index)

  return (
    <section className="dial-bar-wrap" aria-label="Spinout puzzle board">
      <div className={`dial-bar ${isWon ? 'dial-bar--won' : ''}`}>
        <div className="dial-bar__rail" />
        <div className="dial-bar__slots">
          {positions.map((position) => (
            <div key={position} className="dial-bar__slot">
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
        <div className="dial-bar__handle dial-bar__handle--left" />
        <div className="dial-bar__handle dial-bar__handle--right" />
      </div>
      <div className="dial-bar__legend">
        <span>Dial 7</span>
        <span>Dial 1</span>
      </div>
    </section>
  )
}
