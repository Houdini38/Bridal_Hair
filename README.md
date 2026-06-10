# byHoward — AI Growth Agency

Marketing funnel website for **byhoward.com**, an AI growth agency that
builds and manages AI agents and automation systems for businesses.

## Layout

| Path | Purpose |
| --- | --- |
| `public/index.html` | Main sales funnel — hero, problem/solution, stats, process, testimonials, lead-capture form, FAQ, final CTA |
| `public/agents.html` | AI agent lineup — six agent offerings, integrations, deployment process |
| `public/web-design-seo.html` | Web Design &amp; SEO funnel — "Find My Revenue Leaks" free AI Growth Audit request form |
| `public/case-studies.html` | Case studies — **fictional illustrative examples** with `[PLACEHOLDER]` values to be replaced with real client data |
| `src/worker.js` | Cloudflare Worker — serves `public/` and handles `POST /api/lead` (Turnstile check → D1 store → email notification) |
| `wrangler.jsonc` | Cloudflare config (assets, D1, Email Routing, Turnstile) |
| `schema.sql` | D1 table for captured leads |
| `DEPLOY.md` | Step-by-step Cloudflare deployment guide |

## Placeholders to fill in later

- **Case studies** (`public/case-studies.html`): every `[BRACKETED]` value
  (client names, metrics, dollar amounts) is a placeholder. Each card carries
  an "Illustrative example" badge — remove the badges once real data is in.
- **Testimonials** (`public/index.html`): three `[PLACEHOLDER QUOTE]` cards.
- **Stats band** (`public/index.html`): illustrative targets with an on-page
  disclaimer; update with real averages when available.
- **Form backend**: the forms POST to `/api/lead`; follow `DEPLOY.md` steps
  4–6 to wire up the D1 database, email notifications, and Turnstile.
- **Logo** (`public/assets/logo.svg`): an SVG recreation of the brand mark;
  swap in the original asset file if preferred.

## Tech

Static HTML, CSS, and vanilla JavaScript — no build step — hosted on
Cloudflare Workers static assets, with a small Worker for form submissions.
Dark theme keyed to the logo palette (navy `#2e3470`, teal `#2dd9c0`,
cyan `#33b3e0`). Fonts: Sora (headings) + Inter (body) via Google Fonts.

## Running locally

```sh
npx wrangler dev          # full site + form API at http://localhost:8787
```

or, for markup-only work without the form API:

```sh
python3 -m http.server 8000 --directory public
```
