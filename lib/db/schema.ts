import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const leaderboardScores = pgTable("leaderboard_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  difficulty: text("difficulty").notNull(),
  /** `blitz` (default) eller `daily` — holder daglig board adskilt */
  mode: text("mode").notNull().default("blitz"),
  /** YYYY-MM-DD (Europe/Oslo) for daily; null for vanlig Blitz */
  challengeDate: text("challenge_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
