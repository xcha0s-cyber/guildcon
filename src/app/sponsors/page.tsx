"use client"
import { useState } from 'react'

export default function Sponsors(){
  const [hoveredSponsor, setHoveredSponsor] = useState<string | null>(null)

  // Placeholder sponsor data - will be fetched from Directus once set up
  const sponsors = {
    platinum: [
      { id: 'tech1', name: 'TechCorp Industries', logo: '🏢', url: 'https://example.com', description: 'Leading cybersecurity solutions' },
    ],
    gold: [
      { id: 'cyber1', name: 'CyberDefense Pro', logo: '🛡️', url: 'https://example.com', description: 'Enterprise security' },
      { id: 'data1', name: 'DataShield Inc', logo: '🔐', url: 'https://example.com', description: 'Data protection experts' },
    ],
    silver: [
      { id: 'sec1', name: 'SecureNet', logo: '🔒', url: 'https://example.com', description: 'Network security' },
      { id: 'cloud1', name: 'CloudGuard', logo: '☁️', url: 'https://example.com', description: 'Cloud security platform' },
      { id: 'pen1', name: 'PenTest Plus', logo: '🔍', url: 'https://example.com', description: 'Penetration testing' },
    ],
    bronze: [
      { id: 'tool1', name: 'HackTools', logo: '🔧', url: 'https://example.com' },
      { id: 'edu1', name: 'CyberEdu', logo: '📚', url: 'https://example.com' },
      { id: 'comm1', name: 'SecComm', logo: '💬', url: 'https://example.com' },
      { id: 'labs1', name: 'TechLabs', logo: '🔬', url: 'https://example.com' },
    ],
    community: [
      { id: 'local1', name: 'Pittsburgh Tech Council', logo: '🌆', url: 'https://example.com' },
      { id: 'local2', name: 'Steel City Infosec', logo: '🏭', url: 'https://example.com' },
    ]
  }

  return (
    <section className="sponsors-page">
      <style jsx>{`
        .sponsors-page {
          padding: 2rem 0;
          min-height: 80vh;
        }

        .sponsors-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .sponsors-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sponsors-header p {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .tier-section {
          margin-bottom: 3rem;
        }

        .tier-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          padding-bottom: 1rem;
        }

        .tier-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 2px;
          background: currentColor;
          opacity: 0.5;
        }

        .tier-title.platinum {
          color: #e5e4e2;
          text-shadow: 0 0 20px rgba(229, 228, 226, 0.5);
        }

        .tier-title.gold {
          color: #FFD700;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .tier-title.silver {
          color: #C0C0C0;
          text-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
        }

        .tier-title.bronze {
          color: #CD7F32;
          text-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
        }

        .tier-title.community {
          color: #00ff88;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }

        .sponsors-grid {
          display: grid;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .sponsors-grid.platinum {
          grid-template-columns: 1fr;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .sponsors-grid.gold {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .sponsors-grid.silver {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .sponsors-grid.bronze {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .sponsors-grid.community {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .sponsor-card {
          background: var(--bg-card);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .sponsor-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .sponsor-card:hover::before {
          transform: translateX(100%);
        }

        .sponsor-card.platinum {
          padding: 3rem;
          border-color: #e5e4e2;
          background: linear-gradient(135deg, rgba(229, 228, 226, 0.05) 0%, transparent 100%);
        }

        .sponsor-card.gold {
          border-color: rgba(255, 215, 0, 0.3);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%);
        }

        .sponsor-card.silver {
          border-color: rgba(192, 192, 192, 0.3);
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.05) 0%, transparent 100%);
        }

        .sponsor-card.bronze {
          border-color: rgba(205, 127, 50, 0.3);
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.05) 0%, transparent 100%);
        }

        .sponsor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.15);
          border-color: var(--accent-primary);
        }

        .sponsor-logo {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .sponsor-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .sponsor-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }

        .cta-section {
          text-align: center;
          margin-top: 4rem;
          padding: 3rem;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%);
          border-radius: 20px;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }

        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .cta-section p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .sponsors-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="sponsors-header">
        <h1>Our Amazing Sponsors</h1>
        <p>
          Guild Con 2025 is made possible by the generous support of these industry leaders
          who share our passion for cybersecurity and community.
        </p>
      </div>

      {/* Platinum Sponsors */}
      {sponsors.platinum.length > 0 && (
        <div className="tier-section">
          <h2 className="tier-title platinum">Platinum Sponsors</h2>
          <div className="sponsors-grid platinum">
            {sponsors.platinum.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card platinum"
                onMouseEnter={() => setHoveredSponsor(sponsor.id)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                <span className="sponsor-logo">{sponsor.logo}</span>
                <div className="sponsor-name">{sponsor.name}</div>
                {sponsor.description && (
                  <div className="sponsor-description">{sponsor.description}</div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Gold Sponsors */}
      {sponsors.gold.length > 0 && (
        <div className="tier-section">
          <h2 className="tier-title gold">Gold Sponsors</h2>
          <div className="sponsors-grid gold">
            {sponsors.gold.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card gold"
                onMouseEnter={() => setHoveredSponsor(sponsor.id)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                <span className="sponsor-logo">{sponsor.logo}</span>
                <div className="sponsor-name">{sponsor.name}</div>
                {sponsor.description && (
                  <div className="sponsor-description">{sponsor.description}</div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Silver Sponsors */}
      {sponsors.silver.length > 0 && (
        <div className="tier-section">
          <h2 className="tier-title silver">Silver Sponsors</h2>
          <div className="sponsors-grid silver">
            {sponsors.silver.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card silver"
                onMouseEnter={() => setHoveredSponsor(sponsor.id)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                <span className="sponsor-logo">{sponsor.logo}</span>
                <div className="sponsor-name">{sponsor.name}</div>
                {sponsor.description && (
                  <div className="sponsor-description">{sponsor.description}</div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bronze Sponsors */}
      {sponsors.bronze.length > 0 && (
        <div className="tier-section">
          <h2 className="tier-title bronze">Bronze Sponsors</h2>
          <div className="sponsors-grid bronze">
            {sponsors.bronze.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card bronze"
                onMouseEnter={() => setHoveredSponsor(sponsor.id)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                <span className="sponsor-logo">{sponsor.logo}</span>
                <div className="sponsor-name">{sponsor.name}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Community Partners */}
      {sponsors.community.length > 0 && (
        <div className="tier-section">
          <h2 className="tier-title community">Community Partners</h2>
          <div className="sponsors-grid community">
            {sponsors.community.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card"
                onMouseEnter={() => setHoveredSponsor(sponsor.id)}
                onMouseLeave={() => setHoveredSponsor(null)}
              >
                <span className="sponsor-logo">{sponsor.logo}</span>
                <div className="sponsor-name">{sponsor.name}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="cta-section">
        <h2>Join These Industry Leaders</h2>
        <p>
          Support the Pittsburgh security community and connect with the next generation of cybersecurity professionals.
        </p>
        <a href="/become-a-sponsor" className="btn primary">
          Explore Sponsorship Opportunities →
        </a>
      </div>
    </section>
  )
}