"use client"
import { useEffect, useState } from 'react'

export default function CtfAdminPage(){
  const [adminToken, setToken] = useState('')
  const [teams, setTeams] = useState<any[]>([])
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    setToken(localStorage.getItem('gc_admin_token') || '')
    refreshTeams()
  },[])

  async function refreshTeams(){
    try{
      const r = await fetch('/api/ctf/teams')
      const d = await r.json()
      setTeams(d)
    }catch(e){ setMsg('Failed loading teams') }
  }

  function saveToken(){ localStorage.setItem('gc_admin_token', adminToken); setMsg('Admin token saved in this browser.') }

  async function randomize(){
    setMsg('Randomizing...')
    const r = await fetch('/api/ctf/randomize', { method:'POST', headers: {'x-admin-token': adminToken } })
    const d = await r.json()
    if(!r.ok) return setMsg(d.error || 'Randomize failed')
    setMsg('Teams created')
    refreshTeams()
  }

  async function rename(id:number, name:string){
    const r = await fetch('/api/ctf/teams', { method:'PATCH', headers: { 'content-type':'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ id, name }) })
    if(!r.ok) setMsg('Rename failed')
    else refreshTeams()
  }

  async function createBracket(){
    const r = await fetch('/api/ctf/bracket', { method:'POST', headers: { 'x-admin-token': adminToken }})
    const d = await r.json().catch(()=>({}))
    if(!r.ok) setMsg((d as any).error || 'Bracket failed')
    else setMsg('Bracket created')
  }

  return (
    <section>
      <h1>CTF Admin</h1>
      <p style={{opacity:.8}}>Use your admin token to perform actions. For production, place this path behind Cloudflare Access/NGINX auth.</p>
      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <input value={adminToken} onChange={e=>setToken(e.target.value)} placeholder="Enter admin token" style={{padding:8, minWidth:320}} />
        <button onClick={saveToken}>Save</button>
        <button onClick={randomize}>Randomize 8×3</button>
        <button onClick={createBracket}>Generate Bracket</button>
      </div>
      {msg && <p>{msg}</p>}

      <h2>Teams</h2>
      <ul style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:8}}>
        {teams.map(t => (
          <li key={t.id} style={{border:'1px solid #334', padding:8, borderRadius:8}}>
            <input defaultValue={t.name} onBlur={e=>rename(t.id, e.target.value)} style={{fontWeight:700, padding:6, width:'100%'}} />
            <div style={{opacity:.8, marginTop:4}}>Seed: {t.seed ?? '-'}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

