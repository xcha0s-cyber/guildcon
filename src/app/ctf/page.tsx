export default function CTF(){
  return (
    <section className="grid" style={{gap:24}}>
      <div>
        <h1>Capture The Flag Competition</h1>
        <p style={{fontSize:'1.1rem', marginTop:16}}>Test your skills in our elimination-style CTF tournament!</p>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Tournament Format</h2>
        <ul style={{lineHeight:1.8}}>
          <li>24 players maximum</li>
          <li>Randomly divided into 8 teams of 3 on event day</li>
          <li>Elimination bracket: Quarterfinals → Semifinals → Finals</li>
          <li>In-person attendance required</li>
          <li>Check-in starts at 9:00 AM on November 22</li>
        </ul>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>How to Register</h2>
        <p style={{marginBottom:16}}>CTF participation is included with your conference ticket. Register for Guild Con to secure your spot!</p>
        <a
          href="https://www.eventbrite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
          style={{display:'inline-block'}}
        >
          Register on Eventbrite →
        </a>
        <p style={{marginTop:16, fontSize:'0.9rem', opacity:0.8}}>Note: Only paid conference attendees can participate in the CTF</p>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Prizes</h2>
        <ul style={{lineHeight:1.8}}>
          <li>1st Place: TBD</li>
          <li>2nd Place: TBD</li>
          <li>3rd Place: TBD</li>
        </ul>
      </div>
    </section>
  )
}
