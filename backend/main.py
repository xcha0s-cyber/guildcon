from fastapi import FastAPI, Depends, HTTPException, status, Request, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
import hashlib
import secrets
import json
import os
import csv
from io import StringIO
from pathlib import Path
import markdown
import bleach

# Create necessary directories
Path("data").mkdir(exist_ok=True)
Path("static").mkdir(exist_ok=True)
Path("static/uploads").mkdir(exist_ok=True)
Path("templates").mkdir(exist_ok=True)

# Database setup
DATABASE_URL = "sqlite:///./data/guildcon.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(title="Guild Con 2025 Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = hashlib.sha256(os.getenv("ADMIN_PASSWORD", "changeme").encode()).hexdigest()

# Database Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class PageContent(Base):
    __tablename__ = "page_content"
    id = Column(Integer, primary_key=True, index=True)
    page_slug = Column(String, unique=True, index=True)
    title = Column(String)
    content = Column(Text)
    meta_description = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    type = Column(String)  # info, urgent, warning
    expires_at = Column(DateTime, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Talk(Base):
    __tablename__ = "talks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    speaker = Column(String)
    description = Column(Text)
    time = Column(String)
    track = Column(String)
    published = Column(Boolean, default=False)

class Workshop(Base):
    __tablename__ = "workshops"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    instructor = Column(String)
    description = Column(Text)
    requirements = Column(Text)
    capacity = Column(Integer)
    price = Column(Float)
    registration_url = Column(String)
    published = Column(Boolean, default=False)

class Sponsor(Base):
    __tablename__ = "sponsors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    tier = Column(String)  # platinum, gold, silver, bronze
    logo_url = Column(String)
    website = Column(String)
    description = Column(Text)
    order = Column(Integer, default=0)

class CTFTeam(Base):
    __tablename__ = "ctf_teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    seed = Column(Integer, nullable=True)
    players = relationship("CTFPlayer", back_populates="team")

class CTFPlayer(Base):
    __tablename__ = "ctf_players"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    handle = Column(String, nullable=True)
    checked_in = Column(Boolean, default=False)
    team_id = Column(Integer, ForeignKey("ctf_teams.id"), nullable=True)
    team = relationship("CTFTeam", back_populates="players")

class CTFMatch(Base):
    __tablename__ = "ctf_matches"
    id = Column(Integer, primary_key=True, index=True)
    round = Column(String)  # QF, SF, F
    index_in_round = Column(Integer)
    team_a_id = Column(Integer, ForeignKey("ctf_teams.id"), nullable=True)
    team_b_id = Column(Integer, ForeignKey("ctf_teams.id"), nullable=True)
    score_a = Column(Integer, nullable=True)
    score_b = Column(Integer, nullable=True)
    winner_id = Column(Integer, ForeignKey("ctf_teams.id"), nullable=True)
    next_match_id = Column(Integer, ForeignKey("ctf_matches.id"), nullable=True)
    next_slot = Column(String, nullable=True)  # A or B

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Simple token validation - in production use JWT
    if token != SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

def verify_admin(username: str, password: str) -> bool:
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    return username == ADMIN_USERNAME and password_hash == ADMIN_PASSWORD_HASH

# Pydantic models
class LoginRequest(BaseModel):
    username: str
    password: str

class PageContentUpdate(BaseModel):
    title: str
    content: str
    meta_description: Optional[str] = None

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    type: str = "info"
    expires_at: Optional[datetime] = None

class CTFPlayerImport(BaseModel):
    name: str
    email: str
    handle: Optional[str] = None

# Admin Panel HTML
ADMIN_LOGIN_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Guild Con Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }
        h1 { margin-bottom: 2rem; color: #333; text-align: center; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; color: #666; font-weight: 500; }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e8ed;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        input:focus { outline: none; border-color: #667eea; }
        button {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover { transform: translateY(-2px); }
        .error { color: #e74c3c; margin-top: 1rem; text-align: center; }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>🔐 Admin Login</h1>
        <form method="POST" action="/admin/login">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required autofocus>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
"""

# API Routes

@app.get("/")
def read_root():
    return {"message": "Guild Con 2025 API", "status": "running"}

@app.get("/admin", response_class=HTMLResponse)
def admin_login_page():
    return ADMIN_LOGIN_HTML

@app.post("/admin/login")
async def admin_login(username: str = Form(...), password: str = Form(...)):
    if verify_admin(username, password):
        # In production, use proper session management
        return RedirectResponse(url=f"/admin/dashboard?token={SECRET_KEY}", status_code=302)
    return HTMLResponse(content="Invalid credentials", status_code=401)

@app.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request, token: str):
    if token != SECRET_KEY:
        return RedirectResponse(url="/admin", status_code=302)

    # We'll create a proper admin template later
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Guild Con Admin Dashboard</title>
        <style>
            body {{ font-family: system-ui; margin: 0; background: #f5f5f5; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; }}
            .container {{ max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }}
            .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }}
            .card {{ background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            h1 {{ margin: 0; }}
            a {{ color: #667eea; text-decoration: none; }}
            a:hover {{ text-decoration: underline; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Guild Con Admin Dashboard</h1>
        </div>
        <div class="container">
            <div class="grid">
                <div class="card">
                    <h2>📝 Content Management</h2>
                    <ul>
                        <li><a href="/admin/pages?token={token}">Edit Pages</a></li>
                        <li><a href="/admin/announcements?token={token}">Manage Announcements</a></li>
                        <li><a href="/admin/talks?token={token}">Manage Talks</a></li>
                        <li><a href="/admin/workshops?token={token}">Manage Workshops</a></li>
                        <li><a href="/admin/sponsors?token={token}">Manage Sponsors</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h2>🎮 CTF Management</h2>
                    <ul>
                        <li><a href="/admin/ctf/players?token={token}">Import Players</a></li>
                        <li><a href="/admin/ctf/teams?token={token}">Manage Teams</a></li>
                        <li><a href="/admin/ctf/bracket?token={token}">Tournament Bracket</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </body>
    </html>
    """)

# API Endpoints for Frontend

@app.get("/api/announcements")
def get_announcements(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    announcements = db.query(Announcement).filter(
        Announcement.active == True,
        (Announcement.expires_at == None) | (Announcement.expires_at > now)
    ).all()
    return [{"id": a.id, "title": a.title, "content": a.content, "type": a.type} for a in announcements]

@app.get("/api/talks")
def get_talks(db: Session = Depends(get_db)):
    talks = db.query(Talk).filter(Talk.published == True).all()
    return [{"id": t.id, "title": t.title, "speaker": t.speaker, "description": t.description, "time": t.time, "track": t.track} for t in talks]

@app.get("/api/workshops")
def get_workshops(db: Session = Depends(get_db)):
    workshops = db.query(Workshop).filter(Workshop.published == True).all()
    return [{
        "id": w.id,
        "title": w.title,
        "instructor": w.instructor,
        "description": w.description,
        "requirements": w.requirements,
        "capacity": w.capacity,
        "price": w.price,
        "registration_url": w.registration_url
    } for w in workshops]

@app.get("/api/sponsors")
def get_sponsors(db: Session = Depends(get_db)):
    sponsors = db.query(Sponsor).order_by(Sponsor.order).all()
    result = {"platinum": [], "gold": [], "silver": [], "bronze": []}
    for s in sponsors:
        if s.tier in result:
            result[s.tier].append({
                "name": s.name,
                "logo_url": s.logo_url,
                "website": s.website,
                "description": s.description
            })
    return result

# CTF API Endpoints

@app.get("/api/ctf/teams")
def get_teams(db: Session = Depends(get_db)):
    teams = db.query(CTFTeam).all()
    return [{"id": t.id, "name": t.name, "seed": t.seed} for t in teams]

@app.get("/api/ctf/matches")
def get_matches(db: Session = Depends(get_db)):
    matches = db.query(CTFMatch).all()
    return [{
        "id": m.id,
        "round": m.round,
        "index_in_round": m.index_in_round,
        "team_a": m.team_a_id,
        "team_b": m.team_b_id,
        "score_a": m.score_a,
        "score_b": m.score_b,
        "winner": m.winner_id
    } for m in matches]

@app.post("/api/ctf/import")
async def import_players(file: UploadFile = File(...), db: Session = Depends(get_db), token: str = Depends(verify_token)):
    contents = await file.read()
    csv_data = StringIO(contents.decode())
    reader = csv.DictReader(csv_data)

    imported = 0
    for row in reader:
        player = CTFPlayer(
            name=row.get('name', ''),
            email=row.get('email', ''),
            handle=row.get('handle', ''),
            checked_in=False
        )
        db.add(player)
        imported += 1

    db.commit()
    return {"imported": imported, "total": imported}

@app.post("/api/ctf/randomize")
def randomize_teams(db: Session = Depends(get_db), token: str = Depends(verify_token)):
    # Get checked in players
    players = db.query(CTFPlayer).filter(CTFPlayer.checked_in == True).all()

    if len(players) != 24:
        raise HTTPException(status_code=400, detail=f"Need exactly 24 players, found {len(players)}")

    # Clear existing teams
    db.query(CTFTeam).delete()
    db.commit()

    # Create 8 teams
    import random
    random.shuffle(players)

    teams = []
    for i in range(8):
        team = CTFTeam(name=f"Team {i+1}", seed=i+1)
        db.add(team)
        db.commit()

        # Assign 3 players to each team
        for j in range(3):
            player_idx = i * 3 + j
            players[player_idx].team_id = team.id

        teams.append(team)

    db.commit()
    return {"ok": True, "teams": [{"id": t.id, "name": t.name} for t in teams]}

@app.post("/api/ctf/bracket")
def generate_bracket(db: Session = Depends(get_db), token: str = Depends(verify_token)):
    teams = db.query(CTFTeam).order_by(CTFTeam.seed).all()

    if len(teams) != 8:
        raise HTTPException(status_code=400, detail="Need exactly 8 teams")

    # Clear existing matches
    db.query(CTFMatch).delete()
    db.commit()

    # Create quarterfinals
    qf_matches = []
    for i in range(4):
        match = CTFMatch(
            round="QF",
            index_in_round=i+1,
            team_a_id=teams[i].id,
            team_b_id=teams[7-i].id
        )
        db.add(match)
        db.commit()
        qf_matches.append(match)

    # Create semifinals
    sf_matches = []
    for i in range(2):
        match = CTFMatch(
            round="SF",
            index_in_round=i+1
        )
        db.add(match)
        db.commit()
        sf_matches.append(match)

    # Create finals
    final = CTFMatch(round="F", index_in_round=1)
    db.add(final)
    db.commit()

    # Link matches
    qf_matches[0].next_match_id = sf_matches[0].id
    qf_matches[0].next_slot = "A"
    qf_matches[1].next_match_id = sf_matches[0].id
    qf_matches[1].next_slot = "B"
    qf_matches[2].next_match_id = sf_matches[1].id
    qf_matches[2].next_slot = "A"
    qf_matches[3].next_match_id = sf_matches[1].id
    qf_matches[3].next_slot = "B"

    sf_matches[0].next_match_id = final.id
    sf_matches[0].next_slot = "A"
    sf_matches[1].next_match_id = final.id
    sf_matches[1].next_slot = "B"

    db.commit()
    return {"ok": True}

@app.patch("/api/ctf/match/{match_id}")
def update_match_score(match_id: int, score_a: int, score_b: int, db: Session = Depends(get_db), token: str = Depends(verify_token)):
    match = db.query(CTFMatch).filter(CTFMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    match.score_a = score_a
    match.score_b = score_b

    # Determine winner
    if score_a > score_b:
        match.winner_id = match.team_a_id
        winner_id = match.team_a_id
    else:
        match.winner_id = match.team_b_id
        winner_id = match.team_b_id

    # Advance winner to next match
    if match.next_match_id and match.next_slot:
        next_match = db.query(CTFMatch).filter(CTFMatch.id == match.next_match_id).first()
        if next_match:
            if match.next_slot == "A":
                next_match.team_a_id = winner_id
            else:
                next_match.team_b_id = winner_id

    db.commit()
    return {"ok": True}

# Admin Template Routes

@app.get("/admin", response_class=HTMLResponse)
async def admin_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/admin/login")
async def admin_login(request: Request, username: str = Form(...), password: str = Form(...)):
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "guildcon2025")

    if username == admin_username and password == admin_password:
        token = secrets.token_urlsafe(32)
        # In production, store this token properly
        response = RedirectResponse(url="/admin/dashboard", status_code=303)
        response.set_cookie(key="admin_token", value=token, httponly=True)
        return response

    return templates.TemplateResponse("login.html", {
        "request": request,
        "error": "Invalid credentials"
    })

@app.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db)):
    # Check auth (simplified for now)
    token = request.cookies.get("admin_token")
    if not token:
        return RedirectResponse(url="/admin")

    # Get stats
    stats = {
        "ctf_players": db.query(CTFPlayer).count(),
        "talks": db.query(Talk).count(),
        "workshops": db.query(Workshop).count(),
        "sponsors": db.query(Sponsor).count()
    }

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "stats": stats
    })

@app.get("/admin/pages", response_class=HTMLResponse)
async def admin_pages(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("admin_token")
    if not token:
        return RedirectResponse(url="/admin")

    pages = db.query(PageContent).all()
    return templates.TemplateResponse("pages.html", {
        "request": request,
        "pages": pages
    })

@app.get("/admin/pages/edit/{slug}", response_class=HTMLResponse)
async def edit_page(request: Request, slug: str, db: Session = Depends(get_db)):
    token = request.cookies.get("admin_token")
    if not token:
        return RedirectResponse(url="/admin")

    page = db.query(PageContent).filter(PageContent.slug == slug).first()
    if not page:
        # Create new page
        page = PageContent(slug=slug, title=slug.title(), content="")
        db.add(page)
        db.commit()

    return templates.TemplateResponse("edit_page.html", {
        "request": request,
        "page": page
    })

@app.post("/admin/pages/save")
async def save_page(
    request: Request,
    slug: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    db: Session = Depends(get_db)
):
    token = request.cookies.get("admin_token")
    if not token:
        return RedirectResponse(url="/admin")

    page = db.query(PageContent).filter(PageContent.slug == slug).first()
    if page:
        page.title = title
        page.content = content
        page.updated_at = datetime.utcnow()
    else:
        page = PageContent(slug=slug, title=title, content=content)
        db.add(page)

    db.commit()
    return RedirectResponse(url="/admin/pages", status_code=303)

@app.get("/admin/ctf", response_class=HTMLResponse)
async def admin_ctf(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("admin_token")
    if not token:
        return RedirectResponse(url="/admin")

    players = db.query(CTFPlayer).all()
    teams = db.query(CTFTeam).all()
    matches = db.query(CTFMatch).all()

    # Add team members to teams
    for team in teams:
        team.members = db.query(CTFPlayer).filter(CTFPlayer.team_id == team.id).all()

    # Add team names to matches
    for match in matches:
        if match.team_a_id:
            match.team1 = db.query(CTFTeam).filter(CTFTeam.id == match.team_a_id).first()
        if match.team_b_id:
            match.team2 = db.query(CTFTeam).filter(CTFTeam.id == match.team_b_id).first()

    return templates.TemplateResponse("ctf_admin.html", {
        "request": request,
        "players": players,
        "teams": teams,
        "matches": matches
    })

@app.get("/admin/logout")
async def admin_logout():
    response = RedirectResponse(url="/admin")
    response.delete_cookie("admin_token")
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)