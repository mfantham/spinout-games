export function canMove(dials, n) {
  if (n < 1 || n > dials.length) {
    return false
  }

  if (n === 1) {
    return true
  }

  if (dials[n - 2] !== true) {
    return false
  }

  for (let index = 0; index <= n - 3; index += 1) {
    if (dials[index] !== false) {
      return false
    }
  }

  return true
}

function legalMoves(dials) {
  const moves = []

  for (let dial = 1; dial <= dials.length; dial += 1) {
    if (canMove(dials, dial)) {
      moves.push(dial)
    }
  }

  return moves
}

function toggleDial(dials, n) {
  return dials.map((dial, index) => (index === n - 1 ? !dial : dial))
}

function serialize(dials) {
  return dials.map((dial) => (dial ? '1' : '0')).join('')
}

export function isSolved(dials) {
  return dials.every(Boolean)
}

export function solutionLength(n) {
  return Math.floor(2 ** (n + 1) / 3)
}

export function nextHintMove(dials) {
  if (isSolved(dials)) {
    return null
  }

  const targetKey = serialize(new Array(dials.length).fill(true))
  const startKey = serialize(dials)
  const queue = [{ state: dials, firstMove: null }]
  const visited = new Set([startKey])

  while (queue.length > 0) {
    const current = queue.shift()
    const moves = legalMoves(current.state).sort((a, b) => b - a)

    for (const move of moves) {
      const nextState = toggleDial(current.state, move)
      const nextKey = serialize(nextState)

      if (visited.has(nextKey)) {
        continue
      }

      const firstMove = current.firstMove ?? move
      if (nextKey === targetKey) {
        return firstMove
      }

      visited.add(nextKey)
      queue.push({ state: nextState, firstMove })
    }
  }

  return null
}
