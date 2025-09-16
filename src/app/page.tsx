import { ContentAPI } from '@/lib/directus'

async function getData(){
  try {
    const [settings, anns] = await Promise.all([
      ContentAPI.settings().catch(()=>({ data:null })),
      ContentAPI.announcements().catch(()=>({ data:[] }))
    ])
    return { settings: settings?.data, anns: anns?.data || [] }
  } catch { return { settings:null, anns:[] } }
}

function getTimeBasedAnnouncements() {
  const now = new Date()
  const eventDate = new Date('2025-11-22')
  const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const announcements = []

  // Dynamic announcements based on time
  if (daysUntilEvent > 0 && daysUntilEvent <= 60) {
    announcements.push({
      id: 'countdown',
      type: 'Event',
      title: `${daysUntilEvent} days until Guild Con!`,
      priority: 'info'
    })
  }

  // CFP deadline (Oct 15)
  const cfpDeadline = new Date('2025-10-15')
  const daysUntilCFP = Math.ceil((cfpDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntilCFP > 0 && daysUntilCFP <= 14) {
    announcements.push({
      id: 'cfp-deadline',
      type: 'CFP',
      title: `CFP closes in ${daysUntilCFP} days!`,
      priority: 'urgent'
    })
  } else if (daysUntilCFP <= 0 && daysUntilCFP > -7) {
    announcements.push({
      id: 'cfp-closed',
      type: 'CFP',
      title: 'CFP is now closed',
      priority: 'info'
    })
  }

  // Early bird (30 days before event)
  if (daysUntilEvent > 20 && daysUntilEvent <= 30) {
    announcements.push({
      id: 'early-bird',
      type: 'Tickets',
      title: 'Early bird pricing ends soon!',
      priority: 'urgent'
    })
  }

  // Workshop registration
  if (daysUntilEvent > 0 && daysUntilEvent <= 45) {
    announcements.push({
      id: 'workshops',
      type: 'Workshops',
      title: 'Workshop registration is open!',
      priority: 'info'
    })
  }

  return announcements
}

export default async function Home() {
  const { settings, anns } = await getData()
  const heroTitle = settings?.hero_title || 'Guild Con 2025'
  const heroSubtitle = settings?.hero_subtitle || 'Hackers Guild PGH turns 1 — join us November 22, 2025!'

  // Combine CMS announcements with time-based ones
  const timeBasedAnns = getTimeBasedAnnouncements()
  const allAnnouncements = [...timeBasedAnns, ...anns]

  return (
    <section className="grid" style={{gap:20}}>
      <div className="hero">
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
        <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:20}}>
          <a className="btn primary" href="https://www.eventbrite.com" target="_blank" rel="noopener noreferrer">Get Tickets</a>
          <a className="btn" href="/cfp">Submit a Talk</a>
          <a className="btn" href="/become-a-sponsor">Become a Sponsor</a>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h2 style={{marginTop:0}}>Announcements</h2>
          {allAnnouncements.length === 0 && <p className="muted">No announcements yet.</p>}
          <ul className="grid" style={{gap:12}}>
            {allAnnouncements.slice(0,5).map((a:any)=>(
              <li key={a.id} className="card" style={{
                padding:12,
                borderLeft: a.priority === 'urgent' ? '3px solid #ff4444' :
                           a.priority === 'info' ? '3px solid #0f8' : 'none'
              }}>
                <div className="tag" style={{
                  background: a.priority === 'urgent' ? 'rgba(255,68,68,0.2)' : undefined
                }}>{a.type}</div>
                <div style={{fontWeight:700, marginTop:6}}>{a.title}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 style={{marginTop:0}}>Quick Links</h2>
          <ul className="grid" style={{gap:8}}>
            <li><a className="btn" href="/info">Event Info & Schedule</a></li>
            <li><a className="btn" href="/talks">Talks</a></li>
            <li><a className="btn" href="/workshops">Workshops</a></li>
            <li><a className="btn" href="/ctf">CTF Competition</a></li>
            <li><a className="btn" href="/cfp">Call for Papers</a></li>
            <li><a className="btn" href="/sponsors">Our Sponsors</a></li>
            <li><a className="btn" href="/ctf/bracket">Live CTF Bracket</a></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
