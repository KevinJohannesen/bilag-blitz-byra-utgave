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
  getNearMissTip,
  getSoftHint,
  getTemplatesForDifficulty,
  tierAllows,
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
  it("maps every template to an existing account with valid tier and explain", () => {
    const codes = new Set(ACCOUNTS.map((a) => a.code))
    const descriptions = new Set<string>()
    for (const template of TRANSACTION_TEMPLATES) {
      expect(codes.has(template.correctAccount)).toBe(true)
      expect(template.amount.max).toBeGreaterThan(template.amount.min)
      expect(["easy", "medium", "hard", "expert"]).toContain(template.tier)
      expect(template.explain.length).toBeGreaterThan(10)
      expect(template.explain.length).toBeLessThanOrEqual(140)
      expect(template.keywords.length).toBeGreaterThan(0)
      expect(descriptions.has(template.description)).toBe(false)
      descriptions.add(template.description)
    }
  })

  it("has a broad byrå curriculum (45+ templates)", () => {
    expect(TRANSACTION_TEMPLATES.length).toBeGreaterThanOrEqual(45)
  })

  it("includes key NS 4102 coverage accounts", () => {
    const used = new Set(TRANSACTION_TEMPLATES.map((t) => t.correctAccount))
    for (const code of ["1400", "1700", "2740", "2900", "6340", "7300", "7360", "8050", "8150"]) {
      expect(used.has(code)).toBe(true)
    }
  })
})

describe("tier filtering", () => {
  it("easy ⊂ medium ⊂ hard ⊂ expert", () => {
    expect(tierAllows("easy", "easy")).toBe(true)
    expect(tierAllows("medium", "easy")).toBe(false)
    expect(tierAllows("easy", "expert")).toBe(true)
    expect(tierAllows("expert", "hard")).toBe(false)

    const easy = getTemplatesForDifficulty("easy")
    const expert = getTemplatesForDifficulty("expert")
    expect(easy.every((t) => t.tier === "easy")).toBe(true)
    expect(expert.length).toBe(TRANSACTION_TEMPLATES.length)
    expect(easy.length).toBeLessThan(expert.length)
  })
})

describe("DIFFICULTY_LEVELS", () => {
  it("matches label keys and has sensible progression", () => {
    expect(Object.keys(DIFFICULTY_LEVELS).sort()).toEqual(Object.keys(DIFFICULTY_LABELS).sort())
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
    const name = generateCompanyName("handel")
    expect(name.length).toBeGreaterThan(3)
    expect(name).toMatch(/AS$/)
  })

  it("generateTransaction respects difficulty tier", () => {
    for (let i = 0; i < 20; i++) {
      const tx = generateTransaction("easy")
      const template = TRANSACTION_TEMPLATES.find((t) => t.description === tx.description)
      expect(template?.tier).toBe("easy")
      expect(tx.explain).toBeTruthy()
    }
  })

  it("generateTransaction returns a valid bilag", () => {
    const tx = generateTransaction("medium")
    expect(tx.id).toBeTruthy()
    expect(ACCOUNTS.some((a) => a.code === tx.correctAccount)).toBe(true)
    expect(tx.amount).toBeGreaterThan(0)
    expect(tx.accountName).toBeTruthy()
  })

  it("getAccountHint returns empty for unknown codes", () => {
    expect(getAccountHint("9999")).toBe("")
    expect(getAccountHint("1920")).toContain(":")
  })

  it("getSoftHint includes category without revealing the code", () => {
    const hint = getSoftHint({ correctAccount: "1920", keywords: ["bank"] })
    expect(hint).toContain("Tips:")
    expect(hint).not.toContain("1920")
  })

  it("getNearMissTip fires for same class only", () => {
    expect(getNearMissTip("2701", "2711")).toMatch(/MVA/i)
    expect(getNearMissTip("6300", "1920")).toBeNull()
    expect(getNearMissTip("1920", "1920")).toBeNull()
  })
})
