# Mediogram Lead Radar — mobile app

The phone front-end for the Lead Radar bot. It fetches the bot's `out/latest.json`
+ `out/stats.json`, renders them as a live radar sweep + feed, and installs to the
home screen as a PWA. Static site, no backend, hosted on GitHub Pages.

## What changed from the Figma export (v1 → v2)

The Figma output looked right but was a mockup, not a working app. Fixed:

1. **Live data.** Every screen now reads the real feed via a shared fetch layer
   (`src/data/feed.ts` + `src/data/store.tsx`), not hardcoded sample rows. The bot
   emits no `category` field, so the app derives it from each trial's conditions +
   title (`deriveCategory`) — that's what drives the radar's angular clustering and
   the filter chips. If the feed can't be reached (local dev, first deploy) it falls
   back to bundled sample data, clearly labelled "sample".
2. **Real phone layout.** Dropped the fixed 390×844 "phone picture on a black page."
   The app now fills the viewport on a real device and shows as a centered
   phone-width column only on desktop. Safe-area insets handled for the tab bar.
3. **Installable PWA.** Added `manifest.webmanifest`, a network-first service worker
   (`public/sw.js`), radar app icons, and iOS/Android home-screen meta. "Add to Home
   Screen" now works, same as IRON WILL.
4. **GitHub Pages base path.** Vite `base` is set from the repo name automatically in
   CI, so assets resolve under `/<repo>/` instead of 404-ing.
5. **Deploy workflow in the right place.** `.github/workflows/pages.yml` (the earlier
   bug was a workflow sitting in the repo root, which GitHub ignores).
6. **Honest empty/stale states.** Quiet day = 0 leads is a normal state, not an error.
   The Digest tab surfaces a STALE warning if the feed is >36h old.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173  (shows sample data unless out/ exists)
```

## Deploy to GitHub Pages

1. Push this folder to the repo (default branch `main`).
2. Repo **Settings → Pages → Build and deployment → Source = GitHub Actions**.
   (Not "Deploy from a branch" — this was the setting that left the site stale before.)
3. Push, or run the workflow manually from the **Actions** tab.

`base` is set automatically to `/<repo>/` by the workflow — no manual edit needed.
If you serve from a custom domain at the root, set `VITE_BASE=/` in the workflow env.

## How the feed connects

The bot writes leads into `out/latest.json` and `out/stats.json` at the repo root.
The Pages workflow copies `out/` into the built site on every deploy, and a push to
`out/` (the bot's commit) triggers a redeploy — so new leads go live automatically.
The app fetches `out/latest.json` relative to its base path.

If the bot lives in a **separate** repo, point its commit/output at this repo's
`out/` folder (or add a step that copies the feed here), otherwise the site will keep
showing sample data.
