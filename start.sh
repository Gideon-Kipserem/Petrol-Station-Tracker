#!/bin/bash

# Navigate to server directory
cd server

# Create database tables
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully!')
"

# Seed the database
python seed.py

# Start the application
gunicorn app:app
