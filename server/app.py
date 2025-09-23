from flask import Flask, request, jsonify
from config import db, Config
from models import Pump, Sale
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

@app.route('/')
def home():
    return {'message': 'Petrol Station Tracker API - Sales Focus'}

@app.route('/sales', methods=['GET', 'POST'])
def handle_sales():
    if request.method == 'GET':
        try:
            sales = Sale.query.order_by(Sale.timestamp.desc()).all()
            return jsonify([sale.to_dict() for sale in sales]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    elif request.method == 'POST':
        try:
            data = request.get_json()

            # Create new sale
            sale = Sale(
                fuel_type=data.get('fuelType'),
                litres=float(data.get('litres')),
                price_per_litre=float(data.get('pricePerLitre')),
                total_amount=float(data.get('litres')) * float(data.get('pricePerLitre')),
                pump_id=int(data.get('pumpId'))
            )
            db.session.add(sale)
            db.session.commit()
            
            return jsonify(sale.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400