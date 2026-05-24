import { renderHook, act } from '@testing-library/react'
import { useSpinout } from '../hooks/useSpinout'
import { solutionLength } from '../utils/grayCode'

describe('useSpinout', () => {
  it('ignores illegal moves', () => {
    const { result } = renderHook(() => useSpinout())

    act(() => {
      result.current.turn(2)
    })

    expect(result.current.dials).toEqual([false, false, false, false, false, false, false])
    expect(result.current.moveCount).toBe(0)
  })

  it('can undo the previous legal move', () => {
    const { result } = renderHook(() => useSpinout())

    act(() => {
      result.current.turn(1)
    })

    expect(result.current.dials).toEqual([true, false, false, false, false, false, false])

    act(() => {
      result.current.undo()
    })

    expect(result.current.dials).toEqual([false, false, false, false, false, false, false])
    expect(result.current.moveCount).toBe(0)
  })

  it('increments move count only for legal moves', () => {
    const { result } = renderHook(() => useSpinout())

    act(() => {
      result.current.turn(2)
      result.current.turn(1)
    })

    expect(result.current.moveCount).toBe(1)
  })

  it('becomes won once all dials are horizontal', () => {
    const { result } = renderHook(() => useSpinout())

    for (let step = 0; step < solutionLength(7) && !result.current.isWon; step += 1) {
      act(() => {
        result.current.turn(result.current.hint())
      })
    }

    expect(result.current.isWon).toBe(true)
    expect(result.current.dials).toEqual([true, true, true, true, true, true, true])
  })
})
