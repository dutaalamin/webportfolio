import { send as emailjsSend } from '@emailjs/nodejs'

// Server-side environment variables — set these in your .env.local file:
//   EMAILJS_SERVICE_ID=service_xxx
//   EMAILJS_TEMPLATE_ID=template_xxx
//   EMAILJS_PUBLIC_KEY=xxx
//   EMAILJS_PRIVATE_KEY=xxx   (required for server-side sending)
const {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_PRIVATE_KEY,
} = process.env

// Basic rate limiting in-memory (per server instance). Keeps things simple
// without extra dependencies. Resets on server restart.
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // 3 messages per IP per minute
const ipHits = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits)
    return true
  }
  hits.push(now)
  ipHits.set(ip, hits)
  return false
}

function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req) {
  // 1. Validate env vars are configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error('EmailJS env vars missing. Set EMAILJS_* in .env.local')
    return Response.json(
      { ok: false, message: 'Server is not configured for email. Please try again later.' },
      { status: 503 }
    )
  }

  // 2. Rate limit
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, message: 'Too many messages. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  // 3. Parse + validate body
  let data
  try {
    data = await req.json()
  } catch {
    return Response.json({ ok: false, message: 'Invalid request body.' }, { status: 400 })
  }

  const name = typeof data.user_name === 'string' ? data.user_name.trim() : ''
  const email = typeof data.user_email === 'string' ? data.user_email.trim() : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''

  if (!name || !email || !message) {
    return Response.json({ ok: false, message: 'All fields are required.' }, { status: 400 })
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return Response.json({ ok: false, message: 'One or more fields are too long.' }, { status: 400 })
  }
  // Simple email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, message: 'Please enter a valid email address.' }, { status: 400 })
  }

  // 4. Send via EmailJS server-side SDK
  try {
    emailjsSend(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { user_name: name, user_email: email, message },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    )
    return Response.json({ ok: true, message: 'Thank you! Your message has been sent.' })
  } catch (err) {
    console.error('EmailJS send failed:', err)
    return Response.json(
      { ok: false, message: 'Sorry, there was an error sending your message. Please try again.' },
      { status: 500 }
    )
  }
}
