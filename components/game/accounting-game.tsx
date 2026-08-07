"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { FallingReceipt } from "./falling-receipt"
import { AccountHints, AccountInput } from "./account-panel"
import { GameStats } from "./game-stats"
import {
  generateTransaction,
  Transaction,
  DIFFICULTY_LEVELS,
  DIFFICULTY_LABELS,
  DifficultySettings,
  SPAWN_LANES,
} from "@/lib/accounting-data"
import {
  HighScoreEntry,
  fetchLeaderboard,
  getBestScore,
  qualifiesForLeaderboard,
  submitHighScore,
} from "@/lib/highscore"
import { pickSpawnLane } from "@/lib/spawn-lanes"

interface FallingTransaction extends Transaction {
  positionY: number
  positionX: number
  lane: number
  isCorrect: boolean | null
  spawnTime: number
}

type GameState = "menu" | "playing" | "paused" | "gameover"

const GAME_HEIGHT = 520
const RECEIPT_HEIGHT = 160
const LANE_BLOCK_Y = RECEIPT_HEIGHT + 40
const MAX_ACTIVE_RECEIPTS = 3

export function AccountingGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [difficulty, setDifficulty] = useState<string>("medium")
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<HighScoreEntry[]>([])
  const [lives, setLives] = useState(4)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showHints, setShowHints] = useState(true)
  const [playerName, setPlayerName] = useState("")
  const [scoreSaved, setScoreSaved] = useState(false)
  const [isSavingScore, setIsSavingScore] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [fallingTransactions, setFallingTransactions] = useState<FallingTransaction[]>([])
  const [inputValue, setInputValue] = useState("")
  const [focusToken, setFocusToken] = useState(0)
  const [lastResult, setLastResult] = useState<{
    correct: boolean
    account: string
    expected: string
    pointsEarned?: number
  } | null>(null)

  const gameLoopRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const isFirstFrameRef = useRef<boolean>(true)
  const fallingRef = useRef<FallingTransaction[]>([])

  const highScore = getBestScore(leaderboard)
  const difficultyHighScore = getBestScore(leaderboard, difficulty)

  const getSettings = useCallback((): DifficultySettings => {
    const base = DIFFICULTY_LEVELS[difficulty]
    const levelMultiplier = 1 + (level - 1) * 0.1
    return {
      ...base,
      fallSpeed: base.fallSpeed * levelMultiplier,
      spawnInterval: Math.max(1600, base.spawnInterval / levelMultiplier),
    }
  }, [difficulty, level])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const entries = await fetchLeaderboard()
        if (!cancelled) {
          setLeaderboard(entries)
          setLeaderboardError(null)
        }
      } catch {
        if (!cancelled) {
          setLeaderboard([])
          setLeaderboardError("Kunne ikke laste topplisten")
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    fallingRef.current = fallingTransactions
  }, [fallingTransactions])

  useEffect(() => {
    const newLevel = Math.floor(score / 1000) + 1
    if (newLevel > level) setLevel(newLevel)
  }, [score, level])

  useEffect(() => {
    if (gameState !== "playing") return
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [gameState])

  const spawnTransaction = useCallback(() => {
    const active = fallingRef.current.filter((tx) => tx.isCorrect === null)
    if (active.length >= MAX_ACTIVE_RECEIPTS) return false

    const lane = pickSpawnLane(active, { blockY: LANE_BLOCK_Y })
    if (lane === null) return false

    const tx = generateTransaction()
    const newTx: FallingTransaction = {
      ...tx,
      positionY: -RECEIPT_HEIGHT,
      positionX: SPAWN_LANES[lane],
      lane,
      isCorrect: null,
      spawnTime: Date.now(),
    }
    setFallingTransactions((prev) => [...prev, newTx])
    return true
  }, [])

  useEffect(() => {
    if (gameState !== "playing") {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
      return
    }

    const settings = getSettings()
    const FIXED_TIMESTEP = 16.667
    const MAX_DELTA = 100

    const gameLoop = (timestamp: number) => {
      if (isFirstFrameRef.current) {
        lastTimeRef.current = timestamp
        isFirstFrameRef.current = false
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const rawDelta = timestamp - lastTimeRef.current
      const deltaTime = Math.min(rawDelta, MAX_DELTA)
      lastTimeRef.current = timestamp
      const timeFactor = deltaTime / FIXED_TIMESTEP

      spawnTimerRef.current += deltaTime
      if (spawnTimerRef.current >= settings.spawnInterval) {
        const spawned = spawnTransaction()
        // Hvis banen var blokkert: prøv igjen snart, ikke vent hele intervallet
        spawnTimerRef.current = spawned ? 0 : settings.spawnInterval - 400
      }

      setFallingTransactions((prev) => {
        const updated = prev.map((tx) => ({
          ...tx,
          positionY: tx.positionY + settings.fallSpeed * timeFactor,
        }))

        const stillFalling: FallingTransaction[] = []
        let livesLost = 0

        for (const tx of updated) {
          if (tx.positionY >= GAME_HEIGHT - 20) {
            if (tx.isCorrect === null) livesLost++
            if (tx.positionY < GAME_HEIGHT + 100) {
              stillFalling.push({ ...tx, isCorrect: tx.isCorrect ?? false })
            }
          } else {
            stillFalling.push(tx)
          }
        }

        if (livesLost > 0) {
          setLives((l) => {
            const newLives = l - livesLost
            if (newLives <= 0) setGameState("gameover")
            return Math.max(0, newLives)
          })
          setStreak(0)
        }

        return stillFalling.filter((tx) => tx.positionY < GAME_HEIGHT + 100)
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    lastTimeRef.current = performance.now()
    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [gameState, getSettings, spawnTransaction])

  const handleSubmit = useCallback(() => {
    if (!inputValue || gameState !== "playing") return

    const settings = getSettings()
    const activeTransactions = fallingTransactions
      .filter((tx) => tx.isCorrect === null)
      .sort((a, b) => b.positionY - a.positionY)

    if (activeTransactions.length === 0) return

    const target = activeTransactions[0]
    const isCorrect = inputValue === target.correctAccount

    setFallingTransactions((prev) =>
      prev.map((tx) => (tx.id === target.id ? { ...tx, isCorrect } : tx))
    )

    if (isCorrect) {
      const responseTime = (Date.now() - target.spawnTime) / 1000
      const timeBonus =
        responseTime < settings.bonusTimeThreshold
          ? Math.floor((settings.bonusTimeThreshold - responseTime) * 20)
          : 0
      const streakBonus = streak * 10
      const totalPoints = settings.pointsPerCorrect + timeBonus + streakBonus
      setScore((s) => s + totalPoints)
      setStreak((s) => s + 1)
      setLastResult({
        correct: true,
        account: inputValue,
        expected: target.correctAccount,
        pointsEarned: totalPoints,
      })
    } else {
      setStreak(0)
      setLives((l) => {
        const newLives = l - 1
        if (newLives <= 0) setGameState("gameover")
        return Math.max(0, newLives)
      })
      setLastResult({
        correct: false,
        account: inputValue,
        expected: target.correctAccount,
      })
    }

    setInputValue("")
    setTimeout(() => setLastResult(null), 2000)
  }, [inputValue, fallingTransactions, gameState, streak, getSettings])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setLives(DIFFICULTY_LEVELS[difficulty].lives)
    setStreak(0)
    setLevel(1)
    setTimeElapsed(0)
    setFallingTransactions([])
    setLastResult(null)
    setInputValue("")
    setScoreSaved(false)
    setSaveError(null)
    isFirstFrameRef.current = true
    spawnTimerRef.current = DIFFICULTY_LEVELS[difficulty].spawnInterval - 500
  }

  const togglePause = () => {
    setGameState((prev) => (prev === "playing" ? "paused" : "playing"))
    if (gameState === "paused") isFirstFrameRef.current = true
  }

  const saveScore = async () => {
    if (scoreSaved || isSavingScore || !qualifiesForLeaderboard(leaderboard, score)) return
    const name = playerName.trim() || "Anonym"
    setIsSavingScore(true)
    setSaveError(null)
    try {
      const next = await submitHighScore({
        name: name.slice(0, 16),
        score,
        level,
        difficulty,
      })
      setLeaderboard(next)
      setScoreSaved(true)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Kunne ikke lagre rekorden")
    } finally {
      setIsSavingScore(false)
    }
  }

  const activeTransactionId = fallingTransactions
    .filter((tx) => tx.isCorrect === null)
    .sort((a, b) => b.positionY - a.positionY)[0]?.id

  const activeTransaction =
    fallingTransactions.find((tx) => tx.id === activeTransactionId) ?? null

  const selectAccountCode = (code: string) => {
    setInputValue(code)
    setFocusToken((t) => t + 1)
  }

  const canSaveScore = qualifiesForLeaderboard(leaderboard, score)

  return (
    <div className="game-atmosphere min-h-screen px-4 py-6">
      <div className={`mx-auto ${gameState === "playing" || gameState === "paused" ? "max-w-6xl" : "max-w-4xl"}`}>
        <header className="mb-6 text-center">
          <h1 className="animate-brand-rise font-display text-5xl font-extrabold tracking-tight text-ink md:text-6xl">
            Bilag Blitz
          </h1>
          <p className="animate-brand-rise-delay mt-2 text-ink/60">
            Bokfør bilagene før de treffer den røde linjen
          </p>
        </header>

        {gameState === "menu" && (
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper-bright/90 shadow-[0_24px_60px_rgba(15,31,28,0.12)]">
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 md:p-10">
                <h2 className="font-display text-2xl font-bold text-ink">Klar for bokføring?</h2>

                <ol className="mt-5 space-y-3">
                  <li className="flex gap-3 text-sm text-ink/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-bold text-primary-foreground">
                      1
                    </span>
                    <span>Bilag faller ned fra toppen — se etter det markerte aktive bilaget.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-ink/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-bold text-primary-foreground">
                      2
                    </span>
                    <span>Tast riktig NS 4102-kontokode før det treffer den røde linjen.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-ink/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-bold text-primary-foreground">
                      3
                    </span>
                    <span>Raske svar og lange streaks gir bonus. Feil eller miss = −1 liv.</span>
                  </li>
                </ol>

                <div className="mt-6">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink/45">
                    Vanskelighetsgrad
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(DIFFICULTY_LEVELS).map((levelKey) => (
                      <button
                        key={levelKey}
                        onClick={() => setDifficulty(levelKey)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          difficulty === levelKey
                            ? "bg-moss text-primary-foreground"
                            : "bg-ledger text-ink/70 hover:bg-muted"
                        }`}
                      >
                        {DIFFICULTY_LABELS[levelKey]}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="mt-5 flex items-center gap-2 text-sm text-ink/65">
                  <input
                    type="checkbox"
                    checked={showHints}
                    onChange={(e) => setShowHints(e.target.checked)}
                    className="h-4 w-4 rounded border-ink/30"
                  />
                  Vis kontooversikt under spill (anbefalt for nybegynnere)
                </label>

                <button
                  onClick={startGame}
                  className="animate-pulse-stamp mt-8 w-full rounded-xl bg-moss px-8 py-4 font-display text-xl font-bold text-primary-foreground transition-colors hover:bg-moss-bright md:w-auto"
                >
                  Start spill
                </button>

                {difficultyHighScore > 0 && (
                  <p className="mt-4 text-sm text-ink/55">
                    Rekord på {DIFFICULTY_LABELS[difficulty]}:{" "}
                    <span className="font-mono font-semibold text-stamp">
                      {difficultyHighScore.toLocaleString("nb-NO")}
                    </span>
                  </p>
                )}
              </div>

              <div className="border-t border-ink/8 bg-ink px-6 py-8 text-paper-bright md:border-l md:border-t-0 md:px-8">
                <h3 className="font-display text-lg font-bold">Toppliste</h3>
                <p className="mt-1 text-xs text-paper-bright/45">Delt på tvers av alle spillere</p>

                {leaderboardError ? (
                  <p className="mt-8 text-sm text-danger">{leaderboardError}</p>
                ) : leaderboard.length === 0 ? (
                  <p className="mt-8 text-sm text-paper-bright/50">
                    Ingen rekorder ennå. Vær først ute!
                  </p>
                ) : (
                  <ol className="mt-5 space-y-2">
                    {leaderboard.slice(0, 8).map((entry, index) => (
                      <li
                        key={`${entry.name}-${entry.date}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg bg-paper-bright/5 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            <span className="mr-2 font-mono text-stamp-soft">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {entry.name}
                          </p>
                          <p className="text-[11px] text-paper-bright/40">
                            {DIFFICULTY_LABELS[entry.difficulty] ?? entry.difficulty} · nivå{" "}
                            {entry.level}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono font-semibold text-stamp-soft">
                          {entry.score.toLocaleString("nb-NO")}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        )}

        {(gameState === "playing" || gameState === "paused") && (
          <div className="space-y-3">
            <GameStats
              score={score}
              highScore={Math.max(highScore, score)}
              lives={lives}
              maxLives={DIFFICULTY_LEVELS[difficulty].lives}
              streak={streak}
              level={level}
              timeElapsed={timeElapsed}
            />

            <div className="flex justify-end">
              <button
                onClick={togglePause}
                className="rounded-lg bg-ink/90 px-4 py-2 text-sm text-paper-bright transition-colors hover:bg-ink"
              >
                {gameState === "paused" ? "Fortsett" : "Pause"}
              </button>
            </div>

            <div
              className={`grid gap-3 ${
                showHints ? "md:grid-cols-[1fr_300px] md:items-stretch" : ""
              }`}
            >
              <div className="min-w-0 space-y-3">
                <div
                  className="game-field relative overflow-hidden rounded-2xl border-2 border-ink/15"
                  style={{ height: `${GAME_HEIGHT}px` }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full border-b border-ink"
                        style={{ top: `${(i + 1) * 11}%` }}
                      />
                    ))}
                  </div>

                  {SPAWN_LANES.map((x) => (
                    <div
                      key={x}
                      className="pointer-events-none absolute top-0 bottom-8 w-px bg-ink/10"
                      style={{ left: `${x}%` }}
                    />
                  ))}

                  <div className="absolute bottom-0 left-0 right-0 h-10 border-t-2 border-dashed border-danger bg-danger/15" />

                  {fallingTransactions.map((tx) => (
                    <FallingReceipt
                      key={tx.id}
                      transaction={tx}
                      positionY={tx.positionY}
                      positionX={tx.positionX}
                      isCorrect={tx.isCorrect}
                      isActive={tx.id === activeTransactionId}
                    />
                  ))}

                  {gameState === "paused" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/80">
                      <div className="text-center text-paper-bright">
                        <p className="font-display text-3xl font-bold">Pause</p>
                        <p className="mt-2 text-paper-bright/60">Trykk Fortsett for å spille videre</p>
                      </div>
                    </div>
                  )}
                </div>

                <AccountInput
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                  lastResult={lastResult}
                  focusToken={focusToken}
                  activeHint={
                    activeTransaction
                      ? {
                          description: activeTransaction.description,
                          company: activeTransaction.company,
                        }
                      : null
                  }
                />

                {showHints && (
                  <div className="md:hidden">
                    <AccountHints variant="mobile" onSelectCode={selectAccountCode} />
                  </div>
                )}
              </div>

              {showHints && (
                <div className="hidden md:flex md:min-h-0 md:flex-col">
                  <AccountHints
                    variant="sidebar"
                    className="min-h-full"
                    onSelectCode={selectAccountCode}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="rounded-2xl border border-ink/10 bg-paper-bright p-8 text-center shadow-[0_24px_60px_rgba(15,31,28,0.12)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stamp">Regnskapet er lukket</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-ink">Spill over</h2>
            <p className="mt-2 text-ink/60">Balanse… men ikke på den gode måten.</p>

            <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-xl bg-ledger/70 p-4">
                <p className="text-[11px] uppercase tracking-wider text-ink/45">Poeng</p>
                <p className="font-mono text-2xl font-bold text-stamp">{score.toLocaleString("nb-NO")}</p>
              </div>
              <div className="rounded-xl bg-ledger/70 p-4">
                <p className="text-[11px] uppercase tracking-wider text-ink/45">Nivå</p>
                <p className="font-display text-2xl font-bold text-moss">{level}</p>
              </div>
              <div className="rounded-xl bg-ledger/70 p-4">
                <p className="text-[11px] uppercase tracking-wider text-ink/45">Tid</p>
                <p className="font-mono text-2xl font-bold text-ink">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            {canSaveScore && !scoreSaved && (
              <div className="mx-auto mt-8 max-w-sm rounded-xl border border-stamp/30 bg-stamp/5 p-5">
                <p className="font-display text-lg font-bold text-ink">Ny plassering på topplisten!</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
                    placeholder="Ditt navn"
                    className="flex-1 rounded-lg border border-ink/15 bg-paper-bright px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-stamp"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void saveScore()
                    }}
                    disabled={isSavingScore}
                  />
                  <button
                    onClick={() => void saveScore()}
                    disabled={isSavingScore}
                    className="rounded-lg bg-stamp px-4 py-2 font-semibold text-accent-foreground hover:bg-stamp-soft hover:text-ink disabled:opacity-60"
                  >
                    {isSavingScore ? "Lagrer…" : "Lagre"}
                  </button>
                </div>
                {saveError && <p className="mt-2 text-sm text-danger">{saveError}</p>}
              </div>
            )}

            {scoreSaved && (
              <div className="mx-auto mt-6 max-w-sm rounded-xl bg-moss/10 px-4 py-3 text-moss">
                Rekorden er lagret på den delte topplisten!
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={startGame}
                className="rounded-xl bg-moss px-8 py-3.5 font-display font-bold text-primary-foreground transition-colors hover:bg-moss-bright"
              >
                Spill igjen
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="rounded-xl bg-ledger px-8 py-3.5 font-display font-bold text-ink transition-colors hover:bg-muted"
              >
                Hovedmeny
              </button>
            </div>
          </div>
        )}

        <footer className="mt-8 space-y-1 text-center text-sm text-ink/45">
          <p>Generell nordisk kontoplan basert på NS 4102</p>
          <p>
            <a
              href="https://github.com/KevinJohannesen/bilag-blitz-byra-utgave"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              KevinJohannesen/bilag-blitz-byra-utgave
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
