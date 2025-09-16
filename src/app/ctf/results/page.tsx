"use client"
import { useEffect, useState } from 'react'

export default function CTFResults() {
  const [teams, setTeams] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadData() {
    try {
      const [teamsRes, matchesRes] = await Promise.all([
        fetch('/api/ctf/teams'),
        fetch('/api/ctf/matches')
      ])
      const teamsData = await teamsRes.json()
      const matchesData = await matchesRes.json()
      setTeams(teamsData)
      setMatches(matchesData)
    } catch (e) {
      console.error('Failed to load CTF data')
    } finally {
      setLoading(false)
    }
  }

  const getTeamName = (id?: number) => {
    const team = teams.find(t => t.id === id)
    return team?.name || `Team ${id || '?'}`
  }

  const getMatchWinner = (match: any) => {
    if (!match.winner) return null
    return getTeamName(match.winner)
  }

  // Group matches by round
  const quarters = matches.filter(m => m.round === 'QF')
  const semis = matches.filter(m => m.round === 'SF')
  const finals = matches.filter(m => m.round === 'F')

  // Calculate standings
  const teamStats = teams.map(team => {
    const wins = matches.filter(m => m.winner === team.id).length
    const losses = matches.filter(m =>
      (m.team_a === team.id || m.team_b === team.id) &&
      m.winner && m.winner !== team.id
    ).length
    return { ...team, wins, losses }
  }).sort((a, b) => b.wins - a.wins)

  if (loading) {
    return (
      <section className="grid" style={{gap:24}}>
        <h1>CTF Tournament Results</h1>
        <p>Loading tournament data...</p>
      </section>
    )
  }

  return (
    <section className="grid" style={{gap:24}}>
      <div>
        <h1>CTF Tournament Results</h1>
        <p style={{fontSize:'1.1rem', marginTop:16}}>Live tournament standings and match results</p>
      </div>

      {/* Current Champion */}
      {finals.length > 0 && finals[0].winner && (
        <div className="card" style={{
          maxWidth:720,
          background:'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.05))',
          border:'2px solid #FFD700',
          textAlign:'center'
        }}>
          <h2 style={{color:'#FFD700', marginBottom:8}}>🏆 CHAMPION 🏆</h2>
          <h3 style={{fontSize:'1.8rem', margin:0}}>{getTeamName(finals[0].winner)}</h3>
        </div>
      )}

      {/* Team Standings */}
      <div className="card" style={{maxWidth:720}}>
        <h2>Team Standings</h2>
        <table style={{width:'100%', borderCollapse:'collapse', marginTop:16}}>
          <thead>
            <tr style={{borderBottom:'2px solid #334'}}>
              <th style={{padding:'12px 8px', textAlign:'left'}}>Rank</th>
              <th style={{padding:'12px 8px', textAlign:'left'}}>Team</th>
              <th style={{padding:'12px 8px', textAlign:'center'}}>Wins</th>
              <th style={{padding:'12px 8px', textAlign:'center'}}>Losses</th>
            </tr>
          </thead>
          <tbody>
            {teamStats.map((team, i) => (
              <tr key={team.id} style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}>
                  {i === 0 && '🥇'}
                  {i === 1 && '🥈'}
                  {i === 2 && '🥉'}
                  {i > 2 && `#${i + 1}`}
                </td>
                <td style={{padding:'12px 8px', fontWeight:600}}>{team.name}</td>
                <td style={{padding:'12px 8px', textAlign:'center'}}>{team.wins}</td>
                <td style={{padding:'12px 8px', textAlign:'center'}}>{team.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Results */}
      <div className="card" style={{maxWidth:720}}>
        <h2>Match Results</h2>

        {finals.length > 0 && (
          <div style={{marginTop:20}}>
            <h3 style={{color:'#FFD700'}}>Finals</h3>
            {finals.map(m => (
              <div key={m.id} className="card" style={{padding:12, marginTop:8}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span>{getTeamName(m.team_a)}</span>
                  <span style={{fontWeight:700}}>{m.score_a ?? '-'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4}}>
                  <span>{getTeamName(m.team_b)}</span>
                  <span style={{fontWeight:700}}>{m.score_b ?? '-'}</span>
                </div>
                {m.winner && (
                  <div style={{marginTop:8, paddingTop:8, borderTop:'1px solid #334', color:'#0f8'}}>
                    Winner: {getTeamName(m.winner)} 🏆
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {semis.length > 0 && (
          <div style={{marginTop:20}}>
            <h3 style={{color:'#C0C0C0'}}>Semifinals</h3>
            {semis.map(m => (
              <div key={m.id} className="card" style={{padding:12, marginTop:8}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span>{getTeamName(m.team_a)}</span>
                  <span style={{fontWeight:700}}>{m.score_a ?? '-'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4}}>
                  <span>{getTeamName(m.team_b)}</span>
                  <span style={{fontWeight:700}}>{m.score_b ?? '-'}</span>
                </div>
                {m.winner && (
                  <div style={{marginTop:8, paddingTop:8, borderTop:'1px solid #334', opacity:0.8}}>
                    Winner: {getTeamName(m.winner)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {quarters.length > 0 && (
          <div style={{marginTop:20}}>
            <h3 style={{color:'#CD7F32'}}>Quarterfinals</h3>
            {quarters.map(m => (
              <div key={m.id} className="card" style={{padding:12, marginTop:8}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span>{getTeamName(m.team_a)}</span>
                  <span style={{fontWeight:700}}>{m.score_a ?? '-'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4}}>
                  <span>{getTeamName(m.team_b)}</span>
                  <span style={{fontWeight:700}}>{m.score_b ?? '-'}</span>
                </div>
                {m.winner && (
                  <div style={{marginTop:8, paddingTop:8, borderTop:'1px solid #334', opacity:0.8}}>
                    Winner: {getTeamName(m.winner)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{textAlign:'center', marginTop:20}}>
        <p style={{opacity:0.6, fontSize:'0.9rem'}}>Page auto-refreshes every 10 seconds</p>
      </div>
    </section>
  )
}