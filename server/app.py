from flask import Flask, request, jsonify
from flask_migrate import Migrate
from config import Config
from models import db, Pump, Sale
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Petrol Station Tracker API is running"})

# ✅ Get all sales
@app.route("/sales", methods=["GET"])
def get_sales():
    sales = Sale.query.all()
    return jsonify([sale.to_dict() for sale in sales]), 200


# ✅ Get a single sale by ID
@app.route("/sales/<int:id>", methods=["GET"])
def get_sale(id):
    sale = Sale.query.get_or_404(id)
    return jsonify(sale.to_dict()), 200  

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

# Update a sale
@app.route("/sales/<int:id>", methods=["PATCH"])
def update_sale(id):
    sale = Sale.query.get_or_404(id)
    data = request.json

    sale.fuel_type = data.get("fuelType", sale.fuel_type)
    sale.litres = data.get("litres", sale.litres)
    sale.price_per_litre = data.get("pricePerLitre", sale.price_per_litre)
    sale.total_amount = sale.litres * sale.price_per_litre
    sale.pump_id = data.get("pumpId", sale.pump_id)

    db.session.commit()
    return jsonify(sale.to_dict())

# Delete a sale
@app.route("/sales/<int:id>", methods=["DELETE"])
def delete_sale(id):
    sale = Sale.query.get_or_404(id)
    db.session.delete(sale)
    db.session.commit()
    return jsonify({"message": "Sale deleted successfully"})

# Get all pumps
@app.route("/pumps", methods=["GET"])
def get_pumps():
    pumps = Pump.query.all()
    return jsonify([pump.to_dict() for pump in pumps])

# Get single pump
@app.route("/pumps/<int:id>", methods=["GET"])
def get_pump(id):
    pump = Pump.query.get_or_404(id)
    return jsonify(pump.to_dict()), 200

# Add pump
@app.route("/pumps", methods=["POST"])
def create_pump():
    data = request.json
    pump = Pump(pump_number=data["pump_number"])
    db.session.add(pump)
    db.session.commit()
    return jsonify(pump.to_dict()), 201

@app.route("/sales/<int:sale_id>/add_user", methods=["POST"])
def add_user_to_sale(sale_id):
    data = request.json
    sale = Sale.query.get_or_404(sale_id)
    user = User.query.get_or_404(data["user_id"])
    contribution = data.get("contribution", 0)

    # Check if already exists
    existing = UserSale.query.filter_by(user_id=user.id, sale_id=sale.id).first()
    if not existing:
        association = UserSale(user_id=user.id, sale_id=sale.id, contribution=contribution)
        db.session.add(association)
        db.session.commit()

    return jsonify(sale.to_dict())


if __name__ == "__main__":
    app.run(debug=True)