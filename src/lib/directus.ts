// Minimal REST helpers to talk to Directus using a service token.

const BASE = process.env.DIRECTUS_URL || 'http://localhost:8055'
const TOKEN = process.env.DIRECTUS_TOKEN || ''

type FetchOpts = {
  method?: 'GET'|'POST'|'PATCH'|'DELETE'
  body?: any
  search?: Record<string,string|number|boolean|undefined>
}

export async function dx(path: string, opts: FetchOpts = {}) {
  const url = new URL(path.replace(/^\/+/, ''), BASE + '/')
  if (opts.search) for (const [k,v] of Object.entries(opts.search)) if (v !== undefined) url.searchParams.set(k, String(v))
  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers: {
      'Authorization': TOKEN ? `Bearer ${TOKEN}` : '',
      'Content-Type': 'application/json'
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    // Revalidate quickly by default
    next: { revalidate: 30 }
  })
  if (!res.ok) throw new Error(`Directus ${res.status}: ${await res.text()}`)
  return res.json()
}

// Convenience wrappers for our collections
export const ContentAPI = {
  settings: () => dx('/items/settings'),
  announcements: () => dx('/items/announcements', { search: { sort: '-publish_at' } }),
  talks: () => dx('/items/talks', { search: { sort: 'title' } }),
  workshops: () => dx('/items/workshops', { search: { sort: 'title' } }),
  sponsors: () => dx('/items/sponsor_tiers', { search: { sort: 'price_min' } }),
}

export const CfpAPI = {
  submit: (data: any) => dx('/items/cfp_submissions', { method: 'POST', body: data })
}

export const CtfAPI = {
  register: (data: any) => dx('/items/ctf_players', { method: 'POST', body: data }),
  listPlayers: (filter?: any) => dx('/items/ctf_players', { search: { filter: filter ? JSON.stringify(filter) : undefined } }),
  listTeams: () => dx('/items/ctf_teams'),
  createTeam: (data: any) => dx('/items/ctf_teams', { method: 'POST', body: data }),
  patchTeam: (id: number, data: any) => dx(`/items/ctf_teams/${id}`, { method: 'PATCH', body: data }),
  patchPlayer: (id: number, data: any) => dx(`/items/ctf_players/${id}`, { method: 'PATCH', body: data }),
  listMatches: () => dx('/items/ctf_matches', { search: { sort: 'round,index_in_round' } }),
  createMatch: (data: any) => dx('/items/ctf_matches', { method: 'POST', body: data }),
  patchMatch: (id: number, data: any) => dx(`/items/ctf_matches/${id}`, { method: 'PATCH', body: data }),
}

