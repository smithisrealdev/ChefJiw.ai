# Launch plan: ChefJiw

Dates assume today is Thursday 19 November 2026 and the earliest realistic
launch, since no target date was given. Change the target and the weeks shift
with it. Inputs: `founder/offer.md` (offer v3 and three panel runs),
`founder/board.md`, `founder/idea.md`. Not run yet: `/founder-cfo`,
`/founder-marketing`, `/founder-brand`, `/founder-ops`, so costs, channels, the
brand kit and permits below are marked as open.

## Step 1: test before you spend

The panel's answer, three times, was 0 of 20 buy. Under offer v3, 14 of 20 said
"I would pay 99 baht if the free part proves it": the free green curry beats a
video, or a free Sunday plan feeds them for less than street food. A simulated
panel cannot cook, so real cooks have to answer that. The test is a kitchen test
plus a pre-sale, run before writing the 12 paid dishes or building in-app
purchase.

**The test (two weeks of cooking, one week of selling):**

1. **Kitchen test.** 8 home cooks from the target segment (Thai home cooks in
   Thailand, 20 to 45) cook at home with the app: the free green curry on a
   weekday evening, then one free Sunday cook-ahead plan (three dishes that keep,
   one shopping list) on a Sunday. The founder watches over a video call or in
   person, and notes where each cook stopped, what they asked and how long it took.
2. **Pre-sale.** At the end, each cook is offered the 12-dish pack at 99 baht as a
   refundable pre-order with a stated delivery date. Paid by PromptPay, recorded
   in a form.
3. **Waitlist page.** The v3 pitch on one page with two buttons, "Join the
   waitlist" and "Pre-order for 99 baht", shared in three Thai home-cooking groups
   (Facebook or LINE OpenChat). 14 days.

**Success lines, written before running** (proposed; adjust before you start,
never after):

| Test | Pass if |
|---|---|
| Green curry | 6 of 8 finish without outside help; average taster score 4 or more out of 5; 5 of 8 say it beat how they usually learn a dish |
| Sunday plan | 5 of 8 cook it; for 4 of them the recorded cost per meal is under 50 baht and the food lasts to midweek |
| Pre-sale to testers | 3 of 8 pre-pay 99 baht |
| Waitlist page | 100 sign-ups and 10 paid pre-orders in 14 days |

**How to read it.** If real cooks pass, trust them over the panel and build the
pack. If they finish the dishes but don't pay, go back to `/founder-offer` or
`/founder-pricing`. If they don't finish the dishes, fix the recipes and the cook
mode first: no offer survives a dish that fails.

**Rules for the test.** Pre-orders are refundable and say when the pack will be
delivered. The waitlist form asks for consent to contact (Thailand's PDPA). No
quotes from testers are used as testimonials without written permission. Not
legal advice.

## Step 2: the countdown

Owners: **Founder** (recipes, recruiting, selling, money) and **Developer** (app
changes). ★ marks the critical path: if it slips, launch day slips.

**Week 1, Fri 20 - Sun 29 Nov: prepare the test**
- ★ Founder: write and cook the green curry and one Sunday plan (three dishes
  that keep) yourself, twice each, fixing amounts and times. Deadline Thu 26 Nov.
- ★ Founder: recruit 8 cooks and book their two cooking slots. Deadline Sun 29 Nov.
- Founder: set up PromptPay pre-order, the form and the refund promise. Sun 29 Nov.
- Developer: add the green curry and the Sunday plan to the app (cost per meal
  next to a 50-baht plate), free in beta. Deadline Fri 27 Nov. **Done 19 Nov**
  (recipes still untested).
- Developer: log, per tester, which dish they finished and their taster score, so
  the results don't depend on memory. Deadline Fri 27 Nov. **Done 19 Nov**.
- Developer: a test build the 8 cooks can install. Needs the founder's Expo
  account for an EAS build. Deadline Sun 29 Nov.
- Founder or Developer: the one-page waitlist. Deadline Sun 29 Nov.

**Week 2, Mon 30 Nov - Sun 6 Dec: cook**
- ★ Founder: 8 green curry sessions (weekday evenings), 8 Sunday plans (Sun 6 Dec).
- Founder: share the waitlist page in three cooking groups (Mon 30 Nov).
- Developer: fix whatever breaks during sessions within a day.

**Week 3, Mon 7 - Sun 13 Dec: sell and fix**
- ★ Founder: pre-sale offer to the 8 cooks (Mon 7 Dec); waitlist closes Sun 13 Dec.
- Founder and Developer: fix the steps where cooks got stuck.

**Decision gate, Mon 14 Dec:** compare the results with the success lines.
Pass: start the build below. Fail: back to `/founder-offer` or `/founder-pricing`,
and refund any pre-orders if the pack is not going ahead.

**If the test passes: build, Mon 14 Dec 2026 - Fri 29 Jan 2027**
- ★ Founder: develop and test-cook the 12 pack dishes, each cooked by home cooks
  other than the founder before it is published. At about two dishes a week this
  is six weeks and the longest task in the plan. Consider a paid recipe developer.
- ★ Developer: one-time in-app purchase for the pack (App Store and Google Play),
  restore purchase, and receipt checks on the server. Deadline Fri 15 Jan.
- Developer: the "It didn't work" button and the one-pan label. Fri 15 Jan.
- Founder: store listings, screenshots, privacy policy, support email. Fri 22 Jan.
- ★ Developer: submit to both stores by Fri 29 Jan; review can take a week or more.
- Founder: turn off beta mode for launch (three steps in the README). Fri 29 Jan.
- Open, waiting on other skills: legal and money (registration, a bank account for
  store payouts, tax) from `/founder-ops`; channel calendar from
  `/founder-marketing`; name and look from `/founder-brand`.

**Soft launch, Sat 6 Feb 2027:** the 8 testers and the waitlist only, with the
pre-orders fulfilled first.

**Public launch, Sat 13 Feb 2027.**

## Step 3: launch day (Sat 13 Feb 2027)

Thai home cooks cook in the evening, so the day is built around dinner.

| Time | Who | What |
|---|---|---|
| 08:00 | Developer | Check both store listings are live; buy the pack once on each store; ask the chef one question |
| 09:00 | Founder | Email or message the waitlist: the pack is live, pre-orders already delivered |
| 10:00 | Founder | Post in the three cooking groups, with a video of the green curry being cooked from the app |
| 12:00 | Founder | Answer every comment and message |
| 16:00 | Founder | Second post: tonight's free green curry, with the shopping list |
| 17:00 - 20:00 | Developer | Watch errors, AI failures and purchase failures live while people cook |
| 21:00 | Both | Count installs, finished dishes, taster scores and pack purchases; note what broke |

**If something breaks:**
- AI answers fail: OpenRouter switches to the fallback model; if both fail, the
  prepared answers at each step still work. Post a note if it lasts over 30 minutes.
- A purchase fails: give the pack by hand to anyone who paid; refund on request.
- A dish step is wrong ("It didn't work" taps cluster on one step): fix the step
  the same evening and reply to the people who tapped it.
- The app crashes on a device: pull the post from the groups until it's fixed.

## Step 4: the first 30 days

Track weekly. Each line has the level that triggers a change.

| Number | Where it comes from | Change something if |
|---|---|---|
| Installs | App Store and Google Play | Under 200 a week by day 14: the channel isn't working, go to `/founder-marketing` |
| Share of new users who finish the free green curry | app log | Under 40%: fix onboarding and the recipe before spending on reach |
| Average taster score | app log | Under 4 out of 5 on any dish: re-test that dish with a home cook |
| "It didn't work" taps per dish | app log | Over 1 in 10 cooks on a step: rewrite that step |
| Pack purchases / users who finished the free curry | stores and app log | Under 5%: back to `/founder-offer` or `/founder-pricing` |
| AI cost per day | OpenRouter | Over 10% of pack revenue: review the models and the free limit |
| Users back in week 2 | app log | Under 20%: the Sunday plan isn't bringing people back |

The app log does not exist yet: it is the Developer's week-1 task and has to be
built before the test, not after launch.

**Reviews:**
- **Day 7:** Did people who installed actually cook? Which step stops them? Is any
  dish failing?
- **Day 14:** Is a channel bringing cooks in at a cost the pack can pay for (once
  `/founder-cfo` has run)? Do buyers come from the free curry or the Sunday plan?
- **Day 30:** Do pack buyers come back for a second dish? Is there demand for the
  next pack? Keep, change or stop.

## Next

`/founder-plan` compiles everything into one business plan once
`/founder-cfo`, `/founder-marketing`, `/founder-brand` and `/founder-ops` have run.
The first thing that unblocks the test is the Developer's week-1 work: the green
curry and the Sunday plan in the app, and the test log.
