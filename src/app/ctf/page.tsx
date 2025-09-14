"use client"
import { useState } from 'react'

export default function CTF(){
  const [msg, setMsg] = useState('')
  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    const r = await fetch('/api/ctf/register', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) })
    const d = await r.json()
    if(!r.ok || !d.ok) setMsg(d.error || 'Registration failed')
    else setMsg('Registered! Check in day-of to be randomized into teams.')
    e.currentTarget.reset()
  }
  return (
    <section>
      <h1>CTF Registration</h1>
      <form onSubmit={onSubmit} style={{display:'grid', gap:8, maxWidth:520}}>
        <input name="name" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="handle" placeholder="Handle (optional)" />
        <button>Save Spot</button>
      </form>
      {msg && <p>{msg}</p>}
    </section>
  )
}

