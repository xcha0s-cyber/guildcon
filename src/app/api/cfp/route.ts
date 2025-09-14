import { z } from 'zod'
import { CfpAPI } from '@/lib/directus'

const CfpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  title: z.string().min(1),
  abstract: z.string().min(20),
  track: z.enum(['Talk', 'Workshop'])
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = CfpSchema.parse(body)
    const saved = await CfpAPI.submit({
      name: data.name,
      email: data.email,
      title: data.title,
      abstract_md: data.abstract,
      track: data.track,
      status: 'new'
    })
    return Response.json({ ok: true, id: saved?.data?.id ?? null })
  } catch (err: any) {
    const msg = err?.message || 'Invalid request'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 })
  }
}
