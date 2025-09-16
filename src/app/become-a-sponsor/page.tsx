export default function BecomeASponsor() {
  return (
    <section className="grid" style={{gap:24}}>
      <div>
        <h1>Become a Sponsor</h1>
        <p style={{fontSize:'1.1rem', marginTop:16}}>
          Support the Pittsburgh security community and connect with talented professionals
        </p>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Why Sponsor Guild Con?</h2>
        <ul style={{lineHeight:1.8, marginTop:16}}>
          <li>Connect with 200+ security professionals and hackers</li>
          <li>Showcase your brand to the Pittsburgh tech community</li>
          <li>Support education and skill development in cybersecurity</li>
          <li>Recruit talented engineers and security researchers</li>
          <li>Demonstrate your commitment to the security community</li>
        </ul>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Sponsorship Tiers</h2>

        <div style={{marginTop:24, borderBottom:'1px solid #334', paddingBottom:20}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <h3 style={{color:'#FFD700'}}>Gold Sponsor</h3>
            <span className="tag">$5,000+</span>
          </div>
          <ul style={{lineHeight:1.8, marginTop:12}}>
            <li>Prime logo placement on main stage and website</li>
            <li>2 speaking slots (45 minutes each)</li>
            <li>Booth space in main area</li>
            <li>10 conference tickets</li>
            <li>Logo on all attendee swag</li>
            <li>Social media announcements</li>
            <li>Access to opt-in attendee list</li>
          </ul>
        </div>

        <div style={{marginTop:24, borderBottom:'1px solid #334', paddingBottom:20}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <h3 style={{color:'#C0C0C0'}}>Silver Sponsor</h3>
            <span className="tag">$2,500+</span>
          </div>
          <ul style={{lineHeight:1.8, marginTop:12}}>
            <li>Logo placement on website and signage</li>
            <li>1 speaking slot (45 minutes)</li>
            <li>Booth space</li>
            <li>5 conference tickets</li>
            <li>Logo on select swag</li>
            <li>Social media mentions</li>
          </ul>
        </div>

        <div style={{marginTop:24, borderBottom:'1px solid #334', paddingBottom:20}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <h3 style={{color:'#CD7F32'}}>Bronze Sponsor</h3>
            <span className="tag">$1,000+</span>
          </div>
          <ul style={{lineHeight:1.8, marginTop:12}}>
            <li>Logo on website</li>
            <li>2 conference tickets</li>
            <li>Recognition during opening/closing</li>
            <li>Social media mention</li>
          </ul>
        </div>

        <div style={{marginTop:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <h3>Special Sponsorships</h3>
          </div>
          <ul style={{lineHeight:1.8, marginTop:12}}>
            <li><strong>CTF Sponsor ($3,000)</strong> - Name the CTF, provide prizes, branded CTF materials</li>
            <li><strong>Breakfast Sponsor ($1,500)</strong> - Exclusive breakfast branding</li>
            <li><strong>Lunch Sponsor ($2,000)</strong> - Exclusive lunch branding</li>
            <li><strong>After Party Sponsor ($2,500)</strong> - Host the closing celebration</li>
            <li><strong>Workshop Sponsor ($1,000)</strong> - Sponsor specific workshop track</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>What Sponsors Are Saying</h2>
        <blockquote style={{borderLeft:'3px solid #0f8', paddingLeft:16, marginTop:16}}>
          <p style={{fontStyle:'italic', lineHeight:1.6}}>
            "Sponsoring Guild Con gave us direct access to the talent we needed.
            We made three key hires from connections at the event."
          </p>
          <footer style={{marginTop:12, opacity:0.8}}>— CTO, Regional Tech Company</footer>
        </blockquote>
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Ready to Sponsor?</h2>
        <p style={{lineHeight:1.8, marginTop:16}}>
          Contact our sponsorship team to discuss how we can create a package that meets your goals.
        </p>
        <div style={{marginTop:20}}>
          <p><strong>Email:</strong> sponsors@guildcon.org</p>
          <p><strong>Phone:</strong> (412) 555-0123</p>
        </div>
        <a
          href="mailto:sponsors@guildcon.org?subject=Guild Con 2025 Sponsorship Inquiry"
          className="btn primary"
          style={{display:'inline-block', marginTop:20}}
        >
          Contact Sponsorship Team →
        </a>
      </div>

      <div className="card" style={{maxWidth:720, background:'rgba(15, 255, 136, 0.05)', border:'1px solid rgba(15, 255, 136, 0.3)'}}>
        <h3>Limited Availability</h3>
        <p style={{lineHeight:1.6, marginTop:12}}>
          Gold and special sponsorship slots are limited. Secure your sponsorship early to ensure
          maximum visibility and the full range of benefits.
        </p>
      </div>
    </section>
  )
}