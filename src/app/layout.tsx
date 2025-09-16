import './globals.css'

export const metadata = {
  title: 'Guild Con 2025 - Hackers Guild PGH',
  description: 'Join us for Guild Con 2025 - Pittsburgh\'s premier security conference celebrating Hackers Guild PGH\'s 1st birthday. November 22, 2025.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper">
          <header className="gc-header">
            <div className="container">
              <a className="brand" href="/">
                <span>Guild Con 2025</span>
              </a>
              <nav className="nav">
                <a href="/info">Info</a>
                <a href="/talks">Talks</a>
                <a href="/workshops">Workshops</a>
                <a href="/ctf">CTF</a>
                <a href="/cfp">CFP</a>
                <a href="/sponsors">Sponsors</a>
              </nav>
            </div>
          </header>
          <main className="main-content">
            <div className="container">
              {children}
            </div>
          </main>
          <footer className="gc-footer">
            <div className="container">
              <div>
                <span>© 2025 Hackers Guild PGH</span>
                <span className="muted" style={{marginLeft: '1rem'}}>November 22, 2025 • Pittsburgh, PA</span>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <a href="/become-a-sponsor" className="muted">Become a Sponsor</a>
                <a href="/ctf/bracket" className="muted">Live Bracket</a>
                <a href="/ctf/results" className="muted">CTF Results</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
