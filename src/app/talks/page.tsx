import { ContentAPI } from '@/lib/directus'

async function getData(){
  try{
    const [talks, workshops] = await Promise.all([
      ContentAPI.talks().catch(()=>({ data:[] })),
      ContentAPI.workshops().catch(()=>({ data:[] }))
    ])
    return { talks: talks?.data||[], workshops: workshops?.data||[] }
  }catch{ return { talks:[], workshops:[] } }
}

export default async function TalksPage(){
  const { talks, workshops } = await getData()
  return (
    <section className="grid" style={{gap:16}}>
      <h1>Talks & Workshops</h1>
      <div className="grid cols-2">
        <div className="card">
          <h2 style={{marginTop:0}}>Talks</h2>
          {talks.length===0 && <p className="muted">No talks published yet.</p>}
          <ul className="grid" style={{gap:12}}>
            {talks.map((t:any)=> (
              <li key={t.id} className="card" style={{padding:14}}>
                <div className="tag">{t.track || 'Talk'}</div>
                <div style={{fontWeight:700, marginTop:6}}>{t.title}</div>
                <div className="muted" style={{marginTop:4}}>Speaker: {t.speaker}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 style={{marginTop:0}}>Workshops</h2>
          {workshops.length===0 && <p className="muted">No workshops published yet.</p>}
          <ul className="grid" style={{gap:12}}>
            {workshops.map((w:any)=> (
              <li key={w.id} className="card" style={{padding:14}}>
                <div className="tag">Workshop</div>
                <div style={{fontWeight:700, marginTop:6}}>{w.title}</div>
                <div className="muted" style={{marginTop:4}}>Instructor: {w.instructor}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

