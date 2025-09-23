from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import func
from sqlalchemy.orm import validates
from datetime import datetime

from config import db

# Models go here!
class Station(db.Model, SerializerMixin):
    __tablename__ = 'stations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(300))
    phone = db.Column(db.String(20))
    manager_name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    sales = db.relationship('Sale', backref='station', lazy=True, cascade='all, delete-orphan')
    fuel_inventory = db.relationship('FuelInventory', backref='station', lazy=True, cascade='all, delete-orphan')
    staff = db.relationship('Staff', backref='station', lazy=True, cascade='all, delete-orphan')
    pumps = db.relationship('Pump', back_populates='station', lazy=True, cascade='all, delete-orphan')
    
    # Serialization rules
    serialize_rules = ('-sales.station', '-fuel_inventory.station', '-staff.station', '-pumps.station')
    
    def __repr__(self):
        return f'<Station {self.name}>'

class FuelType(db.Model, SerializerMixin):
    __tablename__ = 'fuel_types'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)  # Diesel, Unleaded, Premium
    price_per_litre = db.Column(db.Float, nullable=False)
    color = db.Column(db.String(7), default='#3B82F6')  # Hex color for charts
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    sales = db.relationship('Sale', backref='fuel_type', lazy=True)
    fuel_inventory = db.relationship('FuelInventory', backref='fuel_type', lazy=True)
    
    # Serialization rules
    serialize_rules = ('-sales.fuel_type', '-fuel_inventory.fuel_type')
    
    def __repr__(self):
        return f'<FuelType {self.name}>'

class Staff(db.Model, SerializerMixin):
    __tablename__ = 'staff'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    position = db.Column(db.String(50))  # Manager, Attendant, Cashier
    station_id = db.Column(db.Integer, db.ForeignKey('stations.id'), nullable=False)
    hire_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    sales = db.relationship('Sale', backref='staff_member', lazy=True)
    
    # Serialization rules
    serialize_rules = ('-sales.staff_member', '-station.staff')
    
    def __repr__(self):
        return f'<Staff {self.name}>'

class Sale(db.Model, SerializerMixin):
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    station_id = db.Column(db.Integer, db.ForeignKey('stations.id'), nullable=False)
    fuel_type_id = db.Column(db.Integer, db.ForeignKey('fuel_types.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    pump_number = db.Column(db.Integer, nullable=False)
    litres = db.Column(db.Float, nullable=False)
    price_per_litre = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(20), default='Cash')  # Cash, Card, Mobile
    sale_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Serialization rules
    serialize_rules = ('-station.sales', '-fuel_type.sales', '-staff_member.sales')
    
    def __repr__(self):
        return f'<Sale {self.id}: {self.litres}L @ {self.total_amount}>'

class FuelInventory(db.Model, SerializerMixin):
    __tablename__ = 'fuel_inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    station_id = db.Column(db.Integer, db.ForeignKey('stations.id'), nullable=False)
    fuel_type_id = db.Column(db.Integer, db.ForeignKey('fuel_types.id'), nullable=False)
    current_stock = db.Column(db.Float, nullable=False)  # Current litres in tank
    capacity = db.Column(db.Float, nullable=False)  # Tank capacity
    minimum_threshold = db.Column(db.Float, default=1000)  # Alert threshold
    last_refill_date = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Serialization rules
    serialize_rules = ('-station.fuel_inventory', '-fuel_type.fuel_inventory')
    
    @property
    def stock_percentage(self):
        return (self.current_stock / self.capacity) * 100 if self.capacity > 0 else 0
    
    @property
    def is_low_stock(self):
        return self.current_stock <= self.minimum_threshold
    
    def __repr__(self):
        return f'<FuelInventory {self.station.name} - {self.fuel_type.name}: {self.current_stock}L>'

 
    serialize_rules = ('-pumps.station', '-staff.station')

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 1:
            raise ValueError("Station name must be at least 1 character long")
        
        existing = Station.query.filter(Station.name == name.strip()).first()

        if existing and existing.id != getattr(self, "id", None):
            raise ValueError("Station name must be unique")
        return name.strip()



class Pump(db.Model, SerializerMixin):
    __tablename__ = 'pumps'

    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.String, nullable=False)
    fuel_type = db.Column(db.String, nullable=False)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id"))  

    station = db.relationship("Station", back_populates="pumps")

    serialize_rules = ('-station.pumps',)

    @validates('pump_number')
    def validate_pump_number(self, key, value):
        if not value.lower().startswith("pump"):
            raise ValueError("Pump_number must start with 'Pump' e.g 'Pump 3'" )
        return value



