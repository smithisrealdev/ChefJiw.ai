# Offer: ChefJiw membership

Method: the Offers lens (a summary of the framework in *$100M Offers*; not the
author's words). Inputs: `founder/panel/results.md` (20 of 20 simulated buyers
passed), `founder/board.md`, `founder/idea.md`. There is no `founder/numbers.json`
yet, so cost to deliver is scored 1 to 5 by judgement, not from CFO figures.
Run `/founder-cfo` before promising any of it.

## What the panel said about the old offer

The old membership sold "unlimited typed questions, 99 baht a month". Every buyer
passed for the same reason (need): they already cook both dishes, and 3 free
questions a day is more than they would use. 18 of 20 said more dishes they
cannot cook yet would change their mind.

## The problem list (in the buyer's words)

Before buying
1. "I already cook both dishes from memory."
2. "3 free questions a day is more than I'd ever use, so what am I paying for?"
3. "Free clips on YouTube or TikTok already show me the dish."
4. "My mum answers on LINE for free."
5. "A free AI chat app already answers cooking questions."
6. "99 baht is two plates from the stall."
7. "I don't want another monthly subscription."
8. "Will the dish actually come out right?"
9. "Only two dishes. I'd run out after two dinners."
10. "I'd try it once and delete it."

While cooking
11. "My kitchen is tiny and I have one pan."
12. "Typing with oily hands is annoying."
13. "I cook once a week, on Sunday, and a fried egg doesn't keep."
14. "I need to know what to buy and what it will cost."
15. "Cooking at home has to beat a 50-baht plate, or why bother?"
16. "I cook to control oil, salt and calories."
17. "The hard dishes, like curry or tom yum, are where a clip fails me."

After
18. "What if I pay and the dish comes out wrong?"
19. "Will there be anything new next month?"
20. "I'd be paying in weeks I don't cook."

## Solutions, scored

Value to the buyer and cost to deliver, 1 (low) to 5 (high).

| # | Solution | Answers | Value | Cost | Keep? |
|---|---|---|---:|---:|---|
| A | Member dishes most home cooks can't make from memory: 12 tested dishes at launch, then one new dish every week | 1, 9, 10, 17, 19 | 5 | 4 | Core |
| B | Every dish cooked by home cooks before it is published; an "It didn't work" button that walks the cook through the failed step with the chef | 8, 18, 3, 5 | 5 | 3 | Core |
| C | First month free, cancel any time in the app store | 6, 7, 18, 20 | 4 | 1 | Guarantee |
| D | Most dishes need one pan; a one-pan label on each | 11 | 4 | 1 | Core |
| E | A Sunday cook-ahead plan each month: three dishes that keep all week, one shopping list | 13, 15 | 4 | 3 | Bonus |
| F | A shopping list for every dish with its estimated cost, next to what the same dish costs to buy ready-made | 14, 15, 6 | 4 | 2 | Bonus |
| G | Unlimited typed questions (kept, but no longer the headline) | 2 | 2 | 1 | Keep, small |
| H | Ask the chef out loud instead of typing | 12 | 3 | 5 | Cut for now: not built, high cost |
| I | Calories, oil and salt per serving | 16 | 3 | 3 | Later: needs checked nutrition data |
| J | A note when the week's new dish is out | 10, 19 | 3 | 1 | Keep, small |

The main cost is content: developing and test-cooking 12 dishes before launch and
one a week after. AI cost per answer is small (measured about US$0.00006), so G
and B's chat costs are not the constraint.

## The stack

- **Name: "A new dish every week" (เมนูใหม่ทุกสัปดาห์).**
- **Core:** cook a Thai dish you could not make before, every week, coached step by
  step until it comes out right. 12 dishes at launch, one new each week, most in one
  pan, every one cooked by home cooks before it goes live, with an "It didn't work"
  button.
- **Bonus 1, the Sunday cook-ahead plan:** three dishes a month that keep all week,
  with one shopping list. Kills "I cook once a week".
- **Bonus 2, the shopping list with costs:** what to buy and what it costs, next to
  the price of buying the same dish. Kills "a plate is cheaper".
- **Guarantee:** first month free, cancel any time. The cost is the first month's
  revenue for trial users, nothing out of pocket beyond AI use. The claim rate is
  unknown until real users try it.
- **Urgency:** none added. A launch-month offer is possible only if the founder
  decides on one; no fake countdowns or "only 3 left".
- **Price for the re-test:** kept at 99 baht a month, so the re-test measures the
  offer, not a price cut. Setting the price is `/founder-pricing`'s job.

## Value equation, before and after (1 to 10, judgement)

| Element | Before | After | What moves it |
|---|---:|---:|---|
| Dream outcome | 2 | 6 | A: new dishes the cook can't make yet, instead of more questions |
| Perceived likelihood | 3 | 6 | B: tested by home cooks plus the "It didn't work" fix; C lowers the risk of trying |
| Time to the result | 7 | 7 | Unchanged: a dish in one evening |
| Effort and sacrifice | 7 | 8 | D one pan, F shopping list, E one shop for the week |

## What has to be true before this can be sold

- 12 dishes developed and cooked by home cooks other than the founder, before launch.
- A way to produce one tested dish a week after launch (the founder's time, or a
  paid recipe developer). This is the biggest cost and commitment in the offer.
- In-app purchase with a free first month, through the app stores.
- The "It didn't work" button and the one-pan label (small app changes).
- Shopping-list prices: the daily price job is paused in beta, so either restart it
  or use checked estimates.

## Re-test

Same 20 buyer cards (seed 812619), new pitch in `founder/pitch.md` (the old one is
`founder/pitch-v1.md`), answers in `founder/panel-v2/`. Results below once the
panel has run.
