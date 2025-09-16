# Guild Con 2025 - Testing Checklist

## 🚀 Quick Test Procedure

### 1. Initial Setup Test
```bash
# Start services
docker compose up -d

# Check all services are running
docker compose ps

# Expected output: All services "Up"
# - guildcon-web-1
# - guildcon-directus-1
# - guildcon-db-1
```

### 2. Test URLs
- [ ] Website: http://localhost:8080
- [ ] Directus: http://localhost:8055

---

## 📱 Frontend Testing

### Homepage (`/`)
- [ ] Hero section displays correctly
- [ ] "Guild Con 2025" title visible
- [ ] Three CTA buttons present and working:
  - [ ] Get Tickets → External link
  - [ ] Submit a Talk → `/cfp`
  - [ ] Become a Sponsor → `/become-a-sponsor`
- [ ] Announcements section shows time-based alerts
- [ ] Quick links section has all navigation items
- [ ] Responsive on mobile (test at 375px width)

### Info Page (`/info`)
- [ ] Event details display (Date: November 22, 2025)
- [ ] Schedule table renders correctly
- [ ] All sections visible:
  - [ ] Event Details
  - [ ] Schedule
  - [ ] What to Bring
  - [ ] Code of Conduct
  - [ ] Contact
- [ ] Registration button links to external site

### Talks Page (`/talks`)
- [ ] Page loads without errors
- [ ] If no talks in CMS: Shows placeholder message
- [ ] If talks exist: Display with speaker info

### Workshops Page (`/workshops`)
- [ ] Two workshop cards display
- [ ] Each workshop shows:
  - [ ] Title and instructor
  - [ ] Time and capacity
  - [ ] Requirements
  - [ ] Registration button (external link)
- [ ] FAQ section renders

### CTF Page (`/ctf`)
- [ ] Tournament format information displays
- [ ] No registration form (removed)
- [ ] Links to Eventbrite for registration
- [ ] Rules and prizes sections visible

### CFP Page (`/cfp`)
- [ ] Information about submissions displays
- [ ] No submission form (removed)
- [ ] Links to Google Form
- [ ] Important dates listed

### Sponsors Page (`/sponsors`)
- [ ] Thank you message displays
- [ ] Sponsor tiers (Gold/Silver/Bronze) shown
- [ ] Each sponsor card is clickable
- [ ] Link to become-a-sponsor page

### Become a Sponsor (`/become-a-sponsor`)
- [ ] All tier information displays
- [ ] Benefits listed for each tier
- [ ] Contact information present
- [ ] Special sponsorship options shown

### CTF Bracket (`/ctf/bracket`)
- [ ] Bracket structure displays
- [ ] Auto-refresh every 10 seconds
- [ ] Shows matches by round (QF/SF/F)

### CTF Results (`/ctf/results`)
- [ ] Team standings table displays
- [ ] Match results shown by round
- [ ] Auto-refresh every 10 seconds
- [ ] Champion highlighted when tournament complete

---

## 🔐 Admin Testing

### Admin CTF Page (`/admin/ctf`)

#### Initial Access
- [ ] Page loads at `/admin/ctf`
- [ ] Admin token input field present
- [ ] Token saves to localStorage

#### CSV Import
1. Create test CSV file:
```csv
name,email,handle
John Doe,john@example.com,jdoe
Jane Smith,jane@example.com,jsmith
... (24 total entries)
```

2. Test import:
- [ ] File upload button works
- [ ] Import processes without errors
- [ ] Success message shows count
- [ ] Players appear in Directus

#### Team Management
- [ ] "Randomize 8×3" button visible
- [ ] Click creates 8 teams of 3 players
- [ ] Teams display in grid
- [ ] Team names are editable
- [ ] Changes save on blur

#### Bracket Generation
- [ ] "Generate Bracket" button works
- [ ] Creates 4 QF, 2 SF, 1 F match
- [ ] Matches display below teams

#### Score Entry
- [ ] Score input fields for each match
- [ ] Save button updates scores
- [ ] Winners auto-advance to next round

---

## 🔗 Integration Testing

### Directus Connection
- [ ] Content loads from CMS
- [ ] Service token authentication works
- [ ] CRUD operations on CTF data

### External Links
- [ ] All Eventbrite links open correctly
- [ ] Google Form link works
- [ ] Social media links functional

### Time-Based Features
Test by temporarily modifying date checks in code:
- [ ] CFP deadline warning (14 days before Oct 15)
- [ ] Event countdown (< 60 days)
- [ ] Early bird warning (20-30 days before)

---

## 🎨 Design & UX Testing

### Visual Elements
- [ ] Modern hacker theme applied
- [ ] Neon green (#00ff88) accents visible
- [ ] Gradient effects on hero/buttons
- [ ] Card hover effects work
- [ ] Animations smooth

### Typography
- [ ] Headers use correct sizes
- [ ] Text is readable
- [ ] Color contrast sufficient

### Responsive Design
Test at these breakpoints:
- [ ] Mobile: 375px
- [ ] Tablet: 768px
- [ ] Desktop: 1200px
- [ ] Wide: 1920px

---

## ⚡ Performance Testing

### Page Load Times
Target: < 3 seconds on 3G connection
- [ ] Homepage
- [ ] CTF Bracket (with data)
- [ ] Admin panel

### Resource Usage
- [ ] Check Docker stats: `docker stats`
- [ ] Memory usage < 512MB per container
- [ ] CPU usage normal

---

## 🔥 Stress Testing

### CTF Tournament Simulation
1. Import 24 test players
2. Randomize teams
3. Generate bracket
4. Enter scores rapidly
5. Check:
   - [ ] No data corruption
   - [ ] Bracket updates correctly
   - [ ] Public pages stay responsive

### Concurrent Users
- [ ] Open bracket in 5+ browser tabs
- [ ] Verify all update correctly
- [ ] No connection errors

---

## 🐛 Error Handling

### Missing Data
- [ ] Pages handle empty CMS data gracefully
- [ ] Appropriate placeholder messages shown

### Network Issues
- [ ] Test with Directus offline
- [ ] Pages show error messages
- [ ] No crashes

### Invalid Input
- [ ] CSV import with wrong format
- [ ] Non-numeric scores in matches
- [ ] Missing admin token

---

## 📋 Pre-Launch Checklist

### Environment Variables
- [ ] All required vars in `.env`
- [ ] Strong passwords set
- [ ] Admin token secure
- [ ] External URLs updated

### Security
- [ ] Admin routes protected
- [ ] CORS configured correctly
- [ ] No sensitive data in logs

### Content
- [ ] Directus has initial content
- [ ] Placeholder sponsors added
- [ ] Test announcements created

### Backup
- [ ] Backup script works
- [ ] Restore tested

---

## 🚨 Day-of-Event Testing

### Morning of Event (8:00 AM)
- [ ] All services running
- [ ] Import real attendee CSV
- [ ] Verify player count
- [ ] Test team randomization with subset

### Pre-Tournament (9:00 AM)
- [ ] Check-in players in Directus
- [ ] Verify exactly 24 checked in
- [ ] Randomize teams
- [ ] Review and rename if needed
- [ ] Generate bracket
- [ ] Test score entry

### During Tournament
- [ ] Monitor public bracket updates
- [ ] Check results page
- [ ] Watch server resources
- [ ] Have backup plan ready

---

## 📝 Test Data

### Sample CSV for Testing
Save as `test-players.csv`:
```csv
name,email,handle
Alice Anderson,alice@test.com,alice
Bob Brown,bob@test.com,bobby
Charlie Chen,charlie@test.com,cchen
Diana Davis,diana@test.com,dd
Eve Edwards,eve@test.com,eve
Frank Fisher,frank@test.com,ff
Grace Green,grace@test.com,gg
Henry Hill,henry@test.com,hh
Iris Ivan,iris@test.com,ii
Jack Johnson,jack@test.com,jj
Kate King,kate@test.com,kk
Leo Lee,leo@test.com,ll
Maya Martin,maya@test.com,mm
Noah Nelson,noah@test.com,nn
Olivia Owen,olivia@test.com,oo
Paul Park,paul@test.com,pp
Quinn Quick,quinn@test.com,qq
Rose Reed,rose@test.com,rr
Sam Smith,sam@test.com,ss
Tara Taylor,tara@test.com,tt
Uma Upton,uma@test.com,uu
Victor Vale,victor@test.com,vv
Wendy Wilson,wendy@test.com,ww
Xavier Xu,xavier@test.com,xx
```

### Test Match Scores
For bracket testing:
- QF1: 10-5
- QF2: 8-7
- QF3: 12-3
- QF4: 9-6
- SF1: 15-10
- SF2: 11-9
- Finals: 20-18

---

## 🆘 Emergency Procedures

### If CSV Import Fails
1. Check CSV format
2. Try smaller batch
3. Manual entry in Directus as backup

### If Randomization Fails
1. Verify 24 players checked in
2. Check console for errors
3. Manual team assignment in Directus

### If Bracket Generation Fails
1. Check existing matches in Directus
2. Clear and retry
3. Manual match creation as backup

### If Site Goes Down
1. Check Docker: `docker compose ps`
2. Restart services: `docker compose restart`
3. Check logs: `docker compose logs`
4. Failover to static HTML backup

---

## ✅ Sign-off

Testing completed by: _________________

Date: _________________

All critical features tested: [ ] Yes [ ] No

Ready for production: [ ] Yes [ ] No

Notes:
_________________________________________________
_________________________________________________
_________________________________________________