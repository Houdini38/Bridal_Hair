# byHoward — AI Growth Agency

Marketing funnel website for **byhoward.com**, an AI growth agency that
builds and manages AI agents and automation systems for businesses.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Main sales funnel — hero, problem/solution, stats, process, testimonials, lead-capture form, FAQ, final CTA |
| `agents.html` | AI agent lineup — six agent offerings, integrations, deployment process |
| `web-design-seo.html` | Web Design &amp; SEO funnel — "Find My Revenue Leaks" free AI Growth Audit request form |
| `case-studies.html` | Case studies — **fictional illustrative examples** with `[PLACEHOLDER]` values to be replaced with real client data |

## Placeholders to fill in later

- **Case studies** (`case-studies.html`): every `[BRACKETED]` value (client
  names, metrics, dollar amounts) is a placeholder. Each card carries an
  "Illustrative example" badge — remove the badges once real data is in.
- **Testimonials** (`index.html`): three `[PLACEHOLDER QUOTE]` cards.
- **Stats band** (`index.html`): illustrative targets with an on-page
  disclaimer; update with real averages when available.
- **Lead forms** (`script.js`): the home-page call form and the
  `web-design-seo.html` audit form are front-end only — wire the shared
  submit handler to a real backend (Formspree, Netlify Forms, HubSpot, etc.).
- **Logo** (`assets/logo.svg`): an SVG recreation of the brand mark; swap in
  the original asset file if preferred.

## Tech

Plain HTML, CSS, and vanilla JavaScript — no build step required.
Dark theme keyed to the logo palette (navy `#2e3470`, teal `#2dd9c0`,
cyan `#33b3e0`). Fonts: Sora (headings) + Inter (body) via Google Fonts.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

then visit <http://localhost:8000>.
