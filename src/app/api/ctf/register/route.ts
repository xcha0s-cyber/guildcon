import { z } from 'zod'
import { CtfAPI } from '@/lib/directus'

const RegSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  handle: z.string().optional()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const d = RegSchema.parse(body)
    const saved = await CtfAPI.register({ name: d.name, email: d.email, handle: d.handle ?? '', status: 'registered', checked_in: false })
    return Response.json({ ok: true, id: saved?.data?.id ?? null })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'Invalid' }), { status: 400 })
  }
}

