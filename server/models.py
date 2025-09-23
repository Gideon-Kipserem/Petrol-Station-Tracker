from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

from config import db

# Models go here!
db = SQLAlchemy()


class Pump(db.Model, SerializerMixin):
    __tablename__ = 'pumps'
    
    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.String(10), nullable=False)
    fuel_type = db.Column(db.String(50), nullable=False)
    
    # Relationships
    sales = db.relationship('Sale', backref='pump', cascade='all, delete-orphan')
    
    serialize_rules = ('-sales.pump',)

class Sale(db.Model, SerializerMixin):
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    fuel_type = db.Column(db.String(50), nullable=False)
    litres = db.Column(db.Float, nullable=False)
    price_per_litre = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    pump_id = db.Column(db.Integer, db.ForeignKey('pumps.id'), nullable=False)
    
    serialize_rules = ('-pump.sales',)

    def __repr__(self):
        return f'<Sale {self.fuel_type} - {self.litres}L>'
