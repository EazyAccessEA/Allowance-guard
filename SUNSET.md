# Shutting AllowanceGuard down — the simple version

You're turning the project off. The blog gets to live on for basically free. Everything
else gets switched off so you stop paying for it.

This guide is in plain English. Do the steps **in order** — the order is the whole point,
because a few of these can't be undone.

**Three rules you must not break:**

1. **Don't delete the database until the very end** — and only after you've saved a copy
   *and* finished all refunds. Once it's gone, it's gone forever.
2. **Don't turn off Vercel until the new blog is live** and the browser extension is
   switched off. Vercel is currently running both the old app *and* the blog.
3. **Never let the website address (allowanceguard.com), the free blog host, or the code
   on GitHub disappear.** The blog needs all three to stay online.

---

## First, the good news: what's already done

- The blog is now 36 plain web pages sitting in the `out-static/` folder. Plain pages
  like these are basically free to keep online forever — nothing to run, nothing to break.
- The old website links still work, so Google and anyone with a bookmark won't hit a dead end.
- There's a new "we've shut down" front page that politely points people to another tool
  (Revoke.cash) if they still need to check their wallet.

You just need to put those pages online and turn the old stuff off.

---

## Step 1 — Put the blog online (do this before turning anything off)

Think of this as moving house before you cancel the electricity at the old place.

1. Sign up for **Cloudflare Pages** (it's free) and upload the `out-static/` folder.
2. Connect your web address to it. **Important:** use **`www.allowanceguard.com`** (with
   the `www`). All the pages are set up for the `www` version — if you use the plain one,
   Google's links will break.
3. Your **email** (like `support@allowanceguard.com`) is tied to this address too. When
   you move the address to Cloudflare, copy over the email settings *first*, or your inbox
   goes dark — and you'll need that inbox to answer people about refunds.
4. Open the new site and click around: the front page, the blog, a few articles. Make sure
   it all works. **Only then** move on.

---

## Step 2 — The stuff you have to do *before* switching things off

These are the "can't undo it later" things. Do them while everything is still running.

- **Save a copy of the database.** It holds everyone's account info and payment records.
  Download a full backup and make sure the backup actually opens. You'll do this again at
  the very end (after refunds), but back it up now too.
- **Refund your paying customers.** This is the big one. People paid for a service you're
  switching off, so you owe them their money back for the time they won't get — especially
  anyone who paid for a whole year up front. Do this while the payment system and database
  are still on. Skipping it isn't just unfair; it can get you in real trouble.
- **Tell people it's ending — give them about a month's warning.** Email your paying
  customers, your free users, people using the browser extension, and any developers using
  your code. Tell them: the date it stops, that alerts will stop, how to download their own
  data before it's gone, and how they'll get refunded.
- **Let users download their own data** before you pull the plug (the "download my data"
  button stops working once the app is off).

---

## Step 3 — Turn off the browser extension the *right* way

This one matters because the extension is a **safety tool**. People installed it to warn
them before they approve something risky in their wallet.

Here's the trap: if you just remove it from the store, the copies people already installed
**keep running** — but with nothing behind them, so they quietly stop warning anyone. The
person still sees it there and thinks they're protected. That's worse than nothing.

So: **push one final update** that switches the warnings off and shows a clear message —
"AllowanceGuard is shut down, this no longer protects you, please uninstall." *Then* remove
it from the Chrome and Firefox stores.

---

## Step 4 — Change the leaked password

A real password (a Slack webhook link and an "ops token") got left in the public code by
accident. I already cleaned it out of the current files, but it's still visible in the
project's history, so anyone can find it. **Go change/reset those**, plus — to be safe —
reset all the other keys and passwords the project used (Stripe, email, error trackers,
and so on). Treat them all as "someone might have seen these."

---

## Step 5 — Now turn things off, in this order

1. Do the final database backup (now that refunds are done) — check it opens — **then**
   delete the database.
2. Turn off **Vercel** (the thing running the old app and its scheduled tasks).
3. Turn off the **second scheduler on cron-job.org** — it's easy to forget, and if you do,
   it keeps poking the dead website every few minutes and emailing you errors forever.
4. Turn off the rest: the database service (Neon), the fast-storage (Upstash), the email
   services (Resend, Postmark), the error trackers (Sentry, Rollbar), the login helper
   (WalletConnect), the form spam-blocker (Turnstile), and Google Analytics.
5. If you were paying for a "node" service to read the blockchain (Alchemy/Infura/etc.),
   cancel that too. You might not have one — check.
6. On GitHub: add a short "this project is retired" note to the main page, then set the
   repo to read-only ("archive" it).

---

## What you'll stop paying for

Rough monthly savings: **about $60–135**, maybe up to **$300** if you had a paid blockchain
service. After this, you're down to about **$1/month** (just the web address).

| Thing | What to do |
|---|---|
| Vercel (runs the old app) | **Cancel** |
| Neon (the database) | **Back up, then cancel** — do this last |
| Upstash (fast storage) | **Cancel** |
| Postmark + Resend (send emails) | **Cancel** after you've sent the shutdown notices |
| Microsoft 365 (your inbox) | **Keep one inbox** for a while to answer refund questions, then cancel |
| cron-job.org (the hidden scheduler) | **Cancel** — don't forget this one |
| Stripe + Coinbase (payments) | **Cancel the plans**, but leave the accounts open a few months in case of refund disputes |
| Paid blockchain service (maybe) | **Check if you have one, then cancel** |
| Sentry, Rollbar, WalletConnect, Turnstile, Google Analytics | **Turn off** (these are free, just tidy up) |
| The browser extension | **Push the "we're closed" update, then remove from stores** |
| **Web address** (allowanceguard.com) | **Keep** — don't ever let it lapse |
| **Cloudflare Pages** (new blog host) | **Keep** (free) |
| **GitHub code** | **Keep**, set to read-only |

---

*The blog pages are done and tested. Everything above is stuff you do by logging into each
service and clicking around — there's no coding involved.*
