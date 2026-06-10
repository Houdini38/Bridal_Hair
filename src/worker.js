// byHoward — Worker: serves the static site and handles form submissions.
//
// POST /api/lead
//   Accepts JSON from the two site forms (home "book a call" form and the
//   web-design-seo "growth audit" form). Verifies Turnstile when configured,
//   stores the lead in D1 when configured, and emails a notification via
//   Email Routing when configured. Each integration is optional so the site
//   deploys before the dashboard setup is finished.

import { EmailMessage } from "cloudflare:email";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/lead") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }
      return handleLead(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleLead(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = (data.name || "").toString().trim().slice(0, 200);
  const email = (data.email || "").toString().trim().slice(0, 200);
  const form = (data.form || "unknown").toString().trim().slice(0, 100);

  if (!name || !email || !email.includes("@")) {
    return json({ error: "Name and a valid email are required" }, 400);
  }

  // Turnstile verification — enforced only once the secret is configured.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = data["cf-turnstile-response"];
    if (!token || !(await verifyTurnstile(env, token, request))) {
      return json({ error: "Spam check failed — please retry" }, 403);
    }
  }

  delete data["cf-turnstile-response"];

  let stored = false;
  let emailed = false;

  if (env.DB) {
    await env.DB.prepare(
      "INSERT INTO leads (form, name, email, payload) VALUES (?1, ?2, ?3, ?4)"
    )
      .bind(form, name, email, JSON.stringify(data))
      .run();
    stored = true;
  }

  if (env.EMAIL && env.EMAIL_FROM && env.EMAIL_TO) {
    const fields = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const raw = [
      `From: byHoward Website <${env.EMAIL_FROM}>`,
      `To: ${env.EMAIL_TO}`,
      `Subject: New lead from byhoward.com — ${name} (${form})`,
      `Message-ID: <${crypto.randomUUID()}@byhoward.com>`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "",
      `New ${form} submission:`,
      "",
      fields,
      "",
    ].join("\r\n");
    await env.EMAIL.send(new EmailMessage(env.EMAIL_FROM, env.EMAIL_TO, raw));
    emailed = true;
  }

  if (!stored && !emailed) {
    // Neither D1 nor email is wired up yet — fail loudly so leads are
    // never silently dropped.
    return json({ error: "Form backend not configured yet" }, 503);
  }

  return json({ ok: true, stored, emailed });
}

async function verifyTurnstile(env, token, request) {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get("CF-Connecting-IP"),
      }),
    }
  );
  const outcome = await res.json();
  return outcome.success === true;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
