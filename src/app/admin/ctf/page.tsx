"use client"
import { useEffect, useState } from 'react'

export default function CtfAdminPage(){
  const [adminToken, setToken] = useState('')
  const [teams, setTeams] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)

  useEffect(()=>{
    const savedToken = localStorage.getItem('gc_admin_token') || ''
    setToken(savedToken)
    if(savedToken) {
      refreshTeams()
      refreshMatches()
    }
  },[])

  async function refreshTeams(){
    try{
      const r = await fetch('/api/ctf/teams')
      const d = await r.json()
      setTeams(d)
    }catch(e){ setMsg('Failed loading teams') }
  }

  async function refreshMatches(){
    try{
      const r = await fetch('/api/ctf/matches')
      const d = await r.json()
      setMatches(d)
    }catch(e){ setMsg('Failed loading matches') }
  }

  function saveToken(){ localStorage.setItem('gc_admin_token', adminToken); setMsg('Admin token saved in this browser.') }

  async function importCSV(){
    if(!csvFile) return setMsg('Please select a CSV file')
    setMsg('Importing...')
    const formData = new FormData()
    formData.append('file', csvFile)

    const r = await fetch('/api/ctf/import', {
      method:'POST',
      headers: {'x-admin-token': adminToken},
      body: formData
    })
    const d = await r.json()
    if(!r.ok) return setMsg(d.error || 'Import failed')
    setMsg(`Imported ${d.imported} of ${d.total} players`)
    if(d.errors) console.log('Import errors:', d.errors)
    setCsvFile(null)
  }

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
    else { setMsg('Bracket created'); refreshMatches() }
  }

  async function saveScore(id:number, scoreA:number, scoreB:number){
    setMsg('Saving score...')
    const r = await fetch(`/api/ctf/match/${id}`, { method:'PATCH', headers: { 'content-type':'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ scoreA, scoreB }) })
    const d = await r.json().catch(()=>({}))
    if(!r.ok) setMsg((d as any).error || 'Save failed')
    else { setMsg('Score saved'); refreshMatches() }
  }

  return (
    <section>
      <h1>CTF Admin</h1>
      <p style={{opacity:.8}}>Use your admin token to perform actions. For production, place this path behind Cloudflare Access/NGINX auth.</p>
      <div style={{display:'flex', gap:8, margin:'12px 0', flexWrap:'wrap'}}>
        <input value={adminToken} onChange={e=>setToken(e.target.value)} placeholder="Enter admin token" style={{padding:8, minWidth:320}} />
        <button onClick={saveToken}>Save</button>
      </div>

      <div style={{border:'1px solid #334', padding:16, borderRadius:8, marginTop:16, marginBottom:16}}>
        <h3 style={{marginTop:0}}>Import Players from CSV</h3>
        <p style={{opacity:.8, fontSize:'0.9rem'}}>Upload a CSV file from Eventbrite with columns: name, email, handle (optional)</p>
        <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
          <input
            type="file"
            accept=".csv"
            onChange={e => setCsvFile(e.target.files?.[0] || null)}
            style={{padding:8}}
          />
          <button onClick={importCSV} disabled={!csvFile}>Import Players</button>
        </div>
      </div>

      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
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

      <div style={{display:'flex', alignItems:'center', gap:8, marginTop:16}}>
        <h2 style={{margin:0}}>Matches</h2>
        <button onClick={refreshMatches}>Reload</button>
      </div>
      {matches.length === 0 && <p>No matches yet. Generate bracket to create QF/SF/F.</p>}
      <ul style={{display:'grid', gridTemplateColumns:'repeat(1, minmax(0, 1fr))', gap:8}}>
        {matches.map(m => {
          const teamName = (id?: number) => teams.find(t=>t.id===id)?.name || `Team ${id ?? '-'}`
          const [sa, sb] = [m.score_a ?? '', m.score_b ?? '']
          return (
            <li key={m.id} style={{border:'1px solid #334', padding:8, borderRadius:8}}>
              <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                <strong>{m.round} {m.index_in_round}</strong>
                <span style={{opacity:.8}}>{teamName(m.team_a)} vs {teamName(m.team_b)}</span>
                <div style={{marginLeft:'auto', display:'flex', gap:6}}>
                  <input defaultValue={sa} placeholder="A" style={{width:56, padding:6}} id={`sa-${m.id}`} />
                  <input defaultValue={sb} placeholder="B" style={{width:56, padding:6}} id={`sb-${m.id}`} />
                  <button onClick={()=>{
                    const a = Number((document.getElementById(`sa-${m.id}`) as HTMLInputElement).value)
                    const b = Number((document.getElementById(`sb-${m.id}`) as HTMLInputElement).value)
                    if(Number.isNaN(a) || Number.isNaN(b)) return setMsg('Scores must be numbers')
                    saveScore(m.id, a, b)
                  }}>Save</button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
