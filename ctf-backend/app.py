#!/usr/bin/env python3
"""
Minimal CTF Tournament Backend for Guild Con 2025
Only handles tournament bracket and scoring - no complex features
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import csv
import json
import os
import random
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'guildcon2025-ctf-secret-key')

# Simple file-based storage (no database needed)
DATA_FILE = 'ctf_data.json'

def load_data():
    """Load CTF data from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        'players': [],
        'teams': [],
        'matches': [],
        'bracket': {}
    }

def save_data(data):
    """Save CTF data to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def admin_required(f):
    """Simple admin authentication decorator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    """Public bracket view"""
    data = load_data()
    return render_template('bracket.html',
                         teams=data['teams'],
                         matches=data['matches'],
                         public=True)

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Simple admin login"""
    if request.method == 'POST':
        password = request.form.get('password')
        # Simple password check - change this!
        if password == os.environ.get('ADMIN_PASSWORD', 'ctfadmin2025'):
            session['is_admin'] = True
            return redirect(url_for('admin'))
    return render_template('login.html')

@app.route('/admin/logout')
def admin_logout():
    """Admin logout"""
    session.pop('is_admin', None)
    return redirect(url_for('index'))

@app.route('/admin')
@admin_required
def admin():
    """Admin dashboard"""
    data = load_data()
    return render_template('admin.html', data=data)

@app.route('/admin/import', methods=['POST'])
@admin_required
def import_players():
    """Import players from CSV"""
    file = request.files.get('csv_file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    data = load_data()
    data['players'] = []

    # Parse CSV
    stream = file.stream.read().decode("UTF8")
    reader = csv.DictReader(stream.splitlines())

    for row in reader:
        # Adjust these field names based on Eventbrite export
        player = {
            'id': len(data['players']) + 1,
            'name': row.get('Name', row.get('Full Name', '')),
            'email': row.get('Email', row.get('Email Address', '')),
            'checked_in': False
        }
        if player['name'] and player['email']:
            data['players'].append(player)

    save_data(data)
    return jsonify({'message': f'Imported {len(data["players"])} players'})

@app.route('/admin/checkin/<int:player_id>', methods=['POST'])
@admin_required
def checkin_player(player_id):
    """Check in a player"""
    data = load_data()
    for player in data['players']:
        if player['id'] == player_id:
            player['checked_in'] = not player['checked_in']
            save_data(data)
            return jsonify({'success': True})
    return jsonify({'error': 'Player not found'}), 404

@app.route('/admin/randomize', methods=['POST'])
@admin_required
def randomize_teams():
    """Randomly assign checked-in players to teams"""
    data = load_data()

    # Get checked-in players
    checked_in = [p for p in data['players'] if p['checked_in']]

    if len(checked_in) != 24:
        return jsonify({'error': f'Need exactly 24 players, found {len(checked_in)}'}), 400

    # Shuffle and create teams
    random.shuffle(checked_in)
    data['teams'] = []

    team_names = [
        "Binary Bandits", "Stack Smashers", "Heap Hunters", "Root Runners",
        "Shell Shockers", "Buffer Busters", "Exploit Eagles", "Pwn Panthers"
    ]

    for i in range(8):
        team = {
            'id': i + 1,
            'name': team_names[i],
            'members': checked_in[i*3:(i+1)*3],
            'seed': i + 1
        }
        data['teams'].append(team)

    save_data(data)
    return jsonify({'message': 'Teams randomized successfully'})

@app.route('/admin/bracket', methods=['POST'])
@admin_required
def generate_bracket():
    """Generate tournament bracket"""
    data = load_data()

    if len(data['teams']) != 8:
        return jsonify({'error': 'Need exactly 8 teams'}), 400

    # Create matches
    data['matches'] = []
    match_id = 1

    # Quarterfinals (4 matches)
    for i in range(4):
        match = {
            'id': match_id,
            'round': 'Quarterfinals',
            'team1_id': data['teams'][i*2]['id'],
            'team2_id': data['teams'][i*2+1]['id'],
            'team1_score': 0,
            'team2_score': 0,
            'winner_id': None,
            'next_match_id': 5 + (i // 2)  # Semifinals
        }
        data['matches'].append(match)
        match_id += 1

    # Semifinals (2 matches)
    for i in range(2):
        match = {
            'id': match_id,
            'round': 'Semifinals',
            'team1_id': None,  # Will be filled by winners
            'team2_id': None,
            'team1_score': 0,
            'team2_score': 0,
            'winner_id': None,
            'next_match_id': 7  # Finals
        }
        data['matches'].append(match)
        match_id += 1

    # Finals (1 match)
    match = {
        'id': match_id,
        'round': 'Finals',
        'team1_id': None,
        'team2_id': None,
        'team1_score': 0,
        'team2_score': 0,
        'winner_id': None,
        'next_match_id': None
    }
    data['matches'].append(match)

    save_data(data)
    return jsonify({'message': 'Bracket generated successfully'})

@app.route('/admin/match/<int:match_id>', methods=['POST'])
@admin_required
def update_match():
    """Update match scores"""
    data = load_data()
    match_id = request.json.get('match_id')
    team1_score = request.json.get('team1_score', 0)
    team2_score = request.json.get('team2_score', 0)

    for match in data['matches']:
        if match['id'] == match_id:
            match['team1_score'] = team1_score
            match['team2_score'] = team2_score

            # Determine winner
            if team1_score > team2_score:
                match['winner_id'] = match['team1_id']
            elif team2_score > team1_score:
                match['winner_id'] = match['team2_id']
            else:
                match['winner_id'] = None

            # Advance winner to next match
            if match['winner_id'] and match['next_match_id']:
                for next_match in data['matches']:
                    if next_match['id'] == match['next_match_id']:
                        # Place winner in appropriate slot
                        if match_id % 2 == 1:  # Odd match IDs go to team1
                            next_match['team1_id'] = match['winner_id']
                        else:  # Even match IDs go to team2
                            next_match['team2_id'] = match['winner_id']
                        break

            save_data(data)
            return jsonify({'success': True})

    return jsonify({'error': 'Match not found'}), 404

@app.route('/admin/reset', methods=['POST'])
@admin_required
def reset_tournament():
    """Reset all tournament data"""
    data = {
        'players': [],
        'teams': [],
        'matches': [],
        'bracket': {}
    }
    save_data(data)
    return jsonify({'message': 'Tournament reset'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)