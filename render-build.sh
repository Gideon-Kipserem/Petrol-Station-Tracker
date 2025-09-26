#!/usr/bin/env bash
set -o errexit  # Exit on error

pip install -r requirements.txt

# Run migrations automatically
flask db upgrade || echo "No migrations to apply"
