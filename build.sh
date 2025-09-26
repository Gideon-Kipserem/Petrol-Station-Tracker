#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Navigate to server directory
cd server

# Initialize database and run migrations
flask db upgrade

# Seed the database with initial data
python seed.py

echo "Build completed successfully!"