export default function CFP(){
  return (
    <section className="grid" style={{gap:24}}>
      <div>
        <h1>Call for Papers</h1>
        <p style={{fontSize:'1.1rem', marginTop:16}}>Share your knowledge at Guild Con 2025!</p>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>We're Looking For</h2>
        <div style={{marginTop:16, marginBottom:24}}>
          <h3 style={{marginBottom:12}}>Full Presentations (45 minutes)</h3>
          <ul style={{lineHeight:1.8, marginBottom:20}}>
            <li>Security research and analysis</li>
            <li>Tool demonstrations</li>
            <li>Vulnerability discoveries</li>
            <li>Defense strategies</li>
            <li>Red team/Blue team experiences</li>
          </ul>

          <h3 style={{marginBottom:12}}>Lightning Talks (15 minutes)</h3>
          <ul style={{lineHeight:1.8}}>
            <li>Quick tips and tricks</li>
            <li>Tool introductions</li>
            <li>War stories</li>
            <li>Work-in-progress research</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Important Dates</h2>
        <ul style={{lineHeight:2}}>
          <li><strong>CFP Opens:</strong> September 1, 2025</li>
          <li><strong>CFP Closes:</strong> October 15, 2025</li>
          <li><strong>Speaker Notification:</strong> October 25, 2025</li>
          <li><strong>Conference Date:</strong> November 22, 2025</li>
        </ul>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Submit Your Proposal</h2>
        <p style={{marginBottom:20}}>Ready to share your expertise? Submit your talk proposal through our Google Form.</p>
        <a
          href="https://docs.google.com/forms"
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
          style={{display:'inline-block'}}
        >
          Submit Proposal →
        </a>
        <p style={{marginTop:16, fontSize:'0.9rem', opacity:0.8}}>All submissions will be reviewed by our program committee</p>
      </div>
    </section>
  )
}
