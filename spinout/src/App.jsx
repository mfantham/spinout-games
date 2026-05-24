import { useEffect, useMemo, useState } from 'react'
import Controls from './components/Controls'
import DialBar from './components/DialBar'
import Leaderboard from './components/Leaderboard'
import { useSpinout } from './hooks/useSpinout'
import { solutionLength } from './utils/grayCode'

const styles = `
  :root {
    color-scheme: dark;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at top, rgba(77, 208, 225, 0.2), transparent 35%),
      linear-gradient(180deg, #090b13 0%, #05060b 100%);
    color: #f7fbff;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: inherit;
  }

  button,
  input {
    font: inherit;
  }

  .app-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
  }

  .app-card {
    width: min(960px, 100%);
    padding: 32px;
    border-radius: 28px;
    background: rgba(10, 13, 24, 0.88);
    border: 1px solid rgba(127, 255, 255, 0.18);
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(18px);
  }

  .app-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .app-header h1 {
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 3.5rem);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7bf3ff;
    text-shadow: 0 0 18px rgba(123, 243, 255, 0.4);
  }

  .app-header p {
    margin: 12px auto 0;
    max-width: 640px;
    color: rgba(230, 244, 255, 0.72);
    line-height: 1.6;
  }

  .status-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 32px;
    margin-bottom: 24px;
    color: #ffc76f;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .status-banner--won {
    color: #7bffbf;
    text-shadow: 0 0 14px rgba(123, 255, 191, 0.35);
  }

  .game-grid {
    display: grid;
    gap: 28px;
  }

  .dial-bar-wrap {
    display: grid;
    gap: 12px;
  }

  .dial-bar {
    position: relative;
    padding: 28px 36px 34px;
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(58, 66, 89, 0.96), rgba(23, 27, 41, 0.96)),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08), transparent 35%, rgba(255, 255, 255, 0.04));
    border: 1px solid rgba(152, 169, 199, 0.22);
    box-shadow:
      inset 0 6px 16px rgba(255, 255, 255, 0.08),
      inset 0 -10px 24px rgba(0, 0, 0, 0.45),
      0 20px 36px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  .dial-bar--won {
    animation: slide-away 1.4s ease-in forwards;
  }

  .dial-bar__rail {
    position: absolute;
    inset: 50% 48px auto;
    height: 24px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(10, 13, 24, 0.9), rgba(56, 66, 92, 0.85));
    box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.06), inset 0 -6px 8px rgba(0, 0, 0, 0.45);
  }

  .dial-bar__slots {
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: clamp(8px, 2vw, 18px);
  }

  .dial-bar__slot {
    display: flex;
    justify-content: center;
  }

  .dial-bar__handle {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 72px;
    border-radius: 999px;
    transform: translateY(-50%);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(58, 68, 90, 0.8));
    box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.08), 0 0 18px rgba(0, 0, 0, 0.3);
  }

  .dial-bar__handle--left {
    left: 16px;
  }

  .dial-bar__handle--right {
    right: 16px;
  }

  .dial-bar__legend {
    display: flex;
    justify-content: space-between;
    padding: 0 14px;
    font-size: 0.88rem;
    color: rgba(233, 245, 255, 0.62);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .dial {
    position: relative;
    width: clamp(58px, 8vw, 76px);
    height: clamp(118px, 16vw, 152px);
    padding: 0;
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 180ms ease;
  }

  .dial--moveable {
    cursor: pointer;
  }

  .dial--moveable:hover {
    transform: translateY(-3px);
  }

  .dial--locked {
    cursor: not-allowed;
  }

  .dial__knob {
    position: relative;
    width: clamp(28px, 4vw, 34px);
    height: clamp(96px, 12vw, 122px);
    border-radius: 999px;
    background:
      linear-gradient(180deg, #f6feff 0%, #80efff 18%, #1a5166 42%, #0d2631 100%);
    box-shadow:
      0 12px 24px rgba(0, 0, 0, 0.45),
      inset 0 2px 4px rgba(255, 255, 255, 0.45),
      inset 0 -10px 12px rgba(0, 0, 0, 0.42);
    transform-origin: center;
    transition:
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 220ms ease,
      filter 220ms ease,
      opacity 220ms ease;
  }

  .dial--horizontal .dial__knob {
    transform: rotate(90deg);
  }

  .dial--locked .dial__knob {
    opacity: 0.5;
    filter: saturate(0.35);
  }

  .dial--hinted .dial__knob {
    box-shadow:
      0 0 0 3px rgba(123, 243, 255, 0.25),
      0 0 26px rgba(123, 243, 255, 0.85),
      inset 0 2px 4px rgba(255, 255, 255, 0.45),
      inset 0 -10px 12px rgba(0, 0, 0, 0.42);
  }

  .dial__stripe {
    position: absolute;
    inset: 12px 9px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(3, 20, 30, 0.16), rgba(1, 10, 14, 0.88));
  }

  .dial__label {
    position: absolute;
    inset: auto 50% 10px auto;
    transform: translateX(50%);
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(4, 10, 16, 0.82);
    color: #dffcff;
    font-size: 0.75rem;
    font-weight: 700;
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.16);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 20px;
    border-radius: 20px;
    background: rgba(7, 10, 19, 0.88);
    border: 1px solid rgba(120, 181, 255, 0.14);
  }

  .controls__counter {
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #cdeaff;
  }

  .controls__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .action-button {
    padding: 12px 18px;
    border-radius: 999px;
    border: 1px solid rgba(123, 243, 255, 0.28);
    background: linear-gradient(180deg, rgba(16, 35, 48, 0.98), rgba(9, 18, 27, 0.98));
    color: #effdff;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
  }

  .action-button:hover:enabled {
    transform: translateY(-1px);
    box-shadow: 0 0 18px rgba(123, 243, 255, 0.25);
  }

  .action-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .action-button--secondary {
    border-color: rgba(255, 199, 111, 0.28);
  }

  .leaderboard {
    padding: 18px 20px;
    border-radius: 20px;
    background: rgba(7, 10, 19, 0.82);
    border: 1px solid rgba(120, 181, 255, 0.14);
  }

  .leaderboard summary {
    cursor: pointer;
    font-weight: 700;
    color: #cdeaff;
  }

  .leaderboard__empty {
    margin: 14px 0 0;
    color: rgba(228, 241, 255, 0.7);
  }

  .leaderboard__list {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    display: grid;
    gap: 10px;
  }

  .leaderboard__item {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) auto auto;
    gap: 12px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
  }

  .leaderboard__name {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .leaderboard__moves,
  .leaderboard__date {
    color: rgba(228, 241, 255, 0.72);
    font-size: 0.94rem;
  }

  @keyframes slide-away {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(120%);
      opacity: 0.15;
    }
  }

  @media (max-width: 760px) {
    .app-card {
      padding: 24px 18px;
    }

    .dial-bar {
      padding: 22px 18px 28px;
    }

    .dial-bar__rail {
      inset-inline: 30px;
    }

    .dial-bar__handle {
      display: none;
    }

    .leaderboard__item {
      grid-template-columns: 1fr;
    }
  }
`

export default function App() {
  const { dials, moveCount, isWon, turn, undo, reset, hint, canUndo } = useSpinout()
  const [hintDial, setHintDial] = useState(null)
  const par = useMemo(() => solutionLength(dials.length), [dials.length])

  useEffect(() => {
    if (isWon) {
      setHintDial(null)
    }
  }, [isWon])

  const handleTurn = (dial) => {
    setHintDial(null)
    turn(dial)
  }

  const handleUndo = () => {
    setHintDial(null)
    undo()
  }

  const handleReset = () => {
    setHintDial(null)
    reset()
  }

  const handleHint = () => {
    setHintDial(hint())
  }

  return (
    <>
      <style>{styles}</style>
      <main className="app-shell">
        <section className="app-card">
          <header className="app-header">
            <h1>Spinout</h1>
            <p>
              Flip the seven dials from right to left. Each turn follows the bar&apos;s locking rule,
              so every move matters.
            </p>
          </header>

          <div className={`status-banner ${isWon ? 'status-banner--won' : ''}`}>
            {isWon
              ? `Solved in ${moveCount} moves${moveCount <= par ? ' — under par!' : ''}`
              : 'Turn every dial horizontal to slide the bar free.'}
          </div>

          <div className="game-grid">
            <DialBar dials={dials} hintDial={hintDial} onTurn={handleTurn} />
            <Controls
              moveCount={moveCount}
              onReset={handleReset}
              onUndo={handleUndo}
              onHint={handleHint}
              canUndo={canUndo}
              isWon={isWon}
            />
            <Leaderboard isWon={isWon} moveCount={moveCount} />
          </div>
        </section>
      </main>
    </>
  )
}
