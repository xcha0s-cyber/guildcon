// Temporary version that works without Directus
export const dynamic = 'force-dynamic'

// In-memory storage for testing (resets on server restart)
let teams: any[] = []

function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN || ''
  return token && req.headers.get('x-admin-token') === token
}

export async function GET() {
  // Return existing teams or empty array
  return Response.json(teams)
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return new Response('Unauthorized', { status: 401 })

  const body = await req.json() as { id: number, name?: string }

  // Find and update team name in memory
  const team = teams.find(t => t.id === body.id)
  if (team && body.name) {
    team.name = body.name
  }

  return Response.json({ ok: true })
}

// Helper function to set teams (called by randomize endpoint)
export function setTeams(newTeams: any[]) {
  teams = newTeams
}