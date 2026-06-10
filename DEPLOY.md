# Deploying byhoward.com on Cloudflare

The site deploys as a **Cloudflare Worker with static assets**: the pages in
`public/` are served as static files (free, unlimited), and `src/worker.js`
handles `POST /api/lead` for both site forms — Turnstile spam check, save to
a D1 database, and an email notification via Email Routing. Everything below
fits in Cloudflare's free tier.

## 1. Point byhoward.com at Cloudflare (~10 min, mostly waiting)

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Add a domain** → enter `byhoward.com` → Free plan.
3. Cloudflare shows two nameservers. At your registrar (GoDaddy/Namecheap/etc.),
   replace the existing nameservers with those two.
4. Wait for the "Active" email (minutes to a few hours).

## 2. Connect the GitHub repo (one-time)

1. Dashboard → **Workers & Pages** → **Create** → **Workers** →
   **Import a repository**.
2. Authorize GitHub and pick the site repo.
3. Build settings: leave the build command **empty**, set the deploy command to
   `npx wrangler deploy`. Cloudflare reads `wrangler.jsonc` for the rest.
4. Deploy. Every future `git push` to the production branch redeploys
   automatically.

## 3. Attach the domain

Worker → **Settings** → **Domains & Routes** → **Add** → Custom domain →
`byhoward.com`. Repeat for `www.byhoward.com`. SSL is automatic.

The site is now live. The forms return "Something went wrong" until step 4 or
5 gives submissions somewhere to go — the API refuses to silently drop leads.

## 4. D1 database (stores every lead)

```sh
npx wrangler d1 create byhoward-leads          # prints a database_id
npx wrangler d1 execute byhoward-leads --remote --file=./schema.sql
```

Paste the `database_id` into the commented `d1_databases` block in
`wrangler.jsonc`, uncomment it, commit, push.

Read leads anytime with:

```sh
npx wrangler d1 execute byhoward-leads --remote \
  --command "SELECT * FROM leads ORDER BY created_at DESC LIMIT 20"
```

## 5. Email notification on every submission

1. Zone `byhoward.com` → **Email** → **Email Routing** → enable (Cloudflare
   adds the MX/SPF DNS records for you).
2. **Destination addresses** → add your inbox → click the verification link
   Cloudflare emails you.
3. **Custom addresses** → create `leads@byhoward.com` (route it to your inbox).
4. In `wrangler.jsonc`, uncomment the `send_email` block and the `vars` block;
   make sure `EMAIL_TO` matches the verified destination address exactly.
   Commit, push.

## 6. Turnstile spam protection (recommended once live)

1. Dashboard → **Turnstile** → **Add widget** → hostname `byhoward.com`,
   "Managed" mode. Copy the **site key** and **secret key**.
2. In `public/index.html` and `public/web-design-seo.html`: uncomment the
   `cf-turnstile` div, replace `YOUR_TURNSTILE_SITE_KEY`, and add the script
   tag (shown in the comment) to each page's `<head>`.
3. Set the secret: `npx wrangler secret put TURNSTILE_SECRET_KEY`
   (or Worker → Settings → Variables and Secrets).
4. Commit, push. The API enforces Turnstile automatically once the secret
   exists.

## Local development

```sh
npx wrangler dev        # full site + /api/lead at http://localhost:8787
```

Or for markup-only work: `python3 -m http.server 8000 --directory public`
(form submits will show the error message — there's no API in that mode).
