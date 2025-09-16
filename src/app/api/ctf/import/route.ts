import { z } from 'zod'
export const dynamic = 'force-dynamic'
import { CtfAPI } from '@/lib/directus'

const PlayerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  handle: z.string().optional()
})

export async function POST(req: Request) {
  try {
    const adminToken = req.headers.get('x-admin-token')
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(JSON.stringify({ ok: false, error: 'No file uploaded' }), { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return new Response(JSON.stringify({ ok: false, error: 'CSV must have headers and at least one row' }), { status: 400 })
    }

    // Parse CSV
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''))
    const nameIndex = headers.findIndex(h => h.includes('name'))
    const emailIndex = headers.findIndex(h => h.includes('email'))
    const handleIndex = headers.findIndex(h => h.includes('handle') || h.includes('username'))

    if (nameIndex === -1 || emailIndex === -1) {
      return new Response(JSON.stringify({ ok: false, error: 'CSV must have name and email columns' }), { status: 400 })
    }

    const players = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''))

      try {
        const player = {
          name: cols[nameIndex] || '',
          email: cols[emailIndex] || '',
          handle: handleIndex >= 0 ? (cols[handleIndex] || '') : ''
        }

        const validated = PlayerSchema.parse(player)
        players.push(validated)
      } catch (e) {
        errors.push(`Row ${i + 1}: Invalid data`)
      }
    }

    // Import players to Directus
    let imported = 0
    for (const player of players) {
      try {
        await CtfAPI.register({
          name: player.name,
          email: player.email,
          handle: player.handle || '',
          status: 'registered',
          checked_in: false
        })
        imported++
      } catch (e) {
        errors.push(`Failed to import ${player.email}`)
      }
    }

    return Response.json({
      ok: true,
      imported,
      total: players.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'Import failed' }), { status: 400 })
  }
}