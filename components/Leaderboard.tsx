import { useEffect, useMemo, useRef, useState } from "preact/hooks";

const STORAGE_KEY = "spinout_scores";

interface Score {
  name: string;
  moves: number;
  date: string;
}

function readScores(): Score[] {
  if (typeof globalThis.localStorage === "undefined") {
    return [];
  }

  try {
    const stored = globalThis.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function sortScores(scores: Score[]): Score[] {
  return [...scores]
    .sort(
      (left, right) =>
        left.moves - right.moves || left.date.localeCompare(right.date),
    )
    .slice(0, 10);
}

interface LeaderboardProps {
  isWon: boolean;
  moveCount: number;
}

export default function Leaderboard({ isWon, moveCount }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>(readScores);
  const hasSavedForWin = useRef(false);

  useEffect(() => {
    if (!isWon) {
      hasSavedForWin.current = false;
      return;
    }

    if (hasSavedForWin.current) {
      return;
    }

    hasSavedForWin.current = true;
    const enteredName = globalThis.prompt(
      "You solved Spinout! Enter your name for the leaderboard:",
      "",
    );
    const score: Score = {
      name: enteredName?.trim() || "Anonymous",
      moves: moveCount,
      date: new Date().toISOString(),
    };

    setScores((previousScores) => {
      const nextScores = sortScores([...previousScores, score]);
      globalThis.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextScores),
      );
      return nextScores;
    });
  }, [isWon, moveCount]);

  const topScores = useMemo(() => sortScores(scores), [scores]);

  return (
    <details class="leaderboard">
      <summary>Leaderboard</summary>
      {topScores.length === 0
        ? (
          <p class="leaderboard__empty">
            No recorded solves yet. Be the first.
          </p>
        )
        : (
          <ol class="leaderboard__list">
            {topScores.map((score, index) => (
              <li
                key={`${score.name}-${score.date}-${index}`}
                class="leaderboard__item"
              >
                <span class="leaderboard__name">{score.name}</span>
                <span class="leaderboard__moves">{score.moves} moves</span>
                <span class="leaderboard__date">
                  {new Date(score.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ol>
        )}
    </details>
  );
}
