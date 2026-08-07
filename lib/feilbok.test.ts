/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest"

import { clearFeilbok, loadFeilbok, saveFeilbok, type FeilbokEntry } from "@/lib/feilbok"

describe("feilbok session storage", () => {
  beforeEach(() => {
    clearFeilbok()
  })

  it("round-trips entries", () => {
    const entries: FeilbokEntry[] = [
      {
        description: "Husleie for kontorlokaler",
        yourAnswer: "2400",
        correctAccount: "6300",
        accountName: "Leie lokaler",
        reason: "wrong",
        explain: "Leie kostnadsføres på leiekonto.",
      },
    ]
    saveFeilbok(entries)
    expect(loadFeilbok()).toEqual(entries)
  })

  it("returns empty for corrupt data", () => {
    sessionStorage.setItem("bilag-blitz-feilbok", "{not-json")
    expect(loadFeilbok()).toEqual([])
  })
})
