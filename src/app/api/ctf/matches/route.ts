import { CtfAPI } from '@/lib/directus'
export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await CtfAPI.listMatches() as any
  return Response.json(res?.data ?? [])
}
