import {
  canMove,
  isSolved,
  nextHintMove,
  solutionLength,
} from '../utils/grayCode'

function legalMoves(state) {
  return Array.from({ length: state.length }, (_, index) => index + 1).filter((dial) =>
    canMove(state, dial),
  )
}

describe('grayCode helpers', () => {
  it('matches representative movement examples', () => {
    expect(legalMoves([false, false, false, false, false, false, false])).toEqual([1])
    expect(legalMoves([true, false, false, false, false, false, false])).toEqual([1, 2])
    expect(legalMoves([false, true, false, false, false, false, false])).toEqual([1, 3])
    expect(legalMoves([true, true, false, false, false, false, false])).toEqual([1, 2])
    expect(legalMoves([false, false, false, false, false, true, false])).toEqual([1, 7])
  })

  it('always allows dial 1', () => {
    expect(canMove([false, false, false, false, false, false, false], 1)).toBe(true)
    expect(canMove([true, false, true, false, true, false, true], 1)).toBe(true)
    expect(canMove([true, true, true, true, true, true, true], 1)).toBe(true)
  })

  it('returns dial 1 as the first hint from the starting state', () => {
    expect(nextHintMove([false, false, false, false, false, false, false])).toBe(1)
  })

  it('reports solved and unsolved states correctly', () => {
    expect(isSolved([false, false, false, false, false, false, false])).toBe(false)
    expect(isSolved([true, true, true, true, true, true, true])).toBe(true)
  })

  it('computes the known solution length for seven dials', () => {
    expect(solutionLength(7)).toBe(85)
  })
})
