import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const eventType = evt.type
  
  if (eventType === 'user.created') {
    const supabase = createClient()
    const user = evt.data;
    try {
        const {error} = await supabase.from('users').insert([
            {
                user_id: user.id,
                clerk_id: user.id,
                email: user.email_addresses || '',
                name: user.username || '',
                avatar_url: user.image_url || '',
                created_at: new Date().toISOString(),
            }
        ]);

        if (error) {
            throw new Error(error.message)
        }

    }catch (err) {
        console.error('Error: Could not create user:', err)
        return new Response('Error: Could not create user', {
            status: 400,
        })
        }

  return new Response('Webhook received', { status: 200 })
    }
}


function createClient() {
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_KEY

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Error: Please add SUPABASE_URL and SUPABASE_KEY to .env or .env.local')
    }

    return createSupabaseClient(SUPABASE_URL, SUPABASE_KEY)
}
