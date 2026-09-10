Filename: WHITE-L3-008.md
Folder: /white/level-3/
Title: Why Selling Options Flips the Risk Profile Entirely
Meta Description: Learn why selling (writing) an option puts you on the obligation side of the contract, with a very different risk profile than buying one.
SEO Keywords: option writing, selling options, covered call, naked option risk
Slug: white-l3-008-selling-options-risk-profile

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain why selling an option creates an obligation instead of a right
- Explain why an option seller's maximum gain is capped while risk can be much larger
- Distinguish between a covered and an uncovered ("naked") option position

## Core Content

Lesson 5 established that buying an option gives a right, with limited downside (the premium) and larger potential upside. Selling — or "writing" — an option flips this structure entirely: the seller collects the premium upfront but takes on the **obligation** to fulfill the contract if the buyer chooses to exercise it.

Here's the "why" this reverses the risk profile: the seller's maximum gain is capped at the premium collected — that's the most they can ever make on the position. But their potential loss, especially for a seller who doesn't already own the underlying asset (a "naked" or uncovered position), can be much larger, since the underlying price can move significantly against them and they're still obligated to fulfill the contract.

[VERIFIED FACT] A **covered call** — selling a call option on a stock the seller already owns — limits the practical risk of that specific position, since if the buyer exercises, the seller simply delivers stock they already hold, rather than needing to buy it at a potentially much higher market price. Selling options without already owning the underlying asset ("naked" selling) carries meaningfully more risk and is generally considered an advanced strategy.

## Worked Example

[ILLUSTRATIVE EXAMPLE] An investor sells a covered call on a stock she already owns, currently trading at $50, with a strike price of $55, collecting a $2 premium. If the stock stays below $55, the option expires worthless, and she keeps the $2 premium as pure profit, in addition to still owning her stock. If the stock rises to $70, the buyer exercises the option, and she's obligated to sell her shares at $55 — missing out on the additional gain above $55, but her risk was limited since she already owned the shares being sold. Compare this to a naked call seller with no underlying shares: at $70, they'd be obligated to buy shares at the current market price just to deliver them at $55, a potentially large loss with no cap in principle.

## Practice Quiz

1. How does the risk profile of selling an option differ from buying one?
2. What is a covered call, and why does it limit practical risk compared to a naked call?
3. What is the maximum possible gain for an option seller?

## Answer Key

1. Selling an option creates an obligation to fulfill the contract if exercised, with a capped maximum gain (the premium) but potentially much larger risk — the reverse of a buyer's limited downside and larger potential upside.
2. A covered call sells a call option on stock the seller already owns; it limits risk because if exercised, the seller delivers shares they already hold rather than needing to buy them at a potentially much higher market price.
3. The premium collected when the option was sold — that's the maximum possible profit on the position, regardless of how favorably the underlying moves for the seller.

## Answers and Explanations

1. This is the central reversal-of-risk-profile concept the lesson is built around.
2. This distinguishes the two selling approaches and explains why "covered" specifically reduces practical risk.
3. This reinforces the capped-gain side of the seller's asymmetric risk profile.

## Key Takeaways
- Selling an option creates an obligation, not a right, with a capped maximum gain (the premium) and potentially much larger risk.
- A covered call, sold against stock already owned, limits practical risk compared to a naked (uncovered) option.
- Naked option selling carries meaningfully more risk and is generally considered an advanced strategy.

## Educational Disclaimer
This lesson is for general financial education only and does not constitute personalized financial, investment, tax, or legal advice. Options trading carries significant risk and is not suitable for all investors. Consult a licensed financial professional before trading options.
