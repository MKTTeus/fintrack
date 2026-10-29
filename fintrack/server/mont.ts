/**
 * Server-only Mont integration utilities. Do not import from the browser app.
 * The service key bypasses RLS, so every query MUST restrict user_id.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database.types.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return jsonResponse({ error: error.code, message: error.message }, error.status)
  }
  console.error('Mont API: unexpected server error')
  return jsonResponse({ error: 'internal_error', message: 'Erro interno da API' }, 500)
}

export function requireMontAccess(request: Request) {
  const sharedSecret = process.env.MONT_FINTRACK_API_KEY
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY
  const userId = process.env.FINTRACK_MONT_USER_ID

  if (!sharedSecret || sharedSecret.length < 32 || !supabaseUrl || !supabaseSecretKey || !userId || !UUID_RE.test(userId)) {
    throw new ApiError(503, 'not_configured', 'Integração Mont não configurada no servidor')
  }

  const authorization = request.headers.get('authorization') || ''
  const submitted = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  const actual = Buffer.from(submitted, 'utf8')
  const expected = Buffer.from(sharedSecret, 'utf8')
  if (!submitted || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new ApiError(401, 'unauthorized', 'Credenciais inválidas')
  }

  // Invalid project URLs otherwise throw inside createClient and appear as an
  // opaque HTTP 500. Provide a safe configuration status without leaking values.
  try {
    const url = new URL(supabaseUrl)
    if (
      url.protocol !== 'https:' ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error('invalid supabase URL')
    }
  } catch {
    throw new ApiError(
      503,
      'invalid_supabase_url',
      'SUPABASE_URL não é uma URL HTTPS válida. Verifique a variável na Vercel (Preview).',
    )
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    return { supabase, userId, sharedSecret }
  } catch (error) {
    // Never log the original error message: SDK errors could include env values.
    console.error('Mont API: Supabase client initialization failed', error instanceof Error ? error.name : 'unknown')
    throw new ApiError(
      503,
      'supabase_client_error',
      'A conexão Supabase não pôde ser inicializada. Confira SUPABASE_URL e SUPABASE_SECRET_KEY no Preview.',
    )
  }
}

/** Deterministic UUID keyed by secret + user + client request ID: safe retries don't duplicate expenses. */
export function transactionId(userId: string, requestId: string, secret: string): string {
  const bytes = createHmac('sha256', secret)
    .update('fintrack:mont:transactions:v1:')
    .update(userId)
    .update(':')
    .update(requestId)
    .digest()
    .subarray(0, 16)

  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}
