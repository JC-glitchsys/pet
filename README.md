# GitHub Pet

A living pixel pet for your GitHub profile README. It grows from your **real contribution data**,
gets hungry when you skip a day, and turns into a ghost if you vanish.

```md
[![My GitHub Pet](https://YOUR-APP.vercel.app/api/pet?username=YOUR_USERNAME&pet=cat&tz=8)](https://YOUR-APP.vercel.app/dashboard?u=YOUR_USERNAME)
```

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · GitHub GraphQL API · Vercel Edge Functions

## Run locally
```bash
npm install
cp .env.example .env.local   # add GITHUB_TOKEN (no token = demo data)
npm run dev                  # http://localhost:3000
```
Preview any state without GitHub:
`/api/pet?username=demo&pet=dragon&scenario=legend`
Scenarios: `happy beast perfect legend hungry sad protected ghost egg`

## Deploy to Vercel
1. Push this folder to a new GitHub repo.
2. Go to vercel.com/new, import the repo (framework: Next.js, no config needed).
3. Environment Variables: add `GITHUB_TOKEN` and `NEXT_PUBLIC_SITE_URL` (your final URL, e.g. `https://my-pet.vercel.app`).
4. Deploy. Open `https://<your-app>.vercel.app/api/pet?username=<you>` to confirm the card renders.
5. Redeploy once if you changed `NEXT_PUBLIC_SITE_URL` after the first build.

### Creating the token
github.com/settings/tokens. A classic token with **no scopes** is enough for public data.
Fine-grained: "Public repositories (read-only)". To count private contributions, turn on
"Include private contributions on my profile" in your GitHub profile settings.

## Add it to your README
1. Open your profile repo (the repo named exactly like your username).
2. Paste the snippet from the dashboard (or the one above) into `README.md`, then commit.
3. GitHub proxies images, so updates can take up to ~15-60 minutes to show.

Query params: `username` (required), `pet` = cat | dog | axolotl | dragon | capybara, `tz` = your UTC offset in hours (default 8).

## Game rules
- **Stage** by streak: 0 Egg · 3 Baby · 7 Teen · 30 Adult · 100 Legendary (shiny + crown + glow).
- **HP** from active days in the last 30: 25+ = 100%, 15-24 = 70%, 7-14 = 40%, 1-6 = 15%, 0 = ghost.
- **Monthly XP**: 10 per contribution + 50 per active day. 25+ active days = Monthly Beast badge and +1 stage boost.
- **Stored energy**: months with 15+ active days buy 2-3 grace days (Cat gets +1). Missed days burn that first and only slowly drain hunger. After it runs out: hungry, sad (2 days), ghost (3 days). Weak months (<15 active days) get no grace.
- **Revive**: commit while a ghost and it is reborn as an Egg.
- **Mood**: sleepy 10pm-6am local; happy when fed.

## Structure
```
app/
  page.tsx                landing page (hero, how it works, live demo, embed)
  dashboard/page.tsx      search, pet, recap, achievements, leaderboard
  api/pet/route.ts        EDGE: animated SVG card for READMEs (cached)
  api/stats/route.ts      EDGE: JSON game state
  api/leaderboard/route.ts EDGE: rank up to 10 users
lib/
  github.ts               GraphQL fetch, demo scenarios
  pet-engine.ts           all game rules (pure functions)
  pet-art.ts              pixel sprites, animations, README card
  pets.ts / achievements.ts / embed.ts / storage.ts / util.ts / types.ts
components/               PetSprite, StatBars, Heatmap, MonthlyRecap, ...
```

## Notes
- Contributions are everything GitHub counts (commits, PRs, issues, reviews). It is the same graph as your profile.
- Streaks look back 3 years. Night Owl uses GitHub's public events (last ~90 events) so it may under-count.
- The rival board is stored in the browser. For a global leaderboard add Vercel KV and persist usernames in `/api/leaderboard`.
