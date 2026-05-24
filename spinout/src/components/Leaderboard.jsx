import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'spinout_scores'

function readScores() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function sortScores(scores) {
  return [...scores]
    .sort((left, right) => left.moves - right.moves || left.date.localeCompare(right.date))
    .slice(0, 10)
}

export default function Leaderboard({ isWon, moveCount }) {
  const [scores, setScores] = useState(readScores)
  const hasSavedForWin = useRef(false)

  useEffect(() => {
    if (!isWon) {
      hasSavedForWin.current = false
      return
    }

    if (hasSavedForWin.current) {
      return
    }

    hasSavedForWin.current = true
    const enteredName = window.prompt('You solved Spinout! Enter your name for the leaderboard:', '')
    const score = {
      name: enteredName?.trim() || 'Anonymous',
      moves: moveCount,
      date: new Date().toISOString(),
    }

    setScores((previousScores) => {
      const nextScores = sortScores([...previousScores, score])
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextScores))
      return nextScores
    })
  }, [isWon, moveCount])

  const topScores = useMemo(() => sortScores(scores), [scores])

  return (
    <details className="leaderboard">
      <summary>Leaderboard</summary>
      {topScores.length === 0 ? (
        <p className="leaderboard__empty">No recorded solves yet. Be the first.</p>
      ) : (
        <ol className="leaderboard__list">
          {topScores.map((score, index) => (
            <li key={`${score.name}-${score.date}-${index}`} className="leaderboard__item">
              <span className="leaderboard__name">{score.name}</span>
              <span className="leaderboard__moves">{score.moves} moves</span>
              <span className="leaderboard__date">{new Date(score.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ol>
      )}
    </details>
  )
}
