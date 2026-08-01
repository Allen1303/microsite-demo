# First Crack Roasting Co. — scroll-film microsite

A demo landing page for a local artisan coffee roaster, built as one continuous
cinematic shot you scrub with the scroll wheel. Six AI-generated clips are
chained end-to-end — each clip was generated with its neighbors' shared
keyframe as start/end conditioning, so the camera never appears to cut.

**Live:** https://allen1303.github.io/microsite-demo/

> "First Crack Roasting Co." is a placeholder brand. The order form runs in
> demo mode (orders persist to `localStorage`); point `ORDER_ENDPOINT` in
> `src/components/OrderForm.jsx` at a real backend to take live orders.

## Stack

- [Vite](https://vitejs.dev) + React 19 (plain JSX, no TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com) — design tokens in `@theme`,
  custom `@utility` classes, no vanilla stylesheets
- Video generated with MiniMax H3 via [Higgsfield](https://higgsfield.ai),
  conditioned on shared boundary keyframes
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push
  to `main`

## Run it

```sh
npm install
npm run dev     # http://localhost:5174/microsite-demo/
npm run build   # production build in dist/
```

## How the film works

`src/components/Film.jsx` stacks six `<video>` elements inside a sticky
full-viewport canvas over a 900vh scroll track. A `requestAnimationFrame`
loop maps scroll progress to a clip index + timestamp, then scrubs
`currentTime` — lerping small deltas for smoothness and snapping large jumps
(anchor links, flicks) to avoid seek storms. Copy captions own windows just
after each seam, labeled by *time since roast* rather than step numbers.

- Clips 1–2 preload up front; clips 3–6 fetch one segment ahead of the
  scroll position (~4MB initial payload instead of ~15MB).
- Reduced-motion, Save-Data, and video-error states fall back to still
  keyframes with the same copy.
- The signature interaction: press and hold the cup ("the Bloom") and the
  bag's tasting notes spread through it like ink.

## Repo tour

| Path | What it is |
|---|---|
| `src/components/` | Film engine, Bloom, order form, nav, CTA bar |
| `src/copy.js` | Single source of truth for the film's copy |
| `public/assets/` | Film clips (720p), boundary keyframes, poster JPEGs |
| `public/verify-seams.html` | Grid of every clip's first/last frame for seam QA |
| `public/mobile-test.html` | 390×844 iframe harness for phone-layout testing |
| `stage1-research.md` | Real customer research the copy is written from |
| `stage2-story.md` | Shot-by-shot story outline that doubles as the site structure |
