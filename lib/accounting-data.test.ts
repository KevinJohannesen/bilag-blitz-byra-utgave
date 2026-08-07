import { describe, expect, it } from "vitest"

import {
  ACCOUNTS,
  DIFFICULTY_LABELS,
  DIFFICULTY_LEVELS,
  SPAWN_LANES,
  TRANSACTION_TEMPLATES,
  generateCompanyName,
  generateTransaction,
  getAccountHint,
} from "@/lib/accounting-data"

describe("ACCOUNTS", () => {
  it("has unique four-digit codes", () => {
    const codes = ACCOUNTS.map((a) => a.code)
    expect(new Set(codes).size).toBe(codes.length)
    for (const code of codes) {
      expect(code).toMatch(/^\d{4}$/)
    }
  })
})

describe("TRANSACTION_TEMPLATES", () => {
  it("maps every template to an existing account", () => {
    const codes = new Set(ACCOUNTS.map((a) => a.code))
    for (const template of TRANSACTION_TEMPLATES) {
      expect(codes.has(template.correctAccount)).toBe(true)
      expect(template.amount.max).toBeGreaterThan(template.amount.min)
    }
  })
})

describe("DIFFICULTY_LEVELS", () => {
  it("matches label keys and has sensible progression", () => {
    expect(Object.keys(DIFFICULTY_LEVELS).sort()).toEqual(
      Object.keys(DIFFICULTY_LABELS).sort()
    )
    expect(DIFFICULTY_LEVELS.easy.lives).toBeGreaterThan(DIFFICULTY_LEVELS.expert.lives)
    expect(DIFFICULTY_LEVELS.easy.fallSpeed).toBeLessThan(DIFFICULTY_LEVELS.expert.fallSpeed)
  })
})

describe("SPAWN_LANES", () => {
  it("has three distinct percentages", () => {
    expect(SPAWN_LANES).toHaveLength(3)
    expect(new Set(SPAWN_LANES).size).toBe(3)
  })
})

describe("generators", () => {
  it("generateCompanyName returns a Nordic-style name", () => {
    const name = generateCompanyName()
    expect(name.length).toBeGreaterThan(3)
    expect(name).toMatch(/AS$/)
  })

  it("generateTransaction returns a valid bilag", () => {
    const tx = generateTransaction()
    expect(tx.id).toBeTruthy()
    expect(ACCOUNTS.some((a) => a.code === tx.correctAccount)).toBe(true)
    expect(tx.amount).toBeGreaterThan(0)
    expect(tx.accountName).toBeTruthy()
  })

  it("getAccountHint returns empty for unknown codes", () => {
    expect(getAccountHint("9999")).toBe("")
    expect(getAccountHint("1920")).toContain(":")
  })
})
