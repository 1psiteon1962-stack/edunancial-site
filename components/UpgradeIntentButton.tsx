"use client"

import { recordUpgradeIntent } from "@/lib/upgrade-intent"

type Props = {
  region: string
  level: string
}

export default function UpgradeIntentButton({ region, level }: Props) {
  async function handleClick() {
    const result = await recordUpgradeIntent({
      region,
      level,
      source: "button",
    })

    if (result.success) {
      alert("Upgrade request received")
    } else {
      alert("Something went wrong. Try again.")
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "0.75rem 1.25rem",
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Upgrade
    </button>
  )
}
