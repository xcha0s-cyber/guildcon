export default function Workshops() {
  // Workshop data - will be managed via Directus
  const workshops = [
    {
      id: 1,
      title: "Hardware Hacking 101",
      instructor: "Jane Doe",
      time: "10:45 AM - 12:00 PM",
      capacity: 10,
      price: "$50",
      description: "Learn the basics of hardware hacking, including UART, JTAG, and SPI interfaces.",
      requirements: "Bring a laptop with USB ports. Hardware kits will be provided.",
      registrationUrl: "https://www.eventbrite.com"
    },
    {
      id: 2,
      title: "Advanced Web Application Pentesting",
      instructor: "John Smith",
      time: "2:00 PM - 3:30 PM",
      capacity: 10,
      price: "$50",
      description: "Deep dive into modern web app vulnerabilities and exploitation techniques.",
      requirements: "Laptop with Kali Linux or similar. Basic web security knowledge required.",
      registrationUrl: "https://www.eventbrite.com"
    }
  ]

  return (
    <section className="grid" style={{gap:24}}>
      <div>
        <h1>Workshops</h1>
        <p style={{fontSize:'1.1rem', marginTop:16}}>
          Hands-on learning experiences with expert instructors
        </p>
      </div>

      <div className="card" style={{maxWidth:720, background:'rgba(15, 255, 136, 0.05)', border:'1px solid rgba(15, 255, 136, 0.3)'}}>
        <h3>Workshop Information</h3>
        <ul style={{lineHeight:1.8, marginTop:12}}>
          <li>Limited to 10 participants per workshop</li>
          <li>$50 per workshop (includes materials)</li>
          <li>Runs parallel to talk sessions</li>
          <li>Pre-registration required</li>
        </ul>
      </div>

      <div className="grid" style={{gap:20}}>
        {workshops.map((workshop) => (
          <div key={workshop.id} className="card" style={{maxWidth:720}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', flexWrap:'wrap', gap:12}}>
              <div>
                <h2 style={{marginTop:0}}>{workshop.title}</h2>
                <p style={{opacity:0.8}}>Instructor: {workshop.instructor}</p>
              </div>
              <div style={{textAlign:'right'}}>
                <span className="tag" style={{marginBottom:8, display:'inline-block'}}>{workshop.time}</span>
                <br />
                <span className="tag">{workshop.capacity} spots • {workshop.price}</span>
              </div>
            </div>

            <div style={{marginTop:20}}>
              <h3>Description</h3>
              <p style={{lineHeight:1.6}}>{workshop.description}</p>
            </div>

            <div style={{marginTop:20}}>
              <h3>Requirements</h3>
              <p style={{lineHeight:1.6}}>{workshop.requirements}</p>
            </div>

            <div style={{marginTop:24}}>
              <a
                href={workshop.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
                style={{display:'inline-block'}}
              >
                Register for Workshop →
              </a>
              <p style={{marginTop:12, fontSize:'0.9rem', opacity:0.8}}>
                Registration handled through Eventbrite. Workshop fee is separate from conference ticket.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{maxWidth:720}}>
        <h2>Workshop FAQ</h2>
        <div style={{marginTop:16}}>
          <h3>Do I need a conference ticket to attend workshops?</h3>
          <p style={{lineHeight:1.6, marginTop:8}}>
            Yes, workshops are add-ons to the main conference. You must have a conference ticket first.
          </p>

          <h3 style={{marginTop:20}}>What if a workshop is full?</h3>
          <p style={{lineHeight:1.6, marginTop:8}}>
            Join the waitlist on Eventbrite. We'll notify you if spots become available.
          </p>

          <h3 style={{marginTop:20}}>Can I attend multiple workshops?</h3>
          <p style={{lineHeight:1.6, marginTop:8}}>
            Workshops run parallel to talk sessions, so you can only attend workshops that don't conflict with each other.
          </p>

          <h3 style={{marginTop:20}}>Are recordings available?</h3>
          <p style={{lineHeight:1.6, marginTop:8}}>
            Workshops are hands-on experiences and are not recorded. The value is in the interactive learning.
          </p>
        </div>
      </div>
    </section>
  )
}