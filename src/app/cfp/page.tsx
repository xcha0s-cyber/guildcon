"use client"
import { useState } from 'react'

export default function CFP(){
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries()) as any
    const r = await fetch('/api/cfp', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) })
    const d = await r.json()
    if(!r.ok || !d.ok) setMsg(d.error || 'Submit failed')
    else setMsg('Submitted!')
    e.currentTarget.reset()
  }

  return (
    <section>
      <h1>Call for Papers</h1>
      <form onSubmit={onSubmit} style={{display:'grid', gap:8, maxWidth:520}}>
        <input name="name" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="title" placeholder="Talk/Workshop Title" required />
        <select name="track">
          <option>Talk</option>
          <option>Workshop</option>
        </select>
        <textarea name="abstract" placeholder="Abstract" rows={6} required />
        <button>Submit</button>
      </form>
      {msg && <p>{msg}</p>}
    </section>
  )
}

