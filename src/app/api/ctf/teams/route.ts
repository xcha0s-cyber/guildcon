import { CtfAPI } from '@/lib/directus'

function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN || ''
  return token && req.headers.get('x-admin-token') === token
}

export async function GET() {
  const t = await CtfAPI.listTeams() as any
  return Response.json(t?.data ?? [])
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return new Response('Unauthorized', { status: 401 })
  const body = await req.json() as { id: number, name?: string }
  await CtfAPI.patchTeam(body.id, { name: body.name })
  return Response.json({ ok: true })
}

