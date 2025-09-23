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

# Getting all sales
@app.route("/sales", methods=["GET"])
def get_sales():
    sales = Sale.query.all()
    return jsonify([sale.to_dict() for sale in sales])   

# Adding a new sale
@app.route("/sales", methods=["POST"])
def create_sale():
    data = request.json
    sale = Sale(
        fuel_type=data["fuelType"],
        litres=data["litres"],
        price_per_litre=data["pricePerLitre"],
        total_amount=data["litres"] * data["pricePerLitre"],
        pump_id=data["pumpId"]
    )
    db.session.add(sale)
    db.session.commit()
    return jsonify(sale.to_dict()), 201 
