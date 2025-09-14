/**
 * Very simple admin token check. For minimal setup we use a single
 * shared token (from env ADMIN_TOKEN). In production, replace with
 * proper auth (e.g., NextAuth, passkeys, etc.).
 */
export function isAdminRequest(req: Request) {
  const header = req.headers.get('x-admin-token') || ''
  const token = process.env.ADMIN_TOKEN || ''
  return token.length > 0 && header === token
}

