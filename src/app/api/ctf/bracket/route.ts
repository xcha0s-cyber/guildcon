import { CtfAPI } from '@/lib/directus'
export const dynamic = 'force-dynamic'

function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN || ''
  return token && req.headers.get('x-admin-token') === token
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return new Response('Unauthorized', { status: 401 })
  const teamsRes = await CtfAPI.listTeams() as any
  const teams = teamsRes?.data ?? []
  if (teams.length !== 8) return new Response(JSON.stringify({ ok:false, error:'Need 8 teams to create bracket' }), { status: 400 })

  // Create Quarterfinals (4 matches)
  // Pair 1v8, 4v5, 3v6, 2v7 (common seeding)
  const bySeed = [...teams].sort((a,b)=> (a.seed??0) - (b.seed??0))
  const pairs = [ [0,7], [3,4], [2,5], [1,6] ]
  const qf: any[] = []
  for (let i=0;i<4;i++) {
    const [a,b] = pairs[i]
    const m = await CtfAPI.createMatch({ round: 'QF', index_in_round: i+1, team_a: bySeed[a].id, team_b: bySeed[b].id })
    qf.push(m.data)
  }
  // Semifinals placeholders
  const sf1 = await CtfAPI.createMatch({ round: 'SF', index_in_round: 1 })
  const sf2 = await CtfAPI.createMatch({ round: 'SF', index_in_round: 2 })
  const f = await CtfAPI.createMatch({ round: 'F', index_in_round: 1 })

  // Link next matches (store next_match and next_slot)
  await Promise.all([
    CtfAPI.patchMatch(qf[0].id, { next_match: sf1.data.id, next_slot: 'A' }),
    CtfAPI.patchMatch(qf[1].id, { next_match: sf1.data.id, next_slot: 'B' }),
    CtfAPI.patchMatch(qf[2].id, { next_match: sf2.data.id, next_slot: 'A' }),
    CtfAPI.patchMatch(qf[3].id, { next_match: sf2.data.id, next_slot: 'B' }),
    CtfAPI.patchMatch(sf1.data.id, { next_match: f.data.id, next_slot: 'A' }),
    CtfAPI.patchMatch(sf2.data.id, { next_match: f.data.id, next_slot: 'B' }),
  ])

  return Response.json({ ok:true })
}
