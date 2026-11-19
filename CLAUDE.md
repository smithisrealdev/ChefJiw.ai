# ChefJiw.ai — project handoff

Cute cooking-guide app for beginner home cooks (Thai UI). Used for real at the stove, not a game.
This file is the context for continuing the work in Claude Code. Written 2026-11-19.

## What exists

| Thing | Where |
| --- | --- |
| Clickable prototype (8 artboards) | https://claude.ai/artifact/DpUsQRt6cdgEG5x9NUSoan — sources in `prototype/` |
| AI spec v1 | https://claude.ai/artifact/TRxENYTNwTF4WpYc5wjU1W |
| UX/UI implementation plan | https://claude.ai/artifact/AKkTn8g2vrbPT33NrytsMk |
| Recipe + stove Q&A sheet | https://claude.ai/artifact/DB6t6Qur6gDokTSBZuFyQt — exported to `content/*.json` |

## Folder map

- `prototype/screens/*.dc.html` — built prototype screens (Claude Design canvas format, not app code).
- `prototype/scripts/` — Python generators for those screens. `build.sh` = `make2.py` → `retone.py` → `appify.py`.
  Paths inside were rewritten from the original sandbox and have NOT been re-run here; expect to fix paths before building.
  Files named `*_backup*` and `cookstage`/`cookstage2-4` are older iterations; current cook logic is `cookstage5.js` + `cookstage4.py` + `cook.py`.
- `prototype/tools/` — `render.js` (static render of a screen state), `play3.js` (replays both playable recipes end to end).
- `content/recipes.json` — 10 written recipes (overview, ingredients with reasons, steps). Kaprao and omelet live in `prototype/scripts/cookstage5.js` instead.
- `content/stove_faq.json` — 303 prepared stove-side Q&A, ids like `KP-pork-2` (matches the `faq` table in the AI spec).
- `content/menu_catalog.json` — 42 menus from 16 countries, 12 written, 30 not yet.
- `content/*.py` — the source the JSON was generated from.

## Decisions already made

- Mascots: periwinkle elephant (head chef), chubby chick "นักชิมเจี๊ยบ" (taster), capybara (market prices), frog (calorie coach). Chubby look, each doing its own job on the home screen; no scheduled hopping.
- Look: bright flat pastel, white cards, ink `#24212B`. Tokens are in the UX/UI plan. Fonts: Mali + IBM Plex Sans Thai Looped.
- Never reproduce another app's characters, art or name; own characters only.
- Cook screen is real mode: real timers, per-step "watch for" and "what you gain", self-reported tasting → chick's score.
- AI in v1: ask-the-chef, recipe adapting, dishes from what you have. Three tiers: prepared → cache → model. Prepared answers are free and unlimited.
- Freemium subscription. Defaults pending confirmation: 3 typed questions/day and 1 free-text adaptation/day free; fridge photo deferred to v1.1.

## Open decisions (owner: Smith)

- App stack (proposal: React Native + Expo). Server stack and database.
- Mascot animation tooling for the real app.
- New menus: kitchen-scene cook screen vs. plain step cards (proposal: step cards as base, scene as an optional layer).
- Membership price. Remove the "coming soon" community tab. No dark mode in v1.

## Not verified — do not treat as done

- Every recipe and every Q&A row is status "untested": nothing has been cooked on a real stove.
- Step times in the 10 new recipes, calorie numbers for kaprao, and scoring weights are estimates.
- Safety rows were checked against US/UK sources only; gas-leak, cracked-egg, knife and board rows, and the 199 fire number, are unchecked against Thai official sources.
- AI in the prototype is canned; no model has been called. Token counts in the AI spec are estimates.
- Prototype was only checked via still renders and scripted logic, never real motion or on a phone.
