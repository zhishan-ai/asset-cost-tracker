# AGENTS.md
- Follow SPEC.md and ARCH.md strictly, especially formulas:
  daysHeld_i = max(1, diffDays(today, purchaseDate_i) + 1)
  dailyCost_i = price_i / daysHeld_i
  totalCost = sum(price_i)
  totalDailyAvg = sum(dailyCost_i)
- Keep dependencies minimal.
- Persist assets in localStorage.
- Implement local-midnight auto refresh.

