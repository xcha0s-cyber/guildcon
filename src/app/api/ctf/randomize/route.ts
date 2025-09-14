import { CtfAPI } from '@/lib/directus'

function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN || ''
  return token && req.headers.get('x-admin-token') === token
}

// Shuffle using Fisher-Yates
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i=a.length-1;i>0;i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] }
  return a
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return new Response('Unauthorized', { status: 401 })

  // 1) Fetch checked-in players
  const playersRes = await CtfAPI.listPlayers({ checked_in: { _eq: true }, status: { _eq: 'registered' } }) as any
  const players = (playersRes?.data ?? [])

  if (players.length !== 24) {
    return new Response(JSON.stringify({ ok:false, error:`Need exactly 24 checked-in players; have ${players.length}` }), { status: 400 })
  }

  // 2) Create 8 teams of 3
  const randomized = shuffle(players)
  const teams: any[] = []
  for (let t=0;t<8;t++) {
    const slice = randomized.slice(t*3, t*3+3)
    const team = await CtfAPI.createTeam({ name: `Team ${t+1}`, seed: t+1 })
    const teamId = team?.data?.id
    teams.push({ id: teamId, name: `Team ${t+1}`, players: slice.map((p:any)=>p.id) })
    // Assign players to team
    await Promise.all(slice.map((p:any)=> CtfAPI.patchPlayer(p.id, { team_id: teamId })))
  }

  return Response.json({ ok:true, teams })
}

