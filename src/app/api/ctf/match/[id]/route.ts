import { z } from 'zod'
export const dynamic = 'force-dynamic'
import { CtfAPI } from '@/lib/directus'

function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN || ''
  return token && req.headers.get('x-admin-token') === token
}

const ScoreSchema = z.object({
  scoreA: z.number().int().min(0),
  scoreB: z.number().int().min(0),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return new Response('Unauthorized', { status: 401 })
  const id = Number(params.id)
  if (!Number.isFinite(id)) return new Response('Invalid match id', { status: 400 })

  try {
    const body = await req.json()
    const { scoreA, scoreB } = ScoreSchema.parse(body)

    // Fetch current match to know teams and progression
    const matchRes = await CtfAPI.getMatch(id) as any
    const match = matchRes?.data
    if (!match) return new Response('Match not found', { status: 404 })

    const teamAId = match.team_a ?? match.teamA ?? match.team_a_id ?? match.teamAId
    const teamBId = match.team_b ?? match.teamB ?? match.team_b_id ?? match.teamBId
    if (!teamAId || !teamBId) return new Response('Match missing teams', { status: 400 })
    if (scoreA === scoreB) return new Response('Tie not allowed', { status: 400 })

    const winnerId = scoreA > scoreB ? teamAId : teamBId

    // 1) Save scores and winner on this match
    await CtfAPI.patchMatch(id, { score_a: scoreA, score_b: scoreB, winner: winnerId })

    // 2) If next progression exists, place winner in the correct slot
    const nextId = match.next_match ?? match.nextMatch ?? match.next_match_id ?? match.nextMatchId
    const nextSlot = match.next_slot ?? match.nextSlot
    if (nextId && nextSlot) {
      const slotField = nextSlot === 'A' ? 'team_a' : 'team_b'
      await CtfAPI.patchMatch(nextId, { [slotField]: winnerId })
    }

    return Response.json({ ok: true, winnerId })
  } catch (e: any) {
    const msg = e?.message || 'Invalid request'
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 })
  }
}
