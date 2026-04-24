import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('APP_SERVICE_KEY')!

async function validateRecaptcha(token: string): Promise<boolean> {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET}&response=${token}`
  })
  const data = await res.json()
  return data.success && data.score >= 0.5
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'content-type, authorization',
        'Access-Control-Allow-Methods': 'POST'
      }
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.json()
    const { recaptchaToken, ...payload } = body

    console.log('Payload recebido:', JSON.stringify(payload))
    console.log('Token reCAPTCHA:', recaptchaToken?.substring(0, 20))

    const valid = await validateRecaptcha(recaptchaToken)
    console.log('reCAPTCHA válido:', valid)

    if (!valid) {
      return new Response(
        JSON.stringify({ error: 'Verificação de segurança falhou.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    }

    console.log('Tentando upsert via REST...')
    console.log('SERVICE KEY prefix:', SUPABASE_SERVICE_KEY?.substring(0, 30))

    const response = await fetch(`${SUPABASE_URL}/rest/v1/salaries?on_conflict=email_hash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errBody = await response.text()
      console.error('Erro REST:', errBody)
      throw new Error(errBody)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )

  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: 'Erro interno.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }
})