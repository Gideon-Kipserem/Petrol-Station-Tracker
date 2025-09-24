from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from datetime import datetime

db = SQLAlchemy()

class UserSale(db.Model):
    __tablename__ = 'user_sales'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), primary_key=True)
    # contribution = db.Column(db.Integer)  # example user-submitted attribute
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"user_id": self.user_id, "sale_id": self.sale_id, "created_at": self.created_at.isoformat() if self.created_at else None}


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), default='user')  # 'admin', 'manager', 'user'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sales = db.relationship('Sale', secondary='user_sales', back_populates='users')

    def to_dict(self):
        return {
            "id": self.id, 
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Station(db.Model, SerializerMixin):
    __tablename__ = 'stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    location = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(300))
    phone = db.Column(db.String(20))
    manager_name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    pumps = db.relationship('Pump', back_populates='station', cascade='all, delete-orphan')
    staff = db.relationship('Staff', back_populates='station', cascade='all, delete-orphan')

    serialize_rules = ('-pumps.station', '-staff.station')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'address': self.address,
            'phone': self.phone,
            'manager_name': self.manager_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'pumps': [pump.to_dict() for pump in self.pumps],
            'staff': [staff.to_dict() for staff in self.staff]
        }

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 1:
            raise ValueError("Station name must be at least 1 character long")
        existing = Station.query.filter(Station.name == name.strip()).first()
        if existing and existing.id != getattr(self, "id", None):
            raise ValueError("Station name must be unique")
        return name.strip()


class Pump(db.Model, SerializerMixin):
    __tablename__ = "pumps"

    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.String(50), nullable=False)
    fuel_type = db.Column(db.String(50), nullable=False, default='Regular')
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id"))

    station = db.relationship("Station", back_populates="pumps")
    sales = db.relationship("Sale", back_populates="pump", cascade="all, delete-orphan")

    serialize_rules = ('-station.pumps', '-sales.pump')

    @validates('pump_number')
    def validate_pump_number(self, key, value):
        if not value or len(value.strip()) < 1:
            raise ValueError("Pump number cannot be empty")
        
        value = value.strip()
        
        # Allow "Pump X" format (preferred)
        if value.lower().startswith("pump"):
            return value
        
        # Allow numeric formats like "0101", "1", "01", etc. for backward compatibility
        if value.isdigit() or (len(value) >= 3 and all(c.isdigit() for c in value)):
            return value
            
        # Reject invalid formats
        raise ValueError("Pump number must be in format 'Pump X' or numeric format like '0101' or '1'")
        
        return value

    def to_dict(self):
        return {
            "id": self.id,
            "pump_number": self.pump_number,
            "fuel_type": self.fuel_type,
            "station_id": self.station_id,
            "station": {
                "id": self.station.id,
                "name": self.station.name,
                "location": self.station.location
            } if self.station else None
        }


class Sale(db.Model):
    __tablename__ = "sales"
    id = db.Column(db.Integer, primary_key=True)
    fuel_type = db.Column(db.String(50), nullable=False)
    litres = db.Column(db.Float, nullable=False)
    price_per_litre = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    sale_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    pump_id = db.Column(db.Integer, db.ForeignKey("pumps.id"), nullable=False)

    # Relationships
    pump = db.relationship("Pump", back_populates="sales")
    users = db.relationship("User", secondary="user_sales", back_populates="sales")

    def to_dict(self):
        return {
            "id": self.id,
            "fuel_type": self.fuel_type,
            "litres": self.litres,
            "price_per_litre": self.price_per_litre,
            "total_amount": self.total_amount,
            "sale_timestamp": self.sale_timestamp.isoformat(),
            "pump": self.pump.to_dict() if self.pump else None
        }


class Staff(db.Model, SerializerMixin):
    __tablename__ = "staff"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    role = db.Column(db.String(50), nullable=False)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id"))
    email = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(20))
    hire_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    station = db.relationship("Station", back_populates="staff")

    serialize_rules = ("-station.staff",)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'station_id': self.station_id,
            'email': self.email,
            'phone': self.phone,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
            'is_active': self.is_active
        }
