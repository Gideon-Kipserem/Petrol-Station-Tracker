from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class UserSale(db.Model):
    __tablename__ = 'user_sales'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), primary_key=True)
    contribution = db.Column(db.Integer)  # example user-submitted attribute
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
     return {"user_id": self.user_id, "sale_id": self.sale_id, "contribution": self.contribution}


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    sales = db.relationship('Sale', secondary='user_sales', back_populates='users')

    def to_dict(self):
     return {"id": self.id, "name": self.name}


class Pump(db.Model):
    __tablename__ = "pumps"

    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.String(50), nullable=False, unique=True)

    sales = db.relationship("Sale", backref="pump", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "pump_number": self.pump_number
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
