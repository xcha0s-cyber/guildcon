"use client"
import { useEffect, useState } from 'react'

interface Team {
  id: number
  name: string
  seed?: number
}

interface Match {
  id: number
  round: 'QF' | 'SF' | 'F'
  index_in_round: number
  team_a?: number
  team_b?: number
  score_a?: number
  score_b?: number
  winner?: number
}

export default function CTFBracket() {
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBracket()
    const interval = setInterval(loadBracket, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadBracket() {
    try {
      const [teamsRes, matchesRes] = await Promise.all([
        fetch('/api/ctf/teams'),
        fetch('/api/ctf/matches')
      ])
      const teamsData = await teamsRes.json()
      const matchesData = await matchesRes.json()
      setTeams(teamsData || [])
      setMatches(matchesData || [])
    } catch (e) {
      console.error('Failed to load bracket data')
    } finally {
      setLoading(false)
    }
  }

  const getTeamName = (id?: number) => {
    if (!id) return 'TBD'
    const team = teams.find(t => t.id === id)
    return team?.name || `Team ${id}`
  }

  const getMatchStatus = (match: Match) => {
    if (match.winner) return 'completed'
    if (match.team_a && match.team_b) return 'ready'
    return 'pending'
  }

  // Group matches by round
  const quarters = matches.filter(m => m.round === 'QF').sort((a, b) => a.index_in_round - b.index_in_round)
  const semis = matches.filter(m => m.round === 'SF').sort((a, b) => a.index_in_round - b.index_in_round)
  const finals = matches.filter(m => m.round === 'F')

  if (loading) {
    return (
      <section className="bracket-container">
        <h1>CTF Tournament Bracket</h1>
        <div style={{textAlign: 'center', padding: '2rem'}}>
          <div className="loading"></div>
          <p>Loading bracket data...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bracket-container">
      <style jsx>{`
        .bracket-container {
          padding: 2rem 0;
          min-height: 80vh;
          width: 100%;
        }

        .bracket-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .bracket-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bracket-info {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .bracket-wrapper {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 3rem 2rem;
          overflow-x: auto;
          border: 1px solid var(--border-color);
        }

        .bracket {
          display: grid;
          grid-template-columns: 1fr 60px 1fr 60px 1fr;
          gap: 2rem;
          min-width: 900px;
          max-width: 1400px;
          margin: 0 auto;
          align-items: center;
        }

        .round {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .round-title {
          text-align: center;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border-color);
        }

        .round-title.qf {
          color: #00d4ff;
        }

        .round-title.sf {
          color: #00ff88;
        }

        .round-title.f {
          color: #FFD700;
        }

        .match {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .match::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--border-color);
          transition: all 0.3s ease;
        }

        .match.completed::before {
          background: #00ff88;
        }

        .match.ready::before {
          background: #00d4ff;
          animation: pulse 2s infinite;
        }

        .match.pending::before {
          background: var(--border-color);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .match:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .match-header {
          background: var(--bg-primary);
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          text-align: center;
          border-bottom: 1px solid var(--border-color);
        }

        .match-content {
          padding: 0.5rem;
        }

        .team-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          margin: 0.25rem;
          border-radius: 8px;
          background: var(--bg-primary);
          transition: all 0.2s ease;
          min-height: 40px;
        }

        .team-row:hover {
          background: var(--bg-hover);
        }

        .team-row.winner {
          background: linear-gradient(90deg, rgba(0, 255, 136, 0.15) 0%, transparent 100%);
          border-left: 3px solid #00ff88;
          font-weight: 700;
        }

        .team-row.loser {
          opacity: 0.5;
        }

        .team-name {
          flex: 1;
          font-size: 0.95rem;
        }

        .team-score {
          font-weight: 700;
          font-size: 1.1rem;
          min-width: 40px;
          text-align: center;
          padding: 0.25rem 0.5rem;
          background: var(--bg-secondary);
          border-radius: 6px;
          color: var(--accent-secondary);
        }

        .connector {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .connector::before {
          content: '→';
          font-size: 2rem;
          color: var(--text-muted);
          opacity: 0.3;
        }

        .semifinals {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 100%;
        }

        .finals {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }

        .champion-section {
          text-align: center;
          margin-top: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
          border-radius: 20px;
          border: 2px solid #FFD700;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .champion-title {
          font-size: 1.5rem;
          color: #FFD700;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .champion-name {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        }

        .trophy-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-data {
          text-align: center;
          padding: 4rem;
          color: var(--text-muted);
        }

        .no-data h2 {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        @media (max-width: 1000px) {
          .bracket-wrapper {
            padding: 2rem 1rem;
          }

          .bracket {
            min-width: 800px;
          }
        }
      `}</style>

      <div className="bracket-header">
        <h1>CTF Tournament Bracket</h1>
        <div className="bracket-info">
          Live bracket • Auto-refreshes every 10 seconds
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="no-data">
          <h2>No bracket data yet</h2>
          <p>The tournament bracket will appear here once teams are randomized and bracket is generated.</p>
        </div>
      ) : (
        <>
          <div className="bracket-wrapper">
            <div className="bracket">
              {/* Quarterfinals */}
              <div className="round quarterfinals">
                <div className="round-title qf">Quarterfinals</div>
                {quarters.map((match, idx) => (
                  <div key={match.id} className={`match ${getMatchStatus(match)}`}>
                    <div className="match-header">Match {idx + 1}</div>
                    <div className="match-content">
                      <div className={`team-row ${match.winner === match.team_a ? 'winner' : match.winner && match.winner !== match.team_a ? 'loser' : ''}`}>
                        <span className="team-name">{getTeamName(match.team_a)}</span>
                        <span className="team-score">{match.score_a ?? '-'}</span>
                      </div>
                      <div className={`team-row ${match.winner === match.team_b ? 'winner' : match.winner && match.winner !== match.team_b ? 'loser' : ''}`}>
                        <span className="team-name">{getTeamName(match.team_b)}</span>
                        <span className="team-score">{match.score_b ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="connector"></div>

              {/* Semifinals */}
              <div className="round semifinals">
                <div className="round-title sf">Semifinals</div>
                {semis.map((match, idx) => (
                  <div key={match.id} className={`match ${getMatchStatus(match)}`}>
                    <div className="match-header">Match {idx + 1}</div>
                    <div className="match-content">
                      <div className={`team-row ${match.winner === match.team_a ? 'winner' : match.winner && match.winner !== match.team_a ? 'loser' : ''}`}>
                        <span className="team-name">{getTeamName(match.team_a)}</span>
                        <span className="team-score">{match.score_a ?? '-'}</span>
                      </div>
                      <div className={`team-row ${match.winner === match.team_b ? 'winner' : match.winner && match.winner !== match.team_b ? 'loser' : ''}`}>
                        <span className="team-name">{getTeamName(match.team_b)}</span>
                        <span className="team-score">{match.score_b ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="connector"></div>

              {/* Finals */}
              <div className="round finals">
                <div className="round-title f">Finals</div>
                {finals.map((match) => (
                  <div key={match.id} className={`match ${getMatchStatus(match)}`}>
                    <div className="match-header">Championship</div>
                    <div className="match-content">
                      <div className={`team-row ${match.winner === match.team_a ? 'winner' : match.winner && match.winner !== match.team_a ? 'loser' : ''}`}>
                        <span className="team-name">{getTeamName(match.team_a)}</span>
                        <span className="team-score">{match.score_a ?? '-'}</span>
                      </div>
                      <div className={`team-row ${match.winner === match.team_b ? 'winner' : match.winner && match.winner !== match.team_b ? 'loser' : ''}`}>
                        <span className="team-name">{getTeamName(match.team_b)}</span>
                        <span className="team-score">{match.score_b ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Champion Display */}
          {finals[0]?.winner && (
            <div className="champion-section">
              <div className="trophy-icon">🏆</div>
              <div className="champion-title">Champion</div>
              <div className="champion-name">{getTeamName(finals[0].winner)}</div>
            </div>
          )}
        </>
      )}
    </section>
  )
}