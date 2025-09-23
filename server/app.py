from flask import Flask, request, jsonify
from flask_migrate import Migrate
from config import Config
from models import db, Pump, Sale

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def home():
    return jsonify({"message": "Petrol Station Tracker API is running"})
