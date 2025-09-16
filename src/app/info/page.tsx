export default function InfoPage() {
  return (
    <section className="grid" style={{gap:24}}>
      <div>
        <h1>Event Information</h1>
        <p style={{fontSize:'1.1rem', marginTop:16}}>Everything you need to know about Guild Con 2025</p>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Event Details</h2>
        <div style={{lineHeight:1.8, marginTop:16}}>
          <p><strong>Date:</strong> November 22, 2025</p>
          <p><strong>Time:</strong> 9:00 AM - 6:00 PM</p>
          <p><strong>Location:</strong> Pittsburgh, PA (Venue TBD)</p>
          <p><strong>Format:</strong> In-person conference</p>
        </div>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Schedule</h2>
        <div style={{marginTop:16}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <tbody>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px', width:'120px'}}><strong>9:00 AM</strong></td>
                <td style={{padding:'12px 8px'}}>Registration & Breakfast</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>9:30 AM</strong></td>
                <td style={{padding:'12px 8px'}}>CTF Team Randomization</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>10:00 AM</strong></td>
                <td style={{padding:'12px 8px'}}>Opening Keynote</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>10:45 AM</strong></td>
                <td style={{padding:'12px 8px'}}>Talk Session 1 / Workshop 1 / CTF Quarterfinals</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>12:00 PM</strong></td>
                <td style={{padding:'12px 8px'}}>Lunch Break</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>1:00 PM</strong></td>
                <td style={{padding:'12px 8px'}}>Lightning Talks</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>2:00 PM</strong></td>
                <td style={{padding:'12px 8px'}}>Talk Session 2 / Workshop 2 / CTF Semifinals</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>3:30 PM</strong></td>
                <td style={{padding:'12px 8px'}}>Talk Session 3</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>4:30 PM</strong></td>
                <td style={{padding:'12px 8px'}}>CTF Finals</td>
              </tr>
              <tr style={{borderBottom:'1px solid #334'}}>
                <td style={{padding:'12px 8px'}}><strong>5:15 PM</strong></td>
                <td style={{padding:'12px 8px'}}>Closing Ceremony & CTF Awards</td>
              </tr>
              <tr>
                <td style={{padding:'12px 8px'}}><strong>6:00 PM</strong></td>
                <td style={{padding:'12px 8px'}}>After Party</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>What to Bring</h2>
        <ul style={{lineHeight:1.8, marginTop:16}}>
          <li>Laptop for CTF participation and workshops</li>
          <li>Power cables and adapters</li>
          <li>Note-taking materials</li>
          <li>Business cards for networking</li>
          <li>Curiosity and enthusiasm!</li>
        </ul>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Code of Conduct</h2>
        <p style={{lineHeight:1.8, marginTop:16}}>
          Guild Con is dedicated to providing a harassment-free conference experience for everyone.
          We do not tolerate harassment of conference participants in any form. Conference participants
          violating these rules may be sanctioned or expelled from the conference at the discretion of
          the conference organizers.
        </p>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Contact</h2>
        <div style={{lineHeight:1.8, marginTop:16}}>
          <p><strong>Email:</strong> info@guildcon.org</p>
          <p><strong>Twitter:</strong> @HackersGuildPGH</p>
          <p><strong>Discord:</strong> Join our server for updates</p>
        </div>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Registration</h2>
        <p style={{marginBottom:20}}>Get your tickets now! Limited spots available.</p>
        <a
          href="https://www.eventbrite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
          style={{display:'inline-block'}}
        >
          Register on Eventbrite →
        </a>
      </div>
    </section>
  )
}