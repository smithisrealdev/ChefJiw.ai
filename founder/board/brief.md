# Board brief: ChefJiw.ai

This brief stands alone. It is everything the founder has told us, plus what
exists in the product today.

- What it is: a mobile app where an AI cooking coach, Chef Elephant, walks a home
  cook through a Thai dish one step at a time in a full-screen cook mode (what to
  do now, heat level, timers, big buttons for messy hands, answers to questions
  asked mid-step), plus dish ideas from the ingredients already in the kitchen and
  an ingredient price check that updates daily.
- Who it is for: Thai-speaking home cooks making everyday Thai dishes at home
  (Thai is the default language and THB the default currency). English, Japan
  (JPY) and the US (USD) are also supported for cooks abroad. The founder has not
  yet named one target segment in writing.
- What it sells, at what price: freemium. Free: every recipe and the cook mode,
  plus 3 AI uses a day. Member: unlimited AI questions. Planned price about 99 THB
  (~US$3) a month, picked from an example range; the paywall still shows
  placeholders and in-app purchase is not connected.
- Where and how: iOS and Android app (Expo), Supabase backend, AI models through
  OpenRouter. Not yet in the app stores; acquisition channel not chosen.
- Budget and constraints: not stated. Two of the six dishes listed are complete
  recipes; neither has been test-cooked yet.

## What exists today

A working app (not yet released), in Thai and English, light and dark mode.

- **First run:** a short onboarding (language and country; the country sets the
  currency and suggested dishes), then the home screen with a "pick up where you
  left off" card.
- **Recipes:** six Thai dishes listed (basil pork with fried egg, Thai pork
  omelet, egg fried rice, stir-fried morning glory, tom yum, green curry). Two are
  complete: basil pork with egg and pork omelet. The other four show "coming
  soon". Filters for time, cost and calories, all labelled as sample values.
- **Recipe page:** choose options (for example spice level), let the chef adapt
  the recipe (less salt, swap the pork), and see each ingredient with a one-line
  reason for the amount, plus what to buy at sample prices.
- **Cook mode:** one step per screen with what to do, what to look for, what the
  step did, heat level and a timer that keeps running with a notification. The
  screen stays awake. "Ask the chef" shows the questions people often ask at that
  step, a typed question box (AI) and a kitchen-emergency section (fire, burns).
  Leaving mid-recipe saves the step.
- **After cooking:** a taster mouse mascot asks how it came out and gives a score.
- **What do I have?** On the recipes tab, the cook taps the ingredients they have
  and the six dishes are sorted by fit; an AI button suggests other dishes from
  the same ingredients.
- **Market prices:** a list of everyday ingredients for the chosen country
  (Thailand, Japan or the US) with prices in local currency, a running cart total,
  and a "check prices" button. A daily job searches the web with AI and stores
  prices with their source.
- **Account:** sign in with Google or Apple (LINE is planned but not working).
  The free AI allowance (3 a day, shared between typed questions and dish ideas)
  is counted on the server. The membership screen exists; payment is not built.

## Measured costs (tests, not production)

The founder chose the AI models after a blind comparison of six models on the
app's own prompts:

- Typed questions to the chef: GPT-6 Luna. Measured US$0.00004 to 0.00009 per
  answer over five test questions, about US$0.00006 on average.
- Dish ideas from ingredients: Claude Haiku 5.5. About US$0.00016 per request
  (one test).
- Daily price job (web search, three countries): Claude Sonnet 5.5. Cost per run
  not measured yet.

These are small test samples. Store fees, hosting, and the cost of winning a user
are not measured.

## History: an earlier board review of the idea

Before any code existed, a board using the same three lenses reviewed the idea as
first pitched: four products (meal planner, live cooking coach, restaurant
back-of-house tools, Thai chef persona) for four customer groups (busy Thai home
cooks, Thai-food fans abroad, small Thai restaurants, diet-focused users). It
voted 3 PASS, average 2.3 / 10. Its conditions for a fresh vote:

- Pick one segment and one product and park the rest.
- Say it in one sentence for one customer and walk through the first five minutes.
- Choose the platform that fits that moment.
- Set a price tied to the result for that buyer.
- Show the price covers AI cost per active user and what it costs to win a user.
- Map who already serves that buyer and at what price.
- Name the secret or data advantage a general AI assistant lacks.
- Build an offer and guarantee around one measurable result.
- Show a tested channel to the first 100 customers and the cost of each.
- Get early proof from a handful of real buyers.

Since then: restaurant tools and diet tracking were not built; the product is a
consumer mobile cooking coach. After that review the founder also asked for dish
ideas from ingredients on hand, the price check with daily updates, and support
for several countries with flags and local currency.

## Not yet known

Team, budget, timeline, market size, competitors, cost to win a user, retention,
the final price, and whether the recipes work when cooked. Treat these as open
questions; do not invent figures.
