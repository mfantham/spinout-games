import { useCallback, useMemo, useState } from 'react'
import {
  canMove as canTurnDial,
  isSolved as areAllSolved,
  nextHintMove,
} from '../utils/grayCode'

const INITIAL_DIALS = new Array(7).fill(false)

export function useSpinout() {
  const [dials, setDials] = useState(INITIAL_DIALS)
  const [history, setHistory] = useState([])
  const [moveCount, setMoveCount] = useState(0)

  const isWon = useMemo(() => areAllSolved(dials), [dials])

  const canMove = useCallback((dial) => canTurnDial(dials, dial), [dials])

  const turn = useCallback(
    (dial) => {
      if (isWon || !canTurnDial(dials, dial)) {
        return
      }

      setHistory((previousHistory) => [...previousHistory, dials])
      setDials((previousDials) =>
        previousDials.map((value, index) => (index === dial - 1 ? !value : value)),
      )
      setMoveCount((previousCount) => previousCount + 1)
    },
    [dials, isWon],
  )

  const undo = useCallback(() => {
    if (isWon || history.length === 0) {
      return
    }

    setHistory((previousHistory) => previousHistory.slice(0, -1))
    setDials(history[history.length - 1])
    setMoveCount((previousCount) => Math.max(0, previousCount - 1))
  }, [history, isWon])

  const reset = useCallback(() => {
    setDials(INITIAL_DIALS)
    setHistory([])
    setMoveCount(0)
  }, [])

  const hint = useCallback(() => nextHintMove(dials), [dials])

  return {
    dials,
    moveCount,
    isWon,
    canMove,
    turn,
    undo,
    reset,
    hint,
    canUndo: history.length > 0,
  }
}
