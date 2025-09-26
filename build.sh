#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
cd server
flask db upgrade

# Seed the database if needed
python seed.py