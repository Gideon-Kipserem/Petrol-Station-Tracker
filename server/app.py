from flask import Flask, request, jsonify
from flask_migrate import Migrate
from config import Config
from models import db, User, UserSale, Pump, Sale, Station, Staff
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

CORS(app)

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user or not current_user.is_active:
                return jsonify({'message': 'Token is invalid'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@app.route("/")
def home():
    return jsonify({"message": "Petrol Station Tracker API is running"})

# AUTHENTICATION ENDPOINTS
@app.route("/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Name, email, and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            name=data['name'],
            email=data['email'],
            password_hash=hashed_password,
            role=data.get('role', 'user')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': new_user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'message': 'Account is deactivated'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@app.route("/auth/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@app.route("/auth/logout", methods=["POST"])
@token_required
def logout(current_user):
    # In a real app, you might want to blacklist the token
    return jsonify({'message': 'Logged out successfully'}), 200

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
    pump = Pump(
        pump_number=data["pump_number"],
        fuel_type=data.get("fuel_type", "Regular"),
        station_id=data.get("station_id")
    )
    db.session.add(pump)
    db.session.commit()
    return jsonify(pump.to_dict()), 201

# Update pump
@app.route("/pumps/<int:id>", methods=["PATCH"])
def update_pump(id):
    pump = Pump.query.get_or_404(id)
    data = request.json
    
    if "pump_number" in data:
        pump.pump_number = data["pump_number"]
    if "fuel_type" in data:
        pump.fuel_type = data["fuel_type"]
    if "station_id" in data:
        pump.station_id = data["station_id"]
    
    db.session.commit()
    return jsonify(pump.to_dict())

# Delete pump
@app.route("/pumps/<int:id>", methods=["DELETE"])
def delete_pump(id):
    pump = Pump.query.get_or_404(id)
    db.session.delete(pump)
    db.session.commit()
    return "", 204

@app.route("/sales/<int:sale_id>/add_user", methods=["POST"])
def add_user_to_sale(sale_id):
    data = request.json
    sale = Sale.query.get_or_404(sale_id)
    user = User.query.get_or_404(data["user_id"])
    # contribution = data.get("contribution", 0)

    # Check if already exists
    existing = UserSale.query.filter_by(user_id=user.id, sale_id=sale.id).first()
    if not existing:
        association = UserSale(user_id=user.id, sale_id=sale.id)
        db.session.add(association)
        db.session.commit()

    return jsonify(sale.to_dict())


# STATIONS API ENDPOINTS
@app.route("/stations", methods=["GET"])
def get_stations():
    stations = Station.query.all()
    return jsonify([station.to_dict() for station in stations])

@app.route("/stations/<int:id>", methods=["GET"])
def get_station(id):
    station = Station.query.get_or_404(id)
    return jsonify(station.to_dict())

@app.route("/stations", methods=["POST"])
def create_station():
    data = request.get_json()
    new_station = Station(name=data["name"], location=data["location"])
    db.session.add(new_station)
    db.session.commit()
    return jsonify(new_station.to_dict()), 201

@app.route("/stations/<int:id>", methods=["PATCH"])
def update_station(id):
    station = Station.query.get_or_404(id)
    data = request.get_json()
    if "name" in data:
        station.name = data["name"]
    if "location" in data:
        station.location = data["location"]
    db.session.commit()
    return jsonify(station.to_dict())

@app.route("/stations/<int:id>", methods=["DELETE"])
def delete_station(id):
    station = Station.query.get_or_404(id)
    db.session.delete(station)
    db.session.commit()
    return jsonify({"message": "Station deleted successfully"}), 200


# STAFF API ENDPOINTS
@app.route("/staff", methods=["GET"])
def get_staff():
    staff = Staff.query.all()
    return jsonify([s.to_dict() for s in staff])

@app.route("/staff/<int:id>", methods=["GET"])
def get_staff_member(id):
    staff = Staff.query.get_or_404(id)
    return jsonify(staff.to_dict())

@app.route("/staff", methods=["POST"])
def create_staff():
    data = request.get_json()
    staff = Staff(
        name=data["name"],
        role=data["role"],
        station_id=data["station_id"],
    )
    db.session.add(staff)
    db.session.commit()
    return jsonify(staff.to_dict()), 201

@app.route("/staff/<int:id>", methods=["PATCH"])
def update_staff(id):
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    if "name" in data:
        staff.name = data["name"]
    if "role" in data:
        staff.role = data["role"]
    if "station_id" in data:
        staff.station_id = data["station_id"]
    db.session.commit()
    return jsonify(staff.to_dict())

@app.route("/staff/<int:id>", methods=["DELETE"])
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return "", 204


# DASHBOARD API ENDPOINT
@app.route("/dashboard", methods=["GET"])
def get_dashboard_data():
    try:
        # Get basic counts
        total_stations = Station.query.filter_by(is_active=True).count()
        total_staff = Staff.query.filter_by(is_active=True).count()
        total_pumps = Pump.query.count()
        total_sales = Sale.query.count()
        
        # Get recent sales (last 10)
        recent_sales = Sale.query.order_by(Sale.sale_timestamp.desc()).limit(10).all()
        
        # Calculate total revenue and litres
        total_revenue = db.session.query(db.func.sum(Sale.total_amount)).scalar() or 0
        total_litres = db.session.query(db.func.sum(Sale.litres)).scalar() or 0
        
        # Calculate average price per litre
        avg_price_per_litre = db.session.query(db.func.avg(Sale.price_per_litre)).scalar() or 0
        
        # Get stations with their pump and staff counts
        stations_data = []
        stations = Station.query.filter_by(is_active=True).all()
        for station in stations:
            stations_data.append({
                'name': station.name,
                'pumps': len(station.pumps),
                'staff': len(station.staff),
                'sales': len([sale for pump in station.pumps for sale in pump.sales])
            })
        
        # Fuel type distribution (mock for now since we don't have inventory)
        fuel_types = ['Regular', 'Premium', 'Diesel']
        fuel_type_data = []
        for fuel_type in fuel_types:
            pump_count = Pump.query.filter_by(fuel_type=fuel_type).count()
            fuel_type_data.append({
                'name': fuel_type,
                'value': pump_count,
                'color': '#3B82F6' if fuel_type == 'Regular' else '#10B981' if fuel_type == 'Premium' else '#F59E0B'
            })
        
        dashboard_data = {
            'totalRevenue': float(total_revenue),
            'totalLitres': float(total_litres) if total_litres else 0,
            'totalStations': total_stations,
            'totalStaff': total_staff,
            'totalPumps': total_pumps,
            'todaySales': total_sales,
            'avgPricePerLitre': float(avg_price_per_litre) if avg_price_per_litre else 0,
            'recentSales': [sale.to_dict() for sale in recent_sales],
            'fuelTypeData': fuel_type_data,
            'topStations': stations_data[:5],  # Top 5 stations
            'lowStockAlerts': []  # Empty for now, can be populated later
        }
        
        return jsonify(dashboard_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(port=5555, debug=True)