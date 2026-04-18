#!/usr/bin/env node
//
// scripts/smoke-otp.mjs — end-to-end smoke test for the OTP sign-in flow.
//
// Verifies:
//   1. POST /api/auth/otp-request returns 200 and (in prod) emails a code
//   2. POST /api/auth/otp-verify with a wrong code returns 401 + generic error
//   3. POST /api/auth/otp-verify with the right code returns 200 with
//      Set-Cookie: ag_sess=... (httpOnly, Secure, SameSite=Lax in prod)
//   4. Replay of the consumed code is rejected
//
// Usage:
//   BASE_URL=https://www.allowanceguard.com TEST_EMAIL=you@example.com \
//     node scripts/smoke-otp.mjs
//
// Defaults: BASE_URL=http://localhost:3000, TEST_EMAIL prompted interactively.
//
// Zero dependencies — uses Node 18+ built-in fetch and readline.
//
// Expected run time: ~30s (most of it waiting for the user to fetch the
// code from their inbox and paste it back in).

import { createInterface } from 'node:readline/promises'
import { stdin, stdout, exit } from 'node:process'

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const ENV_EMAIL = process.env.TEST_EMAIL

const rl = createInterface({ input: stdin, output: stdout })

function log(tag, message) {
  const stamp = new Date().toISOString().slice(11, 19)
  console.log(`[${stamp}] ${tag.padEnd(7)} ${message}`)
}

function fail(message, extra) {
  log('FAIL', message)
  if (extra !== undefined) console.error(extra)
  rl.close()
  exit(1)
}

function ok(message) {
  log('OK', message)
}

async function postJson(path, body) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  const setCookie = res.headers.get('set-cookie')
  const cacheControl = res.headers.get('cache-control')
  let json
  try {
    json = await res.json()
  } catch {
    json = null
  }
  return { status: res.status, json, setCookie, cacheControl }
}

async function run() {
  log('START', `BASE_URL=${BASE_URL}`)

  const email = ENV_EMAIL ?? (await rl.question('Test email address: ')).trim()
  if (!email || !email.includes('@')) {
    fail('A valid TEST_EMAIL is required.')
  }
  log('INFO', `email=${email}`)

  // ----- Step 1: request a code ---------------------------------------------
  log('STEP', '1/3 POST /api/auth/otp-request')
  const request = await postJson('/api/auth/otp-request', { email })
  if (request.status !== 200 || request.json?.ok !== true) {
    fail(`expected 200 {ok:true}, got ${request.status}`, request.json)
  }
  if (!request.cacheControl?.includes('no-store')) {
    fail(`expected Cache-Control to include no-store, got: ${request.cacheControl}`)
  }
  ok(`otp-request returned 200 (Cache-Control: ${request.cacheControl})`)

  // ----- Step 2: try a deliberately-wrong code ------------------------------
  log('STEP', '2/3 POST /api/auth/otp-verify with wrong code')
  const wrong = await postJson('/api/auth/otp-verify', { email, code: '000000' })
  if (wrong.status !== 401) {
    fail(`expected 401 for wrong code, got ${wrong.status}`, wrong.json)
  }
  if (!wrong.json?.error || /incorrect|expired/i.test(wrong.json.error) === false) {
    fail(`expected a generic error message, got: ${JSON.stringify(wrong.json)}`)
  }
  if (wrong.setCookie) {
    fail('wrong-code response must NOT set a session cookie', wrong.setCookie)
  }
  ok('wrong-code returned 401 with generic error and no Set-Cookie')

  // ----- Step 3: paste the real code ----------------------------------------
  console.log('')
  console.log(`  A 6-digit code was sent to ${email}.`)
  console.log('  Open the email and paste the code below.')
  console.log('')
  const code = (await rl.question('Code: ')).trim()
  if (!/^\d{6}$/.test(code)) {
    fail('Code must be six digits.')
  }

  log('STEP', '3/3 POST /api/auth/otp-verify with real code')
  const right = await postJson('/api/auth/otp-verify', { email, code })
  if (right.status !== 200 || right.json?.ok !== true) {
    fail(`expected 200 {ok:true}, got ${right.status}`, right.json)
  }
  if (!right.setCookie) {
    fail('expected Set-Cookie header on verify success')
  }
  if (!/^ag_sess=/.test(right.setCookie)) {
    fail(`expected Set-Cookie to start with ag_sess=, got: ${right.setCookie}`)
  }
  if (!/HttpOnly/i.test(right.setCookie)) {
    fail(`session cookie must be HttpOnly, got: ${right.setCookie}`)
  }
  if (BASE_URL.startsWith('https://') && !/Secure/i.test(right.setCookie)) {
    fail(`session cookie must be Secure over https, got: ${right.setCookie}`)
  }
  if (!/SameSite=Lax/i.test(right.setCookie)) {
    fail(`session cookie must be SameSite=Lax, got: ${right.setCookie}`)
  }
  ok('otp-verify returned 200 with a valid ag_sess cookie')

  // ----- Step 4: replay protection -----------------------------------------
  log('STEP', '4/3 POST /api/auth/otp-verify with the same code again (replay)')
  const replay = await postJson('/api/auth/otp-verify', { email, code })
  if (replay.status === 200) {
    fail('replay of consumed code must not return 200')
  }
  ok(`replay of consumed code correctly rejected (status ${replay.status})`)

  console.log('')
  log('DONE', 'All OTP smoke checks passed.')
  rl.close()
}

run().catch((err) => {
  fail('unexpected error', err)
})
